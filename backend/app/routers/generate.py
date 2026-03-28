from fastapi import APIRouter, Depends, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.llm.factory import create_llm_provider
from app.config import settings
from app.models.fragment import Fragment
from app.schemas.fragment import FragmentResponse
from app.schemas.generate import (
    DraftRequest,
    DraftResponse,
    SearchRequest,
    SearchResponse,
    SearchResult,
)

router = APIRouter(prefix="/generate", tags=["generate"])


@router.post("/search", response_model=SearchResponse)
def search_fragments(
    body: SearchRequest, request: Request, db: Session = Depends(get_db)
):
    vs = request.app.state.vector_store
    results = vs.search(body.question, top_k=body.top_k)
    search_results = []
    for r in results:
        frag = db.get(Fragment, r["fragment_id"])
        if frag:
            search_results.append(
                SearchResult(
                    fragment=FragmentResponse.model_validate(frag),
                    score=r["score"],
                )
            )
    return SearchResponse(results=search_results)


@router.post("/draft", response_model=DraftResponse)
def generate_draft(body: DraftRequest, db: Session = Depends(get_db)):
    fragments = []
    for fid in body.fragment_ids:
        frag = db.get(Fragment, fid)
        if frag:
            fragments.append(
                {
                    "title": frag.title,
                    "summary": frag.summary,
                    "detail": frag.detail,
                    "lesson": frag.lesson,
                }
            )
    llm = create_llm_provider(settings)
    answer = llm.generate_answer(body.question, fragments, body.context)
    return DraftResponse(drafted_answer=answer)
