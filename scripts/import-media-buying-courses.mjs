#!/usr/bin/env node
/**
 * Import media buying & advertising courses (Foundation, Specialist, Strategist series).
 * - Upserts courses into Sanity under School of Growth & Marketing (creates the school if missing).
 * - Sets full course metadata (body, pricing, durations, SEO).
 * - Generates OG images on-the-fly (logo, QR code, left overlay) and reuses the same asset for mainImage/ogImage/seo.image.
 *
 * Pricing rule (per instruction): hourly = monthly / 4.
 */
import { createClient } from '@sanity/client'
import dotenv from 'dotenv'
import path from 'node:path'
import { fileURLToPath } from 'node:url'
import fs from 'node:fs'
import puppeteer from 'puppeteer'
import QRCode from 'qrcode'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

dotenv.config({ path: path.join(__dirname, '..', '.env.local') })

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_PROJECT_ID
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET || process.env.SANITY_DATASET || 'production'
const token = process.env.SANITY_API_TOKEN

if (!token) {
  console.error('❌ SANITY_API_TOKEN is required to run this import script.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2024-12-01', token, useCdn: false })

const SCHOOL_TITLE = 'School of Growth & Marketing'
const SCHOOL_SLUG = 'growth-marketing'
const WIDTH = 1200
const HEIGHT = 630

function slugify(title) {
  return title.toLowerCase().replace(/[^a-z0-9\s-]/g, '').trim().replace(/\s+/g, '-')
}

function createBlock(text, style = 'normal') {
  return { _type: 'block', style, markDefs: [], children: [{ _type: 'span', marks: [], text }] }
}

function buildBody(course) {
  return [
    createBlock(course.description, 'blockquote'),
    createBlock('Who This Course Is For', 'h3'),
    createBlock(course.audience),
    createBlock("What You'll Learn", 'h3'),
    ...course.learnItems.map(item => createBlock(item)),
    createBlock('Course Outline', 'h3'),
    ...course.modules.map(mod => createBlock(mod)),
  ]
}

let LOGO_SVG = ''
try {
  LOGO_SVG = fs.readFileSync(path.resolve(__dirname, '..', 'public/hexadigitall-logo-transparent.svg'), 'utf8')
} catch (e) {
  try {
    LOGO_SVG = fs.readFileSync(path.resolve(__dirname, '..', 'public/hexadigitall-logo.svg'), 'utf8')
  } catch {}
}

function escapeHtml(str = '') {
  return String(str)
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
}

function cardHTML({ title, label, buttonText, qrCodeDataUri = '' }) {
  const qrHtml = qrCodeDataUri
    ? `<img src="${qrCodeDataUri}" class="qr-code" alt="QR Code" aria-hidden="true" />`
    : ''

  return `<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(title)} | Hexadigitall</title>
  <style>
    * { box-sizing: border-box; }
    html, body { margin: 0; padding: 0; }
    body {
      width: ${WIDTH}px; height: ${HEIGHT}px;
      font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, 'Helvetica Neue', Arial, 'Noto Sans', 'Liberation Sans', sans-serif;
      color: #fff;
      background: linear-gradient(135deg, #0a203d 0%, #14305a 35%, #0b1d36 100%);
      background-attachment: fixed;
    }
    .card { position: relative; width: 100%; height: 100%; display: flex; align-items: center; }
    .content-overlay {
      position: absolute; left: 0; bottom: 0; width: 48%; background: rgba(8, 16, 32, 0.9);
      backdrop-filter: blur(2px); padding: 32px 40px; display: flex; flex-direction: column; gap: 12px;
    }
    .label { font-size: 11px; font-weight: 800; letter-spacing: 1.5px; color: #00d9ff; text-transform: uppercase; }
    .title { font-weight: 800; font-size: 36px; line-height: 1.2; margin: 0; }
    .button { display: inline-flex; align-items: center; justify-content: center; background: #00d9ff; color: #0a1428;
      padding: 10px 22px; border-radius: 6px; font-weight: 800; font-size: 13px; letter-spacing: 0.5px; text-transform: uppercase; border: none; }
    .logo { position: absolute; top: 20px; right: 24px; width: 140px; opacity: 0.95; }
    .logo svg { width: 100%; height: auto; display: block; }
    .brand { position: absolute; top: 22px; right: 180px; color: #00d9ff; opacity: 0.9; font-weight: 700; letter-spacing: 1px; font-size: 12px; }
    .qr-code { position: absolute; bottom: 28px; right: 28px; width: 120px; height: 120px; border-radius: 8px; border: 2px solid rgba(0, 217, 255, 0.3); opacity: 0.95; }
  </style>
</head>
<body>
  <div class="card">
    ${LOGO_SVG ? `<div class="logo">${LOGO_SVG}</div>` : ''}
    <div class="brand">HEXADIGITALL.COM</div>
    ${qrHtml}
    <div class="content-overlay">
      <div class="label">${escapeHtml(label)}</div>
      <h1 class="title">${escapeHtml(title)}</h1>
      <button class="button">Enroll Now</button>
    </div>
  </div>
</body>
</html>`
}

