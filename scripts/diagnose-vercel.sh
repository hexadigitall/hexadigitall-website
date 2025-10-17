#!/bin/bash

# Vercel Deployment Diagnostics Script
# This script helps diagnose common build and deployment issues

set -e

echo "================================================"
echo "Vercel Deployment Diagnostics"
echo "================================================"
echo ""

# Color codes for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
NC='\033[0m' # No Color

# Function to print section headers
print_section() {
    echo ""
    echo "================================================"
    echo "$1"
    echo "================================================"
}

# Function to check command status
check_status() {
    if [ $? -eq 0 ]; then
        echo -e "${GREEN}✓ $1${NC}"
        return 0
    else
        echo -e "${RED}✗ $1${NC}"
        return 1
    fi
}

EXIT_CODE=0

# 1. System Information
print_section "1. System Information"
echo "Node version: $(node --version)"
echo "npm version: $(npm --version)"
echo "OS: $(uname -s)"
echo "Architecture: $(uname -m)"

# 2. Environment Variables Check
print_section "2. Environment Variables Check"
echo "Checking for required environment variables..."

required_vars=(
    "NEXT_PUBLIC_SANITY_PROJECT_ID"
    "NEXT_PUBLIC_SANITY_DATASET"
    "NEXT_PUBLIC_SANITY_API_VERSION"
)

for var in "${required_vars[@]}"; do
    if [ -z "${!var}" ]; then
        echo -e "${YELLOW}⚠ $var is not set${NC}"
    else
        echo -e "${GREEN}✓ $var is set${NC}"
    fi
done

# 3. Package Dependencies Check
print_section "3. Package Dependencies"
echo "Checking package.json exists..."
if [ -f "package.json" ]; then
    check_status "package.json found"
else
    echo -e "${RED}✗ package.json not found${NC}"
    EXIT_CODE=1
fi

echo ""
echo "Checking package-lock.json exists..."
if [ -f "package-lock.json" ]; then
    check_status "package-lock.json found"
else
    echo -e "${YELLOW}⚠ package-lock.json not found (using npm install instead of npm ci)${NC}"
fi

# 4. Peer Dependencies Check
print_section "4. Peer Dependencies Check"
echo "Running npm ls to check for unmet peer dependencies..."
echo ""

if npm ls --depth=0 2>&1 | grep -q "UNMET PEER DEPENDENCY\|invalid"; then
    echo -e "${RED}✗ Unmet peer dependencies found:${NC}"
    npm ls --depth=0 2>&1 | grep -E "UNMET|invalid" || true
    EXIT_CODE=1
else
    check_status "No unmet peer dependencies"
fi

# 5. Build Configuration Check
print_section "5. Build Configuration"
echo "Checking Next.js configuration..."
if [ -f "next.config.ts" ] || [ -f "next.config.js" ] || [ -f "next.config.mjs" ]; then
    check_status "Next.js config file found"
else
    echo -e "${RED}✗ Next.js config file not found${NC}"
    EXIT_CODE=1
fi

echo ""
echo "Checking Vercel configuration..."
if [ -f "vercel.json" ]; then
    check_status "vercel.json found"
    echo "Vercel configuration:"
    cat vercel.json | grep -E '"framework"|"buildCommand"|"outputDirectory"' || true
else
    echo -e "${YELLOW}⚠ vercel.json not found (using Vercel defaults)${NC}"
fi

# 6. TypeScript Check
print_section "6. TypeScript Configuration"
if [ -f "tsconfig.json" ]; then
    check_status "tsconfig.json found"
else
    echo -e "${YELLOW}⚠ tsconfig.json not found${NC}"
fi

# 7. Critical Files Check
print_section "7. Critical Files Check"
critical_files=(
    "src/app/layout.tsx"
    "src/app/page.tsx"
    "tailwind.config.ts"
    "postcss.config.mjs"
)

for file in "${critical_files[@]}"; do
    if [ -f "$file" ]; then
        echo -e "${GREEN}✓ $file exists${NC}"
    else
        echo -e "${RED}✗ $file missing${NC}"
        EXIT_CODE=1
    fi
done

# 8. Build Test (Optional)
print_section "8. Build Test (Optional)"
echo "To test the build locally, run:"
echo "  npm run build"
echo ""
echo "To test the production server locally, run:"
echo "  npm run build && npm start"

# 9. Network Connectivity Check
print_section "9. Network Connectivity Check"
echo "Testing connectivity to critical services..."

# Test Google Fonts (not critical, but good to know)
if curl -s --connect-timeout 5 https://fonts.googleapis.com > /dev/null 2>&1; then
    check_status "Google Fonts accessible"
else
    echo -e "${YELLOW}⚠ Google Fonts not accessible (fonts will load at runtime)${NC}"
fi

# Test Sanity CDN
if curl -s --connect-timeout 5 https://cdn.sanity.io > /dev/null 2>&1; then
    check_status "Sanity CDN accessible"
else
    echo -e "${YELLOW}⚠ Sanity CDN not accessible${NC}"
fi

# 10. Summary
print_section "10. Summary"
if [ $EXIT_CODE -eq 0 ]; then
    echo -e "${GREEN}✓ All critical checks passed!${NC}"
    echo ""
    echo "Your project appears ready for Vercel deployment."
    echo ""
    echo "Recommended Vercel settings:"
    echo "  - Framework Preset: Next.js"
    echo "  - Build Command: npm run build"
    echo "  - Output Directory: .next"
    echo "  - Install Command: npm ci"
    echo "  - Node Version: 20.x"
    echo "  - Production Branch: main"
else
    echo -e "${RED}✗ Some checks failed. Please review the output above.${NC}"
    echo ""
    echo "Common fixes:"
    echo "  1. Install dependencies: npm ci"
    echo "  2. Check environment variables are set"
    echo "  3. Ensure all critical files exist"
    echo "  4. Fix any unmet peer dependencies"
fi

echo ""
echo "================================================"
echo "Diagnostics Complete"
echo "================================================"

exit $EXIT_CODE
