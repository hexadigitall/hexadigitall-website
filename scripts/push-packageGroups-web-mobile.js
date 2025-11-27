#!/usr/bin/env node
// scripts/push-packageGroups-web-mobile.js
// Add packageGroups to Sanity for Web & Mobile service categories so live content matches local structure.
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'

dotenv.config({ path: '.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  token: process.env.SANITY_API_TOKEN,
  useCdn: false,
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2025-01-01'
})

async function patchBySlug(slug, packageGroups) {
  try {
    console.log(`Searching for document with slug: ${slug}`)
    const docs = await client.fetch(`*[_type == "serviceCategory" && slug.current == $slug]{_id}[0]`, { slug })
    if (!docs || !docs._id) {
      console.warn(`No document found for slug: ${slug}`)
      return
    }

    const id = docs._id
    console.log(`Patching document ${id} with ${packageGroups.length} package group(s)`)

    const result = await client.patch(id).set({ packageGroups }).commit({ autoGenerateArrayKeys: true })
    console.log(`✅ Patched ${slug} -> ${result._id}`)
  } catch (err) {
    console.error(`❌ Failed to patch slug ${slug}:`, err)
  }
}

// Assumptions:
// - We map local pricing tiers into grouped package flavors for the modal experience.
// - Tier names map to semantic levels: basic/standard/premium/enterprise
// - Currency stored in Sanity remains USD for canonical pricing.

const webPackageGroups = [
  {
    key: { _type: 'slug', current: 'website-packages' },
    name: 'Website Packages',
    description: 'Landing page, Business website, E-commerce and custom web app packages with per-package tiers.',
    tiers: [
      {
        name: 'Landing Page — Basic',
        tier: 'basic',
        price: 229,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '3-7 days',
        features: [
          'Single Page Design',
          'Mobile Responsive',
          'Contact Form',
          'Basic SEO Setup',
          '2 Revision Rounds'
        ],
        popular: false
      },
      {
        name: 'Business Website — Standard',
        tier: 'standard',
        price: 429,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '7-14 days',
        features: [
          'Up to 6 Pages',
          'Mobile Responsive Design',
          'Basic CMS',
          'SEO Optimization',
          '3 Revision Rounds'
        ],
        popular: true
      },
      {
        name: 'E-commerce Store — Premium',
        tier: 'premium',
        price: 729,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '10-21 days',
        features: [
          'Payment Gateway Integration',
          'Inventory Management',
          'Order Management System',
          'Mobile Responsive',
          'Basic Analytics'
        ],
        popular: false
      },
      {
        name: 'Custom Web App — Enterprise',
        tier: 'enterprise',
        price: 1079,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4-8 weeks',
        features: [
          'Custom feature development',
          'API & third-party integrations',
          'Authentication & user roles',
          'Database design & setup'
        ],
        popular: false
      }
    ]
  }
]

const mobilePackageGroups = [
  {
    key: { _type: 'slug', current: 'mobile-app-packages' },
    name: 'Mobile App Packages',
    description: 'Simple to Enterprise mobile app packages with per-package tiers.',
    tiers: [
      {
        name: 'Simple Mobile App — Basic',
        tier: 'basic',
        price: 5000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '4-6 weeks',
        features: [
          'Cross-platform development',
          'Up to 8 screens',
          'Basic UI',
          'Local data storage'
        ],
        popular: false
      },
      {
        name: 'Business Mobile App — Standard',
        tier: 'standard',
        price: 12000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '8-10 weeks',
        features: [
          'Native development',
          'Unlimited screens',
          'Custom UI/UX',
          'User authentication'
        ],
        popular: true
      },
      {
        name: 'Enterprise Mobile Solution — Enterprise',
        tier: 'enterprise',
        price: 25000,
        currency: 'USD',
        billing: 'one_time',
        deliveryTime: '12-16 weeks',
        features: [
          'Advanced business logic',
          'Enterprise security',
          'Scalable infrastructure',
          'DevOps & CI/CD'
        ],
        popular: false
      }
    ]
  }
]

async function run() {
  console.log('Starting Sanity packageGroups push (DRY-RUN by default).')
  console.log('To execute, set SANITY_API_TOKEN in your environment.')

  // Provide a clear list of intended patches
  console.log('\nPlanned updates:')
  console.log('- web-and-mobile-software-development -> 1 group (website-packages)')
  console.log('- mobile-app-development -> 1 group (mobile-app-packages)')

  // If no token, stop here
  if (!process.env.SANITY_API_TOKEN) {
    console.log('\nSANITY_API_TOKEN is not set. Exiting without making changes.')
    return
  }

  // Patch web-and-mobile page
  await patchBySlug('web-and-mobile-software-development', webPackageGroups)

  // Patch mobile app page (slug used in sample data)
  await patchBySlug('mobile-app-development', mobilePackageGroups)

  console.log('\nDone. Please verify changes in Sanity Studio.')
}

run().catch(err => {
  console.error('Unexpected error:', err)
  process.exit(1)
})
