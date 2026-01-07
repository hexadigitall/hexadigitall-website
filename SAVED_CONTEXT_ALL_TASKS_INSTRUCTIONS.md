# SAVED CONTEXT - All Tasks, Phases, Features & Instructions

## 📋 Current Status: Phase 1 COMPLETE | Phase 2 READY | Phase 4 (Marketing + School Pages) IN PROGRESS

---

## PHASE 1: COURSE CATALOG EXPANSION (✅ COMPLETE)

### What Was Done
1. ✅ Restored `handlePayment` function to student dashboard (was missing)
2. ✅ Audited existing: 10 schools, 52 courses  
3. ✅ Bulk imported: 14 professional courses (100% success)
4. ✅ Market analysis: 10 categories, 20 priority courses identified
5. ✅ OG/SEO audit: 38 complete → fixed to 66/66 complete
6. ✅ Fixed pricing: PPP model applied to 45 courses
7. ✅ Deduplication: removed duplicate Frontend course, duplicate Data Engineering
8. ✅ Body descriptions: all 66 courses have proper formatted descriptions
9. ✅ Images: all 66 courses have mainImage + ogImage
10. ✅ Created 3 new schools (Algorithms, Writing, Design)
11. ✅ Imported 12 high-demand courses (DSA 4, Writing 4, Design 3)

### Final Catalog State
- **Total Courses**: 61 (after deduplication)
- **Total Schools**: 12 (consolidated from 13, removed duplicate Design school)
- **OG/SEO Complete**: 61/61 (100%)
- **Body Descriptions**: 61/61 (100%) - All properly formatted with "Who It's For", "What You'll Learn", "Course Outline"
- **Images**: 61/61 (100%) - All have mainImage, ogImage, and bannerBackgroundImage
- **PPP Pricing Applied**: YES
- **Data Integrity**: ✅ Zero duplicates, zero orphans, zero conflicts

### Pricing Rules Implemented
- $15–25/hr USD → ₦12,500 NGN (Beginner)
- $30/hr USD → ₦20,000 NGN (Intermediate entry)
- $37.5/hr USD → ₦25,000 NGN (Intermediate)
- $50/hr USD → ₦31,250 NGN (Advanced)
- $56.25/hr USD → ₦40,625 NGN (Advanced+)
- $75/hr USD → ₦62,500 NGN (Expert)
- **Frontend/Backend/Mobile → ₦50,000 NGN** (all without exception)

### Body Description Format (Applied to All Courses)
```
[Short intro paragraph]

Who This Course Is For
[Target audience]

What You'll Learn
✅ [Learning outcome 1]
✅ [Learning outcome 2]
... (5-8 items with checkmarks)

Course Outline
Module 1: [Title]
Module 2: [Title]
... (4-5 modules)
```

---

## PHASE 2: TECHNICAL IMPLEMENTATION (🔄 READY TO START)

### Task 1: Add liveClassLink Schema Field
**File**: `src/sanity/schemas/course.ts`  
**What**: Add optional URL field for live class links (Zoom/Google Meet)  
**Steps**:
1. Add `defineField` for `liveClassLink` after `roadmapPdf` field
2. Field type: `url`
3. Title: "Live Class Link"
4. Description: "Zoom or Google Meet URL for live sessions (update by teacher)"
5. Make it optional (no required validation)
6. Register in Sanity Studio so teachers can edit
**Time**: 30 min

### Task 2: Build Student Resources Tab UI
**File**: `src/app/student/dashboard/page.tsx`  
**What**: Display downloadable resources for enrolled students  
**Components**:
- New "Resources" section/tab on course enrollment card
- Show if enrollment.status === 'active'
- Display 3 buttons/links:
  1. "📄 Course Content" → download `contentPdf` if available
  2. "📋 Roadmap" → download `roadmapPdf` if available
  3. "🔗 Live Class Link" → button with `liveClassLink` if courseType === 'live' && liveClassLink exists
- Style consistently with existing "Pay Now" button
**Time**: 2 hours

### Task 3: Create Teacher Update Form + API Route
**Files**: 
- `src/app/teacher/courses/[courseId]/edit.tsx` (new)
- `src/api/teacher/course/update.ts` (new)

**What**: Allow teachers to update course resources and live class link  
**Features**:
1. Teacher dashboard: show "Edit" button on assigned courses
2. Form fields:
   - liveClassLink (text input with URL validation)
   - contentPdf (file upload)
   - roadmapPdf (file upload)
3. API validation:
   - Check teacher ownership of course
   - Validate URLs (must start with http/https)
   - Upload files to Sanity
   - Update course document
4. Error handling & success feedback
**Time**: 2-3 hours

