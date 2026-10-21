@echo off
title RS Refurbished Laptops & Services Server
color 0B
echo ========================================================
echo   Starting RS Refurbished Laptops & Services Web App
echo   Helpline: +91 8668848486
echo ========================================================
echo.
echo Opening website in your default browser...
start http://localhost:5000
echo.
echo Starting Database Backend Server on port 5000...
node server.js
pause
