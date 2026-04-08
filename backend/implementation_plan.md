# Backend Implementation Plan: Data Weaver Dashboard

## 🏗️ Architecture Overview
The system follows a modular, scalable architecture with FastAPI, SQLAlchemy, Celery, and Ollama.

### 1. API Layer (`backend/app/api`)
- `sessions.py`: Endpoints for starting, listing, and getting status.
- `results.py`: Fetch extracted JSON and Excel downloads.
- `config.py`: Update settings (API keys, models).

### 2. Service Layer (`backend/app/services`)
- `parser_service.py`: Parsing PDF and Word into text context.
- `llm_service.py`: Agnostic provider-based LLM integration.
- `extraction_service.py`: Main logic to aggregate files and extract fields.
- `export_service.py`: Excel generation using pandas.

### 3. AI Layer (`backend/app/services/llm`)
- `base.py`: Abstract Base Class `LLMProvider`.
- `ollama.py`: Local LLM integration via Ollama API.
- `copilot.py`: OpenAI/Copilot compatible provider.

### 4. Background Workers (`backend/app/worker`)
- `tasks.py`: Celery tasks for processing each entity subfolder.

### 5. Storage Layer (`backend/app/models`)
- `database.py`: SQLAlchemy setup.
- `schemas.py`: Pydantic models.
- `models.py`: Database entities (Session, Task, Result).

## 🚀 Key Milestones
1.  **Core Setup**: Database connection, Celery config, and main FastAPI app.
2.  **LLM Providers**: Implement Ollama and Copilot (OpenAI style) base providers.
3.  **Document Parsing**: Multi-format parsing (PDF, DOCX) to plain text.
4.  **Extraction Pipeline**: Session creation + async task dispatch.
5.  **Output Generation**: Excel creation and result storage.
6.  **Progress Tracking**: Real-time status updates via API.

## 📦 Dependencies
- FastAPI (Web framework)
- Celery + Redis (Task queue)
- SQLAlchemy (ORM)
- PyMuPDF, python-docx (Document parsing)
- pandas (Excel output)
- Ollama (Local AI)
