import { createClient } from '@sanity/client';
import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';
import * as cheerio from 'cheerio';
import dotenv from 'dotenv';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
dotenv.config({ path: path.join(__dirname, '..', '.env.local') });

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
});

const TEXTBOOKS_ROOT = path.join(__dirname, '..', 'public', 'textbooks', 'kdp');
const DIGITAL_PUB_ROOT = path.join(__dirname, '..', 'public', 'digital-publishing', 'FVMMD', 'completed');

async function uploadFileAsset(filePath) {
  if (!fs.existsSync(filePath)) return null;
  console.log(`   ⬆️ Uploading asset: ${path.basename(filePath)}...`);
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('file', stream, {
    filename: path.basename(filePath),
  });
  return asset;
}

async function uploadImageAsset(filePath) {
  if (!fs.existsSync(filePath)) return null;
  console.log(`   🖼️ Uploading image: ${path.basename(filePath)}...`);
  const stream = fs.createReadStream(filePath);
  const asset = await client.assets.upload('image', stream, {
    filename: path.basename(filePath),
  });
  return asset;
}

function findFilesRecursive(dir, predicate) {
  let results = [];
  const list = fs.readdirSync(dir);
  list.forEach(file => {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat && stat.isDirectory()) {
      results = results.concat(findFilesRecursive(filePath, predicate));
    } else if (predicate(file, filePath)) {
      results.push(filePath);
    }
  });
  return results;
}

