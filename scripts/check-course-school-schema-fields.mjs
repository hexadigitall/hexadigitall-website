import fs from 'fs';
import path from 'path';

const schemaDir = path.resolve('src/sanity/schemas');
const courseSchemaFile = path.join(schemaDir, 'course.ts');
const schoolSchemaFile = path.join(schemaDir, 'school.ts');

function checkFields(schemaText, fields) {
  return fields.map(field => ({
    field,
    present: new RegExp(`name:\s*['\"]${field}['\"]`).test(schemaText)
  }));
}

function printResult(type, results) {
  console.log(`\n${type} schema:`);
  results.forEach(r => {
    console.log(`- ${r.field}: ${r.present ? 'OK' : 'MISSING'}`);
  });
}

const fieldsToCheck = ['bannerBackgroundImage', 'ogImage', 'ogTitle', 'ogDescription'];

try {
  const courseSchema = fs.readFileSync(courseSchemaFile, 'utf8');
  const schoolSchema = fs.readFileSync(schoolSchemaFile, 'utf8');
  printResult('Course', checkFields(courseSchema, fieldsToCheck));
  printResult('School', checkFields(schoolSchema, fieldsToCheck));
} catch (err) {
  console.error('Error reading schema files:', err.message);
}
