import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'asset',
  title: 'Digital Asset',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Asset Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'slug',
      title: 'Slug',
      type: 'slug',
      options: { source: 'title', maxLength: 96 },
    }),
    defineField({
      name: 'priceNGN',
      title: 'Asset Price (₦)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'priceUSD',
      title: 'Asset Price ($)',
      type: 'number',
      initialValue: 0,
    }),
    defineField({
      name: 'matrixId',
      title: 'Reference Code',
      type: 'string',
      description: 'e.g., FVMMD-LIN-M3',
    }),
    defineField({
      name: 'resourceType',
      title: 'Type',
      type: 'string',
      options: {
        list: [
          { title: 'Interactive Template', value: 'template' },
          { title: 'Educational Roadmap (PDF)', value: 'roadmap' },
          { title: 'Workshop Guide', value: 'workshop' },
          { title: 'Companion Tool (HTML)', value: 'tool' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'file',
      title: 'File Upload (PDF/HTML/XLSX)',
      type: 'file',
    }),
    defineField({
      name: 'externalUrl',
      title: 'External Link',
      type: 'url',
    }),
    defineField({
      name: 'requiresVerification',
      title: 'Requires Purchase',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
