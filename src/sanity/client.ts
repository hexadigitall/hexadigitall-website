// sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET;
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN; // Write token for server-side operations (server-only)
const readToken = process.env.NEXT_PUBLIC_SANITY_READ_TOKEN; // Public read token for client-side queries

// Enhanced environment variable validation (server-only)
if (!projectId) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_PROJECT_ID environment variable');
  console.log('Available env vars:', Object.keys(process.env).filter(key => key.includes('SANITY')));
}

if (!dataset) {
  console.error('❌ Missing NEXT_PUBLIC_SANITY_DATASET environment variable');
}

if (typeof window === 'undefined') {
  if (!token) {
    console.warn('⚠️ Missing SANITY_API_TOKEN. Write operations (like enrollment) will fail.');
  }
}

// Validate we have the required configuration
if (!projectId || !dataset) {
  console.error(
    `❌ Sanity configuration is incomplete. Missing: ${
      !projectId ? 'NEXT_PUBLIC_SANITY_PROJECT_ID ' : ''
    }${
      !dataset ? 'NEXT_PUBLIC_SANITY_DATASET ' : ''
    }`
  );

  // Use known fallback values if environment variables are missing
  if (!projectId) {
    console.warn('🔁 Using fallback project ID');
  }
  if (!dataset) {
    console.warn('🔁 Using fallback dataset');
  }
}

console.log('🔧 Sanity Config:', {
  projectId,
  dataset,
  apiVersion,
  hasToken: !!token,
  hasReadToken: !!readToken,
  environment: process.env.NODE_ENV,
});

// Public client for read operations (browser/server) using read token when present
export const client = createClient({
  projectId: projectId || 'puzezel0',
  dataset: dataset || 'production',
  apiVersion,
  // If a token is present (readToken in browser or token on server), avoid apicdn to prevent CORS with auth
  useCdn: !readToken,
  token: readToken || undefined,
  perspective: 'published',
  ignoreBrowserTokenWarning: !readToken,
  stega: false,
  requestTagPrefix: 'hexadigitall',
  allowReconfigure: false,
});

// Write client for server-side operations (enrollments, etc.)
export const writeClient = createClient({
  projectId: projectId || 'puzezel0',
  dataset: dataset || 'production',
  apiVersion,
  useCdn: false,
  token: token,
  perspective: 'published',
  stega: false,
  requestTagPrefix: 'hexadigitall-write',
  allowReconfigure: false,
});
