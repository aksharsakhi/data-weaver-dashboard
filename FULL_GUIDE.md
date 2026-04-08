# Data Weaver: Enterprise AI Extraction Dashboard

Data Weaver is a premium, standalone desktop application designed for the high-speed extraction of structured data from complex document repositories (specifically tailored for Brake Test data, but extensible to any domain).

---

## 🚀 Key Features

- **AI-Powered Extraction**: Uses local LLMs (Ollama) or Cloud APIs (OpenAI) to intelligently "read" and extract specific fields from documents.
- **Dynamic Field Configuration**: Users can define exactly which columns they want to extract on-the-fly.
- **Standalone Runtime**: Built with Electron & FastAPI, incorporating an **Auto-Installer Engine** that handles its own backend dependencies.
- **Zero-Config Database**: Uses a local SQLite database that persists history without requiring a server setup.
- **Adaptive UI**: High-fidelity, responsive dashboard that scales perfectly from laptops to ultra-wide monitors.
- **Export to Excel**: One-click generation of finalized data sheets.

---

## 🛠 How It Works (Architecture)

1. **Frontend (React + Vite)**: A modern, high-performance UI that manages session configurations and visualizes real-time progress.
2. **Backend (FastAPI)**: A robust Python server that manages the extraction logic, database persistence, and LLM communication.
3. **Task Orchestration**: When a session starts, the backend identifies all subfolders in your target directory and creates async tasks to process them in parallel.
4. **Desktop Wrapper (Electron)**: Bundles both components into a single executable and manages the local Python lifecycle.

---

## 🏃‍♂️ How to Run the App

### Option A: Standard User (1-Click Installer)
This is the recommended way for anyone who just wants to use the tool.

1.  Navigate to the `final_app/` folder.
2.  **Windows**: Run `Data Weaver Setup 1.2.0.exe`.
3.  **MacOS**: Open `Data Weaver-1.2.0-arm64.dmg` (for M1/M2/M3) or `Data Weaver-1.2.0.dmg` (for Intel) and drag to Applications.
4.  **First Launch**: On first launch, the app will show an "Initializing AI Runtime" screen. It is automatically downloading Python dependencies for you. Wait about 60 seconds.
5.  **Requirement**: Ensure you have [Ollama](https://ollama.com/) installed on your system if you plan to use local AI models.

### Option B: Developer Mode (Running from Source)
If you want to modify the code or run it locally for testing:

1.  **Clone the Repository**:
    ```bash
    git clone [your-repo-url]
    cd data-weaver-dashboard
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    python3 -m venv venv
    source venv/bin/activate  # Windows: venv\Scripts\activate
    pip install -r requirements.txt
    uvicorn app.main:app --host 127.0.0.1 --port 8000 --reload
    ```

3.  **Setup Frontend**:
    ```bash
    # In a new terminal
    npm install
    npm run dev
    ```

4.  **Access the App**:
    Open [http://localhost:8080](http://localhost:8080) in your browser.

---

## 📁 Workflow Guide

1.  **Preparation**: Organize your documents into subfolders inside a main "Root Folder". Each subfolder represents one row in your final Excel sheet.
2.  **Configure**: Open the app, name your session, and paste the absolute path to your Root Folder.
3.  **Define Columns**: Select pre-defined columns (Date, Added By, etc.) or add your own custom field names.
4.  **Extract**: Click "Start Extraction" and monitor the real-time progress bar.
5.  **Export**: Once finished, go to the Results page and click **Download Excel**.

---

## 📄 Technical Notes
- **Local Storage**: Data is stored in `~/Library/Application Support/Data Weaver/` (Mac) or `%AppData%/Data Weaver/` (Windows).
- **Python**: Requires Python 3.9+ installed on the host system for the auto-installer to trigger.
- **Port Usage**: Uses ports `8000` (Backend) and `8080` (Frontend dev) or internal Electron pipes.
