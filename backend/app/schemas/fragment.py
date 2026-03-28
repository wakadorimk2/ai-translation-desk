from datetime import datetime

from pydantic import BaseModel


class FragmentBase(BaseModel):
    title: str
    summary: str = ""
    detail: str = ""
    lesson: str = ""
    tags: list[str] = []
    source_company: str = ""


class FragmentCreate(FragmentBase):
    pass


class FragmentUpdate(FragmentBase):
    pass


class FragmentResponse(FragmentBase):
    id: int
    created_at: datetime
    updated_at: datetime

    model_config = {"from_attributes": True}
