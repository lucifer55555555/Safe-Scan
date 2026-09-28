# SafeScan AI — Python + FastAPI + ChromaDB Backend

This is the standalone Python backend service for **SafeScan AI**, implementing the exact architecture defined in the project specification.

---

## 🏗️ Architecture & Technology Stack

| Layer | Technology | Function |
| :--- | :--- | :--- |
| **01. Input & OCR** | `pytesseract` / Google ML Kit | Image pre-processing and optical character recognition |
| **02. Backend Framework** | `FastAPI` + `Uvicorn` | High-throughput asynchronous REST API |
| **03. NLP & Tokenization** | Custom AST Parser + Normalizer | Parenthetical segmentation, alias resolution & entity extraction |
| **04. RAG + LLM** | `Google Gemini API` (`@google/genai`) | Grounded regulatory explanation generation |
| **05. Vector Database** | `ChromaDB` / `FAISS` | Vector embeddings and semantic search over FDA/EFSA corpus |
| **06. Database & Persistence** | `SQLAlchemy` (PostgreSQL / SQLite) | User profiles, scan history, and quarantined token audit logs |

---

## 🚀 Quickstart & Setup

### 1. Create Virtual Environment & Install Dependencies
```bash
cd backend
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
pip install -r requirements.txt
```

### 2. Configure Environment Variables
Create a `.env` file inside the `backend` directory:
```env
GEMINI_API_KEY=your_gemini_api_key_here
DATABASE_URL=sqlite:///./safescan.db  # Or postgresql://user:pass@localhost:5432/safescan
```

### 3. Launch Development Server
```bash
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

The interactive Swagger API documentation will be available at:
👉 `http://localhost:8000/api/v1/docs`

---

## 📡 REST API Endpoints

- `POST /api/v1/ocr/extract` — Extract text from uploaded packaging photo.
- `POST /api/v1/parse/ingredients` — Tokenize and normalize ingredient string.
- `POST /api/v1/assessment/evaluate` — Full safety scan with deterministic rules, ChromaDB vector RAG, and Gemini explanation.
- `GET /api/v1/profile/{user_id}` — Retrieve user dietary constraints and allergen declarations.
- `POST /api/v1/profile` — Save/update user profile.
- `GET /api/v1/health` — System health and vector store telemetry status.
