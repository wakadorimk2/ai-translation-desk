.PHONY: dev dev-backend dev-frontend setup db-migrate db-seed

dev:
	@echo "Starting backend and frontend..."
	$(MAKE) dev-backend & $(MAKE) dev-frontend & wait

dev-backend:
	cd backend && uvicorn app.main:app --reload --port 8000

dev-frontend:
	cd frontend && pnpm dev --port 5173

setup:
	cd backend && pip install fastapi "uvicorn[standard]" "sqlalchemy>=2.0" alembic pydantic-settings chromadb sentence-transformers anthropic
	cd frontend && pnpm install

db-migrate:
	cd backend && alembic upgrade head

db-seed:
	cd backend && python3 -m app.seed
