# 🚀 Quick Start Guide - Curriculum System

## View Curricula Right Now

### Option 1: Using the Helper Script (Easiest)
```bash
./view-curriculum.sh
```
Then select from the menu!

### Option 2: Open Directly in Browser (files live in `public/curriculums`)
```bash
# For Linux/WSL
xdg-open public/curriculums/curriculum-azure-security-az500.html
xdg-open public/curriculums/curriculum-linux-shell-scripting.html

# For macOS
open public/curriculums/curriculum-azure-security-az500.html
open public/curriculums/curriculum-linux-shell-scripting.html

# For Windows
start public/curriculums/curriculum-azure-security-az500.html
start public/curriculums/curriculum-linux-shell-scripting.html
```

### Option 3: Manual
Open the HTML files from `public/curriculums` in your browser.

## Generate PDF Versions

### 1. Install Puppeteer (First Time Only)
```bash
npm install puppeteer
```

### 2. Generate PDFs
```bash
node scripts/generate-curriculum-pdfs.mjs
```

This creates (in `public/curriculums`):
- ✅ `curriculum-azure-security-az500.pdf`
- ✅ `curriculum-linux-shell-scripting.pdf`

## What You Get

### Azure Security Technologies (AZ-500)
- 📄 **48KB HTML** - Beautiful, interactive curriculum
- 🎓 16 weeks of detailed content
- 🔬 16 hands-on lab exercises
- 🚀 3 major capstone projects
- 📚 15+ curated learning resources
- 🎨 Microsoft Azure blue theme

### Linux Administration & Shell Scripting Pro  
- 📄 **53KB HTML** - Terminal-inspired design
- 🐧 10 weeks of intensive training
- 💻 20+ code examples with syntax highlighting
- 🔬 10 hands-on labs
- 🚀 4 comprehensive projects
- 🎨 Ubuntu orange & terminal theme

## Send to Students

### Email Package
1. Generate PDFs (see above)
2. Attach PDFs to welcome email
3. Include personalized welcome message

### Example Email Template:
```
Subject: Welcome to [Course Name] - Your Curriculum Guide

Hi [Student Name],

Welcome to [Course Name]! 🎉

Attached is your comprehensive curriculum guide covering everything you'll 
learn over the next [X] weeks. This document includes:

✅ Weekly learning objectives and topics
✅ Hands-on lab exercises
✅ Project requirements
✅ Recommended resources
✅ Study tips for success

Review this document before your first session to get familiar with the 
journey ahead. We're excited to have you!

Best regards,
Hexadigitall Technologies Team
```

## Customize for New Courses

1. Use existing curricula as templates
2. Update content, colors, and structure
3. Add to PDF generator script
4. Generate and distribute!

## Need Help?

See the full documentation in `CURRICULUM_SYSTEM_README.md`

---

**Ready to impress your students?** 🎓✨
