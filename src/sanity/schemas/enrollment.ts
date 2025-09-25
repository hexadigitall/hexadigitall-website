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
      name: 'liveCourseDetails',
      title: 'Live Course Details',
      type: 'object',
      hidden: ({ parent }) => parent?.courseType !== 'live',
      fields: [
        defineField({
          name: 'hoursPerWeek',
          title: 'Hours per Week',
          type: 'number',
          validation: (Rule) => Rule.positive().min(1).max(21),
        }),
        defineField({
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
        }),
        defineField({
          name: 'totalHours',
          title: 'Total Hours per Month',
          type: 'number',
          validation: (Rule) => Rule.positive(),
        }),
        defineField({
          name: 'monthlyAmount',
          title: 'Monthly Amount (in cents/kobo)',
          type: 'number',
          validation: (Rule) => Rule.positive(),
        }),
        defineField({
          name: 'nextSessionDate',
          title: 'Next Session Date',
          type: 'datetime',
        }),
        defineField({
          name: 'totalSessionsCompleted',
          title: 'Sessions Completed',
          type: 'number',
          initialValue: 0,
        }),
      ],
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
          { title: 'Active Subscription', value: 'active' },
          { title: 'Cancelled', value: 'cancelled' },
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
      name: 'stripeCustomerId',
      title: 'Stripe Customer ID',
      type: 'string',
    }),
    defineField({
      name: 'stripeSubscriptionId',
      title: 'Stripe Subscription ID',
      type: 'string',
      description: 'For live courses with recurring payments',
      hidden: ({ parent }) => parent?.courseType !== 'live',
    }),
    defineField({
      name: 'amount',
      title: 'Amount Paid (in cents/kobo)',
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
    defineField({
      name: 'isActive',
      title: 'Active Enrollment',
      type: 'boolean',
      description: 'For live courses - whether the student is still actively taking sessions',
      initialValue: true,
      hidden: ({ parent }) => parent?.courseType !== 'live',
    }),
    defineField({
      name: 'lastSessionDate',
      title: 'Last Session Date',
      type: 'datetime',
      hidden: ({ parent }) => parent?.courseType !== 'live',
    }),
  ],
  preview: {
    select: {
      title: 'studentName',
      subtitle: 'studentEmail',
      course: 'courseId.title',
      status: 'paymentStatus',
      courseType: 'courseType',
    },
    prepare(selection) {
      const { title, subtitle, course, status, courseType } = selection;
      const typeLabel = courseType === 'live' ? '🎓 Live' : '📚 Self-paced';
      return {
        title: `${title} - ${course}`,
        subtitle: `${typeLabel} • ${subtitle} (${status})`,
      };
    },
  },
});
