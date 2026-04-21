# Hexadigitall Dark Mode Implementation Playbook

This document is the canonical implementation guide for adding robust, full-site dark mode support to the Hexadigitall website.

It is intentionally detailed so implementation can be resumed later without ambiguity, re-discovery work, or avoidable regressions.

Companion execution tracker:

1. [DARK_MODE_EXECUTION_TRACKER.md](DARK_MODE_EXECUTION_TRACKER.md)

## Purpose

Deliver a complete, production-quality dark mode system that is:

1. technically correct for Next.js SSR/CSR
2. visually consistent across all pages and components
3. accessible with strong contrast and keyboard support
4. maintainable through tokenized theming and clear governance
5. safe to roll out incrementally without blocking feature work

## Success Criteria

Dark mode is successful only when all of the following are true:

1. users can select Light, Dark, or System mode
2. theme preference persists across sessions and tabs
3. no hydration flash or major theme flicker on page load
4. no high-traffic page has unreadable text or low-contrast surfaces
5. all shared UI primitives and key templates are theme-safe
6. QA pass confirms accessibility and visual integrity in both themes
7. team has rules to prevent new hard-coded light-only styles

## Current State Summary

Based on repository inspection:

1. Stack: Next.js + Tailwind CSS
2. No existing global theme provider in app root
3. No established dark-mode configuration in Tailwind setup
4. Global styles and many component styles are light-biased
5. Multiple hard-coded color utility classes are present across the codebase

Implication:

Dark mode will require a structured migration, not just a single configuration toggle.

## Scope Definition

### In Scope

1. global theme system and persistence
2. semantic theme tokens for color usage
3. dark mode toggle UX and behavior
4. migration of shared components and major page templates
5. contrast and accessibility hardening
6. regression testing and rollout controls

### Out Of Scope (unless explicitly approved)

1. complete redesign of brand identity
2. typography system replacement
3. major animation redesign unrelated to dark mode
4. backend API changes unrelated to theme preference

## Core Architecture Decisions

### 1. Theme Strategy

Use class-based theming at root level.

Recommended model:

1. add a root theme class on html or body
2. support values: light, dark, system
3. when system is selected, map to prefers-color-scheme at runtime

Why class-based:

1. deterministic control for manual toggles
2. easier debugging than media-only approach
3. allows user override of OS preference

### 2. Token Strategy

Adopt semantic CSS variable tokens in global styles.

Do not rely on direct utility grays as the long-term source of truth.

Token categories:

1. surfaces: page, panel, elevated panel, muted panel
2. text: primary, secondary, tertiary, inverse
3. borders: default, strong, subtle
4. actions: primary, secondary, accent, destructive
5. states: success, warning, info, danger
6. overlays: scrim, modal backdrop
7. focus: ring color and offset contrast

### 3. Tailwind Integration

Use tailwind dark mode with class strategy and map utility usage to semantic patterns.

Near term:

1. apply dark: variants where needed
2. use tokenized utility classes for custom components

Long term:

1. reduce direct hard-coded color class usage
2. enforce semantic class conventions in code review

### 4. Persistence and SSR Behavior

Store user preference in localStorage.

Bootstrap theme before initial paint to reduce flash:

1. inject minimal early script in layout head
2. apply resolved class before rendering visible content

System mode behavior:

1. if theme is system, resolve based on prefers-color-scheme
2. listen for system changes only while system mode is active

## Target User Experience

### Theme Modes

1. Light: explicit light theme
2. Dark: explicit dark theme
3. System: auto-matches OS/browser preference

### Toggle Behavior

1. desktop: visible in header
2. mobile: accessible in menu or settings area
3. keyboard accessible with proper aria labels
4. announces mode changes for assistive technologies where practical

### Visual Behavior

1. optional subtle transition between themes
2. no long global animation that hurts responsiveness
3. respect reduced-motion preferences

## Detailed Implementation Plan

## Phase 0: Preparation and Inventory

Objective: de-risk migration through visibility and prioritization.

Tasks:

1. inventory all shared primitives:
1. buttons
2. inputs
3. selects
4. cards
5. modals
6. drawers
7. nav/header/footer
8. alerts/toasts

2. identify high-traffic pages and conversion-critical surfaces:
1. homepage
2. services landing pages
3. contact and forms
4. checkout/enrollment flows
5. blog/course detail templates

3. create migration tracker matrix per component/page:
1. status: not started, in progress, done, QA done
2. owner
3. risk level
4. blockers

