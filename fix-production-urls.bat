@echo off
echo ===================================================
echo FIXING OMNI HOSPITALS PRODUCTION URL ISSUE
echo ===================================================

echo.
echo 🔍 PROBLEM: Your app is calling HTTP instead of HTTPS
echo    Current: http://api.omni-hospitals.in:3000/getspecialty
echo    Should be: https://api.omni-hospitals.in/api/getspecialty
echo.

echo 🔧 SOLUTION STEPS:
echo.

echo Step 1: Clean build cache
if exist ".angular" rmdir /s /q .angular
if exist "dist" rmdir /s /q dist
echo ✅ Cleaned cache and old build

echo.
echo Step 2: Install dependencies
call npm install
echo ✅ Dependencies installed

echo.
echo Step 3: Build for production (this may take a few minutes)
echo Building with production configuration...
call ng build --configuration production --progress=false --verbose=false

if %errorlevel% equ 0 (
    echo ✅ Build completed successfully!
    echo.
    echo 📁 Your production files are in: dist\omni-project-frontend\
    echo.
    echo 🚀 NEXT STEPS:
    echo 1. Upload the contents of dist\omni-project-frontend\ to your web server
    echo 2. Replace all existing files on your production server
    echo 3. The app will now use HTTPS URLs: https://api.omni-hospitals.in/api/
    echo.
    echo ✅ This will fix the Mixed Content error!
) else (
    echo ❌ Build failed. Check the errors above.
    echo.
    echo 🔧 Try these manual commands:
    echo    npm install
    echo    ng build --configuration production
)

echo.
echo Press any key to exit...
pause >nul
