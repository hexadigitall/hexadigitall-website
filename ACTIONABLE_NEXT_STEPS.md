# ACTIONABLE NEXT STEPS - Complete Roadmap

**Date:** December 7, 2025  
**Current Position:** main @ f3048d5  
**Unmerged PR Available:** origin/copilot/show-coming-soon-page (8 commits)  
**Local Uncommitted:** 30+ files

---

## 🎯 DECISION TREE: What To Do First

```
START HERE
    ↓
┌─────────────────────────────┐
│ Do you want to merge the     │
│ Coming Soon PR immediately? │
└─────────────────────────────┘
    ↙                           ↖
   YES                          NO
    ↓                           ↓
┌─────────────┐      ┌──────────────────┐
│ MERGE NOW   │      │ REVIEW FIRST     │
│ (5 min)     │      │ (10-15 min)      │
└─────────────┘      └──────────────────┘
    ↓                        ↓
THEN: Sort local changes  THEN: Same as left
```

---

## PLAN A: MERGE IMMEDIATELY (Recommended)

### ⏱️ Time: 5-10 minutes

### Step 1: Merge Coming Soon PR
```bash
# Ensure you're on main
git checkout main

# Fetch latest from GitHub
git fetch origin

# Merge the PR
git merge origin/copilot/show-coming-soon-page

# Verify merge
git log --oneline -5
# Should show 8 new commits at top
```

### Step 2: Test the Merge
```bash
# Clear cache and node modules if needed
npm run dev

# Check in browser:
# ✓ Homepage loads (no FeaturedCourses error)
# ✓ /courses shows "Courses Coming Soon" page
# ✓ No console errors
# ✓ Build completes successfully
```

### Step 3: Push to GitHub
```bash
git push origin main
```

### Result:
- ✅ main branch now has SchemaError fix + Coming Soon feature
- ✅ Site is stable (no broken courses)
- ✅ Ready for Phase 2 work

---

## PLAN B: REVIEW BEFORE MERGING

### ⏱️ Time: 10-15 minutes

### Step 1: View All Changes
```bash
# See what changed
git diff main..origin/copilot/show-coming-soon-page

# Or view file-by-file
git diff main..origin/copilot/show-coming-soon-page -- src/app/courses/page.tsx
git diff main..origin/copilot/show-coming-soon-page -- src/app/page.tsx
git diff main..origin/copilot/show-coming-soon-page -- src/components/sections/ComingSoon.tsx
```

### Step 2: Key Files to Review

**MUST READ:**
- `src/components/sections/ComingSoon.tsx` (NEW - 97 lines)
  - Check styling, responsiveness, accessibility
  - Verify aria-labels added (52ed024 commit)
  
- `src/app/courses/page.tsx` (CHANGED)
  - Replaced entire ServerCoursesPage with ComingSoon
  - Updated metadata
  
- `src/app/page.tsx` (CHANGED)
  - FeaturedCourses component commented out
  - Reason: "Temporarily disabled until Sanity error resolved"

**SHOULD REVIEW:**
- `src/app/blog/page.tsx` (ERROR HANDLING ADDED)
- `src/app/faq/page.tsx` (ERROR HANDLING ADDED)
- `src/app/portfolio/page.tsx` (ERROR HANDLING ADDED)

### Step 3: Decision
If you're happy with changes → Execute Plan A  
If you want modifications → Request changes on GitHub PR

---

## AFTER MERGING: Handle Local Changes

### ⏱️ Time: 15-30 minutes

Once the PR is merged, you'll have another git situation:

```bash
git status
# Will show:
# - Coming Soon PR changes: MERGED ✓
# - Local uncommitted: STILL THERE ✗
```

### Step 1: Understand Your Uncommitted Changes
```bash
# See what's different
git diff --name-only

# Group by category
git diff --name-only | grep "app/api"     # API routes
git diff --name-only | grep "sanity/schemas"  # Schemas
git diff --name-only | grep "app/"       # App code
```

### Step 2: Make a Decision for Each Category

**Category A: Deleted API Routes (6 files)**
```
src/app/api/checkout/route.ts              ❓ DELETE?
src/app/api/service-request/confirm/route.ts   ❓ DELETE?
src/app/api/subscriptions/[subscriptionId]/route.ts  ❓ DELETE?
src/app/api/subscriptions/customer-portal/route.ts  ❓ DELETE?
src/app/api/subscriptions/route.ts         ❓ DELETE?
src/app/api/webhooks/stripe/route.ts       ❓ DELETE?
src/lib/stripe.ts                          ❓ DELETE?
```

**QUESTION:** Should Stripe integration be removed?
- **YES** → Commit with message: "Remove Stripe payment integration"
- **NO** → Revert with: `git checkout -- src/app/api src/lib/stripe.ts`

**Category B: Modified Schemas (4 files)**
```
src/sanity/schemas/serviceCategory.ts      ❓ KEEP?
src/sanity/schemas/serviceCaseStudy.ts     ❓ KEEP?
src/sanity/schemas/serviceStatistics.ts    ❓ KEEP?
src/sanity/schemas/serviceRequest.ts       ❓ KEEP?
```