Deliverable:

1. migration matrix committed to repo or issue tracker

Exit criteria:

1. team knows exact migration order and risk hotspots

## Phase 1: Theme Infrastructure Foundation

Objective: establish platform-level theme support.

Tasks:

1. configure Tailwind dark mode strategy
2. introduce ThemeProvider (or equivalent custom provider)
3. add theme state model (light/dark/system)
4. add localStorage persistence key standard
5. add early theme initialization script in root layout head
6. add hook/utilities for theme get/set/resolve

Implementation guidance:

1. do not block entire app on client hydration
2. avoid rendering wrong theme first, then flipping late
3. verify no hydration warning from class mismatch

Deliverables:

1. theme provider integrated in root app layout
2. stable theme persistence logic
3. no major initial flicker on load

Exit criteria:

1. switching theme updates root class reliably
2. refresh preserves preference
3. system mode follows OS setting

## Phase 2: Token Layer in Global Styles

Objective: centralize theme semantics and reduce direct color coupling.

Tasks:

1. define :root token values for light theme
2. define .dark token overrides for dark theme
3. map foundational global selectors to tokens:
1. body background and text
2. headings and links
3. default border/input styles
4. scrollbars and focus styles

4. add utility helpers for common semantic patterns:
1. bg-surface
2. text-primary
3. text-secondary
4. border-default

Token examples (conceptual):

1. --color-bg-page
2. --color-bg-surface
3. --color-text-primary
4. --color-text-secondary
5. --color-border-default
6. --color-focus-ring

Deliverables:

1. robust token definitions for both themes
2. global styles no longer hard-wired to light colors

Exit criteria:

1. page shell and typography look correct in both themes
2. focus and form defaults remain accessible

## Phase 3: Shared Component Migration

Objective: make reusable UI primitives theme-safe first.

Priority order:

1. header/navigation + footer
2. buttons and links
3. form controls
4. cards/panels
5. badges/tags/chips
6. alerts/toasts
7. modals/drawers/popovers

Migration rules:

1. replace hard-coded white and gray classes with semantic theme classes or token-backed variants
2. ensure hover, active, disabled, focus styles are valid in both themes
3. ensure icon colors and SVG fills are theme-safe
4. maintain contrast for placeholder text and helper text

Common anti-patterns to remove:

1. text-gray-900 without dark fallback
2. bg-white without dark fallback
3. border-gray-200 without dark fallback
4. shadows that disappear on dark surfaces

Deliverables:

1. updated shared component library with dark support

Exit criteria:

1. component catalog pass in both themes
2. no obvious readability failures in primitive set

## Phase 4: Page and Template Migration

Objective: migrate feature pages efficiently using template-first strategy.

Approach:

1. migrate by template families, not random files
2. prioritize conversion-critical pages and traffic-heavy routes
3. include edge states: empty/loading/error/success

Suggested route order:

1. home and major marketing pages
2. services pages and lead forms
3. course pages and enrollment flows
4. blog and content templates
5. long-tail pages

For each page/template:

1. standard state pass
2. interaction pass (hover/focus)
3. responsiveness pass (mobile/tablet/desktop)
4. screenshot capture for baseline comparison

Deliverables:

1. all major routes dark-mode capable

Exit criteria:

1. no critical route fails contrast or readability checks

## Phase 5: Accessibility and Quality Hardening

Objective: ensure dark mode is not just visual but usable.

Required checks:

1. text/background contrast for normal and large text
2. focus ring visibility in both themes
3. keyboard navigation without hidden focus
4. reduced motion behavior remains respected
5. color-only cues replaced with text/icon redundancy where needed

Tooling:

1. automated a11y scan (axe/lighthouse or equivalent)
2. manual keyboard walkthrough
3. manual screen reader spot checks on critical flows

Deliverables:

1. accessibility report with pass/fail and remediation notes

Exit criteria:

1. no high-severity a11y blockers remain

## Phase 6: Regression Testing and Rollout

Objective: deploy safely and observe real-world behavior.

Testing stack:

1. unit tests for theme utilities/provider
2. integration tests for persistence and toggle behavior
3. E2E tests for key routes in both themes
4. visual regression snapshots for core pages

Rollout strategy:

1. internal staging with dark mode default off
2. optional feature flag in production for phased exposure
3. monitor user feedback and front-end error telemetry
4. final enablement once severity-1 issues are closed

Deliverables:

1. validated release notes and rollout checklist

Exit criteria:

