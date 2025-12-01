# Design System Audit & Pattern Guide

## ✅ Fixes Implemented

### Phase 1 Completed:
1. **globals.css** - Added standardized design system classes:
   - `btn-base`, `btn-primary`, `btn-secondary`, `btn-accent`, `btn-ghost`, `btn-white`
   - `card-base`, `card-bordered`, `card-elevated`, `card-interactive`
   - `input-standard`, `input-error`, `input-success`
   - `badge-base`, `badge-primary`, `badge-secondary`, `badge-success`, `badge-warning`, `badge-error`, `badge-accent`
   - `section-padding`, `section-padding-sm`, `container-standard`

2. **card-enhanced** - Updated to include standardized `rounded-2xl` border-radius

3. **CTAButton.tsx** - Added:
   - `min-h-[44px]` for accessibility touch targets
   - `active:scale-95` for consistent press feedback

4. **ServiceGroupCard.tsx** - Standardized:
   - Button uses `min-h-[44px]`, `rounded-xl`, `hover:-translate-y-1` pattern
   - Added focus ring for accessibility
   - Updated pricing highlight border-radius to `rounded-xl`

5. **CompleteServicePage.tsx** - Standardized:
   - All cards now use `card-enhanced` (includes `rounded-2xl`)
   - Buttons use `rounded-xl` consistently
   - Added `hover:-translate-y-1` instead of `hover:scale-105`
   - Added focus rings for accessibility

---

## 🔍 Design Issues Identified

### 1. **Border Radius Inconsistencies**
| Component Type | Current Usage | Standardized Value |
|----------------|---------------|-------------------|
| Buttons | `rounded-lg`, `rounded-xl`, `rounded-2xl` mixed | `rounded-xl` for primary, `rounded-lg` for secondary |
| Cards | `rounded-xl`, `rounded-2xl`, `rounded-3xl` mixed | `rounded-2xl` for all cards |
| Badges/Pills | `rounded-full` | `rounded-full` ✓ (correct) |
| Modals | `rounded-2xl` | `rounded-2xl` ✓ (correct) |
| Inputs | `rounded-md`, `rounded-lg` mixed | `rounded-lg` for all inputs |
| Icon containers | `rounded-xl`, `rounded-2xl`, `rounded-full` mixed | `rounded-xl` for squares, `rounded-full` for circles |

### 2. **Button Style Inconsistencies**
- **Primary buttons** have different gradient directions and colors across components
- **Hover states** vary: `hover:bg-primary/90`, `hover:opacity-90`, `hover:from-*-600`
- **Padding** inconsistent: `py-2`, `py-3`, `py-4` for same-sized buttons
- **Min-height** not always applied for touch accessibility (should be 44px)

### 3. **Color Usage Issues**
- Using hardcoded colors instead of theme variables in many places
- Accent color applied inconsistently (`blue-500`, `green-500`, `primary` mixed)
- Text contrast issues in some gradient backgrounds

### 4. **Spacing Inconsistencies**
- Section padding varies: `py-12`, `py-16`, `py-20`
- Container padding: `px-4`, `px-6` not standardized
- Gap between elements: `gap-4`, `gap-6`, `gap-8` inconsistent

### 5. **Shadow Inconsistencies**
- Cards use: `shadow-sm`, `shadow-md`, `shadow-lg`, `shadow-xl`, `shadow-2xl`
- Hover states sometimes add shadows, sometimes increase existing

### 6. **Animation & Transition Inconsistencies**
- Duration: `duration-200`, `duration-300`, `duration-500` mixed
- Easing: mostly `ease-in-out` but some missing
- Transform: `hover:scale-105`, `hover:-translate-y-1`, `hover:-translate-y-2`

---

## ✅ Design System Standards

### Border Radius Scale
```
none      = 0
sm        = 0.125rem (2px)
md        = 0.375rem (6px)
lg        = 0.5rem (8px)      → Inputs, small buttons
xl        = 0.75rem (12px)    → Primary buttons, icon containers
2xl       = 1rem (16px)       → Cards, modals
3xl       = 1.5rem (24px)     → Hero sections (rare)
full      = 9999px            → Badges, pills, avatar circles
```

