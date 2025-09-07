// src/sanity/schemas/enrollment.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'enrollment',
  title: 'Course Enrollment',
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
      options: {
        list: [
          { title: 'Complete Beginner', value: 'beginner' },
          { title: 'Some Experience', value: 'some-experience' },
          { title: 'Intermediate', value: 'intermediate' },
          { title: 'Advanced', value: 'advanced' },
        ],
      },
    }),
    defineField({
      name: 'goals',
      title: 'Learning Goals',
      type: 'text',
      rows: 3,
    }),
    defineField({
      name: 'enrolledAt',
      title: 'Enrollment Date',
      type: 'datetime',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Completed', value: 'completed' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' },
        ],
      },
      initialValue: 'pending',
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount Paid (in kobo)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'courseAccessGranted',
      title: 'Course Access Granted',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'certificateIssued',
      title: 'Certificate Issued',
      type: 'boolean',
      initialValue: false,
    }),
  ],
  preview: {
    select: {
      title: 'studentName',
      subtitle: 'studentEmail',
      course: 'courseId.title',
      status: 'paymentStatus',
    },
    prepare(selection) {
      const { title, subtitle, course, status } = selection;
      return {
        title: `${title} - ${course}`,
        subtitle: `${subtitle} (${status})`,
      };
    },
  },
});
