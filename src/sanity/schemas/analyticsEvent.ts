import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'analyticsEvent',
  title: 'Analytics Events',
  type: 'document',
  fields: [
    defineField({
      name: 'eventType',
      title: 'Event Type',
      type: 'string',
      options: {
        list: [
          { title: 'Page View', value: 'page_view' },
          { title: 'Button Click', value: 'button_click' },
          { title: 'Form Start', value: 'form_start' },
          { title: 'Form Submit', value: 'form_submit' },
          { title: 'Service View', value: 'service_view' },
          { title: 'Course View', value: 'course_view' },
          { title: 'Enrollment Start', value: 'enrollment_start' },
          { title: 'Currency Change', value: 'currency_change' },
          { title: 'Download', value: 'download' },
          { title: 'External Link', value: 'external_link' },
        ],
      },
    }),
    defineField({
      name: 'eventName',
      title: 'Event Name',
      type: 'string',
    }),
    defineField({
      name: 'page',
      title: 'Page',
      type: 'string',
    }),
    defineField({
      name: 'eventData',
      title: 'Event Data',
      type: 'object',
      fields: [
        { name: 'data', type: 'text', title: 'JSON Data' },
      ],
    }),
    defineField({
      name: 'sessionId',
      title: 'Session ID',
      type: 'string',
    }),
    defineField({
      name: 'userId',
      title: 'User ID',
      type: 'string',
    }),
    defineField({
      name: 'timestamp',
      title: 'Timestamp',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'deviceType',
      title: 'Device Type',
      type: 'string',
      options: {
        list: ['desktop', 'mobile', 'tablet'],
      },
    }),
    defineField({
      name: 'browser',
      title: 'Browser',
      type: 'string',
    }),
    defineField({
      name: 'os',
      title: 'Operating System',
      type: 'string',
    }),
    defineField({
      name: 'country',
      title: 'Country',
      type: 'string',
    }),
    defineField({
      name: 'referrer',
      title: 'Referrer',
      type: 'string',
    }),
  ],
  preview: {
    select: {
      title: 'eventName',
      subtitle: 'page',
      timestamp: 'timestamp',
    },
    prepare({ title, subtitle, timestamp }) {
      return {
        title: title || 'Unknown Event',
        subtitle: `${subtitle} - ${new Date(timestamp).toLocaleString()}`,
      }
    },
  },
})
