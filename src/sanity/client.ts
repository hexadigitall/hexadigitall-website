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
  console.error(
    `❌ Sanity configuration is incomplete. Missing: ${
      !projectId ? 'NEXT_PUBLIC_SANITY_PROJECT_ID ' : ''
    }${
      !dataset ? 'NEXT_PUBLIC_SANITY_DATASET ' : ''
    }`
  );
  
  // Use known fallback values if environment variables are missing
  // This helps with deployment issues where env vars might not be set
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
  environment: process.env.NODE_ENV,
});

// Read-only client for public operations with optimized caching
export const client = createClient({
  projectId: projectId || 'puzezel0', // Fallback to known project ID
  dataset: dataset || 'production', // Fallback to production dataset
  apiVersion,
  useCdn: false, // Temporarily disabled CDN to ensure fresh service data
  perspective: 'published', // Only fetch published documents
  stega: false, // Disable stega for production
  // Performance optimizations
  requestTagPrefix: 'hexadigitall',
  ignoreBrowserTokenWarning: true,
  allowReconfigure: false, // Prevent client reconfiguration for better performance
});

// Write client for server-side operations (enrollments, etc.)
export const writeClient = createClient({
  projectId: projectId || 'puzezel0', // Fallback to known project ID
  dataset: dataset || 'production', // Fallback to production dataset
  apiVersion,
  useCdn: false, // Never use CDN for write operations
  token: token, // This enables write permissions
  perspective: 'published',
});
