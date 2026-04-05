import fs from 'node:fs/promises'
import path from 'node:path'
import dotenv from 'dotenv'
import { createClient } from '@sanity/client'
import * as cheerio from 'cheerio'

for (const envPath of ['.env.local', '.env.production.local', '.env.production', '.env']) {
  dotenv.config({ path: envPath, override: false })
}

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0'
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN
const apiVersion = process.env.NEXT_PUBLIC_SANITY_API_VERSION || '2024-08-30'
const dryRun = process.argv.includes('--dry-run')

if (!token) {
  console.error('Missing SANITY_API_TOKEN. Import cannot continue.')
  process.exit(1)
}

const client = createClient({
  projectId,
  dataset,
  apiVersion,
  token,
  useCdn: false,
})

const curriculumDir = path.join(process.cwd(), 'public', 'curriculums')

function normalize(value) {
  return value
    .toLowerCase()
    .replace(/^curriculum-/, '')
    .replace(/\.html?$/, '')
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '')
}

function tokenize(value) {
  return normalize(value).split('-').filter(Boolean)
}

function overlapScore(a, b) {
  const aSet = new Set(a)
  const bSet = new Set(b)
  let intersection = 0
  for (const token of aSet) {
    if (bSet.has(token)) intersection += 1
  }
  const union = new Set([...aSet, ...bSet]).size
  if (!union) return 0
  return Math.round((intersection / union) * 100)
}

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

  return match ? match.split(':').slice(1).join(':').trim() : undefined
}

function getSection($, title) {
  return $('.section').filter((_, el) => collapseText($(el).find('.section-title').first().text()) === title).first()
}

function parseCourseSlug($, filename) {
  const qrSrc = $('.qr-block img').first().attr('src') || ''
  if (qrSrc.includes('data=')) {
    try {
      const url = new URL(qrSrc)
      const data = url.searchParams.get('data')
      if (data) {
        const decoded = decodeURIComponent(data)
        const match = decoded.match(/\/courses\/([a-z0-9-]+)/i)
        if (match) return match[1].toLowerCase()
      }
    } catch {
      // ignore
    }
  }

  const links = $('a[href*="/courses/"]').toArray()
  for (const link of links) {
    const href = $(link).attr('href') || ''
    const match = href.match(/\/courses\/([a-z0-9-]+)/i)
    if (match) return match[1].toLowerCase()
  }

  return normalize(filename)
}

function parseCurriculum($, filename) {
  const title = collapseText($('header.header h1').first().text()) || collapseText($('title').text()).replace(/ - Course Curriculum.*/, '')
  const subtitle = collapseText($('header.header .subtitle').first().text())
  const heroSummary = collapseText($('.course-hero p').first().text())
  const heroTags = $('.hero-meta .meta-item').toArray().map((node) => collapseText($(node).text())).filter(Boolean)
  const welcomeTitle = collapseText($('.welcome-section h2').first().text())
  const welcomeMessages = dedupeSequential($('.welcome-section p').toArray().map((node) => collapseText($(node).text())).filter(Boolean))

  const prerequisites = getSection($, 'Prerequisites & What You Should Know').find('li').toArray().map((node) => collapseText($(node).text())).filter(Boolean)
  const complementaryCourses = getSection($, 'Recommended Complementary Courses').find('.resource-item').toArray().map((node) => ({
    _key: makeKey(`${$(node).find('h4').text()}-${filename}`),
    title: collapseText($(node).find('h4').text()),
    description: collapseText($(node).find('p').text()),
  })).filter((item) => item.title)
  const essentialResources = getSection($, 'Essential Learning Resources').find('li').toArray().map((node) => collapseText($(node).text())).filter(Boolean)
  const learningRoadmap = getSection($, 'Your Learning Roadmap').find('li').toArray().map((node) => collapseText($(node).text())).filter(Boolean)

  const weeks = $('.week-block').toArray().map((node, index) => {
    const $node = $(node)
    const weekLabel = collapseText($node.find('.week-number').first().text())
    const weekMatch = weekLabel.match(/(\d+)/)
    return {
      _key: makeKey(`${filename}-${index + 1}-${$node.find('.week-topic').first().text()}`),
      weekNumber: weekMatch ? Number(weekMatch[1]) : index + 1,
      duration: collapseText($node.find('.week-duration').first().text()) || undefined,
      topic: collapseText($node.find('.week-topic').first().text()),
      outcomes: $node.find('.week-content > ul > li').toArray().map((item) => collapseText($(item).text())).filter(Boolean),
      labTitle: collapseText($node.find('.lab-section h4').first().text()) || undefined,
      labItems: $node.find('.lab-section li').toArray().map((item) => collapseText($(item).text())).filter(Boolean),
    }
  }).filter((week) => week.topic)

  const capstoneProjects = $('.project-card').toArray().map((node, index) => ({
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

function resolveCourse(courses, filename, parsed, explicitSlug) {
  if (explicitSlug) {
    const exact = courses.find((course) => course.slug?.current === explicitSlug)
    if (exact) return exact
  }

  const targetTokens = tokenize(`${filename} ${parsed.title}`)
  let best = null

  for (const course of courses) {
    const candidateTokens = tokenize(`${course.slug?.current || ''} ${course.title || ''}`)
    let score = overlapScore(targetTokens, candidateTokens)
    if ((course.slug?.current || '') === normalize(filename)) score += 25
    if (normalize(parsed.title) === normalize(course.title || '')) score += 35
    if (!best || score > best.score) {
      best = { course, score }
    }
  }

  return best?.score >= 45 ? best.course : null
}

const courses = await client.fetch(`*[_type == "course"]{_id, title, slug}`)
const entries = (await fs.readdir(curriculumDir, { withFileTypes: true }))
  .filter((entry) => entry.isFile() && entry.name.endsWith('.html'))
  .map((entry) => entry.name)
  .sort()

const unmatched = []
let imported = 0

for (const file of entries) {
  const html = await fs.readFile(path.join(curriculumDir, file), 'utf8')
  const $ = cheerio.load(html)
  const parsed = parseCurriculum($, file)
  const explicitSlug = parseCourseSlug($, file)
  const course = resolveCourse(courses, file, parsed, explicitSlug)

  if (!course) {
    unmatched.push({ file, title: parsed.title, guessedSlug: explicitSlug })
    continue
  }

  const doc = {
    _id: `curriculum.${course.slug.current}`,
    _type: 'curriculum',
    title: parsed.title || course.title,
    slug: { _type: 'slug', current: course.slug.current },
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
    sourceHtmlFile: file,
    importedAt: new Date().toISOString(),
  }

  if (!dryRun) {
    await client.createOrReplace(doc)
  }

  imported += 1
  console.log(`${dryRun ? 'Would import' : 'Imported'} ${file} -> ${course.slug.current}`)
}

console.log(`\nProcessed ${entries.length} curriculum files.`)
console.log(`${dryRun ? 'Matched for import' : 'Imported'}: ${imported}`)

if (unmatched.length) {
  console.log(`Unmatched: ${unmatched.length}`)
  for (const item of unmatched.slice(0, 20)) {
    console.log(` - ${item.file} (${item.title || 'untitled'}) guessed ${item.guessedSlug || 'n/a'}`)
  }
  if (!dryRun) {
    process.exitCode = 1
  }
}
