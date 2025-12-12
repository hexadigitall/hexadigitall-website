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
          name: 'data',
          title: 'JSON Data',
          type: 'text',
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
