#!/usr/bin/env node

/**
 * HEXADIGITALL SERVICES CLEANUP & ARCHIVE SCRIPT
 * ------------------------------------------------------
 * 1. Identifies "Golden" services (the 5 we want).
 * 2. Deduplicates them (Keeps oldest, deletes newer duplicates).
 * 3. "Archives" legacy services by changing their _type (Hides them from Studio/Site).
 * 4. Updates the Golden services with 50% off pricing.
 */

import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN is missing');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// The 5 Services we WANT to keep (with 50% off data)
const goldenServices = [
  {
    slug: "business-plan-and-logo-design",
    title: "Business Plan & Logo Design",
    data: {
      description: "Complete business planning and brand identity services.",
      serviceType: "business",
      icon: "chart",
      featured: true,
      packages: [
        { _key: "p1", name: "Starter Plan", tier: "standard", price: 39.5, currency: "USD", billing: "one_time", deliveryTime: "5-7 days", features: ["Executive Summary", "Financials", "Basic Logo"], popular: false },
        { _key: "p2", name: "Growth Plan", tier: "standard", price: 74.5, currency: "USD", billing: "one_time", deliveryTime: "7-10 days", features: ["Comprehensive Plan", "Market Research", "Pro Logo"], popular: true },
        { _key: "p3", name: "Investor Plan", tier: "premium", price: 124.5, currency: "USD", billing: "one_time", deliveryTime: "10-14 days", features: ["Investment Grade", "Pitch Deck", "Full Branding"], popular: false }
      ]
    }
  },
  {
    slug: "web-and-mobile-software-development",
    title: "Web & Mobile Development",
    data: {
      description: "Professional web and mobile application development.",
      serviceType: "web",
      icon: "code",
      featured: true,
      packages: [
        { _key: "p1", name: "Landing Page", tier: "basic", price: 74.5, currency: "USD", billing: "one_time", deliveryTime: "5-7 days", features: ["One Page", "Responsive", "SEO Basic"], popular: false },
        { _key: "p2", name: "Business Website", tier: "standard", price: 174.5, currency: "USD", billing: "one_time", deliveryTime: "10-14 days", features: ["6 Pages", "CMS", "SEO Pro", "Analytics"], popular: true },
        { _key: "p3", name: "E-commerce Store", tier: "premium", price: 324.5, currency: "USD", billing: "one_time", deliveryTime: "14-21 days", features: ["25 Products", "Payments", "Inventory"], popular: false },
        { _key: "p4", name: "Mobile App", tier: "premium", price: 499.5, currency: "USD", billing: "project", deliveryTime: "21-30 days", features: ["iOS/Android", "Custom UI", "API Integration"], popular: false }
      ]
    }
  },
  {
    slug: "social-media-advertising-and-marketing",
    title: "Social Media Marketing",
    data: {
      description: "Grow your brand and engage your audience.",
      serviceType: "marketing",
      icon: "network",
      featured: true,
      packages: [
        { _key: "p1", name: "Social Starter", tier: "basic", price: 49.5, currency: "USD", billing: "monthly", deliveryTime: "Ongoing", features: ["2 Platforms", "15 Posts/mo"], popular: false },
        { _key: "p2", name: "Marketing Pro", tier: "standard", price: 124.5, currency: "USD", billing: "monthly", deliveryTime: "Ongoing", features: ["4 Platforms", "30 Posts/mo", "Ads Setup"], popular: true },
        { _key: "p3", name: "Growth Accelerator", tier: "premium", price: 224.5, currency: "USD", billing: "monthly", deliveryTime: "Ongoing", features: ["All Platforms", "Weekly Strategy", "Video Content"], popular: false }
      ]
    }
  },
  {
    slug: "mentoring-and-consulting",
    title: "Mentoring & Consulting",
    data: {
      description: "Accelerate your growth with professional guidance.",
      serviceType: "consulting",
      icon: "settings",
      featured: true,
      packages: [
        { _key: "p1", name: "Strategy Session", tier: "basic", price: 49.5, currency: "USD", billing: "one_time", deliveryTime: "1-2 days", features: ["90-min Call", "Action Plan"], popular: false },
        { _key: "p2", name: "Mentoring Program", tier: "standard", price: 149.5, currency: "USD", billing: "monthly", deliveryTime: "Ongoing", features: ["4 Sessions/mo", "Roadmap", "Unlimited Support"], popular: true },
        { _key: "p3", name: "Full Consulting", tier: "enterprise", price: 999.5, currency: "USD", billing: "project", deliveryTime: "3-6 months", features: ["Business Audit", "Team Training", "Process Optimization"], popular: false }
      ]
    }
  },
  {
    slug: "profile-and-portfolio-building",
    title: "Profile & Portfolio Building",
    data: {
      description: "Showcase your work and attract clients.",
      serviceType: "profile",
      icon: "monitor",
      featured: false,
      packages: [
        { _key: "p1", name: "Pro Profile", tier: "basic", price: 99.5, currency: "USD", billing: "one_time", deliveryTime: "5-7 days", features: ["Single Page", "Resume Download", "Bio"], popular: false },
        { _key: "p2", name: "Portfolio Site", tier: "standard", price: 199.5, currency: "USD", billing: "one_time", deliveryTime: "10-14 days", features: ["Multi-Page", "Case Studies", "Blog"], popular: true },
        { _key: "p3", name: "Brand Site", tier: "premium", price: 399.5, currency: "USD", billing: "one_time", deliveryTime: "21-30 days", features: ["Custom Brand", "Booking System", "E-commerce"], popular: false }
      ]
    }
  }
];

