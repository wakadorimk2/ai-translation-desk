from abc import ABC, abstractmethod


class LLMProvider(ABC):
    @abstractmethod
    def generate_answer(
        self,
        question: str,
        fragments: list[dict],
        context: str | None = None,
    ) -> str:
        """Generate a draft interview answer."""
        ...
