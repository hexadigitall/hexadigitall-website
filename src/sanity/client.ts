// sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN; // Write token for server-side operations

if (!projectId || !dataset) {
  console.warn('Missing Sanity environment variables. Some features may not work correctly.');
}

if (!token) {
  console.warn('Missing SANITY_API_TOKEN. Write operations (like enrollment) will fail.');
}

// Read-only client for public operations
export const client = createClient({
  projectId: projectId || 'dummy-project-id',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false, // `false` for fresh data, `true` for cached data
});

// Write client for server-side operations (enrollments, etc.)
export const writeClient = createClient({
  projectId: projectId || 'dummy-project-id',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false,
  token: token, // This enables write permissions
});
