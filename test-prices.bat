@echo off
echo 🔍 Testing course prices for consistency...
echo.

echo 📚 Testing Project Management Fundamentals (33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1)
echo.

echo 💰 Testing price: NGN 50,000 (5,000,000 kobo)
curl -s -X POST "https://hexadigitall.com/api/checkout" ^
     -H "Content-Type: application/json" ^
     -d "{\"33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1\":{\"id\":\"33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1\",\"name\":\"Project Management Fundamentals\",\"price\":5000000,\"currency\":\"NGN\",\"quantity\":1}}"
echo.
echo.

echo 💰 Testing price: NGN 90,000 (9,000,000 kobo)
curl -s -X POST "https://hexadigitall.com/api/checkout" ^
     -H "Content-Type: application/json" ^
     -d "{\"33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1\":{\"id\":\"33fc6abe-ba92-4c0e-beaa-f9d363b0d9f1\",\"name\":\"Project Management Fundamentals\",\"price\":9000000,\"currency\":\"NGN\",\"quantity\":1}}"
echo.
echo.

echo =============================================================
echo.

echo 📚 Testing The Lean Startup: Build Your MVP (d3f6b53f-1b1b-4a0b-b10c-1f2e7ee44788)
echo.

echo 💰 Testing price: NGN 80,000 (8,000,000 kobo)
curl -s -X POST "https://hexadigitall.com/api/checkout" ^
     -H "Content-Type: application/json" ^
     -d "{\"d3f6b53f-1b1b-4a0b-b10c-1f2e7ee44788\":{\"id\":\"d3f6b53f-1b1b-4a0b-b10c-1f2e7ee44788\",\"name\":\"The Lean Startup: Build Your MVP\",\"price\":8000000,\"currency\":\"NGN\",\"quantity\":1}}"
echo.
echo.

echo 🎯 SUMMARY:
echo - Look for "id" field in responses = SUCCESS (correct price)
echo - Look for "Price mismatch" errors = WRONG price, shows expected price
echo - Update Sanity CMS with the correct prices
