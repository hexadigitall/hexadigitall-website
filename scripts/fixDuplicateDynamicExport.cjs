#!/usr/bin/env node
// scripts/fixDuplicateDynamicExport.cjs
// Removes duplicate export const dynamic = 'force-dynamic'; from all dynamic route files

const fs = require('fs');
const path = require('path');

const files = [
  '../src/app/courses/[slug]/page.tsx',
  '../src/app/school/[slug]/page.tsx',
  '../src/app/courses/category/[slug]/page.tsx',
  '../src/app/services/[slug]/page.tsx',
];

files.forEach((file) => {
  const absPath = path.resolve(__dirname, file);
  if (!fs.existsSync(absPath)) {
    console.warn('File not found:', absPath);
    return;
  }
  let content = fs.readFileSync(absPath, 'utf-8');
  // Remove all but the first occurrence
  const lines = content.split('\n');
  let found = false;
  const newLines = lines.filter(line => {
    if (line.trim().startsWith('export const dynamic =')) {
      if (!found) {
        found = true;
        return true;
      }
      return false;
    }
    return true;
  });
  fs.writeFileSync(absPath, newLines.join('\n'), 'utf-8');
  console.log('Fixed:', absPath);
});
console.log('Duplicate dynamic export fix complete.');
