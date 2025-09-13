# Start OMNI Hospitals Development Servers

Write-Host "🚀 Starting OMNI Hospitals Development Environment..." -ForegroundColor Green

# Kill any existing processes on ports 3000 and 4200
Write-Host "🔍 Checking for existing processes..." -ForegroundColor Yellow

$processes3000 = netstat -ano | findstr ":3000" | ForEach-Object { ($_ -split '\s+')[4] } | Where-Object { $_ -ne "" } | Select-Object -Unique
$processes4200 = netstat -ano | findstr ":4200" | ForEach-Object { ($_ -split '\s+')[4] } | Where-Object { $_ -ne "" } | Select-Object -Unique

if ($processes3000) {
    Write-Host "⚡ Killing processes on port 3000..." -ForegroundColor Yellow
    $processes3000 | ForEach-Object { taskkill /PID $_ /F 2>$null }
}

if ($processes4200) {
    Write-Host "⚡ Killing processes on port 4200..." -ForegroundColor Yellow
    $processes4200 | ForEach-Object { taskkill /PID $_ /F 2>$null }
}

Start-Sleep -Seconds 2

# Start Backend Server
Write-Host "🔧 Starting Backend Server (Node.js)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\omni_new\omniServiceBackend'; Write-Host '🚀 Backend Server Starting...' -ForegroundColor Green; node server.js"

# Wait for backend to start
Start-Sleep -Seconds 5

# Start Frontend Server
Write-Host "🌐 Starting Frontend Server (Angular)..." -ForegroundColor Cyan
Start-Process powershell -ArgumentList "-NoExit", "-Command", "cd 'D:\omni_final'; Write-Host '🚀 Frontend Server Starting...' -ForegroundColor Green; ng serve --port 4200"

# Wait and verify
Start-Sleep -Seconds 10

Write-Host "✅ Servers should be starting..." -ForegroundColor Green
Write-Host "🔗 Backend: http://localhost:3000" -ForegroundColor White
Write-Host "🔗 Frontend: http://localhost:4200" -ForegroundColor White
Write-Host ""
Write-Host "📝 Check the opened terminal windows for server status" -ForegroundColor Yellow


