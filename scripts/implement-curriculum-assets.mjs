#!/usr/bin/env node
/**
 * Implementation helper: ensures OG images are mirrored into public/curriculums
 * so the curriculum docs remain portable (e.g., when emailed or viewed offline).
 */
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const courses = [
  {
    name: 'Azure Security Technologies (AZ-500)',
    slug: 'azure-security-technologies-az-500',
  },
  {
    name: 'Linux Administration & Shell Scripting Pro',
    slug: 'linux-administration-shell-scripting-pro',
  },
];

const srcDir = path.join(root, 'public', 'og-images');
const destDir = path.join(root, 'public', 'curriculums', 'assets');

function ensureDir(dir) {
  if (!fs.existsSync(dir)) fs.mkdirSync(dir, { recursive: true });
}

function copyIfNewer(src, dest) {
  if (!fs.existsSync(src)) {
    console.warn(`❌ Source missing: ${src}`);
    return false;
  }
  const srcStat = fs.statSync(src);
  const needsCopy = !fs.existsSync(dest) || fs.statSync(dest).mtimeMs < srcStat.mtimeMs;
  if (needsCopy) {
    fs.copyFileSync(src, dest);
    console.log(`➡️  Copied ${path.basename(src)} -> ${path.relative(root, dest)}`);
  } else {
    console.log(`✅ Up to date: ${path.basename(src)}`);
  }
  return true;
}

function main() {
  console.log('🛠️  Implementing curriculum assets (OG images mirror)');
  ensureDir(destDir);

  for (const course of courses) {
    const src = path.join(srcDir, `${course.slug}.jpg`);
    const dest = path.join(destDir, `${course.slug}.jpg`);
    copyIfNewer(src, dest);
  }

  console.log('\nDone. Update your HTML to point to /public/curriculums/assets/<slug>.jpg if you prefer bundled assets.');
}

main();
