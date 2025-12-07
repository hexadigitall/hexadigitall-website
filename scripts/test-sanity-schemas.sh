#!/bin/bash
# scripts/test-sanity-schemas.sh
# Script to test Sanity schemas progressively

echo "🔍 Sanity Schema Testing Tool"
echo "═══════════════════════════════════════════════════════════════"
echo ""

# Backup original config
echo "📋 Step 1: Backing up original sanity.config.ts..."
cp sanity.config.ts sanity.config.ts.backup
echo "✅ Backup created"
echo ""

# Use test config
echo "📋 Step 2: Using test configuration..."
cp sanity.config.test.ts sanity.config.ts
echo "✅ Test config in place"
echo ""

echo "📋 Step 3: Testing with minimal schemas..."
echo "   Starting dev server with test config"
echo "   Open http://localhost:3000/studio in your browser"
echo ""
echo "⚠️  Instructions:"
echo "   1. Check if Studio loads without errors"
echo "   2. If it loads, the error is in one of the excluded schemas"
echo "   3. If it fails, the error is in one of the included schemas"
echo "   4. Press Ctrl+C to stop the server when done"
echo ""
echo "Starting server..."
echo ""

npm run dev