### Task 4: Test & QA
**Checklist**:
- [ ] Enroll student in DSA course
- [ ] Verify subscription + payment flow
- [ ] Check "Resources" tab appears
- [ ] Download PDFs (if attached)
- [ ] Try live class link (should open in new tab)
- [ ] Teacher: update live link, upload PDFs
- [ ] Verify student sees updated links
- [ ] Test error cases (invalid URLs, file too large, etc.)
**Time**: 1-2 hours

---

## PHASE 3: OPTIONAL ENHANCEMENTS (Future)

### Advanced Features (Roadmap)
1. **Certification Program**
   - Certificate generation on course completion
   - Job placement tracking
   - Portfolio integration

2. **Analytics Dashboard**
   - KPI tracking (enrollments, revenue, completion rates)
   - Teacher performance metrics
   - Student retention analysis

3. **Marketing Automation**
   - Email campaigns for new courses
   - SMS notifications
   - Upsell automation

---

## PHASE 4: MARKETING CAMPAIGN (🔄 IN PROGRESS)

### Task 13: 30-Day Social Media Campaign Content (NEW - EXPANDED)
**File**: `SHARABLE_LINKS_WWW.html`  
**Status**: 🟡 Days 1-3 complete, Days 4-30 needed  
**What**: Complete 30-day social media blitz with FRESH, algorithm-optimized content daily  
**Campaign Requirements**:
1. **Content Volume**: 3 posts per day × 30 days = 90 total posts
2. **Platforms**: Facebook, LinkedIn, Twitter/X, Instagram, WhatsApp, Telegram
3. **Posting Schedule**:
   - **9:00 AM**: Peak commute/morning engagement
   - **12:00 PM**: Lunch break/midday scrolling
   - **6:00 PM**: After-work peak time
4. **Content Mix (Rotation)**:
   - 40% Course promotions (61 courses to feature)
   - 30% School highlights (12 schools)
   - 20% Service offerings
   - 10% Success stories, tips, engagement posts
5. **Days 4-30 Specific Content**:
   - **Days 4-7**: Course deep-dives (module previews, learning outcomes)
   - **Days 8-14**: Success stories week (testimonials, before/after, salary jumps)
   - **Days 15-21**: Career transformation focus (job placement, portfolio building)
   - **Days 22-28**: FINAL PUSH (limited time offers, scarcity tactics, early bird bonuses)
   - **Days 29-30**: Thank you + next cohort preview
6. **Hashtag Strategy - TRENDING & ALGORITHM-OPTIMIZED**:
   - **Tech Trends**: #AI #CloudComputing #Cybersecurity #DataScience #DevOps #WebDevelopment #MobileApps
   - **Career**: #TechJobs #CareerGrowth #RemoteWork #SkillsForTheFuture #JobReady
   - **Nigerian Market**: #NigeriaTech #NaijaDevs #9jaIntech #TechNigeria #LearnInNigeria
   - **Engagement**: #MondayMotivation #TechTuesday #WednesdayWisdom #FridayFeeling #SundayInspo
   - **Action**: #JoinNow #EnrollToday #LimitedSpots #ActFast #DontMissOut
   - **Brand**: #Hexadigitall #HexadigitallAcademy #LearnWithHexadigitall
7. **MOST EFFECTIVE CTAs (Algorithm-Winning)**:
   - "🔗 Link in bio - enroll now!"
   - "DM us for 20% off - limited offers!"
   - "Tag someone who needs this 👇"
   - "Only 5 spots left - secure yours today!"
   - "Transform your career in [X] weeks - start now!"
   - "Join 1000+ students already learning - don't be left behind!"
   - "Early bird bonus: ₦5,000 off this week only!"
   - "Click to see if you qualify for our scholarship!"
8. **Engagement Hooks for Algorithm Boost**:
   - Ask 3 questions per week (poll-style posts)
   - "Tag a friend who..." (increases shares)
   - Countdown posts (3 days left, 1 day left)
   - "We're giving away [X]" (viral bait)
   - Behind-the-scenes/day-in-life content
9. **Content Format Mix**:
   - Text-only posts (personal stories)
   - Image posts (course previews, instructor photos)
   - Carousel/multi-image (module breakdowns)
   - Video snippets (course teasers, student testimonials)
   - Infographics (salary data, course ROI)
10. **Platform-Specific Optimization**:
   - **Facebook**: Long-form, community feel, engagement baits
   - **LinkedIn**: Professional tone, career advancement, credentials
   - **Twitter/X**: Short, punchy, trending hashtags, quick CTAs
   - **Instagram**: Visual-first, stories, reels, lifestyle
   - **WhatsApp**: Personal, group shares, exclusive offers
   - **Telegram**: Channel announcements, bulk messaging

