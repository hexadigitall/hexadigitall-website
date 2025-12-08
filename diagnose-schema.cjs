// diagnose-schema.js - Find schema issues causing SchemaError
const fs = require('fs');
const path = require('path');

const schemasDir = path.join(__dirname, 'src/sanity/schemas');
const files = fs.readdirSync(schemasDir).filter(f => f.endsWith('.ts'));

console.log('🔍 Scanning schemas for potential SchemaError causes...\n');

files.forEach(file => {
  const filePath = path.join(schemasDir, file);
  const content = fs.readFileSync(filePath, 'utf8');
  
  // Check for object fields without defineField wrapper
  const objectFieldPattern = /{\s*name:\s*['"`](\w+)['"`],\s*[\s\S]*?type:\s*['"`]object['"`]/g;
  let match;
  let hasIssue = false;
  
  while ((match = objectFieldPattern.exec(content)) !== null) {
    const fieldName = match[1];
    const startPos = match.index;
    
    // Look backwards to see if it's wrapped in defineField
    const before = content.substring(Math.max(0, startPos - 50), startPos);
    if (!before.includes('defineField(')) {
      console.log(`⚠️  ${file}: Object field '${fieldName}' may not be wrapped in defineField()`);
      hasIssue = true;
    }
  }
  
  // Check for array fields with inline object definitions
  const arrayObjectPattern = /type:\s*['"`]array['"`],\s*[\s\S]*?of:\s*\[\s*{\s*type:\s*['"`]object['"`]/g;
  while ((match = arrayObjectPattern.exec(content)) !== null) {
    const line = content.substring(0, match.index).split('\n').length;
    console.log(`⚠️  ${file}:${line}: Array with inline object definition - objects in 'of' array need defineField()`);
    hasIssue = true;
  }
  
  if (!hasIssue) {
    console.log(`✅ ${file}: No obvious issues`);
  }
});

console.log('\n✨ Diagnosis complete!');
