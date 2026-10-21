@echo off
title Push RS Refurbished Laptops to GitHub
color 0B
echo ===================================================================
echo     Push RS Refurbished Laptops to GitHub
echo     Repository: https://github.com/Soban29/RS-Refurbished-Laptops.git
echo ===================================================================
echo.
echo GitHub requires a Personal Access Token (PAT) for pushing code.
echo.
echo If you don't have a token yet:
echo 1. Opening GitHub Token generator in your browser...
start "" "https://github.com/settings/tokens/new?scopes=repo&description=RS-Refurbished-Deployment"
echo 2. Scroll to the bottom and click "Generate token".
echo 3. Copy the token (starts with ghp_...).
echo.
echo ===================================================================
set /p GITHUB_PAT="Paste your GitHub Token (starts with ghp_...) and press Enter: "

if "%GITHUB_PAT%"=="" (
    echo.
    echo [ERROR] No token entered.
    pause
    exit /b
)

echo.
echo [1/2] Authenticating with GitHub...
"C:\Users\DELL\mingit\cmd\git.exe" remote set-url origin https://%GITHUB_PAT%@github.com/Soban29/RS-Refurbished-Laptops.git

echo [2/2] Pushing main branch to GitHub...
"C:\Users\DELL\mingit\cmd\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo  SUCCESS! Your project is now pushed to GitHub!
    echo ===================================================================
    echo.
    echo Your repository: https://github.com/Soban29/RS-Refurbished-Laptops
    echo.
    echo Now open Render to host it 24/7 for FREE:
    echo 1. Go to: https://dashboard.render.com
    echo 2. Click "New +" -> "Web Service"
    echo 3. Select 'Soban29/RS-Refurbished-Laptops'
    echo 4. Click "Create Web Service"
    echo ===================================================================
) else (
    echo.
    echo [ERROR] Push failed. Please check your token permissions (must have 'repo' checked).
)

:: Clean up token from remote url so credentials aren't saved in plaintext
"C:\Users\DELL\mingit\cmd\git.exe" remote set-url origin https://github.com/Soban29/RS-Refurbished-Laptops.git

pause
