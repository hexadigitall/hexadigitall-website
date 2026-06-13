# Open Graph (OG) Share Investigation & Fixes

## Executive Summary

This document investigates why social sharable links are not displaying properly alongside Open Graph (OG) images when shared on Facebook, Instagram, and other social platforms. It provides a comprehensive diagnosis, reproduction steps, identified issues, and recommended fixes.

---

## 1. Issue Reproduction Steps

### Test Links Provided
- **Facebook Share**: https://www.facebook.com/share/17WUvhx5Bb/
- **Instagram Profile**: https://www.instagram.com/jhemawears?igsh=Y3huaHpvNGt1MjZq

### Reproduction Process

1. **Test with Facebook Sharing Debugger**
   ```
   URL: https://developers.facebook.com/tools/debug/
   Steps:
   - Enter the site URL (e.g., https://hexadigitall.com)
   - Click "Debug"
   - Review errors/warnings
   - Check if og:image loads properly
   - Click "Scrape Again" to refresh cache
   ```

2. **Test with LinkedIn Post Inspector**
   ```
   URL: https://www.linkedin.com/post-inspector/
   Steps:
   - Enter site URL
   - Review preview rendering
   - Check image dimensions and format
   ```

3. **Test with Twitter Card Validator**
   ```
   URL: https://cards-dev.twitter.com/validator
   Steps:
   - Enter site URL
   - Review card preview
   - Verify twitter:card meta tags
   ```

4. **Manual Share Test**
   - Copy site URL
   - Paste into Facebook/Instagram post composer
   - Check if preview appears with image
   - Verify title and description display correctly

---

## 2. Current Implementation Audit

### Meta Tags in `src/app/layout.tsx`

**✅ What's Working:**
- Basic Open Graph tags are present
- Twitter card meta tags included
- Image URL is absolute: `https://hexadigitall.com/digitall_partner.png`
- Metadata base URL is set correctly
- Image dimensions specified (1200x630)

**❌ Issues Identified:**

1. **Missing Canonical URL in OG tags**
   - Current: `url: 'https://hexadigitall.com'` (only in root)
   - Issue: Dynamic pages don't include canonical URLs
   - Impact: Facebook may not properly index or cache pages

2. **Image Format Considerations**
   - Current image: `digitall_partner.png` (PNG format)
   - Recommendation: Also provide JPG version for better compression
   - Facebook prefers: 1200x630px, JPG or PNG, < 8MB

3. **Missing `og:image:type` Meta Tag**
   - Not explicitly set in current implementation
   - Should specify: `image/png` or `image/jpeg`
   - Helps crawlers understand image format

4. **No `og:image:secure_url` for HTTPS**
   - While URL uses HTTPS, explicit secure_url not set
   - Recommended for better compatibility

5. **Missing `og:updated_time` for Content Freshness**
   - Not tracking when pages are updated
   - Important for news/blog content

6. **No `article:` Tags for Blog Posts**
   - Blog posts should use `og:type` = `article`
   - Should include: `article:published_time`, `article:author`

7. **Facebook App ID Missing from OpenGraph**
   - FB_APP_ID is set in head but may not be propagated correctly
   - Should verify environment variable is set in production

---

## 3. Common Pitfalls & Solutions

### Issue #1: Image Not Loading
**Symptoms:** Facebook shows broken image or generic placeholder

**Causes:**
- Image URL is relative instead of absolute
- Image file doesn't exist or returns 404
- Image is too large (>8MB) or wrong dimensions
- Server blocks social media crawlers

**Solutions:**
```typescript
// ✅ Always use absolute URLs
images: [{
  url: 'https://hexadigitall.com/og-images/page-name.jpg',
  width: 1200,
  height: 630,
  alt: 'Descriptive alt text',
  type: 'image/jpeg'
}]

// ✅ Ensure image is accessible
// Test: curl -I https://hexadigitall.com/digitall_partner.png
// Should return 200 OK
```

### Issue #2: Stale Cache
**Symptoms:** Old content shows even after updates

**Solutions:**
- Use Facebook Sharing Debugger "Scrape Again" button
- Add `og:updated_time` meta tag
- Implement unique image URLs per content version
- Consider adding cache-busting query params: `image.jpg?v=123`

### Issue #3: Dynamic Page URLs
**Symptoms:** Different pages show same preview

