import dotenv from 'dotenv';
import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';

dotenv.config({ path: '.env.local' });

export const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-01-11',
  token: process.env.SANITY_API_TOKEN,
});

export function fileExists(p) {
  try { return fs.existsSync(p); } catch { return false; }
}

export async function uploadImageFromPath(filePath) {
  const filename = path.basename(filePath);
  const buffer = fs.readFileSync(filePath);
  const asset = await client.assets.upload('image', buffer, { filename });
  return { _type: 'image', asset: { _type: 'reference', _ref: asset._id } };
}

export async function findAssetByFilename(filenamePattern) {
  // Looks up an asset by originalFilename wildcard
  return client.fetch(
    `*[_type == "sanity.imageAsset" && originalFilename match $filename][0]{ _id, url }`,
    { filename: `*${filenamePattern}*` }
  );
}

export async function findOrUpload(filePath) {
  const filename = path.basename(filePath);
  const existing = await findAssetByFilename(filename);
  if (existing && existing._id) return { _type: 'image', asset: { _type: 'reference', _ref: existing._id } };
  return uploadImageFromPath(filePath);
}

function bestMatchBySlug(dir, slug) {
  if (!fs.existsSync(dir)) return null;
  const files = fs.readdirSync(dir).filter(f => /\.(jpg|jpeg|png|webp)$/i.test(f));
  // 1) exact
  const exact = files.find(f => path.parse(f).name === slug);
  if (exact) return path.join(dir, exact);
  // 2) startsWith
  const starts = files.find(f => path.parse(f).name.startsWith(slug));
  if (starts) return path.join(dir, starts);
  // 3) contains
  const contains = files.find(f => path.parse(f).name.includes(slug));
  if (contains) return path.join(dir, contains);
  return null;
}

export function guessLocalImagePathFor(type, slug, projectRoot) {
  const base = path.join(projectRoot, 'public/assets/images');
  if (type === 'course') return bestMatchBySlug(path.join(base, 'courses'), slug);
  if (type === 'service') return bestMatchBySlug(path.join(base, 'services'), slug);
  if (type === 'school') return bestMatchBySlug(path.join(base, 'schools'), slug);
  return null;
}

export function guessOgPostImagePathFor(slug, projectRoot) {
  const postsDir = path.join(projectRoot, 'public/og-images/posts');
  return bestMatchBySlug(postsDir, slug);
}
