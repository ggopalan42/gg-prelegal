# Prelegal Project

## Overview

This is a SaaS product to allow users to draft legal agreements based on templates in the templates directory.
The user can carry out AI chat in order to establish what document they want and how to fill in the fields.
The available documents are covered in the catalog.json file in the project root, included here:

@catalog.json

AI chat for the Mutual NDA is implemented. See the Implementation Status section at the end of this file for full details.

## Development process

When instructed to build a feature:
1. Use your Atlassian tools to read the feature instructions from Jira
2. Develop the feature - do not skip any step from the feature-dev 7 step process
3. Thoroughly test the feature with unit tests and integration tests and fix any issues
4. Submit a PR using your github tools

## AI design

When writing code to make calls to LLMs, use your Cerebras skill to use LiteLLM via OpenRouter to the `openrouter/openai/gpt-oss-120b` model with Cerebras as the inference provider. You should use Structured Outputs so that you can interpret the results and populate fields in the legal document.

There is an OPENROUTER_API_KEY in the .env file in the project root.

## Environment

The backend is a uv project at `backend/`. Use `uv add` to install packages and `uv run` to execute commands within it.


## Technical design

The entire project should be packaged into a *single* Docker container.  
The backend should be in backend/ and be a uv project, using FastAPI.  
The frontend should be in frontend/  
The database should use SQLLite and be created from scratch each time the Docker container is brought up, allowing for a users table with sign up and sign in.  
The frontend is statically exported (`next build` with `output: 'export'`) and served by FastAPI from `backend/static/`.  
There should be scripts in scripts/ for:  
```bash
# Mac
scripts/start-mac.sh    # Start
scripts/stop-mac.sh     # Stop

# Linux
scripts/start-linux.sh
scripts/stop-linux.sh

# Windows
scripts/start-windows.ps1
scripts/stop-windows.ps1
```
Backend available at http://localhost:8000

## Color Scheme
- Accent Yellow: `#ecad0a`
- Blue Primary: `#209dd7`
- Purple Secondary: `#753991` (submit buttons)
- Dark Navy: `#032147` (headings)
- Gray Text: `#888888`

## Implementation Status

### GP-3 — Mutual NDA Creator prototype (complete)
- Next.js frontend with a 4-step wizard (parties, terms, signatures, preview) for the Mutual NDA
- Client-side only; no backend

### GP-4 — V1 technical foundation (complete)
- `backend/` — FastAPI uv project; initializes SQLite `users` table on startup; serves static frontend
- `frontend/next.config.ts` — `output: 'export'` for static build
- `frontend/app/login/` — fake login page (name + email, non-empty required); session stored in `localStorage`
- `frontend/app/page.tsx` — redirects to `/login` if no session found
- `Dockerfile` — multi-stage build (Node → Python); single container on port 8000
- `scripts/` — `start`/`stop` scripts for Mac, Linux, Windows (assume pre-built image)

### GP-5 — AI chat for Mutual NDA (complete)
- `backend/chat.py` — LiteLLM + Cerebras via OpenRouter, `ChatAIResponse` Structured Output extracts NDA fields per turn
- `backend/models.py` — Pydantic models for `/api/chat` request/response
- `backend/main.py` — `POST /api/chat` endpoint, CORS middleware, DB path falls back to local file when `/data` not writable
- `backend/chat.py` — LiteLLM + Cerebras via OpenRouter, `ChatAIResponse` Structured Output extracts NDA fields per turn
- `backend/models.py` — Pydantic models for `/api/chat` request/response
- `backend/main.py` — `POST /api/chat` endpoint, CORS middleware, DB path falls back to local file when `/data` not writable
- `frontend/components/ChatPanel.tsx` — freeform chat UI; AI initiates on mount; merges extracted fields into shared NDA state
- `frontend/app/page.tsx` — split panel: chat (left) + live document preview (right); toggle to Form (wizard) mode
- `frontend/next.config.ts` — rewrites `/api/*` → `http://localhost:8000/api/*` in `next dev` (ignored by static export)
- `scripts/build-*.sh/.ps1` — added build scripts; start scripts now pass `--env-file .env` so `OPENROUTER_API_KEY` reaches the container

### GP-6 — Expand to all supported legal document types (complete)
- `backend/models.py` — generic `FieldEntry` / `ChatAIResponse` with `fields: list[FieldEntry]` and `doc_type`
- `backend/chat.py` — dynamic system prompt per doc type built from catalog + template field extraction; selection-mode prompt lists all 12 types with short codes; AI suggests closest if unsupported type requested
- `backend/main.py` — `GET /api/catalog` and `GET /api/template/{filename}` (path-traversal protected)
- `frontend/lib/types.ts` — generic `DocumentFormData { docType, fields, signatures }`
- `frontend/lib/doc-schemas.ts` — 12 doc schemas: short codes, party fields, key/order terms
- `frontend/components/ChatPanel.tsx` — sends `doc_type`; uses functional updater to avoid stale-closure races
- `frontend/components/DocumentPreview.tsx` — fetches template from backend, substitutes fields, renders cover page + signature blocks + standard terms for any doc type
- `frontend/components/DocForm.tsx` — generic form (key terms + signature pads) for all 12 doc types

### Development workflow
- **Docker (recommended):** `scripts/build-mac.sh` then `scripts/start-mac.sh`
- **Local dev:** run `cd backend && uv run uvicorn main:app --port 8000 --reload` and `cd frontend && npm run dev` in separate terminals

### Not yet implemented
- Real authentication (sign up / sign in against the DB)
- Document persistence
