@echo off
title MERN E-Commerce Launcher
cd /d "%~dp0"

echo =====================================================================
echo              MERN STACK E-COMMERCE APPLICATION LAUNCHER              
echo =====================================================================
echo.
echo  [1/2] Launching Backend Server (Port 5000)...
start "MERN Backend (Port 5000)" cmd /k "cd /d "%~dp0server" && npm run dev"

echo  [2/2] Launching React Frontend (Port 3000)...
start "MERN Frontend (Port 3000)" cmd /k "cd /d "%~dp0client" && npm start"

echo.
echo =====================================================================
echo  Both windows have been opened!
echo  Please keep both terminal windows open while using the application.
echo.
echo  - Backend API: http://localhost:5000
echo  - Frontend UI: http://localhost:3000
echo =====================================================================
echo.
pause
