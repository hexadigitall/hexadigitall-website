# Phase 1 & 2 Implementation Roadmap - Status Report

## 🎯 Overview
Complete restructure of Hexadigitall's service offerings with tiered package system, home page redesign, custom builder, and multi-service integration.

**Total Tasks:** 25  
**Completed:** 5 (20%)  
**In Progress:** 0  
**Not Started:** 20 (80%)

---

## ✅ COMPLETED WORK (5/25)

### 1. ✅ Define PackageTier & PackageGroup Interfaces
**Task 1 - COMPLETED**
- **File:** `src/types/service.ts`
- **Status:** Already in place
- **Details:**
  - `ServicePackageTier` interface: name, tier, price, currency, billing, deliveryTime, features, popular flag, addOns
  - `ServicePackageGroup` interface: key, name, description, tiers array
  - Full backward compatibility with existing types maintained

### 2. ✅ Refactor Web & Mobile Packages
**Task 2 - COMPLETED**
- **File:** `src/data/servicePackages.ts`
- **Status:** Already implemented
- **Details:**
  - `WEB_DEV_PACKAGE_GROUPS` constant with 4 groups:
    - Landing Page
    - Business Website  
    - E-commerce Store
    - Custom Web App
  - Each group has 3 tiers: Basic, Standard, Premium
  - `MARKETING_PACKAGE_GROUPS` with Social Starter
  - `BUSINESS_PACKAGE_GROUPS` with Business Plans
  - `PROFILE_PACKAGE_GROUPS` & `CONSULTING_PACKAGE_GROUPS`
  - All export as separate constants to avoid breaking changes

### 3. ✅ Create JourneySection Component
**Task 3 - COMPLETED**
- **File:** `src/components/home/JourneySection.tsx`
- **Status:** Created and ready
- **Features:**
  - 4 journey cards: Have an Idea?, Ready to Build?, Need Customers?, Want to Learn?
  - Responsive design (1 col mobile → 4 col desktop)
  - SVG icons for each journey
  - Proper heading hierarchy (H2 for section, card titles)
  - Accessible focus states and ARIA labels
  - Custom solution CTA at bottom
  - Routing:
    - Idea → `/services/business-plan-and-logo-design`
    - Build → `/services/web-and-mobile-software-development`
    - Customers → `/services/social-media-advertising-and-marketing`
    - Learn → `/courses`

### 4. ✅ Create TierSelectionModal Component
**Task 5 - COMPLETED**
- **File:** `src/components/services/TierSelectionModal.tsx`
- **Status:** Created and ready
- **Features:**
  - Accepts `PackageGroup` as prop
  - Displays tiers side-by-side (desktop) / stacked (mobile)
  - Price conversion with currency context (USD ↔ NGN)
  - Feature list (up to 6 items per tier)
  - Popular badge on most popular tier
  - Delivery time display
  - Selection state management
  - Close button + back button
  - Error fallback for empty tiers
  - Full keyboard navigation support
  - ARIA labels for screen readers
  - Test IDs for automated testing

---

## 📋 TODO: NEXT STEPS (20/25 REMAINING)

### Phase 1: Foundation & "Ready to Build" Pilot

#### Task 4: Update Home Page with JourneySection
**Priority:** HIGH (Next immediate task)
- [ ] Open `app/page.tsx`
- [ ] Import `JourneySection` component
- [ ] Replace generic "Our Services" grid
- [ ] Maintain SEO structure & heading hierarchy
- [ ] Test with Lighthouse

#### Task 6: Create/Update Web & Mobile Service Page
**Priority:** HIGH  
- [ ] Create/update `app/services/web-and-mobile-software-development/page.tsx`
- [ ] Import `WEB_DEV_PACKAGE_GROUPS`
- [ ] Render as high-level cards (4 columns)
- [ ] Show "Starting at $X" on each card
- [ ] Add onClick to open `TierSelectionModal`
- [ ] Add "Custom Build" escape hatch CTA
- [ ] Test responsive layout (mobile/tablet/desktop)

#### Task 7: Connect Modal to Payment Flow
**Priority:** HIGH
- [ ] Import `ServicePaymentModal`
- [ ] Pass selected tier from TierSelectionModal → ServicePaymentModal
- [ ] Verify currency conversion (NGN/USD) works
- [ ] Test complete flow: Card → Modal → Payment

