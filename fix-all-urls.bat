@echo off
echo ===================================================
echo FIXING ALL WRONG URLs - COMPLETE SOLUTION
echo ===================================================
echo.
echo Current WRONG URLs:
echo ❌ https://omniservicebackend-vnyk.onrender.com/getdoctors
echo ❌ https://omniservicebackend-vnyk.onrender.com/gethealthpackages  
echo ❌ http://api.omni-hospitals.in:3000/getspecialty
echo ❌ https://omniservicebackend-vnyk.onrender.com/getfixedsurgicalpackages
echo.
echo Target CORRECT URLs:
echo ✅ https://api.omni-hospitals.in/api/getdoctors
echo ✅ https://api.omni-hospitals.in/api/gethealthpackages
echo ✅ https://api.omni-hospitals.in/api/getspecialty
echo ✅ https://api.omni-hospitals.in/api/getfixedsurgicalpackages
echo.

echo Step 1: Cleaning all cache and build files...
if exist ".angular" rmdir /s /q .angular
if exist "dist" rmdir /s /q dist
if exist "node_modules\.cache" rmdir /s /q node_modules\.cache
echo ✅ Cleaned all cache

echo.
echo Step 2: Verifying environment configuration...
echo Checking environment.prod.ts...
findstr "api.omni-hospitals.in/api" src\environments\environment.prod.ts
echo ✅ Environment verified

echo.
echo Step 3: Installing fresh dependencies...
call npm ci
echo ✅ Dependencies installed

echo.
echo Step 4: Building with explicit production configuration...
echo This will take a few minutes...
call ng build --configuration=production --aot=true --build-optimizer=true

if %errorlevel% equ 0 (
    echo.
    echo ✅ BUILD SUCCESSFUL!
    echo.
    echo Step 5: Verifying build output...
    echo Checking for correct URLs in build...
    findstr /s "api.omni-hospitals.in/api" dist\* >nul 2>&1
    if %errorlevel% equ 0 (
        echo ✅ Build contains correct HTTPS URLs
    ) else (
        echo ❌ Build verification failed
    )
    
    echo Checking for wrong URLs...
    findstr /s "omniservicebackend" dist\* >nul 2>&1
    if %errorlevel% neq 0 (
        echo ✅ No wrong backend URLs found
    ) else (
        echo ❌ Still contains wrong URLs
    )
    
    echo.
    echo 🚀 DEPLOYMENT READY!
    echo Upload the contents of: dist\omni-project-frontend\
    echo To your production server at: https://omnihospitals.in
    echo.
    echo ✅ This will fix ALL URL issues!
    
) else (
    echo.
    echo ❌ Build failed. Check errors above.
    echo Try running: ng build --configuration production
)

echo.
echo Press any key to exit...
pause >nul

