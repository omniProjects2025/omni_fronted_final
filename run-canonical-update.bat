@echo off
echo 🚀 Starting Canonical Tags Update Script...
echo.

REM Check if PowerShell is available
powershell -Command "Get-Host" >nul 2>&1
if %errorlevel% neq 0 (
    echo ❌ PowerShell is not available. Please install PowerShell or use Node.js script instead.
    echo.
    echo To use Node.js script, run: node update-canonical-tags.js
    pause
    exit /b 1
)

REM Run the PowerShell script
powershell -ExecutionPolicy Bypass -File "update-canonical-tags.ps1"

echo.
echo ✅ Script execution completed!
pause
