import sqlite3
from contextlib import asynccontextmanager
from pathlib import Path

from dotenv import load_dotenv
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
from fastapi.responses import FileResponse

from models import ChatRequest, ChatResponse
from chat import chat

load_dotenv(Path(__file__).parent.parent / ".env")

STATIC_DIR = Path(__file__).parent / "static"


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
        result = chat(request.messages)
        return result
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))


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
