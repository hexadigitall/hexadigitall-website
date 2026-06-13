# Course PPP Pricing Migration Guide

## Overview

This guide explains how to migrate all courses to the new **Purchasing Power Parity (PPP) Regional Pricing Model**.

The migration applies a 4-tier pricing system that decouples Nigerian Naira (NGN) and US Dollar (USD) rates to make courses accessible to local students while maintaining global market rates for international students.

## Pricing Tiers

### Tier 1: Executive & Corporate (₦180k - ₦280k/mo)
**Target:** Senior Professionals, Managers, Corporate Sponsorships
- PMP Certification Prep
- Agile Leadership
- AWS Solutions Architect
- CISSP Certification
- DevOps & Kubernetes
- AI Engineering (LLMs)
- Ethical Hacking (CEH)
- Machine Learning Engineering
- Advanced Ansible

### Tier 2: High-Demand Career (₦100k - ₦125k/mo)
**Target:** Career Switchers, Aspiring Remote Workers
- Full Stack Development
- Mobile App (React Native)
- Scrum Master (CSM)
- Backend (Node.js)
- Frontend (React.js)
- Python for Data
- Cisco Networking (CCNA)

### Tier 3: Professional Skills (₦60k - ₦80k/mo)
**Target:** Freelancers, Creatives, Support Staff
- Technical Writing
- UI/UX Design Bootcamp
- Graphic Design Mastery
- Digital Marketing
- SEO Mastery
- Hardware & Maintenance

### Tier 4: Fundamentals (₦50k/mo)
**Target:** Beginners, Digital Literacy
- Computer Appreciation
- Smartphone Productivity
- Microsoft Office

## Prerequisites

### 1. Environment Variables Setup

Create or update `.env.local` with your Sanity credentials:

```bash
# Sanity CMS Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=puzezel0
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-08-30
SANITY_API_TOKEN=your_actual_write_token_here  # ⚠️ REQUIRED for migration
```

**Important:** You MUST have a valid `SANITY_API_TOKEN` with write permissions. Get this from:
- Sanity Dashboard → Your Project → API → Tokens
- Create a token with "Editor" or "Admin" permissions

### 2. Verify Sanity Connection

Before running the migration, verify your connection works:

```bash
# Test connection (this won't modify anything)
node -e "
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

client.fetch('*[_type == \"course\"]{ _id, title }')
  .then(courses => console.log('✅ Connected! Found', courses.length, 'courses'))
  .catch(err => console.error('❌ Connection failed:', err.message));
"
```

## Running the Migration

### Option 1: Using npm script (Recommended)

```bash
npm run migrate:courses
```

### Option 2: Direct execution

```bash
node scripts/migrate-courses-regional.js
```

## What the Migration Does

For each course in Sanity, the script will:

1. **Categorize the course** into one of 4 pricing tiers based on title keywords
2. **Set PPP pricing rates:**
   - `hourlyRateNGN`: Regional rate for Nigeria (₦12,500 - ₦70,000/hr)
   - `hourlyRateUSD`: Global rate for international students ($15 - $87.5/hr)
3. **Set courseType:** `'live'` (monthly mentorship model)
4. **Reset scheduling defaults:**
   - Sessions per week: 1-3 (default: 1)
   - Hours per session: 1-3 (default: 1)

### Example Output

```
🌍 Starting Regional Pricing (PPP) Migration...

💰 Floor: ₦50,000 | Ceiling: ₦280,000
══════════════════════════════════════════════════════════════════════
📚 Found 28 courses to migrate

📘 Full Stack Development
   Tier 2: High-Demand (₦125k)
   Category: Coding
   🇳🇬 Nigeria: ₦31,250/hr → ₦125,000/mo (base)
   🌎 Global:   $50/hr → $200/mo (base)
   💡 PPP Multiplier: 2.6x more affordable
   ✅ Migrated successfully

📘 PMP Certification Prep
   Tier 1: Executive (₦280k)
   Category: Project Management
   🇳🇬 Nigeria: ₦70,000/hr → ₦280,000/mo (base)
   🌎 Global:   $75/hr → $300/mo (base)
   💡 PPP Multiplier: 1.8x more affordable
   ✅ Migrated successfully

...

══════════════════════════════════════════════════════════════════════
✅ Migration Complete!
   Success: 28 courses
   
📊 Pricing Summary:
   Tier 1 (Executive):     ₦180k - ₦280k/mo
   Tier 2 (High-Demand):   ₦100k - ₦125k/mo
   Tier 3 (Professional):  ₦60k  - ₦80k/mo
   Tier 4 (Fundamentals):  ₦50k/mo

📌 Next Steps:
   1. Verify pricing in Sanity Studio
   2. Test CoursePricingCalculator with USD/NGN switching
   3. Check that "Regional Pricing Applied" badge appears
```

