const { app, BrowserWindow, Menu, ipcMain } = require('electron');
const path = require('path');
const fs = require('fs');
const { exec } = require('child_process');

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

ipcMain.handle('get-performance-data', async () => {
  return {
    fps: Math.floor(80 + Math.random() * 30),
    ping: Math.floor(35 - Math.random() * 10),
    memory: Math.floor(700 + Math.random() * 300)
  };
});

ipcMain.handle('get-app-version', async () => {
  return app.getVersion ? app.getVersion() : '1.0.0';
});

ipcMain.handle('detect-game', async () => {
  try {
    // Check common install locations for Bloodstrike, return the path if found
    const candidates = [
      path.join(process.env['ProgramFiles']||'C:', 'Program Files', 'Bloodstrike', 'Bloodstrike.exe'),
      path.join(process.env['ProgramFiles(x86)']||'C:', 'Program Files (x86)', 'Bloodstrike', 'Bloodstrike.exe'),
      path.join(process.env['USERPROFILE']||'C:', 'Desktop', 'Bloodstrike.exe')
    ];
    for (const c of candidates) if (c && fs.existsSync(c)) return { success: true, path: c };
    return { success: false };
  } catch(e) { return { success: false, message: e.message } }
});

ipcMain.handle('apply-game-config', async (event, { gamePath, changes }) => {
  // WARNING: We will only perform simple textual edits on configuration files. Modifying
  // runtime memory is not allowed. We will backup files before touching them and return status.
  try {
    if (!gamePath || !fs.existsSync(gamePath)) return { success: false, message: 'Game executable not found' };
    const gameFolder = path.dirname(gamePath);
    // Known config file names to try
    const configCandidates = ['GameUserSettings.ini', 'GameUserSettings.cfg', 'settings.cfg', 'config.json', 'config.cfg', 'settings.ini'];
    let foundFiles = [];
    for (const candidate of configCandidates) {
      const cpath = path.join(gameFolder, candidate);
      if (fs.existsSync(cpath)) foundFiles.push(cpath);
    }
    // Also search recursively for other config files
    if (foundFiles.length === 0) {
      const files = fs.readdirSync(gameFolder);
      for (const f of files) {
        if (/\.ini$|\.cfg$|config|settings|\.json$/i.test(f)) {
          foundFiles.push(path.join(gameFolder, f));
        }
      }
    }
    if (foundFiles.length === 0) return { success: false, message: 'No config files found' };
    const results = [];
    for (const file of foundFiles) {
      const original = fs.readFileSync(file, 'utf8');
      let modified = original;
      // Backup
      const bak = file + '.bak';
      if (!fs.existsSync(bak)) fs.copyFileSync(file, bak);
      // Apply changes - replace key/value pairs using regex
      for (const key in changes) {
        const value = changes[key];
        // Try patterns: key=123  or "key": 123 or "key": "value"
        const patterns = [
          new RegExp('(' + key + '\\s*=\\s*)[^\\r\\n]+', 'i'),
          new RegExp('("' + key + '"\s*:\s*)[^,\\r\\n]+', 'i'),
          new RegExp('(' + key + '\\s*:\\s*)[^,\\r\\n]+', 'i')
        ];
        let found = false;
        for (const pat of patterns) {
          if (pat.test(modified)) {
            modified = modified.replace(pat, `$1${value}`);
            found = true; break;
          }
        }
        if (!found) {
          // Append to end if not found
          modified += `\n${key}=${value}`;
        }
      }
      // Write file
      try {
        fs.writeFileSync(file, modified, 'utf8');
        results.push({file, status:'updated'});
      } catch (err) {
        results.push({file, status:'error', error: err.message});
      }
    }
    return { success: true, results };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

ipcMain.handle('set-process-priority', async (event, { processName, priority }) => {
  // processName like Bloodstrike.exe, priority one of: RealTime, High, AboveNormal, Normal, BelowNormal, Idle
  try {
    if (!processName) return { success: false, message: 'Process name required' };
    // Use PowerShell to set priority on all matching processes
    const ps = `Get-Process -Name "${path.basename(processName, '.exe')}" -ErrorAction SilentlyContinue | ForEach-Object { $_.PriorityClass = '${priority}' }`;
    exec(`powershell -Command "${ps}"`, (err, stdout, stderr) => {
      // just log
      if (err) console.error('Priority error', err);
    });
    return { success: true };
  } catch (e) {
    return { success: false, message: e.message };
  }
});

ipcMain.handle('optimize-system', async (event, payload) => {
  try {
    // payload example: { action: 'emergency', processesToKill: ['chrome.exe'] }
    if (!payload) payload = {};
    if (payload.action === 'emergency') {
      // Set Bloodstrike priority to High
      exec(`powershell -Command "Get-Process -Name 'Bloodstrike' -ErrorAction SilentlyContinue | ForEach-Object { $_.PriorityClass = 'High' }"`, () => {});
      if (payload.processesToKill && Array.isArray(payload.processesToKill)) {
        for (const p of payload.processesToKill) {
          exec(`taskkill /F /IM ${p} 2>NUL`, () => {});
        }
      }
      return { success: true };
    }
    return { success: false, message: 'Unknown action' };
  } catch (e) { return { success: false, message: e.message } }
});

ipcMain.handle('close-background-processes', async (event, { processes }) => {
  try {
    if (!processes || !Array.isArray(processes) || processes.length === 0) return { success: false, message: 'No processes specified' };
    // Use taskkill for each process
    for (const p of processes) {
      exec(`taskkill /F /IM ${p} 2>NUL`, (err) => {if (err) console.error('taskkill', p, err)});
    }
    return { success: true };
  } catch (e) { return { success: false, message: e.message } }
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
