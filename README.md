# HexaDigitall - Digital Services Platform

A modern Next.js application offering tiered digital services with integrated Paystack payment processing.

## Features

- **Multi-tier Service Packages** - Web development, business planning, marketing, and branding services
- **Paystack Payment Integration** - Secure payment processing with support for NGN and USD
- **Multi-step Purchase Flow** - Tier selection → Add-ons → Customer details → Payment
- **Responsive Design** - Tailwind CSS with mobile-first approach
- **Sanity CMS Integration** - Content management for blogs, FAQs, and services
- **Open Graph & Social Sharing** - Optimized meta tags for social media sharing with beautiful previews
- **ShareButtons Component** - Reusable component for sharing content across platforms (Facebook, Twitter, WhatsApp, LinkedIn)

## Quick Start

### Prerequisites
- Node.js 18+ 
- npm/yarn/pnpm
- Paystack account (test or live keys)

### Installation

```bash
# Install dependencies
npm install

# Copy environment variables
cp .env.local.example .env.local

# Add your Paystack keys to .env.local
# Get keys from https://dashboard.paystack.com/#/settings/developers

# Run development server
npm run dev
```

Open [http://localhost:3001](http://localhost:3001) with your browser to see the result.

You can start editing the page by modifying `app/page.tsx`. The page auto-updates as you edit the file.

This project uses [`next/font`](https://nextjs.org/docs/app/building-your-application/optimizing/fonts) to automatically optimize and load [Geist](https://vercel.com/font), a new font family for Vercel.

## Documentation

- **[Paystack Setup Guide](./PAYSTACK_SETUP.md)** - Complete payment integration setup
- **[Development Setup](./DEVELOPMENT_SETUP.md)** - Local development configuration
- **[Deployment Guide](./DEPLOYMENT_GUIDE.md)** - Production deployment instructions
- **[OG Investigation](./docs/og-investigation.md)** - Open Graph implementation and social sharing fixes
- **[Jhema Wears Proposal](./docs/jhema-wears-proposal/)** - Complete e-commerce proposal package with outreach templates

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

## Key Technologies

- **Next.js 15.5.3** - React framework with App Router
- **React 19** - UI library
- **TypeScript** - Type safety
- **Tailwind CSS** - Styling
- **Paystack API** - Payment processing
- **Sanity CMS** - Content management

## Payment Flow

1. User selects service tier
2. Adds optional add-ons
3. Provides contact details
4. Redirects to Paystack checkout
5. Completes payment
6. Webhook confirms payment
7. User redirected to success page

## Demo Pages

### Jhema Wears E-Commerce Demo
Visit `/demo/jhema-wears` to see a complete demonstration of:
- Open Graph meta tags for social sharing
- ShareButtons component in action
- Product page layout optimized for e-commerce
- Mobile-responsive design
- Educational info boxes explaining the features

This demo showcases how proper OG implementation leads to beautiful social media previews.

### Testing Social Sharing

1. **Local Testing:**
   ```bash
   npm run dev
   # Visit http://localhost:3000/demo/jhema-wears
   ```

2. **Test Social Previews:**
   - Facebook: https://developers.facebook.com/tools/debug/
   - Twitter: https://cards-dev.twitter.com/validator
   - LinkedIn: https://www.linkedin.com/post-inspector/

3. **ShareButtons Component Usage:**
   ```tsx
   import ShareButtons from '@/components/ShareButtons/ShareButtons';

   <ShareButtons
     url="https://hexadigitall.com/your-page"
     title="Your Page Title"
     description="Your page description"
     showLabels={true}
     size="lg"
   />
   ```

## Testing

### Paystack Testing
Use Paystack test cards:
- **Success**: 4084084084084081
- **PIN**: 0000
- **OTP**: 123456

See [PAYSTACK_SETUP.md](./PAYSTACK_SETUP.md) for complete testing guide.

### OG Meta Tags Testing
Run the OG tests:
```bash
npm test og.test.tsx
```

## Deploy on Vercel

1. Push to GitHub
2. Import project in Vercel
3. Add environment variables (Paystack keys)
4. Configure webhook URL in Paystack dashboard
5. Deploy

Check out the [Deployment Guide](./DEPLOYMENT_GUIDE.md) for detailed instructions.