### Phase 2: The Custom Builder

#### Task 8: Create Custom Build Page Setup
**Priority:** MEDIUM
- [ ] Create `app/services/custom-build/page.tsx`
- [ ] Setup state: `selectedCore` (Web/Mobile/Both), `selectedAddons` (array)
- [ ] Plan 3-step UI structure

#### Tasks 9-11: Build Custom Builder UI
**Priority:** MEDIUM
- **Step 1 (Core):** Radio/card selection grid for main build type
- **Step 2 (Add-ons):** Checkbox list for auxiliary services (SEO, Logo, Maintenance, etc.)
- **Step 3 (Summary):** Live estimate sidebar with itemized breakdown + currency conversion

#### Task 12: Connect Custom Builder to Payment
**Priority:** MEDIUM
- [ ] Integrate Step 3 with ServicePaymentModal or contact form
- [ ] Pass custom bundle object (core + addons)

### Phase 3: Rollout & Expansion

#### Tasks 13-14: Refactor Business Plan (Have an Idea?)
**Priority:** MEDIUM
- [ ] Update `src/data/servicePackages.ts` with `BUSINESS_PLAN_PACKAGE_GROUPS`
- [ ] Create/update `app/services/business-plan/page.tsx`
- [ ] Implement Group Card → Modal flow

#### Tasks 15-16: Refactor Marketing (Need Customers?)
**Priority:** MEDIUM
- [ ] Update `src/data/servicePackages.ts` with groups (Social Media, SEO, Ads, etc.)
- [ ] Create/update `app/services/social-media/page.tsx`
- [ ] Implement Group Card → Modal flow

#### Task 17: Add Next Step Blocks to Course Pages
**Priority:** LOW
- [ ] Open `app/courses/[slug]/page.tsx`
- [ ] Add conditional CTA: React Native → hire for app; Lean Startup → business plan
- [ ] Make dynamic based on course metadata

### QA & Validation (Tasks 18-25)

#### Task 18: Test Currency Switching
- [ ] Switch USD ↔ NGN in currency selector
- [ ] Verify prices update in TierSelectionModal
- [ ] Verify prices update in ServicePaymentModal
- [ ] Test persistence across page navigation

#### Task 19: Mobile Responsiveness
- [ ] Test TierSelectionModal on 375px-480px
- [ ] Test custom builder on mobile (all 3 steps)
- [ ] Verify button sizes & scrollability
- [ ] Test on tablet (768px)

#### Task 20: SEO Validation
- [ ] Verify heading hierarchy (H2/H3)
- [ ] Check alt text on icons
- [ ] Validate page titles & meta descriptions
- [ ] Test with Lighthouse/SEO tools

#### Task 21: Error Handling & Fallbacks
- [ ] Handle empty tiers gracefully
- [ ] Show "Contact for pricing" if data missing
- [ ] Graceful degradation on API failure
- [ ] Handle image loading errors

#### Task 22: End-to-End Integration Test
- [ ] Test all 4 home page journeys
- [ ] Verify complete flow: Card → Service page → Modal → Payment
- [ ] Test custom builder flow
- [ ] Currency switching throughout

#### Task 23: Code Review & Cleanup
- [ ] TypeScript strictness check
- [ ] ESLint validation
- [ ] Unused imports/exports removal
- [ ] Consistent naming & documentation

#### Task 24: Accessibility Audit
- [ ] Run axe-core on new components
- [ ] Verify keyboard navigation
- [ ] Screen reader friendly
- [ ] WCAG 2 AA compliance

#### Task 25: Performance Optimization
- [ ] Check bundle size impact
- [ ] Lazy load modals if needed
- [ ] Optimize images
- [ ] Verify Lighthouse >90

---

## 🗂️ File Structure Created/Updated

### NEW FILES CREATED (2):
```
src/components/home/
  └── JourneySection.tsx          ✅ DONE

src/components/services/
  └── TierSelectionModal.tsx       ✅ DONE
```

### FILES TO CREATE (8+):
```
app/services/web-and-mobile-software-development/
  └── page.tsx                     (Task 6)

app/services/custom-build/
  └── page.tsx                     (Task 8)
  └── steps/Step1.tsx              (Task 9)
  └── steps/Step2.tsx              (Task 10)
  └── steps/Step3.tsx              (Task 11)

app/services/business-plan/
  └── page.tsx                     (Task 14)

app/services/social-media/
  └── page.tsx                     (Task 16)
```

