// sanity.config.test.ts
// Minimal configuration for testing and isolating SchemaError
import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";

// Import only simple schemas first
import post from "./src/sanity/schemas/post";
import project from "./src/sanity/schemas/project";
import faq from "./src/sanity/schemas/faq";
import testimonial from "./src/sanity/schemas/testimonial";
import courseCategory from "./src/sanity/schemas/courseCategory";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

// Start with only simple schemas (no complex nested objects)
const testSchemas = [
  post,
  project,
  faq,
  testimonial,
  courseCategory
];

console.log('🧪 TEST CONFIG: Loading', testSchemas.length, 'schemas');
console.log('📝 Schemas:', testSchemas.map(s => s.name).join(', '));

export default defineConfig({
  basePath: "/studio",
  name: "hexadigitall_content_studio_test",
  title: "Hexadigitall Content Studio (Test)",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: testSchemas,
  },
});
