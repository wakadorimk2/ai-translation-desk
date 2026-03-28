from app.config import Settings
from app.llm.base import LLMProvider


def create_llm_provider(config: Settings) -> LLMProvider:
    if config.llm_provider == "anthropic":
        from app.llm.anthropic_provider import AnthropicProvider

        return AnthropicProvider(
            api_key=config.anthropic_api_key, model=config.anthropic_model
        )
    elif config.llm_provider == "openai":
        raise NotImplementedError("OpenAI provider not yet implemented")
    raise ValueError(f"Unknown LLM provider: {config.llm_provider}")
