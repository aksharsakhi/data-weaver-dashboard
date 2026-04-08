# 🦅 Data Weaver: Enterprise AI Document Extraction

Data Weaver is a production-ready backend and dashboard for intelligent data extraction from unstructured folders using Local LLMs (Ollama) or Copilot/OpenAI.

## 🖥️ Desktop App (Electron)

To run the app as a standalone desktop application (Windows/Mac):

1. **Development Mode**:
   ```bash
   npm run electron:dev
   ```
   This starts the React UI (Vite) and the Electron shell together.

2. **Build Installer**:
   ```bash
   npm run electron:build
   ```
   This generates a standalone `.exe` or `.dmg` in the `dist_electron` folder.

## 🚀 Web Mode (Docker)

1. Ensure **Ollama** is installed and running locally on port 11434.
2. Clone/Open this repo.
3. Run the following command:
   ```bash
   docker-compose up --build
   ```
4. Access the Dashboard at `http://localhost:3000` (or your Vite dev server port).
5. Access the API at `http://localhost:8000`.

## 🛠️ Local Setup (Manual)

### 1. Backend (Python)
- Install Redis (`brew install redis` on Mac).
- Install PostgreSQL.
- Setup env:
  ```bash
  cd backend
  python -m venv venv
  source venv/bin/activate
  pip install -r requirements.txt
  ```
- Run API: `uvicorn app.main:app --reload`
- Run Worker: `celery -A app.worker.celery_app worker --loglevel=info`

### 2. Frontend (React)
- Install Node.js.
- Setup:
  ```bash
  npm install
  npm run dev
  ```

## 📂 Folder Structure Requirement
The system processes subfolders within a root folder. Each subfolder must contain exactly:
- 1 PDF file
- 1 Word file (.doc or .docx)

## 🤖 Supported Models
- **Local:** llama3, mistral, mixtral (via Ollama)
- **Cloud:** GPT-4o (requires API Key)

## 📊 Features
- Multi-session support.
- Real-time progress tracking.
- Parallel processing with Celery.
- Excel (XLSX) Export.
- Modern Glassmorphism UI.
