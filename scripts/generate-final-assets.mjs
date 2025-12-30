#!/usr/bin/env node
/**
 * 🎨 MASTER SOCIAL ASSET GENERATOR (Data-Synced & Incremental)
 * * PURPOSE: Generates OG images matching src/data slugs EXACTLY.
 * * COVERS: Individual Services, Main Categories, Divas Kloset, AND ALL PACKAGE TIERS.
 * * OPTIMIZATION: Skips files that already exist.
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

// --- 1. SINGLE SERVICES & CATEGORIES ---
const BASE_SERVICES = [
  // INDIVIDUAL SERVICES
  { slug: 'website-redesign', title: 'Website Redesign', subtitle: 'Modernize Your Site', tag: 'Web Dev', file: 'service-business-website2.jpg' },
  { slug: 'seo-audit', title: 'SEO Audit & Report', subtitle: 'Rank Higher on Google', tag: 'Marketing', file: 'service-social-media-audit.jpg' },
  { slug: 'speed-optimization', title: 'Speed Optimization', subtitle: 'Boost Performance', tag: 'Web Dev', file: 'service-web-and-mobile-development.jpg' },
  { slug: 'payment-gateway', title: 'Payment Gateway', subtitle: 'Secure Online Payments', tag: 'E-commerce', file: 'service-ecommerce-store.jpg' },
  { slug: 'bug-fix-support', title: 'Bug Fix & Support', subtitle: 'Technical Maintenance', tag: 'Support', file: 'service-web-and-mobile-development2.jpg' },
  { slug: 'executive-summary', title: 'Executive Summary', subtitle: 'Business Planning', tag: 'Business', file: 'service-business-plan-starter.jpg' },
  { slug: 'logo-design', title: 'Logo Design', subtitle: 'Brand Identity', tag: 'Branding', file: 'service-logo-design.jpg' },
  { slug: 'social-media-audit', title: 'Social Media Audit', subtitle: 'Profile Optimization', tag: 'Social', file: 'service-social-media-marketing2.jpg' },
  { slug: 'strategy-call', title: 'Strategy Call', subtitle: 'Expert Consultation', tag: 'Mentoring', file: 'service-strategy-session.jpg' },
  { slug: 'cv-resume', title: 'CV & Resume Review', subtitle: 'Career Optimization', tag: 'Career', file: 'service-professional-cv-resume.jpg' },

  // DIVAS KLOSET
  { slug: 'option-1', title: 'The Kickstarter', subtitle: 'Divas Kloset: Remote HQ', tag: 'Fashion', file: 'person-marketing-1.jpg' },
  { slug: 'option-2', title: 'The Diva Takeover', subtitle: 'Divas Kloset: Growth Engine', tag: 'Fashion', file: 'person-business-3.jpg' },
  { slug: 'option-3', title: 'The Empire Package', subtitle: 'Divas Kloset: Total Automation', tag: 'Fashion', file: 'person-marketing-2.jpg' },
  { slug: 'option-4', title: 'The Diva Blueprint', subtitle: 'Divas Kloset: Strategy', tag: 'Fashion', file: 'service-business-plan-and-logo3.jpg' },

  // MAIN CATEGORIES
  { slug: 'web-and-mobile-software-development', title: 'Web & Mobile Dev', subtitle: 'Full-Stack Solutions', tag: 'Category', file: 'service-web-and-mobile-development.jpg' },
  { slug: 'business-plan-and-logo-design', title: 'Business Strategy', subtitle: 'Plan & Brand', tag: 'Category', file: 'service-business-plan-and-logo.jpg' },
  { slug: 'social-media-advertising-and-marketing', title: 'Digital Marketing', subtitle: 'Grow Your Reach', tag: 'Category', file: 'service-social-media-marketing.jpg' },
  { slug: 'mentoring-and-consulting', title: 'Mentoring & Consulting', subtitle: 'Expert Guidance', tag: 'Category', file: 'service-mentoring-and-consulting.jpg' },
  { slug: 'profile-and-portfolio-building', title: 'Profile Building', subtitle: 'Stand Out', tag: 'Category', file: 'service-profile-and-portfolio.jpg' },
  
  // PARENT PACKAGE GROUPS
  { slug: 'landing-page', title: 'Landing Page', subtitle: 'High-Converting Sites', tag: 'Package', file: 'service-landing-page-design.jpg' },
  { slug: 'business-website', title: 'Business Website', subtitle: 'Professional Presence', tag: 'Package', file: 'service-business-website.jpg' },
  { slug: 'ecommerce-website', title: 'E-Commerce Store', subtitle: 'Sell Online 24/7', tag: 'Package', file: 'service-ecommerce-store.jpg' },
  { slug: 'web-app-development', title: 'Web App Dev', subtitle: 'Scalable SaaS Solutions', tag: 'Package', file: 'service-web-and-mobile-development2.jpg' },
  { slug: 'business-plan-starter', title: 'Business Plan', subtitle: 'Idea Stage Strategy', tag: 'Package', file: 'service-business-plan-starter.jpg' },
  { slug: 'business-plan-growth', title: 'Growth Plan', subtitle: 'Scaling Strategy', tag: 'Package', file: 'service-business-plan-growth.jpg' },
  { slug: 'digital-marketing-strategy', title: 'Marketing Strategy', subtitle: 'Data-Driven Growth', tag: 'Package', file: 'service-marketing-pro.jpg' },
  { slug: 'social-media-management', title: 'Social Media Mgmt', subtitle: 'Content & Growth', tag: 'Package', file: 'service-social-media-marketing2.jpg' },
  { slug: 'strategy-session', title: 'Strategy Session', subtitle: '1-on-1 Consulting', tag: 'Package', file: 'service-strategy-session.jpg' },
  { slug: 'business-coaching', title: 'Business Coaching', subtitle: 'Ongoing Mentorship', tag: 'Package', file: 'service-mentoring-program.jpg' },
  { slug: 'career-coaching', title: 'Career Coaching', subtitle: 'Tech Career Guidance', tag: 'Package', file: 'person-education-1.jpg' },
  { slug: 'portfolio-website', title: 'Portfolio Website', subtitle: 'Showcase Your Work', tag: 'Package', file: 'service-portfolio-website.jpg' },
  { slug: 'linkedin-optimization', title: 'LinkedIn Optimization', subtitle: 'Attract Recruiters', tag: 'Package', file: 'service-linkedin-optimization.jpg' },
];

// --- 2. TIERED PACKAGES (Generated from servicePackages.ts structure) ---
const TIERED_PACKAGES = [
  // Web Dev
  { slug: 'landing-page-basic', title: 'Landing Page', subtitle: 'Essential Features', tag: 'Basic Tier', file: 'service-landing-page-design.jpg' },
  { slug: 'landing-page-standard', title: 'Landing Page', subtitle: 'Most Popular', tag: 'Standard Tier', file: 'service-landing-page-design.jpg' },
  { slug: 'landing-page-premium', title: 'Landing Page', subtitle: 'Full Suite', tag: 'Premium Tier', file: 'service-landing-page-design.jpg' },

  { slug: 'business-website-basic', title: 'Business Website', subtitle: 'Essential Presence', tag: 'Basic Tier', file: 'service-business-website.jpg' },
  { slug: 'business-website-standard', title: 'Business Website', subtitle: 'Complete Solution', tag: 'Standard Tier', file: 'service-business-website.jpg' },
  { slug: 'business-website-premium', title: 'Business Website', subtitle: 'Advanced Features', tag: 'Premium Tier', file: 'service-business-website.jpg' },

  { slug: 'ecommerce-basic', title: 'E-commerce Store', subtitle: 'Starter Shop', tag: 'Basic Tier', file: 'service-ecommerce-store.jpg' },
  { slug: 'ecommerce-standard', title: 'E-commerce Store', subtitle: 'Growth Store', tag: 'Standard Tier', file: 'service-ecommerce-store.jpg' },
  { slug: 'ecommerce-premium', title: 'E-commerce Store', subtitle: 'Enterprise Store', tag: 'Premium Tier', file: 'service-ecommerce-store.jpg' },

  { slug: 'webapp-startup', title: 'Web Application', subtitle: 'Startup Edition', tag: 'MVP Tier', file: 'service-web-and-mobile-development2.jpg' },
  { slug: 'webapp-business', title: 'Web Application', subtitle: 'Business Edition', tag: 'Scale Tier', file: 'service-web-and-mobile-development2.jpg' },
  { slug: 'webapp-enterprise', title: 'Web Application', subtitle: 'Enterprise Edition', tag: 'Max Tier', file: 'service-web-and-mobile-development2.jpg' },

  // Business Plans
  { slug: 'bp-starter-basic', title: 'Business Plan', subtitle: 'Basic Framework', tag: 'Basic Tier', file: 'service-business-plan-starter.jpg' },
  { slug: 'bp-starter-standard', title: 'Business Plan', subtitle: 'Standard Plan', tag: 'Standard Tier', file: 'service-business-plan-starter.jpg' },
  { slug: 'bp-starter-premium', title: 'Business Plan', subtitle: 'Premium Plan', tag: 'Premium Tier', file: 'service-business-plan-starter.jpg' },

  { slug: 'bp-growth-basic', title: 'Growth Plan', subtitle: 'Basic Strategy', tag: 'Basic Tier', file: 'service-business-plan-growth.jpg' },
  { slug: 'bp-growth-standard', title: 'Growth Plan', subtitle: 'Standard Strategy', tag: 'Standard Tier', file: 'service-business-plan-growth.jpg' },
  { slug: 'bp-growth-premium', title: 'Growth Plan', subtitle: 'Premium Strategy', tag: 'Premium Tier', file: 'service-business-plan-growth.jpg' },

  // Branding
  { slug: 'logo-basic', title: 'Logo Design', subtitle: 'Startup Identity', tag: 'Basic Tier', file: 'service-logo-design.jpg' },
  { slug: 'logo-standard', title: 'Logo Design', subtitle: 'Professional Brand', tag: 'Standard Tier', file: 'service-logo-design.jpg' },
  { slug: 'logo-premium', title: 'Logo Design', subtitle: 'Complete Identity', tag: 'Premium Tier', file: 'service-logo-design.jpg' },

  // Marketing
  { slug: 'dm-basic', title: 'Marketing Strategy', subtitle: 'Basic Plan', tag: 'Basic Tier', file: 'service-marketing-pro.jpg' },
  { slug: 'dm-standard', title: 'Marketing Strategy', subtitle: 'Standard Plan', tag: 'Standard Tier', file: 'service-marketing-pro.jpg' },
  { slug: 'dm-premium', title: 'Marketing Strategy', subtitle: 'Premium Plan', tag: 'Premium Tier', file: 'service-marketing-pro.jpg' },

  { slug: 'sm-basic', title: 'Social Media', subtitle: 'Basic Management', tag: 'Basic Tier', file: 'service-social-media-marketing2.jpg' },
  { slug: 'sm-standard', title: 'Social Media', subtitle: 'Standard Management', tag: 'Standard Tier', file: 'service-social-media-marketing2.jpg' },
  { slug: 'sm-premium', title: 'Social Media', subtitle: 'Premium Management', tag: 'Premium Tier', file: 'service-social-media-marketing2.jpg' },

  // Mentoring
  { slug: 'strategy-basic', title: 'Strategy Session', subtitle: '1 Hour Consult', tag: 'Basic Tier', file: 'service-strategy-session.jpg' },
  { slug: 'strategy-standard', title: 'Strategy Session', subtitle: 'Deep Dive', tag: 'Standard Tier', file: 'service-strategy-session.jpg' },
  { slug: 'strategy-premium', title: 'Strategy Session', subtitle: 'Full Roadmap', tag: 'Premium Tier', file: 'service-strategy-session.jpg' },

  { slug: 'coaching-basic', title: 'Business Coaching', subtitle: 'Monthly Support', tag: 'Basic Tier', file: 'service-mentoring-program.jpg' },
  { slug: 'coaching-standard', title: 'Business Coaching', subtitle: 'Active Growth', tag: 'Standard Tier', file: 'service-mentoring-program.jpg' },
  { slug: 'coaching-premium', title: 'Business Coaching', subtitle: 'Executive Access', tag: 'Premium Tier', file: 'service-mentoring-program.jpg' },

  { slug: 'career-basic', title: 'Career Coaching', subtitle: 'Jump Start', tag: 'Basic Tier', file: 'person-education-1.jpg' },
  { slug: 'career-standard', title: 'Career Coaching', subtitle: 'Transition', tag: 'Standard Tier', file: 'person-education-1.jpg' },
  { slug: 'career-premium', title: 'Career Coaching', subtitle: 'Executive', tag: 'Premium Tier', file: 'person-education-1.jpg' },

  // Portfolio
  { slug: 'cv-basic', title: 'CV/Resume', subtitle: 'Essential Format', tag: 'Basic Tier', file: 'service-professional-cv-resume.jpg' },
  { slug: 'cv-standard', title: 'CV/Resume', subtitle: 'Professional', tag: 'Standard Tier', file: 'service-professional-cv-resume.jpg' },
  { slug: 'cv-premium', title: 'CV/Resume', subtitle: 'Executive', tag: 'Premium Tier', file: 'service-professional-cv-resume.jpg' },

  { slug: 'portfolio-basic', title: 'Portfolio Site', subtitle: 'Starter', tag: 'Basic Tier', file: 'service-portfolio-website.jpg' },
  { slug: 'portfolio-standard', title: 'Portfolio Site', subtitle: 'Professional', tag: 'Standard Tier', file: 'service-portfolio-website.jpg' },
  { slug: 'portfolio-premium', title: 'Portfolio Site', subtitle: 'Premium', tag: 'Premium Tier', file: 'service-portfolio-website.jpg' },

  { slug: 'linkedin-basic', title: 'LinkedIn Profile', subtitle: 'Quick Refresh', tag: 'Basic Tier', file: 'service-linkedin-optimization.jpg' },
  { slug: 'linkedin-standard', title: 'LinkedIn Profile', subtitle: 'Complete Makeover', tag: 'Standard Tier', file: 'service-linkedin-optimization.jpg' },
  { slug: 'linkedin-premium', title: 'LinkedIn Profile', subtitle: 'Executive Presence', tag: 'Premium Tier', file: 'service-linkedin-optimization.jpg' },
];

const ALL_ITEMS = [...BASE_SERVICES, ...TIERED_PACKAGES];

function loadFileAsBase64(filePath) {
  try { return fs.existsSync(filePath) ? `data:image/${path.extname(filePath).slice(1)};base64,${fs.readFileSync(filePath).toString('base64')}` : null; } catch { return null; }
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
<div class="content"><div class="tag">${tag}</div><h1>${title}</h1><div class="bar"></div><p>${subtitle}</p></div>
<div class="website">hexadigitall.com</div></body></html>`;

async function generate() {
  console.log(`🚀 Starting Data-Synced Asset Generation for ${ALL_ITEMS.length} items...`);
  if (!fs.existsSync(DIRS.out)) fs.mkdirSync(DIRS.out, { recursive: true });
  
  const browser = await puppeteer.launch({ headless: 'new', args: ['--no-sandbox'] });
  const logoData = loadFileAsBase64(DIRS.logo);

  for (const item of ALL_ITEMS) {
    // 🛑 SKIP CHECK: If file exists, skip it!
    const outPath = path.join(DIRS.out, `${item.slug}.jpg`);
    if (fs.existsSync(outPath)) {
      console.log(`⏩ Skipped (Exists): ${item.slug}.jpg`);
      continue; 
    }

    const bgPath = path.join(DIRS.serviceBg, item.file);
    const bgData = loadFileAsBase64(bgPath);
    if (!bgData) { console.warn(`   ⚠️ Missing Image: ${item.file} (Skipping ${item.slug})`); continue; }

    const page = await browser.newPage();
    await page.setViewport({ width: 1200, height: 630 });
    // Note: 'tag' is now passed dynamically
    const html = generateHTML(item.title, item.subtitle, item.tag, { id: 'landscape', width: 1200, height: 630 }, logoData, bgData);
    
    // Generate: /og-images/[slug].jpg
    await page.setContent(html, { waitUntil: 'domcontentloaded' });
    await page.screenshot({ path: outPath, type: 'jpeg', quality: 90 });
    
    console.log(`   ✅ Generated: ${item.slug}.jpg`);
    await page.close();
  }
  await browser.close();
  console.log('🏁 All operations complete.');
}
generate().catch(console.error);