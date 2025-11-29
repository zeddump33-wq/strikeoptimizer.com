@echo off
REM Bloodstrike Optimizer - Auto Launcher & Game Detector
REM This is the main launcher - just double-click to start!

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ===============================================
echo  Bloodstrike Optimizer
echo ===============================================
echo.

REM Launch the optimizer app
if exist "dist-portable\Bloodstrike-Optimizer.exe" (
    echo Launching optimizer...
    start "" dist-portable\Bloodstrike-Optimizer.exe
    echo ✓ Optimizer launched
) else (
    echo ERROR: Bloodstrike-Optimizer.exe not found in dist-portable folder
    echo Make sure you've run: npm run build-simple
    pause
    exit /b 1
)

echo.
echo Waiting for Bloodstrike game to start...
echo.

REM Wait and monitor for Bloodstrike.exe
setlocal enabledelayedexpansion
set "game_found=0"
set "counter=0"

:monitor_loop
set /a counter+=1

REM Check for Bloodstrike.exe process
tasklist /FI "IMAGENAME eq Bloodstrike.exe" 2>nul | find /I /N "Bloodstrike.exe">nul
if not errorlevel 1 (
    echo ✓ Bloodstrike detected! Auto-optimization active...
    set "game_found=1"
    timeout /t 2 >nul
    goto :monitor_loop
)

if !counter! lss 300 (
    REM Wait 1 second and try again (monitors for 5 minutes)
    timeout /t 1 >nul
    goto :monitor_loop
)

if !game_found! equ 0 (
    echo.
    echo Bloodstrike not detected after 5 minutes.
    echo Optimizer is still running - start Bloodstrike and it will auto-optimize.
    echo.
)

endlocal
