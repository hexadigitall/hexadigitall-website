# Hexadigitall - Digital Services Platform


A modern Next.js platform for digital services, featuring a robust admin portal, real-time analytics, and integrated Paystack payment processing.


## Features

- **Admin Portal** – Secure dashboard for managing submissions, analytics, and site data
- **Multi-tier Service Packages** – Web development, business planning, marketing, and branding
- **Paystack Payment Integration** – Secure payments (NGN & USD)
- **Multi-step Purchase Flow** – Tier selection → Add-ons → Customer details → Payment
- **Real-time Analytics** – Track page views, conversions, and user events
- **Accessibility Improvements** – Aria-labels, error handling, and responsive design
- **Sanity CMS Integration** – Content management for blogs, FAQs, and services
- **“Coming Soon” Page** – Placeholder for upcoming courses


## Quick Start


### Prerequisites
- Node.js 18+ (LTS recommended)
- npm/yarn/pnpm
- Paystack account (test or live keys)
- Sanity project (for CMS/database)


### Installation & Setup

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Paystack, Sanity, and analytics keys to .env.local
# See DEVELOPMENT_SETUP.md for details

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.


## Documentation

- **[Paystack Setup Guide](./PAYSTACK_SETUP.md)** – Payment integration setup
- **[Development Setup](./DEVELOPMENT_SETUP.md)** – Local development configuration & troubleshooting
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** – Production deployment instructions
- **[Admin Setup](./ADMIN_SETUP.md)** – Admin portal setup & credentials
- **[Actionable Next Steps](./ACTIONABLE_NEXT_STEPS.md)** – Roadmap & recent changes


## Project Structure

```
src/
├── app/
│   ├── api/
│   │   ├── service-checkout/     # Paystack transaction initialization
│   │   └── webhooks/paystack/    # Payment webhook handler
│   ├── services/                 # Service pages
│   └── components/               # React components
├── data/
│   └── servicePackages.ts        # Service tier definitions
└── lib/
    └── sanity/                   # Sanity CMS configuration
```


## Technologies Used

- **Frontend:** Next.js 15, React 19, TypeScript, Tailwind CSS
- **Backend:** Next.js API routes, custom authentication (JWT-like tokens)
- **Database:** Sanity CMS
- **Payments:** Paystack API
- **Icons:** Heroicons
- **Deployment:** Vercel


## Payment & Admin Flows

1. User selects service tier
2. Adds optional add-ons
3. Provides contact details
4. Redirects to Paystack checkout
5. Completes payment
6. Webhook confirms payment
7. User redirected to success page


## Testing & Troubleshooting

Use Paystack test cards:
- **Success**: 4084084084084081
- **PIN**: 0000
- **OTP**: 123456

See [PAYSTACK_SETUP.md](./PAYSTACK_SETUP.md) for complete testing guide.


## Deployment

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (Paystack keys)
4. Configure webhook URL in Paystack dashboard
5. Deploy


Check out the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions.

---

## Recent Improvements

- **Admin Portal:** Secure login, dashboard, analytics, and export features
- **All form submissions saved to Sanity database** (never lose a lead)
- **Real-time analytics dashboard** (page views, events, conversion rates)
- **Accessibility:** Improved aria-labels, error handling, and loading states
- **“Coming Soon” page** for courses
- **Error handling** added to blog, FAQ, and portfolio pages

For a full list of features and updates, see [ADMIN_FEATURE_SUMMARY.md](./ADMIN_FEATURE_SUMMARY.md) and [ACTIONABLE_NEXT_STEPS.md](./ACTIONABLE_NEXT_STEPS.md).
