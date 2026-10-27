@echo off
title MERN E-Commerce - Backend Server
cd /d "%~dp0server"
echo ========================================================
echo   Starting MERN E-Commerce Backend (Port 5000)...
echo ========================================================
npm run dev
pause
