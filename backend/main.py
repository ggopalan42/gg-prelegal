import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse, JSONResponse

from models import ChatRequest, ChatResponse
from chat import chat

load_dotenv(Path(__file__).parent.parent / ".env")

BASE_DIR = Path(__file__).parent
STATIC_DIR = BASE_DIR / "static"
TEMPLATES_DIR = BASE_DIR / "templates"


def get_db_path() -> Path:
    data_dir = Path("/data")
    try:
        data_dir.mkdir(parents=True, exist_ok=True)
        return data_dir / "prelegal.db"
    except OSError:
        return Path(__file__).parent / "prelegal.db"


def init_db():
    db_path = get_db_path()
    conn = sqlite3.connect(db_path)
    conn.execute("""
        CREATE TABLE IF NOT EXISTS users (
            id INTEGER PRIMARY KEY AUTOINCREMENT,
            email TEXT UNIQUE NOT NULL,
            name TEXT NOT NULL,
            created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
        )
    """)
    conn.commit()
    conn.close()


@asynccontextmanager
async def lifespan(app: FastAPI):
    init_db()
    yield


app = FastAPI(lifespan=lifespan)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)


@app.post("/api/chat", response_model=ChatResponse)
async def chat_endpoint(request: ChatRequest):
    try:
        result = chat(request.messages, request.doc_type)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


@app.get("/api/catalog")
async def get_catalog():
    catalog_path = BASE_DIR / "catalog.json"
    return FileResponse(catalog_path, media_type="application/json")


@app.get("/api/template/{filename}")
async def get_template(filename: str):
    if not filename.endswith(".md"):
        raise HTTPException(status_code=400, detail="Invalid filename")
    resolved = (TEMPLATES_DIR / filename).resolve()
    if not resolved.is_relative_to(TEMPLATES_DIR.resolve()) or not resolved.exists():
        raise HTTPException(status_code=404, detail="Template not found")
    return FileResponse(resolved, media_type="text/plain; charset=utf-8")


if STATIC_DIR.exists():
    app.mount("/_next/static", StaticFiles(directory=STATIC_DIR / "_next" / "static"), name="next-static")

    @app.get("/{full_path:path}")
    async def serve_frontend(full_path: str):
        file_path = STATIC_DIR / full_path
        if file_path.is_file():
            return FileResponse(file_path)
        html_path = STATIC_DIR / f"{full_path}.html"
        if html_path.is_file():
            return FileResponse(html_path)
        return FileResponse(STATIC_DIR / "index.html")
