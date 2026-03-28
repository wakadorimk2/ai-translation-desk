# AI Translation Desk - 面接支援プロトタイプ

面接で「頭にはあるのに組み立てて話せない」問題を支援するプロトタイプ。
質問入力 → 関連断片検索 → 回答草案生成 → 振り返りログ の 1 ループを提供する。

## セットアップ

### 必要な環境

- Python 3.10+
- Node.js 18+
- pnpm

### インストール

```bash
# Backend
cd backend
pip install fastapi "uvicorn[standard]" "sqlalchemy>=2.0" alembic pydantic-settings chromadb sentence-transformers anthropic

# Frontend
cd ../frontend
pnpm install
```

### 初期設定

```bash
# Backend ディレクトリで
cd backend

# DB マイグレーション
alembic upgrade head

# サンプルデータ投入（20件の断片カード）
python3 -m app.seed

# 環境変数（草案生成に必要）
cp ../.env.example .env
# .env を編集して ANTHROPIC_API_KEY を設定
```

### 起動

```bash
# ターミナル 1: Backend
cd backend
uvicorn app.main:app --reload --port 8000

# ターミナル 2: Frontend
cd frontend
pnpm dev --port 5173
```

ブラウザで http://localhost:5173 を開く。

## 使い方

### 1. 断片カード管理（カードタブ）
- 面接で使えるエピソードや回答の断片を登録
- タイトル / 概要（結論） / 詳細（具体例） / 学び の構造で記録
- タグを付けて分類

### 2. 面接サポート（サポートタブ）
- 質問を入力して検索
- ベクトル検索で関連する断片カードが候補表示される
- カードを選択して「回答草案を生成」
- LLM が断片を統合した回答草案を生成

### 3. 振り返り（振り返りタブ）
- セッション（企業ごと）を作成
- 各質問のログに実際の回答メモと詰まった点を記録

## 技術構成

- **Frontend**: Vite + React + TypeScript + Tailwind CSS
- **Backend**: Python + FastAPI
- **DB**: SQLite
- **Vector DB**: ChromaDB (sentence-transformers/all-MiniLM-L6-v2)
- **LLM**: Anthropic Claude（抽象化済み、差し替え可能）

## 注意

- `sentence-transformers` の初回起動時にモデル（~90MB）がダウンロードされます
- 草案生成には `ANTHROPIC_API_KEY` の設定が必要です
- ベクトル検索はキー不要でローカル完結します
