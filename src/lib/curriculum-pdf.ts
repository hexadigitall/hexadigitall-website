import fs from 'node:fs'
import path from 'node:path'
import type { CurriculumDocument, CurriculumProject, CurriculumWeek } from '@/lib/curriculum-types'

const assetCache = new Map<string, string>()

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(value)
}

function toDataUri(publicPath: string, mimeType: string): string {
  const cached = assetCache.get(publicPath)
  if (cached) return cached

  const absolutePath = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
  const bytes = fs.readFileSync(absolutePath)
  const encoded = `data:${mimeType};base64,${bytes.toString('base64')}`
  assetCache.set(publicPath, encoded)
  return encoded
}

function safeDataUri(publicPath: string, mimeType: string): string {
  try {
    return toDataUri(publicPath, mimeType)
  } catch {
    return ''
  }
}

function renderList(items?: string[]): string {
  if (!items?.length) return ''

  return `<ul>${items
    .map((item) => `<li><span class="bullet"></span><span>${escapeHtml(item)}</span></li>`)
    .join('')}</ul>`
}

function renderWeek(week: CurriculumWeek): string {
  return `
    <article class="week-card">
      <div class="week-head">
        <div>
          <div class="eyebrow">Week ${week.weekNumber}</div>
          <h4>${escapeHtml(week.topic)}</h4>
        </div>
        ${week.duration ? `<div class="chip">${escapeHtml(week.duration)}</div>` : ''}
      </div>
      ${week.outcomes?.length ? `<section><h5>Learning Outcomes</h5>${renderList(week.outcomes)}</section>` : ''}
      ${week.labItems?.length ? `<section class="lab-box"><h5>${escapeHtml(week.labTitle || 'Lab Exercise')}</h5>${renderList(week.labItems)}</section>` : ''}
    </article>
  `
}

function renderProject(project: CurriculumProject): string {
  return `
    <article class="project-card">
      <h4>${escapeHtml(project.title)}</h4>
      ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ''}
      ${renderList(project.deliverables)}
    </article>
  `
}