const validSlugs = goldenServices.map(s => s.slug);

async function cleanup() {
  console.log('🧹 Starting Service Cleanup...');
  
  // 1. Fetch ALL current services
  const allServices = await client.fetch(`*[_type == "serviceCategory"]{_id, _createdAt, title, slug}`);
  console.log(`📊 Found ${allServices.length} total service documents.`);

  // 2. Group them
  const keepersMap = {}; // Maps slug -> [docs]
  const toArchive = [];

  for (const doc of allServices) {
    const slug = doc.slug?.current;
    
    // Is this a Golden Service?
    if (slug && validSlugs.includes(slug)) {
      if (!keepersMap[slug]) keepersMap[slug] = [];
      keepersMap[slug].push(doc);
    } else {
      // It's a legacy service (e.g. "Cloud", "IT Support", or old "Web Dev")
      toArchive.push(doc);
    }
  }

  // 3. Process Legacy (Archive them)
  console.log(`\n📦 Archiving ${toArchive.length} legacy services (hiding from view)...`);
  for (const doc of toArchive) {
    console.log(`   - Archiving: ${doc.title} (${doc._id})`);
    try {
      await client.patch(doc._id)
        .set({ 
          _type: 'legacyServiceCategory', // 👈 This hides it from your Studio "Service Category" list
          title: `[ARCHIVED] ${doc.title}` 
        })
        .commit();
    } catch (err) {
      console.error(`     ❌ Failed to archive ${doc.title}:`, err.message);
    }
  }

  // 4. Process Golden Services (Deduplicate & Update)
  console.log(`\n✨ Processing Valid Services...`);
  for (const golden of goldenServices) {
    const docs = keepersMap[golden.slug] || [];
    
    // Sort by creation date (Oldest first). Oldest usually has the references.
    docs.sort((a, b) => new Date(a._createdAt) - new Date(b._createdAt));

    if (docs.length === 0) {
      console.log(`   ➕ Creating NEW: ${golden.title}`);
      await client.create({
        _type: 'serviceCategory',
        title: golden.title,
        slug: { _type: 'slug', current: golden.slug },
        ...golden.data
      });
    } else {
      const winner = docs[0]; // Oldest is winner
      const losers = docs.slice(1); // Newer duplicates are losers

      console.log(`   ✅ Updating Winner: ${golden.title} (${winner._id})`);
      await client.patch(winner._id).set(golden.data).commit();

      if (losers.length > 0) {
        console.log(`   🗑️ Deleting ${losers.length} duplicate(s) for ${golden.title}...`);
        for (const loser of losers) {
          try {
            await client.delete(loser._id);
            console.log(`      - Deleted duplicate: ${loser._id}`);
          } catch (err) {
            console.warn(`      ⚠️ Could not delete duplicate ${loser._id} (might have refs). Archiving instead.`);
            await client.patch(loser._id).set({ _type: 'legacyServiceCategory', title: `[DUPLICATE] ${golden.title}` }).commit();
          }
        }
      }
    }
  }

  console.log('\n🎉 CLEANUP COMPLETE!');
  console.log('👉 Legacy/Duplicate services are now hidden (type: legacyServiceCategory).');
  console.log('👉 Only the 5 Valid Services should appear in Studio and Frontend.');
  console.log('👉 50% Off pricing has been applied.');
}

cleanup();