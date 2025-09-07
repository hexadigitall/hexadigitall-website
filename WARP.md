# WARP.md

This file provides guidance to WARP (warp.dev) when working with code in this repository.

## Development Commands

### Core Development Workflow
```bash
# Start development server with Turbopack
npm run dev

# Production build
npm run build

# Start production server
npm start

# Run ESLint
npm run lint
```

### Sanity CMS Management
```bash
# Access Sanity Studio (after running dev server)
# Navigate to: http://localhost:3000/studio
```

## Architecture Overview

### Technology Stack
- **Framework**: Next.js 15 with App Router
- **Styling**: Tailwind CSS with custom design system
- **CMS**: Sanity headless CMS
- **Language**: TypeScript
- **Icons**: React Icons

### Project Structure
```
src/
├── app/                    # Next.js App Router pages
│   ├── layout.tsx         # Root layout with fonts and global components
│   ├── page.tsx          # Homepage composition
│   ├── contact/          # Contact page
│   └── services/         # Services pages
├── components/
│   ├── layout/           # Header, Footer components
│   └── sections/         # Homepage sections (Hero, Services, etc.)
├── sanity/
│   ├── client.ts         # Sanity client configuration
│   └── schemas/          # Content schemas (service, testimonial, etc.)
```

### Design System
- **Primary Color**: `#0A4D68` (Deep Blue)
- **Secondary Color**: `#088395` (Vibrant Teal)  
- **Accent Color**: `#F5A623` (Bright Orange)
- **Typography**: Montserrat (headings), Lato (body)
- **Components**: Custom `.btn-primary` and `.btn-secondary` classes

### Content Management Architecture
The project uses Sanity CMS with the following content types:
- **Services**: Title, slug, overview, and detailed content
- **Testimonials**: Quote, author name, and company
- **Projects**: Portfolio items (schema defined)
- **Posts**: Blog content (schema defined)
- **FAQs**: Frequently asked questions (schema defined)

### Data Fetching Patterns
- Server components fetch data directly using Sanity client
- GROQ queries for content retrieval
- Example pattern in `Testimonials.tsx`: async server component with `client.fetch()`

## Development Guidelines

### Component Organization
- **Layout components**: Header/Footer in `components/layout/`
- **Page sections**: Reusable sections in `components/sections/`
- **Service cards**: Modular components with consistent styling

### Styling Conventions
- Use Tailwind utility classes
- Leverage custom design system colors (`text-primary`, `bg-secondary`, etc.)
- Font classes: `font-heading` for titles, `font-body` for text
- Responsive design with `md:` and `lg:` breakpoints

### Content Integration
- Services data is hardcoded in `ServicesOverview.tsx` for now
- Testimonials are fetched from Sanity CMS
- All content schemas are in `src/sanity/schemas/`

### Environment Setup
Required environment variables:
- `NEXT_PUBLIC_SANITY_PROJECT_ID`
- `NEXT_PUBLIC_SANITY_DATASET`
- `NEXT_PUBLIC_SANITY_API_VERSION` (defaults to "2024-08-30")

### TypeScript Configuration
- Path aliases: `@/*` maps to `./src/*`
- Strict mode enabled
- Next.js plugin configured for optimal development experience

### Next.js 15 Specific Considerations
- **Async Params**: Dynamic route params are now Promises and must be awaited
  ```typescript
  // Correct pattern for dynamic routes
  export default async function Page(props: { params: Promise<{ slug: string }> }) {
    const params = await props.params;
    // use params.slug
  }
  ```
- **generateMetadata**: Also requires awaiting params
- **Turbopack**: Development server uses `--turbopack` flag for faster builds
