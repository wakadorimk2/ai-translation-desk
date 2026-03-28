from fastapi import APIRouter, Depends, HTTPException, Request
from sqlalchemy.orm import Session

from app.database import get_db
from app.models.fragment import Fragment
from app.schemas.fragment import FragmentCreate, FragmentResponse, FragmentUpdate

router = APIRouter(tags=["fragments"])


def _fragment_text(f: Fragment) -> str:
    parts = [f.title, f.summary, f.detail, f.lesson]
    return "\n".join(p for p in parts if p)


@router.get("/fragments", response_model=list[FragmentResponse])
def list_fragments(tag: str | None = None, db: Session = Depends(get_db)):
    q = db.query(Fragment).order_by(Fragment.updated_at.desc())
    if tag:
        q = q.filter(Fragment.tags.contains(tag))
    return q.all()


@router.post("/fragments", response_model=FragmentResponse, status_code=201)
def create_fragment(
    body: FragmentCreate, request: Request, db: Session = Depends(get_db)
):
    frag = Fragment(**body.model_dump())
    db.add(frag)
    db.commit()
    db.refresh(frag)
    vs = request.app.state.vector_store
    vs.upsert(frag.id, _fragment_text(frag), {"tags": frag.tags})
    return frag


@router.get("/fragments/{fragment_id}", response_model=FragmentResponse)
def get_fragment(fragment_id: int, db: Session = Depends(get_db)):
    frag = db.get(Fragment, fragment_id)
    if not frag:
        raise HTTPException(404, "Fragment not found")
    return frag


@router.put("/fragments/{fragment_id}", response_model=FragmentResponse)
def update_fragment(
    fragment_id: int,
    body: FragmentUpdate,
    request: Request,
    db: Session = Depends(get_db),
):
    frag = db.get(Fragment, fragment_id)
    if not frag:
        raise HTTPException(404, "Fragment not found")
    for k, v in body.model_dump().items():
        setattr(frag, k, v)
    db.commit()
    db.refresh(frag)
    vs = request.app.state.vector_store
    vs.upsert(frag.id, _fragment_text(frag), {"tags": frag.tags})
    return frag


@router.delete("/fragments/{fragment_id}", status_code=204)
def delete_fragment(
    fragment_id: int, request: Request, db: Session = Depends(get_db)
):
    frag = db.get(Fragment, fragment_id)
    if not frag:
        raise HTTPException(404, "Fragment not found")
    db.delete(frag)
    db.commit()
    vs = request.app.state.vector_store
    vs.delete(frag.id)
