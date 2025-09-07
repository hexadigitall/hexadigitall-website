import { defineType, defineField } from 'sanity'

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
          { title: 'Pending Payment', value: 'pending_payment' },
          { title: 'Payment Confirmed', value: 'payment_confirmed' },
          { title: 'In Progress', value: 'in_progress' },
          { title: 'Under Review', value: 'under_review' },
          { title: 'Completed', value: 'completed' },
          { title: 'Cancelled', value: 'cancelled' },
          { title: 'Refunded', value: 'refunded' }
        ]
      },
      initialValue: 'pending_payment',
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'priority',
      title: 'Priority',
      type: 'string',
      options: {
        list: [
          { title: 'Low', value: 'low' },
          { title: 'Medium', value: 'medium' },
          { title: 'High', value: 'high' },
          { title: 'Urgent', value: 'urgent' }
        ]
      },
      initialValue: 'medium'
    }),
    defineField({
      name: 'serviceCategory',
      title: 'Service Category',
      type: 'reference',
      to: [{ type: 'serviceCategory' }],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'selectedPackage',
      title: 'Selected Package',
      type: 'object',
      fields: [
        {
          name: 'name',
          title: 'Package Name',
          type: 'string'
        },
        {
          name: 'tier',
          title: 'Tier',
          type: 'string'
        },
        {
          name: 'price',
          title: 'Price',
          type: 'number'
        },
        {
          name: 'currency',
          title: 'Currency',
          type: 'string'
        },
        {
          name: 'billing',
          title: 'Billing Type',
          type: 'string'
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'selectedAddOns',
      title: 'Selected Add-ons',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Add-on Name',
              type: 'string'
            },
            {
              name: 'price',
              title: 'Price',
              type: 'number'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text'
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: Rule => Rule.required().min(0)
    }),
    defineField({
      name: 'clientInfo',
      title: 'Client Information',
      type: 'object',
      fields: [
        {
          name: 'firstName',
          title: 'First Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: Rule => Rule.required().email()
        },
        {
          name: 'phone',
          title: 'Phone Number',
          type: 'string'
        },
        {
          name: 'company',
          title: 'Company',
          type: 'string'
        },
        {
          name: 'address',
          title: 'Address',
          type: 'text'
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'projectDetails',
      title: 'Project Details',
      type: 'object',
      fields: [
        {
          name: 'title',
          title: 'Project Title',
          type: 'string',
          validation: Rule => Rule.required()
        },
        {
          name: 'description',
          title: 'Project Description',
          type: 'text',
          validation: Rule => Rule.required()
        },
        {
          name: 'requirements',
          title: 'Specific Requirements',
          type: 'text'
        },
        {
          name: 'timeline',
          title: 'Preferred Timeline',
          type: 'string'
        },
        {
          name: 'budget',
          title: 'Budget Range',
          type: 'string'
        },
        {
          name: 'attachments',
          title: 'Attachments',
          type: 'array',
          of: [{ type: 'file' }]
        }
      ],
      validation: Rule => Rule.required()
    }),
    defineField({
      name: 'paymentInfo',
      title: 'Payment Information',
      type: 'object',
      fields: [
        {
          name: 'stripePaymentIntentId',
          title: 'Stripe Payment Intent ID',
          type: 'string'
        },
        {
          name: 'stripeCheckoutSessionId',
          title: 'Stripe Checkout Session ID',
          type: 'string'
        },
        {
          name: 'paymentStatus',
          title: 'Payment Status',
          type: 'string',
          options: {
            list: [
              { title: 'Pending', value: 'pending' },
              { title: 'Succeeded', value: 'succeeded' },
              { title: 'Failed', value: 'failed' },
              { title: 'Cancelled', value: 'cancelled' },
              { title: 'Refunded', value: 'refunded' }
            ]
          },
          initialValue: 'pending'
        },
        {
          name: 'paidAt',
          title: 'Payment Date',
          type: 'datetime'
        }
      ]
    }),
    defineField({
      name: 'timeline',
      title: 'Project Timeline',
      type: 'object',
      fields: [
        {
          name: 'estimatedStartDate',
          title: 'Estimated Start Date',
          type: 'date'
        },
        {
          name: 'estimatedCompletionDate',
          title: 'Estimated Completion Date',
          type: 'date'
        },
        {
          name: 'actualStartDate',
          title: 'Actual Start Date',
          type: 'date'
        },
        {
          name: 'actualCompletionDate',
          title: 'Actual Completion Date',
          type: 'date'
        }
      ]
    }),
    defineField({
      name: 'assignedTeam',
      title: 'Assigned Team Members',
      type: 'array',
      of: [{ type: 'string' }],
      description: 'Team members assigned to this project'
    }),
    defineField({
      name: 'updates',
      title: 'Project Updates',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'date',
              title: 'Update Date',
              type: 'datetime',
              validation: Rule => Rule.required()
            },
            {
              name: 'title',
              title: 'Update Title',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'description',
              title: 'Update Description',
              type: 'text',
              validation: Rule => Rule.required()
            },
            {
              name: 'author',
              title: 'Author',
              type: 'string',
              validation: Rule => Rule.required()
            },
            {
              name: 'attachments',
              title: 'Attachments',
              type: 'array',
              of: [{ type: 'file' }]
            },
            {
              name: 'clientVisible',
              title: 'Visible to Client',
              type: 'boolean',
              initialValue: true
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'deliverables',
      title: 'Project Deliverables',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            {
              name: 'name',
              title: 'Deliverable Name',
              type: 'string'
            },
            {
              name: 'description',
              title: 'Description',
              type: 'text'
            },
            {
              name: 'status',
              title: 'Status',
              type: 'string',
              options: {
                list: [
                  { title: 'Not Started', value: 'not_started' },
                  { title: 'In Progress', value: 'in_progress' },
                  { title: 'Completed', value: 'completed' },
                  { title: 'Delivered', value: 'delivered' }
                ]
              },
              initialValue: 'not_started'
            },
            {
              name: 'dueDate',
              title: 'Due Date',
              type: 'date'
            },
            {
              name: 'completedDate',
              title: 'Completed Date',
              type: 'date'
            },
            {
              name: 'files',
              title: 'Deliverable Files',
              type: 'array',
              of: [{ type: 'file' }]
            }
          ]
        }
      ]
    }),
    defineField({
      name: 'notes',
      title: 'Internal Notes',
      type: 'text',
      description: 'Internal notes not visible to client'
    })
  ],
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: '_createdAt', direction: 'desc' }]
    },
    {
      title: 'Status',
      name: 'byStatus',
      by: [{ field: 'status', direction: 'asc' }]
    }
  ]
})
