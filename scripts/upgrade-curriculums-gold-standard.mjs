#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';

const root = process.cwd();
const curriculumDir = path.join(root, 'public', 'curriculums');
const auditPath = path.join(root, 'curriculum-audit-report.json');

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function pickFirst(match, idx = 1, fallback = '') {
  return match ? (match[idx] || fallback) : fallback;
}

function extractTitle(html, fallbackFromFile) {
  const h2 = html.match(/<h2[^>]*>([\s\S]*?)<\/h2>/i);
  const title = pickFirst(h2, 1, '').replace(/<[^>]+>/g, '').trim();
  if (title) return title;

  const t = html.match(/<title[^>]*>([\s\S]*?)<\/title>/i);
  const fromTitle = pickFirst(t, 1, '').replace(/\s*-\s*Hexadigitall[\s\S]*$/i, '').replace(/\s*-\s*Course Curriculum$/i, '').trim();
  if (fromTitle) return fromTitle;

  return fallbackFromFile
    .replace(/^curriculum-/, '')
    .replace(/\.html$/, '')
    .split('-')
    .map((s) => (s ? s[0].toUpperCase() + s.slice(1) : s))
    .join(' ');
}

function extractDurationWeeks(html) {
  const m = html.match(/(\d{1,2})\s*Weeks?/i);
  const n = m ? Number(m[1]) : 12;
  return Number.isFinite(n) && n > 0 ? n : 12;
}

function extractLevel(html) {
  const labeled = html.match(/Level<\/label>\s*<span>([^<]+)<\/span>/i);
  if (labeled) return labeled[1].trim();
  const byWord = html.match(/\b(Beginner|Intermediate|Advanced)\b/i);
  return byWord ? byWord[1] : 'Intermediate';
}

function extractImage(html) {
  const m = html.match(/<img[^>]+src="([^"]+)"[^>]*>/i);
  return m ? m[1] : '../og-images/school-of-coding-and-development.jpg';
}

function extractLearnBullets(html) {
  const li = Array.from(html.matchAll(/<li[^>]*>([\s\S]*?)<\/li>/gi))
    .map((m) => m[1].replace(/<[^>]+>/g, '').trim())
    .filter(Boolean)
    .filter((t) => t.length >= 8 && t.length <= 120);
  return [...new Set(li)].slice(0, 8);
}

function slugFromFile(file) {
  return file.replace(/^curriculum-/, '').replace(/\.html$/, '');
}

function titleKeywords(title) {
  const stop = new Set(['and', 'for', 'the', 'with', 'from', 'to', 'of', 'in', 'pro', 'track', 'course', 'bootcamp', 'intro', 'advanced', 'fundamentals']);
  return title
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, ' ')
    .split(/\s+/)
    .filter(Boolean)
    .filter((w) => w.length > 2 && !stop.has(w))
    .slice(0, 4);
}

function buildWeekTopics(duration, title) {
  const kw = titleKeywords(title);
  const k1 = kw[0] || 'core concepts';
  const k2 = kw[1] || 'implementation';
  const k3 = kw[2] || 'automation';

  const base = [
    'Orientation, Tooling, and Workflow Setup',
    `Foundations of ${k1.toUpperCase()}`,
    `Core Building Blocks: ${k2.toUpperCase()}`,
    'Practical Patterns and Problem Solving',
    'Applied Labs and Real-World Scenarios',
    `Systems Integration with ${k3.toUpperCase()}`,
    'Quality, Testing, and Debugging',
    'Security and Reliability Practices',
    'Operational Excellence and Monitoring',
    'Optimization and Performance Tuning',
    'Project Build Sprint I',
    'Project Build Sprint II',
    'Advanced Troubleshooting and Edge Cases',
    'Production Readiness Checklist',
    'Mock Review and Professional Presentation',
    'Capstone Delivery and Career Alignment',
    'Extended Practice and Portfolio Hardening',
    'Interview and Assessment Readiness',
    'Final Revision and Gap Closure',
    'Final Evaluation and Next Steps',
    'Expert Clinic and Deep Dives',
    'Architecture Walkthrough and Defense',
    'Governance, Documentation, and Handover',
    'Final Capstone Submission and Review',
  ];

  const out = [];
  for (let i = 0; i < duration; i += 1) {
    out.push(base[i] || `Advanced Applied Practice - Week ${i + 1}`);
  }
  return out;
}

