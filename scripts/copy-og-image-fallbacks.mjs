import fs from 'fs';
import path from 'path';

// List of unmatched packages and their ideal filenames
const unmatched = [
  { group: 'Business Planning & Branding', name: 'Business Plan — Standard', ideal: 'business-plan-standard.jpg' },
  { group: 'Business Planning & Branding', name: 'Business Plan — Premium', ideal: 'business-plan-premium.jpg' },
  { group: 'Business Planning & Branding', name: 'Growth Plan — Basic', ideal: 'growth-plan-basic.jpg' },
  { group: 'Business Planning & Branding', name: 'Growth Plan — Standard', ideal: 'growth-plan-standard.jpg' },
  { group: 'Business Planning & Branding', name: 'Growth Plan — Premium', ideal: 'growth-plan-premium.jpg' },
  { group: 'Business Planning & Branding', name: 'Logo Design — Basic', ideal: 'logo-design-basic.jpg' },
  { group: 'Business Planning & Branding', name: 'Logo Design — Standard', ideal: 'logo-design-standard.jpg' },
  { group: 'Business Planning & Branding', name: 'Logo Design — Premium', ideal: 'logo-design-premium.jpg' },
  { group: 'Mentoring & Consulting', name: 'Strategy Session — Basic', ideal: 'strategy-session-basic.jpg' },
  { group: 'Mentoring & Consulting', name: 'Strategy Session — Standard', ideal: 'strategy-session-standard.jpg' },
  { group: 'Mentoring & Consulting', name: 'Strategy Session — Premium', ideal: 'strategy-session-premium.jpg' },
  { group: 'Mentoring & Consulting', name: 'Business Coaching — Basic', ideal: 'business-coaching-basic.jpg' },
  { group: 'Mentoring & Consulting', name: 'Business Coaching — Standard', ideal: 'business-coaching-standard.jpg' },
  { group: 'Mentoring & Consulting', name: 'Business Coaching — Premium', ideal: 'business-coaching-premium.jpg' },
  { group: 'Mentoring & Consulting', name: 'Career Coaching — Basic', ideal: 'career-coaching-basic.jpg' },
  { group: 'Mentoring & Consulting', name: 'Career Coaching — Transition', ideal: 'career-coaching-transition.jpg' },
  { group: 'Mentoring & Consulting', name: 'Career Coaching — Executive', ideal: 'career-coaching-executive.jpg' },
  { group: 'Profile & Portfolio Building', name: 'CV/Resume — Essential', ideal: 'cv-resume-essential.jpg' },
  { group: 'Profile & Portfolio Building', name: 'CV/Resume — Professional', ideal: 'cv-resume-professional.jpg' },
  { group: 'Profile & Portfolio Building', name: 'CV/Resume — Executive', ideal: 'cv-resume-executive.jpg' },
  { group: 'Profile & Portfolio Building', name: 'Portfolio Website — Starter', ideal: 'portfolio-website-starter.jpg' },
  { group: 'Profile & Portfolio Building', name: 'Portfolio Website — Professional', ideal: 'portfolio-website-professional.jpg' },
  { group: 'Profile & Portfolio Building', name: 'Portfolio Website — Premium', ideal: 'portfolio-website-premium.jpg' },
  { group: 'Profile & Portfolio Building', name: 'LinkedIn — Quick Refresh', ideal: 'linkedin-quick-refresh.jpg' },
  { group: 'Profile & Portfolio Building', name: 'LinkedIn — Complete Makeover', ideal: 'linkedin-complete-makeover.jpg' },
  { group: 'Profile & Portfolio Building', name: 'LinkedIn — Executive Presence', ideal: 'linkedin-executive-presence.jpg' },
  { group: 'Digital Marketing & Growth', name: 'Marketing Strategy — Basic', ideal: 'marketing-strategy-basic.jpg' },
  { group: 'Digital Marketing & Growth', name: 'Marketing Strategy — Standard', ideal: 'marketing-strategy-standard.jpg' },
  { group: 'Digital Marketing & Growth', name: 'Marketing Strategy — Premium', ideal: 'marketing-strategy-premium.jpg' },
  { group: 'Digital Marketing & Growth', name: 'Social Media — Basic', ideal: 'social-media-basic.jpg' },
  { group: 'Digital Marketing & Growth', name: 'Social Media — Standard', ideal: 'social-media-standard.jpg' },
  { group: 'Digital Marketing & Growth', name: 'Social Media — Premium', ideal: 'social-media-premium.jpg' },
  { group: 'Web & Mobile Development', name: 'E-commerce Store — Basic', ideal: 'e-commerce-store-basic.jpg' },
  { group: 'Web & Mobile Development', name: 'E-commerce Store — Standard', ideal: 'e-commerce-store-standard.jpg' },
  { group: 'Web & Mobile Development', name: 'E-commerce Store — Premium', ideal: 'e-commerce-store-premium.jpg' },
  { group: 'Web & Mobile Development', name: 'Web App — Startup Edition', ideal: 'web-app-startup-edition.jpg' },
  { group: 'Web & Mobile Development', name: 'Web App — Business Edition', ideal: 'web-app-business-edition.jpg' },
  { group: 'Web & Mobile Development', name: 'Web App — Enterprise Edition', ideal: 'web-app-enterprise-edition.jpg' },
];

const ogDir = path.resolve('public/og-images');

// Fallbacks for each group (edit as needed for your project)
const groupFallbacks = {
  'Business Planning & Branding': 'business-plan-and-logo-design.jpg',
  'Mentoring & Consulting': 'mentoring-and-consulting.jpg',
  'Profile & Portfolio Building': 'profile-and-portfolio-building.jpg',
  'Digital Marketing & Growth': 'digital-marketing-strategy.jpg',
  'Web & Mobile Development': 'web-and-mobile-software-development.jpg',
};

for (const { group, ideal } of unmatched) {
  const fallback = groupFallbacks[group];
  if (!fallback) {
    console.warn(`No fallback for group: ${group}`);
    continue;
  }
  const src = path.join(ogDir, fallback);
  const dest = path.join(ogDir, ideal);
  if (!fs.existsSync(src)) {
    console.warn(`Missing fallback image: ${src}`);
    continue;
  }
  if (fs.existsSync(dest)) {
    console.log(`Already exists: ${dest}`);
    continue;
  }
  fs.copyFileSync(src, dest);
  console.log(`Copied ${fallback} -> ${ideal}`);
}
