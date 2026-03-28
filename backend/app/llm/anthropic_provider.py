import anthropic

from app.llm.base import LLMProvider

SYSTEM_PROMPT = """あなたは面接対策アシスタントです。
与えられたフラグメント情報をもとに、面接の質問に対する回答案を作成してください。

## 指示
- 結論ファーストで回答してください
- 具体的なエピソードを含めてください
- 1〜2分で話せる長さにしてください
- 自然な話し言葉にしてください
- フラグメントの情報を統合して、一つのまとまった回答にしてください"""


class AnthropicProvider(LLMProvider):
    def __init__(self, api_key: str, model: str):
        self._client = anthropic.Anthropic(api_key=api_key)
        self._model = model

    def generate_answer(
        self,
        question: str,
        fragments: list[dict],
        context: str | None = None,
    ) -> str:
        fragments_text = ""
        for i, f in enumerate(fragments, 1):
            fragments_text += f"\n### フラグメント {i}: {f.get('title', '')}\n"
            if f.get("summary"):
                fragments_text += f"概要: {f['summary']}\n"
            if f.get("detail"):
                fragments_text += f"詳細: {f['detail']}\n"
            if f.get("lesson"):
                fragments_text += f"学び: {f['lesson']}\n"

        user_msg = f"## 質問\n{question}\n\n## 参考フラグメント\n{fragments_text}"
        if context:
            user_msg += f"\n\n## 補足コンテキスト\n{context}"

        response = self._client.messages.create(
            model=self._model,
            max_tokens=1024,
            system=SYSTEM_PROMPT,
            messages=[{"role": "user", "content": user_msg}],
        )
        return response.content[0].text
