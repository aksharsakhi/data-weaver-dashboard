const { app, BrowserWindow, shell, dialog, ipcMain } = require('electron');
const path = require('path');
const { spawn } = require('child_process');
const fs = require('fs');

const isDev = process.env.NODE_ENV === 'development';

let mainWindow = null;
let backendProcess = null;

// ── Determine correct paths for packaged vs dev ───────────────────────────
function getOriginalBackendDir() {
  if (isDev) return path.join(__dirname, 'backend');
  return path.join(process.resourcesPath, 'backend');
}

function getActiveBackendDir() {
  if (isDev) return path.join(__dirname, 'backend');
  return path.join(app.getPath('userData'), 'backend_runtime');
}

function getPythonPath() {
  const backendDir = getActiveBackendDir();
  if (process.platform === 'win32') {
    const embedded = path.join(backendDir, 'python', 'python.exe');
    const venv     = path.join(backendDir, 'venv', 'Scripts', 'python.exe');
    if (fs.existsSync(embedded)) return embedded;
    if (fs.existsSync(venv))     return venv;
    return 'python';           
  } else {
    const venv = path.join(backendDir, 'venv', 'bin', 'python3');
    if (fs.existsSync(venv)) return venv;
    return 'python3';
  }
}

function ensureBackendSetup() {
  return new Promise((resolve, reject) => {
    const activeDir = getActiveBackendDir();
    const originalDir = getOriginalBackendDir();
    
    // Copy Backend resources securely to writable User Data area if not present
    if (!fs.existsSync(activeDir) && !isDev) {
      console.log(`[Setup] Copying backend runtime into ${activeDir}`);
      fs.cpSync(originalDir, activeDir, { recursive: true });
    }

    const venvDir = path.join(activeDir, 'venv');
    const requirementsPath = path.join(activeDir, 'requirements.txt');
    
    if (fs.existsSync(venvDir)) {
      resolve(); // Already setup
      return;
    }

    console.log('[Setup] First run detected. Creating virtual environment...');
    
    // Create a simple loading window
    let loadingWindow = new BrowserWindow({
      width: 400, height: 250, frame: false, alwaysOnTop: true,
      webPreferences: { nodeIntegration: true }
    });
    loadingWindow.loadURL(`data:text/html,
      <body style="font-family: sans-serif; display: flex; flex-direction: column; justify-content: center; align-items: center; background: %2308080A; color: white;">
        <h3 style="color: %23BC3F00;">Data Weaver</h3>
        <p>Initializing AI Runtime on first launch...</p>
        <p style="font-size: 12px; color: %23808090;">Downloading local dependencies (may take a minute)</p>
        <div style="margin-top: 10px; width: 50px; height: 50px; border: 4px solid %23BC3F00; border-top: 4px solid transparent; border-radius: 50%; animation: spin 1s linear infinite;"></div>
        <style>@keyframes spin { 100% { transform: rotate(360deg); } }</style>
      </body>
    `);

    // Resolve Python command aggressively because Mac GUI apps don't inherit full $PATH
    let pythonCmd = process.platform === 'win32' ? 'python' : 'python3';
    if (process.platform === 'darwin') {
      const macPaths = ['/opt/homebrew/bin/python3', '/usr/local/bin/python3', '/usr/bin/python3'];
      for (const p of macPaths) {
        if (fs.existsSync(p)) {
          pythonCmd = p;
          break;
        }
      }
    }
    
    // 1. Create venv
    const setupProcess = spawn(pythonCmd, ['-m', 'venv', 'venv'], { cwd: activeDir });
    setupProcess.on('error', (err) => {
      dialog.showErrorBox("Setup Execution Failed", `Could not launch Python for installation: ${err.message}`);
      if (loadingWindow) loadingWindow.close();
      reject(err);
    });
    setupProcess.on('close', (code) => {
      if (code !== 0) {
        dialog.showErrorBox("Setup Failed", "Failed to create Python environment. Is Python 3 installed?");
        if (loadingWindow) loadingWindow.close();
        reject();
        return;
      }
      
      console.log('[Setup] Installing requirements...');
      const pipCmd = process.platform === 'win32' ? path.join('venv', 'Scripts', 'pip') : path.join('venv', 'bin', 'pip');
      
      // 2. Install requirements
      const installProcess = spawn(pipCmd, ['install', '-r', 'requirements.txt'], { cwd: activeDir });
      installProcess.on('error', (err) => {
        dialog.showErrorBox("Setup Execution Failed", `Could not launch Pip for installation: ${err.message}`);
        if (loadingWindow) loadingWindow.close();
        reject(err);
      });
      installProcess.on('close', (pipCode) => {
        if (loadingWindow) loadingWindow.close();
        if (pipCode !== 0) {
          dialog.showErrorBox("Setup Failed", "Failed to install dependencies.");
          reject();
        } else {
          console.log('[Setup] Dependencies installed successfully.');
          resolve();
        }
      });
    });
  });
}

// ── Start FastAPI backend ────────────────────────────────────────────────
function startBackend() {
  const pythonPath = getPythonPath();
  const activeDir = getActiveBackendDir();

  // If previous port 8000 hangs exist, relying on localhost
  console.log(`[Electron] Starting backend: ${pythonPath} in ${activeDir}`);

  backendProcess = spawn(pythonPath, ['-m', 'uvicorn', 'app.main:app', '--host', '127.0.0.1', '--port', '8000'], {
    cwd: activeDir,
    env: {
      ...process.env,
      PYTHONPATH: activeDir,
      PYTHONUNBUFFERED: '1',
    },
  });

  backendProcess.stdout.on('data', (data) => {
    console.log(`[Backend] ${data.toString().trim()}`);
  });

  backendProcess.stderr.on('data', (data) => {
    const msg = data.toString().trim();
    if (msg) console.log(`[Backend] ${msg}`);
  });

  backendProcess.on('error', (err) => {
    dialog.showErrorBox("Backend Process Error", `Message: ${err.message}`);
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
      preload: path.join(__dirname, 'preload.cjs'),
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
  try {
    if (!isDev) {
      await ensureBackendSetup();
    }
  } catch (err) {
    dialog.showErrorBox("Critical Setup Error", `Error: ${err.message}`);
    console.error("Setup aborted.", err);
  }
  
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
