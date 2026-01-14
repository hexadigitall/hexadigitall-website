#!/usr/bin/env node
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);
const root = path.resolve(__dirname, '..');

const logoPath = path.join(root, 'public', 'hexadigitall-logo-transparent.png');

const courses = [
  {
    name: 'Azure Security Technologies (AZ-500)',
    slug: 'azure-security-technologies-az-500',
    html: path.join(root, 'public', 'curriculums', 'curriculum-azure-security-az500.html'),
    og: path.join(root, 'public', 'og-images', 'azure-security-technologies-az-500.jpg'),
  },
  {
    name: 'Linux Administration & Shell Scripting Pro',
    slug: 'linux-administration-shell-scripting-pro',
    html: path.join(root, 'public', 'curriculums', 'curriculum-linux-shell-scripting.html'),
    og: path.join(root, 'public', 'og-images', 'linux-administration-shell-scripting-pro.jpg'),
  },
];

function checkFile(label, filePath) {
  const exists = fs.existsSync(filePath);
  const size = exists ? fs.statSync(filePath).size : 0;
  return { label, filePath, exists, size };
}

function summarize(result) {
  const status = result.exists ? '✅' : '❌';
  const sizeStr = result.exists ? `${(result.size / 1024).toFixed(1)} KB` : 'missing';
  console.log(`${status} ${result.label}: ${result.filePath} (${sizeStr})`);
}

function checkHtmlContains(htmlPath, needles) {
  const exists = fs.existsSync(htmlPath);
  if (!exists) return { exists: false, missing: needles };
  const content = fs.readFileSync(htmlPath, 'utf8');
  const missing = needles.filter((n) => !content.includes(n));
  return { exists: true, missing };
}

console.log('🔍 Verifying curriculum assets...');
console.log('Root:', root);
console.log('─'.repeat(60));

summarize(checkFile('Brand logo', logoPath));

for (const course of courses) {
  console.log(`\n📘 ${course.name}`);
  summarize(checkFile('HTML', course.html));
  summarize(checkFile('OG image', course.og));

  const htmlChecks = checkHtmlContains(course.html, [
    '/hexadigitall-logo-transparent.png',
    'https://hexadigitall.com',
    `/og-images/${course.slug}.jpg`,
    'api.qrserver.com',
  ]);

  if (!htmlChecks.exists) {
    console.log('❌ HTML missing; cannot check contents');
  } else if (htmlChecks.missing.length === 0) {
    console.log('✅ HTML contains brand, QR, and course image references');
  } else {
    console.log('⚠️ HTML missing references:', htmlChecks.missing.join(', '));
  }
}

console.log('\nDone.');
