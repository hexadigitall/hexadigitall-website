/* eslint-disable @typescript-eslint/no-require-imports */
const fs = require('fs');

// Read the file
let content = fs.readFileSync('src/lib/currency.ts', 'utf8');

// Fix localStorage getItem call
content = content.replace(
  /const saved = localStorage\.getItem\('hexadigitall_currency'\);/,
  'const saved = typeof window !== \'undefined\' ? localStorage.getItem(\'hexadigitall_currency\') : null;'
);

// Write the fixed file back to disk
fs.writeFileSync('src/lib/currency.ts', content, 'utf8');
