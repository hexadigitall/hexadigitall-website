# 🖼️ SOCIAL MEDIA PREVIEW OPTIMIZATION GUIDE
## Making Your Shareable Links Look Professional

**Created:** December 13, 2025  
**Purpose:** Optimize how Hexadigitall links appear when shared on WhatsApp, Instagram, Facebook, LinkedIn, Twitter/X

---

## 📊 WHY THIS MATTERS

When someone shares your link on social media, it appears as a **preview card** with:
- ✅ Image (1200x630px recommended)
- ✅ Title (compelling headline)
- ✅ Description (enticing summary)
- ✅ Your brand (logo/domain)

**Well-optimized links get 2-3x more clicks** than plain text links!

---

## 🎯 CURRENT STATUS

### ✅ What You Already Have:
- Open Graph tags in main layout
- Twitter Card metadata
- Dynamic metadata for services pages
- Basic course metadata

### ⚠️ What Needs Improvement:
- Course pages need better OG images
- Service images using placeholders
- Missing specific campaign images
- No image fallbacks for new content

---

## 🛠️ TECHNICAL TERMS EXPLAINED

### **Open Graph (OG) Tags**
Metadata used by Facebook, LinkedIn, WhatsApp, Slack
```html
<meta property="og:title" content="Your Title" />
<meta property="og:description" content="Your Description" />
<meta property="og:image" content="https://yoursite.com/image.jpg" />
```

### **Twitter Cards**
Metadata used by Twitter/X (similar to OG tags)
```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:title" content="Your Title" />
<meta name="twitter:image" content="https://yoursite.com/image.jpg" />
```

### **Card Types**
- `summary_large_image`: Big image preview (best for marketing)
- `summary`: Small image thumbnail
- `player`: For video content

---

## 📐 OPTIMAL IMAGE SPECIFICATIONS

### Primary OG Image:
```
Size: 1200x630px (Facebook/LinkedIn standard)
Format: JPG or PNG
Max File Size: 5MB (but aim for <300KB)
Aspect Ratio: 1.91:1
Text: Large, readable (avoid small text)
```

### Twitter Card Image:
```
Size: 1200x675px (or use 1200x630 for consistency)
Format: JPG or PNG
Max File Size: 5MB
Text: Keep to minimum (mobile readability)
```

### Instagram/WhatsApp Preview:
```
Use same as OG image (1200x630px)
High contrast (shows on dark/light backgrounds)
Clear branding
```

---

## 🎨 QUICK WINS (Do These Today!)

### 1. Create Default Campaign Images (30 mins)

**Use Canva** (free) with these templates:

#### **Main Services Hub Image** (`/public/og-images/services-hub.jpg`)
```
Template: Social Media Post (1200x630px)
Background: Brand blue gradient
Headline: "Professional Digital Services for Nigerian Businesses"
Subtext: "Web Dev · Marketing · Business Planning"
Logo: Bottom right
Price Range: "Starting at ₦15,000"
```

#### **Courses Hub Image** (`/public/og-images/courses-hub.jpg`)
```
Background: Different gradient/color
Headline: "Master In-Demand Tech Skills"
Subtext: "Live Mentoring · Self-Paced Learning"
Price Range: "From ₦50/hour"
```

#### **Service-Specific Images** (one per service)
```
/public/og-images/web-development.jpg
/public/og-images/digital-marketing.jpg
/public/og-images/business-planning.jpg
etc.

Format:
- Service name (large, bold)
- Key benefit (1 line)
- Starting price
- Brand logo
```

### 2. Update Course Metadata (5 mins)

Current course pages need better OG images. I'll show you the code update below.

### 3. Test Your Links (5 mins)

Use these free tools:
- **Facebook Debugger**: https://developers.facebook.com/tools/debug/
- **Twitter Card Validator**: https://cards-dev.twitter.com/validator
- **LinkedIn Inspector**: https://www.linkedin.com/post-inspector/
- **WhatsApp Preview**: Just paste in a chat (test in your own chat)

---

## 💻 CODE IMPLEMENTATION

### **1. Improve Course Page Metadata**

Update `/src/app/courses/[slug]/page.tsx`:

