import { defineType, defineField } from 'sanity';

export default defineType({
  name: 'publicationRegistration',
  title: 'Publication Copy Registration',
  type: 'document',
  fields: [
    defineField({
      name: 'publication',
      title: 'Registered Publication',
      type: 'reference',
      to: [{ type: 'book' }, { type: 'imprint' }],
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'fullName',
      title: 'Full Name',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email Address',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'registrationCode',
      title: 'Proof of Purchase / Code',
      type: 'string',
      description: 'Internal code or receipt reference provided by the user.',
    }),
    defineField({
      name: 'registeredAt',
      title: 'Registration Date',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'status',
      title: 'Verification Status',
      type: 'string',
      options: {
        list: [
          { title: 'Pending', value: 'pending' },
          { title: 'Verified', value: 'verified' },
          { title: 'Rejected', value: 'rejected' },
        ],
      },
      initialValue: 'pending',
    }),
  ],
});
