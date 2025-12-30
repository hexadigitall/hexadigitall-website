// scripts/list-all-service-schemas.mjs
// List all service-related schemas registered in the Sanity schema directory
import fs from 'fs';
import path from 'path';

const SCHEMA_DIR = path.join(process.cwd(), 'src', 'sanity', 'schemas');

function isServiceSchema(filename) {
  return filename.startsWith('service') && filename.endsWith('.ts');
}

function main() {
  const files = fs.readdirSync(SCHEMA_DIR);
  const serviceSchemas = files.filter(isServiceSchema);
  console.log('Service-related schemas in src/sanity/schemas:');
  serviceSchemas.forEach(f => console.log(' -', f));
}

main();
