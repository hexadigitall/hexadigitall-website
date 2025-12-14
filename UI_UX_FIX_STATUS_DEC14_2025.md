# UI/UX Mobile Fixes – Dec 14, 2025

## Scope
- À La Carte Bundle Builder tabs on small screens
- Admin page navbar tabs (horizontal pills)
- Recurring "Custom Build in Progress" popup

## Changes Implemented
- Builder tabs: added snap scrolling, spacing, and min widths for clear, scrollable pills.
  - File: src/app/services/build-bundle/page.tsx
  - Classes: `snap-x snap-mandatory`, `gap-1 sm:gap-2`, `min-w-[140px]`, `border-b-[3px]` for active tab
- Admin navbar: improved mobile horizontal scroll with snap and accessible current-page indication.
  - File: src/components/admin/AdminNavbar.tsx
  - Classes: `snap-x snap-mandatory`, `min-w-[120px]`, `aria-current="page"` when active
- Popup persistence: only show resume bar when real progress exists and respect dismissal across sessions.
  - File: src/components/services/CustomBuildResumeBar.tsx
  - Logic: show if `step >= 2 || core || addOns.length > 0` and NOT `localStorage['hexadigitall_custom_build_resume_dismissed']`
  - Dismiss: sets dismissal flag to prevent reappearing until new progress

## Validation
- Build: next build succeeded (Next.js 15.5.3)
- Lint/Typecheck: app build passed checks; non-app script/test lint warnings remain but do not affect deploy
- Deploy: vercel --prod succeeded
  - Production URL: https://hexadigitall-website-icw5uyi2v-hexadigitall-s-projects.vercel.app

## Next Steps
- Optional: clean up non-critical ESLint warnings in scripts/tests to achieve zero warnings globally
- Monitor mobile UX on real devices; adjust tab min-widths or spacing per feedback
- Resume aggressive marketing tasks as planned
