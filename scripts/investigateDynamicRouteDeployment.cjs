#!/usr/bin/env node
// scripts/investigateDynamicRouteDeployment.cjs
// Diagnose why dynamic routes are not working in Next.js/Vercel deployment

const fs = require('fs');
const path = require('path');

const nextConfigPath = path.resolve(__dirname, '../next.config.ts');
const nextBuildDir = path.resolve(__dirname, '../.next');
const vercelJsonPath = path.resolve(__dirname, '../vercel.json');

function checkNextConfig() {
  let configContent = '';
  try {
    configContent = fs.readFileSync(nextConfigPath, 'utf-8');
  } catch (e) {
    return '❌ Could not read next.config.ts';
  }
  const outputExport = /output\s*:\s*['"]export['"]/i.test(configContent);
  const hasRevalidate = /revalidate\s*[:=]\s*\d+/i.test(configContent);
  const hasDynamic = /dynamic\s*[:=]\s*['"]force-dynamic['"]/i.test(configContent);
  return {
    outputExport,
    hasRevalidate,
    hasDynamic,
    summary: `output: 'export': ${outputExport}, revalidate: ${hasRevalidate}, force-dynamic: ${hasDynamic}`
  };
}

function checkVercelJson() {
  if (!fs.existsSync(vercelJsonPath)) return 'No vercel.json found.';
  const content = fs.readFileSync(vercelJsonPath, 'utf-8');
  return content;
}

function checkNextBuild() {
  if (!fs.existsSync(nextBuildDir)) return '.next build directory not found.';
  const files = fs.readdirSync(nextBuildDir);
  const hasPrerenderManifest = files.includes('prerender-manifest.json');
  const hasRoutesManifest = files.includes('routes-manifest.json');
  return {
    hasPrerenderManifest,
    hasRoutesManifest,
    files
  };
}

console.log('--- Next.js Config Check ---');
console.log(checkNextConfig());
console.log('\n--- Vercel Config Check ---');
console.log(checkVercelJson());
console.log('\n--- .next Build Directory Check ---');
console.log(checkNextBuild());
console.log('\nIf output: export is true, dynamic routes will NOT work. If force-dynamic is missing, add it to all dynamic route files. If .next build is missing route manifests, check build logs.');