## Post-Migration Verification

### 1. Check Sanity Studio

Once Studio is working, verify courses have the new fields:
- Navigate to `/studio` → Courses
- Open any course
- Verify fields are populated:
  - `courseType`: "live"
  - `hourlyRateNGN`: ₦12,500 - ₦70,000
  - `hourlyRateUSD`: $15 - $87.5

### 2. Test on Frontend

```bash
npm run dev
```

Navigate to a course page and verify:
- Currency switcher shows NGN and USD options
- Prices change correctly when switching currencies
- Monthly pricing matches the tier (not direct currency conversion)
- "Regional Pricing Applied" badge appears for NGN

### 3. Test Pricing Calculator

Example for "Full Stack Development":
- **NGN Mode:** Should show ₦125,000/mo (1 session × 1 hour × 4 weeks)
- **USD Mode:** Should show $200/mo (1 session × 1 hour × 4 weeks)
- **NOT:** ₦330,000 (which would be direct conversion)

## CRUD Operations After Migration

### ✅ Courses Remain Fully Manageable from Sanity

The migration ONLY updates pricing fields. All CRUD operations work normally:

#### Create New Course
1. Go to Sanity Studio → Courses → Create
2. Fill in title, description, etc.
3. For `courseType`, select "Live Mentorship"
4. Enter `hourlyRateNGN` and `hourlyRateUSD` based on tier:
   - Tier 1: ₦45,000-70,000 / $50-87.5
   - Tier 2: ₦25,000-31,250 / $37.5-50
   - Tier 3: ₦15,000-20,000 / $25-30
   - Tier 4: ₦12,500 / $15

#### Update Existing Course
- All fields remain editable
- Change pricing by updating `hourlyRateNGN` / `hourlyRateUSD`
- Schema validation ensures rates stay within limits

#### Delete Course
- Standard Sanity delete works normally
- No special cleanup needed

#### Read/Query Courses
- Frontend queries work unchanged
- All existing queries compatible

## Troubleshooting

### Error: "SANITY_API_TOKEN is not set"
- Add token to `.env.local`
- Restart any running processes after adding

### Error: "No courses found"
- Verify dataset name is correct in env vars
- Check you're connected to the right Sanity project

### Error: "Failed to patch course"
- Token might lack write permissions
- Verify token has "Editor" or "Admin" role

### Courses show direct conversion prices
- Clear Next.js cache: `rm -rf .next`
- Restart dev server: `npm run dev`
- Clear browser cache or use incognito mode

## Rollback

If you need to revert the migration:

```bash
# Restore original pricing (set back to self-paced)
node -e "
import { createClient } from '@sanity/client';
import dotenv from 'dotenv';
dotenv.config({ path: '.env.local' });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  apiVersion: '2024-01-01',
  useCdn: false
});

const courses = await client.fetch('*[_type == \"course\"]{ _id }');
for (const course of courses) {
  await client.patch(course._id).set({ courseType: 'self-paced' }).commit();
  console.log('Reverted:', course._id);
}
console.log('Rollback complete');
"
```

## Support

For issues or questions about the migration:
- Check Sanity Studio logs for schema validation errors
- Verify environment variables are loaded correctly
- Review the migration script output for specific course errors

## Next Steps

After successful migration:
1. ✅ Update course catalog on website
2. ✅ Add PPP explanation to FAQ page
3. ✅ Update pricing calculator UI
4. ✅ Add "Regional Pricing Applied" badges
5. ⏳ Fix Sanity Studio loading issue (separate task)