**Solutions:**
```typescript
// ✅ Use generateMetadata for dynamic pages
export async function generateMetadata({ params }): Promise<Metadata> {
  const data = await fetchPageData(params.slug);
  
  return {
    title: data.title,
    openGraph: {
      url: `https://hexadigitall.com/${params.slug}`,
      images: [{
        url: data.ogImage || 'https://hexadigitall.com/og-images/default.jpg',
      }]
    }
  }
}
```

### Issue #4: Instagram Limitations
**Important:** Instagram does NOT support Open Graph previews in bio links or direct messages

**Instagram Constraints:**
- Instagram bio link: No preview shown
- Instagram DMs: No preview for external links
- Instagram Stories: Limited link preview support
- Instagram Posts: Cannot include clickable external links

**Workarounds:**
- Use Instagram Stories with swipe-up (requires 10k+ followers or verified account)
- Use link-in-bio services (Linktree, Beacons)
- Focus on compelling captions and visuals
- Drive traffic to Facebook where OG previews work

### Issue #5: robots.txt and X-Robots-Tag
**Symptoms:** No preview appears at all

**Check:**
```bash
# Verify robots.txt allows crawlers
curl https://hexadigitall.com/robots.txt

# Should NOT block:
# User-agent: facebookexternalhit
# User-agent: Twitterbot
```

**Solution:**
```typescript
// In app/layout.tsx metadata
robots: {
  index: true,
  follow: true,
  googleBot: {
    index: true,
    follow: true,
  },
}
```

---

## 4. Recommended Meta Tags (Complete Example)

### For Static Pages (layout.tsx):

```typescript
export const metadata: Metadata = {
  metadataBase: new URL('https://hexadigitall.com'),
  title: {
    default: 'Hexadigitall | Business Planning, Web Dev & Digital Marketing',
    template: '%s | Hexadigitall'
  },
  description: 'Your all-in-one digital partner in Nigeria...',
  
  // Open Graph
  openGraph: {
    type: 'website',
    locale: 'en_US',
    url: 'https://hexadigitall.com',
    siteName: 'Hexadigitall',
    title: 'Hexadigitall | Your Digital Partner',
    description: 'Your all-in-one digital partner in Nigeria...',
    images: [{
      url: 'https://hexadigitall.com/og-images/services-hub.jpg',
      secureUrl: 'https://hexadigitall.com/og-images/services-hub.jpg',
      width: 1200,
      height: 630,
      alt: 'Hexadigitall - Professional Digital Services',
      type: 'image/jpeg'
    }],
  },
  
  // Twitter
  twitter: {
    card: 'summary_large_image',
    site: '@hexadigitall',
    creator: '@hexadigitall',
    title: 'Hexadigitall | Your Digital Partner',
    description: 'Expert web development, digital marketing...',
    images: ['https://hexadigitall.com/og-images/services-hub.jpg'],
  },
  
  // Additional
  alternates: {
    canonical: 'https://hexadigitall.com',
  },
  robots: {
    index: true,
    follow: true,
  },
};
```

### For Dynamic Pages (e.g., services/[slug]/page.tsx):

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const service = await fetchService(params.slug);
  
  return {
    title: service.title,
    description: service.description,
    openGraph: {
      type: 'website',
      url: `https://hexadigitall.com/services/${params.slug}`,
      title: service.title,
      description: service.description,
      images: [{
        url: service.ogImage || `https://hexadigitall.com/og-images/service-${params.slug}.jpg`,
        width: 1200,
        height: 630,
        alt: service.title,
        type: 'image/jpeg'
      }],
    },
    twitter: {
      card: 'summary_large_image',
      title: service.title,
      description: service.description,
      images: [service.ogImage || `https://hexadigitall.com/og-images/service-${params.slug}.jpg`],
    },
    alternates: {
      canonical: `https://hexadigitall.com/services/${params.slug}`,
    },
  };
}
```

### For Blog Posts:

```typescript
export async function generateMetadata({ params }): Promise<Metadata> {
  const post = await fetchBlogPost(params.slug);
  
  return {
    title: post.title,
    description: post.excerpt,
    openGraph: {
      type: 'article',
      url: `https://hexadigitall.com/blog/${params.slug}`,
      title: post.title,
      description: post.excerpt,
      publishedTime: post.publishedAt,
      modifiedTime: post.updatedAt,
      authors: [post.author.name],
      images: [{
        url: post.coverImage,
        width: 1200,
        height: 630,
        alt: post.title,
        type: 'image/jpeg'
      }],
    },
  };
}
```

---

## 5. Testing Checklist

### Pre-Deployment Tests

- [ ] **Image Accessibility Test**
  - [ ] Visit image URL directly in browser
  - [ ] Verify 200 OK response
  - [ ] Check image loads correctly
  - [ ] Test: `curl -I https://hexadigitall.com/og-images/services-hub.jpg`

