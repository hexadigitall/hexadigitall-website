#!/usr/bin/env node

import fs from 'node:fs';
import path from 'node:path';
import { createClient } from '@sanity/client';

const root = process.cwd();
const curriculumDir = path.join(root, 'public', 'curriculums');
const auditPath = path.join(root, 'curriculum-audit-report.json');

const client = createClient({
  projectId: process.env.NEXT_PUBLIC_SANITY_PROJECT_ID || 'puzezel0',
  dataset: process.env.NEXT_PUBLIC_SANITY_DATASET || 'production',
  apiVersion: '2024-08-30',
  useCdn: false,
});

function escapeHtml(value = '') {
  return String(value)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/\"/g, '&quot;')
    .replace(/'/g, '&#39;');
}

function fileToSlug(file) {
  return file.replace(/^curriculum-/, '').replace(/\.html$/, '');
}

function textFromPortableBlock(block) {
  if (!block || typeof block !== 'object') return '';
  if (Array.isArray(block.children)) {
    return block.children.map((c) => (c && typeof c.text === 'string' ? c.text : '')).join('').trim();
  }
  return '';
}

function collectStrings(value, out = []) {
  if (value == null) return out;
  if (typeof value === 'string') {
    const t = value.trim();
    if (t) out.push(t);
    return out;
  }
  if (Array.isArray(value)) {
    for (const item of value) collectStrings(item, out);
    return out;
  }
  if (typeof value === 'object') {
    if (value._type === 'block') {
      const t = textFromPortableBlock(value);
      if (t) out.push(t);
      return out;
    }
    for (const v of Object.values(value)) collectStrings(v, out);
    return out;
  }
  return out;
}

function dedupe(arr) {
  const seen = new Set();
  const out = [];
  for (const item of arr) {
    const key = item.toLowerCase();
    if (!seen.has(key)) {
      seen.add(key);
      out.push(item);
    }
  }
  return out;
}

function cleanPoint(text = '') {
  return String(text)
    .replace(/^[-*\u2022\s]+/, '')
    .replace(/^[\u2705\u2714\u2713\u25CF\u25A0\u25AA\u25B6\u27A4\u2794\u27A1\uD83D\uDD39\uD83D\uDD38]+\s*/g, '')
    .trim();
}

function parseCourseSignals(course) {
  const bodyBlocks = Array.isArray(course.body) ? course.body : [];
  const lines = bodyBlocks.map((b) => ({ style: b.style || 'normal', text: textFromPortableBlock(b) })).filter((x) => x.text);

  const moduleTitles = dedupe(
    lines
      .map((x) => x.text)
      .filter((t) => /^Module\s+\d+\s*:/i.test(t))
      .map((t) => t.replace(/^Module\s+\d+\s*:\s*/i, '').trim())
      .filter(Boolean)
  );

  let currentSection = '';
  const learnPoints = [];
  for (const line of lines) {
    const t = line.text;
    if (/^Who This Course Is For$/i.test(t)) currentSection = 'audience';
    else if (/^What You'll Learn$/i.test(t)) currentSection = 'learn';
    else if (/^Course Outline$/i.test(t)) currentSection = 'outline';
    else if (/^Module\s+\d+\s*:/i.test(t)) {
      // ignore module lines here
    } else if (currentSection === 'learn' && t.length > 8) {
      learnPoints.push(cleanPoint(t));
    }
  }

  const prerequisites = dedupe(collectStrings(course.prerequisites)).slice(0, 8);
  const outcomes = dedupe([...collectStrings(course.learningOutcomes), ...learnPoints]).slice(0, 10);

  const overview = [course.overview, course.summary, course.description]
    .find((v) => typeof v === 'string' && v.trim()) ||
    `This course develops professional competence in ${course.title}.`;

  return {
    moduleTitles,
    learnPoints: dedupe(learnPoints).slice(0, 12),
    prerequisites,
    outcomes,
    overview,
  };
}

function fallbackModules(title, durationWeeks) {
  const base = [
    'Foundations and Core Principles',
    'Essential Tools and Workflow',
    'Implementation Patterns and Techniques',
    'Troubleshooting and Quality Assurance',
    'Production Readiness and Best Practices',
  ];
  const count = Math.max(4, Math.min(8, Math.ceil(durationWeeks / 3)));
  return base.slice(0, count).map((m) => `${title}: ${m}`);
}

function allocateWeeklyTopics(durationWeeks, modules, learnPoints) {
  const n = Math.max(8, durationWeeks || 12);
  const m = modules.length;
  const topics = [];

  for (let i = 0; i < n; i += 1) {
    const moduleIndex = Math.min(m - 1, Math.floor((i * m) / n));
    const module = modules[moduleIndex];
    const lp = learnPoints.length ? learnPoints[i % learnPoints.length] : '';
    const suffix = lp ? cleanPoint(lp.replace(/[.]+$/, '')) : 'Applied Practice';
    topics.push({ module, focus: suffix, moduleIndex });
  }
  return topics;
}

function toShortFocus(text) {
  if (!text) return 'Applied Practice';
  return text.length > 70 ? `${text.slice(0, 67).trim()}...` : text;
}

function phaseForWeek(i, totalWeeks) {
  const p = i / totalWeeks;
  if (p <= 0.2) return 'foundation';
  if (p <= 0.45) return 'build';
  if (p <= 0.7) return 'integration';
  if (p <= 0.9) return 'hardening';
  return 'capstone';
}

function weekContentByPhase(phase, title, moduleName, focus, weekNum) {
  const focusLower = focus.toLowerCase();
  const moduleLower = moduleName.toLowerCase();
  const idx = (weekNum - 1) % 4;

  const conceptMap = {
    foundation: [
      [
        `Define the core principles of ${moduleLower} and their role in ${title}.`,
        `Break down ${focusLower} into operational concepts and decision criteria.`,
        'Establish terminology, architecture context, and baseline success metrics.'
      ],
      [
        `Explain how ${moduleLower} maps to foundational workflows in ${title}.`,
        `Analyze ${focusLower} through examples, anti-patterns, and edge cases.`,
        'Create a baseline concept map covering inputs, outputs, and constraints.'
      ],
      [
        `Distinguish essential vs optional capabilities within ${moduleLower}.`,
        `Interpret ${focusLower} in relation to reliability, usability, and maintainability.`,
        'Document baseline assumptions and initial technical risks for this stage.'
      ],
      [
        `Frame ${moduleLower} objectives against expected professional outcomes.`,
        `Decompose ${focusLower} into sub-skills and measurable competencies.`,
        'Define clear acceptance criteria for foundational proficiency this week.'
      ],
    ],
    build: [
      [
        `Apply ${moduleLower} patterns to practical implementation workflows.`,
        `Translate ${focusLower} into concrete build tasks and quality checks.`,
        'Compare implementation options and justify selected trade-offs.'
      ],
      [
        `Construct working components centered on ${moduleLower}.`,
        `Operationalize ${focusLower} with reproducible implementation steps.`,
        'Evaluate complexity, maintainability, and testability of chosen approach.'
      ],
      [
        `Implement ${moduleLower} using standards aligned to production expectations.`,
        `Map ${focusLower} to code/config decisions and validation criteria.`,
        'Document build dependencies, assumptions, and fallback approaches.'
      ],
      [
        `Iterate on ${moduleLower} implementation with feedback-driven improvements.`,
        `Stress-test ${focusLower} against realistic usage and failure scenarios.`,
        'Capture trade-off rationale and versioned decision updates.'
      ],
    ],
    integration: [
      [
        `Integrate ${moduleLower} with adjacent components and dependencies.`,
        `Map ${focusLower} to cross-module workflows, handoffs, and interfaces.`,
        'Validate interoperability assumptions and integration boundaries.'
      ],
      [
        `Orchestrate ${moduleLower} behavior across the wider solution stack.`,
        `Connect ${focusLower} to upstream/downstream system interactions.`,
        'Confirm interface contracts and sequencing for stable operations.'
      ],
      [
        `Consolidate ${moduleLower} artifacts into a cohesive delivery path.`,
        `Relate ${focusLower} to integration performance and consistency checks.`,
        'Identify and resolve coupling issues revealed during integration.'
      ],
      [
        `Refine integration boundaries for ${moduleLower} based on test outcomes.`,
        `Align ${focusLower} implementation with cross-team dependency expectations.`,
        'Produce integration-ready standards and handover criteria.'
      ],
    ],
    hardening: [
      [
        `Harden ${moduleLower} for reliability, security, and maintainability.`,
        `Evaluate failure modes related to ${focusLower} and mitigation strategies.`,
        'Tune controls, observability, and operational readiness standards.'
      ],
      [
        `Strengthen ${moduleLower} using policy, monitoring, and resilience checks.`,
        `Assess ${focusLower} against threat, drift, and degradation scenarios.`,
        'Prioritize hardening actions by impact and implementation effort.'
      ],
      [
        `Apply defensive controls to stabilize ${moduleLower} behavior in production contexts.`,
        `Review ${focusLower} for compliance, traceability, and recovery coverage.`,
        'Validate hardening effectiveness through targeted verification runs.'
      ],
      [
        `Optimize ${moduleLower} for consistent operations under variable load/conditions.`,
        `Audit ${focusLower} decisions for reliability and governance alignment.`,
        'Close critical control gaps and document final hardening posture.'
      ],
    ],
    capstone: [
      [
        `Synthesize ${moduleLower} outcomes into end-to-end delivery quality.`,
        `Use ${focusLower} to defend architecture and implementation choices.`,
        'Prepare production-grade evidence, documentation, and presentation materials.'
      ],
      [
        `Demonstrate holistic mastery of ${moduleLower} within final solution delivery.`,
        `Position ${focusLower} as a core differentiator in your technical defense.`,
        'Finalize capstone artifacts to portfolio and review-board quality.'
      ],
      [
        `Validate the complete ${moduleLower} lifecycle from design to operations.`,
        `Show how ${focusLower} improves robustness, clarity, and delivery outcomes.`,
        'Produce an executive-ready summary backed by technical evidence.'
      ],
      [
        `Consolidate ${moduleLower} capabilities into a repeatable professional workflow.`,
        `Articulate ${focusLower} trade-offs and rationale under Q&A scrutiny.`,
        'Deliver final package with roadmap recommendations and next-step strategy.'
      ],
    ],
  };

  const labMap = {
    foundation: [
      [`Set up baseline environment and prerequisites for ${moduleLower}.`,`Run guided exercises focused on ${focusLower}.`,'Capture setup decisions, assumptions, and initial troubleshooting notes.'],
      [`Bootstrap tools and local/cloud workspace for ${moduleLower}.`,`Execute starter labs proving ${focusLower} fundamentals.`,'Log setup blockers and recovery steps with timestamps.'],
      [`Initialize practice environment using course-aligned standards.`,`Reproduce canonical examples for ${focusLower}.`,'Create lab journal with commands/config and outcomes.'],
      [`Configure foundational guardrails and starter templates.`,`Run validation probes for ${focusLower} behavior.`,'Capture baseline metrics and known limitations.'],
    ],
    build: [
      [`Implement a build task centered on ${moduleLower}.`,`Add validation checks and test cases for ${focusLower}.`,'Document build outcomes, defects, and remediation steps.'],
      [`Develop a functional component for ${moduleLower} requirements.`,`Automate verification steps for ${focusLower}.`,'Publish build notes with failed/successful iterations.'],
      [`Construct implementation increment aligned to sprint goals.`,`Run targeted tests for ${focusLower} edge behavior.`,'Track defect lifecycle from detection to closure.'],
      [`Refactor and optimize ${moduleLower} implementation artifacts.`,`Benchmark ${focusLower} execution against acceptance criteria.`,'Produce delta report showing improvements and residual gaps.'],
    ],
    integration: [
      [`Connect ${moduleLower} outputs to upstream/downstream components.`,`Execute integration test scenarios covering ${focusLower}.`,'Record interface mismatches and corrective actions.'],
      [`Wire ${moduleLower} into dependent workflows and services.`,`Run contract tests involving ${focusLower} transitions.`,'Document integration dependencies and rollback checkpoints.'],
      [`Merge module artifacts into cohesive integration branch.`,`Simulate cross-component usage for ${focusLower}.`,'Capture interoperability findings and fix prioritization.'],
      [`Stabilize integration paths for ${moduleLower} in near-production setup.`,`Validate ${focusLower} behavior under coordinated workflows.`,'Issue integration readiness sign-off with evidence links.'],
    ],
    hardening: [
      [`Introduce reliability/security hardening controls for ${moduleLower}.`,`Run stress, failure, or policy checks tied to ${focusLower}.`,'Produce hardening evidence with before/after observations.'],
      [`Apply resiliency and security policies around ${moduleLower}.`,`Test ${focusLower} against failure and abuse scenarios.`,'Log hardening changes and measurable risk reduction.'],
      [`Instrument ${moduleLower} with deeper observability hooks.`,`Verify ${focusLower} alerting and anomaly detection thresholds.`,'Deliver incident-response rehearsal notes and improvements.'],
      [`Tune operational controls and safeguards for sustained stability.`,`Execute governance/compliance checks for ${focusLower}.`,'Finalize hardening checklist with closure statuses.'],
    ],
    capstone: [
      [`Assemble final workflow demonstrating ${moduleLower} mastery.`,`Validate capstone acceptance criteria linked to ${focusLower}.`,'Finalize demo narrative, evidence bundle, and Q&A prep notes.'],
      [`Execute full end-to-end scenario centered on ${moduleLower}.`,`Prove ${focusLower} outcomes through reproducible demonstrations.`,'Prepare final submission package and evaluation rubric mapping.'],
      [`Run capstone dry-run with peer/instructor challenge cases.`,`Refine ${focusLower} implementation for clarity and robustness.`,'Compile defense deck, appendix, and technical artifacts.'],
      [`Deliver final capstone walkthrough under review conditions.`,`Address critical questions tied to ${focusLower} design decisions.`,'Submit polished portfolio artifacts and next-iteration roadmap.'],
    ],
  };

  const deliverableMap = {
    foundation: [
      [`Week ${weekNum} concept brief and glossary.`,`Configuration baseline and validation checklist for ${moduleLower}.`,'Lab evidence with annotated screenshots/log snippets.'],
      [`Week ${weekNum} setup report with environment fingerprints.`,`Reference notes explaining ${focusLower} core behavior.`,'Troubleshooting appendix with resolved blockers.'],
      [`Week ${weekNum} baseline architecture sketch.`,`Foundational validation matrix for ${moduleLower}.`,'Instructor/mentor review checklist completion.'],
      [`Week ${weekNum} starter implementation repository update.`,`Assumptions and constraints document for ${focusLower}.`,'Readiness note for transition to build phase.'],
    ],
    build: [
      [`Week ${weekNum} implementation artifact with reproducible steps.`,`Quality gate report covering tests/checks for ${focusLower}.`,'Issue log with fixes and lessons learned.'],
      [`Week ${weekNum} build package with versioned changes.`,`Automated test output summary and defect counts.`,'Code/config review notes with action items.'],
      [`Week ${weekNum} feature completion evidence.`,`Build quality scorecard and acceptance decisions.`,'Refinement backlog for unresolved findings.'],
      [`Week ${weekNum} optimized implementation snapshot.`,`Benchmark/validation results for ${focusLower}.`,'Decision record capturing major trade-offs.'],
    ],
    integration: [
      [`Week ${weekNum} integration diagram and dependency map.`,`Integration validation report with pass/fail criteria.`,'Risk register updates and mitigation follow-ups.'],
      [`Week ${weekNum} interface contract verification report.`,`Cross-component flow evidence and failure cases.`,'Dependency management and handoff checklist.'],
      [`Week ${weekNum} integrated release candidate artifact.`,`Interoperability test matrix and outcomes.`,'Known issues list with ownership and ETA.'],
      [`Week ${weekNum} integration readiness review pack.`,`Data/flow consistency validation notes.`,'Go/no-go recommendation with rationale.'],
    ],
    hardening: [
      [`Week ${weekNum} hardening checklist and control evidence.`,`Operational runbook updates for ${moduleLower}.`,'Performance/reliability/security findings with remediations.'],
      [`Week ${weekNum} risk-reduction summary and control deltas.`,`Monitoring/alert configuration export and rationale.`,'Incident drill outcomes and corrective actions.'],
      [`Week ${weekNum} compliance and policy attestation notes.`,`Resilience test evidence under failure scenarios.`,'Operational readiness score with open gaps.'],
      [`Week ${weekNum} final hardening sign-off draft.`,`Control coverage map for ${focusLower}.`,'Stability trend summary and recommendations.'],
    ],
    capstone: [
      [`Week ${weekNum} capstone milestone package.`,'Final architecture and implementation defense notes.','Portfolio-ready documentation and delivery summary.'],
      [`Week ${weekNum} capstone validation bundle.`,`Evaluation rubric mapping and score evidence.`,'Stakeholder-ready executive summary draft.'],
      [`Week ${weekNum} final demonstration assets.`,`Q&A prep sheet for ${focusLower} decisions.`,'Release-quality handover package.'],
      [`Week ${weekNum} final submission and retrospective.`,`Outcome metrics and lessons-learned report.`,'Roadmap for post-capstone improvements.'],
    ],
  };

  return {
    core: conceptMap[phase][idx],
    lab: labMap[phase][idx],
    deliverables: deliverableMap[phase][idx],
  };
}

function weekBlock(i, topic, title) {
  const topicLine = `${topic.module} - ${toShortFocus(topic.focus)}`;
  const phase = phaseForWeek(i, topic.totalWeeks || i);
  const content = weekContentByPhase(phase, title, topic.module, topic.focus, i);
  return `
            <div class="week-block">
                <div class="week-header">
                    <span class="week-number">Week ${i}</span>
                    <span class="week-duration">2 hours + labs</span>
                </div>
                <div class="week-topic">${escapeHtml(topicLine)}</div>
                <div class="week-content">
                    <div class="week-column">
                        <h4>Scope and Concepts</h4>
                        <ul>
                        ${content.core.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="week-column">
                        <h4>Hands-On Practical</h4>
                        <ul>
                        ${content.lab.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
                        </ul>
                    </div>
                    <div class="week-column">
                        <h4>Deliverables</h4>
                        <ul>
                        ${content.deliverables.map((x) => `<li>${escapeHtml(x)}</li>`).join('')}
                        </ul>
                    </div>
                </div>
            </div>`;
}

function extractImageFromExisting(html) {
  const m = html.match(/<img[^>]+src="([^"]+)"[^>]*course|<img[^>]+src="([^"]+)"/i);
  if (!m) return '../og-images/school-of-coding-and-development.jpg';
  return m[1] || m[2] || '../og-images/school-of-coding-and-development.jpg';
}

function renderCourse(course, existingHtml) {
  const durationWeeks = Math.max(8, Number(course.durationWeeks || 12));
  const level = course.level || 'Intermediate';
  const slug = course.slug?.current || fileToSlug(course.__fileName);
  const title = course.title || slug;
  const signals = parseCourseSignals(course);

  const modules = signals.moduleTitles.length ? signals.moduleTitles : fallbackModules(title, durationWeeks);
  const learnPoints = signals.learnPoints.length ? signals.learnPoints : signals.outcomes;
  const outcomes = signals.outcomes.length ? signals.outcomes : [
    `Develop practical mastery in ${title}.`,
    'Apply industry best practices to implementation and delivery.',
    'Demonstrate troubleshooting, optimization, and communication skills.',
  ];
  const prerequisites = signals.prerequisites.length ? signals.prerequisites : [
    'Commitment to weekly lab practice and implementation assignments.',
    'Basic digital literacy and familiarity with standard development tools.',
    'Willingness to document work and iterate based on feedback.',
  ];

  const weekly = allocateWeeklyTopics(durationWeeks, modules, learnPoints)
    .map((topic, idx) => weekBlock(idx + 1, { ...topic, totalWeeks: durationWeeks }, title))
    .join('\n');

  const imageSrc = extractImageFromExisting(existingHtml);

  const p1 = modules[0] || `${title} Foundation`;
  const p2 = modules[Math.floor(modules.length / 2)] || `${title} Integration`;
  const p3 = modules[modules.length - 1] || `${title} Capstone`;

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
            --primary-color: #0078D4;
            --secondary-color: #50E6FF;
            --dark-blue: #002050;
            --text-dark: #1F1F1F;
            --text-light: #605E5C;
            --bg-light: #F5F5F5;
            --bg-white: #FFFFFF;
            --border-color: #EDEBE9;
        }
        body { font-family: 'Inter', sans-serif; line-height: 1.6; color: var(--text-dark); background: var(--bg-white); font-size: 14px; }
        .container { max-width: 1200px; margin: 0 auto; padding: 40px; }
        .brand-bar { display: flex; align-items: center; justify-content: space-between; gap: 20px; background: var(--bg-white); border: 1px solid var(--border-color); border-radius: 12px; padding: 16px 20px; margin-bottom: 20px; box-shadow: 0 4px 18px rgba(0, 32, 80, 0.08); }
        .brand-meta { display: flex; align-items: center; gap: 16px; }
        .brand-meta img { width: 60px; height: auto; }
        .brand-name { font-family: 'Space Grotesk', sans-serif; font-size: 18px; font-weight: 700; color: var(--dark-blue); }
        .brand-link { color: var(--primary-color); font-weight: 600; text-decoration: none; }
        .qr-block { display: flex; align-items: center; gap: 12px; background: var(--bg-light); padding: 10px 14px; border-radius: 10px; border: 1px solid var(--border-color); }
        .qr-block img { width: 86px; height: 86px; }
        .qr-text { font-size: 12px; color: var(--text-light); max-width: 220px; line-height: 1.5; }
        .course-hero { background: linear-gradient(135deg, #E8F4FD 0%, #F5F9FF 100%); border: 1px solid var(--border-color); border-radius: 12px; padding: 18px; margin-bottom: 24px; display: grid; grid-template-columns: 1fr 320px; gap: 20px; align-items: center; }
        .course-hero img { width: 100%; border-radius: 12px; border: 1px solid var(--border-color); }
        .course-hero h2 { font-family: 'Space Grotesk', sans-serif; color: var(--dark-blue); margin-bottom: 10px; font-size: 22px; }
        .header { background: linear-gradient(135deg, var(--dark-blue) 0%, var(--primary-color) 100%); color: white; padding: 60px 40px; border-radius: 12px; margin-bottom: 40px; box-shadow: 0 10px 30px rgba(0, 120, 212, 0.2); }
        .header h1 { font-family: 'Space Grotesk', sans-serif; font-size: 42px; font-weight: 700; margin-bottom: 16px; letter-spacing: -0.5px; }
        .header .subtitle { font-size: 18px; opacity: 0.95; margin-bottom: 24px; }
        .course-meta { display: flex; flex-wrap: wrap; gap: 24px; margin-top: 32px; }
        .meta-item { display: flex; align-items: center; gap: 8px; background: rgba(255, 255, 255, 0.15); padding: 12px 20px; border-radius: 8px; }
        .section { margin-bottom: 48px; break-inside: avoid; }
        .section-title { font-family: 'Space Grotesk', sans-serif; font-size: 28px; color: var(--dark-blue); margin-bottom: 24px; padding-bottom: 12px; border-bottom: 3px solid var(--primary-color); }
        .card { background: var(--bg-white); border: 1px solid var(--border-color); border-radius: 10px; padding: 24px; margin-bottom: 16px; }
        .card ul { margin-left: 20px; }
        .card li { margin: 6px 0; }
        .week-block { border: 1px solid var(--border-color); border-left: 6px solid var(--primary-color); border-radius: 12px; padding: 16px; margin-bottom: 14px; }
        .week-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 10px; }
        .week-number { font-weight: 700; color: var(--dark-blue); }
        .week-duration { font-size: 12px; color: var(--text-light); }
        .week-topic { color: var(--primary-color); font-family: 'Space Grotesk', sans-serif; font-size: 18px; margin-bottom: 10px; }
        .week-content { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 12px; }
        .week-column { background: #f8fbff; border: 1px solid var(--border-color); border-radius: 8px; padding: 10px; }
        .week-column h4 { color: var(--dark-blue); font-size: 13px; margin-bottom: 8px; }
        .week-column ul { margin-left: 16px; }
        .week-column li { font-size: 13px; margin: 5px 0; }
        .project-card { border: 1px solid var(--border-color); border-radius: 10px; padding: 16px; margin-bottom: 12px; background: linear-gradient(135deg, #f3f8ff 0%, #ffffff 100%); }
        .project-card h4 { color: var(--dark-blue); margin-bottom: 8px; }
        .project-card p { color: var(--text-light); margin-bottom: 8px; }
        .project-card ul { margin-left: 20px; }
        .footer { margin-top: 24px; padding-top: 16px; border-top: 1px solid var(--border-color); color: var(--text-light); font-size: 12px; }
        @media (max-width: 900px) { .course-hero { grid-template-columns: 1fr; } .week-content { grid-template-columns: 1fr; } }
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
                <img src="https://api.qrserver.com/v1/create-qr-code/?size=120x120&data=https://www.hexadigitall.com/courses/${escapeHtml(slug)}" alt="Course QR Code">
                <div class="qr-text">Scan to view full course details and enrollment options.</div>
            </div>
        </div>

        <div class="course-hero">
            <div>
                <h2>${escapeHtml(title)}</h2>
                <p>${escapeHtml(signals.overview)}</p>
            </div>
            <img src="${escapeHtml(imageSrc)}" alt="${escapeHtml(title)}" onerror="this.style.display='none'">
        </div>

        <div class="header">
            <h1>${escapeHtml(title)}</h1>
            <p class="subtitle">Course-specific professional curriculum with detailed weekly scope, labs, and deliverables.</p>
            <div class="course-meta">
                <div class="meta-item"><strong>Duration:</strong> ${durationWeeks} Weeks</div>
                <div class="meta-item"><strong>Level:</strong> ${escapeHtml(level)}</div>
                <div class="meta-item"><strong>Study Time:</strong> ${escapeHtml(course.hoursPerWeek || 2)} hours/week + labs</div>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Prerequisites & What You Should Know</h2>
            <div class="card">
                <ul>
                    ${prerequisites.map((x) => `<li>${escapeHtml(x)}</li>`).join('\n                    ')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Learning Outcomes</h2>
            <div class="card">
                <ul>
                    ${outcomes.map((x) => `<li>${escapeHtml(x)}</li>`).join('\n                    ')}
                </ul>
            </div>
        </div>

        <div class="section">
            <h2 class="section-title">Detailed Weekly Curriculum</h2>
${weekly}
        </div>

        <div class="section">
            <h2 class="section-title">Capstone Projects</h2>
            <div class="project-card">
                <h4>Project 1: ${escapeHtml(p1)} Implementation</h4>
                <p>Build a working implementation around the foundational module topics with full validation and documentation.</p>
                <ul>
                    <li>Architecture and setup documentation</li>
                    <li>Working implementation with evidence</li>
                    <li>Quality and troubleshooting log</li>
                </ul>
            </div>
            <div class="project-card">
                <h4>Project 2: ${escapeHtml(p2)} Integration</h4>
                <p>Integrate mid-course concepts into a cohesive, production-style workflow and present trade-offs.</p>
                <ul>
                    <li>Integration design and implementation</li>
                    <li>Testing and operational checks</li>
                    <li>Risk and mitigation notes</li>
                </ul>
            </div>
            <div class="project-card">
                <h4>Project 3: Final Capstone - ${escapeHtml(p3)}</h4>
                <p>Deliver a complete capstone demonstrating end-to-end mastery of the course content.</p>
                <ul>
                    <li>End-to-end solution with reproducible steps</li>
                    <li>Professional presentation and walkthrough</li>
                    <li>Portfolio-ready final artifacts</li>
                </ul>
            </div>
        </div>

        <div class="footer">
            <p>&copy; 2026 Hexadigitall Academy (Hexadigitall Technologies). Curriculum authored for ${escapeHtml(title)}.</p>
        </div>
    </div>
</body>
</html>`;
}

async function main() {
  const audit = JSON.parse(fs.readFileSync(auditPath, 'utf8'));
  const files = [...(audit.severe || []), ...(audit.medium || [])].map((r) => r.file);
  const slugs = files.map(fileToSlug);

  const query = `*[_type == "course" && slug.current in $slugs]{
    title,
    slug,
    overview,
    summary,
    description,
    level,
    duration,
    durationWeeks,
    hoursPerWeek,
    modules,
    lessons,
    prerequisites,
    learningOutcomes,
    body
  }`;

  const courses = await client.fetch(query, { slugs });
  const bySlug = new Map(courses.map((c) => [c.slug?.current, c]));

  let rebuilt = 0;
  let missing = 0;

  for (const file of files) {
    const slug = fileToSlug(file);
    const course = bySlug.get(slug);
    const full = path.join(curriculumDir, file);
    if (!course || !fs.existsSync(full)) {
      missing += 1;
      continue;
    }

    course.__fileName = file;
    const existingHtml = fs.readFileSync(full, 'utf8');
    const nextHtml = renderCourse(course, existingHtml);
    fs.writeFileSync(full, nextHtml, 'utf8');
    rebuilt += 1;
  }

  console.log(`Course-specific rebuild complete. Rebuilt: ${rebuilt}, Missing: ${missing}, Targeted: ${files.length}`);
}

main().catch((err) => {
  console.error('Failed to rebuild curriculums course-specific:', err.message);
  process.exit(1);
});
