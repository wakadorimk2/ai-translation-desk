import os

from app.config import Settings
from app.vectordb.base import VectorStore
from app.vectordb.chroma_store import ChromaVectorStore


def create_vector_store(config: Settings) -> VectorStore:
    os.makedirs(config.chroma_persist_dir, exist_ok=True)
    return ChromaVectorStore(persist_dir=config.chroma_persist_dir)
