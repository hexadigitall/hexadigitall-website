# Security Updates Summary (2025-11-28)

## Scope
Dependency upgrades focused on reducing high severity vulnerabilities originating from Sanity toolchain and related transitive packages (`@architect/*`, `glob`, `valibot`).

## Changes Applied
- Upgraded `sanity` from `^4.6.0` to `^4.19.0`.
- Upgraded `@sanity/vision` from `^4.6.0` to `^4.19.0` (alignment with core Sanity version).
- Upgraded `next-sanity` from `^10.1.1` to `^11.6.10`.
- Indirect upgrades pulled:
  - `@sanity/cli@4.9.0` → `@sanity/cli@4.19.0`.
  - `@sanity/runtime-cli@10.7.1` → `@sanity/runtime-cli@11.1.5`.
  - `valibot@1.1.0` → `valibot@1.2.0` (via visual editing chain).
  - `@architect/hydrate@4.0.8` → `@architect/hydrate@4.0.10`.

## Vulnerability Delta
- Previous audit (saved earlier): 11 total (8 high / 2 moderate / 1 low).
- Current audit: 9 total (7 high / 1 moderate / 1 low).
- Reduction: -1 high, -1 moderate overall (-18.18% total count).

## Remaining Transitive Risk Points
- `@architect/hydrate@4.0.10` + `@architect/utils@4.0.6` still present via `@sanity/runtime-cli`. These are not directly referenced in application code.
- Multiple `glob` versions remain: `11.0.3` (rimraf@6), `10.4.5`, `10.3.16`, and legacy `7.2.3` (jest coverage). These are dev/runtime tooling only; no direct import paths in `src`.
- `valibot@1.2.0` present only via visual editing; no direct usage in `src` (validated by grep).

## Engine Warnings
The upgraded Sanity ecosystem now specifies Node >=20.19. Current local runtime Node v18.19.1 triggers `EBADENGINE` warnings but installation proceeds. Production should run Node >=20.19 to align with upstream tested engines and avoid latent feature/runtime discrepancies.

## Next Considerations
1. Upgrade Node runtime to >=20.19 before adopting further Sanity features or relying on visual editing in production.
2. Evaluate necessity of visual editing; if unused, consider removing `next-sanity` optional visual editing features to drop `valibot`.
3. Consider `overrides` only if future advisories demand forcing a single patched `glob` version; current mix is stable and non-user-facing.
4. Monitor Sanity release notes for removal or patching of `@architect/*` chain in subsequent minor releases.

## Validation Steps Performed
- `npm install` executed; dependency graph updated.
- `npm audit --json` stored to `audit.json`.
- `npm ls` executed for `valibot`, `@architect/hydrate`, and `glob` to confirm version changes.
- Source grep confirmed no direct usage of `valibot` or `@architect/*`.

## Recommended Follow-Up
- Perform a full build (`npm run build`) under Node 20.x for forward compatibility verification.
- Re-run audit after Node upgrade to ensure no environment-gated advisories are hidden.

---
Generated on 2025-11-28.
