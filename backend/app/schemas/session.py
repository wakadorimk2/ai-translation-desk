from datetime import datetime

from pydantic import BaseModel


class SessionCreate(BaseModel):
    target_company: str = ""
    context: str = ""


class SessionResponse(BaseModel):
    id: int
    target_company: str
    context: str
    created_at: datetime

    model_config = {"from_attributes": True}
