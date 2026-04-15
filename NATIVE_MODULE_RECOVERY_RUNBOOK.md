# Native Module Recovery Runbook (Node 22.13+)

This runbook covers robust prevention and recovery for native module issues (especially `sharp` and `canvas`) and dependency mismatch checks.

## Baseline Runtime Alignment

Use the same Node runtime across local, CI, and hosting:

- Local: `.nvmrc` (currently `22.13.0`)
- CI: `.github/workflows/ci.yml` and `.github/workflows/axe-audit.yml`
- Hosting: set runtime to Node `22.13.x`

## Standard Recovery Sequence

1. Ensure Node version is correct

```bash
nvm use
node -v
```

2. Clean deterministic reinstall

```bash
npm run clean:install
```

3. Rebuild native modules

```bash
npm run rebuild:native
```

4. Validate install and app build

```bash
npm ls sharp canvas --all
npm run build
```

## If Rebuild Still Fails

Force source rebuild:

```bash
npm_config_build_from_source=true npm rebuild sharp canvas
```

## Linux (Ubuntu/Debian) System Dependencies for canvas

If `canvas` fails with compilation or missing library errors:

```bash
sudo apt-get update
sudo apt-get install -y \
  build-essential python3 pkg-config \
  libcairo2-dev libpango1.0-dev libjpeg-dev libgif-dev librsvg2-dev
npm rebuild canvas --build-from-source
```

## Mismatch Diagnostic Commands

Run these when install succeeds but dependency tree is suspect:

```bash
npm ls --all
npm ls sharp canvas sanity next-sanity vite --all
npm audit --json
```

## Current Known Mismatch (as of 2026-04-15)

Detected:

- `next-sanity@11.6.10` expects peer `sanity@^4.19.0`
- Repo currently has `sanity@5.1.0`
- `npm ls` reports `ELSPROBLEMS` with `sanity` marked invalid

Why this matters:

- It can produce unstable installs and subtle runtime/tooling behavior drift.

Safe resolution options:

1. Preferred: upgrade `next-sanity` to a version compatible with Sanity 5 (latest observed peer is `sanity@^5.20.0`).
2. Conservative fallback: pin `sanity` back to a 4.x line compatible with `next-sanity@11.6.10`.

After either change, run:

```bash
npm run clean:install
npm run rebuild:native
npm run build
npm test -- --config=jest.config.ts --runInBand
```

## Fast Triage Checklist

- Node runtime aligned to `22.13.x`
- Clean install completed (`npm ci`)
- Native rebuild completed (`npm run rebuild:native`)
- Dependency tree clean (no `ELSPROBLEMS`)
- Build and tests pass
- CI uses same Node version as local
