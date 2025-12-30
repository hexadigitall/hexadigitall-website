import fs from 'fs';
import path from 'path';

const schemaDir = path.resolve('src/sanity/schemas');
const files = ['course.ts', 'school.ts'];
const fieldsToCheck = ['bannerBackgroundImage', 'ogImage', 'ogTitle', 'ogDescription'];

function getFieldNames(schemaText) {
  const matches = [...schemaText.matchAll(/name:\s*['\"]([a-zA-Z0-9_]+)['\"]/g)];
  return matches.map(m => m[1]);
}

for (const file of files) {
  const filePath = path.join(schemaDir, file);
  try {
    const text = fs.readFileSync(filePath, 'utf8');
    const fieldNames = getFieldNames(text);
    console.log(`\n${file}:`);
    // Check for duplicates
    const duplicates = fieldNames.filter((item, idx) => fieldNames.indexOf(item) !== idx && fieldNames.indexOf(item) === idx);
    if (duplicates.length > 0) {
      console.log(`  Duplicate fields: ${duplicates.join(', ')}`);
    } else {
      console.log('  No duplicate fields.');
    }
    // Check for missing
    const missing = fieldsToCheck.filter(f => !fieldNames.includes(f));
    if (missing.length > 0) {
      console.log(`  Missing fields: ${missing.join(', ')}`);
    } else {
      console.log('  All required fields present.');
    }
  } catch (err) {
    console.error(`Error reading ${file}:`, err.message);
  }
}