**Deliverables**:
- Update SHARABLE_LINKS_WWW.html with Days 4-30 (81 posts remaining)
- Each post needs: Day #, Time, Platform, Copy-paste text, Link, Image, Hashtags (3-5 trending + 2-3 brand)
- Ensure variety across 61 courses, 12 schools, services, engagement
- Include PROVEN CTAs that drive clicks and conversions

**Time Estimate**: 3-4 hours to generate all content + format HTML

---

### Task 14: Optimize School Pages UI/UX & Fix Payment Integration (NEW)
**Files**: `src/app/schools/[slug]/page.tsx`, course card components  
**Status**: 🔴 BLOCKED - Buttons don't work  
**What**: Redesign school pages and fix broken "Customize & Subscribe" button flow  
**Issues to Fix**:
1. **UI/UX Improvements**:
   - School hero section: improve visuals, better typography, CTA prominence
   - Course card layout: too cramped, need better spacing
   - Pricing display: make pricing tiers clear and scannable
   - School description: expand narrative, add value proposition
   - Add instructor highlights or success metrics
2. **"Customize & Subscribe" Button Fix**:
   - **Current State**: Button clicks do nothing (dead link)
   - **Required Behavior**: Should open payment modal for that specific course
   - **Implementation**:
     - Button should trigger `openPaymentModal(courseId)`
     - Pass course details to modal (title, price, description)
     - Show Paystack checkout or subscription flow
     - On success: create enrollment record + redirect to dashboard
3. **Payment Modal Integration**:
   - Ensure modal receives course context (hourlyRateUSD, hourlyRateNGN, billingType)
   - Show regional pricing (USD vs NGN based on user location)
   - Add "Limited spots left" urgency text if applicable
   - Include "Already enrolled? Go to dashboard" link
4. **School Page Layout Options** (choose one):
   - Option A: Grid view (current) + improve spacing + sidebar with filters
   - Option B: List view + card preview (larger preview area)
   - Option C: Mix (featured courses as grid + others as list)

**Deliverables**:
- School page component refactored with improved layout
- "Customize & Subscribe" buttons now trigger payment flow
- Course card component enhanced with better visual hierarchy
- Payment modal properly receives and displays course data
- Test enrollment flow: click button → modal appears → payment → success

**Time Estimate**: 2-3 hours (design review + button integration + testing)

---

## 🐛 Known Issues & Fixes Needed

### Issue: Paystack 504 Gateway Timeout
**Status**: External (Paystack/network side)  
**Mitigation**:
1. Add retry logic with exponential backoff (3 attempts, 1s-3s delay)
2. User-facing error: "Payment server busy. Trying again..."
3. Test with Paystack test keys in dev (not production keys)
4. Optional: add fallback payment method (Stripe, local transfer)

### Issue: 504 Error in Screenshot
**Context**: User attempted payment on checkout.paystack.com/a8g1kysg0y02tx9  
**Root Cause**: Likely Paystack uptime issue or network timeout  
**Action**: Implement retry + timeout extension (5s → 10s)

---

## 📚 Important Files & Locations

### Core Application
- `src/app/student/dashboard/page.tsx` - Student enrollment hub (handlePayment restored here)
- `src/sanity/schemas/course.ts` - Course schema (379 lines, OG/SEO/resources fields present)
- `src/api/student/renew` - Payment renewal endpoint (calls Paystack)

### New Schools & Courses (Phase 1)
- **School of Algorithms & Problem Solving**: 4 DSA courses
- **School of Writing & Communication**: 4 writing/communication courses
- **School of Design & Creative**: 3 design courses

### Scripts Created
- `scripts/add-og-metadata.mjs` - ✅ Complete
- `scripts/fill-course-body.mjs` - ✅ Complete (Phase 1)
- `scripts/fix-full-descriptions.mjs` - ✅ Complete (Rich formatting with h3 headings, bullets)
- `scripts/fix-course-pricing.mjs` - ✅ Complete
- `scripts/dedupe-courses.mjs` - ✅ Complete
- `scripts/generate-course-images.mjs` - ✅ Complete
- `scripts/create-schools-import-courses.mjs` - ✅ Complete

### Data Cleanup Scripts (Session: Jan 6-7, 2026)
- Deleted 5 duplicate courses (AppSec, Cybersecurity Fundamentals, Enterprise Cloud, SC-100, Technical Writing)
- Consolidated design schools: moved 3 courses from "Design & Creative" to "School of Design"
- Set bannerBackgroundImage for all 61 courses
- Final audit confirmed: 12 schools, 61 courses, zero conflicts

### Data Files
- `data/new-dsa-writing-design-courses.json` - 12 course definitions
- `PHASE_1_COMPLETION_SUMMARY.md` - Phase 1 summary

---

## 🎯 Commands Reference

### Run Pricing Fix (Phase 1 Cleanup)
```bash
APPLY=1 node scripts/fix-course-pricing.mjs
```

