from contextlib import asynccontextmanager

from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from app.config import settings
from app.routers import fragments, generate, question_logs, sessions
from app.vectordb.factory import create_vector_store


@asynccontextmanager
async def lifespan(app: FastAPI):
    app.state.vector_store = create_vector_store(settings)
    yield


app = FastAPI(title="AI Translation Desk", version="0.1.0", lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

app.include_router(fragments.router, prefix="/api/v1")
app.include_router(sessions.router, prefix="/api/v1")
app.include_router(question_logs.router, prefix="/api/v1")
app.include_router(generate.router, prefix="/api/v1")


@app.get("/api/v1/health")
def health():
    return {"status": "ok"}
