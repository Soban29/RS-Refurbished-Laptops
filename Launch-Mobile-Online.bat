@echo off
title RS Refurbished Laptops - Mobile Online Launcher
color 0B
echo ===================================================================
echo     RS Refurbished Laptops - Public Mobile Online Launcher
echo     Works on ANY Mobile Network (4G / 5G / Any Wi-Fi Anywhere)
echo     Helpline: +91 8668848486
echo ===================================================================
echo.

:: 1. Check if server port 5000 is active
echo [1/3] Checking backend database server...
powershell -Command "Test-NetConnection -ComputerName localhost -Port 5000 -InformationLevel Quiet" > nul 2>&1
if %ERRORLEVEL% NEQ 0 (
    echo Starting Express Backend Server...
    start /B node server.js
    timeout /t 3 > nul
) else (
    echo Backend Server is already active on port 5000.
)

:: 2. Open Mobile Access Helper page with QR Code
echo.
echo [2/3] Opening Mobile Access QR Code Dashboard...
start "" "%~dp0MOBILE_ACCESS.html"

:: 3. Start Cloudflare Secure Tunnel
echo.
echo [3/3] Launching Cloudflare Global Edge Tunnel...
echo.
echo ===================================================================
echo Scan the QR code on your mobile screen or share the trycloudflare link!
echo Keep this terminal window open while using the website on your phone.
echo ===================================================================
echo.

"%~dp0cloudflared.exe" tunnel --url http://localhost:5000

pause
