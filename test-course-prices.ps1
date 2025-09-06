# PowerShell script to test course prices
Write-Host "🔍 Checking all courses for price consistency..." -ForegroundColor Cyan

# Test data for known courses
$testCourses = @(
    @{
        id = "33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1"
        name = "Project Management Fundamentals"
        testPrices = @(5000000, 9000000)  # Test 50k and 90k in kobo
    },
    @{
        id = "d3f6b53f-1b1b-4a0b-b10c-1f2e7ee44788"
        name = "The Lean Startup: Build Your MVP"
        testPrices = @(8000000, 10000000, 15000000)  # Test different prices
    }
)

foreach ($course in $testCourses) {
    Write-Host ""
    Write-Host "📚 Testing course: $($course.name)" -ForegroundColor Yellow
    Write-Host "🔑 Course ID: $($course.id)" -ForegroundColor Gray
    
    $foundCorrectPrice = $false
    
    foreach ($testPrice in $course.testPrices) {
        if ($foundCorrectPrice) { break }
        
        $priceInNGN = $testPrice / 100
        Write-Host ""
        Write-Host "💰 Testing price: ₦$($priceInNGN.ToString('N0')) ($testPrice kobo)" -ForegroundColor White
        
        # Create cart data
        $cartData = @{
            $course.id = @{
                id = $course.id
                name = $course.name
                price = $testPrice
                currency = "NGN"
                quantity = 1
            }
        }
        
        $json = $cartData | ConvertTo-Json -Depth 3
        
        try {
            $response = Invoke-RestMethod -Uri "https://hexadigitall.com/api/checkout" -Method POST -Body $json -ContentType "application/json" -ErrorAction Stop
            
            if ($response.id) {
                Write-Host "✅ SUCCESS: Price ₦$($priceInNGN.ToString('N0')) is correct!" -ForegroundColor Green
                Write-Host "🔗 Session ID: $($response.id)" -ForegroundColor Green
                $foundCorrectPrice = $true
            }
        }
        catch {
            $errorResponse = $_.Exception.Response
            if ($errorResponse) {
                $reader = New-Object System.IO.StreamReader($errorResponse.GetResponseStream())
                $errorBody = $reader.ReadToEnd() | ConvertFrom-Json
                
                if ($errorBody.error -and $errorBody.error.Contains("Price mismatch")) {
                    Write-Host "❌ MISMATCH: $($errorBody.error)" -ForegroundColor Red
                    
                    # Try to extract expected price
                    if ($errorBody.error -match "Expected: ₦(\d+)") {
                        $expectedPrice = [int]$matches[1]
                        Write-Host "💡 Expected price: ₦$($expectedPrice.ToString('N0'))" -ForegroundColor Cyan
                    }
                } else {
                    Write-Host "⚠️  OTHER ERROR: $($errorBody.error)" -ForegroundColor Yellow
                }
            } else {
                Write-Host "💥 Network error: $($_.Exception.Message)" -ForegroundColor Red
            }
        }
    }
    
    if (-not $foundCorrectPrice) {
        Write-Host "🔍 No correct price found in test range. Check the error messages above for the expected price." -ForegroundColor Yellow
    }
    
    Write-Host ""
    Write-Host ("=" * 60) -ForegroundColor DarkGray
}

Write-Host ""
Write-Host "🎯 SUMMARY:" -ForegroundColor Cyan
Write-Host "- Look for SUCCESS messages to identify correct prices" -ForegroundColor White
Write-Host "- Look for MISMATCH messages to identify incorrect prices" -ForegroundColor White
Write-Host "- Update your Sanity CMS with the correct prices" -ForegroundColor White
