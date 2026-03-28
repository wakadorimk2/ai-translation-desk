import chromadb
from chromadb.utils.embedding_functions import SentenceTransformerEmbeddingFunction

from app.vectordb.base import VectorStore


class ChromaVectorStore(VectorStore):
    def __init__(self, persist_dir: str):
        self._client = chromadb.PersistentClient(path=persist_dir)
        self._ef = SentenceTransformerEmbeddingFunction(
            model_name="all-MiniLM-L6-v2"
        )
        self._collection = self._client.get_or_create_collection(
            name="fragments",
            embedding_function=self._ef,
        )

    def upsert(self, fragment_id: int, text: str, metadata: dict) -> None:
        safe_meta = {k: ",".join(v) if isinstance(v, list) else str(v) for k, v in metadata.items()}
        self._collection.upsert(
            ids=[str(fragment_id)],
            documents=[text],
            metadatas=[safe_meta],
        )

    def search(self, query: str, top_k: int = 5) -> list[dict]:
        results = self._collection.query(
            query_texts=[query],
            n_results=top_k,
        )
        items = []
        if results["ids"] and results["ids"][0]:
            ids = results["ids"][0]
            distances = results["distances"][0] if results["distances"] else [0.0] * len(ids)
            for doc_id, dist in zip(ids, distances):
                items.append(
                    {"fragment_id": int(doc_id), "score": 1.0 - dist}
                )
        return items

    def delete(self, fragment_id: int) -> None:
        try:
            self._collection.delete(ids=[str(fragment_id)])
        except Exception:
            pass
