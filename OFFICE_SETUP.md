# 🏢 Office Transfer & Setup Guide: Data Weaver

Follow these steps to migrate and run this project on your office machine.

## 📋 System Requirements
1. **Node.js** (v18+)
2. **Python** (3.10+)
3. **Ollama** (For local AI: https://ollama.com)
4. **Redis** & **PostgreSQL** (Docker is recommended for these)

---

## 🛠️ Step 1: Transfering Files
Zip the entire `data-weaver-dashboard` folder (excluding `node_modules` and `venv`) and extract it on your Office PC.

---

## 🚀 Step 2: Running the Application

### Option A: The Desktop Experience (Recommended)
This starts the UI + Backend in a single native window.
1. Install dependencies:
   ```bash
   npm install
   ```
2. Setup Backend:
   ```bash
   pip install -r backend/requirements.txt
   ```
3. Start Dev App:
   ```bash
   npm run electron:dev
   ```

### Option B: The Docker Experience (Robust)
1. Ensure Ollama is running on your host machine.
2. Run:
   ```bash
   docker-compose up --build
   ```

---

## 🤖 LLM Prompt Library
In case you need to recalibrate or use a custom model, here is the core extraction prompt used in the system:

**System Prompt:**
> You are an expert data extraction system specialized in automotive dealer documents.
Analyze the following document context extracted from a PDF and a Word file.
Extract the following fields accurately.

**Rules:**
1. Return ONLY a valid JSON object.
2. Do NOT guess or hallucinate. Use null if a field is not found.
3. Keep results concise.
4. If a field has multiple possible values, choose the most probable one from the combined context.

---

## 🔧 Troubleshooting
- **Database Connection**: Ensure Postgres is running and the `DATABASE_URL` in `backend/app/core/config.py` matches your office credentials.
- **Ollama Access**: If running Ollama on Mac but Docker on Linux, use `http://host.docker.internal:11434` as the base URL.
- **Node Errors**: Run `npm install` to ensure all Electron dependencies are fresh.

---

## 🎯 Final Goal
Once you run `npm run electron:build`, you will get an **Installer** (.exe or .dmg). You can give this file to your supervisor—they only need to install it and don't need to know about the code!