function weekBlock(week, topic, title) {
  const short = title.replace(/\s*\([^)]*\)\s*/g, '').trim();
  return `
            <div class="week-block">
                <div class="week-header">
                    <span class="week-number">Week ${week}</span>
                    <span class="week-duration">2 hours + labs</span>
                </div>
                <div class="week-topic">${escapeHtml(topic)}</div>
                <div class="week-content">
                    <div class="week-column">
                        <h4>Core Concepts</h4>
                        <ul>
                            <li>Master the key principles for ${escapeHtml(short)} in this stage.</li>
                            <li>Understand architecture, terminology, and decision trade-offs.</li>
                            <li>Connect this week's concepts to production scenarios.</li>
                        </ul>
                    </div>
                    <div class="week-column">
                        <h4>Hands-On Lab</h4>
                        <ul>
                            <li>Implement a guided lab focused on this week's objective.</li>
                            <li>Validate outcomes using reproducible checks and evidence.</li>
                            <li>Document troubleshooting notes and lessons learned.</li>
                        </ul>
                    </div>
                    <div class="week-column">
                        <h4>Deliverables</h4>
                        <ul>
                            <li>Submit working artifacts with clear README instructions.</li>
                            <li>Present a concise summary of outcomes and blockers.</li>
                            <li>Complete a weekly self-assessment and improvement plan.</li>
                        </ul>
                    </div>
                </div>
            </div>`;
}

