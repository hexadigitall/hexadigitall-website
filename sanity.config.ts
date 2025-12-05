// sanity.config.ts
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./src/sanity/schemas";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Type for schema type definition
interface SchemaTypeDefinition {
  name?: string;
  type?: string;
  fields?: unknown[];
  [key: string]: unknown;
}

/**
 * Validates a schema type for common issues that cause SchemaError.
 * Checks for:
 * - Missing required 'name' property
 * - Missing required 'type' property  
 * - Nested defineField() calls in object fields (common cause of SchemaError)
 */
function validateSchemaType(type: SchemaTypeDefinition, index: number): void {
  if (!type.name) {
    console.error(`❌ Schema type at index ${index} is missing 'name' property:`, type);
  }
  if (!type.type) {
    console.error(`❌ Schema type '${type.name || 'unnamed'}' at index ${index} is missing 'type' property`);
  }
  
  // Check for object fields that might have improper structure
  if (type.fields && Array.isArray(type.fields)) {
    type.fields.forEach((field: unknown, fieldIndex: number) => {
      const fieldObj = field as Record<string, unknown>;
      if (!fieldObj.name) {
        console.warn(
          `⚠️ Field at index ${fieldIndex} in schema '${type.name || 'unnamed'}' is missing 'name' property. ` +
          `This can cause SchemaError if the field structure is malformed.`
        );
      }
      if (!fieldObj.type) {
        console.warn(
          `⚠️ Field '${fieldObj.name || 'unnamed'}' at index ${fieldIndex} in schema '${type.name || 'unnamed'}' ` +
          `is missing 'type' property.`
        );
      }
    });
  }
}

// Enhanced logging for schema debugging
if (process.env.NODE_ENV === 'development') {
  console.log('🔍 Loading schema types...');
  console.log('📊 Total types:', schemaTypes.length);
  console.log('📝 Type names:', schemaTypes.map((t: SchemaTypeDefinition) => t.name || 'unnamed').join(', '));

  // Validate each type has required properties
  schemaTypes.forEach((type: SchemaTypeDefinition, index: number) => {
    validateSchemaType(type, index);
  });
}

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