export function renderCurriculumPdfHtml(curriculum: CurriculumDocument): string {
  const logoDataUri = safeDataUri('/hexadigitall-logo-transparent.png', 'image/png')
  const montserratBold = safeDataUri('/fonts/montserrat-bold.woff2', 'font/woff2')
  const latoRegular = safeDataUri('/fonts/lato-regular.woff2', 'font/woff2')
  const latoBold = safeDataUri('/fonts/lato-bold.woff2', 'font/woff2')

  const summary = curriculum.heroSummary || curriculum.summary || curriculum.course?.summary || curriculum.course?.description || ''
  const heroTags = curriculum.heroTags?.map((tag) => `<span class="tag">${escapeHtml(tag)}</span>`).join('') || ''
  const welcome = curriculum.welcomeMessages?.map((message) => `<p>${escapeHtml(message)}</p>`).join('') || ''
  const complementary = curriculum.complementaryCourses?.map((item) => `
    <article class="small-card">
      <h4>${escapeHtml(item.title)}</h4>
      ${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}
    </article>
  `).join('') || ''
  const weeks = curriculum.weeks?.map(renderWeek).join('') || ''
  const projects = curriculum.capstoneProjects?.map(renderProject).join('') || ''

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>${escapeHtml(curriculum.title)} Curriculum</title>
  <style>
    ${montserratBold ? `@font-face { font-family: 'MontserratPdf'; src: url('${montserratBold}') format('woff2'); font-weight: 700; font-style: normal; }` : ''}
    ${latoRegular ? `@font-face { font-family: 'LatoPdf'; src: url('${latoRegular}') format('woff2'); font-weight: 400; font-style: normal; }` : ''}
    ${latoBold ? `@font-face { font-family: 'LatoPdf'; src: url('${latoBold}') format('woff2'); font-weight: 700; font-style: normal; }` : ''}

    :root {
      --ink: #0f1b36;
      --muted: #334155;
      --line: #d6e2f3;
      --surface: #ffffff;
      --surface-alt: #f7fbff;
      --accent: #0ea5e9;
      --accent-soft: #eff8ff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: 'LatoPdf', 'Segoe UI', Arial, sans-serif;
      color: var(--ink);
      background: white;
      line-height: 1.55;
      font-size: 13.5px;
    }
    h1, h2, h3, h4, h5, .eyebrow {
      font-family: 'MontserratPdf', 'Segoe UI', Arial, sans-serif;
    }
    .cover {
      min-height: 270mm;
      padding: 22mm;
      background:
        radial-gradient(circle at 10% 16%, rgba(95, 160, 255, 0.28), rgba(95, 160, 255, 0) 34%),
        linear-gradient(145deg, #0b1633 0%, #123984 55%, #1f63c8 100%);
      color: #ffffff;
      page-break-after: always;
      position: relative;
      overflow: hidden;
    }
    .cover::after {
      content: '';
      position: absolute;
      right: -45mm;
      bottom: -55mm;
      width: 190mm;
      height: 190mm;
      border-radius: 999px;
      background: radial-gradient(circle, rgba(255,255,255,0.22), rgba(255,255,255,0) 70%);
    }
    .brand {
      display: flex;
      justify-content: space-between;
      align-items: center;
      gap: 12px;
      position: relative;
      z-index: 1;
    }
    .brand-left {
      display: flex;
      align-items: center;
      gap: 12px;
    }
    .logo {
      width: 62px;
      height: 62px;
      object-fit: contain;
      border: 1px solid rgba(255,255,255,0.35);
      border-radius: 14px;
      background: rgba(255,255,255,0.08);
      padding: 6px;
    }
    .org {
      font-size: 12px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      font-weight: 700;
    }
    .badge {
      font-size: 10px;
      letter-spacing: 0.14em;
      text-transform: uppercase;
      border: 1px solid rgba(255,255,255,0.36);
      border-radius: 999px;
      padding: 6px 10px;
      background: rgba(255,255,255,0.1);
      font-weight: 700;
    }
    .title {
      margin-top: 34mm;
      max-width: 160mm;
      position: relative;
      z-index: 1;
    }
    .title h1 {
      color: #ffffff;
      font-size: 42px;
      line-height: 1.08;
    }
    .title p {
      margin-top: 12px;
      margin-bottom: 0;
      color: rgba(247,251,255,0.92);
      font-size: 15px;
    }
    .cover-meta {
      margin-top: 20mm;
      display: grid;
      grid-template-columns: repeat(3, minmax(0, 1fr));
      gap: 10px;
      max-width: 170mm;
      position: relative;
      z-index: 1;
    }
    .cover-meta article {
      border: 1px solid rgba(255,255,255,0.33);
      border-radius: 12px;
      padding: 10px;
      background: rgba(7,16,42,0.42);
    }
    .cover-meta h5 {
      color: rgba(240,245,255,0.8);
      font-size: 10px;
      letter-spacing: 0.12em;
      text-transform: uppercase;
      margin-bottom: 4px;
    }
    .cover-meta p {
      color: #ffffff;
      margin: 0;
      font-size: 12px;
      font-weight: 700;
    }
    .page {
      width: 100%;
      max-width: 186mm;
      margin: 0 auto;
      padding: 12mm 0;
    }
    .hero {
      background: linear-gradient(145deg, #eef5ff 0%, #ffffff 75%);
      border: 1px solid var(--line);
      border-radius: 16px;
      overflow: hidden;
      margin-bottom: 10px;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 62mm;
      gap: 12px;
      padding: 14px;
      align-items: start;
    }
    .eyebrow {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      font-weight: 700;
      color: #244da8;
      margin-bottom: 8px;
    }
    .hero .eyebrow { color: #244da8; }
    .hero p {
      color: #334155;
      margin-top: 9px;
      margin-bottom: 0;
    }
    .meta-card {
      background: #ffffff;
      border-radius: 12px;
      padding: 10px;
      border: 1px solid var(--line);
    }
    .meta-card dl { margin: 0; display: grid; gap: 7px; }
    .meta-card dt { font-size: 10px; text-transform: uppercase; letter-spacing: 0.1em; color: #5b667d; font-weight: 700; }
    .meta-card dd { margin: 2px 0 0; font-size: 12px; font-weight: 700; color: #11264d; }
    .tags { display: flex; flex-wrap: wrap; gap: 6px; margin-top: 8px; }
    .tag, .chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 4px 8px;
      font-size: 10px;
      font-weight: 700;
      background: #e9f0ff;
      color: #1f3f8f;
      border: 1px solid #ccdafa;
    }
    .section, .lead-box {
      border: 1px solid var(--line);
      border-radius: 12px;
      background: var(--surface);
      padding: 11px;
      margin-bottom: 9px;
    }
    .lead-box {
      background: linear-gradient(180deg, #f4f8ff 0%, #ffffff 100%);
    }
    .grid-2, .grid-3 {
      display: grid;
      gap: 9px;
    }
    .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .small-card, .project-card, .week-card {
      border: 1px solid var(--line);
      border-radius: 11px;
      background: var(--surface-alt);
      padding: 11px;
      break-inside: avoid;
    }
    .week-card { background: var(--surface); margin-bottom: 8px; }
    .week-head {
      display: flex;
      justify-content: space-between;
      gap: 10px;
      align-items: start;
      border-bottom: 1px solid #e6edf9;
      padding-bottom: 8px;
      margin-bottom: 8px;
    }
    h2 { font-size: 19px; margin-bottom: 8px; }
    h3 { font-size: 17px; margin-bottom: 8px; }
    h4 { font-size: 14px; margin-bottom: 7px; }
    h5 {
      font-size: 10px;
      text-transform: uppercase;
      letter-spacing: 0.15em;
      color: #4a5e85;
      margin-bottom: 7px;
    }
    p { margin: 0 0 8px; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 7px; }
    li { display: flex; gap: 8px; font-size: 13px; color: var(--muted); }
    .bullet {
      width: 8px;
      height: 8px;
      border-radius: 999px;
      background: var(--accent);
      margin-top: 6px;
      flex: 0 0 auto;
    }
    .lab-box {
      background: var(--accent-soft);
      border: 1px solid #cde8fb;
      border-radius: 10px;
      padding: 9px;
      margin-top: 8px;
    }
    .end-note {
      margin-top: 10px;
      border: 1px dashed #b9d0f5;
      border-radius: 12px;
      background: #f8fbff;
      padding: 10px 11px;
      font-size: 12px;
      color: #1f3f8f;
    }
    @media print {
      @page {
        size: A4;
        margin: 12mm;
      }
      .page { padding: 0; }
      .section, .lead-box, .hero, .week-card, .project-card, .small-card { box-shadow: none; }
      .week-card, .project-card, .small-card, .hero, .section, .lead-box { break-inside: avoid; }
    }
  </style>
</head>
<body>
  <section class="cover">
    <div class="brand">
      <div class="brand-left">
        ${logoDataUri ? `<img class="logo" src="${logoDataUri}" alt="Hexadigitall logo" />` : ''}
        <div class="org">Hexadigitall Technologies</div>
      </div>
      <div class="badge">Official Curriculum Guide</div>
    </div>

    <div class="title">
      <h1>${escapeHtml(curriculum.title)}</h1>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
    </div>

    <div class="cover-meta">
      <article><h5>Duration</h5><p>${escapeHtml(curriculum.duration || 'TBD')}</p></article>
      <article><h5>Level</h5><p>${escapeHtml(curriculum.level || 'TBD')}</p></article>
      <article><h5>Study Time</h5><p>${escapeHtml(curriculum.studyTime || 'TBD')}</p></article>
      <article><h5>School</h5><p>${escapeHtml(curriculum.schoolName || 'Hexadigitall')}</p></article>
      <article><h5>Prepared On</h5><p>${escapeHtml(formatDate(new Date()))}</p></article>
      <article><h5>Source</h5><p>${escapeHtml(curriculum.course?.title || 'Hexadigitall Curriculum')}</p></article>
    </div>
  </section>

  <div class="page">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">Program Snapshot</div>
          <h2>${escapeHtml(curriculum.title)}</h2>
          ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
        </div>
        <aside class="meta-card">
          <dl>
            ${curriculum.duration ? `<div><dt>Duration</dt><dd>${escapeHtml(curriculum.duration)}</dd></div>` : ''}
            ${curriculum.level ? `<div><dt>Level</dt><dd>${escapeHtml(curriculum.level)}</dd></div>` : ''}
            ${curriculum.studyTime ? `<div><dt>Study Time</dt><dd>${escapeHtml(curriculum.studyTime)}</dd></div>` : ''}
            ${curriculum.schoolName ? `<div><dt>School</dt><dd>${escapeHtml(curriculum.schoolName)}</dd></div>` : ''}
          </dl>
          ${heroTags ? `<div class="tags">${heroTags}</div>` : ''}
        </aside>
      </div>
    </section>

    ${welcome ? `<section class="lead-box">${curriculum.welcomeTitle ? `<h2>${escapeHtml(curriculum.welcomeTitle)}</h2>` : ''}${welcome}</section>` : ''}

    ${(curriculum.prerequisites?.length || curriculum.essentialResources?.length) ? `
      <section class="grid-2">
        ${curriculum.prerequisites?.length ? `<div class="section"><h3>Prerequisites</h3>${renderList(curriculum.prerequisites)}</div>` : ''}
        ${curriculum.essentialResources?.length ? `<div class="section"><h3>Essential Resources</h3>${renderList(curriculum.essentialResources)}</div>` : ''}
      </section>
    ` : ''}

    ${curriculum.complementaryCourses?.length ? `<section class="section"><h3>Complementary Courses</h3><div class="grid-3">${complementary}</div></section>` : ''}
    ${curriculum.learningRoadmap?.length ? `<section class="section"><h3>Learning Roadmap</h3>${renderList(curriculum.learningRoadmap)}</section>` : ''}
    ${curriculum.weeks?.length ? `<section class="section"><h2>Detailed Weekly Curriculum</h2>${weeks}</section>` : ''}
    ${curriculum.capstoneProjects?.length ? `<section class="section"><h2>Capstone Projects</h2><div class="grid-3">${projects}</div></section>` : ''}

    <section class="end-note">
      This curriculum is an official Hexadigitall learning plan. Module sequencing and project details may be refined as industry requirements evolve.
    </section>
  </div>
</body>
</html>`
}
