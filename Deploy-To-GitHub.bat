@echo off
title Push RS Refurbished Laptops to GitHub
color 0B
echo ===================================================================
echo     Push RS Refurbished Laptops to GitHub for 24/7 Cloud Hosting
echo     Sant Tukaram Nagar, Pimpri, Pune 411018, Maharashtra
echo ===================================================================
echo.
echo Please create a new empty repository on https://github.com/new
echo (Do NOT add README or .gitignore on GitHub - your project already has them)
echo.
set /p REPO_URL="Paste your GitHub Repository URL here (e.g. https://github.com/username/rs-refurbished-laptops.git): "

if "%REPO_URL%"=="" (
    echo.
    echo [ERROR] No repository URL was entered.
    pause
    exit /b
)

echo.
echo [1/3] Configuring Git remote origin...
"C:\Users\DELL\mingit\cmd\git.exe" remote remove origin 2>nul
"C:\Users\DELL\mingit\cmd\git.exe" remote add origin %REPO_URL%

echo [2/3] Setting branch to main...
"C:\Users\DELL\mingit\cmd\git.exe" branch -M main

echo [3/3] Pushing project files to GitHub...
"C:\Users\DELL\mingit\cmd\git.exe" push -u origin main

if %ERRORLEVEL% EQU 0 (
    echo.
    echo ===================================================================
    echo  SUCCESS! Your code is now safely on GitHub.
    echo ===================================================================
    echo.
    echo Next Steps for FREE 24/7 Hosting on Render:
    echo 1. Open: https://dashboard.render.com
    echo 2. Click "New +" -> "Web Service"
    echo 3. Select your GitHub repository
    echo 4. Click "Create Web Service"
    echo.
    echo Render will detect 'render.yaml', build your site, and give you
    echo a permanent 24/7 URL like: https://rs-refurbished-laptops.onrender.com
    echo ===================================================================
) else (
    echo.
    echo [NOTE] If GitHub asked for login, please sign in through your browser
    echo or personal access token and run this script again.
)

pause
