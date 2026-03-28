from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.question_log import QuestionLog
from app.schemas.question_log import (
    QuestionLogCreate,
    QuestionLogResponse,
    QuestionLogUpdate,
)

router = APIRouter(tags=["question_logs"])


@router.get(
    "/sessions/{session_id}/logs", response_model=list[QuestionLogResponse]
)
def list_logs(session_id: int, db: Session = Depends(get_db)):
    return (
        db.query(QuestionLog)
        .filter(QuestionLog.session_id == session_id)
        .order_by(QuestionLog.created_at.desc())
        .all()
    )


@router.post(
    "/sessions/{session_id}/logs",
    response_model=QuestionLogResponse,
    status_code=201,
)
def create_log(
    session_id: int, body: QuestionLogCreate, db: Session = Depends(get_db)
):
    log = QuestionLog(session_id=session_id, **body.model_dump())
    db.add(log)
    db.commit()
    db.refresh(log)
    return log


@router.put("/logs/{log_id}", response_model=QuestionLogResponse)
def update_log(
    log_id: int, body: QuestionLogUpdate, db: Session = Depends(get_db)
):
    log = db.get(QuestionLog, log_id)
    if not log:
        raise HTTPException(404, "Log not found")
    for k, v in body.model_dump(exclude_unset=True).items():
        setattr(log, k, v)
    db.commit()
    db.refresh(log)
    return log
