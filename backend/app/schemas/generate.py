from pydantic import BaseModel

from app.schemas.fragment import FragmentResponse


class SearchRequest(BaseModel):
    question: str
    top_k: int = 5


class SearchResult(BaseModel):
    fragment: FragmentResponse
    score: float


class SearchResponse(BaseModel):
    results: list[SearchResult]


class DraftRequest(BaseModel):
    question: str
    fragment_ids: list[int]
    context: str | None = None


class DraftResponse(BaseModel):
    drafted_answer: str
