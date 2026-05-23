import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'publication',
  title: 'Publication Knowledge Graph Registry',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Complete Literary Work Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Route Slug Token',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Author Profile Node',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isbn',
      title: 'International Standard Book Number',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Manuscript Abstract / Index Overview',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Base Cleardown Price (NGN/USD Equivalent)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'embeddedResources',
      title: 'Section C Appendix Matrix List Links',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'resourceMatrix' }] }],
    }),
  ],
});