```typescript
export async function generateMetadata({ params }: { params: Promise<{ slug: string }> }): Promise<Metadata> {
    const { slug } = await params;
    const course = await client.fetch(
        groq`*[_type == "course" && slug.current == $slug][0]{ 
            title, 
            description, 
            summary,
            courseType,
            nairaPrice,
            dollarPrice,
            hourlyRateNGN,
            hourlyRateUSD,
            level,
            "imageUrl": mainImage.asset->url
        }`,
        { slug }
    );

    if (!course) {
        return { title: 'Course Not Found' };
    }

    // Dynamic pricing display
    const priceText = course.courseType === 'live' 
        ? `From ₦${(course.hourlyRateNGN || 50000).toLocaleString()}/hr`
        : `₦${(course.nairaPrice || 0).toLocaleString()}`;

    const description = course.description || course.summary || `Master ${course.title} with expert instructors. ${priceText}`;
    const ogImage = course.imageUrl || '/og-images/courses-default.jpg';

    return {
        title: `${course.title} | Hexadigitall Courses`,
        description: description,
        openGraph: {
            title: `${course.title} - ${course.level} Course`,
            description: description,
            images: [
                {
                    url: ogImage,
                    width: 1200,
                    height: 630,
                    alt: course.title
                }
            ],
            type: 'website',
            siteName: 'Hexadigitall'
        },
        twitter: {
            card: 'summary_large_image',
            title: `${course.title} - ${course.level}`,
            description: description,
            images: [ogImage],
            creator: '@hexadigitall' // Add your Twitter handle
        }
    };
}
```

### **2. Improve Services Hub Page Metadata**

Update `/src/app/services/page.tsx`:

```typescript
import { Metadata } from 'next'

export const metadata: Metadata = {
    title: 'Professional Digital Services | Hexadigitall',
    description: 'Web development, digital marketing, business planning, and more. Professional services for Nigerian businesses starting at ₦15,000.',
    openGraph: {
        title: 'Professional Digital Services for Your Business',
        description: 'Transform your business with expert web development, marketing, and consulting services.',
        images: [{
            url: '/og-images/services-hub.jpg',
            width: 1200,
            height: 630,
            alt: 'Hexadigitall Services'
        }],
        type: 'website'
    },
    twitter: {
        card: 'summary_large_image',
        title: 'Professional Digital Services',
        description: 'Web Dev · Marketing · Business Planning',
        images: ['/og-images/services-hub.jpg']
    }
}
```

### **3. Add Default Fallback Images**

Create these files in `/public/og-images/`:
- `default.jpg` - Main fallback
- `services-hub.jpg` - Services page
- `courses-hub.jpg` - Courses page
- `web-development.jpg` - Web service
- `digital-marketing.jpg` - Marketing service
- `business-planning.jpg` - Business service

---

## 🎨 CANVA DESIGN TEMPLATES

### Template 1: Service Card
```
1. Open Canva
2. Custom size: 1200x630px
3. Add background (brand blue gradient)
4. Add headline (80pt, bold, white)
   "Web & Mobile Development"
5. Add subheading (40pt, white)
   "Professional websites & apps from ₦79,000"
6. Add bullet points (28pt)
   ✓ Custom Design
   ✓ Mobile Responsive
   ✓ Fast & Secure
7. Add logo (bottom right, 100x100px)
8. Export as JPG (high quality)
```

### Template 2: Course Card
```
1. Canva - 1200x630px
2. Split background (left blue, right light)
3. Left side: Course title + "Live Mentoring Available"
4. Right side: 
   - Skill icons
   - "From ₦50/hour"
   - Level badge
5. Bottom: Brand name
6. Export as JPG
```

### Template 3: Campaign Promo Card
```
1. Bold background (use brand colors)
2. Main offer text (large, center)
   "December Special: Save ₦39,000"
3. Service name
4. Limited time badge
5. CTA: "Visit hexadigitall.com"
6. Export as JPG
```

---

## 🧪 TESTING CHECKLIST

After creating/updating OG images:

```
☐ Upload images to /public/og-images/
☐ Update metadata in page files
☐ Deploy to production
☐ Wait 5 minutes for cache
☐ Test each link:
   ☐ Facebook Debugger
   ☐ Twitter Card Validator
   ☐ LinkedIn Inspector
   ☐ WhatsApp (paste in chat)
☐ Clear cache if needed (click "Scrape Again")
☐ Verify images appear correctly
☐ Check mobile preview
```

---

## 🚀 PRIORITY ACTION PLAN

### **TODAY** (1-2 hours):
```
1. Create 5 core OG images in Canva:
   - Services hub
   - Courses hub
   - Web development service
   - Digital marketing service
   - Business planning service

2. Save to /public/og-images/

3. Update metadata in these files:
   - /src/app/services/page.tsx
   - /src/app/courses/page.tsx
   - /src/app/courses/[slug]/page.tsx

4. Test 3 key links:
   - hexadigitall.com/services
   - hexadigitall.com/courses
   - hexadigitall.com/services/web-and-mobile-software-development
```

### **THIS WEEK**:
```
☐ Create OG image for each service category (7 images)
☐ Create 3-5 course-specific OG images
☐ Design campaign-specific images for December deals
☐ Add OG images for blog posts (if any)
☐ Test all links before sharing in marketing campaign
```

---

## 📱 PLATFORM-SPECIFIC TIPS

