#!/usr/bin/env node
/**
 * 🎨 MASTER SOCIAL ASSET GENERATOR (Data-Synced)
 * * PURPOSE: Generates OG images matching src/data slugs EXACTLY.
 * * COVERS: Divas Kloset, Service Packages, & Main Categories.
 */

import fs from 'node:fs';
import path from 'node:path';
import puppeteer from 'puppeteer';

// --- CONFIGURATION ---
const DIRS = {
  out: path.resolve('public/og-images'),
  serviceBg: path.resolve('promotional-campaign/images/raw'),
  logo: path.resolve('public/hexadigitall-logo-transparent.png')
};

const BRAND = { primary: '#001F3F', accent: '#00D9FF', overlayFrom: 'rgba(0, 31, 63, 0.95)', overlayTo: 'rgba(0, 31, 63, 0.1)' };

// ✅ MASTER SLUG MAP (Derived from your src/data content)
const SERVICES = [
  // --- DIVAS KLOSET ---
  { slug: 'option-1', title: 'The Kickstarter Package', subtitle: 'Divas Kloset: Remote HQ', file: 'person-marketing-1.jpg' },
  { slug: 'option-2', title: 'The Diva Takeover', subtitle: 'Divas Kloset: Growth Engine', file: 'person-business-3.jpg' },
  { slug: 'option-3', title: 'The Empire Package', subtitle: 'Divas Kloset: Total Automation', file: 'person-marketing-2.jpg' },
  { slug: 'option-4', title: 'The Diva Blueprint', subtitle: 'Divas Kloset: Strategy & Training', file: 'service-business-plan-and-logo3.jpg' },

  // --- WEB DEV PACKAGES ---
  { slug: 'landing-page', title: 'Landing Page Design', subtitle: 'High-Converting & Fast', file: 'service-landing-page-design.jpg' },
  { slug: 'business-website', title: 'Business Website', subtitle: 'Professional Online Presence', file: 'service-business-website.jpg' },
  { slug: 'ecommerce-website', title: 'E-Commerce Store', subtitle: 'Sell Online 24/7', file: 'service-ecommerce-store.jpg' },
  { slug: 'web-app-development', title: 'Web App Development', subtitle: 'Scalable SaaS Solutions', file: 'service-web-and-mobile-development2.jpg' },

  // --- BUSINESS & STRATEGY ---
  { slug: 'business-plan-starter', title: 'Business Plan: Starter', subtitle: 'Idea Stage Strategy', file: 'service-business-plan-starter.jpg' },
  { slug: 'business-plan-growth', title: 'Business Plan: Growth', subtitle: 'Scaling Strategy', file: 'service-business-plan-growth.jpg' },
  { slug: 'logo-design', title: 'Logo Design', subtitle: 'Brand Identity', file: 'service-logo-design.jpg' },

  // --- MARKETING ---
  { slug: 'digital-marketing-strategy', title: 'Marketing Strategy', subtitle: 'Data-Driven Growth', file: 'service-marketing-pro.jpg' },
  { slug: 'social-media-management', title: 'Social Media Mgmt', subtitle: 'We Handle Your Content', file: 'service-social-media-marketing2.jpg' },

  // --- MENTORING ---
  { slug: 'strategy-session', title: 'Strategy Session', subtitle: '1-on-1 Consulting', file: 'service-strategy-session.jpg' },
  { slug: 'business-coaching', title: 'Business Coaching', subtitle: 'Ongoing Mentorship', file: 'service-mentoring-program.jpg' },
  { slug: 'career-coaching', title: 'Career Coaching', subtitle: 'Tech Career Guidance', file: 'person-education-1.jpg' },

  // --- PORTFOLIO ---
  { slug: 'cv-resume', title: 'Professional CV/Resume', subtitle: 'ATS-Optimized', file: 'service-professional-cv-resume.jpg' },
  { slug: 'portfolio-website', title: 'Portfolio Website', subtitle: 'Showcase Your Work', file: 'service-portfolio-website.jpg' },
  { slug: 'linkedin-optimization', title: 'LinkedIn Optimization', subtitle: 'Attract Recruiters', file: 'service-linkedin-optimization.jpg' },

  // --- INDIVIDUAL SERVICES ---
  { slug: 'website-redesign', title: 'Website Redesign', subtitle: 'Modernize Your Site', file: 'service-business-website2.jpg' },
  { slug: 'seo-audit', title: 'SEO Audit', subtitle: 'Rank Higher on Google', file: 'service-social-media-audit.jpg' },
  { slug: 'pitch-deck', title: 'Investor Pitch Deck', subtitle: 'Secure Funding', file: 'service-business-plan-investor.jpg' },
  
  // --- MAIN CATEGORIES (The "Big 5") ---
  { slug: 'web-and-mobile-software-development', title: 'Web & Mobile Dev', subtitle: 'Full-Stack Solutions', file: 'service-web-and-mobile-development.jpg' },
  { slug: 'business-plan-and-logo-design', title: 'Business Strategy', subtitle: 'Plan & Brand', file: 'service-business-plan-and-logo.jpg' },
  { slug: 'social-media-advertising-and-marketing', title: 'Digital Marketing', subtitle: 'Grow Your Reach', file: 'service-social-media-marketing.jpg' },
  { slug: 'mentoring-and-consulting', title: 'Mentoring & Consulting', subtitle: 'Expert Guidance', file: 'service-mentoring-and-consulting.jpg' },
  { slug: 'profile-and-portfolio-building', title: 'Profile Building', subtitle: 'Stand Out', file: 'service-profile-and-portfolio.jpg' }
];

