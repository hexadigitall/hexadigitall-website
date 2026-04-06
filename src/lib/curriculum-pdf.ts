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

function toDataUri(publicPath: string, mimeType: string): string {
  const cached = assetCache.get(publicPath)
  if (cached) return cached

  const absolutePath = path.join(process.cwd(), 'public', publicPath.replace(/^\//, ''))
  const bytes = fs.readFileSync(absolutePath)
  const uri = `data:${mimeType};base64,${bytes.toString('base64')}`
  assetCache.set(publicPath, uri)
  return uri
}

function safeDataUri(publicPath: string, mimeType: string): string {
  try {
    return toDataUri(publicPath, mimeType)
  } catch {
    return ''
  }
}

function formatDate(value: Date): string {
  return new Intl.DateTimeFormat('en-NG', {
    year: 'numeric',
    month: 'long',
    day: '2-digit',
  }).format(value)
}

function renderList(items?: string[]): string {
  if (!items?.length) return ''

  return `<ul>${items.map((item) => `<li><span class="dot"></span><span>${escapeHtml(item)}</span></li>`).join('')}</ul>`
}

function renderWeek(week: CurriculumWeek): string {
  return `
    <article class="week">
      <div class="head">
        <div>
          <div class="eyebrow">Week ${week.weekNumber}</div>
          <h4>${escapeHtml(week.topic)}</h4>
        </div>
        ${week.duration ? `<span class="chip">${escapeHtml(week.duration)}</span>` : ''}
      </div>
      ${week.outcomes?.length ? `<section><h5>Learning Outcomes</h5>${renderList(week.outcomes)}</section>` : ''}
      ${week.labItems?.length ? `<section class="lab"><h5>${escapeHtml(week.labTitle || 'Lab Exercise')}</h5>${renderList(week.labItems)}</section>` : ''}
    </article>
  `
}

function renderProject(project: CurriculumProject): string {
  return `
    <article class="card">
      <h4>${escapeHtml(project.title)}</h4>
      ${project.description ? `<p>${escapeHtml(project.description)}</p>` : ''}
      ${renderList(project.deliverables)}
    </article>
  `
}

export function renderCurriculumPdfHtml(curriculum: CurriculumDocument): string {
  const summary = curriculum.heroSummary || curriculum.summary || curriculum.course?.summary || curriculum.course?.description || ''
  const heroTags = curriculum.heroTags?.map((tag) => `<span class="chip">${escapeHtml(tag)}</span>`).join('') || ''
  const welcome = curriculum.welcomeMessages?.map((message) => `<p>${escapeHtml(message)}</p>`).join('') || ''
  const complementary = curriculum.complementaryCourses?.map((item) => `<article class="card"><h4>${escapeHtml(item.title)}</h4>${item.description ? `<p>${escapeHtml(item.description)}</p>` : ''}</article>`).join('') || ''
  const weeks = curriculum.weeks?.map(renderWeek).join('') || ''
  const projects = curriculum.capstoneProjects?.map(renderProject).join('') || ''

  const logoData = safeDataUri('/hexadigitall-logo-transparent.png', 'image/png')
  const montserratBold = safeDataUri('/fonts/montserrat-bold.woff2', 'font/woff2')
  const latoRegular = safeDataUri('/fonts/lato-regular.woff2', 'font/woff2')
  const latoBold = safeDataUri('/fonts/lato-bold.woff2', 'font/woff2')

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

    :root { --ink:#0f1b36; --soft:#334155; --line:#d6e2f3; --bg:#f7fbff; --brand:#1d4ed8; --brand2:#0f2e84; --accent:#0ea5e9; }
    * { box-sizing:border-box; }
    body { margin:0; color:var(--ink); font:14px/1.56 'LatoPdf','Segoe UI',Arial,sans-serif; background:#fff; }
    h1,h2,h3,h4,h5,.eyebrow { font-family:'MontserratPdf','Segoe UI',Arial,sans-serif; margin:0; color:var(--ink); }
    p { margin:0 0 8px; color:var(--soft); }

    .cover { min-height:270mm; padding:22mm; background:radial-gradient(circle at 10% 16%, rgba(95,160,255,.28), rgba(95,160,255,0) 34%), linear-gradient(145deg,#0b1633 0%,#123984 55%,#1f63c8 100%); color:#fff; page-break-after:always; position:relative; overflow:hidden; }
    .cover::after { content:''; position:absolute; right:-45mm; bottom:-55mm; width:190mm; height:190mm; border-radius:999px; background:radial-gradient(circle, rgba(255,255,255,.22), rgba(255,255,255,0) 70%); }
    .brand { display:flex; justify-content:space-between; align-items:center; position:relative; z-index:1; gap:12px; }
    .brand-left { display:flex; align-items:center; gap:12px; }
    .logo { width:62px; height:62px; object-fit:contain; border:1px solid rgba(255,255,255,.35); border-radius:14px; background:rgba(255,255,255,.08); padding:6px; }
    .org { font-size:12px; letter-spacing:.14em; text-transform:uppercase; font-weight:700; }
    .badge { font-size:10px; letter-spacing:.14em; text-transform:uppercase; border:1px solid rgba(255,255,255,.36); border-radius:999px; padding:6px 10px; background:rgba(255,255,255,.1); font-weight:700; }
    .title { margin-top:34mm; max-width:160mm; position:relative; z-index:1; }
    .title h1 { font-size:42px; line-height:1.08; color:#fff; }
    .title p { margin-top:12px; color:rgba(247,251,255,.92); font-size:15px; }
    .meta { margin-top:20mm; display:grid; grid-template-columns:repeat(3,minmax(0,1fr)); gap:10px; max-width:170mm; position:relative; z-index:1; }
    .meta article { border:1px solid rgba(255,255,255,.33); border-radius:12px; padding:10px; background:rgba(7,16,42,.42); }
    .meta h5 { color:rgba(240,245,255,.8); font-size:10px; letter-spacing:.12em; text-transform:uppercase; margin-bottom:4px; }
    .meta p { color:#fff; margin:0; font-size:12px; font-weight:700; }

    .page { max-width:186mm; margin:0 auto; padding:12mm 0; }
    .hero { border:1px solid var(--line); border-radius:16px; background:linear-gradient(145deg,#eef5ff 0%,#fff 75%); padding:14px; display:grid; grid-template-columns:minmax(0,1fr) 62mm; gap:12px; margin-bottom:10px; }
    .eyebrow { font-size:10px; letter-spacing:.18em; text-transform:uppercase; color:#244da8; margin-bottom:8px; }
    .hero h2 { font-size:24px; line-height:1.1; }
    .hero .summary { margin-top:9px; }
    .mini { border:1px solid var(--line); border-radius:12px; background:#fff; padding:10px; }
    .mini dl { margin:0; display:grid; gap:7px; }
    .mini dt { font-size:10px; color:#5b667d; text-transform:uppercase; letter-spacing:.1em; font-weight:700; }
    .mini dd { margin:2px 0 0; font-weight:700; font-size:12px; color:#11264d; }
    .chips { display:flex; flex-wrap:wrap; gap:6px; margin-top:8px; }
    .chip { display:inline-flex; border-radius:999px; padding:4px 8px; font-size:10px; font-weight:700; background:#e9f0ff; color:#1f3f8f; border:1px solid #ccdafa; }

    .section,.lead,.card,.week { border:1px solid var(--line); border-radius:12px; background:#fff; padding:11px; break-inside:avoid; }
    .lead { background:linear-gradient(180deg,#f4f8ff 0%,#fff 100%); margin-bottom:9px; }
    .grid2,.grid3 { display:grid; gap:9px; }
    .grid2 { grid-template-columns:repeat(2,minmax(0,1fr)); }
    .grid3 { grid-template-columns:repeat(3,minmax(0,1fr)); }
    .section { margin-bottom:9px; }
    .week { margin-bottom:8px; }
    .head { display:flex; justify-content:space-between; gap:10px; border-bottom:1px solid #e6edf9; padding-bottom:8px; margin-bottom:8px; }
    h2 { font-size:19px; margin-bottom:8px; } h3 { font-size:17px; margin-bottom:8px; } h4 { font-size:14px; margin-bottom:7px; }
    h5 { font-size:10px; letter-spacing:.15em; text-transform:uppercase; color:#4a5e85; margin-bottom:7px; }
    ul { list-style:none; padding:0; margin:0; display:grid; gap:7px; }
    li { display:flex; gap:8px; color:var(--soft); }
    .dot { width:8px; height:8px; border-radius:999px; background:var(--accent); margin-top:6px; flex:0 0 auto; }
    .lab { margin-top:8px; background:#eff8ff; border:1px solid #cde8fb; border-radius:10px; padding:9px; }
    .note { margin-top:10px; border:1px dashed #b9d0f5; border-radius:12px; background:#f8fbff; padding:10px 11px; font-size:12px; color:#1f3f8f; }

    @media print { @page { size:A4; margin:12mm; } .page { padding:0; } }
  </style>
</head>
<body>
  <section class="cover">
    <div class="brand">
      <div class="brand-left">
        ${logoData ? `<img class="logo" src="${logoData}" alt="Hexadigitall logo" />` : ''}
        <div class="org">Hexadigitall Technologies</div>
      </div>
      <div class="badge">Official Curriculum Guide</div>
    </div>

    <div class="title">
      <h1>${escapeHtml(curriculum.title)}</h1>
      ${summary ? `<p>${escapeHtml(summary)}</p>` : ''}
    </div>

    <div class="meta">
      <article><h5>Duration</h5><p>${escapeHtml(curriculum.duration || 'TBD')}</p></article>
      <article><h5>Level</h5><p>${escapeHtml(curriculum.level || 'TBD')}</p></article>
      <article><h5>Study Time</h5><p>${escapeHtml(curriculum.studyTime || 'TBD')}</p></article>
      <article><h5>School</h5><p>${escapeHtml(curriculum.schoolName || 'Hexadigitall')}</p></article>
      <article><h5>Prepared On</h5><p>${escapeHtml(formatDate(new Date()))}</p></article>
      <article><h5>Source</h5><p>${escapeHtml(curriculum.course?.title || 'Hexadigitall Curriculum')}</p></article>
    </div>
  </section>

  <main class="page">
    <section class="hero">
      <div>
        <div class="eyebrow">Program Snapshot</div>
        <h2>${escapeHtml(curriculum.title)}</h2>
        ${summary ? `<p class="summary">${escapeHtml(summary)}</p>` : ''}
      </div>
      <aside class="mini">
        <dl>
          ${curriculum.duration ? `<div><dt>Duration</dt><dd>${escapeHtml(curriculum.duration)}</dd></div>` : ''}
          ${curriculum.level ? `<div><dt>Level</dt><dd>${escapeHtml(curriculum.level)}</dd></div>` : ''}
          ${curriculum.studyTime ? `<div><dt>Study Time</dt><dd>${escapeHtml(curriculum.studyTime)}</dd></div>` : ''}
          ${curriculum.schoolName ? `<div><dt>School</dt><dd>${escapeHtml(curriculum.schoolName)}</dd></div>` : ''}
        </dl>
        ${heroTags ? `<div class="chips">${heroTags}</div>` : ''}
      </aside>
    </section>

    ${welcome ? `<section class="lead">${curriculum.welcomeTitle ? `<h2>${escapeHtml(curriculum.welcomeTitle)}</h2>` : ''}${welcome}</section>` : ''}

    ${(curriculum.prerequisites?.length || curriculum.essentialResources?.length) ? `
      <section class="grid2">
        ${curriculum.prerequisites?.length ? `<div class="section"><h3>Prerequisites</h3>${renderList(curriculum.prerequisites)}</div>` : ''}
        ${curriculum.essentialResources?.length ? `<div class="section"><h3>Essential Resources</h3>${renderList(curriculum.essentialResources)}</div>` : ''}
      </section>
    ` : ''}

    ${curriculum.complementaryCourses?.length ? `<section class="section"><h3>Complementary Courses</h3><div class="grid3">${complementary}</div></section>` : ''}
    ${curriculum.learningRoadmap?.length ? `<section class="section"><h3>Learning Roadmap</h3>${renderList(curriculum.learningRoadmap)}</section>` : ''}
    ${curriculum.weeks?.length ? `<section class="section"><h2>Detailed Weekly Curriculum</h2>${weeks}</section>` : ''}
    ${curriculum.capstoneProjects?.length ? `<section class="section"><h2>Capstone Projects</h2><div class="grid3">${projects}</div></section>` : ''}

    <section class="note">
      This curriculum is an official Hexadigitall learning plan. Module sequencing and project details may be refined as industry requirements evolve.
    </section>
  </main>
</body>
</html>`
}
