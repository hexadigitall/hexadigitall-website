#!/bin/bash
# scripts/setup-migration.sh
# Quick setup script for course migration

echo "🚀 Course Migration Setup"
echo "═════════════════════════════════════════════════════════════════"
echo ""

# Check if .env.local exists
if [ ! -f .env.local ]; then
    echo "📝 Creating .env.local from .env.example..."
    cp .env.example .env.local
    echo "✅ Created .env.local"
    echo ""
    echo "⚠️  IMPORTANT: Edit .env.local and add your Sanity credentials:"
    echo "   - SANITY_API_TOKEN (required for migration)"
    echo ""
    echo "Get your token from: https://sanity.io/manage"
    echo "Navigate to: Your Project → API → Tokens"
    echo "Create a token with 'Editor' or 'Admin' permissions"
    echo ""
else
    echo "✅ .env.local already exists"
    echo ""
fi

# Check if SANITY_API_TOKEN is set
if grep -q "SANITY_API_TOKEN=your_write_token_here" .env.local 2>/dev/null || \
   grep -q "SANITY_API_TOKEN=$" .env.local 2>/dev/null || \
   ! grep -q "SANITY_API_TOKEN=" .env.local 2>/dev/null; then
    echo "⚠️  WARNING: SANITY_API_TOKEN is not set in .env.local"
    echo ""
    echo "Please edit .env.local and replace:"
    echo "   SANITY_API_TOKEN=your_write_token_here"
    echo "With your actual Sanity API token."
    echo ""
    echo "Without this, the migration cannot proceed."
    echo ""
else
    echo "✅ SANITY_API_TOKEN appears to be set"
    echo ""
fi

echo "📚 Next Steps:"
echo "═════════════════════════════════════════════════════════════════"
echo ""
echo "1. Ensure your Sanity credentials are in .env.local"
echo ""
echo "2. Validate the environment (safe, no changes):"
echo "   npm run migrate:courses:validate"
echo ""
echo "3. Review the output and verify courses are detected"
echo ""
echo "4. Run the migration:"
echo "   npm run migrate:courses"
echo ""
echo "5. Read the full guide:"
echo "   cat docs/COURSE_MIGRATION_GUIDE.md"
echo ""
echo "═════════════════════════════════════════════════════════════════"
