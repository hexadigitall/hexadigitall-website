// src/sanity/schemas/pendingEnrollment.ts
import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'pendingEnrollment',
  title: 'Pending Course Enrollment',
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
      name: 'courseType',
      title: 'Course Type',
      type: 'string',
      options: {
        list: [
          { title: 'Self-Paced', value: 'self-paced' },
          { title: 'Live Sessions', value: 'live' },
        ],
      },
      initialValue: 'self-paced',
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
      name: 'preferredSchedule',
      title: 'Preferred Schedule',
      type: 'text',
      description: 'Student\'s preferred schedule for live sessions',
      hidden: ({ parent }) => parent?.courseType !== 'live',
    }),
    defineField({
      name: 'pricingConfiguration',
      title: 'Pricing Configuration',
      type: 'object',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      fields: [
        {
          name: 'hoursPerWeek',
          title: 'Hours per Week',
          type: 'number',
          validation: (Rule) => Rule.positive().min(1).max(21),
        },
        {
          name: 'weeksPerMonth',
          title: 'Weeks per Month',
          type: 'number',
          initialValue: 4,
        },
        {
          name: 'totalHours',
          title: 'Total Hours per Month',
          type: 'number',
          validation: (Rule) => Rule.positive(),
        },
        {
          name: 'sessionFormat',
          title: 'Session Format',
          type: 'string',
          options: {
            list: [
              { title: 'One-on-One', value: 'one-on-one' },
              { title: 'Small Group (2-4)', value: 'small-group' },
              { title: 'Group Session (5-8)', value: 'group' },
            ],
          },
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string',
          options: {
            list: [
              { title: 'Nigerian Naira', value: 'NGN' },
              { title: 'US Dollar', value: 'USD' },
            ],
          },
        },
        {
          name: 'hourlyRate',
          title: 'Hourly Rate',
          type: 'number',
          validation: (Rule) => Rule.positive(),
        },
        {
          name: 'totalMonthlyPrice',
          title: 'Total Monthly Price',
          type: 'number',
          validation: (Rule) => Rule.positive(),
        },
      ],
    }),
    defineField({
      name: 'stripeSessionId',
      title: 'Stripe Session ID',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'amount',
      title: 'Amount (in cents/kobo)',
      type: 'number',
      validation: (Rule) => Rule.required().positive(),
    }),
    defineField({
      name: 'currency',
      title: 'Currency',
      type: 'string',
      options: {
        list: [
          { title: 'Nigerian Naira', value: 'NGN' },
          { title: 'US Dollar', value: 'USD' },
        ],
      },
      initialValue: 'NGN',
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Confirmed', value: 'confirmed' },
          { title: 'Failed', value: 'failed' },
          { title: 'Expired', value: 'expired' },
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
    defineField({
      name: 'expiresAt',
      title: 'Expires At',
      type: 'datetime',
      description: 'When this pending enrollment expires (usually 24 hours after creation)',
    }),
  ],
  preview: {
    select: {
      title: 'studentName',
      subtitle: 'studentEmail',
      course: 'courseId.title',
      status: 'status',
      courseType: 'courseType',
    },
    prepare(selection) {
      const { title, subtitle, course, status, courseType } = selection;
      const typeLabel = courseType === 'live' ? '🎓 Live' : '📚 Self-paced';
      return {
        title: `[PENDING] ${title} - ${course}`,
        subtitle: `${typeLabel} • ${subtitle} (${status})`,
      };
    },
  },
});
