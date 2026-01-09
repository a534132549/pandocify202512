@echo off
setlocal
echo ========================================================
echo     Starting Pandocify App (One-Click)
echo ========================================================

:: 1. Start Backend
echo [1/3] Starting Backend Server (Port 4000)...
start "Pandocify Backend" cmd /k "cd backend && echo Checking dependencies... && pip install -r requirements.txt && python main.py"

:: 2. Start Frontend
echo [2/3] Starting Frontend Server (Port 3010)...
if exist node_modules (
    start "Pandocify Frontend" cmd /k "npm.cmd run dev"
) else (
    echo     First time setup: Installing Node modules...
    start "Pandocify Frontend" cmd /k "npm.cmd install && npm.cmd run dev"
)

:: 3. Open Browser
echo [3/3] Waiting for servers to initialize (5 seconds)...
timeout /t 5 /nobreak >nul

echo.
echo ========================================================
echo   Services Running!
echo   Opening: http://localhost:3010
echo ========================================================
echo.

start http://localhost:3010

echo You can minimize this window, but DO NOT CLOSE IT.
pause