function renderCurriculum({ title, durationWeeks, level, imageSrc, slug, learnBullets }) {
  const weeks = buildWeekTopics(durationWeeks, title)
    .map((topic, idx) => weekBlock(idx + 1, topic, title))
    .join('\n');

  const outcomes = learnBullets.length
    ? learnBullets
    : [
        `Build production-ready competence in ${title}.`,
        'Translate theory into working implementations and measurable outcomes.',
        'Troubleshoot confidently using a structured engineering workflow.',
        'Produce portfolio-ready artifacts and technical documentation.',
      ];

  return `<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>${escapeHtml(title)} - Course Curriculum</title>
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@300;400;500;600;700;800&family=Space+Grotesk:wght@500;600;700&display=swap" rel="stylesheet">
    <style>
        * { margin: 0; padding: 0; box-sizing: border-box; }
        :root {
            --primary-color: #0b66c3;
            --secondary-color: #52b6ff;
            --accent-color: #f59e0b;
            --dark-blue: #05284f;
            --text-dark: #111827;
            --text-light: #4b5563;
            --bg-light: #f3f6fb;
            --bg-white: #ffffff;
            --border-color: #dbe3ef;
        }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text-dark); background: var(--bg-white); font-size: 14px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 36px; }
        .brand-bar {
            display: flex; align-items: center; justify-content: space-between; gap: 20px;
            border: 1px solid var(--border-color); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px;
            box-shadow: 0 4px 18px rgba(5, 40, 79, 0.08);
        }
        .brand-meta { display: flex; align-items: center; gap: 16px; }
        .brand-meta img { width: 60px; height: auto; }
        .brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--dark-blue); }
        .brand-link { color: var(--primary-color); font-weight: 600; text-decoration: none; }
        .qr-block { display: flex; align-items: center; gap: 12px; background: var(--bg-light); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); }
        .qr-block img { width: 84px; height: 84px; }
        .qr-text { font-size: 12px; color: var(--text-light); max-width: 220px; }
        .header {
            background: linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-color) 100%);
            color: #fff; padding: 44px 36px; border-radius: 12px; margin-bottom: 24px;
        }
        .header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 38px; margin-bottom: 12px; line-height: 1.2; }
        .subtitle { font-size: 17px; opacity: 0.95; }
        .course-meta { display: flex; flex-wrap: wrap; gap: 14px; margin-top: 18px; }
        .meta-item { background: rgba(255,255,255,0.15); padding: 10px 14px; border-radius: 8px; }
        .course-hero {
            background: linear-gradient(135deg, #e6f2ff 0%, #f5f9ff 100%);
            border: 1px solid var(--border-color); border-radius: 12px; padding: 16px;
            margin-bottom: 28px; display: grid; grid-template-columns: 1fr 320px; gap: 18px; align-items: center;
        }
        .course-hero h2 { font-family: 'Space Grotesk', sans-serif; color: var(--dark-blue); margin-bottom: 8px; font-size: 22px; }
        .course-hero img { width: 100%; border-radius: 12px; border: 1px solid var(--border-color); }
        .section { margin-bottom: 38px; }
        .section-title {
            font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: var(--dark-blue); margin-bottom: 18px;
            padding-bottom: 10px; border-bottom: 3px solid var(--primary-color);
        }
        .card { background: var(--bg-white); border: 1px solid var(--border-color); border-radius: 10px; padding: 24px; margin-bottom: 16px; }
        .card ul { margin-left: 20px; }
        .card li { margin: 6px 0; }
        .week-block { border: 1px solid var(--border-color); border-left: 6px solid var(--primary-color); border-radius: 12px; padding: 18px; margin-bottom: 14px; background: #fff; }
        .week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .week-number { font-weight: 700; color: var(--dark-blue); }
        .week-duration { font-size: 12px; color: var(--text-light); background: var(--bg-light); padding: 4px 8px; border-radius: 6px; }
        .week-topic { font-family: 'Space Grotesk', sans-serif; color: var(--primary-color); font-size: 18px; margin-bottom: 10px; }
        .week-content { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .week-column { background: var(--bg-light); border: 1px solid var(--border-color); border-radius: 10px; padding: 10px; }
        .week-column h4 { font-size: 13px; color: var(--dark-blue); margin-bottom: 8px; text-transform: uppercase; letter-spacing: 0.03em; }
        .week-column ul { margin-left: 16px; }
        .week-column li { font-size: 13px; margin: 5px 0; }
        .project-card { border: 1px solid var(--border-color); border-radius: 10px; padding: 18px; margin-bottom: 12px; background: linear-gradient(135deg, #eef5ff 0%, #f8fbff 100%); }
        .project-card h4 { color: var(--dark-blue); margin-bottom: 8px; }
        .project-card p { color: var(--text-light); margin-bottom: 8px; }
        .footer { border-top: 1px solid var(--border-color); margin-top: 24px; padding-top: 16px; color: var(--text-light); font-size: 12px; }
        @media (max-width: 900px) {
            .course-hero { grid-template-columns: 1fr; }
            .week-content { grid-template-columns: 1fr; }
            .brand-bar { flex-direction: column; align-items: flex-start; }
        }
    </style>
</head>
<body>
    <div class="container">
        <div class="brand-bar">
            <div class="brand-meta">
                <img src="../hexadigitall-logo-transparent.png" alt="Hexadigitall logo">
                <div>
                    <div class="brand-name">Hexadigitall Academy (Hexadigitall Technologies)</div>
                    <a class="brand-link" href="https://www.hexadigitall.com">www.hexadigitall.com</a>
                </div>
            </div>
            <div class="qr-block">
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=180x180&data=https://www.hexadigitall.com/courses/${escapeHtml(slug)}" alt="Course QR code">
                <div class="qr-text">Scan to view the course page and enrollment options.</div>
            </div>
        </div>

        <div class="header">
            <h1>${escapeHtml(title)}</h1>
            <p class="subtitle">Comprehensive weekly curriculum designed for job-ready outcomes and portfolio-quality project work.</p>
            <div class="course-meta">
                <div class="meta-item"><strong>Duration:</strong> ${durationWeeks} Weeks</div>
                <div class="meta-item"><strong>Level:</strong> ${escapeHtml(level)}</div>
                <div class="meta-item"><strong>Study Time:</strong> 2 hours/week + labs</div>
                <div class="meta-item"><strong>Delivery:</strong> Mentored + Hands-on</div>
            </div>
        </div>

        <div class="course-hero">
            <div>
                <h2>Course Overview</h2>
                <p>This curriculum follows a week-by-week execution model with clear concepts, hands-on labs, and concrete deliverables every week to ensure measurable progression and strong portfolio outcomes.</p>
            </div>
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(title)} course image" onerror="this.style.display='none'">
        </div>

        <div class="section">
            <h2 class="section-title">Prerequisites & What You Should Know</h2>
            <div class="card">
                <ul>
                    <li>Basic digital literacy and confidence using web and desktop tools.</li>
                    <li>Commitment to weekly practice and completion of labs/projects.</li>
                    <li>Ability to read technical instructions and document your work clearly.</li>
                    <li>Willingness to iterate based on mentor/instructor feedback.</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Learning Outcomes</h2>
            <div class="card">
                <ul>
                    ${outcomes.map((x) => `<li>${escapeHtml(x)}</li>`).join('\n                    ')}
                    <li>Demonstrate repeatable implementation workflows from planning to delivery.</li>
                    <li>Communicate technical decisions and trade-offs professionally.</li>
                    <li>Build capstone-quality artifacts suitable for interviews and client reviews.</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Detailed Weekly Curriculum</h2>
${weeks}
        </div>

        <div class="section">
            <h2 class="section-title">Capstone Projects</h2>
            <div class="project-card">
                <h4>Project 1: Foundation Implementation</h4>
                <p>Build a robust implementation demonstrating core concepts and quality controls.</p>
                <ul>
                    <li>Project planning and architecture notes</li>
                    <li>Working implementation with validation evidence</li>
                    <li>Technical documentation and README</li>
                </ul>
            </div>
            <div class="project-card">
                <h4>Project 2: Production Scenario</h4>
                <p>Apply course knowledge to a realistic production-style use case.</p>
                <ul>
                    <li>Constraint-driven design decisions</li>
                    <li>Operational checks and troubleshooting log</li>
                    <li>Improvement recommendations</li>
                </ul>
            </div>
            <div class="project-card">
                <h4>Project 3: Final Capstone</h4>
                <p>Deliver an end-to-end capstone project combining architecture, implementation, and presentation.</p>
                <ul>
                    <li>End-to-end build with deployment/validation</li>
                    <li>Portfolio-ready narrative and demo assets</li>
                    <li>Retrospective with measurable outcomes</li>
                </ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Resources, Errata, and Next Steps</h2>
            <div class="card">
                <ul>
                    <li>Resources: https://www.hexadigitall.com/resources/devops-engineering-cloud-infrastructure-core</li>
                    <li>Errata: https://www.hexadigitall.com/errata/devops-engineering-cloud-infrastructure-core</li>
                    <li>Mentorships: https://www.hexadigitall.com/mentorships/courses/devops-engineering-cloud-infrastructure</li>
                    <li>Courses: https://www.hexadigitall.com/courses/devops-engineering-cloud-infrastructure</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2026 Hexadigitall Academy (Hexadigitall Technologies). Curriculum generated to gold-standard weekly format.</p>
        </div>
    </div>
</body>
</html>`;
}

function main() {
  if (!fs.existsSync(auditPath)) {
    throw new Error('curriculum-audit-report.json not found. Run the audit first.');
  }

  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const targets = [...(audit.severe || []), ...(audit.medium || [])].map((r) => r.file);

  let upgraded = 0;
  for (const file of targets) {
    const fullPath = path.join(curriculumDir, file);
    if (!fs.existsSync(fullPath)) continue;

    const html = fs.readFileSync(fullPath, 'utf8');
    const title = extractTitle(html, file);
    const durationWeeks = extractDurationWeeks(html);
    const level = extractLevel(html);
    const imageSrc = extractImage(html);
    const slug = slugFromFile(file);
    const learnBullets = extractLearnBullets(html);

    const rebuilt = renderCurriculum({
      title,
      durationWeeks,
      level,
      imageSrc,
      slug,
      learnBullets,
    });

    fs.writeFileSync(fullPath, rebuilt, 'utf8');
    upgraded += 1;
  }

  console.log(`Upgraded curriculum files: ${upgraded}`);
  console.log(`Targeted severe+medium files: ${targets.length}`);
}

main();