- [ ] **Meta Tag Verification**
  - [ ] View page source
  - [ ] Verify all og: tags present
  - [ ] Verify all twitter: tags present
  - [ ] Check for duplicates
  - [ ] Validate URLs are absolute

- [ ] **Crawler Access Test**
  - [ ] Check robots.txt allows crawlers
  - [ ] Verify no X-Robots-Tag blocking
  - [ ] Test with: `curl -A "facebookexternalhit/1.1" https://hexadigitall.com`

### Post-Deployment Tests

- [ ] **Facebook Sharing Debugger**
  - [ ] URL: https://developers.facebook.com/tools/debug/
  - [ ] Test homepage
  - [ ] Test 3 service pages
  - [ ] Test 2 blog posts
  - [ ] Click "Scrape Again" for each
  - [ ] Verify no errors

- [ ] **LinkedIn Post Inspector**
  - [ ] URL: https://www.linkedin.com/post-inspector/
  - [ ] Test homepage
  - [ ] Verify image and text display correctly

- [ ] **Twitter Card Validator**
  - [ ] URL: https://cards-dev.twitter.com/validator
  - [ ] Test homepage
  - [ ] Verify card renders correctly

- [ ] **Manual Share Tests**
  - [ ] Facebook: Create test post with link
  - [ ] WhatsApp: Send link to yourself
  - [ ] LinkedIn: Create test post
  - [ ] Twitter: Create test tweet
  - [ ] Verify previews load correctly

---

## 6. Debugging Steps

### If Image Doesn't Show:

```bash
# 1. Check if image exists
curl -I https://hexadigitall.com/og-images/services-hub.jpg

# 2. Test as Facebook crawler
curl -A "facebookexternalhit/1.1" https://hexadigitall.com

# 3. Check response headers
curl -I https://hexadigitall.com | grep -i "x-robots\|cache"

# 4. Validate HTML meta tags
curl -s https://hexadigitall.com | grep -i "og:image"

# 5. Test with Facebook Debugger
# Visit: https://developers.facebook.com/tools/debug/
# Enter URL and click "Scrape Again"
```

### If Preview is Stale:

1. Clear Facebook cache using Sharing Debugger
2. Add version parameter to image URL: `image.jpg?v=2`
3. Check `og:updated_time` is set correctly
4. Verify CDN cache settings (if using CDN)

### If Wrong Content Shows:

1. Check `generateMetadata` is async and awaits data
2. Verify dynamic segment parameters are correct
3. Check for metadata inheritance conflicts
4. Ensure each page has unique og:url

---

## 7. Image Specifications

### Optimal Dimensions

| Platform | Recommended Size | Aspect Ratio | Format | Max Size |
|----------|-----------------|--------------|--------|----------|
| Facebook | 1200 × 630 px | 1.91:1 | JPG/PNG | 8 MB |
| LinkedIn | 1200 × 627 px | 1.91:1 | JPG/PNG | 5 MB |
| Twitter | 1200 × 675 px | 16:9 | JPG/PNG/GIF | 5 MB |
| Instagram* | N/A | N/A | N/A | N/A |

*Instagram does not support OG image previews for external links

### Safe Zone
- Keep important content in center 1000×500px
- Avoid text/logos near edges
- Some platforms crop images

### Image Requirements
- **Minimum**: 200 × 200 px
- **Recommended**: 1200 × 630 px
- **Formats**: JPG (preferred), PNG, GIF, WebP
- **File size**: < 8 MB (< 1 MB ideal for speed)
- **Compression**: Use quality 80-90 for JPG

---

## 8. Next Steps & Action Items

### Immediate Actions (Priority 1)

1. **Update existing metadata:**
   - [ ] Add `og:image:type` to all pages
   - [ ] Add `og:image:secure_url` where needed
   - [ ] Add canonical URLs to dynamic pages
   - [ ] Verify FB_APP_ID environment variable

