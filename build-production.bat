@echo off
REM Production Build Script for OMNI Hospitals Frontend
REM This script ensures proper production build with HTTPS API endpoints

echo 🔧 Building OMNI Hospitals Frontend for Production...
echo ======================================================

REM Clean previous builds
echo 🧹 Cleaning previous builds...
if exist dist rmdir /s /q dist

REM Verify environment configuration
echo 🔍 Verifying environment configuration...
echo Production environment should use HTTPS endpoints:
findstr "apiBaseUrl" src\environments\environment.prod.ts
findstr "omniApiUrl" src\environments\environment.prod.ts

REM Install dependencies (if needed)
echo 📦 Installing dependencies...
call npm ci

REM Build for production with explicit configuration
echo 🏗️ Building for production...
call ng build --configuration production --aot --output-hashing=all --source-map=false --optimization=true

REM Check if build was successful
if %errorlevel% equ 0 (
    echo ✅ Production build completed successfully!
    echo 📁 Build output: dist\omni-project-frontend\
    
    echo 🔍 Verifying build files...
    dir dist\omni-project-frontend\
    
    echo 🌐 Environment verification:
    echo - Make sure your backend API is running on HTTPS
    echo - Backend should be at: https://api.omni-hospitals.in
    echo - CORS should allow: https://omni-hospitals.in
    
) else (
    echo ❌ Build failed! Check the errors above.
    exit /b 1
)
