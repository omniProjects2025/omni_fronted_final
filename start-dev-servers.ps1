# OMNI Hospitals Development Servers Startup Script

Write-Host "🏥 OMNI Hospitals Development Environment Startup" -ForegroundColor Green
Write-Host "=================================================" -ForegroundColor Green

# Function to check if a port is in use
function Test-Port {
    param([int]$Port)
    $connection = Test-NetConnection -ComputerName localhost -Port $Port -InformationLevel Quiet -WarningAction SilentlyContinue
    return $connection
}

# Check if backend is running
Write-Host "`n🔍 Checking Backend Server (Port 3000)..." -ForegroundColor Yellow
if (Test-Port -Port 3000) {
    Write-Host "✅ Backend server is already running on port 3000" -ForegroundColor Green
    
    # Test backend health
    try {
        $response = Invoke-RestMethod -Uri "http://localhost:3000/health" -Method GET
        Write-Host "✅ Backend health check passed: $($response.message)" -ForegroundColor Green
        
        # Test API endpoint
        $apiResponse = Invoke-RestMethod -Uri "http://localhost:3000/api/getspecialty" -Method GET
        Write-Host "✅ API endpoint working: Found $($apiResponse.SpecialtyData.Count) specialty records" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Backend server not responding properly: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 Try restarting the backend server" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Backend server is not running on port 3000" -ForegroundColor Red
    Write-Host "💡 Please start the backend server first:" -ForegroundColor Yellow
    Write-Host "   cd D:\omni_new\omniServiceBackend" -ForegroundColor Cyan
    Write-Host "   npm run dev" -ForegroundColor Cyan
    Write-Host ""
    Read-Host "Press Enter after starting the backend server..."
}

# Check if frontend is running
Write-Host "`n🔍 Checking Frontend Server (Port 4200)..." -ForegroundColor Yellow
if (Test-Port -Port 4200) {
    Write-Host "✅ Frontend server is already running on port 4200" -ForegroundColor Green
    
    # Test proxy
    try {
        $proxyResponse = Invoke-RestMethod -Uri "http://localhost:4200/api/health" -Method GET
        Write-Host "✅ Proxy working: $($proxyResponse.message)" -ForegroundColor Green
    }
    catch {
        Write-Host "❌ Proxy not working: $($_.Exception.Message)" -ForegroundColor Red
        Write-Host "💡 The Angular server might be running without proxy configuration" -ForegroundColor Yellow
    }
} else {
    Write-Host "❌ Frontend server is not running on port 4200" -ForegroundColor Red
    Write-Host "💡 Starting Angular development server with proxy..." -ForegroundColor Yellow
    
    # Start Angular with proxy
    Write-Host "🚀 Starting ng serve..." -ForegroundColor Green
    Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\omni_final'; ng serve --port 4200"
    
    Write-Host "⏳ Waiting for Angular server to start..." -ForegroundColor Yellow
    Start-Sleep -Seconds 15
    
    # Test if it started
    if (Test-Port -Port 4200) {
        Write-Host "✅ Frontend server started successfully!" -ForegroundColor Green
        
        # Test proxy
        try {
            Start-Sleep -Seconds 5  # Give proxy time to initialize
            $proxyResponse = Invoke-RestMethod -Uri "http://localhost:4200/api/health" -Method GET
            Write-Host "✅ Proxy is working: $($proxyResponse.message)" -ForegroundColor Green
        }
        catch {
            Write-Host "⚠️  Proxy might still be initializing. Please wait a moment and try again." -ForegroundColor Yellow
        }
    } else {
        Write-Host "❌ Failed to start frontend server" -ForegroundColor Red
    }
}

Write-Host "`n🎉 Setup Summary:" -ForegroundColor Green
Write-Host "==================" -ForegroundColor Green
Write-Host "Backend:  http://localhost:3000" -ForegroundColor Cyan
Write-Host "Frontend: http://localhost:4200" -ForegroundColor Cyan
Write-Host "API Test: http://localhost:4200/api/health" -ForegroundColor Cyan

Write-Host "`n🔧 If you're still getting 404 errors:" -ForegroundColor Yellow
Write-Host "1. Make sure both servers are running" -ForegroundColor White
Write-Host "2. Check browser console for detailed error messages" -ForegroundColor White
Write-Host "3. Try accessing http://localhost:4200/api/health directly" -ForegroundColor White
Write-Host "4. Check the Angular CLI terminal for proxy logs" -ForegroundColor White

Write-Host "`n✨ Happy coding! ✨" -ForegroundColor Green



