import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'formSubmission',
  title: 'Form Submissions',
  type: 'document',
  fields: [
    defineField({
      name: 'type',
      title: 'Form Type',
      type: 'string',
      options: {
        list: [
          { title: 'Contact Form', value: 'contact' },
          { title: 'Service Request', value: 'service' },
          { title: 'Course Enrollment', value: 'course' },
          { title: 'Newsletter', value: 'newsletter' },
          { title: 'Custom Build', value: 'custom-build' },
          { title: 'Campaign', value: 'campaign' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'New', value: 'new' },
          { title: 'Read', value: 'read' },
          { title: 'In Progress', value: 'in-progress' },
          { title: 'Completed', value: 'completed' },
          { title: 'Archived', value: 'archived' },
        ],
      },
      initialValue: 'new',
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
          { title: 'Urgent', value: 'urgent' },
        ],
      },
      initialValue: 'medium',
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.email(),
    }),
    defineField({
      name: 'phone',
      title: 'Phone',
      type: 'string',
    }),
    defineField({
      name: 'company',
      title: 'Company',
      type: 'string',
    }),
    defineField({
      name: 'service',
      title: 'Service',
      type: 'string',
      description: 'Service selected on the form (web dev, marketing, etc.)',
    }),
    defineField({
      name: 'city',
      title: 'City',
      type: 'string',
      description: 'City captured from form or utm_term (Lagos, Abuja, etc.)',
    }),
    defineField({
      name: 'campaignName',
      title: 'Campaign Name',
      type: 'string',
      description: 'utm_campaign value',
    }),
    defineField({
      name: 'campaignSource',
      title: 'Campaign Source',
      type: 'string',
      description: 'utm_source value (whatsapp, instagram, etc.)',
    }),
    defineField({
      name: 'campaignMedium',
      title: 'Campaign Medium',
      type: 'string',
      description: 'utm_medium value (social, email, web, etc.)',
    }),
    defineField({
      name: 'campaignContent',
      title: 'Campaign Content',
      type: 'string',
      description: 'utm_content value (creative variant, day, etc.)',
    }),
    defineField({
      name: 'campaignTerm',
      title: 'Campaign Term',
      type: 'string',
      description: 'utm_term value (city/keyword)',
    }),
    defineField({
      name: 'landingPage',
      title: 'Landing Page URL',
      type: 'url',
      description: 'Landing page where the form was submitted',
    }),
    defineField({
      name: 'subject',
      title: 'Subject',
      type: 'string',
    }),
    defineField({
      name: 'message',
      title: 'Message',
      type: 'text',
    }),
    defineField({
      name: 'formData',
      title: 'Complete Form Data',
      type: 'object',
      fields: [
        {
          name: 'raw',
          title: 'Raw JSON',
          type: 'text',
          description: 'Paste JSON here',
        },
      ],
    }),
    defineField({
      name: 'submittedAt',
      title: 'Submitted At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'ipAddress',
      title: 'IP Address',
      type: 'string',
    }),
    defineField({
      name: 'userAgent',
      title: 'User Agent',
      type: 'string',
    }),
    defineField({
      name: 'referrer',
      title: 'Referrer',
      type: 'string',
    }),
    defineField({
      name: 'notes',
      title: 'Admin Notes',
      type: 'array',
      of: [
        {
          type: 'object',
          fields: [
            { name: 'note', type: 'text', title: 'Note' },
            { name: 'timestamp', type: 'datetime', title: 'Timestamp' },
            { name: 'admin', type: 'string', title: 'Admin' },
          ],
        },
      ],
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'email',
      type: 'type',
      status: 'status',
      date: 'submittedAt',
    },
    prepare({ title, subtitle, type, status, date }) {
      return {
        title: title || subtitle || 'Anonymous',
        subtitle: `${type} - ${status} - ${new Date(date).toLocaleDateString()}`,
      }
    },
  },
  orderings: [
    {
      title: 'Newest First',
      name: 'newestFirst',
      by: [{ field: 'submittedAt', direction: 'desc' }],
    },
    {
      title: 'Oldest First',
      name: 'oldestFirst',
      by: [{ field: 'submittedAt', direction: 'asc' }],
    },
  ],
})
