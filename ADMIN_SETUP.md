# Admin Dashboard Setup Guide

## Overview
The admin dashboard provides a secure interface to manage form submissions and view site analytics.

## Features
- 🔐 Secure authentication with password hashing
- 📧 Form submission management (view, filter, update status, export)
- 📊 Analytics dashboard (page views, popular services/courses, event tracking)
- 📱 Responsive design with professional UI
- 💾 All data stored in Sanity CMS

## Setup Instructions

### 1. Generate Admin Credentials

Run the password hash generator:
```bash
node generate-admin-hash.js YOUR_SECURE_PASSWORD
```

This will output environment variables to add to your `.env.local` file.

### 2. Configure Environment Variables

Add to your `.env.local`:
```env
ADMIN_USERNAME=admin
ADMIN_PASSWORD_HASH=<generated_hash>
AUTH_SALT=<generated_salt>
```

### 3. Deploy Sanity Schemas

The following schemas need to be deployed to Sanity:
- `formSubmission` - Stores all form submissions
- `analyticsEvent` - Stores analytics events

Deploy schemas:
```bash
npm run sanity:deploy
# or
npx sanity deploy
```

### 4. Access the Admin Dashboard

Navigate to: `https://yourdomain.com/admin/login`

Login with:
- Username: `admin`
- Password: (your chosen password)

## Admin Routes

- `/admin/login` - Login page
- `/admin/dashboard` - Main dashboard with overview
- `/admin/submissions` - View and manage all form submissions
- `/admin/analytics` - Analytics dashboard

## Features Details

### Form Submissions Management
- View all form submissions in one place
- Filter by type (contact, service, course, newsletter)
- Filter by status (new, in-progress, completed, archived)
- Search submissions by name, email, or message
- Update submission status
- Export submissions to CSV

### Analytics Dashboard
- Page view statistics
- Popular services and courses
- Event tracking (page views, clicks, form submissions)
- Device and browser information
- Real-time activity feed

## How Form Submissions Work

All existing forms now save to Sanity database automatically:
- Contact form (`/api/contact`)
- Service requests
- Course enrollments
- Newsletter signups

Even if email delivery fails, submissions are stored in the database for the admin to review.

## Security Notes

- Passwords are hashed using SHA-256 with salt
- Sessions expire after 24 hours
- Auth tokens stored in localStorage
- All admin routes check authentication
- No sensitive data exposed in client-side code

## Updating Admin Password

1. Generate new hash: `node generate-admin-hash.js NEW_PASSWORD`
2. Update `ADMIN_PASSWORD_HASH` in environment variables
3. Redeploy application

## Troubleshooting

### Can't log in
- Check environment variables are set correctly
- Verify password hash was generated with same salt
- Clear browser localStorage and try again

### No submissions showing
- Verify Sanity schemas are deployed
- Check Sanity Studio to see if data exists
- Check browser console for API errors

### Analytics not tracking
- Verify `analyticsEvent` schema is deployed
- Check `/api/analytics` endpoint is working
- Ensure client-side tracking is integrated

## Development vs Production

For local development:
- Use `.env.local` for credentials
- Test with local Sanity dataset

For production (Vercel):
- Add environment variables in Vercel dashboard
- Use production Sanity dataset
- Ensure all secrets are secure

## Support

For issues or questions, check:
1. Browser console for errors
2. Vercel logs for API errors
3. Sanity Studio for data integrity
