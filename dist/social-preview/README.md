# Social Preview Images

This directory contains generated Open Graph (OG) images for social media sharing across Facebook, Twitter, LinkedIn, and other platforms.

## 📐 Image Specifications

### Recommended Sizes

| Platform | Size (px) | Aspect Ratio | Format | Max Size |
|----------|-----------|--------------|--------|----------|
| **Facebook** | 1200 × 630 | 1.91:1 | JPG/PNG | 8 MB |
| **LinkedIn** | 1200 × 627 | 1.91:1 | JPG/PNG | 5 MB |
| **Twitter** | 1200 × 675 | 16:9 | JPG/PNG | 5 MB |
| **WhatsApp** | 1200 × 630 | 1.91:1 | JPG/PNG | - |

### Universal Standard
For maximum compatibility across all platforms, use:
- **Size**: 1200 × 630 pixels
- **Aspect Ratio**: 1.91:1
- **Format**: JPG (for smaller file size) or PNG (for transparency)
- **File Size**: < 1 MB (ideal), < 5 MB (maximum)
- **Color Space**: sRGB

## 🎨 Design Guidelines

### Safe Zone
Keep important content (text, logos, faces) within the **safe zone** to avoid cropping:
- **Center area**: 1000 × 500 px
- Avoid placing critical elements near edges (100px padding on all sides)

### Text Guidelines
- **Title**: 50-70 characters maximum
- **Font Size**: Minimum 40px for readability on mobile
- **Contrast**: Ensure high contrast between text and background
- **Line Length**: Keep text lines under 60 characters

### Branding
- Always include the Hexadigitall logo (top-right corner recommended)
- Include domain name "hexadigitall.com" for brand recognition
- Use brand colors: Primary #0A4D68, Secondary #066d7f

## 📁 Naming Convention

Use descriptive, kebab-case filenames:

```
[page-type]-[page-name].[format]

Examples:
✅ service-web-development.jpg
✅ course-react-native.jpg
✅ blog-post-seo-tips.jpg
✅ proposal-jhema-wears.jpg
✅ default-home.jpg

❌ image1.jpg
❌ IMG_0001.jpg
❌ social_share.jpg
```

### Naming Patterns

- **Services**: `service-[slug].jpg`
- **Courses**: `course-[slug].jpg`
- **Blog Posts**: `blog-[slug].jpg`
- **Pages**: `page-[slug].jpg`
- **Proposals**: `proposal-[client-name].jpg`
- **Default/Fallback**: `default.jpg`

## 🛠️ Generation Methods

### Method 1: Automated Script (Recommended)

```bash
# Generate all predefined images
npm run og:generate

# Generate course images
npm run og:generate:courses

# Generate custom images with TypeScript script
npx ts-node scripts/generate-og-preview.ts
```

### Method 2: Manual Design Tools

**Recommended Tools:**
- [Canva](https://www.canva.com) - Free templates available
- [Figma](https://www.figma.com) - Design custom OG images
- Adobe Photoshop - Professional design
- Adobe Illustrator - Vector-based designs

**Template Resources:**
- Download free OG image templates from Canva
- Use Hexadigitall brand colors and fonts
- Export as JPG (quality 90%) or PNG

### Method 3: Dynamic Generation (API)

For dynamic content, consider implementing an API route:

```typescript
// app/api/og/route.tsx
import { ImageResponse } from 'next/og';

export async function GET(request: Request) {
  const { searchParams } = new URL(request.url);
  const title = searchParams.get('title');
  
  return new ImageResponse(
    (
      <div style={{ /* your design */ }}>
        <h1>{title}</h1>
      </div>
    ),
    {
      width: 1200,
      height: 630,
    }
  );
}
```

## 📍 File Locations

### This Directory (`public/social-preview/`)
- **Purpose**: General social preview images
- **Usage**: Custom pages, special campaigns, client proposals
- **Examples**: `jhema-wears-proposal.jpg`, `contact-us.jpg`

### OG Images Directory (`public/og-images/`)
- **Purpose**: Main service and course images
- **Usage**: Services, courses, main site pages
- **Examples**: `services-hub.jpg`, `course-react-native.jpg`

### Root Public Directory (`public/`)
- **Purpose**: Site-wide default image
- **Usage**: Fallback when no specific image is set
- **File**: `digitall_partner.png`

## 🔗 Usage in Code

### Static Pages (App Router)

```typescript
// app/page.tsx
import type { Metadata } from 'next';

export const metadata: Metadata = {
  openGraph: {
    images: [{
      url: 'https://hexadigitall.com/social-preview/default.jpg',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall - Your Digital Partner',
      type: 'image/jpeg',
    }],
  },
};
```

### Dynamic Pages

```typescript
// app/services/[slug]/page.tsx
export async function generateMetadata({ params }): Promise<Metadata> {
  return {
    openGraph: {
      images: [{
        url: `https://hexadigitall.com/og-images/service-${params.slug}.jpg`,
        width: 1200,
        height: 630,
        alt: `${params.slug} - Hexadigitall`,
        type: 'image/jpeg',
      }],
    },
  };
}
```

### Using SiteSEO Component

```typescript
import { generateSiteSEO } from '@/components/SiteSEO';

