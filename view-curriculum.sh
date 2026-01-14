#!/bin/bash

# Curriculum Viewer Helper Script
# Makes it easy to view curricula in browser

echo "🎓 HexaDigitall Curriculum Viewer"
echo "=================================="
echo ""
echo "Select a curriculum to view:"
echo ""
echo "1) Azure Security Technologies (AZ-500)"
echo "2) Linux Administration & Shell Scripting Pro"
echo "3) Generate PDFs"
echo "4) Exit"
echo ""
read -p "Enter your choice (1-4): " choice

case $choice in
  1)
    echo "Opening Azure Security curriculum..."
    if command -v xdg-open &> /dev/null; then
      xdg-open public/curriculums/curriculum-azure-security-az500.html
    elif command -v open &> /dev/null; then
      open public/curriculums/curriculum-azure-security-az500.html
    else
      echo "Please open public/curriculums/curriculum-azure-security-az500.html in your browser"
    fi
    ;;
  2)
    echo "Opening Linux curriculum..."
    if command -v xdg-open &> /dev/null; then
      xdg-open public/curriculums/curriculum-linux-shell-scripting.html
    elif command -v open &> /dev/null; then
      open public/curriculums/curriculum-linux-shell-scripting.html
    else
      echo "Please open public/curriculums/curriculum-linux-shell-scripting.html in your browser"
    fi
    ;;
  3)
    echo "Generating PDFs..."
    if command -v node &> /dev/null; then
      node scripts/generate-curriculum-pdfs.mjs
    else
      echo "Error: Node.js not found. Please install Node.js"
    fi
    ;;
  4)
    echo "Goodbye!"
    exit 0
    ;;
  *)
    echo "Invalid choice. Please run the script again."
    exit 1
    ;;
esac
