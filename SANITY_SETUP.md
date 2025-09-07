# Sanity API Token Setup for Course Enrollment

## Issue
The course enrollment system fails with "Insufficient permissions; permission 'create' required" because the Sanity client lacks write permissions.

## Solution

### 1. Create a Sanity API Token

1. Go to [Sanity Management Console](https://www.sanity.io/manage)
2. Select your project
3. Go to **API** tab
4. Click **Add API token**
5. Name it: `Course Enrollment API Token`
6. Set permissions to: **Editor** (allows read/write)
7. Copy the generated token

### 2. Add Token to Environment Variables

Add this to your `.env.local` file:

```bash
# Sanity API Token for write operations (enrollments)
SANITY_API_TOKEN=your_sanity_api_token_here
```

### 3. Required Environment Variables

Make sure you have all these in `.env.local`:

```bash
# Sanity Configuration
NEXT_PUBLIC_SANITY_PROJECT_ID=your_project_id
NEXT_PUBLIC_SANITY_DATASET=production
NEXT_PUBLIC_SANITY_API_VERSION=2024-08-30
SANITY_API_TOKEN=your_write_token_here

# Stripe Configuration  
NEXT_PUBLIC_STRIPE_PUBLIC_KEY=your_stripe_public_key
STRIPE_SECRET_KEY=your_stripe_secret_key

# Site Configuration
NEXT_PUBLIC_SITE_URL=http://localhost:3000
```

### 4. Deploy New Schemas to Sanity

The enrollment system uses new schemas that need to be deployed:

1. Run: `npm run dev`
2. Go to: `http://localhost:3000/studio`
3. You should see new content types:
   - **Course Enrollment**
   - **Pending Enrollment**

If you don't see them, you may need to redeploy your Sanity studio.

### 5. Test the Enrollment System

After adding the token:
1. Restart your development server
2. Try enrolling in a course
3. The enrollment should now work without permission errors

## Security Notes

- Never commit API tokens to Git
- Use different tokens for development/production
- Regularly rotate API tokens for security
- The token has Editor permissions - handle with care

## Troubleshooting

If you still get permission errors:
1. Check that the token is correctly set in `.env.local`
2. Verify the token has Editor permissions in Sanity console
3. Make sure you've restarted your dev server after adding the token
4. Check console warnings for missing environment variables
