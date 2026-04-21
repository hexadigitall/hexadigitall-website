# Hexadigitall Dark Mode Execution Tracker

This is the operational companion to the strategy document in [DARK_MODE_IMPLEMENTATION_PLAYBOOK.md](DARK_MODE_IMPLEMENTATION_PLAYBOOK.md).

Use this file as the live implementation tracker.

## How To Use This Tracker

1. Do not start random file edits. Execute in the order below.
2. Before each sprint/day, mark items with one of:
1. `[ ]` not started
2. `[-]` in progress
3. `[x]` done
4. After each completed cluster, run the verification checklist for that cluster.
5. Only proceed to next cluster after blockers are resolved.

## Implementation Status Legend

1. `[ ]` not started
2. `[-]` in progress
3. `[x]` complete
4. `[!]` blocked

## Track A: Foundation (must be completed first)

### A1. Tailwind + Global Theme Bootstrapping

Status: `[ ]`

Target files:

1. [tailwind.config.ts](tailwind.config.ts)
2. [src/app/layout.tsx](src/app/layout.tsx)
3. [src/app/globals.css](src/app/globals.css)

Tasks:

1. `[ ]` Enable dark mode strategy in Tailwind config.
2. `[ ]` Add root-level theme initialization script in layout `<head>` to prevent first-paint mismatch.
3. `[ ]` Add semantic CSS variables for light and dark in global styles.
4. `[ ]` Update `body` shell styles to use semantic variables instead of hard-coded light values.
5. `[ ]` Add reduced-motion-safe transition policy for theme change.
6. `[ ]` Add browser `theme-color` handling plan (static fallback + runtime update hook).

Verification:

1. `[ ]` Hard refresh does not flash incorrect theme.
2. `[ ]` No hydration warning introduced by root class changes.
3. `[ ]` Base typography and page background are readable in both themes.

### A2. Theme State, Provider, and Toggle Contracts

Status: `[ ]`

Target files (expected to be created/updated):

1. [src/contexts](src/contexts)
2. [src/components/layout/Header.tsx](src/components/layout/Header.tsx)

Tasks:

1. `[ ]` Implement theme mode state (`light`, `dark`, `system`).
2. `[ ]` Persist preference to localStorage.
3. `[ ]` Resolve system mode using `prefers-color-scheme`.
4. `[ ]` Add desktop and mobile-accessible toggle UI in header.
5. `[ ]` Add `aria-label`, keyboard behavior, and visible focus for toggle.

Verification:

1. `[ ]` Theme persists across reload and route changes.
2. `[ ]` System mode follows OS preference changes.
3. `[ ]` Toggle works in keyboard-only navigation.

## Track B: Shared Layout and Global UI (high priority)

### B1. Header + Navigation

Status: `[ ]`

Primary file:

1. [src/components/layout/Header.tsx](src/components/layout/Header.tsx)

Notes from inventory:

1. Header has extensive light-biased classes (`bg-white`, `border-gray-*`, `text-darkText`, `bg-lightGray`) and dropdown surfaces.

Tasks:

1. `[ ]` Replace top-level shell colors with semantic theme classes.
2. `[ ]` Migrate desktop nav pills, dropdown panels, and items.
3. `[ ]` Migrate tablet and mobile menu surfaces, overlays, and text colors.
4. `[ ]` Ensure active/hover states remain distinct in both themes.
5. `[ ]` Ensure logo/background contrast remains acceptable.

Verification:

1. `[ ]` Desktop, tablet, mobile menus are readable in both themes.
2. `[ ]` Dropdown shadows and borders are visible on dark surfaces.
3. `[ ]` Focus rings are visible for all nav controls.

### B2. Footer

Status: `[ ]`

Primary file:

1. [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)

Tasks:

1. `[ ]` Validate/adjust gradient scheme for dark mode readability.
2. `[ ]` Ensure text-gray variants meet contrast in dark context.
3. `[ ]` Verify newsletter input and social icon contrast/focus states.
4. `[ ]` Ensure link hover states are perceivable in both themes.

Verification:

1. `[ ]` Footer is visually balanced in both themes.
2. `[ ]` All footer links pass basic contrast checks.

### B3. Floating CTA and Overlays

Status: `[ ]`

Primary file:

1. [src/components/ui/FloatingCTA.tsx](src/components/ui/FloatingCTA.tsx)

Tasks:

1. `[ ]` Convert expanded menu panel from fixed white/gray to semantic surfaces.
2. `[ ]` Ensure helper bubble and icon contrast in dark mode.
3. `[ ]` Verify menu card borders/shadows on dark backgrounds.

Verification:

