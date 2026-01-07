#!/usr/bin/env node
// scripts/checkOgImagesForSharableLinks.cjs
// Checks og:image meta tag for all sharable links (except course categories) listed in SHARABLE_LINKS_WWW.md

const fs = require('fs');
const path = require('path');
// Use built-in fetch (Node.js v18+)
const fetch = global.fetch;
const cheerio = require('cheerio');

const mdPath = path.resolve(__dirname, '../SHARABLE_LINKS_WWW.md');
const fileContent = fs.readFileSync(mdPath, 'utf8');

// Extract all links except course categories
const linkRegex = /- (https:\/\/www\.hexadigitall\.com\/(?!courses\/category)[^\s]+)/g;
const links = [...fileContent.matchAll(linkRegex)].map(m => m[1]);

async function checkOgImage(url) {
  try {
    const res = await fetch(url);
    if (!res.ok) {
      return { url, error: `Page fetch failed: ${res.status}` };
    }
    const html = await res.text();
    const $ = cheerio.load(html);
    const ogImage = $('meta[property="og:image"]').attr('content');
    if (!ogImage) {
      return { url, error: 'og:image tag missing' };
    }
    if (!/^https?:\/\//.test(ogImage)) {
      return { url, ogImage, error: 'og:image is not absolute URL' };
    }
    // Check image accessibility
    try {
      const imgRes = await fetch(ogImage);
      if (!imgRes.ok) {
        return { url, ogImage, error: `og:image not accessible: ${imgRes.status}` };
      }
      return { url, ogImage, status: 'OK' };
    } catch (imgErr) {
      return { url, ogImage, error: `og:image fetch error: ${imgErr.message}` };
    }
  } catch (err) {
    return { url, error: `Page fetch error: ${err.message}` };
  }
}

(async () => {
  console.log('Checking og:image for sharable links...');
  for (const url of links) {
    const result = await checkOgImage(url);
    if (result.status === 'OK') {
      console.log(`[OK] ${url}\n    og:image: ${result.ogImage}`);
    } else {
      console.log(`[ERROR] ${url}\n    ${result.error}${result.ogImage ? `\n    og:image: ${result.ogImage}` : ''}`);
    }
  }
})();
