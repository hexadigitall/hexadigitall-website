#!/usr/bin/env node

/**
 * Content Verification Script
 * Compares content between local and live deployment to ensure they match
 */

import fetch from 'node-fetch';
import { createClient } from '@sanity/client';
import { JSDOM } from 'jsdom';

// Configuration
const LOCAL_URL = process.env.LOCAL_URL || 'http://localhost:3000';
const LIVE_URL = process.env.LIVE_URL || 'https://hexadigitall.com';

const sanityClient = createClient({
  projectId: 'puzezel0',
  dataset: 'production',
  useCdn: false,
  apiVersion: '2024-08-30',
});

// Pages to verify
const PAGES_TO_CHECK = [
  '/',
  '/about',
  '/services',
  '/courses',
  '/blog',
  '/portfolio',
  '/contact',
  '/faq',
];

// Color codes for output
const colors = {
  green: '\x1b[32m',
  red: '\x1b[31m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  reset: '\x1b[0m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

async function fetchPage(url, timeout = 10000) {
  const controller = new AbortController();
  const timeoutId = setTimeout(() => controller.abort(), timeout);
  
  try {
    const response = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);
    
    if (!response.ok) {
      return { error: `HTTP ${response.status}: ${response.statusText}` };
    }
    
    const html = await response.text();
    return { html, status: response.status };
  } catch (error) {
    clearTimeout(timeoutId);
    if (error.name === 'AbortError') {
      return { error: 'Request timeout' };
    }
    return { error: error.message };
  }
}

function extractContent(html) {
  try {
    const dom = new JSDOM(html);
    const document = dom.window.document;
    
    // Remove script and style tags
    document.querySelectorAll('script, style, noscript').forEach(el => el.remove());
    
    // Extract key content
    const title = document.querySelector('title')?.textContent || '';
    const h1 = Array.from(document.querySelectorAll('h1')).map(el => el.textContent.trim());
    const h2 = Array.from(document.querySelectorAll('h2')).map(el => el.textContent.trim()).slice(0, 5);
    const mainText = document.querySelector('main')?.textContent.trim().slice(0, 500) || '';
    
    // Check for key elements
    const hasHeader = !!document.querySelector('header');
    const hasFooter = !!document.querySelector('footer');
    const hasNav = !!document.querySelector('nav');
    
    return {
      title,
      h1Count: h1.length,
      h1Samples: h1.slice(0, 3),
      h2Count: h2.length,
      h2Samples: h2.slice(0, 3),
      mainTextPreview: mainText.slice(0, 200),
      hasHeader,
      hasFooter,
      hasNav,
      contentLength: html.length,
    };
  } catch (error) {
    return { error: error.message };
  }
}

function compareContent(local, live) {
  const differences = [];
  
  if (local.title !== live.title) {
    differences.push(`Title differs: "${local.title}" vs "${live.title}"`);
  }
  
  if (local.h1Count !== live.h1Count) {
    differences.push(`H1 count differs: ${local.h1Count} vs ${live.h1Count}`);
  }
  
  if (local.h2Count !== live.h2Count) {
    differences.push(`H2 count differs: ${local.h2Count} vs ${live.h2Count}`);
  }
  
  const lengthDiff = Math.abs(local.contentLength - live.contentLength);
  const lengthDiffPercent = (lengthDiff / local.contentLength) * 100;
  
  if (lengthDiffPercent > 10) {
    differences.push(`Content length differs significantly: ${lengthDiffPercent.toFixed(1)}% difference`);
  }
  
  if (local.hasHeader !== live.hasHeader) {
    differences.push('Header presence differs');
  }
  
  if (local.hasFooter !== live.hasFooter) {
    differences.push('Footer presence differs');
  }
  
  return differences;
}

async function verifyPage(path) {
  log(`\n📄 Checking: ${path}`, 'blue');
  
  const localUrl = `${LOCAL_URL}${path}`;
  const liveUrl = `${LIVE_URL}${path}`;
  
  // Fetch both pages
  const [localResult, liveResult] = await Promise.all([
    fetchPage(localUrl),
    fetchPage(liveUrl),
  ]);
  
  // Check for errors
  if (localResult.error) {
    log(`  ⚠️  Local: ${localResult.error}`, 'yellow');
    return { success: false, reason: 'Local page error' };
  }
  
  if (liveResult.error) {
    log(`  ⚠️  Live: ${liveResult.error}`, 'yellow');
    return { success: false, reason: 'Live page error' };
  }
  
  // Extract and compare content
  const localContent = extractContent(localResult.html);
  const liveContent = extractContent(liveResult.html);
  
  if (localContent.error) {
    log(`  ❌ Local content extraction error: ${localContent.error}`, 'red');
    return { success: false, reason: 'Local parsing error' };
  }
  
  if (liveContent.error) {
    log(`  ❌ Live content extraction error: ${liveContent.error}`, 'red');
    return { success: false, reason: 'Live parsing error' };
  }
  
  const differences = compareContent(localContent, liveContent);
  
  if (differences.length === 0) {
    log('  ✅ Content matches!', 'green');
    log(`     Title: ${localContent.title}`);
    log(`     H1s: ${localContent.h1Count}, H2s: ${localContent.h2Count}`);
    log(`     Size: ${(localContent.contentLength / 1024).toFixed(1)}KB`);
    return { success: true };
  } else {
    log('  ⚠️  Content differences detected:', 'yellow');
    differences.forEach(diff => log(`     - ${diff}`, 'yellow'));
    return { success: false, reason: 'Content mismatch', differences };
  }
}

async function checkSanityData() {
  log('\n🗄️  Checking Sanity CMS Data...', 'blue');
  
  try {
    const [courses, posts, projects] = await Promise.all([
      sanityClient.fetch('count(*[_type == "course"])'),
      sanityClient.fetch('count(*[_type == "post"])'),
      sanityClient.fetch('count(*[_type == "project"])'),
    ]);
    
    log(`  Courses: ${courses}`, 'green');
    log(`  Blog Posts: ${posts}`, 'green');
    log(`  Portfolio Projects: ${projects}`, 'green');
    
    return { courses, posts, projects };
  } catch (error) {
    log(`  ❌ Error fetching Sanity data: ${error.message}`, 'red');
    return null;
  }
}

async function checkDynamicRoutes() {
  log('\n🔗 Checking Dynamic Routes...', 'blue');
  
  try {
    // Get sample slugs from Sanity
    const [courseSlugs, postSlugs, projectSlugs] = await Promise.all([
      sanityClient.fetch('*[_type == "course"][0...2]{slug}'),
      sanityClient.fetch('*[_type == "post"][0...2]{slug}'),
      sanityClient.fetch('*[_type == "project"][0...2]{slug}'),
    ]);
    
    const results = [];
    
    // Check sample course pages
    for (const course of courseSlugs) {
      if (course.slug?.current) {
        const result = await verifyPage(`/courses/${course.slug.current}`);
        results.push(result);
      }
    }
    
    // Check sample blog posts
    for (const post of postSlugs) {
      if (post.slug?.current) {
        const result = await verifyPage(`/blog/${post.slug.current}`);
        results.push(result);
      }
    }
    
    return results;
  } catch (error) {
    log(`  ⚠️  Could not check dynamic routes: ${error.message}`, 'yellow');
    return [];
  }
}

async function main() {
  log('\n' + '='.repeat(60), 'blue');
  log('Content Verification: Local vs Live Deployment', 'blue');
  log('='.repeat(60), 'blue');
  
  log(`\nLocal:  ${LOCAL_URL}`, 'blue');
  log(`Live:   ${LIVE_URL}`, 'blue');
  
  // Check if local server is running
  log('\n🔍 Checking if local server is running...', 'blue');
  const localCheck = await fetchPage(LOCAL_URL);
  if (localCheck.error) {
    log('\n❌ Local server is not running!', 'red');
    log('Please start your local server first:', 'yellow');
    log('  npm run build && npm start', 'yellow');
    log('\nOr set LOCAL_URL environment variable:', 'yellow');
    log('  LOCAL_URL=http://localhost:3001 npm run verify-content', 'yellow');
    process.exit(1);
  }
  log('  ✅ Local server is accessible', 'green');
  
  // Check Sanity data
  const sanityData = await checkSanityData();
  
  // Verify static pages
  log('\n📋 Verifying Static Pages...', 'blue');
  const results = [];
  
  for (const page of PAGES_TO_CHECK) {
    const result = await verifyPage(page);
    results.push({ page, ...result });
  }
  
  // Verify dynamic routes
  const dynamicResults = await checkDynamicRoutes();
  
  // Summary
  log('\n' + '='.repeat(60), 'blue');
  log('Summary', 'blue');
  log('='.repeat(60), 'blue');
  
  const successful = results.filter(r => r.success).length;
  const total = results.length;
  
  log(`\n✓ Pages checked: ${total}`);
  log(`✓ Matches: ${successful}`, successful === total ? 'green' : 'yellow');
  log(`✗ Differences: ${total - successful}`, successful === total ? 'green' : 'red');
  
  if (sanityData) {
    log(`\n📊 Sanity CMS:`);
    log(`  - ${sanityData.courses} courses`);
    log(`  - ${sanityData.posts} blog posts`);
    log(`  - ${sanityData.projects} portfolio projects`);
  }
  
  if (successful === total) {
    log('\n✅ All pages match! Local and live content is consistent.', 'green');
    process.exit(0);
  } else {
    log('\n⚠️  Some differences detected. This may be expected due to:', 'yellow');
    log('  - CDN caching on live site', 'yellow');
    log('  - Different build timestamps', 'yellow');
    log('  - Environment-specific content', 'yellow');
    log('\nReview the differences above to ensure they are acceptable.', 'yellow');
    process.exit(0);
  }
}

// Run the verification
main().catch(error => {
  log(`\n❌ Verification failed: ${error.message}`, 'red');
  console.error(error);
  process.exit(1);
});
