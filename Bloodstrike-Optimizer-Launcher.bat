@echo off
REM Bloodstrike Optimizer - Launcher (choose web or desktop)
cd /d "%~dp0"

:menu
cls
echo ===============================================
echo  Bloodstrike Optimizer - Launcher
echo ===============================================
echo.
echo  1) Open Web Version (usage-example.html)
echo  2) Launch Desktop Version (portable)
echo  3) Build Desktop App (instructions)
echo  4) Exit

set /p choice=Choose an option (1-4): 

if "%choice%"=="1" (
    start "" "usage-example.html"
    goto :eof
)

if "%choice%"=="2" (
    if exist "RUN.bat" (
        start "" "RUN.bat"
    ) else if exist "dist-portable\Bloodstrike-Optimizer.exe" (
        start "" "dist-portable\Bloodstrike-Optimizer.exe"
    ) else (
        echo Desktop app is not built. Use option 3 to build or place the dist-portable folder.
        pause
    )
    goto :eof
)

if "%choice%"=="3" (
    echo Building desktop app instructions:
    echo  1. Open PowerShell in this folder
    echo  2. Run: npm install
    echo  3. Run: npm run build
    echo After build, check dist-portable folder or use RUN.bat
    pause
    goto :menu
)

if "%choice%"=="4" (
    exit /b
)

echo Invalid choice
pause
goto :menu