**QUESTION:** Are these additional schema fixes needed?
- **YES** → Commit with message: "Fix nested defineField() in service schemas"
- **NO** → Revert with: `git checkout -- src/sanity/schemas`

**Category C: Other Changes (20+ files)**
```
src/types/*, src/app/*, src/components/*, etc.
```

**QUESTION:** Should these be kept?
- **YES** → Review line-by-line, commit in logical groups
- **NO** → Discard with: `git checkout -- .`

### Step 3: Execute Decision

**Option 1: Keep Everything**
```bash
# Stage all changes
git add -A

# Create descriptive commit
git commit -m "WIP: Schema fixes, Stripe removal, and app changes

- Remove Stripe payment API routes
- Fix nested defineField() in service schemas
- Update type definitions and app components
- Add error handling to data fetching"

# Push
git push origin main
```

**Option 2: Discard Everything**
```bash
# Warning: This deletes all uncommitted changes
git reset --hard HEAD
```

**Option 3: Selective Keep (Recommended)**
```bash
# Keep only specific changes
git add src/sanity/schemas/serviceCategory.ts
git add src/sanity/schemas/serviceCaseStudy.ts

git commit -m "Fix nested defineField() in service schemas"

# Then decide on API routes
git add src/app/api
git add src/lib/stripe.ts

git commit -m "Remove Stripe payment integration"

# Check what's left
git status
# If only other stuff remains, discard:
git checkout -- .
```

---

## AFTER LOCAL CHANGES: Next Phase

### ⏱️ Time: 1-2 hours

Once commits are clean, move to **Task 7: Payment Flow Integration**

**File:** `NEXT_SESSION_TASK_7.md`  
**Objective:** Connect TierSelectionModal → ServicePaymentModal  
**Files to Modify:**
1. `src/app/services/web-and-mobile-software-development/page.tsx`
2. `src/components/services/ServicePaymentModal.tsx`

**Key Changes:**
```tsx
// Add state management
const [selectedTier, setSelectedTier] = useState(null);
const [showPaymentModal, setShowPaymentModal] = useState(false);

// Update handler
const handleTierSelect = (tier) => {
  setSelectedTier(tier);
  setShowPaymentModal(true);
};

// Render payment modal
{showPaymentModal && <ServicePaymentModal tier={selectedTier} />}
```

**Acceptance Criteria:**
- [ ] Click package → select tier → payment modal opens
- [ ] Tier details display in payment modal
- [ ] Currency conversion works throughout
- [ ] User can proceed to checkout

---

## COMPLETE ACTION SEQUENCE (Recommended Path)

```
1. MERGE (5 min)
   git merge origin/copilot/show-coming-soon-page
   ↓
2. TEST (5 min)
   npm run dev
   Check homepage and /courses page
   ↓
3. PUSH (1 min)
   git push origin main
   ↓
4. CLARIFY LOCAL CHANGES (15 min)
   git status
   Review each modified file
   ↓
5. COMMIT OR DISCARD (10 min)
   Either commit all changes OR revert
   ↓
6. IMPLEMENT TASK 7 (60-120 min)
   Payment flow integration
   ↓
7. TEST FULL FLOW (30 min)
   End-to-end testing
```

**Total Time:** 2-3 hours  
**Effort:** Moderate (mostly decisions, then implementation)  
**Risk:** Low (changes are isolated)

---

## SUMMARY: What You're Getting

### From Coming Soon PR (8694b7d):
```
✅ ComingSoon component (modern, accessible)
✅ Courses page replaced with ComingSoon
✅ FeaturedCourses hidden from homepage
✅ Error handling added to data fetching
✅ Accessibility improvements (aria-labels)
✅ Comprehensive debugging tools & scripts
✅ Migration tooling for future course work
```

### From Merging:
```
✅ Site stability (no more broken courses section)
✅ Better UX (clear "Coming Soon" message vs errors)
✅ Time for proper course system overhaul
✅ Error resilience (fallback handling)
✅ Tooling ready (when courses do return)
```

### Still To Do:
```
⏳ Clarify local changes (Stripe, schemas)
⏳ Task 7: Payment flow integration
⏳ End-to-end testing
⏳ Production deployment plan
```

---

## 🚨 RISKS & MITIGATION

| Risk | Probability | Impact | Mitigation |
|------|-------------|--------|-----------|
| Merge conflicts | Low | Medium | Test after merge |
| Breaking change | Low | High | Review key files first |
| Local changes lost | Medium | Medium | Commit before merge |
| Incomplete Task 7 | High | Low | Clear requirements first |

---

## 📞 DECISION NEEDED FROM YOU

**Before I proceed, please clarify:**

1. **Merge Now or Review First?**
   - [ ] Merge immediately (Plan A)
   - [ ] Review first (Plan B)

2. **Local Uncommitted Changes - What To Do?**
   - [ ] Keep all (commit)
   - [ ] Keep schemas (discard APIs)
   - [ ] Keep APIs (discard schemas)
   - [ ] Discard all (revert to clean state)
   - [ ] Need help deciding per-file

3. **After Merge - What Next?**
   - [ ] Implement Task 7 (Payment flow)
   - [ ] Deploy to production
   - [ ] Additional testing first
   - [ ] Waiting on other work

Once you decide, I can execute these steps immediately!

