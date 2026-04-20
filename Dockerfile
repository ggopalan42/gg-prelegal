# Stage 1: Build Next.js static export
FROM node:22-alpine AS frontend-builder
WORKDIR /app/frontend
COPY frontend/package.json frontend/package-lock.json ./
RUN npm ci
COPY frontend/ ./
RUN npm run build

# Stage 2: Run FastAPI serving the static frontend
FROM python:3.12-slim
WORKDIR /app

RUN pip install uv

COPY backend/pyproject.toml backend/uv.lock ./
RUN uv sync --frozen --no-dev

COPY backend/ ./
COPY catalog.json ./catalog.json
COPY templates/ ./templates/
COPY --from=frontend-builder /app/frontend/out ./static

VOLUME ["/data"]
EXPOSE 8000

ENV PATH="/app/.venv/bin:$PATH"

CMD ["uvicorn", "main:app", "--host", "0.0.0.0", "--port", "8000"]
