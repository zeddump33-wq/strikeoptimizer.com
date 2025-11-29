#!/usr/bin/env node
/**
 * Create a proper Windows EXE that launches Electron app cleanly
 * No console window, clean launch like normal .exe apps
 */

const fs = require('fs');
const path = require('path');

const distDir = path.join(__dirname, 'dist-portable');

console.log('🔨 Creating clean Windows launcher...\n');

// Create a VBScript that launches Electron silently
const vbsContent = `
' Bloodstrike Optimizer - Silent Launcher
Set objShell = CreateObject("WScript.Shell")
Set objFso = CreateObject("Scripting.FileSystemObject")

' Get the directory where this script is located
strScriptPath = WScript.ScriptFullName
strScriptDir = objFso.GetParentFolderName(strScriptPath)

' Launch Electron app silently (no console window)
strElectronExe = strScriptDir & "\\Bloodstrike-Optimizer.exe"

If objFso.FileExists(strElectronExe) Then
    ' Run without window (0 = hidden window)
    objShell.Run strElectronExe, 0, False
Else
    ' If direct exe fails, show error
    MsgBox "Bloodstrike Optimizer not found!", vbCritical, "Error"
End If
`;

fs.writeFileSync(path.join(distDir, 'launcher-silent.vbs'), vbsContent);
console.log('✓ Created VBS launcher (silent)');

// Create a batch wrapper that uses the VBS
const batContent = `@echo off
setlocal
cd /d "%~dp0"
cscript.exe "launcher-silent.vbs"
`;

fs.writeFileSync(path.join(distDir, 'Launch.bat'), batContent);
console.log('✓ Created batch launcher');

// Also create an HTA (HTML Application) that launches directly
const htaContent = `<html>
<head>
<title>Bloodstrike Optimizer</title>
<HTA:APPLICATION
    ID="BloodstrikeOptimizer"
    APPLICATIONNAME="Bloodstrike Optimizer"
    VERSION="1.0.0"
    BORDERSTYLE="complex"
    CAPTION="yes"
    ICON="favicon.ico"
    NAVIGABLE="yes"
    SCROLL="yes"
    SINGLEINSTANCE="yes"
    SYSMENU="yes"
    WINDOWSTATE="normal"
/>
</head>
<body onload="Launch()">
<script>
function Launch() {
    var shell = new ActiveXObject("WScript.Shell");
    var fso = new ActiveXObject("Scripting.FileSystemObject");
    var scriptPath = location.pathname;
    var scriptDir = fso.GetParentFolderName(scriptPath).replace(/\\\\/, "\\\\");
    
    try {
        var exePath = scriptDir + "\\\\Bloodstrike-Optimizer.exe";
        if (fso.FileExists(exePath)) {
            shell.Run(exePath, 0);
            self.close();
        } else {
            alert("Bloodstrike Optimizer not found!");
        }
    } catch(e) {
        alert("Error: " + e.message);
    }
}
</script>
</body>
</html>`;

fs.writeFileSync(path.join(distDir, 'Bloodstrike-Optimizer.hta'), htaContent);
console.log('✓ Created HTA launcher');

// Create a clean startup shortcut batch
const startupBat = `@echo off
REM Bloodstrike Optimizer - Clean Launcher
REM This file launches the app cleanly like any Windows application
setlocal enabledelayedexpansion
cd /d "%~dp0"

REM Check if exe exists
if not exist "Bloodstrike-Optimizer.exe" (
    echo Bloodstrike Optimizer not found
    pause
    exit /b 1
)

REM Launch silently and exit
start /B "" "Bloodstrike-Optimizer.exe"
exit /b 0
`;

fs.writeFileSync(path.join(distDir, 'Bloodstrike-Optimizer-Clean.bat'), startupBat);
console.log('✓ Created clean startup batch');

console.log('\n✅ Complete!\n');
console.log('📁 Location: ' + distDir);
console.log('\n🚀 Ways to Launch:\n');
console.log('1. Double-click: Bloodstrike-Optimizer.exe');
console.log('   (Standard Electron launcher, shows window immediately)\n');
console.log('2. Double-click: Bloodstrike-Optimizer.hta');
console.log('   (Windows HTML Application - cleanest launch)\n');
console.log('3. Double-click: Bloodstrike-Optimizer-Clean.bat');
console.log('   (Batch file - very clean, no console)\n');
console.log('4. Double-click: Launch.bat');
console.log('   (VBScript launcher - silent)\n');
