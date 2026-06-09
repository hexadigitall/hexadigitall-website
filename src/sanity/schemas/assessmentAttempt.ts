import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'assessmentAttempt',
  title: 'Assessment Attempt',
  type: 'document',
  fields: [
    defineField({ name: 'courseSlug', title: 'Course Slug', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'assessmentSlug', title: 'Assessment Slug', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'assessmentTitle', title: 'Assessment Title', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({ name: 'phaseLabel', title: 'Phase Label', type: 'string', validation: (Rule) => Rule.required() }),
    defineField({
      name: 'studentId',
      title: 'Student',
      type: 'reference',
      to: [{ type: 'user' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'enrollmentId',
      title: 'Enrollment',
      type: 'reference',
      to: [{ type: 'enrollment' }],
    }),
    defineField({ name: 'studentNameSnapshot', title: 'Student Name Snapshot', type: 'string' }),
    defineField({ name: 'studentEmailSnapshot', title: 'Student Email Snapshot', type: 'string' }),
    defineField({ name: 'startedAt', title: 'Started At', type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'expiresAt', title: 'Expires At', type: 'datetime', validation: (Rule) => Rule.required() }),
    defineField({ name: 'submittedAt', title: 'Submitted At', type: 'datetime' }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Submitted', value: 'submitted' },
          { title: 'Expired', value: 'expired' },
        ],
      },
      initialValue: 'in_progress',
      validation: (Rule) => Rule.required(),
    }),
    defineField({ name: 'durationMinutes', title: 'Duration Minutes', type: 'number', validation: (Rule) => Rule.required().min(1) }),
    defineField({ name: 'passPercentage', title: 'Pass Percentage', type: 'number', validation: (Rule) => Rule.required().min(1).max(100) }),
    defineField({ name: 'totalQuestions', title: 'Total Questions', type: 'number', validation: (Rule) => Rule.required().min(1) }),
    defineField({
      name: 'answers',
      title: 'Answers',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'questionId', title: 'Question ID', type: 'string' },
            { name: 'selectedOptionId', title: 'Selected Option ID', type: 'string' },
          ],
        },
      ],
    }),
    defineField({ name: 'scoreRaw', title: 'Score Raw', type: 'number' }),
    defineField({ name: 'scorePercent', title: 'Score Percent', type: 'number' }),
    defineField({ name: 'passed', title: 'Passed', type: 'boolean' }),
    defineField({ name: 'timeSpentSeconds', title: 'Time Spent Seconds', type: 'number' }),
    defineField({ name: 'attemptNumber', title: 'Attempt Number', type: 'number', initialValue: 1 }),
    defineField({ name: 'resultCode', title: 'Result Code', type: 'string' }),
  ],
  preview: {
    select: {
      title: 'assessmentTitle',
      subtitle: 'studentNameSnapshot',
      status: 'status',
      score: 'scorePercent',
    },
    prepare({ title, subtitle, status, score }) {
      const scoreText = typeof score === 'number' ? ` | ${score}%` : ''
      return {
        title,
        subtitle: `${subtitle || 'Unknown Student'} | ${status || 'unknown'}${scoreText}`,
      }
    },
  },
})
