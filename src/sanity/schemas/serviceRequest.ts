import { defineField, defineType } from 'sanity'

/* eslint-disable @typescript-eslint/no-explicit-any */
export default defineType({
  name: 'serviceRequest',
  title: 'Service Request',
  type: 'document',
  fields: [
    defineField({
      name: 'requestId',
      title: 'Request ID',
      type: 'string',
      readOnly: true,
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' }
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'serviceCategoryId',
      title: 'Service Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'packageName',
      title: 'Selected Package Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'packageTier',
      title: 'Package Tier',
      type: 'string'
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'clientFirstName',
      title: 'First Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'clientLastName',
      title: 'Last Name',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'clientEmail',
      title: 'Email',
      type: 'string',
      validation: (Rule: any) => Rule.required().email()
    }),
    defineField({
      name: 'clientPhone',
      title: 'Phone',
      type: 'string'
    }),
    defineField({
      name: 'clientCompany',
      title: 'Company',
      type: 'string'
    }),
    defineField({
      name: 'projectTitle',
      title: 'Project Title',
      type: 'string',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'projectDescription',
      title: 'Project Description',
      type: 'text',
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'projectNotes',
      title: 'Additional Notes',
      type: 'text'
    }),
    defineField({
      name: 'preferredTimeline',
      title: 'Preferred Timeline',
      type: 'string'
    }),
    defineField({
      name: 'budgetRange',
      title: 'Budget Range',
      type: 'string'
    }),
    defineField({
      name: 'paymentPlan',
      title: 'Payment Plan',
      type: 'string'
    }),
    defineField({
      name: 'paymentStatus',
      title: 'Payment Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Paid', value: 'paid' },
          { title: 'Failed', value: 'failed' },
          { title: 'Refunded', value: 'refunded' }
        ]
      },
      initialValue: 'pending'
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    }),
    defineField({
      name: 'updatedAt',
      title: 'Updated At',
      type: 'datetime',
      initialValue: () => new Date().toISOString()
    })
  ],
  orderings: [
    {
      title: 'Created Date, New',
      name: 'createdAtDesc',
      by: [{ field: 'createdAt', direction: 'desc' }]
    }
  ]
})