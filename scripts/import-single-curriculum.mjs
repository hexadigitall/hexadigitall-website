/**
 * One-off import for a single curriculum HTML file to Sanity.
 * Usage:
 *   node scripts/import-single-curriculum.mjs <html-filename> <course-slug>
 * Example:
 *   node scripts/import-single-curriculum.mjs curriculum-devops-engineering-cloud-infrastructure-core.html devops-engineering-cloud-infrastructure-core
 */
import fs from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import { createClient } from '@sanity/client'
import * as cheerio from 'cheerio'

for (const envPath of ['.env.local', '.env.production.local', '.env.production', '.env']) {
  dotenv.config({ path: envPath, override: false })
}

const [,, htmlFilename, courseSlug] = process.argv

if (!htmlFilename || !courseSlug) {
  console.error('Usage: node scripts/import-single-curriculum.mjs <html-filename> <course-slug>')
  process.exit(1)
}

const token = process.env.SANITY_API_TOKEN
if (!token) {
  console.error('Missing SANITY_API_TOKEN.')
  process.exit(1)
}

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30',
  token,
  useCdn: false,
})

function makeKey(seed) {
  return seed.toLowerCase().replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 80)
}

function collapseText(value) {
  return value.replace(/\s+/g, ' ').trim()
}

function dedupeSequential(values) {
  const output = []
  for (const value of values) {
    if (!value) continue
    if (output[output.length - 1] === value) continue
    output.push(value)
  }
  return output
}

function getMetaValue($, label) {
  const match = $('.course-meta .meta-item')
    .toArray()
    .map((node) => collapseText($(node).text()))
    .find((item) => item.toLowerCase().startsWith(`${label.toLowerCase()}:`))
  if (!match) return undefined
  return match.split(':').slice(1).join(':').trim() || undefined
}

function getSection($, title) {
  return $('section, div').filter((_, node) => {
    const heading = $(node).find('h2, h3').first().text()
    return heading.toLowerCase().includes(title.toLowerCase())
  }).first()
}

function parseCurriculum($, filename) {
  const title = collapseText($('header.header h1').first().text()) || collapseText($('title').text()).replace(/ - Course Curriculum.*/, '')
  const subtitle = collapseText($('header.header .subtitle').first().text())
  const heroSummary = collapseText($('.course-hero p').first().text())
  const heroTags = $('.hero-meta .meta-item').toArray().map((node) => collapseText($(node).text())).filter(Boolean)
  const welcomeTitle = collapseText($('.welcome-section h2').first().text())
  const welcomeMessages = dedupeSequential($('.welcome-section p').toArray().map((node) => collapseText($(node).text())).filter(Boolean))

  const prerequisites = getSection($, 'Prerequisites & What You Should Know').find('li').toArray().map((node) => collapseText($(node).text())).filter(Boolean)
  const complementaryCourses = getSection($, 'Recommended Complementary Courses').find('.resource-item').toArray().map((node, index) => ({
    _key: makeKey(`${filename}-complementary-${index + 1}`),
    title: collapseText($(node).find('h4').text()),
    description: collapseText($(node).find('p').text()),
  })).filter((item) => item.title)
  const essentialResources = getSection($, 'Essential Learning Resources').find('li').toArray().map((node) => collapseText($(node).text())).filter(Boolean)
  const learningRoadmap = getSection($, 'Your Learning Roadmap').find('li').toArray().map((node) => collapseText($(node).text())).filter(Boolean)

  const weeks = $('.week-block').toArray().map((node, index) => {
    const $node = $(node)
    const weekLabel = collapseText($node.find('.week-number').first().text())
    const weekMatch = weekLabel.match(/(\d+)/)
    const topic = collapseText($node.find('.week-topic, .week-title').first().text())

    let outcomes = []
    let labTitle
    let labItems = []

    const weekColumns = $node.find('.week-column').toArray()
    for (const column of weekColumns) {
      const $column = $(column)
      const heading = collapseText($column.find('h4').first().text())
      const headingLower = heading.toLowerCase()
      const items = $column.find('li').toArray().map((item) => collapseText($(item).text())).filter(Boolean)

      if (!items.length) continue

      if (headingLower.includes('hands-on') || headingLower.includes('lab') || headingLower.includes('practical')) {
        labTitle = heading || 'Lab Exercise'
        labItems = items
      } else if (headingLower.includes('concept') || headingLower.includes('outcome') || headingLower.includes('scope')) {
        if (!outcomes.length) outcomes = items
      } else if (!outcomes.length) {
        outcomes = items
      }
    }

    if (!outcomes.length) {
      outcomes = $node.find('.week-content > ul > li').toArray().map((item) => collapseText($(item).text())).filter(Boolean)
    }

    if (!labItems.length) {
      labTitle = labTitle || collapseText($node.find('.lab-section h4').first().text()) || undefined
      labItems = $node.find('.lab-section li').toArray().map((item) => collapseText($(item).text())).filter(Boolean)
    }

    return {
      _key: makeKey(`${filename}-week-${weekMatch ? weekMatch[1] : index + 1}`),
      weekNumber: weekMatch ? parseInt(weekMatch[1], 10) : index + 1,
      duration: collapseText($node.find('.week-duration').first().text()) || undefined,
      topic,
      outcomes,
      labTitle,
      labItems,
    }
  }).filter((week) => week.topic)

  const capstoneProjects = $('.capstone-project, .final-project').toArray().map((node, index) => ({
    _key: makeKey(`${filename}-project-${index + 1}`),
    title: collapseText($(node).find('h4').first().text()),
    description: collapseText($(node).find('p').first().text()) || undefined,
    deliverables: $(node).find('li').toArray().map((item) => collapseText($(item).text())).filter(Boolean),
  })).filter((project) => project.title)

  return {
    title,
    summary: subtitle || heroSummary || undefined,
    heroSummary: heroSummary || undefined,
    heroTags,
    duration: getMetaValue($, 'Duration'),
    level: getMetaValue($, 'Level'),
    studyTime: getMetaValue($, 'Study Time'),
    schoolName: getMetaValue($, 'School'),
    welcomeTitle: welcomeTitle || undefined,
    welcomeMessages,
    prerequisites,
    complementaryCourses,
    essentialResources,
    learningRoadmap,
    weeks,
    capstoneProjects,
  }
}

