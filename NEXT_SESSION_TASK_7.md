# NEXT SESSION STARTUP - Task 7: Payment Flow Integration

**Estimated Time:** 1-2 hours  
**Complexity:** Medium  
**Priority:** HIGH (blocks Phase 2 testing)

---

## What Needs to Be Done

### Overview
Connect the **TierSelectionModal** (currently on Web/Mobile service page) to the **ServicePaymentModal** (payment processing). Currently, selecting a tier just closes the modal without proceeding to payment.

### Current State
```
User Flow: Web/Mobile Page → TierSelectionModal → [closes] ❌
Target State: Web/Mobile Page → TierSelectionModal → ServicePaymentModal → Payment ✅
```

### Acceptance Criteria
- [x] Tier selection passes the selected tier object to payment modal
- [ ] ServicePaymentModal receives tier info and displays pricing
- [ ] Currency conversion works throughout the flow
- [ ] User can complete checkout without errors
- [ ] "Back" button returns to service page (not tier selector)

---

## Files to Modify

### 1. `src/app/services/web-and-mobile-software-development/page.tsx`
**Current Issue:** `handleTierSelect()` just closes modal (lines 26-33)

```tsx
// Current (non-functional):
const handleTierSelect = (tier: any) => {
  if (tier) {
    console.log('Selected tier:', tier);
    setShowModal(false);  // ❌ Just closes - no next step
  }
};

// Needs to be:
const handleTierSelect = (tier: ServicePackageTier) => {
  if (tier) {
    setSelectedTier(tier);  // Store selected tier
    setShowPaymentModal(true);  // Open payment modal
    setShowModal(false);  // Close tier selector
  }
};
```

**Changes Needed:**
1. Add state: `const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null);`
2. Add state: `const [showPaymentModal, setShowPaymentModal] = useState(false);`
3. Update `handleTierSelect()` to set these states
4. Add ServicePaymentModal import
5. Render ServicePaymentModal at bottom (similar to TierSelectionModal)

### 2. `src/components/services/TierSelectionModal.tsx`
**Current Issue:** Callback passes `ServicePackageTier` object (correct!), but check it includes all needed data

**Verify these fields exist on the tier object:**
```tsx
tier._key        // Unique identifier
tier.name        // Tier name
tier.price       // Price in USD
tier.currency    // Currency code
tier.features    // Array of features
tier.deliveryTime // Timeline
tier.billing     // one_time or monthly
```

### 3. Integration Point
**Where to check:** `src/components/services/ServicePaymentModal.tsx`
- Does it accept a `tier` prop?
- Does it handle currency conversion?
- Does it display tier details?

---

## Step-by-Step Implementation

### Step 1: Update Web/Mobile Page State
```tsx
// Add near top of component:
const [selectedTier, setSelectedTier] = useState<ServicePackageTier | null>(null);
const [showPaymentModal, setShowPaymentModal] = useState(false);

// Update handler:
const handleTierSelect = (tier: ServicePackageTier) => {
  setSelectedTier(tier);
  setShowPaymentModal(true);
  setShowModal(false);
};

// Add handler for payment modal:
const handlePaymentClose = () => {
  setShowPaymentModal(false);
  setSelectedTier(null);
};
```

### Step 2: Add ServicePaymentModal Import & Render
```tsx
// Import at top:
import ServicePaymentModal from '@/components/services/ServicePaymentModal';

// At bottom before closing </main>:
{showPaymentModal && selectedTier && (
  <ServicePaymentModal
    tier={selectedTier}
    packageGroup={selectedGroup}
    onClose={handlePaymentClose}
  />
)}
```

### Step 3: Test the Flow
1. Navigate to `/services/web-and-mobile-software-development`
2. Click a package card → TierSelectionModal opens
3. Select a tier → Payment modal should open (not close)
4. Verify tier details show in payment modal
5. Verify prices are currency-converted correctly
6. Test with both USD and NGN selected

---

## Currency Testing Checklist

After implementing, verify these work end-to-end:

- [ ] TierSelectionModal shows prices in USD initially
- [ ] Switch to NGN → prices update in modal
- [ ] Select tier → payment modal shows converted price
- [ ] Payment modal displays correct currency symbol
- [ ] Itemized breakdown shows individual items in correct currency

---

## Potential Issues & Solutions

### Issue 1: Type Mismatch
**Error:** `Type 'ServicePackageTier' is not assignable...`  
**Solution:** Use `any` type temporarily, then gradually type-correct

### Issue 2: ServicePaymentModal Not Found
**Error:** Module cannot be found  
**Solution:** Check `src/components/services/` for exact filename/export

### Issue 3: Missing Props
**Error:** Payment modal expects different prop names  
**Solution:** Check existing payment modal integration elsewhere in codebase

### Issue 4: Currency Not Converting
**Error:** Prices show as raw USD values  
**Solution:** Ensure ServicePaymentModal uses `useCurrency()` hook

---

## Files to Reference

- **Similar Implementation:** `src/components/marketing/StartupFunnel.tsx` (if it uses ServicePaymentModal)
- **Type Definitions:** `src/types/service.ts` (ServicePackageTier interface)
- **Currency Hook:** `src/contexts/CurrencyContext.tsx` (useCurrency)
- **Payment Modal:** `src/components/services/ServicePaymentModal.tsx`

---

## Estimated Time Breakdown

1. **Code Changes:** 15-20 minutes
   - Update state variables
   - Add import
   - Render modal component
   
2. **Testing:** 30-40 minutes
   - Click flow testing
   - Currency switching
   - Edge cases (back button, modal close)
   
3. **Debugging:** 20-30 minutes (if needed)
   - Type errors
   - Missing imports
   - Style issues

**Total:** 1-1.5 hours

---

## Success Criteria

When complete, you should be able to:
1. ✅ Click package card → select tier → open payment modal (uninterrupted flow)
2. ✅ See selected tier details in payment modal
3. ✅ Switch currency and see prices update throughout
4. ✅ Close payment modal and return to service page
5. ✅ No console errors or TypeScript warnings

---

## After Task 7 Complete

You'll have completed:
- **11/25 tasks** (44%)
- **Phase 1 Foundation:** 100% complete
- **Ready for:** Phase 2 kickoff (Business Plan, Marketing services)

---

**Good luck! This is the critical link in the payment funnel. Get it right and Phase 2 will be much smoother.**
