@echo off
REM Bloodstrike Optimizer + Game Launcher
REM Double-click to launch both optimizer and Bloodstrike!

setlocal enabledelayedexpansion
cd /d "%~dp0"

echo.
echo ===============================================
echo  Bloodstrike Optimizer + Game Launcher
echo ===============================================
echo.

REM Check for Bloodstrike path config file
set "config_file=%temp%\bloodstrike-path.txt"
set "game_path="

if exist "%config_file%" (
    for /f "delims=" %%a in ('type "%config_file%"') do set "game_path=%%a"
)

REM If game path not configured, ask user
if "!game_path!"=="" (
    echo.
    echo First time setup - Need to find your Bloodstrike game
    echo.
    echo Option 1: Type the full path to Bloodstrike.exe
    echo Option 2: Drag Bloodstrike.exe onto this window and paste here
    echo.
    set /p game_path="Enter full path to Bloodstrike.exe: "
    
    if not exist "!game_path!" (
        echo.
        echo ERROR: File not found
        echo Provided path: !game_path!
        pause
        exit /b 1
    )
    
    REM Save path for future use
    echo !game_path! > "%config_file%"
    echo ✓ Game path saved for next time
    echo.
)

echo Launching optimizer...
if exist "dist-portable\Bloodstrike-Optimizer.exe" (
    start "" dist-portable\Bloodstrike-Optimizer.exe
    echo ✓ Optimizer launched
    timeout /t 1 >nul
) else (
    echo ERROR: Bloodstrike-Optimizer.exe not found
    pause
    exit /b 1
)

echo.
echo Launching Bloodstrike game...
start "" "!game_path!"
echo ✓ Bloodstrike launched
echo.
echo ✓ Both applications running!
echo.
echo Optimizer will auto-detect and optimize Bloodstrike...
timeout /t 3
