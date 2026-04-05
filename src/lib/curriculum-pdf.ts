import type { CurriculumDocument, CurriculumProject, CurriculumWeek } from '@/lib/curriculum-types'

function escapeHtml(value: string): string {
  return value
    .replaceAll('&', '&amp;')
    .replaceAll('<', '&lt;')
    .replaceAll('>', '&gt;')
    .replaceAll('"', '&quot;')
    .replaceAll("'", '&#39;')
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
    :root {
      --ink: #0f172a;
      --muted: #475569;
      --line: #dbe4ee;
      --surface: #ffffff;
      --surface-alt: #f8fafc;
      --accent: #0f766e;
      --accent-soft: #ecfeff;
    }
    * { box-sizing: border-box; }
    body {
      margin: 0;
      font-family: Inter, Arial, sans-serif;
      color: var(--ink);
      background: white;
      line-height: 1.55;
    }
    .page {
      width: 100%;
      max-width: 1080px;
      margin: 0 auto;
      padding: 28px;
    }
    .hero {
      background: linear-gradient(135deg, #0f172a 0%, #155e75 56%, #ffffff 56%, #ffffff 100%);
      border: 1px solid var(--line);
      border-radius: 24px;
      overflow: hidden;
      margin-bottom: 24px;
    }
    .hero-grid {
      display: grid;
      grid-template-columns: minmax(0, 1fr) 280px;
      gap: 24px;
      padding: 28px;
      align-items: start;
    }
    .eyebrow {
      font-size: 11px;
      text-transform: uppercase;
      letter-spacing: 0.24em;
      font-weight: 700;
      color: #0f766e;
      margin-bottom: 10px;
    }
    .hero .eyebrow { color: rgba(255,255,255,0.84); }
    h1, h2, h3, h4, h5 { margin: 0; }
    .hero h1 {
      color: white;
      font-size: 34px;
      line-height: 1.08;
    }
    .hero p {
      color: rgba(255,255,255,0.88);
      margin-top: 12px;
      font-size: 15px;
    }
    .meta-card {
      background: rgba(255,255,255,0.96);
      border-radius: 20px;
      padding: 18px;
      border: 1px solid rgba(148,163,184,0.28);
    }
    .meta-card dl { margin: 0; display: grid; gap: 10px; }
    .meta-card dt { font-size: 12px; text-transform: uppercase; letter-spacing: 0.12em; color: var(--muted); }
    .meta-card dd { margin: 4px 0 0; font-size: 14px; font-weight: 600; color: var(--ink); }
    .tags { display: flex; flex-wrap: wrap; gap: 8px; margin-top: 14px; }
    .tag, .chip {
      display: inline-flex;
      align-items: center;
      border-radius: 999px;
      padding: 6px 10px;
      font-size: 11px;
      font-weight: 700;
      background: #ecfeff;
      color: #115e59;
    }
    .section, .lead-box {
      border: 1px solid var(--line);
      border-radius: 22px;
      background: var(--surface);
      padding: 22px;
      margin-bottom: 20px;
    }
    .lead-box {
      background: linear-gradient(180deg, #effcfb 0%, #ffffff 100%);
    }
    .grid-2, .grid-3 {
      display: grid;
      gap: 16px;
    }
    .grid-2 { grid-template-columns: repeat(2, minmax(0, 1fr)); }
    .grid-3 { grid-template-columns: repeat(3, minmax(0, 1fr)); }
    .small-card, .project-card, .week-card {
      border: 1px solid var(--line);
      border-radius: 18px;
      background: var(--surface-alt);
      padding: 18px;
      break-inside: avoid;
    }
    .week-card { background: var(--surface); margin-bottom: 14px; }
    .week-head {
      display: flex;
      justify-content: space-between;
      gap: 18px;
      align-items: start;
      border-bottom: 1px solid #e8eef5;
      padding-bottom: 14px;
      margin-bottom: 16px;
    }
    h2 { font-size: 24px; margin-bottom: 14px; }
    h3 { font-size: 21px; margin-bottom: 14px; }
    h4 { font-size: 17px; margin-bottom: 10px; }
    h5 {
      font-size: 12px;
      text-transform: uppercase;
      letter-spacing: 0.18em;
      color: var(--muted);
      margin-bottom: 12px;
    }
    p { margin: 0 0 12px; }
    ul { list-style: none; padding: 0; margin: 0; display: grid; gap: 10px; }
    li { display: flex; gap: 10px; font-size: 14px; color: var(--ink); }
    .bullet {
      width: 9px;
      height: 9px;
      border-radius: 999px;
      background: var(--accent);
      margin-top: 7px;
      flex: 0 0 auto;
    }
    .lab-box {
      background: var(--accent-soft);
      border: 1px solid #bae6fd;
      border-radius: 18px;
      padding: 16px;
      margin-top: 16px;
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
  <div class="page">
    <section class="hero">
      <div class="hero-grid">
        <div>
          <div class="eyebrow">Curriculum</div>
          <h1>${escapeHtml(curriculum.title)}</h1>
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
  </div>
</body>
</html>`
}
