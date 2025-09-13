# OMNI Hospitals Production API Testing Script

Write-Host "🌐 Testing Production API Endpoints" -ForegroundColor Green
Write-Host "====================================" -ForegroundColor Green

# List of URLs to test
$urls = @(
    "http://api.omni-hospitals.in",
    "https://api.omni-hospitals.in", 
    "http://api.omni-hospitals.in:3000",
    "http://api.omni-hospitals.in:8080",
    "http://api.omni-hospitals.in/health",
    "https://api.omni-hospitals.in/health",
    "http://api.omni-hospitals.in:3000/health",
    "http://api.omni-hospitals.in/api/health",
    "http://api.omni-hospitals.in:3000/api/health",
    "http://api.omni-hospitals.in/getspecialty",
    "http://api.omni-hospitals.in:3000/getspecialty",
    "http://api.omni-hospitals.in/api/getspecialty",
    "http://api.omni-hospitals.in:3000/api/getspecialty"
)

$workingUrls = @()
$failedUrls = @()

foreach ($url in $urls) {
    Write-Host "`n🔍 Testing: $url" -ForegroundColor Yellow
    
    try {
        $response = Invoke-WebRequest -Uri $url -TimeoutSec 10 -UseBasicParsing
        Write-Host "✅ SUCCESS: Status $($response.StatusCode)" -ForegroundColor Green
        
        # Check if response contains expected content
        if ($response.Content -like "*status*" -or $response.Content -like "*message*" -or $response.Content -like "*specialty*") {
            Write-Host "✅ Response contains expected data" -ForegroundColor Green
            $workingUrls += $url
        } else {
            Write-Host "⚠️  Response doesn't contain expected API data" -ForegroundColor Yellow
        }
        
        # Show first 100 characters of response
        $preview = $response.Content.Substring(0, [Math]::Min(100, $response.Content.Length))
        Write-Host "📄 Preview: $preview..." -ForegroundColor Cyan
        
    }
    catch {
        $errorMessage = $_.Exception.Message
        Write-Host "❌ FAILED: $errorMessage" -ForegroundColor Red
        $failedUrls += $url
    }
}

Write-Host "`n📊 SUMMARY" -ForegroundColor Green
Write-Host "==========" -ForegroundColor Green

if ($workingUrls.Count -gt 0) {
    Write-Host "`n✅ WORKING URLS ($($workingUrls.Count)):" -ForegroundColor Green
    foreach ($url in $workingUrls) {
        Write-Host "   $url" -ForegroundColor Green
    }
    
    Write-Host "`n💡 RECOMMENDED PRODUCTION CONFIG:" -ForegroundColor Yellow
    $bestUrl = $workingUrls[0]
    if ($bestUrl -like "*:3000*") {
        Write-Host "   Use: '$bestUrl' in your production environment" -ForegroundColor Cyan
    } else {
        Write-Host "   Use: '$bestUrl' in your production environment" -ForegroundColor Cyan
    }
} else {
    Write-Host "`n❌ NO WORKING URLS FOUND" -ForegroundColor Red
    Write-Host "   Your production server appears to be down or misconfigured" -ForegroundColor Yellow
}

Write-Host "`n❌ FAILED URLS ($($failedUrls.Count)):" -ForegroundColor Red
foreach ($url in $failedUrls) {
    Write-Host "   $url" -ForegroundColor Red
}

Write-Host "`n🔧 NEXT STEPS:" -ForegroundColor Yellow
if ($workingUrls.Count -gt 0) {
    Write-Host "1. Update your production environment.prod.ts with the working URL" -ForegroundColor White
    Write-Host "2. Build your Angular app: ng build --configuration production" -ForegroundColor White
    Write-Host "3. Deploy the built files to your production server" -ForegroundColor White
} else {
    Write-Host "1. Check if your Node.js server is running on the production server" -ForegroundColor White
    Write-Host "2. Verify DNS configuration for api.omni-hospitals.in" -ForegroundColor White
    Write-Host "3. Check server logs for errors" -ForegroundColor White
    Write-Host "4. Ensure firewall allows HTTP/HTTPS traffic" -ForegroundColor White
}

Write-Host "`n🏥 OMNI Hospitals API Testing Complete!" -ForegroundColor Green

