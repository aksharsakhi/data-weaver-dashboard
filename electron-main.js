const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;
let backendProcess = null;

// ── Determine correct paths for packaged vs dev ───────────────────────────
function getBackendDir() {
  if (isDev) {
    return path.join(__dirname, 'backend');
  }
  // In packaged app, resources are under process.resourcesPath
  return path.join(process.resourcesPath, 'backend');
}

function getPythonPath() {
  const backendDir = getBackendDir();
  if (process.platform === 'win32') {
    // Try embedded Python first (shipped with the app), then venv, then system
    const embedded = path.join(backendDir, 'python', 'python.exe');
    const venv     = path.join(backendDir, 'venv', 'Scripts', 'python.exe');
    if (fs.existsSync(embedded)) return embedded;
    if (fs.existsSync(venv))     return venv;
    return 'python';           // fall back to system python
  } else {
    const venv = path.join(backendDir, 'venv', 'bin', 'python3');
    if (fs.existsSync(venv)) return venv;
    return 'python3';
  }
}

// ── Start FastAPI backend ────────────────────────────────────────────────
function startBackend() {
  const pythonPath = getPythonPath();
  const backendDir = getBackendDir();

  console.log(`[Electron] Starting backend: ${pythonPath} in ${backendDir}`);

  backendProcess = spawn(pythonPath, ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: backendDir,
    env: {
      ...process.env,
      PYTHONPATH: backendDir,
      PYTHONUNBUFFERED: '1',
    },
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    // uvicorn logs to stderr by default — not an error
    const msg = data.toString().trim();
    if (msg) console.log(`[Backend] ${msg}`);
  });

  backendProcess.on('error', (err) => {
    console.error(`[Backend] Failed to start: ${err.message}`);
  });

  backendProcess.on('close', (code) => {
    console.log(`[Backend] Process exited with code ${code}`);
    backendProcess = null;
  });
}

// ── Wait for backend to be ready ────────────────────────────────────────
function waitForBackend(maxAttempts = 30, intervalMs = 500) {
  return new Promise((resolve) => {
    const http = require('http');
    let attempts = 0;
    const check = () => {
      attempts++;
      const req = http.get('http://127.0.0.1:8000/', (res) => {
        if (res.statusCode < 500) resolve(true);
        else retry();
      });
      req.on('error', retry);
      req.setTimeout(500, () => { req.destroy(); retry(); });
    };
    const retry = () => {
      if (attempts >= maxAttempts) { resolve(false); return; }
      setTimeout(check, intervalMs);
    };
    check();
  });
}

// ── Create the main browser window ──────────────────────────────────────
function createWindow() {
  mainWindow = new BrowserWindow({
    width: 1400,
    height: 860,
    minWidth: 960,
    minHeight: 600,
    webPreferences: {
      nodeIntegration: false,
      contextIsolation: true,
      preload: path.join(__dirname, 'preload.js'),
    },
    titleBarStyle: process.platform === 'darwin' ? 'hiddenInset' : 'default',
    backgroundColor: '#08080A',
    show: false, // Show only once ready
    icon: path.join(__dirname, 'assets', 'icon.png'),
    title: 'Data Weaver — Brake Test Extraction',
  });

  const appUrl = isDev
    ? 'http://localhost:8080'
    : `file://${path.join(__dirname, 'dist', 'index.html')}`;

  mainWindow.loadURL(appUrl);

  mainWindow.once('ready-to-show', () => {
    mainWindow.show();
    mainWindow.focus();
  });

  // Open external links in system browser, not Electron
  mainWindow.webContents.setWindowOpenHandler(({ url }) => {
    shell.openExternal(url);
    return { action: 'deny' };
  });

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// ── App lifecycle ────────────────────────────────────────────────────────
app.whenReady().then(async () => {
  // Start backend unless already running (e.g. dev mode with separate process)
  startBackend();

  // Wait up to 15s for backend
  const backendReady = await waitForBackend(30, 500);
  if (!backendReady && !isDev) {
    dialog.showMessageBoxSync({
      type: 'warning',
      title: 'Backend Startup',
      message: 'The backend server took too long to start.\n\nThe app will open, but some features may not be available until the backend is ready.',
      buttons: ['OK'],
    });
  }

  createWindow();

  app.on('activate', () => {
    if (BrowserWindow.getAllWindows().length === 0) createWindow();
  });
});

app.on('window-all-closed', () => {
  // Kill backend when app closes
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
    backendProcess = null;
  }
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('before-quit', () => {
  if (backendProcess) {
    backendProcess.kill('SIGTERM');
  }
});
