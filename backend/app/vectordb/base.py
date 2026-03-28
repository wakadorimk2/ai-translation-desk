from abc import ABC, abstractmethod


class VectorStore(ABC):
    @abstractmethod
    def upsert(self, fragment_id: int, text: str, metadata: dict) -> None:
        ...

    @abstractmethod
    def search(self, query: str, top_k: int = 5) -> list[dict]:
        """Returns list of {"fragment_id": int, "score": float}."""
        ...

    @abstractmethod
    def delete(self, fragment_id: int) -> None:
        ...
