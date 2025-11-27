Dry-run migration (safe)
=========================

This document explains how to run a non-destructive dry-run of the service migration locally.

Commands
--------

- Run the unit tests (they also exercise the migration using mocks):

  npm test -- --config=jest.config.ts

- Compile the scripts and run the compiled dry-run (robust across ESM/ts-node setups):

  npm run migrate:dry-run:compiled

What the dry-run does
---------------------
- The dry-run uses a mocked Sanity client and logs the actions the migration would perform.
- No network calls are made and no data is written.

Notes
-----
- If you want to run the real migration against Sanity, ensure you have backups and correct environment variables (see `scripts/migrate-services.ts`).
- We intentionally keep `@typescript-eslint/no-explicit-any` enabled for app code, but disabled for `scripts/**` so test helpers and dry-run clients can be pragmatic during development.

Next steps
----------
- If you want me to, I can:
  - Add a CI job that runs tests and performs the dry-run compile step.
  - Fix the remaining app-level ESLint `no-explicit-any` errors (file-by-file).