1. `[ ]` FAB remains visually prominent but not harsh in dark mode.
2. `[ ]` Expanded options remain readable and keyboard-focusable.

## Track C: Priority Page and Flow Migration

### C0. Route inventory captured (App Router only)

Status: `[x]`

Observed routes (sample, non-exhaustive):

1. [src/app/page.tsx](src/app/page.tsx)
2. [src/app/services/page.tsx](src/app/services/page.tsx)
3. [src/app/contact/page.tsx](src/app/contact/page.tsx)
4. [src/app/courses/page.tsx](src/app/courses/page.tsx)
5. [src/app/blog/page.tsx](src/app/blog/page.tsx)
6. [src/app/store/page.tsx](src/app/store/page.tsx)
7. [src/app/mentorships/page.tsx](src/app/mentorships/page.tsx)
8. [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx)

No legacy `src/pages` directory detected.

### C1. Marketing and Conversion Critical Routes (first wave)

Status: `[ ]`

Targets:

1. [src/app/page.tsx](src/app/page.tsx)
2. [src/app/services/page.tsx](src/app/services/page.tsx)
3. [src/app/contact/page.tsx](src/app/contact/page.tsx)
4. [src/app/courses/page.tsx](src/app/courses/page.tsx)
5. [src/app/mentorships/page.tsx](src/app/mentorships/page.tsx)

Tasks per route:

1. `[ ]` hero and section backgrounds
2. `[ ]` headings/body text contrast
3. `[ ]` cards/panels/forms
4. `[ ]` badges/chips
5. `[ ]` CTA buttons and hover states
6. `[ ]` empty/loading/error visuals

Verification:

1. `[ ]` desktop and mobile visual check complete.
2. `[ ]` no unreadable section in dark mode.

### C2. Course and Enrollment Funnel

Status: `[ ]`

High-priority files from style density inventory:

1. [src/components/CourseEnrollmentEnhanced.tsx](src/components/CourseEnrollmentEnhanced.tsx)
2. [src/app/enrollment-success/page.tsx](src/app/enrollment-success/page.tsx)
3. [src/app/courses/CoursesPageContent.tsx](src/app/courses/CoursesPageContent.tsx)
4. [src/components/courses/CoursePaymentModal.tsx](src/components/courses/CoursePaymentModal.tsx)
5. [src/components/mentorships/MentorshipEnrollmentModal.tsx](src/components/mentorships/MentorshipEnrollmentModal.tsx)

Tasks:

1. `[ ]` pricing cards and strike-through text states
2. `[ ]` payment and checkout interaction states
3. `[ ]` modal overlay/panel/input contrast
4. `[ ]` disabled states visibility in dark mode

Verification:

1. `[ ]` end-to-end enrollment journey in dark mode is usable.
2. `[ ]` no contrast failures on pricing and confirmation surfaces.

### C3. Admin Surfaces (second wave, high density)

Status: `[ ]`

Top admin targets by style-density:

1. [src/app/admin/operations/page.tsx](src/app/admin/operations/page.tsx)
2. [src/app/admin/enrollments/[id]/page.tsx](src/app/admin/enrollments/[id]/page.tsx)
3. [src/app/admin/submissions/[id]/page.tsx](src/app/admin/submissions/[id]/page.tsx)
4. [src/app/admin/submissions/page.tsx](src/app/admin/submissions/page.tsx)
5. [src/app/admin/users/page.tsx](src/app/admin/users/page.tsx)
6. [src/app/admin/analytics/page.tsx](src/app/admin/analytics/page.tsx)
7. [src/app/admin/dashboard/page.tsx](src/app/admin/dashboard/page.tsx)
8. [src/app/admin/enrollments/page.tsx](src/app/admin/enrollments/page.tsx)

Tasks:

1. `[ ]` tables and row hover states
2. `[ ]` badges/status indicators
3. `[ ]` form controls and filters
4. `[ ]` chart/card contrast
5. `[ ]` modal/dialog consistency

Verification:

1. `[ ]` all admin actions remain legible and distinguishable in dark mode.

## Track D: Component Workstream Checklist by Directory

Status: `[ ]`

Component directories to process:

1. [src/components/ui](src/components/ui)
2. [src/components/layout](src/components/layout)
3. [src/components/services](src/components/services)
4. [src/components/courses](src/components/courses)
5. [src/components/mentorships](src/components/mentorships)
6. [src/components/admin](src/components/admin)
7. [src/components/student](src/components/student)
8. [src/components/sections](src/components/sections)
9. [src/components/home](src/components/home)
10. [src/components/common](src/components/common)
11. [src/components/campaign](src/components/campaign)
12. [src/components/service](src/components/service)

