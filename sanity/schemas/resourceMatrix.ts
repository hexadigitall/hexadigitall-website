import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'resourceMatrix',
  title: 'Section C Resource Tracker Matrix',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Resource/Matrix Identifier Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matrixId',
      title: 'Unique Section Reference Code',
      type: 'string',
      description: 'e.g., FVMMD-LIN-M1 (Infrastructure of the Self Matrix)',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'resourceType',
      title: 'Medium Classification',
      type: 'string',
      options: {
        list: [
          { title: 'Clean Tracking Template (Interactive)', value: 'template' },
          { title: 'Educational Roadmap Manual (PDF)', value: 'roadmap' },
          { title: 'Architecture Roundtable Workshop Entry', value: 'workshop' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secureAssetUrl',
      title: 'Protected Distribution File Link',
      type: 'url',
      description: 'The secure digital target distributed to validated book token holders.',
    }),
    defineField({
      name: 'requiresVerification',
      title: 'Enforce Book Proof of Purchase Entry Gate',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
