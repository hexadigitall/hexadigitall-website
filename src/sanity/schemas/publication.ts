import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'publication',
  title: 'Publication Knowledge Graph Ledger',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Complete Literary Masterpiece Title',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'URL Router Segment Target Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'author',
      title: 'Imprint Origin Author Node',
      type: 'reference',
      to: [{ type: 'author' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'isbn',
      title: 'International Standard Book Number String',
      type: 'string',
    }),
    defineField({
      name: 'description',
      title: 'Manuscript Synopsis / Structural Index Abstract',
      type: 'text',
    }),
    defineField({
      name: 'price',
      title: 'Fulfillment Clearing Base Price (NGN Matrix Minimum Integer)',
      type: 'number',
      validation: (Rule) => Rule.required().min(0),
    }),
    defineField({
      name: 'allowCopyRegistration',
      title: 'Allow Copy Registration',
      type: 'boolean',
      description: 'Enable this to allow readers to register their physical/purchased copies on the site.',
      initialValue: true,
    }),
    defineField({
      name: 'embeddedResources',
      title: 'Section C Appendix Matrix List Assemblies',
      type: 'array',
      of: [{ type: 'reference', to: [{ type: 'resourceMatrix' }] }],
    }),
  ],
});
