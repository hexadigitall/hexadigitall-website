// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Enhanced logging for schema debugging
console.log('🔍 Loading schema types...');
console.log('📊 Total types:', schemaTypes.length);
console.log('📝 Type names:', schemaTypes.map((t: any) => t.name || 'unnamed').join(', '));

// Validate each type has required properties
schemaTypes.forEach((type: any, index: number) => {
  if (!type.name) {
    console.error(`❌ Schema type at index ${index} is missing 'name' property:`, type);
  }
  if (!type.type) {
    console.error(`❌ Schema type '${type.name}' at index ${index} is missing 'type' property`);
  }
});

export default defineConfig({
  basePath: "/studio",
  name: "hexadigitall_content_studio",
  title: "Hexadigitall Content Studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: schemaTypes,
  },
});