export const metadata = generateSiteSEO({
  title: 'About Us',
  description: 'Learn about Hexadigitall...',
  path: '/about',
  image: 'https://hexadigitall.com/social-preview/about-us.jpg',
});
```

## ✅ Quality Checklist

Before adding a new social preview image, ensure:

- [ ] Image dimensions are exactly 1200 × 630 pixels
- [ ] File size is under 1 MB (preferably under 500 KB)
- [ ] Format is JPG (quality 85-90) or PNG
- [ ] Important content is within the safe zone (center 1000×500px)
- [ ] Text is readable on both desktop and mobile
- [ ] Logo and domain name are visible
- [ ] Colors match Hexadigitall brand guidelines
- [ ] File has descriptive kebab-case name
- [ ] Image is optimized (compressed)
- [ ] Image is accessible via HTTPS
- [ ] Tested with Facebook Sharing Debugger

## 🧪 Testing Your Images

### Test Tools

1. **Facebook Sharing Debugger**
   - URL: https://developers.facebook.com/tools/debug/
   - Enter your page URL
   - Click "Scrape Again" to refresh cache
   - Verify image loads correctly

2. **LinkedIn Post Inspector**
   - URL: https://www.linkedin.com/post-inspector/
   - Enter your page URL
   - Check preview rendering

3. **Twitter Card Validator**
   - URL: https://cards-dev.twitter.com/validator
   - Enter your page URL
   - Verify card displays correctly

4. **Open Graph Check**
   - URL: https://opengraphcheck.com/
   - Test multiple platforms at once

### Manual Testing

```bash
# Test if image is accessible
curl -I https://hexadigitall.com/social-preview/your-image.jpg

# Should return: HTTP/2 200
```

## 🚨 Common Issues

### Issue: Image Doesn't Show on Facebook
**Solution**: 
- Check image URL is absolute (starts with https://)
- Verify image returns 200 OK
- Use Facebook Debugger to scrape again
- Ensure image is under 8 MB

### Issue: Image is Blurry on Mobile
**Solution**:
- Use 2x resolution (2400×1260 for retina displays)
- Ensure text is large enough (min 40px)
- Test on actual mobile device

### Issue: Text is Cut Off
**Solution**:
- Keep content within safe zone (center 1000×500px)
- Avoid placing text near edges
- Test on multiple platforms

### Issue: Old Image Shows After Update
**Solution**:
- Use Facebook Debugger "Scrape Again"
- Add version parameter to URL: `image.jpg?v=2`
- Check CDN cache settings

## 📚 Additional Resources

### Documentation
- [Open Graph Protocol](https://ogp.me/)
- [Twitter Cards Guide](https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards)
- [Next.js Metadata API](https://nextjs.org/docs/app/building-your-application/optimizing/metadata)
- [Facebook Sharing Best Practices](https://developers.facebook.com/docs/sharing/webmasters)

### Tools
- [Canva OG Image Templates](https://www.canva.com/templates/EAE9r9kj2OE-social-media/)
- [Meta Tags Generator](https://metatags.io/)
- [Social Sizes Reference](https://sproutsocial.com/insights/social-media-image-sizes-guide/)

### Design Inspiration
- [OG Image Gallery](https://www.ogimage.gallery/)
- [Social Share Preview](https://socialsharepreview.com/)

## 🆘 Need Help?

If you encounter issues with social preview images:

1. Check the troubleshooting guide in `docs/og-share-investigation.md`
2. Test with Facebook Sharing Debugger
3. Verify image meets specifications above
4. Review Next.js metadata implementation
5. Contact the development team

---

**Last Updated**: December 2024
**Maintained By**: Hexadigitall Development Team
