(function () {
  const cache = new Map();

  function escapeHtml(value) {
    return String(value)
      .replace(/&/g, '&amp;')
      .replace(/</g, '&lt;')
      .replace(/>/g, '&gt;')
      .replace(/"/g, '&quot;')
      .replace(/'/g, '&#39;');
  }

  async function fetchAssessments(courseSlug) {
    if (!cache.has(courseSlug)) {
      cache.set(
        courseSlug,
        fetch(`/api/textbook-assessments/${courseSlug}`)
          .then((response) => {
            if (!response.ok) throw new Error(`Failed to load assessments for ${courseSlug}`);
            return response.json();
          })
          .then((payload) => payload.assessments || []),
      );
    }

    return cache.get(courseSlug);
  }

  function renderQuestion(question, index) {
    const correct = question.options.find((option) => option.id === question.correctOptionId);
    const options = question.options
      .map((option) => `<li>${option.id.toUpperCase()}) ${escapeHtml(option.text)}</li>`)
      .join('');

    return `
      <div class="question-item" style="border: 1px solid #dbeafe; border-radius: 12px; padding: 18px; margin-bottom: 18px; background: #ffffff; break-inside: avoid; page-break-inside: avoid;">
        <div class="question-text" style="font-weight: 700; color: #0f172a; line-height: 1.7;">${index + 1}. ${escapeHtml(question.prompt)}</div>
        <ul style="list-style: none; padding-left: 0; margin: 14px 0; color: #334155; line-height: 1.7;">
          ${options}
        </ul>
        <div class="answer-text" style="background: #eff6ff; border-left: 4px solid #2563eb; padding: 12px 14px; border-radius: 8px; color: #1e3a8a; line-height: 1.7; font-size: 0.95rem;">
          <strong>Correct Answer:</strong> ${question.correctOptionId.toUpperCase()}${correct ? `, ${escapeHtml(correct.text)}` : ''}<br>
          <strong>Why:</strong> ${escapeHtml(question.explanation)}
        </div>
      </div>`;
  }

  function renderAssessment(assessment) {
    const examUrl = `/courses/${assessment.courseSlug}/assessments/${assessment.slug}`;
    const questions = assessment.questions.map(renderQuestion).join('');

    return `
      <div class="info-box" style="margin-top: 18px; background: #f8fbff; border-left: 4px solid #2563eb; border: 1px solid #bfdbfe;">
        <div style="font-weight: 700; color: #1e3a8a; margin-bottom: 8px;">Embedded ${escapeHtml(assessment.phaseLabel)} Assessment</div>
        <p style="margin: 0 0 8px 0; color: #1e3a8a; line-height: 1.7;">This textbook study-mode version mirrors the live timed assessment for ${escapeHtml(assessment.phaseLabel)}. Review the questions, answer choices, and rationale here before taking the exam-mode version on the platform.</p>
        <p style="margin: 0 0 8px 0; color: #1e3a8a; line-height: 1.7;"><strong>Exam-mode URL:</strong> <a href="${examUrl}" style="color: #1d4ed8; text-decoration: underline; font-weight: 600;">${examUrl}</a></p>
        <p style="margin: 0; color: #475569; line-height: 1.7;"><strong>Format:</strong> ${assessment.totalQuestions} questions, ${assessment.durationMinutes} minutes, pass mark ${assessment.passPercentage}%.</p>
        <div class="question-list" style="margin-top: 18px;">
          ${questions}
        </div>
      </div>`;
  }

  async function renderContainer(container) {
    const courseSlug = container.dataset.textbookAssessmentCourse;
    if (!courseSlug) return;

    const includeSlugs = (container.dataset.textbookAssessmentInclude || '')
      .split(',')
      .map((item) => item.trim())
      .filter(Boolean);

    const excludeSlugs = new Set(
      (container.dataset.textbookAssessmentExclude || '')
        .split(',')
        .map((item) => item.trim())
        .filter(Boolean),
    );

    try {
      const assessments = await fetchAssessments(courseSlug);
      let filteredAssessments = assessments.filter((assessment) => !excludeSlugs.has(assessment.slug));

      if (includeSlugs.length > 0) {
        filteredAssessments = includeSlugs
          .map((slug) => filteredAssessments.find((assessment) => assessment.slug === slug))
          .filter(Boolean);
      }

      container.innerHTML = filteredAssessments.map(renderAssessment).join('');
    } catch (error) {
      console.error(error);
      container.innerHTML = '<div class="warning-box" style="margin-top: 18px;"><div class="warning-title">Assessment Content Unavailable</div><p style="margin: 0;">The embedded study-mode assessment could not be loaded. Use the exam-mode link above.</p></div>';
    }
  }

  function boot() {
    const containers = Array.from(document.querySelectorAll('[data-textbook-assessment-course]'));
    containers.forEach((container) => {
      renderContainer(container);
    });
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', boot);
  } else {
    boot();
  }
})();