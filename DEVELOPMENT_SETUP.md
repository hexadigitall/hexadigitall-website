# Hexadigitall Development Setup Guide

## Prerequisites

### 1. Install Node.js
**Current Issue**: Node.js is not installed or not in system PATH.

**Solution**:
1. Download Node.js from [https://nodejs.org](https://nodejs.org)
2. Install the LTS version (recommended)
3. Verify installation:
   ```bash
   node --version
   npm --version
   ```

### 2. Install Dependencies
Once Node.js is installed:
```bash
npm install
```

### 3. Run Development Server
```bash
npm run dev
```
The site will be available at: http://localhost:3000

## Issues Fixed

### ✅ Footer Logo Issue
**Problem**: Footer logo appeared as a plain white box.
**Fix Applied**: Removed `brightness-0 invert` CSS classes from footer logo in `src/components/layout/Footer.tsx`.

### ✅ Sanity Client Robustness  
**Problem**: Potential crashes if Sanity environment variables are missing.
**Fix Applied**: Added fallback values and warning messages in `src/sanity/client.ts`.

## Environment Variables

The following environment variables are configured in `.env.local`:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET` 
- `SANITY_API_READ_TOKEN`
- `NEXT_PUBLIC_GA_ID`
- `CONTACT_FORM_RECIPIENT_EMAIL`

## Project Structure
```
src/
├── app/                 # Next.js App Router pages
├── components/          # React components
│   ├── layout/         # Header, Footer components
│   └── sections/       # Page sections (Hero, etc.)
├── hooks/              # Custom React hooks
└── sanity/             # Sanity CMS configuration
```

## Common Issues & Solutions

### Development Server Won't Start
1. Ensure Node.js is installed and in PATH
2. Run `npm install` to install dependencies
3. Check for port conflicts (default: 3000)

### Logo Display Issues
- Main header logo: Should display correctly
- Footer logo: Fixed - no longer appears as white box

### Sanity CMS Connection
- Services are fetched from Sanity CMS
- Fallback hardcoded services available if fetch fails
- Check environment variables if issues persist

### Contact Form
- Form submits to `/api/contact` endpoint
- Currently logs submissions to console
- Email integration needs to be implemented for production

## Next Steps
1. Install Node.js
2. Run `npm run dev`
3. Test all functionality
4. Implement email service for contact form (production)