### Button Standards
```css
/* Primary Button */
.btn-primary-standard {
  @apply min-h-[44px] px-6 py-3 bg-gradient-to-r from-primary to-primary/80 
         text-white font-semibold rounded-xl 
         hover:from-primary/90 hover:to-primary/70 
         active:scale-95 transition-all duration-300
         focus:ring-2 focus:ring-primary/50 focus:ring-offset-2;
}

/* Secondary Button */
.btn-secondary-standard {
  @apply min-h-[44px] px-6 py-3 border-2 border-gray-300 
         text-gray-700 font-semibold rounded-xl
         hover:border-gray-400 hover:bg-gray-50
         active:scale-95 transition-all duration-300
         focus:ring-2 focus:ring-gray-300 focus:ring-offset-2;
}

/* Accent/CTA Button */
.btn-accent-standard {
  @apply min-h-[44px] px-6 py-3 bg-gradient-to-r from-accent to-accent/80
         text-white font-semibold rounded-xl
         hover:from-accent/90 hover:to-accent/70
         active:scale-95 transition-all duration-300
         focus:ring-2 focus:ring-accent/50 focus:ring-offset-2;
}
```

### Card Standards
```css
/* Standard Card */
.card-standard {
  @apply bg-white rounded-2xl border border-gray-200 
         shadow-sm hover:shadow-lg
         transition-all duration-300;
}

/* Enhanced Card (glassmorphism) */
.card-enhanced-standard {
  @apply card-enhanced rounded-2xl p-6
         hover:shadow-xl hover:-translate-y-1
         transition-all duration-300;
}

/* Interactive Card */
.card-interactive {
  @apply card-enhanced-standard cursor-pointer
         hover:border-primary/50 
         active:scale-[0.98];
}
```

### Spacing Scale
```
Section Vertical: py-16 (mobile), py-20 (desktop)
Container Horizontal: px-4 (mobile), px-6 (desktop)
Card Padding: p-4 (mobile), p-6 (desktop)
Element Gaps: gap-4 (tight), gap-6 (normal), gap-8 (loose)
```

### Shadow Scale
```
none      = none
sm        = Small elements, minimal elevation
md        = Default cards
lg        = Hover states, elevated cards
xl        = Modals, dropdowns
2xl       = Hero elements, major CTAs
```

### Transition Standards
```css
/* Default transition */
transition-all duration-300 ease-in-out

/* Fast interactions (buttons, toggles) */
transition-all duration-200 ease-in-out

/* Slow animations (modals, panels) */
transition-all duration-500 ease-in-out
```

### Color Usage
```
Primary Actions: from-primary to-primary/80 (gradient)
Secondary Actions: border-gray-300 (outline)
Success: from-green-500 to-emerald-500
Warning: from-orange-500 to-amber-500
Error: from-red-500 to-rose-500
Info: from-blue-500 to-cyan-500

Text Colors:
- Primary text: text-gray-900
- Secondary text: text-gray-600
- Muted text: text-gray-500
- Inverted: text-white
```

---

## 🛠️ Fix Implementation Priority

### Phase 1: Critical (Accessibility)
1. ✅ Ensure all buttons have `min-h-[44px]` for touch targets
2. ✅ Add focus states to all interactive elements
3. ✅ Fix color contrast issues

### Phase 2: High Priority (Consistency)
1. Standardize button styles across all components
2. Unify card border-radius to `rounded-2xl`
3. Normalize spacing patterns

### Phase 3: Polish
1. Unify hover animations
2. Standardize shadow usage
3. Clean up gradient directions

---

## 📋 Components to Update

### Buttons (Priority: High)
- [x] `CTAButton.tsx` - Already well-structured, added min-height
- [x] `ServiceGroupCard.tsx` - Standardized button styles
- [x] `CompleteServicePage.tsx` - Unified button patterns
- [ ] `button.tsx` - Consider consolidation with CTAButton
- [ ] Custom buttons in other components - Ongoing

### Cards (Priority: High)
- [x] `ServiceGroupCard.tsx` - Using standardized pattern
- [x] `CompleteServicePage.tsx` - Unified card styles
- [ ] `JourneySection.tsx` - Review card hover behavior
- [ ] Other card-based components - Ongoing

### Inputs (Priority: Medium)
- [ ] `ContactForm.tsx` - Apply `input-standard` class
- [ ] `UnifiedServiceRequestFlow.tsx` - Form inputs
- [ ] `ServiceSearchBar.tsx` - Search input styling

