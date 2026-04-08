# 🖥️ Data Weaver — Installation Guide for End Users

> Follow this guide to install **Data Weaver** on your Windows or Mac computer.  
> No technical knowledge required.

---

## Windows Installation

### Step 1 — Install Python (one-time setup)
1. Go to **https://python.org/downloads**
2. Download the latest Python 3.x installer
3. ✅ **Important:** Check the box that says **"Add Python to PATH"** during install
4. Click Install Now

### Step 2 — Install Ollama (for AI processing)
1. Go to **https://ollama.com/download**
2. Download the Windows installer and install it
3. Open **Command Prompt** (search for `cmd` in Start menu) and run:
   ```
   ollama pull llama3
   ```
4. Wait for the model to download (this may take 10–20 minutes on first run)

### Step 3 — Install Data Weaver
1. Double-click the **`Data Weaver Setup.exe`** file
2. If Windows shows a "SmartScreen" warning → click **"More info"** then **"Run anyway"**
3. Follow the installer (choose install location → Install → Finish)
4. A **Data Weaver** shortcut will appear on your Desktop

### Step 4 — Launch
1. Double-click **Data Weaver** on your Desktop
2. The app will start. It may take 15–30 seconds for the backend to initialize.
3. The green **"Backend Online"** dot confirms everything is ready.

---

## macOS Installation

### Step 1 — Install Python (one-time setup)
1. Go to **https://python.org/downloads/macos/**
2. Download and install Python 3.x
3. Open **Terminal** (Spotlight → "Terminal") and verify:
   ```bash
   python3 --version
   ```

### Step 2 — Install Ollama (for AI processing)
1. Go to **https://ollama.com/download**
2. Download and install Ollama for macOS
3. In Terminal, run:
   ```
   ollama pull llama3
   ```

### Step 3 — Install Data Weaver
1. Open the **`Data Weaver.dmg`** file
2. Drag the **Data Weaver** icon into the **Applications** folder
3. If macOS says "unidentified developer":
   - Open **Terminal** and run:
     ```bash
     xattr -d com.apple.quarantine /Applications/Data\ Weaver.app
     ```
   - Then launch normally

### Step 4 — Launch
1. Open **Applications** → **Data Weaver**
2. Allow network access if prompted (needed for local AI)
3. Wait for the **"Backend Online"** green indicator

---

## How to Use the App

1. **Dashboard** — Overview of all extraction sessions
2. **New Extraction** — Start a new brake test extraction:
   - Enter your **name** in the "Added By" field
   - The **Date** is filled automatically
   - Enter the folder path containing the vehicle documents
   - Select AI model (Llama 3 recommended for offline use)
   - Click **"Start Extraction Session"**
3. **Monitor** progress in real-time on the Session Monitor screen
4. **View Results** — See all extracted brake test data in a table
5. **Export** — Download the data as Excel (.xlsx)

---

## 📞 Support

If you encounter issues, contact your IT team or the developer who set up the system.

Common fixes:
- **App won't start**: Ensure Python is installed and in PATH
- **"Backend Offline"**: Make sure no firewall is blocking port 8000
- **AI not responding**: Run `ollama serve` in Terminal/Command Prompt
