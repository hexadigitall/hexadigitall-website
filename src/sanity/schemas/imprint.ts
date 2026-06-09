import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'imprint',
  title: 'Digital Imprint',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Book Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'coverImage',
      title: 'Cover Image',
      type: 'image',
      options: { hotspot: true },
    }),
    defineField({
      name: 'isbn',
      title: 'ISBN',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Synopsis',
      type: 'text',
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
      initialValue: 'available',
      validation: (Rule) => Rule.required(),
    }),

    // ── External Stores ─────────────────────────────────
    defineField({
      name: 'storeLinks',
      title: 'External Store Links',
      type: 'object',
      description: 'URLs to external platforms where this imprint can be purchased',
      fields: [
        defineField({
          name: 'amazon',
          title: 'Amazon URL',
          type: 'url',
        }),
        defineField({
          name: 'selar',
          title: 'Selar URL',
          type: 'url',
        }),
        defineField({
          name: 'gumroad',
          title: 'Gumroad URL',
          type: 'url',
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
          description: 'Standard international price',
          validation: Rule => Rule.min(0)
        }),
        defineField({
          name: 'ngn',
          title: 'Nigerian Price (NGN)',
          type: 'number',
          description: 'PPP discounted price for Nigeria',
          validation: Rule => Rule.min(0)
        })
      ]
    }),
    defineField({
      name: 'allowCopyRegistration',
      title: 'Allow Readers to Register Physical Copies',
      type: 'boolean',
      initialValue: true,
    }),
    defineField({
      name: 'assets',
      title: 'Companion Digital Assets',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'asset' }] }],
    }),
  ],
});
