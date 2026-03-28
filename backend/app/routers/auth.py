import secrets

from fastapi import APIRouter, Request
from fastapi.responses import JSONResponse
from pydantic import BaseModel

from app.config import settings

router = APIRouter(prefix="/auth", tags=["auth"])


class LoginRequest(BaseModel):
    username: str
    password: str


@router.post("/login")
async def login(body: LoginRequest, request: Request):
    username_ok = secrets.compare_digest(body.username, settings.auth_username)
    password_ok = secrets.compare_digest(body.password, settings.auth_password)
    if not (username_ok and password_ok):
        return JSONResponse(status_code=401, content={"detail": "Invalid credentials"})
    request.session["authenticated"] = True
    return {"status": "ok"}


@router.post("/logout")
async def logout(request: Request):
    request.session.clear()
    return {"status": "ok"}


@router.get("/me")
async def me(request: Request):
    if request.session.get("authenticated"):
        return {"authenticated": True}
    return JSONResponse(status_code=401, content={"authenticated": False})
