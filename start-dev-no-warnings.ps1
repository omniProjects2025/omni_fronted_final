# PowerShell script to start Angular development server without deprecation warnings
# This script suppresses Node.js deprecation warnings while running the development server

Write-Host "Starting Angular development server without deprecation warnings..." -ForegroundColor Green
Write-Host "This suppresses the util._extend deprecation warning from OwlCarousel2" -ForegroundColor Yellow

# Set environment variable to suppress deprecation warnings
$env:NODE_OPTIONS = "--no-deprecation"

# Start the Angular development server
npm run start-dev

# Clean up environment variable
Remove-Item env:NODE_OPTIONS -ErrorAction SilentlyContinue