async function generateQRCodeUri(text) {
  try {
    return await QRCode.toDataURL(text, {
      errorCorrectionLevel: 'M',
      type: 'image/png',
      width: 180,
      margin: 1,
      color: { dark: '#00d9ff', light: '#ffffff' },
    })
  } catch (err) {
    console.warn('QR code generation failed:', err.message)
    return ''
  }
}

async function getOrCreateSchool() {
  const existing = await client.fetch(`*[_type == "school" && title == $title][0]{ _id, title }`, { title: SCHOOL_TITLE })
  if (existing?._id) return existing._id

  const slug = SCHOOL_SLUG
  const created = await client.create({
    _type: 'school',
    title: SCHOOL_TITLE,
    slug: { current: slug },
    description: 'Growth, marketing, advertising, and media buying programs.',
  })
  console.log(`🏫 Created school: ${SCHOOL_TITLE}`)
  return created._id
}

async function generateOgAsset(browser, course, slug) {
  const page = await browser.newPage()
  const qrUrl = `https://www.hexadigitall.com/courses/${slug}`
  const qrCodeUri = await generateQRCodeUri(qrUrl)
  const label = `${course.series} Series`
  const html = cardHTML({ title: course.title, label, buttonText: 'Enroll Now', qrCodeDataUri: qrCodeUri })

  await page.setViewport({ width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 })
  await page.setContent(html, { waitUntil: 'domcontentloaded' })
  const buffer = await page.screenshot({ type: 'jpeg', quality: 90 })
  await page.close()

  const filename = `course-${slug}.jpg`
  const asset = await client.assets.upload('image', buffer, { filename, contentType: 'image/jpeg' })
  return asset
}

