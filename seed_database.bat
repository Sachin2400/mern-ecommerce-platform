@echo off
title Seed MERN E-Commerce Database
cd /d "%~dp0\server"
echo =====================================================================
echo           SEEDING DATABASE WITH SAMPLE PRODUCTS & USERS             
echo =====================================================================
echo.
npm run seed
echo.
pause

