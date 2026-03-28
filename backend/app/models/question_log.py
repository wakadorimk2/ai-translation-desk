import datetime

from sqlalchemy import DateTime, ForeignKey, JSON, String, Text, func
from sqlalchemy.orm import Mapped, mapped_column, relationship

from app.database import Base


class QuestionLog(Base):
    __tablename__ = "question_logs"

    id: Mapped[int] = mapped_column(primary_key=True)
    session_id: Mapped[int] = mapped_column(ForeignKey("sessions.id"))
    question_text: Mapped[str] = mapped_column(Text)
    question_type: Mapped[str] = mapped_column(String(50), default="")
    suggested_fragment_ids: Mapped[list] = mapped_column(JSON, default=list)
    selected_fragment_ids: Mapped[list] = mapped_column(JSON, default=list)
    drafted_answer: Mapped[str] = mapped_column(Text, default="")
    actual_answer_memo: Mapped[str] = mapped_column(Text, default="")
    stuck_points: Mapped[str] = mapped_column(Text, default="")
    created_at: Mapped[datetime.datetime] = mapped_column(
        DateTime, server_default=func.now()
    )

    session = relationship("InterviewSession", back_populates="question_logs")