const COURSES = [
  // Foundation Series
  {
    series: 'Foundation',
    title: 'AdSense 101: Approval Blueprint',
    summary: 'Get monetized fast: policies, content strategy, and approval tactics tailored for small businesses and creators.',
    description: 'Bridge the gap between traffic and revenue. Learn exactly how to prepare your site for AdSense approval, avoid policy violations, and set up monetization correctly.',
    audience: 'Bloggers, niche site owners, and small businesses wanting fast AdSense approval.',
    monthlyNGN: 40000,
    monthlyUSD: 35,
    level: 'Beginner',
    learnItems: [
      '✅ Policy-safe site setup and structure',
      '✅ Content and traffic requirements that get approvals',
      '✅ Navigation, privacy, and compliance essentials',
      '✅ Monetization settings that prevent limited ads',
      '✅ Pre-launch checklist to pass on first attempt',
    ],
    modules: [
      'Module 1: AdSense Fundamentals & Compliance',
      'Module 2: Content & Traffic Requirements',
      'Module 3: Policy-Safe Site Architecture',
      'Module 4: Approval Checklist & Submission',
    ],
  },
  {
    series: 'Foundation',
    title: 'Google Search Ads Boot Camp',
    summary: 'Launch profitable search campaigns fast: keywords, match types, ad copy, and conversion tracking.',
    description: 'Learn paid search from zero: structure campaigns, pick intent-driven keywords, write high-CTR ads, and track conversions that prove ROI.',
    audience: 'Business owners and junior marketers needing fast wins with paid search.',
    monthlyNGN: 50000,
    monthlyUSD: 45,
    level: 'Beginner',
    learnItems: [
      '✅ Campaign structure that lowers CPC',
      '✅ Keyword research with match-type strategy',
      '✅ High-CTR ad copy and extensions',
      '✅ Conversion tracking and QA',
      '✅ Launch, optimize, and scale playbook',
    ],
    modules: [
      'Module 1: Search Ads Fundamentals',
      'Module 2: Keywords, Match Types, and Intent',
      'Module 3: Writing Winning Ads & Extensions',
      'Module 4: Tracking, QA, and Go-Live',
    ],
  },
  {
    series: 'Foundation',
    title: 'Meta Ads for Local Business',
    summary: 'Run profitable local campaigns with Meta Ads Manager: geotargeting, offers, and budget control.',
    description: 'Focus on ROI for local businesses: build offer-driven ads, set correct geos, pick placements, and report results clients understand.',
    audience: 'Freelancers and small business owners running local lead-gen.',
    monthlyNGN: 45000,
    monthlyUSD: 39,
    level: 'Beginner',
    learnItems: [
      '✅ Local offer design and creative angles',
      '✅ Geotargeting, placements, and budgeting',
      '✅ Lead forms vs. landing pages: when to use each',
      '✅ Conversion and lead quality tracking',
      '✅ Weekly optimization and reporting cadence',
    ],
    modules: [
      'Module 1: Local Offers & Messaging',
      'Module 2: Targeting, Placements, and Budgets',
      'Module 3: Creatives for Local ROI',
      'Module 4: Tracking, Optimization, Reporting',
    ],
  },
  {
    series: 'Foundation',
    title: 'Canva for Ad Creatives',
    summary: 'Design high-converting ads in Canva: hooks, layouts, and export standards for every platform.',
    description: 'Skip complex tools. Learn how to build scroll-stopping ad creatives in Canva with the right specs, hooks, and CTAs for paid campaigns.',
    audience: 'Business owners and marketers who need fast, effective creatives without a design team.',
    monthlyNGN: 35000,
    monthlyUSD: 29,
    level: 'Beginner',
    learnItems: [
      '✅ Ad formats and specs for Meta, Google, TikTok, YouTube',
      '✅ Hook-first creative frameworks',
      '✅ Typography, color, and contrast for conversions',
      '✅ Export settings to keep quality sharp',
      '✅ Creative testing checklist',
    ],
    modules: [
      'Module 1: Ad Formats, Sizes, and Specs',
      'Module 2: Creative Frameworks that Sell',
      'Module 3: Building in Canva (Hands-on)',
      'Module 4: Exports, Variations, and Testing',
    ],
  },
  {
    series: 'Foundation',
    title: 'Intro to Digital Media Buying',
    summary: 'Understand the business of buying attention: channels, pricing models, and measurement.',
    description: 'A theory-first course on media buying economics. Learn CPM/CPC/CPA models, auction dynamics, and how agencies price and report.',
    audience: 'Beginners who want a strategic overview before spending on ads.',
    monthlyNGN: 50000,
    monthlyUSD: 49,
    level: 'Beginner',
    learnItems: [
      '✅ How ad auctions and pricing models work',
      '✅ Channel mix: search, social, video, programmatic',
      '✅ Budget planning and pacing',
      '✅ Measurement, attribution, and incrementality',
      '✅ Agency vs. in-house operating models',
    ],
    modules: [
      'Module 1: Media Buying Economics',
      'Module 2: Channels and Auction Dynamics',
      'Module 3: Budgeting and Pacing',
      'Module 4: Measurement and Attribution Basics',
    ],
  },

  // Specialist Series
  {
    series: 'Specialist',
    title: 'AdSense Traffic & Revenue',
    summary: 'Scale AdSense earnings: traffic acquisition, RPM lift, and compliance while you grow.',
    description: 'Go beyond approval. Learn traffic playbooks, RPM optimization, and risk management so monetization grows without policy hits.',
    audience: 'Publishers and SEO-focused marketers wanting higher AdSense revenue.',
    monthlyNGN: 90000,
    monthlyUSD: 79,
    level: 'Intermediate',
    learnItems: [
      '✅ Traffic sources that keep RPM high',
      '✅ Layout and ad density best practices',
      '✅ Policy-safe experimentation',
      '✅ RPM uplift levers (topics, regions, devices)',
      '✅ Monthly reporting and forecasting',
    ],
    modules: [
      'Module 1: Traffic & RPM Foundations',
      'Module 2: Layouts, Density, and UX',
      'Module 3: Safe Growth Experiments',
      'Module 4: Reporting & Forecasting',
    ],
  },
  {
    series: 'Specialist',
    title: 'TikTok & Reels Ad Strategy',
    summary: 'Paid short-form ads that convert: UGC briefs, hooks, targeting, and creative iteration.',
    description: 'Design, launch, and iterate short-form video ads for TikTok and IG Reels. Learn UGC sourcing, editing angles, and performance-driven targeting.',
    audience: 'Freelancers and junior media buyers adding paid short-form video to their stack.',
    monthlyNGN: 85000,
    monthlyUSD: 75,
    level: 'Intermediate',
    learnItems: [
      '✅ UGC brief templates and creator sourcing',
      '✅ Hook and storyline formulas for 15–30s ads',
      '✅ Targeting, placements, and budgets that pass learning',
      '✅ Creative iteration and win-rate tracking',
      '✅ Reporting short-form results to clients',
    ],
    modules: [
      'Module 1: UGC Briefs and Sourcing',
      'Module 2: Hooks, Angles, and Storyboards',
      'Module 3: Launching and Passing Learning',
      'Module 4: Iteration and Reporting',
    ],
  },
  {
    series: 'Specialist',
    title: 'Copywriting for Direct Response',
    summary: 'Write copy that sells: landing pages, sales letters, VSL scripts, and high-converting CTAs.',
    description: 'Hands-on direct response writing. Learn research, offers, frameworks (AIDA, PAS), and editing for clarity and conversion.',
    audience: 'Junior marketers and freelancers who need to ship sales-focused copy fast.',
    monthlyNGN: 80000,
    monthlyUSD: 69,
    level: 'Intermediate',
    learnItems: [
      '✅ Offer research and promise crafting',
      '✅ Headlines, leads, and body copy frameworks',
      '✅ Landing pages, emails, and VSL scripts',
      '✅ Objection handling and risk reversal',
      '✅ Editing for clarity, speed, and voice',
    ],
    modules: [
      'Module 1: Research and Offer Craft',
      'Module 2: Headlines, Leads, and CTAs',
      'Module 3: Pages, Emails, and VSLs',
      'Module 4: Objections, Risk, and Editing',
    ],
  },
  {
    series: 'Specialist',
    title: 'YouTube Ads Manager',
    summary: 'Master video ads: audience research, creative scripts, placements, and measurement for YouTube.',
    description: 'Launch and scale YouTube campaigns. Learn audience strategy, skippable vs. non-skippable formats, scripts, and conversion tracking.',
    audience: 'Media buyers expanding into video performance.',
    monthlyNGN: 95000,
    monthlyUSD: 85,
    level: 'Intermediate',
    learnItems: [
      '✅ Audience and intent strategy for YouTube',
      '✅ Script and storyboard templates for performance',
      '✅ Campaign setup: formats, bids, and placements',
      '✅ Conversion tracking and safety controls',
      '✅ Optimization cadence and scaling signals',
    ],
    modules: [
      'Module 1: YouTube Audience Strategy',
      'Module 2: Scripts, Storyboards, and Creatives',
      'Module 3: Campaign Setup and Placements',
      'Module 4: Measurement and Optimization',
    ],
  },

  // Strategist Series
  {
    series: 'Strategist',
    title: 'AdSense Arbitrage (Pro)',
    summary: 'Advanced arbitrage systems: traffic acquisition, RPM maximization, and risk controls for scale.',
    description: 'Design a high-reward AdSense arbitrage machine. Learn traffic buying, RPM lifts, compliance guardrails, and cashflow modeling.',
    audience: 'Agency owners and senior buyers building arbitrage portfolios.',
    monthlyNGN: 130000,
    monthlyUSD: 119,
    level: 'Advanced',
    learnItems: [
      '✅ Arbitrage math and cashflow modeling',
      '✅ Traffic sourcing with compliance safeguards',
      '✅ RPM optimization and layout testing',
      '✅ Scaling without policy flags',
      '✅ Portfolio dashboards and risk management',
    ],
    modules: [
      'Module 1: Arbitrage Economics and Models',
      'Module 2: Traffic Sourcing and QA',
      'Module 3: RPM Lift and Layout Testing',
      'Module 4: Scaling, Dashboards, Risk',
    ],
  },
  {
    series: 'Strategist',
    title: 'Server-Side Tracking (CAPI)',
    summary: 'Implement server-side tracking: Meta CAPI, GA4 server tags, and lossless attribution setup.',
    description: 'Technical implementation course: set up server-side tags, CAPI gateways, and data validation to fix attribution loss.',
    audience: 'Senior buyers and technical marketers needing resilient tracking.',
    monthlyNGN: 120000,
    monthlyUSD: 109,
    level: 'Advanced',
    learnItems: [
      '✅ Server-side tagging architectures',
      '✅ Meta CAPI setup and validation',
      '✅ GA4 server container deployment',
      '✅ Data quality, deduplication, and QA',
      '✅ Monitoring, alerting, and rollbacks',
    ],
    modules: [
      'Module 1: Server-Side Tagging Foundations',
      'Module 2: Meta CAPI Implementation',
      'Module 3: GA4 Server Containers',
      'Module 4: QA, Monitoring, and Resilience',
    ],
  },
  {
    series: 'Strategist',
    title: 'Amazon & Retail Media Networks',
    summary: 'Win on retail media: Amazon Ads, Walmart Connect, and performance metrics that matter.',
    description: 'Enter retail media with confidence. Learn ad types, bidding, retail-specific metrics, and optimization for marketplace ROI.',
    audience: 'E-commerce media buyers and agency leads expanding to retail networks.',
    monthlyNGN: 125000,
    monthlyUSD: 115,
    level: 'Advanced',
    learnItems: [
      '✅ Amazon/Walmart ad types and placements',
      '✅ Retail KPIs: ROAS, TACoS, share of voice',
      '✅ Catalog, PDP, and reviews as ad levers',
      '✅ Bid, budget, and placement optimization',
      '✅ Retail reporting and client communication',
    ],
    modules: [
      'Module 1: Retail Media Landscape',
      'Module 2: Ad Types, Formats, and KPIs',
      'Module 3: Optimization for Retail Outcomes',
      'Module 4: Reporting and Growth Plans',
    ],
  },
  {
    series: 'Strategist',
    title: 'Programmatic Advertising & RTB',
    summary: 'Corporate-grade media buying: DSP setup, RTB auctions, deals, and brand safety.',
    description: 'Master programmatic: choose a DSP, configure inventory, build PMPs, and enforce brand safety and measurement.',
    audience: 'Agency owners and senior media buyers moving into programmatic.',
    monthlyNGN: 140000,
    monthlyUSD: 129,
    level: 'Advanced',
    learnItems: [
      '✅ How RTB and DSPs work under the hood',
      '✅ Inventory sourcing, PMPs, and deals',
      '✅ Brand safety, viewability, and fraud controls',
      '✅ Measurement and lift testing',
      '✅ Team workflows and governance',
    ],
    modules: [
      'Module 1: RTB Fundamentals and DSP Setup',
      'Module 2: Inventory, Deals, and PMPs',
      'Module 3: Safety, Quality, and Fraud Prevention',
      'Module 4: Measurement, Lift, and Governance',
    ],
  },
]