### Modals (Priority: Medium)
- [x] `TierSelectionModal.tsx` - Already using good patterns
- [ ] `Modal.tsx` - Review base modal styling
- [ ] `CoursePaymentModal.tsx` - Payment modal styling

---

## 🎨 CSS Classes to Add to globals.css

```css
/* Standardized Button Classes */
.btn-base {
  @apply min-h-[44px] inline-flex items-center justify-center
         font-semibold rounded-xl
         transition-all duration-300
         focus:ring-2 focus:ring-offset-2
         disabled:opacity-50 disabled:cursor-not-allowed;
}

.btn-primary {
  @apply btn-base px-6 py-3
         bg-gradient-to-r from-primary to-primary/80 text-white
         hover:from-primary/90 hover:to-primary/70
         active:scale-95
         focus:ring-primary/50;
}

.btn-secondary {
  @apply btn-base px-6 py-3
         border-2 border-gray-300 text-gray-700
         hover:border-gray-400 hover:bg-gray-50
         active:scale-95
         focus:ring-gray-300;
}

.btn-ghost {
  @apply btn-base px-4 py-2
         text-gray-600 hover:text-gray-900
         hover:bg-gray-100
         focus:ring-gray-200;
}

/* Standardized Card Classes */
.card-base {
  @apply bg-white rounded-2xl
         transition-all duration-300;
}

.card-bordered {
  @apply card-base border border-gray-200
         shadow-sm hover:shadow-lg;
}

.card-elevated {
  @apply card-base shadow-md
         hover:shadow-xl hover:-translate-y-1;
}

/* Standardized Input Classes */
.input-base {
  @apply w-full px-4 py-3 rounded-lg
         border border-gray-300
         focus:ring-2 focus:ring-primary focus:border-transparent
         transition-all duration-200
         placeholder:text-gray-400;
}

.input-error {
  @apply input-base border-red-500
         focus:ring-red-500;
}

/* Standardized Badge Classes */
.badge-base {
  @apply inline-flex items-center px-3 py-1
         rounded-full text-sm font-medium;
}

.badge-primary {
  @apply badge-base bg-primary/10 text-primary;
}

.badge-success {
  @apply badge-base bg-green-100 text-green-800;
}

.badge-warning {
  @apply badge-base bg-orange-100 text-orange-800;
}

.badge-accent {
  @apply badge-base bg-gradient-to-r from-orange-500 to-pink-500 text-white;
}
```

---

## 📊 Design Token Checklist

Use this checklist when reviewing/creating new components:

### Button Checklist
- [ ] Uses standardized border-radius (`rounded-xl` or `rounded-lg`)
- [ ] Has `min-h-[44px]` for accessibility
- [ ] Uses consistent padding (`px-6 py-3` standard)
- [ ] Has proper focus states (`focus:ring-2 focus:ring-offset-2`)
- [ ] Uses `transition-all duration-300`
- [ ] Has active state (`active:scale-95`)

### Card Checklist
- [ ] Uses `rounded-2xl` border-radius
- [ ] Has consistent padding (`p-6` standard)
- [ ] Uses appropriate shadow level
- [ ] Has hover transition (`hover:shadow-lg` or similar)
- [ ] Uses `transition-all duration-300`

### Form Input Checklist
- [ ] Uses `rounded-lg` border-radius
- [ ] Has consistent padding (`px-4 py-3`)
- [ ] Has focus ring (`focus:ring-2 focus:ring-primary`)
- [ ] Has placeholder styling
- [ ] Has error state styles if needed

### Spacing Checklist
- [ ] Section uses `py-16 md:py-20`
- [ ] Container uses `px-4 sm:px-6`
- [ ] Uses consistent gap values (4, 6, or 8)

---

## 🔄 Migration Guide

When updating existing components:

1. **Replace inline styles** with standardized classes
2. **Check border-radius** - normalize to the scale above
3. **Verify touch targets** - add min-height if missing
4. **Add focus states** - ensure keyboard accessibility
5. **Normalize transitions** - use duration-300 as default
6. **Test hover states** - ensure consistent behavior

---

*Last Updated: December 1, 2025*
*Status: Phase 1 Completed - Standardized CSS classes and core component updates*
*Next Review: After Phase 2 implementation (remaining button consolidation)*
