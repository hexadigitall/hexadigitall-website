import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'simGradingHint',
  title: 'Grading Hint',
  type: 'object',
  fields: [
    defineField({
      name: 'label',
      title: 'Label',
      type: 'string',
      description: 'Human-readable description of what this assertion checks.',
    }),
    defineField({
      name: 'targetType',
      title: 'Target Type',
      type: 'string',
      options: {
        list: [
          { title: 'Device', value: 'device' },
          { title: 'Slot', value: 'slot' },
          { title: 'Card', value: 'card' },
          { title: 'Port', value: 'port' },
        ],
      },
    }),
    defineField({
      name: 'targetId',
      title: 'Target ID',
      type: 'string',
      description: 'The ID of the entity to check (e.g., "d-001" or "p-002").',
    }),
    defineField({
      name: 'jsonPath',
      title: 'JSON Path',
      type: 'string',
      description: 'Path to the attribute, e.g. "/lifecycle/power" or "/registers/cpu_load_pct".',
    }),
    defineField({
      name: 'expectedValue',
      title: 'Expected Value',
      type: 'string',
      description: 'The value the attribute must equal for the check to pass.',
    }),
    defineField({
      name: 'points',
      title: 'Points',
      type: 'number',
      initialValue: 1,
    }),
  ],
})
