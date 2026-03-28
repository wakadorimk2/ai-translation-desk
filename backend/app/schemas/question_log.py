from datetime import datetime

from pydantic import BaseModel


class QuestionLogCreate(BaseModel):
    question_text: str
    question_type: str = ""
    suggested_fragment_ids: list[int] = []
    selected_fragment_ids: list[int] = []
    drafted_answer: str = ""


class QuestionLogUpdate(BaseModel):
    actual_answer_memo: str = ""
    stuck_points: str = ""


class QuestionLogResponse(BaseModel):
    id: int
    session_id: int
    question_text: str
    question_type: str
    suggested_fragment_ids: list[int]
    selected_fragment_ids: list[int]
    drafted_answer: str
    actual_answer_memo: str
    stuck_points: str
    created_at: datetime

    model_config = {"from_attributes": True}
