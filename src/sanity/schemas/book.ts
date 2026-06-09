// src/sanity/schemas/book.ts
import { defineField, defineType } from 'sanity'

export default defineType({
  name: 'book',
  title: 'Textbook',
  type: 'document',
  fields: [
    // ── Core identity ──────────────────────────────────
    defineField({
      name: 'title',
      title: 'Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'subtitle',
      title: 'Subtitle',
      type: 'string',
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'edition',
      title: 'Edition',
      type: 'string',
      description: 'e.g. "1st Edition", "2nd Edition"',
      initialValue: '1st Edition',
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN-13',
      type: 'string',
      description: '13-digit ISBN (e.g. 978-XXXXXXXXXX)',
    }),
    defineField({
      name: 'publishedAt',
      title: 'Publication Date',
      type: 'date',
    }),
    defineField({
      name: 'authors',
      title: 'Authors',
      type: 'array',
      of: [{ type: 'string' }],
      validation: (Rule) => Rule.required().min(1),
    }),

    // ── Visual ────────────────────────────────────────
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Book cover (recommended: 800x1080, portrait ratio)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImageAlt',
      title: 'Cover Image Alt Text',
      type: 'string',
    }),

    // ── Content ───────────────────────────────────────
    defineField({
      name: 'description',
      title: 'Short Description',
      type: 'text',
      rows: 3,
      description: 'One paragraph summary shown on store listing card',
      validation: (Rule) => Rule.required().max(300),
    }),
    defineField({
      name: 'longDescription',
      title: 'Full Description',
      type: 'array',
      of: [{ type: 'block' }],
      description: 'Rich text used on the individual book page',
    }),
    defineField({
      name: 'tableOfContents',
      title: 'Table of Contents',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'chapter', title: 'Chapter Number', type: 'number' },
            { name: 'title', title: 'Chapter Title', type: 'string' },
            { name: 'pages', title: 'Page Range', type: 'string', description: 'e.g. "1–24"' },
          ],
        },
      ],
    }),
    defineField({
      name: 'pageCount',
      title: 'Number of Pages',
      type: 'number',
    }),
    defineField({
      name: 'level',
      title: 'Difficulty Level',
      type: 'string',
      options: {
        list: [
          { title: 'Beginner', value: 'beginner' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
          { title: 'All Levels', value: 'all' },
        ],
        layout: 'radio',
      },
      initialValue: 'beginner',
    }),

    // ── Related course ────────────────────────────────
    defineField({
      name: 'relatedCourse',
      title: 'Related Course',
      type: 'reference',
      to: [{ type: 'course' }],
      description: 'Link to the Hexadigitall course this book accompanies',
    }),

    // ── Status & availability ─────────────────────────
    defineField({
      name: 'status',
      title: 'Availability Status',
      type: 'string',
      options: {
        list: [
          { title: 'Coming Soon', value: 'coming_soon' },
          { title: 'Available', value: 'available' },
          { title: 'Out of Stock', value: 'out_of_stock' },
          { title: 'Discontinued', value: 'discontinued' },
        ],
        layout: 'radio',
      },
      initialValue: 'coming_soon',
      validation: (Rule) => Rule.required(),
    }),

    // ── External Stores ─────────────────────────────────
    defineField({
      name: 'storeLinks',
      title: 'External Store Links',
      type: 'object',
      description: 'URLs to external platforms where this book can be purchased',
      fields: [
        defineField({
          name: 'amazon',
          title: 'Amazon URL',
          type: 'url',
          description: 'Link to Amazon store page (if available)'
        }),
        defineField({
          name: 'selar',
          title: 'Selar URL',
          type: 'url',
          description: 'Link to Selar store page (if available)'
        }),
        defineField({
          name: 'gumroad',
          title: 'Gumroad URL',
          type: 'url',
          description: 'Link to Gumroad store page (if available)'
        })
      ]
    }),

    // ── Direct Download Configuration ───────────────────
    defineField({
      name: 'directDownloadEnabled',
      title: 'Enable Direct Download (Hexadigitall Portal)',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'hasStudentVersion',
      title: 'Has Student Version',
      type: 'boolean',
      initialValue: true,
      hidden: ({ parent }) => !parent?.directDownloadEnabled
    }),
    defineField({
      name: 'studentFile',
      title: 'Student Version File (PDF)',
      type: 'file',
      options: { accept: 'application/pdf' },
      hidden: ({ parent }) => !parent?.hasStudentVersion || !parent?.directDownloadEnabled
    }),
    defineField({
      name: 'hasTeacherVersion',
      title: 'Has Teacher/Instructor Version',
      type: 'boolean',
      initialValue: false,
      hidden: ({ parent }) => !parent?.directDownloadEnabled
    }),
    defineField({
      name: 'teacherFile',
      title: 'Teacher Version File (PDF/HTML)',
      type: 'file',
      hidden: ({ parent }) => !parent?.hasTeacherVersion || !parent?.directDownloadEnabled
    }),

    // ── Pricing (PPP Model) ─────────────────────────────
    defineField({
      name: 'pricing',
      title: 'Direct Download Pricing',
      type: 'object',
      hidden: ({ parent }) => !parent?.directDownloadEnabled,
      fields: [
        defineField({
          name: 'usd',
          title: 'Standard Price (USD)',
          type: 'number',
          description: 'Standard international price (e.g. 40 - 65)',
          validation: Rule => Rule.min(0)
        }),
        defineField({
          name: 'ngn',
          title: 'Nigerian Price (NGN)',
          type: 'number',
          description: 'PPP discounted price for Nigeria (e.g. 30000 - 50000)',
          validation: Rule => Rule.min(0)
        })
      ]
    }),

    // ── Errata ────────────────────────────────────────
    defineField({
      name: 'errata',
      title: 'Errata (Corrections)',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'reportedAt', title: 'Reported Date', type: 'date' },
            { name: 'page', title: 'Page Number', type: 'number' },
            { name: 'location', title: 'Location', type: 'string', description: 'e.g. "Chapter 3, line 12" or "Figure 2.4"' },
            { name: 'original', title: 'Original (Incorrect) Text', type: 'text', rows: 2 },
            { name: 'correction', title: 'Correction', type: 'text', rows: 2 },
            { name: 'fixedInEdition', title: 'Fixed in Edition', type: 'string', description: 'Leave blank if not yet fixed in print' },
            {
              name: 'severity',
              title: 'Severity',
              type: 'string',
              options: {
                list: [
                  { title: 'Typo / Minor', value: 'minor' },
                  { title: 'Content Error', value: 'content' },
                  { title: 'Code Error', value: 'code' },
                  { title: 'Critical', value: 'critical' },
                ],
                layout: 'radio',
              },
              initialValue: 'minor',
            },
          ],
          preview: {
            select: { title: 'location', subtitle: 'correction' },
          },
        },
      ],
    }),

    // ── Resources ─────────────────────────────────────
    defineField({
      name: 'resources',
      title: 'Companion Resources',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'title', title: 'Resource Title', type: 'string' },
            { name: 'description', title: 'Description', type: 'text', rows: 2 },
            {
              name: 'type',
              title: 'Resource Type',
              type: 'string',
              options: {
                list: [
                  { title: 'Code Repository (GitHub)', value: 'code' },
                  { title: 'Downloadable File', value: 'file' },
                  { title: 'Dataset / Spreadsheet', value: 'dataset' },
                  { title: 'Slide Deck', value: 'slides' },
                  { title: 'Answer Key (Student)', value: 'answer_student' },
                  { title: 'Answer Key (Instructor)', value: 'answer_instructor' },
                  { title: 'Video Supplement', value: 'video' },
                  { title: 'External Link', value: 'link' },
                ],
              },
            },
            { name: 'url', title: 'External URL (GitHub, YouTube, etc.)', type: 'url' },
            {
              name: 'file',
              title: 'Uploaded File',
              type: 'file',
              description: 'Upload PDF, XLSX, or ZIP directly to Sanity',
            },
            {
              name: 'gated',
              title: 'Instructor Only?',
              type: 'boolean',
              description: 'If true, user must submit instructor verification form to access',
              initialValue: false,
            },
            {
              name: 'chapter',
              title: 'Chapter (optional)',
              type: 'number',
              description: 'Associate this resource with a specific chapter',
            },
          ],
          preview: {
            select: { title: 'title', subtitle: 'type' },
          },
        },
      ],
    }),

    // ── SEO ───────────────────────────────────────────
    defineField({
      name: 'ogTitle',
      title: 'OG Title',
      type: 'string',
    }),
    defineField({
      name: 'ogDescription',
      title: 'OG Description',
      type: 'text',
      rows: 2,
    }),
    defineField({
      name: 'ogImage',
      title: 'OG Image',
      type: 'image',
      options: { hotspot: true },
      description: 'Social share image (recommended: 1200x630)',
    }),
  ],

  preview: {
    select: {
      title: 'title',
      subtitle: 'edition',
      media: 'coverImage',
    },
  },
})
