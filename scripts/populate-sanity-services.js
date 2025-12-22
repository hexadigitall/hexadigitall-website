#!/usr/bin/env node

/**
 * HEXADIGITALL SERVICES FIX SCRIPT (SAFE UPDATE)
 * ------------------------------------------------------
 * 1. Finds existing Service Categories by slug.
 * 2. Updates them in-place (preserving IDs + References).
 * 3. Forces the correct 50% off pricing structure.
 * 4. Fixes any duplicates by syncing them all.
 * * Run with: node scripts/populate-sanity-services.js
 */

import { createClient } from 'next-sanity'
import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

// Load environment variables
dotenv.config({ path: path.join(process.cwd(), '.env.local') });

if (!process.env.SANITY_API_TOKEN) {
  console.error('❌ SANITY_API_TOKEN is missing in .env.local');
  process.exit(1);
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-01-01',
  token: process.env.SANITY_API_TOKEN,
  useCdn: false
})

// ✅ CORRECT DATA (50% OFF)
const serviceCategories = [
  {
    _type: "serviceCategory",
    title: "Web & Mobile Development",
    slug: { _type: "slug", current: "web-and-mobile-software-development" },
    description: "Professional web and mobile application development services to bring your digital ideas to life.",
    serviceType: "web",
    icon: "code",
    featured: true,
    packages: [
      {
        _key: "landing-page-pkg",
        name: "Landing Page",
        tier: "basic",
        price: 74.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "5-7 days",
        popular: false,
        features: ["Single Page Design", "Mobile Responsive", "Contact Form", "Basic SEO", "Social Links"]
      },
      {
        _key: "business-website-pkg",
        name: "Business Website",
        tier: "standard",
        price: 174.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "10-14 days",
        popular: true,
        features: ["Up to 6 Pages", "Mobile Responsive", "CMS Integration", "SEO Optimization", "Google Analytics", "Free Logo"]
      },
      {
        _key: "ecommerce-website-pkg",
        name: "E-commerce Store",
        tier: "premium",
        price: 324.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "14-21 days",
        popular: false,
        features: ["Up to 25 Products", "Payment Gateway", "Inventory Management", "Mobile Responsive", "SEO Optimized"]
      },
      {
        _key: "mobile-app-pkg",
        name: "Mobile App Development",
        tier: "premium",
        price: 499.5,
        currency: "USD",
        billing: "project",
        deliveryTime: "21-30 days",
        popular: false,
        features: ["iOS & Android App", "Cross-Platform", "Custom UI/UX", "Backend API", "Push Notifications", "App Store Deployment"]
      }
    ]
  },
  {
    _type: "serviceCategory",
    title: "Business Plan & Logo Design",
    slug: { _type: "slug", current: "business-plan-and-logo-design" },
    description: "Complete business planning and brand identity services.",
    serviceType: "business",
    icon: "chart",
    featured: true,
    packages: [
      {
        _key: "starter-plan-pkg",
        name: "Starter Plan",
        tier: "standard",
        price: 39.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "5-7 days",
        popular: false,
        features: ["Executive Summary", "Business Description", "Financial Projection", "SWOT Analysis", "Basic Logo"]
      },
      {
        _key: "growth-plan-pkg",
        name: "Growth Plan",
        tier: "standard",
        price: 74.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "7-10 days",
        popular: true,
        features: ["Comprehensive Plan", "Market Research", "3-Year Financials", "Marketing Strategy", "Pitch Deck", "Pro Logo"]
      },
      {
        _key: "investor-plan-pkg",
        name: "Investor Plan",
        tier: "premium",
        price: 124.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "10-14 days",
        popular: false,
        features: ["Investment-Grade Plan", "Deep Market Analysis", "5-Year Financials", "Go-to-Market Strategy", "Full Brand Identity", "Investor Intro"]
      }
    ]
  },
  {
    _type: "serviceCategory",
    title: "Social Media Marketing",
    slug: { _type: "slug", current: "social-media-advertising-and-marketing" },
    description: "Grow your brand and engage your audience.",
    serviceType: "marketing",
    icon: "network",
    featured: true,
    packages: [
      {
        _key: "social-starter",
        name: "Social Starter",
        tier: "basic",
        price: 49.5,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: false,
        features: ["2 Platforms", "15 Posts/mo", "Content Calendar", "Community Mgmt", "Monthly Report"]
      },
      {
        _key: "marketing-pro",
        name: "Marketing Pro",
        tier: "standard",
        price: 124.5,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: true,
        features: ["4 Platforms", "30 Posts/mo", "Ads Setup ($100 credit)", "Bi-weekly Reports", "Email Marketing"]
      },
      {
        _key: "growth-accelerator",
        name: "Growth Accelerator",
        tier: "premium",
        price: 224.5,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: false,
        features: ["6 Platforms", "50+ Posts", "Advanced Strategy", "Ads Management", "Weekly Calls", "Custom Graphics"]
      }
    ]
  },
  {
    _type: "serviceCategory",
    title: "Mentoring & Consulting",
    slug: { _type: "slug", current: "mentoring-and-consulting" },
    description: "Accelerate your growth with professional guidance.",
    serviceType: "consulting",
    icon: "settings",
    featured: true,
    packages: [
      {
        _key: "strategy-session",
        name: "Strategy Session",
        tier: "basic",
        price: 49.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "1-2 days",
        popular: false,
        features: ["90-min Consultation", "SWOT Analysis", "5-Step Action Plan", "Resource Library", "Summary Report"]
      },
      {
        _key: "mentoring-program",
        name: "Mentoring Program",
        tier: "standard",
        price: 149.5,
        currency: "USD",
        billing: "monthly",
        deliveryTime: "Ongoing",
        popular: true,
        features: ["4 Sessions/Month", "12-Month Roadmap", "Weekly Check-ins", "Network Access", "Unlimited Support"]
      },
      {
        _key: "full-consulting",
        name: "Full Consulting",
        tier: "enterprise",
        price: 999.5,
        currency: "USD",
        billing: "project",
        deliveryTime: "3-6 months",
        popular: false,
        features: ["Business Audit", "Strategic Plan", "Financial Analysis", "Process Optimization", "Team Training", "3-Month Support"]
      }
    ]
  },
  {
    _type: "serviceCategory",
    title: "Profile & Portfolio Building",
    slug: { _type: "slug", current: "profile-and-portfolio-building" },
    description: "Showcase your work and attract clients.",
    serviceType: "profile",
    icon: "monitor",
    featured: false,
    packages: [
      {
        _key: "pro-profile",
        name: "Professional Profile",
        tier: "basic",
        price: 99.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "5-7 days",
        popular: false,
        features: ["Single-Page Portfolio", "Mobile Responsive", "Gallery (12 Projects)", "Bio & Skills", "Contact Form"]
      },
      {
        _key: "portfolio-website",
        name: "Portfolio Website",
        tier: "standard",
        price: 199.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "10-14 days",
        popular: true,
        features: ["Multi-Page Site", "20 Case Studies", "Blog Section", "SEO Optimization", "Analytics", "Social Feed"]
      },
      {
        _key: "brand-site",
        name: "Premium Brand Site",
        tier: "premium",
        price: 399.5,
        currency: "USD",
        billing: "one_time",
        deliveryTime: "21-30 days",
        popular: false,
        features: ["Custom Brand Website", "Client Portal", "Booking System", "E-commerce", "Advanced SEO", "Content Writing"]
      }
    ]
  }
];

async function fixServices() {
  console.log('🚀 Starting Service Fix (In-Place Update)...')
  
  try {
    for (const service of serviceCategories) {
      console.log(`\n🔍 Checking: ${service.title}`)
      
      // 1. Find ALL documents matching the slug (handling duplicates)
      const existingDocs = await client.fetch(
        `*[_type == "serviceCategory" && slug.current == $slug]`,
        { slug: service.slug.current }
      )

      if (existingDocs.length > 0) {
        console.log(`   ⚠️  Found ${existingDocs.length} existing document(s). Updating ALL...`)
        
        // 2. Update each duplicate to ensure consistency
        for (const doc of existingDocs) {
          await client.createOrReplace({
            ...service,
            _id: doc._id // KEEP THE SAME ID to preserve references!
          })
          console.log(`      ✅ Fixed doc: ${doc._id}`)
        }
      } else {
        console.log(`   ✨ Creating new: ${service.title}`)
        await client.create(service)
      }
    }

    console.log('\n🎉 RECOVERY COMPLETE!')
    console.log('👉 The services now have the correct "packages" structure.')
    console.log('👉 References are preserved.')
    
  } catch (error) {
    console.error('❌ Recovery failed:', error.message)
  }
}

fixServices()