@echo off
echo ===================================================
echo   FIXING FRONTEND AND STARTING APP
echo ===================================================

echo 1. Fixing/Installing Node Dependencies...
call npm install
if %errorlevel% neq 0 (
    echo Error: npm install failed.
    pause
    exit /b %errorlevel%
)

echo.
echo 2. Starting Frontend Server...
echo Please ensure the Backend window is still open.
echo.
call npm run dev
pause
