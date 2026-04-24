import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));

// Color replacement patterns for text and backgrounds
const replacements = [
  // Text colors - slate
  ['text-slate-600([^d]|$)', 'text-slate-600 dark:text-slate-400$1'],
  ['text-slate-700([^d]|$)', 'text-slate-700 dark:text-slate-300$1'],
  ['text-slate-800([^d]|$)', 'text-slate-800 dark:text-slate-200$1'],
  ['text-slate-900([^d]|$)', 'text-slate-900 dark:text-slate-100$1'],
  ['text-slate-500([^d]|$)', 'text-slate-500 dark:text-slate-400$1'],
  
  // Text colors - blue
  ['text-blue-600([^d]|$)', 'text-blue-600 dark:text-blue-400$1'],
  ['text-blue-700([^d]|$)', 'text-blue-700 dark:text-blue-400$1'],
  ['text-blue-900([^d]|$)', 'text-blue-900 dark:text-blue-300$1'],
  
  // Text colors - gray
  ['text-gray-700([^d]|$)', 'text-gray-700 dark:text-gray-300$1'],
  ['text-gray-900([^d]|$)', 'text-gray-900 dark:text-gray-100$1'],
  
  // Text colors - other
  ['text-green-600([^d]|$)', 'text-green-600 dark:text-green-400$1'],
  ['text-red-600([^d]|$)', 'text-red-600 dark:text-red-400$1'],
  ['text-indigo-700([^d]|$)', 'text-indigo-700 dark:text-indigo-400$1'],
  ['text-amber-800([^d]|$)', 'text-amber-800 dark:text-amber-300$1'],
  
  // Background colors
  ['bg-blue-50([^d]|$)', 'bg-blue-50 dark:bg-blue-950/20$1'],
  ['bg-indigo-50([^d]|$)', 'bg-indigo-50 dark:bg-indigo-950/20$1'],
  ['bg-green-50([^d]|$)', 'bg-green-50 dark:bg-green-950/20$1'],
  ['bg-purple-50([^d]|$)', 'bg-purple-50 dark:bg-purple-950/20$1'],
  ['bg-emerald-50([^d]|$)', 'bg-emerald-50 dark:bg-emerald-950/20$1'],
  ['bg-orange-50([^d]|$)', 'bg-orange-50 dark:bg-orange-950/20$1'],
  ['bg-pink-50([^d]|$)', 'bg-pink-50 dark:bg-pink-950/20$1'],
  ['bg-slate-50([^d]|$)', 'bg-slate-50 dark:bg-slate-800/50$1'],
  
  // Border colors
  ['border-blue-200([^d]|$)', 'border-blue-200 dark:border-blue-900/50$1'],
  ['border-indigo-200([^d]|$)', 'border-indigo-200 dark:border-indigo-900/50$1'],
];

const serviceComponentsPath = path.join(__dirname, 'src/components/services');

function processFile(filePath) {
  let content = fs.readFileSync(filePath, 'utf-8');
  let changes = 0;
  
  replacements.forEach(([pattern, replacement]) => {
    const regex = new RegExp(pattern, 'g');
    const newContent = content.replace(regex, replacement);
    if (newContent !== content) {
      changes++;
      content = newContent;
    }
  });
  
  if (changes > 0) {
    fs.writeFileSync(filePath, content, 'utf-8');
    console.log(`✓ ${path.basename(filePath)}: ${changes} patterns fixed`);
  }
}

// Get all tsx files
fs.readdirSync(serviceComponentsPath).forEach(file => {
  if (file.endsWith('.tsx')) {
    processFile(path.join(serviceComponentsPath, file));
  }
});

console.log('Color fixes applied to service components');