async function upsertCourse(browser, schoolId, course, order) {
  const slug = slugify(course.title)
  const existing = await client.fetch(`*[_type == "course" && slug.current == $slug][0]{ _id }`, { slug })

  const hourlyRateNGN = Math.round(course.monthlyNGN / 4)
  const hourlyRateUSD = Number((course.monthlyUSD / 4).toFixed(2))

  const body = buildBody(course)
  const ogTitle = course.title
  const ogDescription = course.summary

  const asset = await generateOgAsset(browser, course, slug)
  const imageRef = { _type: 'image', asset: { _type: 'reference', _ref: asset._id } }

  const doc = {
    _type: 'course',
    title: course.title,
    slug: { current: slug },
    order: order * 10,
    school: { _type: 'reference', _ref: schoolId },
    summary: course.summary,
    description: course.description,
    body,
    courseType: 'live',
    billingType: 'monthly',
    hourlyRateNGN,
    hourlyRateUSD,
    level: course.level,
    durationWeeks: course.level === 'Beginner' ? 6 : course.level === 'Intermediate' ? 8 : 10,
    hoursPerWeek: course.level === 'Beginner' ? 2 : 3,
    duration: course.level === 'Beginner' ? '6 weeks • 2 hrs/week' : course.level === 'Intermediate' ? '8 weeks • 3 hrs/week' : '10 weeks • 3 hrs/week',
    modules: course.modules.length,
    lessons: course.modules.length * 3,
    instructor: 'Hexadigitall Mentor',
    featured: true,
    ogTitle,
    ogDescription,
    ogImage: imageRef,
    mainImage: imageRef,
    seo: { title: ogTitle, description: ogDescription, image: imageRef },
  }

  if (existing?._id) {
    await client.patch(existing._id).set(doc).commit()
    console.log(`🔁 Updated course: ${course.title}`)
    return existing._id
  }

  const created = await client.create(doc)
  console.log(`✅ Created course: ${course.title}`)
  return created._id
}

async function run() {
  const schoolId = await getOrCreateSchool()
  console.log(`🏫 Target school: ${SCHOOL_TITLE} (${schoolId})`)

  const browser = await puppeteer.launch({
    headless: 'new',
    defaultViewport: { width: WIDTH, height: HEIGHT, deviceScaleFactor: 2 },
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
  })

  try {
    const results = []
    for (let i = 0; i < COURSES.length; i++) {
      const id = await upsertCourse(browser, schoolId, COURSES[i], i + 1)
      results.push({ title: COURSES[i].title, id })
    }

    console.log('\n🎉 Import complete. Summary:')
    results.forEach((r, idx) => console.log(` ${idx + 1}. ${r.title} → ${r.id}`))
  } catch (err) {
    console.error('❌ Import failed:', err)
    process.exit(1)
  } finally {
    await browser.close()
  }
}

await run()
