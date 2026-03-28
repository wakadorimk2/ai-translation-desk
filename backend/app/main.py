import os
from contextlib import asynccontextmanager

from fastapi import FastAPI, Request
from fastapi.middleware.cors import CORSMiddleware
from fastapi.responses import FileResponse, JSONResponse
from starlette.middleware.sessions import SessionMiddleware

from app.config import settings
from app.routers import auth, fragments, generate, question_logs, sessions
from app.vectordb.factory import create_vector_store

STATIC_DIR = os.environ.get("STATIC_DIR", "/app/static")

# Paths that skip authentication
AUTH_SKIP_PREFIXES = ("/api/v1/health", "/api/v1/auth/login")
STATIC_EXTENSIONS = (
    ".js", ".css", ".html", ".png", ".svg", ".ico", ".woff2",
    ".webmanifest", ".json", ".txt",
)


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.vector_store = create_vector_store(settings)
    yield


app = FastAPI(title="AI Translation Desk", version="0.1.0", lifespan=lifespan)


@app.middleware("http")
async def auth_middleware(request: Request, call_next):
    path = request.url.path

    # Skip auth for health check and login
    if any(path.startswith(p) for p in AUTH_SKIP_PREFIXES):
        return await call_next(request)

    # Skip auth for static files (PWA assets, etc.)
    if path != "/" and (
        any(path.endswith(ext) for ext in STATIC_EXTENSIONS)
        or path.startswith("/assets/")
        or path in ("/sw.js", "/registerSW.js")
        or path.startswith("/workbox-")
    ):
        return await call_next(request)

    # Check session
    if not request.session.get("authenticated"):
        if path.startswith("/api/"):
            return JSONResponse(status_code=401, content={"detail": "Not authenticated"})
        # For non-API requests, serve index.html (let frontend handle redirect to login)
        return await call_next(request)

    return await call_next(request)


# Middleware order matters: last added = outermost (runs first)
# Execution order: CORS → Session → auth_middleware → routes
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)
app.add_middleware(SessionMiddleware, secret_key=settings.session_secret)


app.include_router(auth.router, prefix="/api/v1")
app.include_router(fragments.router, prefix="/api/v1")
app.include_router(sessions.router, prefix="/api/v1")
app.include_router(question_logs.router, prefix="/api/v1")
app.include_router(generate.router, prefix="/api/v1")


@app.get("/api/v1/health")
def health():
    return {"status": "ok"}


# Serve frontend static files (production only)
if os.path.isdir(STATIC_DIR):

    @app.get("/{full_path:path}")
    async def serve_spa(full_path: str):
        file_path = os.path.join(STATIC_DIR, full_path)
        if full_path and os.path.isfile(file_path):
            return FileResponse(file_path)
        return FileResponse(os.path.join(STATIC_DIR, "index.html"))