;(async () => {
  const curriculumDir = path.join(process.cwd(), 'public', 'curriculums')
  const filePath = path.join(curriculumDir, htmlFilename)

  let html
  try {
    html = await fs.readFile(filePath, 'utf8')
  } catch {
    console.error(`File not found: ${filePath}`)
    process.exit(1)
  }

  const course = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{_id, title, slug}`, { slug: courseSlug })
  if (!course) {
    console.error(`No Sanity course found with slug: ${courseSlug}`)
    process.exit(1)
  }

  console.log(`Matched course: ${course.title} (${course.slug.current})`)

  const $ = cheerio.load(html)
  const parsed = parseCurriculum($, htmlFilename)

  const doc = {
    _type: 'curriculum',
    _id: `curriculum-${courseSlug}`,
    title: parsed.title || course.title,
    slug: { _type: 'slug', current: courseSlug },
    course: { _type: 'reference', _ref: course._id },
    summary: parsed.summary,
    heroSummary: parsed.heroSummary,
    heroTags: parsed.heroTags,
    duration: parsed.duration,
    level: parsed.level,
    studyTime: parsed.studyTime,
    schoolName: parsed.schoolName || 'Hexadigitall Academy',
    welcomeTitle: parsed.welcomeTitle,
    welcomeMessages: parsed.welcomeMessages,
    prerequisites: parsed.prerequisites,
    complementaryCourses: parsed.complementaryCourses,
    essentialResources: parsed.essentialResources,
    learningRoadmap: parsed.learningRoadmap,
    weeks: parsed.weeks,
    capstoneProjects: parsed.capstoneProjects,
    sourceHtmlFile: htmlFilename,
    importedAt: new Date().toISOString(),
  }

  await client.createOrReplace(doc)
  console.log(`✓ Imported curriculum for: ${course.slug.current}`)
  console.log(`  Title: ${doc.title}`)
  console.log(`  Weeks: ${parsed.weeks.length}`)
  console.log(`  Prerequisites: ${parsed.prerequisites.length}`)
})()