2. **Test with Facebook Debugger:**
   - [ ] Homepage
   - [ ] All service pages
   - [ ] Sample blog posts
   - [ ] Document any errors

3. **Create missing OG images:**
   - [ ] Run `npm run og:generate` to create service images
   - [ ] Verify images exist in `public/og-images/`
   - [ ] Test image URLs directly

### Short-term Actions (Priority 2)

1. **Implement SiteSEO component:**
   - [ ] Create reusable component for consistent meta tags
   - [ ] Support both static and dynamic pages
   - [ ] Include sensible defaults

2. **Enhance OG image generation:**
   - [ ] Add more service-specific templates
   - [ ] Create blog post image generator
   - [ ] Automate image generation in CI/CD

3. **Add monitoring:**
   - [ ] Set up alerts for 404s on OG images
   - [ ] Monitor social share metrics
   - [ ] Track Facebook crawl errors

### Long-term Actions (Priority 3)

1. **Advanced features:**
   - [ ] Implement dynamic OG image generation (API route)
   - [ ] A/B test different image styles
   - [ ] Personalized OG images based on user segment

2. **Documentation:**
   - [ ] Create content guidelines for OG images
   - [ ] Train team on testing new pages
   - [ ] Document image update workflow

---

## 9. Environment Variables Required

```bash
# .env.local
NEXT_PUBLIC_FB_APP_ID=your_facebook_app_id
NEXT_PUBLIC_SITE_URL=https://hexadigitall.com
```

Verify these are set in production (Vercel/hosting platform).

---

## 10. Additional Resources

### Testing Tools
- **Facebook Sharing Debugger**: https://developers.facebook.com/tools/debug/
- **LinkedIn Post Inspector**: https://www.linkedin.com/post-inspector/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **Open Graph Check**: https://opengraphcheck.com/
- **Meta Tags**: https://metatags.io/

### Documentation
- **Open Graph Protocol**: https://ogp.me/
- **Twitter Cards**: https://developer.twitter.com/en/docs/twitter-for-websites/cards/overview/abouts-cards
- **Next.js Metadata**: https://nextjs.org/docs/app/building-your-application/optimizing/metadata
- **Facebook Best Practices**: https://developers.facebook.com/docs/sharing/webmasters

### Image Tools
- **Canva**: Create OG images (free templates)
- **Figma**: Design custom OG images
- **Cloudinary**: Dynamic image generation
- **imgix**: Real-time image processing

---

## 11. Known Issues & Limitations

### Instagram
- **No OG preview** for external links in bio or DMs
- **Stories only** for swipe-up links (requires 10k+ followers)
- **Focus on visual content** rather than link previews

### Facebook
- **Cache persistence**: May take 24 hours to update
- **Scrape frequency limit**: Can't refresh too often
- **Video previews**: Require additional og:video tags

### Twitter/X
- **Card approval**: Some accounts may need card approval
- **Image sizing**: Strictly enforces aspect ratios
- **Alt text**: Not always displayed

### WhatsApp
- **No validation tool**: Can't pre-test previews
- **Cache duration**: Unpredictable
- **Image compression**: May reduce quality

---

## 12. Success Criteria

After implementing fixes, the following should be true:

✅ **Facebook Sharing Debugger shows zero errors**
✅ **OG image displays in preview for all tested URLs**
✅ **Title and description match page content**
✅ **Image dimensions are 1200×630px**
✅ **All images return 200 OK status**
✅ **Dynamic pages have unique canonical URLs**
✅ **Twitter Card Validator shows proper card preview**
✅ **LinkedIn Post Inspector displays correctly**
✅ **Manual share tests show consistent results**

---

## Conclusion

The current implementation has a solid foundation with basic Open Graph tags, but lacks some crucial details that can cause issues with social media previews. By implementing the recommended fixes—particularly adding missing meta tags, ensuring proper image specifications, and implementing the SiteSEO component—we can ensure reliable and consistent social sharing across all platforms.

**Key Takeaway**: Instagram does not support OG previews, so focus efforts on Facebook, Twitter, LinkedIn, and WhatsApp where OG tags are fully functional.

---

**Document Version**: 1.0
**Last Updated**: December 2024
**Author**: Hexadigitall Development Team