function loadFileAsBase64(filePath) {
  try { return fs.existsSync(filePath) ? `data:image/${path.extname(filePath).slice(1)};base64,${fs.readFileSync(filePath).toString('base64')}` : null; } catch (e) { return null; }
}

const generateHTML = (title, subtitle, tag, format, logoData, bgImageData) => `
<!DOCTYPE html><html><head><style>
@import url('https://fonts.googleapis.com/css2?family=Montserrat:wght@400;600;800&display=swap');
body { margin: 0; padding: 0; width: ${format.width}px; height: ${format.height}px; font-family: 'Montserrat', sans-serif; overflow: hidden; position: relative; background: ${BRAND.primary}; }
.bg-image { position: absolute; top: 0; left: 0; width: 100%; height: 100%; background-image: url('${bgImageData}'); background-size: cover; background-position: center; z-index: 1; }
.overlay { position: absolute; bottom: 0; left: 0; width: 100%; height: 100%; background: linear-gradient(to bottom, ${BRAND.overlayTo} 0%, ${BRAND.overlayFrom} 85%); z-index: 2; }
.content { position: absolute; bottom: 0; left: 0; width: 100%; padding: ${format.id === 'portrait' ? '120px 80px' : '80px'}; box-sizing: border-box; z-index: 3; display: flex; flex-direction: column; justify-content: flex-end; }
.tag { display: inline-block; background: ${BRAND.accent}; color: ${BRAND.primary}; padding: 10px 24px; border-radius: 50px; font-weight: 800; text-transform: uppercase; font-size: ${format.id === 'portrait' ? '32px' : '20px'}; margin-bottom: 24px; box-shadow: 0 4px 15px rgba(0,0,0,0.3); }
h1 { font-size: ${format.id === 'portrait' ? '70px' : '56px'}; color: white; margin: 20px 0 16px 0; line-height: 1.1; font-weight: 800; text-shadow: 0 4px 20px rgba(0,0,0,0.5); text-transform: capitalize; }
.bar { width: 100px; height: 6px; background: ${BRAND.accent}; margin-bottom: 24px; border-radius: 3px; }
p { font-size: ${format.id === 'portrait' ? '40px' : '28px'}; color: #E2E8F0; margin: 0; font-weight: 600; text-shadow: 0 2px 10px rgba(0,0,0,0.5); }
.website { position: absolute; bottom: 40px; right: 60px; color: rgba(255,255,255,0.8); font-size: 24px; font-weight: 600; z-index: 4; }
.logo { position: absolute; top: 60px; left: 60px; width: 200px; z-index: 4; }
</style></head><body>
<div class="bg-image"></div><div class="overlay"></div>${logoData ? `<img src="${logoData}" class="logo" />` : ''}
<div class="content"><div class="tag">Available Now</div><h1>${title}</h1><div class="bar"></div><p>${subtitle}</p></div>
<div class="website">hexadigitall.com</div></body></html>`;

async function generate() {
  console.log('🚀 Starting Data-Synced Asset Generation...');
  if (!fs.existsSync(DIRS.out)) fs.mkdirSync(DIRS.out, { recursive: true });
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const logoData = loadFileAsBase64(DIRS.logo);

  for (const item of SERVICES) {
    const bgPath = path.join(DIRS.serviceBg, item.file);
    const bgData = loadFileAsBase64(bgPath);
    if (!bgData) { console.warn(`   ⚠️ Missing Image: ${item.file}`); continue; }

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    const html = generateHTML(item.title, item.subtitle, 'Premium', { id: 'landscape', width: 1200, height: 630 }, logoData, bgData);
    
    // Generate: /og-images/[slug].jpg
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: path.join(DIRS.out, `${item.slug}.jpg`), type: 'jpeg', quality: 90 });
    
    console.log(`   ✅ Generated: ${item.slug}.jpg`);
    await page.close();
  }
  await browser.close();
}
generate().catch(console.error);