#!/usr/bin/env node
/**
 * Simple Electron packager script to bypass electron-builder locking issues
 * Creates a portable executable directly from Electron binaries
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const projectDir = __dirname;
const distDir = path.join(projectDir, 'dist-portable');
const nodeModulesDir = path.join(projectDir, 'node_modules');
const electronDir = path.join(nodeModulesDir, 'electron', 'dist');

console.log('🔨 Preparing portable application...');
console.log(`Project: ${projectDir}`);
console.log(`Output: ${distDir}`);

// Clean output directory - skip if locked
if (fs.existsSync(distDir)) {
  try {
    console.log('Cleaning existing dist-portable...');
    fs.rmSync(distDir, { recursive: true, force: true });
  } catch (e) {
    console.log('⚠ Could not delete dist-portable, will overwrite files instead');
  }
}

// Create output structure
fs.mkdirSync(path.join(distDir, 'resources', 'app'), { recursive: true });
console.log('✓ Created directory structure');

// Copy Electron executable
const electronExe = path.join(electronDir, 'electron.exe');
if (fs.existsSync(electronExe)) {
  fs.copyFileSync(electronExe, path.join(distDir, 'Bloodstrike-Optimizer.exe'));
  console.log('✓ Copied Electron executable');
} else {
  console.warn('⚠ electron.exe not found, this may fail');
}

// Copy all DLL files
const dllFiles = fs.readdirSync(electronDir).filter(f => f.endsWith('.dll'));
for (const dll of dllFiles) {
  fs.copyFileSync(
    path.join(electronDir, dll),
    path.join(distDir, dll)
  );
}
console.log(`✓ Copied ${dllFiles.length} DLL files (including ffmpeg.dll)`);

// Copy Electron resources
const electronResources = path.join(electronDir, 'resources');
if (fs.existsSync(electronResources)) {
  copyRecursive(electronResources, path.join(distDir, 'resources'));
  console.log('✓ Copied Electron resources');
}

// Copy application files
const appFiles = ['main.js', 'preload.js', 'app.html', 'app.js', 'styles.css', 'package.json'];
for (const file of appFiles) {
  const src = path.join(projectDir, file);
  const dest = path.join(distDir, 'resources', 'app', file);
  if (fs.existsSync(src)) {
    fs.copyFileSync(src, dest);
  }
}
console.log('✓ Copied application files');

// Create a simple launcher batch file
const launcherBat = `@echo off
setlocal enabledelayedexpansion
cd /d "%~dp0"
start "" "Bloodstrike-Optimizer.exe"
`;

fs.writeFileSync(path.join(distDir, 'run.bat'), launcherBat);
console.log('✓ Created launcher script');

console.log('\n✅ Portable application created successfully!');
console.log(`📁 Output: ${distDir}`);
console.log(`🚀 Launch: Double-click run.bat or Bloodstrike-Optimizer.exe`);

function copyRecursive(src, dest) {
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }
  
  const files = fs.readdirSync(src);
  for (const file of files) {
    const srcFile = path.join(src, file);
    const destFile = path.join(dest, file);
    const stat = fs.statSync(srcFile);
    
    if (stat.isDirectory()) {
      copyRecursive(srcFile, destFile);
    } else {
      try {
        fs.copyFileSync(srcFile, destFile);
      } catch (e) {
        // Skip files that can't be copied
      }
    }
  }
}
