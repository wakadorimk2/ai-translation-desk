from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.session import InterviewSession
from app.schemas.session import SessionCreate, SessionResponse

router = APIRouter(tags=["sessions"])


@router.get("/sessions", response_model=list[SessionResponse])
def list_sessions(db: Session = Depends(get_db)):
    return (
        db.query(InterviewSession)
        .order_by(InterviewSession.created_at.desc())
        .all()
    )


@router.post("/sessions", response_model=SessionResponse, status_code=201)
def create_session(body: SessionCreate, db: Session = Depends(get_db)):
    session = InterviewSession(**body.model_dump())
    db.add(session)
    db.commit()
    db.refresh(session)
    return session


@router.get("/sessions/{session_id}", response_model=SessionResponse)
def get_session(session_id: int, db: Session = Depends(get_db)):
    session = db.get(InterviewSession, session_id)
    if not session:
        raise HTTPException(404, "Session not found")
    return session
