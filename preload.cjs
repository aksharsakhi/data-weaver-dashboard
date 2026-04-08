// preload.js — runs in the renderer context with Node access disabled
// Safe bridge between renderer and main process (contextIsolation enabled)
const { contextBridge, ipcRenderer } = require('electron');

contextBridge.exposeInMainWorld('electronAPI', {
  // Future IPC hooks can go here
  platform: process.platform,
});