async function syncDirectory(rootPath, type = 'book') {
  if (!fs.existsSync(rootPath)) return;
  const folders = fs.readdirSync(rootPath, { withFileTypes: true })
    .filter(dirent => dirent.isDirectory() && dirent.name !== 'exports')
    .map(dirent => dirent.name);

  for (const slug of folders) {
    console.log(`📖 Processing ${slug}...`);
    const folderPath = path.join(rootPath, slug);
    
    // Find the primary HTML file
    // Strategy: Look for {slug}.html first, then any html that isn't a variant (like 6x9, teacher, etc)
    const htmlFiles = findFilesRecursive(folderPath, (f) => f.endsWith('.html'));
    
    let htmlPath = htmlFiles.find(f => path.basename(f) === `${slug}.html`);
    if (!htmlPath) {
      // Fallback: Pick the one that looks most "original" (not containing kdp, 6x9, teacher)
      htmlPath = htmlFiles.find(f => !f.includes('kdp') && !f.includes('6x9') && !f.includes('teacher') && !f.includes('cover'));
    }
    if (!htmlPath && htmlFiles.length > 0) {
      // Last resort: pick the first one
      htmlPath = htmlFiles[0];
    }
    
    if (!htmlPath) {
      console.log(`   ⚠️ No primary HTML found for ${slug}, skipping.`);
      continue;
    }

    console.log(`   📄 Using HTML: ${path.basename(htmlPath)}`);
    const html = fs.readFileSync(htmlPath, 'utf8');
    const $ = cheerio.load(html);

    let title = '';
    $('h1').each((i, el) => {
      const text = $(el).text().trim();
      if (text && !title && text.toLowerCase() !== 'table of contents') {
        title = text;
      }
    });
    
    if (!title) {
      title = slug.split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
    }
    
    const description = $('p').filter((i, el) => $(el).text().trim().length > 50).first().text().trim().slice(0, 500);

    // Look for cover image - ONLY files with "-cover" in the name
    let coverAssetId = null;
    const coverImages = findFilesRecursive(folderPath, (f) => 
      f.toLowerCase().includes('-cover') && 
      (f.endsWith('.jpg') || f.endsWith('.png') || f.endsWith('.webp'))
    );
    
    // Prefer JPG/PNG over others if multiple found
    const bestCover = coverImages.find(f => f.endsWith('.jpg')) || coverImages.find(f => f.endsWith('.png')) || coverImages[0];

    if (bestCover) {
      const asset = await uploadImageAsset(bestCover);
      if (asset) coverAssetId = asset._id;
    } else {
      console.log(`   ⚠️ No image with "-cover" found for ${slug}.`);
    }

    // Look for PDF to upload
    const pdfFiles = findFilesRecursive(folderPath, (f) => f.endsWith('.pdf') && !f.includes('cover'));
    const salesLinks = [];

    for (const pdfPath of pdfFiles) {
      const fileName = path.basename(pdfPath).toLowerCase();
      const isTeacher = fileName.includes('teacher') || fileName.includes('instructor');
      const audience = isTeacher ? 'teacher' : 'student';
      
      const asset = await uploadFileAsset(pdfPath);
      if (asset) {
        salesLinks.push({
          _key: `direct-pdf-${slug}-${audience}`,
          platform: 'pdf',
          audience: audience,
          label: isTeacher ? 'Instructor Edition (Direct)' : 'Student Edition (Direct)',
          priceNGN: type === 'publication' ? 15000 : 0,
          file: { _type: 'file', asset: { _type: 'reference', _ref: asset._id } }
        });
      }
    }

    const doc = {
      _id: `${type}-${slug}`,
      _type: type,
      title,
      slug: { _type: 'slug', current: slug },
      description,
      status: 'available',
      authors: type === 'publication' ? undefined : ['Hexadigitall Technologies'],
      publishedAt: new Date().toISOString(),
    };

    if (type === 'publication') {
      doc.author = { _type: 'reference', _ref: 'author-fvmmd-identity' };
      doc.price = 15000;
      doc.allowCopyRegistration = true;
    }

    if (coverAssetId) {
      doc.coverImage = { _type: 'image', asset: { _type: 'reference', _ref: coverAssetId } };
    }

    if (salesLinks.length > 0) {
      doc.salesLinks = salesLinks;
    }

    // Look for companion assets
    const assetsDir = path.join(folderPath, 'digitall-assets');
    if (fs.existsSync(assetsDir)) {
      const assetFiles = fs.readdirSync(assetsDir).filter(f => f.endsWith('.pdf') || f.endsWith('.xlsx') || f.endsWith('.zip') || f.endsWith('.html'));
      const resourceRefs = [];
      
      for (const af of assetFiles) {
        const afPath = path.join(assetsDir, af);
        const fileAsset = await uploadFileAsset(afPath);
        
        if (fileAsset) {
          const matrixId = `FVMMD-${slug.toUpperCase()}-M${resourceRefs.length + 1}`;
          const assetTitle = af.split('.')[0].split('-').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ');
          const matrixDoc = {
            _id: `matrix-${slug}-${makeKey(af)}`,
            _type: 'resourceMatrix',
            title: assetTitle,
            matrixId,
            resourceType: af.endsWith('.pdf') ? 'roadmap' : 'template',
            secureAssetUrl: fileAsset.url,
            requiresVerification: true,
            priceNGN: 5000,
          };
          
          await client.createOrReplace(matrixDoc);
          resourceRefs.push({
            _type: 'reference',
            _ref: matrixDoc._id,
            _key: `rel-asset-${makeKey(af)}`
          });
        }
      }
      
      if (resourceRefs.length > 0) {
        doc.embeddedResources = resourceRefs;
      }
    }

    await client.createOrReplace(doc);
    console.log(`   ✅ Synced: ${title}`);
  }
}

function makeKey(seed) {
  return seed.toLowerCase().replace(/[^a-z0-9]+/g, '-').slice(0, 32);
}

async function run() {
  console.log('🚀 Starting Robust Publication & Textbook Sync...\n');
  
  console.log('--- Syncing Textbooks (KDP) ---');
  await syncDirectory(TEXTBOOKS_ROOT, 'book');
  
  console.log('\n--- Syncing Digital Publishing (FVMMD) ---');
  await syncDirectory(DIGITAL_PUB_ROOT, 'publication');

  console.log('\n✨ Sync Complete!');
}

run().catch(console.error);