For each directory:

1. `[ ]` list files with hard-coded light classes
2. `[ ]` migrate surfaces/text/borders to semantic theme classes
3. `[ ]` verify hover/focus/disabled in both themes
4. `[ ]` mark done with screenshot references

## Track E: Highest-Risk File Queue (from current scan)

Use this queue for immediate migration priority after Foundation and Layout.

1. `[ ]` [src/components/CourseEnrollmentEnhanced.tsx](src/components/CourseEnrollmentEnhanced.tsx)
2. `[ ]` [src/app/terms-of-service/page.tsx](src/app/terms-of-service/page.tsx)
3. `[ ]` [src/app/teacher/dashboard/page.tsx](src/app/teacher/dashboard/page.tsx)
4. `[ ]` [src/app/admin/operations/page.tsx](src/app/admin/operations/page.tsx)
5. `[ ]` [src/app/admin/enrollments/[id]/page.tsx](src/app/admin/enrollments/[id]/page.tsx)
6. `[ ]` [src/app/privacy-policy/page.tsx](src/app/privacy-policy/page.tsx)
7. `[ ]` [src/app/admin/submissions/[id]/page.tsx](src/app/admin/submissions/[id]/page.tsx)
8. `[ ]` [src/components/services/UnifiedServiceRequestFlow.tsx](src/components/services/UnifiedServiceRequestFlow.tsx)
9. `[ ]` [src/components/services/EnhancedServiceWizard.tsx](src/components/services/EnhancedServiceWizard.tsx)
10. `[ ]` [src/app/admin/analytics/page.tsx](src/app/admin/analytics/page.tsx)
11. `[ ]` [src/app/store/[slug]/page.tsx](src/app/store/[slug]/page.tsx)
12. `[ ]` [src/app/services/build-bundle/page.tsx](src/app/services/build-bundle/page.tsx)
13. `[ ]` [src/app/courses/CoursesPageContent.tsx](src/app/courses/CoursesPageContent.tsx)
14. `[ ]` [src/app/services/request/success/page.tsx](src/app/services/request/success/page.tsx)
15. `[ ]` [src/app/enrollment-success/page.tsx](src/app/enrollment-success/page.tsx)
16. `[ ]` [src/app/services/ServicesPageClient.tsx](src/app/services/ServicesPageClient.tsx)
17. `[ ]` [src/components/services/CustomizationWizard.tsx](src/components/services/CustomizationWizard.tsx)
18. `[ ]` [src/components/services/PaymentSummary.tsx](src/components/services/PaymentSummary.tsx)
19. `[ ]` [src/components/layout/Header.tsx](src/components/layout/Header.tsx)
20. `[ ]` [src/components/layout/Footer.tsx](src/components/layout/Footer.tsx)

## Track F: QA and Accessibility Gates

### F1. Functional QA

Status: `[ ]`

1. `[ ]` verify theme switching on first load, route change, and refresh
2. `[ ]` verify persistence across browser restart
3. `[ ]` verify system mode changes when OS theme changes

### F2. Accessibility QA

Status: `[ ]`

1. `[ ]` contrast check for text and controls (both themes)
2. `[ ]` keyboard tab flow in header, forms, modals, FAB
3. `[ ]` focus ring visibility in both themes
4. `[ ]` reduced motion preference respected during theme transitions

### F3. Visual Regression QA

Status: `[ ]`

Capture before/after screenshots for:

1. `[ ]` home
2. `[ ]` services
3. `[ ]` contact
4. `[ ]` courses
5. `[ ]` enrollment modal/checkout
6. `[ ]` admin dashboard

## Track G: Rollout Controls

Status: `[ ]`

1. `[ ]` deploy first to staging with full QA matrix
2. `[ ]` fix severity-1 and severity-2 issues
3. `[ ]` optional feature-flag rollout in production
4. `[ ]` monitor logs and user feedback for 48-72 hours
5. `[ ]` remove temporary safeguards after stability window

## Blocker Log

Use this section for real blockers only.

1. Date:
2. Area:
3. Blocker:
4. Impact:
5. Owner:
6. Resolution ETA:

## Daily Update Template

1. Date:
2. Completed today:
3. In progress:
4. Blockers:
5. Next files queued:

## Definition Of Done (Execution)

1. `[ ]` Foundation track complete with no hydration flicker
2. `[ ]` Header/Footer/FAB complete and verified
3. `[ ]` Priority routes migrated and QA-approved
4. `[ ]` Admin and high-density files migrated
5. `[ ]` Accessibility and visual regression gates passed
6. `[ ]` Production rollout stable