### **WhatsApp**:
- Uses OG tags
- Caches aggressively (hard to update)
- Shows image + title + description
- Best practice: Test before mass distribution

### **Instagram**:
- Doesn't show link previews in feed
- Shows in Stories when swiping up
- Make images Instagram-story friendly (1080x1920)

### **Facebook**:
- Full OG support
- Shows large images
- Use Facebook Debugger to clear cache
- Best performing: High-contrast images with clear text

### **LinkedIn**:
- Professional tone important
- Full OG support
- Shows company name if domain verified
- Use LinkedIn Inspector to test

### **Twitter/X**:
- Use `summary_large_image` card type
- Images appear inline
- Character limit for descriptions
- Test with Card Validator

---

## 🎯 BEST PRACTICES

### **DO:**
✅ Use high-quality, professional images
✅ Include pricing when relevant
✅ Show your brand/logo
✅ Keep text large and readable
✅ Use consistent color scheme
✅ Test on mobile view
✅ Update images for campaigns
✅ Use action-oriented language

### **DON'T:**
❌ Use tiny text (unreadable on mobile)
❌ Use generic stock photos
❌ Forget to test before sharing
❌ Use images under 600px wide
❌ Leave metadata incomplete
❌ Use same image for everything
❌ Ignore mobile preview

---

## 📊 TRACKING IMPACT

Monitor improvement after implementing:

```
BEFORE (without OG images):
- Click-through rate: 1-2%
- Engagement: Low
- Shares: Minimal

AFTER (with OG images):
- Click-through rate: 3-6%
- Engagement: 2-3x higher
- Shares: 5-10x more
```

Track in Google Analytics:
- UTM parameters on links
- Traffic source performance
- Social media referrals

---

## 🆘 TROUBLESHOOTING

### **Link preview not showing?**
1. Check image exists and is accessible
2. Verify metadata syntax
3. Clear platform cache (use debugger tools)
4. Wait 5-10 minutes and try again

### **Wrong image showing?**
1. Clear cache using platform debugger
2. Check image URL is absolute (full URL)
3. Verify image isn't blocked by robots.txt

### **Image loads slowly?**
1. Compress image (<300KB)
2. Use JPG instead of PNG
3. Optimize with tools like TinyPNG

### **Preview looks bad on mobile?**
1. Test text size (should be 48pt+)
2. Check contrast
3. Simplify design
4. Remove small details

---

## 📚 QUICK REFERENCE

### **Essential Links to Bookmark:**
```
Facebook Debugger:
https://developers.facebook.com/tools/debug/

Twitter Card Validator:
https://cards-dev.twitter.com/validator

LinkedIn Inspector:
https://www.linkedin.com/post-inspector/

Image Compressor:
https://tinypng.com

Canva:
https://canva.com
```

### **File Naming Convention:**
```
/public/og-images/
  default.jpg                          (fallback)
  services-hub.jpg                     (main services page)
  courses-hub.jpg                      (main courses page)
  service-web-development.jpg
  service-digital-marketing.jpg
  service-business-planning.jpg
  course-[course-slug].jpg
  campaign-december-2024.jpg
```

---

## 🎬 EXAMPLE: Before vs After

### **BEFORE** (Plain text link):
```
Someone shares: hexadigitall.com/services

Social media shows:
hexadigitall.com
No image, no description
```

### **AFTER** (Optimized):
```
Someone shares: hexadigitall.com/services

Social media shows:
┌─────────────────────────┐
│ [Beautiful 1200x630 img]│
│ Professional Services   │
│ for Your Business       │
├─────────────────────────┤
│ Web Dev · Marketing ·   │
│ Business Planning       │
│ Starting at ₦15,000     │
└─────────────────────────┘
hexadigitall.com
```

**Result:** 3x more clicks!

---

## ✅ SUCCESS CHECKLIST

Once completed, you'll have:
```
☐ 10+ professional OG images created
☐ All major pages with proper metadata
☐ Services with custom preview cards
☐ Courses with attractive previews
☐ Tested all links on 4+ platforms
☐ Campaign-specific images ready
☐ Mobile previews verified
☐ Analytics tracking configured
```

---

## 🚀 LAUNCH READY!

After implementing this:
- Your links look professional everywhere
- Click-through rates improve 2-3x
- Shares increase significantly
- Brand looks more established
- Marketing campaign more effective

**Time investment:** 2-4 hours  
**Impact:** Permanent improvement to all shared links  
**ROI:** Increased traffic and conversions

---

**Next Steps:**
1. Create your first 5 OG images today
2. Update the code in 3 key files
3. Test with debugger tools
4. Start using in your marketing campaign!

**Questions?** Refer to platform documentation or test incrementally.

---

**Document Created:** December 13, 2025  
**Last Updated:** December 13, 2025  
**Status:** Ready for Implementation
