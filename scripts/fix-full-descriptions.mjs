import dotenv from 'dotenv'
import { createClient } from '@sanity/client'

// Usage:
// Dry run (no changes): node scripts/fix-full-descriptions.mjs
// Apply changes: APPLY=1 node scripts/fix-full-descriptions.mjs

dotenv.config({ path: './.env.local' })

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID,
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET,
  apiVersion: '2024-08-30',
  useCdn: false,
  token: process.env.SANITY_API_TOKEN,
})

function createBlock(text, style = 'normal') {
  return {
    _type: 'block',
    style,
    markDefs: [],
    children: [
      { _type: 'span', text }
    ],
  }
}

function createBullet(text) {
  return {
    _type: 'block',
    style: 'normal',
    listItem: 'bullet',
    level: 1,
    markDefs: [],
    children: [{ _type: 'span', text }],
  }
}

function inferAudience(schoolTitle) {
  const s = (schoolTitle || '').toLowerCase()
  if (s.includes('design')) return 'Creative professionals, freelancers, marketers, and anyone wanting to create professional design assets.'
  if (s.includes('cloud')) return 'System administrators, developers, and aspiring cloud engineers.'
  if (s.includes('cyber')) return 'Security enthusiasts, IT professionals, and aspiring cybersecurity analysts.'
  if (s.includes('data')) return 'Developers, analysts, and aspiring AI engineers.'
  if (s.includes('coding') || s.includes('software')) return 'Beginners, career switchers, and developers upgrading their skills.'
  if (s.includes('infrastructure')) return 'Aspiring network engineers and IT support professionals.'
  if (s.includes('growth') || s.includes('marketing')) return 'Entrepreneurs, marketing managers, and content creators.'
  if (s.includes('fundamentals')) return 'Absolute beginners seeking digital literacy and productivity.'
  if (s.includes('executive')) return 'Project managers, team leads, and executives driving transformation.'
  return 'Learners seeking practical, job-ready skills with mentorship.'
}

function buildBody(course, schoolTitle) {
  const title = course.title || 'This Course'
  const summary = course.summary || course.shortDescription || ''
  const description = course.description || ''
  const modules = Array.isArray(course.modules) ? course.modules : []

  const introText = summary || description || `Learn ${title} with practical, mentorship-driven training.`

  const learnBullets = []
  // Derive learn bullets from modules when possible, else use generic
  if (modules.length > 0) {
    for (const m of modules.slice(0, 6)) {
      const mTitle = typeof m === 'string' ? m : (m?.title || m?.name || '')
      if (mTitle) learnBullets.push(`✅ ${mTitle}`)
    }
  }
  if (learnBullets.length < 4) {
    // Add generic bullets to reach 6-8 items
    const generic = [
      '✅ Hands-on projects to build practical skills',
      '✅ Industry best practices and workflows',
      '✅ Tools and frameworks used by professionals',
      '✅ Guidance to build a job-ready portfolio',
      '✅ Mentorship and feedback for faster growth',
    ]
    for (const g of generic) {
      if (learnBullets.length >= 7) break
      learnBullets.push(g)
    }
  }

  const outlineBlocks = []
  if (modules.length > 0) {
    let i = 1
    for (const m of modules.slice(0, 6)) {
      const mTitle = typeof m === 'string' ? m : (m?.title || m?.name || '')
      if (mTitle) outlineBlocks.push(createBlock(`Module ${i}: ${mTitle}`))
      i++
    }
  } else {
    // Use description-derived fallback
    const base = [
      'Module 1: Fundamentals',
      'Module 2: Core Concepts',
      'Module 3: Tools & Workflows',
      'Module 4: Projects & Portfolio',
    ]
    for (const line of base) outlineBlocks.push(createBlock(line))
  }

  const body = [
    createBlock(introText, 'blockquote'),
    createBlock('Who This Course Is For', 'h3'),
    createBlock(inferAudience(schoolTitle)),
    createBlock("What You'll Learn", 'h3'),
    ...learnBullets.map(createBullet),
    createBlock('Course Outline', 'h3'),
    ...outlineBlocks,
  ]

  return body
}

function hasProperFormat(body) {
  if (!Array.isArray(body) || body.length < 6) return false
  const textOf = idx => body[idx]?.children?.[0]?.text?.toLowerCase?.() || ''
  const headings = body.filter(b => b.style === 'h3').map(b => b.children?.[0]?.text?.toLowerCase?.())
  const hasWho = headings.includes('who this course is for')
  const hasLearn = headings.includes("what you'll learn")
  const hasOutline = headings.includes('course outline')
  const hasBullets = body.some(b => b.listItem === 'bullet')
  return hasWho && hasLearn && hasOutline && hasBullets
}

async function main() {
  console.log('\n🧹 Fixing Full Descriptions (Portable Text)')

  const schools = await client.fetch(`*[_type == "school"] { _id, title }`)
  const schoolById = new Map(schools.map(s => [s._id, s.title]))

  const courses = await client.fetch(`*[_type == "course"] { _id, title, summary, description, modules, school, body }`)

  const needsFix = []
  for (const c of courses) {
    const ok = hasProperFormat(c?.body)
    if (!ok) needsFix.push(c)
  }

  console.log(`Found ${needsFix.length} courses needing formatting.`)
  needsFix.slice(0, 10).forEach(c => console.log(`  • ${c.title}`))
  if (needsFix.length > 10) console.log(`  ...and ${needsFix.length - 10} more`)

  if (process.env.APPLY !== '1') {
    console.log('\nDRY RUN — set APPLY=1 to write changes')
    return
  }

  let updated = 0
  for (const c of needsFix) {
    const schoolTitle = schoolById.get(c.school?._ref) || ''
    const body = buildBody(c, schoolTitle)
    await client.patch(c._id).set({ body }).commit()
    updated++
    console.log(`✅ Updated: ${c.title}`)
  }

  console.log(`\n✅ Completed. Updated ${updated} courses.`)
}

main().catch(err => { console.error(err); process.exit(1) })
