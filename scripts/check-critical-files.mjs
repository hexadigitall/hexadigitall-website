#!/usr/bin/env node
/**
 * check-critical-files.mjs
 *
 * Scans a set of critical source files that have historically been accidentally
 * zeroed (by agent create_file misuse or WSL2/drvfs corruption). Exits with
 * code 1 if any are empty or suspiciously small, so this can be used as a
 * pre-dev / CI guard.
 *
 * Usage:
 *   node scripts/check-critical-files.mjs          # check only
 *   node scripts/check-critical-files.mjs --fix    # restore from HEAD
 */

import { readFileSync, statSync } from 'fs';
import { execSync } from 'child_process';
import { resolve, join } from 'path';
import { fileURLToPath } from 'url';

const ROOT = resolve(fileURLToPath(import.meta.url), '../../');
const FIX_MODE = process.argv.includes('--fix');

// ─── Critical files with their minimum expected byte sizes ───────────────────
// Update this list whenever a new large component is at risk.
const CRITICAL_FILES = [
  { path: 'src/components/sections/Hero.tsx',            minBytes: 5000 },
  { path: 'src/app/services/ServicesPageClient.tsx',     minBytes: 10000 },
  { path: 'src/app/page.tsx',                            minBytes: 500  },
  { path: 'src/components/layout/Header.tsx',            minBytes: 5000 },
  { path: 'src/components/layout/Footer.tsx',            minBytes: 1000 },
  { path: 'src/app/layout.tsx',                          minBytes: 1000 },
];

let problems = 0;

for (const { path: relPath, minBytes } of CRITICAL_FILES) {
  const absPath = join(ROOT, relPath);
  let size = 0;
  try {
    size = statSync(absPath).size;
  } catch {
    console.error(`❌ MISSING: ${relPath}`);
    problems++;
    continue;
  }

  if (size < minBytes) {
    console.error(
      `❌ ${relPath} is only ${size} bytes (expected ≥ ${minBytes}B).`
    );
    problems++;

    if (FIX_MODE) {
      try {
        execSync(`git checkout HEAD -- "${relPath}"`, { cwd: ROOT, stdio: 'inherit' });
        const restored = statSync(absPath).size;
        console.log(`   ✅ Restored from HEAD — now ${restored} bytes.`);
      } catch (err) {
        console.error(`   ⚠️  Could not restore: ${err.message}`);
      }
    } else {
      console.error(`   → Run: node scripts/check-critical-files.mjs --fix`);
      console.error(`   → Or:  git checkout HEAD -- ${relPath}`);
    }
  } else {
    console.log(`✅ ${relPath} (${size} bytes)`);
  }
}

if (problems > 0 && !FIX_MODE) {
  console.error(`\n${problems} critical file(s) are damaged. Run with --fix to restore.`);
  process.exit(1);
} else if (problems === 0) {
  console.log('\nAll critical files are healthy.');
}
