#!/usr/bin/env node
// scripts/validate-service-data.js
// Run validation checks on service category data in Sanity.
// Use before/after migration to verify data integrity.

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

async function validateTier(tier) {
  const issues = []
  if (!tier.name) issues.push('Missing tier name')
  if (!tier.tier || !['basic', 'standard', 'premium', 'enterprise'].includes(tier.tier)) {
    issues.push(`Invalid tier value: ${tier.tier}`)
  }
  if (typeof tier.price !== 'number' || tier.price <= 0) {
    issues.push(`Invalid price: ${tier.price}`)
  }
  if (!tier.currency) issues.push('Missing currency')
  if (!tier.billing) issues.push('Missing billing type')
  if (!Array.isArray(tier.features)) issues.push('Missing features array')
  return issues
}

async function validateGroup(group) {
  const issues = []
  if (!group.key?.current) issues.push('Missing group key')
  if (!group.name) issues.push('Missing group name')
  if (!Array.isArray(group.tiers)) {
    issues.push('Missing tiers array')
  } else {
    group.tiers.forEach((tier, i) => {
      const tierIssues = validateTier(tier)
      if (tierIssues.length > 0) {
        issues.push(`Tier ${i} (${tier.name || 'unnamed'}) issues:`)
        issues.push(...tierIssues.map(i => `  - ${i}`))
      }
    })
  }
  return issues
}

async function validateStatistics(stats) {
  const issues = []
  if (!stats.metrics) {
    issues.push('Missing metrics object')
  } else {
    const required = ['projectsCompleted', 'clientSatisfaction', 'averageDeliveryTime']
    required.forEach(field => {
      if (!stats.metrics[field]) issues.push(`Missing required metric: ${field}`)
    })
  }
  return issues
}

async function run() {
  console.log('Validating service category data in Sanity')
  
  const categories = await client.fetch(`*[_type == "serviceCategory"]{
    _id, title, slug, packages, packageGroups, statistics->, testimonials[]->
  }`)
  console.log(`\nFound ${categories.length} service categories to validate\n`)

  let hasIssues = false
  for (const cat of categories) {
    const slug = (cat.slug && cat.slug.current) || cat.title || cat._id
    const issues = []

    // Check packageGroups when present
    if (Array.isArray(cat.packageGroups)) {
      cat.packageGroups.forEach((group, i) => {
        const groupIssues = validateGroup(group)
        if (groupIssues.length > 0) {
          issues.push(`Package group ${i} (${group.name || 'unnamed'}) issues:`)
          issues.push(...groupIssues.map(i => `  - ${i}`))
        }
      })
    } else if (!Array.isArray(cat.packages) || cat.packages.length === 0) {
      issues.push('No packageGroups or legacy packages found')
    }

    // Check statistics when present
    if (cat.statistics) {
      const statsIssues = validateStatistics(cat.statistics)
      if (statsIssues.length > 0) {
        issues.push('Statistics issues:')
        issues.push(...statsIssues.map(i => `  - ${i}`))
      }
    }

    if (issues.length > 0) {
      hasIssues = true
      console.log(`❌ ${slug} has ${issues.length} issue(s):`)
      issues.forEach(i => console.log(`   ${i}`))
      console.log()
    } else {
      console.log(`✅ ${slug} validates successfully`)
    }
  }

  if (hasIssues) {
    console.log('\n⚠️ Some documents need attention (see issues above)')
    process.exit(1)
  } else {
    console.log('\n🎉 All service categories validate successfully')
  }
}

run().catch(err => {
  console.error('Unexpected error during validation:', err)
  process.exit(1)
})