### FILES TO UPDATE (2):
```
app/page.tsx                       (Task 4)
app/courses/[slug]/page.tsx        (Task 17)
```

---

## 🎨 Component Architecture

### Home Page Flow
```
JourneySection
├── Journey Card 1: Have an Idea?
│   └── Link → /services/business-plan
├── Journey Card 2: Ready to Build?
│   └── Link → /services/web-and-mobile
├── Journey Card 3: Need Customers?
│   └── Link → /services/social-media
├── Journey Card 4: Want to Learn?
│   └── Link → /courses
└── Custom Solution CTA
    └── Link → /services/custom-build
```

### Service Page Flow
```
ServicePage
├── Package Groups (Cards)
│   ├── Group 1: E-commerce
│   │   └── onClick → TierSelectionModal
│   ├── Group 2: Business Website
│   │   └── onClick → TierSelectionModal
│   └── ...
├── TierSelectionModal
│   ├── Tier Options (radio selection)
│   ├── Price Display (with currency conversion)
│   └── "Continue" Button
│       └── onTierSelect → ServicePaymentModal
└── ServicePaymentModal
    └── Payment processing
```

### Custom Builder Flow
```
CustomBuildPage
├── Step 1: Core Selection
│   ├── Web Only
│   ├── Mobile Only
│   └── Both
├── Step 2: Add-ons
│   ├── Checkbox: SEO
│   ├── Checkbox: Logo
│   ├── Checkbox: Maintenance
│   └── ...
└── Step 3: Live Estimate
    ├── Itemized Breakdown
    ├── Currency Selector
    ├── Total Price (NGN/USD)
    └── "Proceed to Payment" Button
```

---

## 🔄 Currency Integration Points

All new components respect the global currency context:

1. **JourneySection:** Links preserve routing, no price display
2. **TierSelectionModal:** 
   - Uses `useCurrency()` hook
   - Converts prices: `convertPrice(tier.price, 'USD', currentCurrency.code)`
   - Displays: `${currentCurrency.symbol}${convertedPrice}`
3. **Custom Builder Step 3:**
   - Sum of prices with conversion
   - Dynamic currency switching
   - Real-time recalculation

---

## 🧪 Testing Checklist

### Unit Tests (To Create)
- [ ] JourneySection renders 4 cards
- [ ] TierSelectionModal accepts group prop
- [ ] Currency conversion calculates correctly
- [ ] Tier selection state updates
- [ ] Modal opens/closes

### Integration Tests (To Create)
- [ ] Home → Service page flow
- [ ] Service page → Tier modal flow
- [ ] Tier modal → Payment flow
- [ ] Currency switching throughout
- [ ] Custom builder complete flow

### Manual QA (To Perform)
- [ ] Keyboard navigation (Tab, Enter, Escape)
- [ ] Screen reader (NVDA, JAWS)
- [ ] Mobile viewport testing
- [ ] Payment modal integration
- [ ] Error state handling

---

## 📊 Estimated Timeline

| Phase | Tasks | Estimate | Status |
|-------|-------|----------|--------|
| **Foundation** | 1-7 | 2-3 hours | In Progress |
| **Custom Builder** | 8-12 | 4-5 hours | Not Started |
| **Expansion** | 13-17 | 3-4 hours | Not Started |
| **QA** | 18-25 | 2-3 hours | Not Started |
| **TOTAL** | 25 | **11-15 hours** | 20% Complete |

---

## 🚀 Next Immediate Actions

1. **Task 4 (1 hr):** Update `app/page.tsx` with JourneySection
2. **Task 6 (2 hrs):** Create web-mobile service page with group cards
3. **Task 7 (1 hr):** Connect modal to payment flow
4. **Task 18 (1 hr):** Test currency switching end-to-end

These 4 tasks complete the "Ready to Build" pilot and validate the core pattern.

---

## 📞 Questions & Notes

- **Sanity Integration:** Are we pulling PackageGroups from Sanity or using local data in servicePackages.ts?
- **Payment Flow:** Should tier selection merge with existing ServicePaymentModal or create new modal?
- **Custom Builder Complexity:** Complex branching logic - consider state management library (Zustand/Context)?
- **Mobile UX:** TierSelectionModal may need scrollable container on small screens