### Run OG Metadata Backfill
```bash
APPLY=1 node scripts/add-og-metadata.mjs
```

### Run Full Description Backfill
```bash
APPLY=1 node scripts/fill-course-body.mjs
```

### Run Deduplication
```bash
APPLY=1 node scripts/dedupe-courses.mjs
```

### Generate Course Images
```bash
APPLY=1 node scripts/generate-course-images.mjs
```

### Create Schools + Import Courses
```bash
APPLY=1 node scripts/create-schools-import-courses.mjs
```

### Audit OG/SEO Coverage
```bash
node check-og-fields.mjs
```

### Generate Catalog Summary
```bash
node <<'NODE'
import dotenv from 'dotenv'
import { createClient } from '@sanity/client'
dotenv.config({ path: './.env.local' })
const client = createClient({...})
const summary = await client.fetch(`...`)
NODE
```

---

## 📝 User Instructions Summary

### What the User Asked For (10, 10b, 11, 12, 13, 14)
**10**: Fix pricing to follow PPP model correctly  
  → ✅ DONE: All courses now use correct PPP tiers, frontend/backend at ₦50k

**10b**: Fix body descriptions to match exact format  
  → ✅ DONE: All 61 courses now have proper "Who It's For" + "What You'll Learn" + "Course Outline" format

**11**: Add DSA, Writing, Design courses  
  → ✅ DONE: Created 3 new schools + imported 12 high-demand courses

**12**: Comprehensive audit + data cleanup  
  → ✅ DONE: Fixed GROQ query, deleted 5 duplicates, consolidated design schools, set banner images

**13**: Update SHARABLE_LINKS_WWW.html with Day 4-30 content + trending hashtags  
  → 🔄 IN PROGRESS: Need Days 4-30 with fresh daily posts, algorithm-optimized CTAs, engagement hooks

**14**: Fix school pages UI/UX + "Customize & Subscribe" buttons  
  → 🔴 BLOCKED: Buttons don't trigger payment modals, school layouts need redesign

---

## 🚀 Next Immediate Action

**Priority 1 (Quick Win - 30 min)**: Task #14 - Fix "Customize & Subscribe" buttons on school pages  
- Identify button component location
- Wire it to payment modal with course data
- Test enrollment flow

**Priority 2 (3-4 hours)**: Task #13 - Complete 30-day campaign content  
- Generate Days 4-30 posts with algorithm-optimized CTAs
- Add trending hashtags
- Format into SHARABLE_LINKS_WWW.html

**Priority 3 (2-3 hours)**: Task #14 continued - School page UI/UX redesign  
- Improve layout, spacing, typography
- Add visual hierarchy to course cards

**Then**: Start Phase 2 (schema + student UI + teacher form)

---

## 💾 Context Summary for Next Session

**What to Remember**:
- All course data is clean, complete, and PPP-priced ✅
- 61 courses across 12 schools ready for use (duplicates removed, schools consolidated)
- Phase 1 COMPLETE: Pricing, descriptions, images, OG/SEO all done
- Phase 2 READY: Schema update (30 min) + student UI (2 hrs) + teacher form (2-3 hrs)
- **Phase 4 IN PROGRESS**: 
  - Task 13: Marketing campaign Days 1-3 done, need Days 4-30 (fresh daily posts, algorithm CTAs, hashtags)
  - Task 14: School pages broken - "Customize & Subscribe" buttons don't trigger payment modals (urgent fix)
- Paystack 504 issue known; needs retry logic
- Body format CONFIRMED: Who It's For → What You'll Learn (✅ checks) → Course Outline
- All 61 courses have rich portable text formatting with h3 headings and bullet lists

**Campaign Context (Task 13)**:
- File: SHARABLE_LINKS_WWW.html
- Need 81 more posts (Days 4-30, 3 posts/day per platform)
- Must use EFFECTIVE CTAs: "Link in bio", "DM for discount", "Limited spots", "Tag a friend"
- Trending hashtags per platform: Tech, Career, Nigerian market, Engagement, Action-focused
- Content mix: 40% courses, 30% schools, 20% services, 10% engagement

**School Pages Context (Task 14)**:
- File: src/app/schools/[slug]/page.tsx
- **BUG**: "Customize & Subscribe" buttons on course cards don't work
- **Fix needed**: Connect button to payment modal with proper course context
- **Also needed**: Redesign school page layout (better spacing, typography, card hierarchy)

**All scripts ready** - just run with APPLY=1 to execute any future course updates

---

**Last Updated**: January 7, 2026  
**Status**: Phase 1 Complete | Phase 2 Ready | Phase 4 (Marketing + School Pages) In Progress  
**Next Step**: Fix school page buttons (Priority 1) → Complete campaign content (Priority 2)
