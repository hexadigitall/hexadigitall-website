// sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN; // Write token for server-side operations

// Enhanced environment variable validation
if (!projectId) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SANITY')));
}

if (!dataset) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
}

if (!token) {
  console.warn('⚠️ Missing SANITY_API_TOKEN. Write operations (like enrollment) will fail.');
}

// Validate we have the required configuration
if (!projectId || !dataset) {
  throw new Error(
    `Sanity configuration is incomplete. Missing: ${
      !projectId ? 'NEXT_PUBLIC_SANITY_PROJECT_ID ' : ''
    }${
      !dataset ? 'NEXT_PUBLIC_SANITY_DATASET ' : ''
    }`
  );
}

console.log('🔧 Sanity Config:', {
  projectId,
  dataset,
  apiVersion,
  hasToken: !!token,
  environment: process.env.NODE_ENV,
});

// Read-only client for public operations
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: process.env.NODE_ENV === 'production', // Use CDN in production for better performance
  perspective: 'published', // Only fetch published documents
  stega: false, // Disable stega for production
});

// Write client for server-side operations (enrollments, etc.)
export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Never use CDN for write operations
  token: token, // This enables write permissions
  perspective: 'published',
});
