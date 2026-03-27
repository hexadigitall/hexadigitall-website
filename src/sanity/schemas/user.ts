// src/sanity/schemas/user.ts
import { defineType, defineField } from 'sanity'

export default defineType({
  name: 'user',
  title: 'User',
  type: 'document',
  fields: [
    defineField({
      name: 'username',
      title: 'Username',
      type: 'string',
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'email',
      title: 'Email',
      type: 'string',
      validation: (Rule) => Rule.required().email(),
    }),
    defineField({
      name: 'name',
      title: 'Name',
      type: 'string',
    }),
    defineField({
      name: 'role',
      title: 'Role',
      type: 'string',
      options: {
        list: [
          { title: 'Admin', value: 'admin' },
          { title: 'Teacher', value: 'teacher' },
          { title: 'Student', value: 'student' },
        ],
      },
      validation: (Rule) => Rule.required(),
    }),
    defineField({
      name: 'passwordHash',
      title: 'Password Hash',
      type: 'string',
      description: 'SHA-256 hash of password + salt',
      hidden: true,
    }),
    defineField({
      name: 'salt',
      title: 'Salt',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'status',
      title: 'Status',
      type: 'string',
      options: {
        list: [
          { title: 'Active', value: 'active' },
          { title: 'Pending Approval', value: 'pending' },
          { title: 'Suspended', value: 'suspended' },
        ],
      },
      initialValue: 'active',
    }),
    defineField({
      name: 'createdAt',
      title: 'Created At',
      type: 'datetime',
      initialValue: () => new Date().toISOString(),
    }),
    defineField({
      name: 'emailVerified',
      title: 'Email Verified',
      type: 'boolean',
      initialValue: false,
    }),
    defineField({
      name: 'emailVerifiedAt',
      title: 'Email Verified At',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'emailVerificationTokenHash',
      title: 'Email Verification Token Hash',
      type: 'string',
      hidden: true,
    }),
    defineField({
      name: 'emailVerificationExpiresAt',
      title: 'Email Verification Expires At',
      type: 'datetime',
      hidden: true,
    }),
    defineField({
      name: 'oauthProvider',
      title: 'OAuth Provider',
      type: 'string',
      options: {
        list: [
          { title: 'Google', value: 'google' },
          { title: 'GitHub', value: 'github' },
        ],
      },
    }),
    defineField({
      name: 'oauthProviderId',
      title: 'OAuth Provider ID',
      type: 'string',
      hidden: true,
    }),
  ],
  preview: {
    select: {
      title: 'name',
      subtitle: 'role',
    },
  },
})
