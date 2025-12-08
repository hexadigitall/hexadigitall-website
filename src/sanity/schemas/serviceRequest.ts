import { defineField, defineType } from 'sanity'

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
      name: 'serviceCategory',
      title: 'Service Category',
      type: 'object',
      fields: [
        {
          name: 'id',
          title: 'Category ID',
          type: 'string'
        },
        {
          name: 'title',
          title: 'Category Title',
          type: 'string'
        },
        {
          name: 'slug',
          title: 'Category Slug',
          type: 'string'
        },
        {
          name: 'serviceType',
          title: 'Service Type',
          type: 'string'
        }
      ],
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'selectedPackage',
      title: 'Selected Package',
      type: 'object',
      fields: [
        {
          name: 'key',
          title: 'Package Key',
          type: 'string'
        },
        {
          name: 'name',
          title: 'Package Name',
          type: 'string'
        },
        {
          name: 'tier',
          title: 'Package Tier',
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
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'selectedAddOns',
      title: 'Selected Add-ons',
      type: 'array',
      of: [{
        type: 'object',
        name: 'addOn',
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
      }]
    }),
    defineField({
      name: 'totalAmount',
      title: 'Total Amount',
      type: 'number',
      validation: Rule => Rule.required()
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
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'lastName',
          title: 'Last Name',
          type: 'string',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'email',
          title: 'Email',
          type: 'string',
          validation: (Rule: any) => Rule.required().email()
        },
        {
          name: 'phone',
          title: 'Phone',
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
      validation: (Rule: any) => Rule.required()
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
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'description',
          title: 'Project Description',
          type: 'text',
          validation: (Rule: any) => Rule.required()
        },
        {
          name: 'notes',
          title: 'Additional Notes',
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
        }
      ],
      validation: (Rule: any) => Rule.required()
    }),
    defineField({
      name: 'paymentInfo',
      title: 'Payment Information',
      type: 'object',
      fields: [
        {
          name: 'plan',
          title: 'Payment Plan',
          type: 'string'
        },
        {
          name: 'downPayment',
          title: 'Down Payment Percentage',
          type: 'number'
        },
        {
          name: 'installments',
          title: 'Number of Installments',
          type: 'number'
        },
        {
          name: 'processingFee',
          title: 'Processing Fee',
          type: 'number'
        },
        {
          name: 'paystackReference',
          title: 'Paystack Reference',
          type: 'string'
        },
        {
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
        }
      ]
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