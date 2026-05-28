// sanity/client.ts
import { createClient } from "next-sanity";

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0';
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production';
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || "2024-08-30";
const token = process.env.SANITY_API_TOKEN;
const readToken = process.env.NEXT_PUBLIC_SANITY_READ_TOKEN;

// DISABLE CDN GLOBALLY TO ENSURE REAL-TIME UPDATES DURING THIS FIX PHASE
export const client = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false, // Forces fresh data
  token: readToken || undefined,
  perspective: 'published',
  stega: false,
});

export const writeClient = createClient({
  projectId,
  dataset,
  apiVersion,
  useCdn: false,
  token: token,
  perspective: 'published',
  stega: false,
});