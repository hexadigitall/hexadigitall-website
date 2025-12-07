# Course Migration - Quick Start Guide

## TL;DR

Apply PPP (Purchasing Power Parity) pricing to all courses in 3 steps:

```bash
# 1. Setup environment
./scripts/setup-migration.sh

# 2. Validate (safe, no changes)
npm run migrate:courses:validate

# 3. Run migration
npm run migrate:courses
```

## What This Does

Converts all courses to a 4-tier Regional Pricing Model:
- **Tier 1**: ₦180k-280k/mo (Executive courses like PMP, AWS, CISSP)
- **Tier 2**: ₦100k-125k/mo (Career courses like Full Stack, Scrum)
- **Tier 3**: ₦60k-80k/mo (Professional skills like UI/UX, Marketing)
- **Tier 4**: ₦50k/mo (Fundamentals like Computer Basics, Office)

## Prerequisites

You need a **Sanity API Token** with write permissions:

1. Go to https://sanity.io/manage
2. Select your project (puzezel0)
3. Navigate to **API** → **Tokens**
4. Create a new token with **Editor** or **Admin** permissions
5. Copy the token

## Setup

### Option 1: Automated Setup

```bash
./scripts/setup-migration.sh
```

This will:
- Create `.env.local` if it doesn't exist
- Guide you through adding your Sanity token
- Show you the next steps

### Option 2: Manual Setup

1. Create `.env.local` from the example:
```bash
cp .env.example .env.local
```

2. Edit `.env.local` and add your token:
```bash
SANITY_API_TOKEN=sk_xxxxxxxxxxxxxxxxxxxxxxxxxxxxxxxx
```

## Validation (Recommended)

**Always validate before migrating:**

```bash
npm run migrate:courses:validate
```

This checks:
- ✅ Environment variables are set
- ✅ Sanity connection works
- ✅ Courses are accessible
- ✅ Shows preview of how courses will be categorized
- ✅ No data is modified

Expected output:
```
🔍 Validating Migration Readiness...
✅ Found: NEXT_PUBLIC_SANITY_PROJECT_ID = puzezel0
✅ Found: NEXT_PUBLIC_SANITY_DATASET = production
✅ Found: SANITY_API_TOKEN = ***REDACTED***
✅ Connection successful!
📚 Found 28 courses in Sanity
🎯 READY TO MIGRATE!
```

## Run Migration

Once validation passes:

```bash
npm run migrate:courses
```

This will:
1. Fetch all courses from Sanity
2. Categorize each into a pricing tier
3. Set `hourlyRateNGN` and `hourlyRateUSD`
4. Set `courseType` to `'live'`
5. Reset scheduling defaults
6. Log all changes

Expected output:
```
🌍 Starting Regional Pricing (PPP) Migration...
📚 Found 28 courses to migrate

📘 Full Stack Development
   Tier 2: High-Demand (₦125k)
   🇳🇬 ₦125,000/mo | 🌎 $200/mo
   ✅ Migrated successfully

...

✅ Migration Complete!
   Success: 28 courses
```

## Verification

### Check Sanity Studio (after Studio is fixed)
1. Navigate to `/studio`
2. Open any course
3. Verify fields:
   - `courseType`: "live"
   - `hourlyRateNGN`: Set correctly
   - `hourlyRateUSD`: Set correctly

### Check Frontend
```bash
npm run dev
```

Navigate to a course page:
- Switch between NGN and USD
- Verify prices match tiers (not direct conversion)
- Example: Full Stack should show ₦125k (NGN) and $200 (USD)

## CRUD After Migration

✅ **All Sanity operations work normally:**

- **Create**: Add new courses in Studio with new pricing fields
- **Read**: Frontend queries unchanged
- **Update**: Edit all fields including pricing
- **Delete**: Standard Sanity delete

The migration only updates pricing fields. Everything else remains fully editable.

## Troubleshooting

### "No courses found"
- Check dataset name in `.env.local` (should be "production")
- Verify you're connected to the right Sanity project

### "SANITY_API_TOKEN is not set"
- Add token to `.env.local`
- Restart any running processes

### "Failed to patch course"
- Token might lack write permissions
- Create new token with "Editor" role

### Prices still show conversion
- Clear cache: `rm -rf .next`
- Restart: `npm run dev`
- Clear browser cache

## Full Documentation

For complete details, see:
- **[Full Migration Guide](./COURSE_MIGRATION_GUIDE.md)** - Comprehensive documentation
- **[Scripts](../scripts/)** - Migration and validation scripts

## Rollback

If needed, courses can be reverted to self-paced pricing. See the [Full Migration Guide](./COURSE_MIGRATION_GUIDE.md#rollback) for instructions.

## Support

For issues:
1. Check validation output for specific errors
2. Review `.env.local` for correct credentials
3. Verify Sanity project access at https://sanity.io/manage

## What's Next?

After successful migration:
1. ✅ Verify all courses have new pricing
2. ✅ Test currency switcher on frontend
3. ✅ Update website with new course catalog
4. ⏳ Fix Sanity Studio (separate task)
