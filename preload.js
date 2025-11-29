const { contextBridge, ipcRenderer } = require('electron');

// Expose secure API to renderer process
contextBridge.exposeInMainWorld('electronAPI', {
  // Performance monitoring
  getPerformanceData: () => ipcRenderer.invoke('get-performance-data'),
  
  // System optimization
  optimizeSystem: (type) => ipcRenderer.invoke('optimize-system', type),
  
  // Game detection
  detectGame: () => ipcRenderer.invoke('detect-game'),
  
  // File system operations
  selectDirectory: () => ipcRenderer.invoke('select-directory'),
  
  // Settings
  getSetting: (key) => ipcRenderer.invoke('get-setting', key),
  setSetting: (key, value) => ipcRenderer.invoke('set-setting', key, value),
  
  // App version
  getAppVersion: () => ipcRenderer.invoke('get-app-version')
  ,
  applyGameConfig: (payload) => ipcRenderer.invoke('apply-game-config', payload),
  setProcessPriority: (payload) => ipcRenderer.invoke('set-process-priority', payload),
  closeBackgroundProcesses: (payload) => ipcRenderer.invoke('close-background-processes', payload)
});
