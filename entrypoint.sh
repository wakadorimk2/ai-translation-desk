#!/bin/bash
set -e
cd /app/backend
export PYTHONPATH=/app/backend
alembic upgrade head
exec uvicorn app.main:app --host 0.0.0.0 --port ${PORT:-8000}
