// sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";

if (!projectId || !dataset) {
  console.warn('Missing Sanity environment variables. Some features may not work correctly.');
}

export const client = createClient({
  projectId: projectId || 'dummy-project-id',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false, // `false` for fresh data, `true` for cached data
});
