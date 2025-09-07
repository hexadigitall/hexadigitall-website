// src/sanity/schemas/pendingEnrollment.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pendingEnrollment',
  title: 'Pending Enrollment',
  type: 'document',
  fields: [
    defineField({
      name: 'courseId',
      title: 'Course',
      type: 'reference',
      to: [{ type: 'course' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'studentName',
      title: 'Student Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'studentEmail',
      title: 'Student Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'studentPhone',
      title: 'Student Phone',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'experience',
      title: 'Experience Level',
      type: 'string',
    }),
    defineField({
      name: 'goals',
      title: 'Learning Goals',
      type: 'text',
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount (in kobo)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending Payment', value: 'pending' },
          { title: 'Expired', value: 'expired' },
          { title: 'Converted', value: 'converted' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
  ],
  preview: {
    select: {
      title: 'studentName',
      subtitle: 'studentEmail',
      course: 'courseId.title',
    },
    prepare(selection) {
      const { title, subtitle, course } = selection;
      return {
        title: `${title} - ${course}`,
        subtitle: `${subtitle} (Pending)`,
      };
    },
  },
});
