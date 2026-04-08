# 📦 Data Weaver — Deployment Package

> **Enterprise AI-powered brake test data extraction platform**  
> Version 1.2.0

---

## 📋 What's in this `deployment/` folder

| File | Purpose |
|------|---------|
| `build-mac.sh` | **Run on Mac** to produce a `.dmg` installer |
| `build-win.bat` | **Run on Windows** to produce a `.exe` installer |
| `setup-backend.sh` | First-time Python backend setup (Mac/Linux) |
| `INSTALLER_GUIDE.md` | Step-by-step install guide for end users |
| `README.md` | This file |

---

## 🖥️ System Requirements (Build Machine)

You only need these on the developer/build machine — NOT on end-user machines.

| Requirement | Version | Download |
|---|---|---|
| Node.js | 18+ | https://nodejs.org |
| Python | 3.10+ | https://python.org |
| npm | Comes with Node | — |

---

## 🚀 Build Instructions

### Build for macOS (`.dmg`)

Run this once from the project root:

```bash
chmod +x deployment/build-mac.sh
./deployment/build-mac.sh
```

Output: `dist-electron/Data Weaver-1.2.0.dmg`

---

### Build for Windows (`.exe`)

> **Must be built ON a Windows machine** (cross-compilation is not supported by electron-builder for NSIS)

1. Open Command Prompt or PowerShell in the project folder
2. Double-click `deployment\build-win.bat`  
   OR run: `deployment\build-win.bat`

Output: `dist-electron\Data Weaver Setup 1.2.0.exe`

---

## 📤 How to Ship to End Users

1. Run the appropriate build script
2. Find the installer in `dist-electron/`
3. Copy **just the installer file** (`.dmg` or `.exe`) to a USB drive or shared folder
4. End users follow `INSTALLER_GUIDE.md` — they do NOT need Node, Python, or any dev tools

---

## 🔧 What the App Does

- Accepts a root folder path containing vehicle brake test documents
- User enters their **name** (Added By field) — **date is auto-captured**
- AI (local Ollama or cloud OpenAI) extracts the following fields from each vehicle folder:
  - VC Number, Vehicle Description, Base VC, Vehicle Details (12V/24V)
  - No of Gears, Wheel Base, Max Speed, ABS, Pedal Force
  - L/R Balance %, Cruise Control
  - Normal Brake Force Front/Rear, Wheel Drag Force Front/Rear
  - Parking Brake Force
  - Added By *(user-entered)*
  - Date *(auto, from session submission)*
- Results viewable in-app and exportable as Excel (XLSX)

---

## ⚙️ For Developers: Dev Mode

```bash
# Install all dependencies
npm install

# Start frontend + backend + Electron together
npm run electron:dev
```

---

## 🤖 AI Models Supported

| Model | Type | Requires |
|---|---|---|
| Llama 3 | Local | Ollama running on same machine |
| Mistral | Local | Ollama running on same machine |
| Mixtral | Local | Ollama running on same machine |
| GPT-4o | Cloud | OpenAI API key |

Install Ollama: https://ollama.com  
Pull a model: `ollama pull llama3`

---

## 🛟 Troubleshooting

| Problem | Solution |
|---|---|
| App opens but shows "Backend Offline" | Backend failed to start — check Python venv setup |
| `npm install` fails | Run `npm install --legacy-peer-deps` |
| macOS says "unidentified developer" | Right-click → Open, or run `xattr -d com.apple.quarantine "Data Weaver.app"` |
| Windows SmartScreen blocks install | Click "More info" → "Run anyway" |
| Ollama not connecting | Run `ollama serve` in terminal before launching app |
