#!/usr/bin/env node
/**
 * Enhanced Electron packager - Creates proper app.asar archive
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = __dirname;
const distDir = path.join(projectDir, 'dist-portable');
const appDir = path.join(distDir, 'resources', 'app');
const nodeModulesDir = path.join(projectDir, 'node_modules');
const electronDir = path.join(nodeModulesDir, 'electron', 'dist');
const asarPath = path.join(nodeModulesDir, 'asar', 'bin', 'asar.js');

console.log('🔨 Building Bloodstrike Optimizer...\n');

// Step 1: Clean and recreate structure
if (fs.existsSync(distDir)) {
  try {
    fs.rmSync(distDir, { recursive: true, force: true });
  } catch (e) {
    console.log('⚠ Could not fully clean, will overwrite');
  }
}

fs.mkdirSync(appDir, { recursive: true });
console.log('✓ Created directory structure');

// Step 2: Copy Electron runtime
const electronExe = path.join(electronDir, 'electron.exe');
fs.copyFileSync(electronExe, path.join(distDir, 'Bloodstrike-Optimizer.exe'));

const dllFiles = fs.readdirSync(electronDir).filter(f => f.endsWith('.dll'));
for (const dll of dllFiles) {
  fs.copyFileSync(path.join(electronDir, dll), path.join(distDir, dll));
}
console.log(`✓ Copied Electron runtime (${dllFiles.length} DLLs)`);

// Step 3: Copy Electron resources
copyRecursive(path.join(electronDir, 'resources'), path.join(distDir, 'resources'));
console.log('✓ Copied resources');

// Step 4: Copy app files to app folder
const appFiles = ['main.js', 'preload.js', 'app.html', 'app.js', 'styles.css'];
for (const file of appFiles) {
  const src = path.join(projectDir, file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, path.join(appDir, file));
  }
}

// Create package.json
fs.writeFileSync(path.join(appDir, 'package.json'), JSON.stringify({
  name: 'bloodstrike-optimizer',
  version: '1.0.0',
  main: 'main.js'
}, null, 2));

console.log('✓ Copied application files');

// Step 5: Create app.asar using asar tool
console.log('\n📦 Creating app.asar...');
try {
  const asarExists = fs.existsSync(asarPath) || fs.existsSync(path.join(nodeModulesDir, '.bin', 'asar'));
  
  if (asarExists) {
    // Use asar to pack the app folder
    const tempAppDir = path.join(distDir, 'resources', 'app_temp');
    fs.renameSync(appDir, tempAppDir);
    
    try {
      execSync(`node "${asarPath}" pack "${tempAppDir}" "${path.join(distDir, 'resources', 'app.asar')}"`, {
        stdio: 'pipe'
      });
      fs.rmSync(tempAppDir, { recursive: true, force: true });
      console.log('✓ Created app.asar');
    } catch (e) {
      console.log('⚠ asar creation failed, keeping folder structure');
      fs.renameSync(tempAppDir, appDir);
    }
  } else {
    console.log('⚠ asar tool not available, using folder structure');
  }
} catch (e) {
  console.log('⚠ Using direct folder (asar not available)');
}

// Step 6: Create launcher batch
const launcherBat = `@echo off\ncd /d "%~dp0"\nstart "" "Bloodstrike-Optimizer.exe"`;
fs.writeFileSync(path.join(distDir, 'run.bat'), launcherBat);

console.log('\n✅ Build complete!');
console.log(`📁 Location: ${distDir}`);
console.log(`🚀 Launch: Double-click Bloodstrike-Optimizer.exe\n`);

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) fs.mkdirSync(dest, { recursive: true });
  
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    
    try {
      if (fs.statSync(srcFile).isDirectory()) {
        copyRecursive(srcFile, destFile);
      } else {
        fs.copyFileSync(srcFile, destFile);
      }
    } catch (e) {
      // Skip files that can't be copied
    }
  }
}
