# Environment Setup

This project requires several environment variables to function properly. Follow these steps to set up your local development environment:

## 1. Create Environment File

Copy the example environment file and fill in your actual values:

\\\ash
cp .env.example .env.local
\\\

## 2. Required Environment Variables

### Sanity CMS
- \NEXT_PUBLIC_SANITY_PROJECT_ID\: Your Sanity project ID
- \NEXT_PUBLIC_SANITY_DATASET\: Usually 'production' or 'development'  
- \SANITY_API_READ_TOKEN\: Read token from Sanity dashboard
- \SANITY_API_TOKEN\: Admin token for webhooks (optional)

### Stripe (for payments)
- \NEXT_PUBLIC_STRIPE_PUBLIC_KEY\: Your Stripe publishable key
- \STRIPE_SECRET_KEY\: Your Stripe secret key

### Email & Analytics
- \RESEND_API_KEY\: For sending emails via Resend
- \NEXT_PUBLIC_GA_ID\: Google Analytics tracking ID
- \CONTACT_FORM_RECIPIENT_EMAIL\: Where contact forms are sent

### Site Configuration
- \NEXT_PUBLIC_SITE_URL\: Your site URL (http://localhost:3000 for development)
- \FROM_EMAIL\: Email address for system emails

## 3. Important Security Notes

- ⚠️  **Never commit .env.local to git** - it contains sensitive keys
- ✅  The .env.local file is already in .gitignore
- ✅  Use .env.example as a template for new developers
- 🔐  For production, set these variables in your hosting platform (Vercel, etc.)

## 4. Verification

After setting up your environment file, restart your development server:

\\\ash
npm run dev
\\\

You should see your Sanity project ID and dataset in the debug info, and courses should load properly.