1. dark mode stable under normal traffic patterns

## Engineering Standards and Rules

### Coding Rules

1. new UI code must not use light-only hard-coded palette classes unless explicitly justified
2. prefer semantic class names and token-backed styling
3. all new components must include theme states in review
4. no merging of visually unreviewed theme-sensitive changes

### PR Checklist (Dark Mode)

1. toggling works in local and staging
2. Light/Dark/System behavior validated
3. no hydration warnings or layout flash
4. keyboard and focus states checked
5. screenshots provided for both themes
6. critical contrast points verified

## Testing Matrix

Test dimensions:

1. themes: light, dark, system
2. viewport: mobile, tablet, desktop
3. browsers: Chrome, Safari, Firefox, Edge (as available)
4. states: default, hover, focus, disabled, loading, error
5. user flow: anonymous and authenticated where applicable

Minimum critical route matrix:

1. homepage
2. primary services page
3. contact page and form submission state
4. course/enrollment funnel
5. one blog/article page

## Risk Register

### Risk 1: Inconsistent Styling Due To Hard-Coded Utilities

Likelihood: high

Mitigation:

1. token-first foundation
2. grep-based audits during migration
3. reviewer checklist enforcement

### Risk 2: Theme Flash On Initial Load

Likelihood: medium

Mitigation:

1. early script initialization
2. avoid delayed theme class application
3. verify SSR hydration compatibility

### Risk 3: Accessibility Regressions

Likelihood: medium

Mitigation:

1. contrast validation during migration
2. dedicated a11y hardening phase
3. required manual keyboard tests

### Risk 4: Scope Creep and Timeline Slippage

Likelihood: medium

Mitigation:

1. phased delivery with explicit exit criteria
2. prioritize critical templates first
3. defer non-critical visual polish to follow-up sprint

## Effort and Timeline Estimate

These estimates assume one engineer with periodic design/QA support.

### Option A: Fast MVP (infrastructure + core routes)

1. 3 to 5 engineering days
2. limited page coverage
3. suitable for internal preview only

### Option B: Thorough Production Rollout (recommended)

1. 2 to 4 weeks
2. includes shared components, major templates, a11y pass, regression testing
3. suitable for broad release

### Option C: Full Deep Coverage + long-tail polish

1. 4 to 6 weeks
2. includes all long-tail pages and exhaustive visual polish
3. suitable for strict brand consistency goals

## Ownership Model

Recommended roles:

1. Engineering Owner: implements infrastructure and migration
2. Design Owner: validates visual token mapping and dark theme intent
3. QA Owner: runs matrix and reports regressions
4. Product Owner: prioritizes route rollout and acceptance criteria

## Detailed Acceptance Gates

### Gate 1: Foundation Complete

1. theme provider integrated
2. preference persistence verified
3. no significant hydration flicker

### Gate 2: Shared UI Complete

1. all shared primitives dark-safe
2. internal component showcase verified

### Gate 3: Critical Routes Complete

1. all high-traffic routes migrated
2. conversion flows validated

### Gate 4: Quality Complete

1. accessibility checks pass
2. visual regressions resolved
3. E2E passes in both themes

### Gate 5: Release Complete

1. monitored rollout successful
2. no severity-1 theme defects in production window

## Implementation Backlog Template

Use this structure for each migration item:

1. Item ID
2. Component/Page
3. Owner
4. Current Status
5. Theme Gaps Identified
6. Token/Class Updates Needed
7. Test Cases Executed
8. Screenshots Attached
9. QA Result
10. Follow-up Notes

## Governance After Launch

To prevent regression drift:

1. add lint/review guidance for theme-safe classes
2. include dark mode screenshots in UI PRs
3. add periodic audit for new hard-coded light-only classes
4. maintain this playbook as the source of truth for future pages

## Practical Execution Sequence (Recommended)

1. establish provider + persistence + early init script
2. define token layer in global styles
3. migrate header/footer and base components
4. migrate forms and conversion-critical sections
5. migrate high-traffic templates
6. run accessibility and visual regression pass
7. stage rollout and monitor
8. complete long-tail pages

## Final Definition Of Done

Dark mode is done when:

1. all major user journeys are usable and visually coherent in Light, Dark, and System
2. no high-severity accessibility or readability issues remain
3. no hydration flicker or unstable toggling behavior remains
4. team has sustainable coding rules to keep dark mode quality intact

---

Version: 1.0

Owner: Hexadigitall Engineering

Status: Ready for implementation kickoff
