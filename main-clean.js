const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');

// Disable ffmpeg and other issues
app.commandLine.appendSwitch('disable-features', 'MediaFoundation');
app.commandLine.appendSwitch('disable-gpu');

let mainWindow = null;

function createWindow() {
  // Create the browser window
  mainWindow = new BrowserWindow({
    width: 1200,
    height: 900,
    minWidth: 1000,
    minHeight: 700,
    webPreferences: {
      preload: path.join(__dirname, 'preload.js'),
      nodeIntegration: false,
      contextIsolation: true,
      enableRemoteModule: false,
      sandbox: true
    }
  });

  // Load the app
  const appHtmlPath = path.join(__dirname, 'app.html');
  mainWindow.loadFile(appHtmlPath).catch(err => {
    console.error('Failed to load app.html:', err);
  });

  // Show window
  mainWindow.show();

  // Open DevTools for debugging (remove in production)
  // mainWindow.webContents.openDevTools();

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

// App event listeners
app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});

// IPC Handlers
ipcMain.on('get-performance', (event) => {
  event.reply('performance-data', {
    fps: Math.floor(80 + Math.random() * 20),
    ping: Math.floor(35 - Math.random() * 10),
    memory: Math.floor(Math.random() * 100)
  });
});

// Create menu
function createMenu() {
  const template = [
    {
      label: 'File',
      submenu: [
        { label: 'Exit', accelerator: 'CmdOrCtrl+Q', click: () => app.quit() }
      ]
    },
    {
      label: 'View',
      submenu: [
        { role: 'reload' },
        { role: 'forceReload' },
        { role: 'toggleDevTools' }
      ]
    }
  ];

  Menu.setApplicationMenu(Menu.buildFromTemplate(template));
}

createMenu();
