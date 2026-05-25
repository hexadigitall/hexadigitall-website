import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'resourceMatrix',
  title: 'Section C Resource Tracker Matrix',
  type: 'document',
  fields: [
    defineField({
      name: 'title',
      title: 'Resource Matrix Identifier Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'matrixId',
      title: 'Unique Appendix System Reference Code',
      type: 'string',
      description: 'e.g., FVMMD-LIN-M3 (The Infrastructure of the Self Matrix Series)',
      validation: (Rule) => Rule.required().regex(/^FVMMD-[A-Z0-BA-Z0-9]+-M[0-9]+$/, {
        name: 'Academy Standard Reference Identifier Match',
        invert: false,
      }),
    }),
    defineField({
      name: 'resourceType',
      title: 'Asset Type Medium Classification',
      type: 'string',
      options: {
        list: [
          { title: 'Clean Interactive Tracking Template', value: 'template' },
          { title: 'Educational Roadmap Manual (PDF Format)', value: 'roadmap' },
          { title: 'Architecture Roundtable Workshop Entry Node', value: 'workshop' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'secureAssetUrl',
      title: 'Protected Distribution File Egress Link',
      type: 'url',
      validation: (Rule) => Rule.required().uri({ scheme: ['https'] }),
    }),
    defineField({
      name: 'requiresVerification',
      title: 'Enforce Book Ownership Verification Filter Gateway',
      type: 'boolean',
      initialValue: true,
    }),
  ],
});
