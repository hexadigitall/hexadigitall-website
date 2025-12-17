# Shareable Link Package - Technical Specification

## Overview

This document describes the customizable shareable link feature for Jhema Wears e-commerce platform. This feature enables products and collections to be easily shared on social media with rich previews, tracking, and referral functionality.

---

## 1. Feature Description

### What Are Shareable Links?

Shareable links are specially formatted URLs that, when shared on social platforms (WhatsApp, Facebook, Instagram, LinkedIn), display rich previews including:
- Product image
- Product title
- Price
- Brief description
- Brand logo/name

### Why They Matter

**Statistics:**
- **94% more clicks** on links with images vs. text-only
- **73% of shoppers** share products they like
- **5x better conversion** from social shares vs. paid ads
- **84% of consumers** trust peer recommendations

**Business Impact:**
- Turn customers into brand ambassadors
- Organic reach amplification
- Lower customer acquisition cost
- Increased trust and social proof

---

## 2. Technical Implementation

### 2.1 Open Graph (OG) Meta Tags

Every product page includes complete OG metadata:

```html
<meta property="og:type" content="product" />
<meta property="og:url" content="https://jhemawears.com/products/summer-dress" />
<meta property="og:title" content="Premium Summer Dress - Jhema Wears" />
<meta property="og:description" content="Elegant summer dress perfect for any occasion. Available in multiple colors." />
<meta property="og:image" content="https://jhemawears.com/og-images/summer-dress.jpg" />
<meta property="og:image:width" content="1200" />
<meta property="og:image:height" content="630" />
<meta property="og:image:type" content="image/jpeg" />
<meta property="og:image:alt" content="Premium Summer Dress" />
<meta property="og:site_name" content="Jhema Wears" />

<!-- Product-specific tags -->
<meta property="product:price:amount" content="45000" />
<meta property="product:price:currency" content="NGN" />
<meta property="product:availability" content="in stock" />
<meta property="product:brand" content="Jhema Wears" />
<meta property="product:category" content="Dresses" />
```

### 2.2 Twitter Card Tags

```html
<meta name="twitter:card" content="summary_large_image" />
<meta name="twitter:site" content="@jhemawears" />
<meta name="twitter:title" content="Premium Summer Dress - Jhema Wears" />
<meta name="twitter:description" content="Elegant summer dress perfect for any occasion." />
<meta name="twitter:image" content="https://jhemawears.com/og-images/summer-dress.jpg" />
```

### 2.3 WhatsApp Optimization

WhatsApp specifically reads OG tags. Optimization includes:
- Image dimensions: 1200x630px (optimal for WhatsApp preview)
- File size: < 300KB (fast loading on mobile data)
- Format: JPEG (best compatibility)
- Alt text: Descriptive for accessibility

---

## 3. Share Button Component

### 3.1 UI/UX Design

**Button Placement:**
- Product detail page (above fold)
- Quick view modal
- Cart sidebar
- Collection pages (hover state)

**Visual Design:**
```
┌─────────────────────────────────────┐
│  Share this product:                │
│  [FB] [TW] [WA] [IN] [📋]          │
│  With labels:                       │
│  [Facebook] [Twitter] [WhatsApp]... │
└─────────────────────────────────────┘
```

### 3.2 Supported Platforms

| Platform | Share Method | Preview Support |
|----------|-------------|-----------------|
| WhatsApp | Web API | ✅ Full OG |
| Facebook | Sharer API | ✅ Full OG |
| Instagram | Copy + Stories | ⚠️ Limited* |
| Twitter/X | Web Intent | ✅ Twitter Card |
| LinkedIn | Share URL | ✅ Full OG |
| Email | mailto: | ✅ HTML Email |

*Instagram: No OG in feed posts, but Stories/DMs support links

### 3.3 Component API

```typescript
interface ShareButtonsProps {
  url: string;                    // Product URL
  title: string;                  // Product name
  description: string;            // Product description
  imageUrl: string;               // Product image
  price?: string;                 // Display price
  showLabels?: boolean;           // Show text labels
  size?: 'sm' | 'md' | 'lg';     // Button size
  platforms?: Platform[];         // Which platforms to show
  onShare?: (platform: string) => void; // Track shares
}

// Usage
<ShareButtons
  url={productUrl}
  title={product.name}
  description={product.description}
  imageUrl={product.ogImage}
  price={product.price}
  showLabels={true}
  size="lg"
  platforms={['whatsapp', 'facebook', 'twitter']}
  onShare={(platform) => {
    // Analytics tracking
    gtag('event', 'share', {
      method: platform,
      content_type: 'product',
      item_id: product.id
    });
  }}
/>
```

---

## 4. UTM Tracking & Analytics

### 4.1 URL Parameters

Every shared link includes UTM parameters for tracking:

```
https://jhemawears.com/products/summer-dress?
  utm_source=whatsapp&
  utm_medium=social&
  utm_campaign=organic_share&
  utm_content=product_summer_dress&
  ref=USER_ID
```

**Parameters:**
- `utm_source`: Platform (whatsapp, facebook, instagram, twitter)
- `utm_medium`: Always "social"
- `utm_campaign`: "organic_share" or custom campaign
- `utm_content`: Product slug or ID
- `ref`: Referrer user ID (for referral tracking)

### 4.2 Analytics Dashboard

**Metrics Tracked:**
- Total shares per product
- Shares by platform
- Click-through rate (CTR) from shares
- Conversion rate from shared links
- Revenue attributed to shares
- Top sharers (referral program)

**Dashboard View:**
```
Product: Summer Dress
─────────────────────────────────────
Shares:       247
Clicks:       1,823 (CTR: 7.4x)
Conversions:  89
Revenue:      ₦4,005,000
ROI:          ∞ (organic)
─────────────────────────────────────
Platform Breakdown:
WhatsApp:     142 shares (57%)
Facebook:     73 shares (30%)
Instagram:    19 shares (8%)
Twitter:      13 shares (5%)
```

---

## 5. Referral Program Integration

### 5.1 How It Works

1. **Customer Shares Product**
   - Gets unique referral link
   - Example: `?ref=ABC123`

2. **Friend Clicks Link**
   - Lands on product page
   - Sees "Shared by [Name]" badge
   - Gets 10% discount code

3. **Friend Makes Purchase**
   - Original sharer gets reward:
     - 5% commission, OR
     - ₦500 store credit, OR
     - Points toward rewards

4. **Both Win! 🎉**

### 5.2 API Contract

**Endpoint:** `POST /api/referral/track`

**Request:**
```json
{
  "referrerId": "user_abc123",
  "productId": "prod_summer_dress",
  "referralCode": "ABC123",
  "platform": "whatsapp"
}
```

**Response:**
```json
{
  "success": true,
  "referralLink": "https://jhemawears.com/products/summer-dress?ref=ABC123",
  "discount": {
    "code": "FRIEND10",
    "amount": 10,
    "type": "percentage"
  },
  "reward": {
    "type": "commission",
    "amount": 5,
    "currency": "percentage"
  }
}
```

---

## 6. Image Generation

### 6.1 Static OG Images

For products with pre-defined images:

**Specifications:**
- Dimensions: 1200x630px
- Format: JPEG (quality: 85%)
- File size: < 300KB
- Template: Brand-consistent design

**Template Layout:**
```
┌─────────────────────────────────────────┐
│                                         │
│  [Product Image - 60%]  │ [Jhema Logo]│
│                         │              │
│                         │ Product Name │
│                         │              │
│                         │ ₦45,000      │
│                         │              │
│                         │ [Shop Now]   │
└─────────────────────────────────────────┘
```

### 6.2 Dynamic OG Image API (Optional)

For real-time image generation:

**Endpoint:** `/api/og-image?product=[id]`

**Features:**
- Generate images on-the-fly
- Include latest price
- Show stock status
- Add sale badges
- Personalization (shared by [Name])

**Example:**
```
GET /api/og-image?product=summer-dress&ref=user123

Response: <image/jpeg>
```

---

## 7. Example Payloads

### 7.1 Product Share Event

```json
{
  "event": "product_share",
  "timestamp": "2024-12-17T12:00:00Z",
  "product": {
    "id": "prod_summer_dress",
    "name": "Premium Summer Dress",
    "price": 45000,
    "currency": "NGN",
    "url": "https://jhemawears.com/products/summer-dress",
    "imageUrl": "https://jhemawears.com/images/summer-dress.jpg",
    "category": "Dresses"
  },
  "share": {
    "platform": "whatsapp",
    "shareUrl": "https://wa.me/?text=...",
    "referralCode": "ABC123",
    "utmParams": {
      "source": "whatsapp",
      "medium": "social",
      "campaign": "organic_share"
    }
  },
  "user": {
    "id": "user_123",
    "email": "customer@example.com"
  }
}
```

### 7.2 Share Click Event

```json
{
  "event": "share_click",
  "timestamp": "2024-12-17T12:05:00Z",
  "referralCode": "ABC123",
  "source": "whatsapp",
  "ipAddress": "102.89.x.x",
  "userAgent": "WhatsApp/2.x...",
  "productId": "prod_summer_dress"
}
```

### 7.3 Share Conversion Event

```json
{
  "event": "share_conversion",
  "timestamp": "2024-12-17T12:30:00Z",
  "orderId": "order_789",
  "referralCode": "ABC123",
  "product": {
    "id": "prod_summer_dress",
    "quantity": 1,
    "price": 45000
  },
  "commission": {
    "referrerId": "user_123",
    "amount": 2250,
    "type": "percentage",
    "percentage": 5
  }
}
```

---

## 8. Mockup Examples

### 8.1 WhatsApp Preview

```
┌───────────────────────────────────────┐
│ 👤 Sarah                              │
│ ─────────────────────────────────────  │
│ Check out this dress! 😍              │
│                                       │
│ ┌─────────────────────────────────┐  │
│ │ [Image of dress]                 │  │
│ │                                  │  │
│ │ Premium Summer Dress             │  │
│ │ Jhema Wears                      │  │
│ │ ₦45,000                          │  │
│ │                                  │  │
│ │ 🔗 jhemawears.com                │  │
│ └─────────────────────────────────┘  │
│                                       │
│ Today 10:30 AM                    ✓✓ │
└───────────────────────────────────────┘
```

### 8.2 Facebook Post Preview

```
┌───────────────────────────────────────────┐
│ Sarah Johnson                             │
│ Just now · 🌍                             │
│ ───────────────────────────────────────── │
│ Found the perfect dress for the wedding! │
│                                           │
│ ┌─────────────────────────────────────┐  │
│ │                                      │  │
│ │      [Large product image]           │  │
│ │                                      │  │
│ ├─────────────────────────────────────┤  │
│ │ JHEMAWEARS.COM                       │  │
│ │ Premium Summer Dress - ₦45,000       │  │
│ │ Elegant summer dress perfect for     │  │
│ │ any occasion. Available in multiple  │  │
│ │ colors and sizes.                    │  │
│ └─────────────────────────────────────┘  │
│                                           │
│ 👍 Like  💬 Comment  ↗️ Share            │
└───────────────────────────────────────────┘
```

### 8.3 Instagram Story Link Sticker

```
┌───────────────────────────┐
│                           │
│    [Story content]        │
│                           │
│                           │
│    ┌─────────────┐        │
│    │             │        │
│    │  Shop Now ↗️│        │
│    │             │        │
│    └─────────────┘        │
│                           │
│  Swipe up to shop         │
└───────────────────────────┘
```

---

## 9. Testing Checklist

### Pre-Launch Tests

- [ ] Test share buttons on desktop
- [ ] Test share buttons on mobile
- [ ] Verify OG tags in HTML source
- [ ] Test with Facebook Sharing Debugger
- [ ] Test with Twitter Card Validator
- [ ] Test with LinkedIn Post Inspector
- [ ] Share to WhatsApp and verify preview
- [ ] Share to personal Facebook and verify
- [ ] Verify UTM parameters are added
- [ ] Test referral code generation
- [ ] Verify analytics tracking
- [ ] Test on multiple devices/browsers
- [ ] Load test share endpoint (1000 req/min)
- [ ] Security test (injection, CSRF)

### Platform-Specific Tests

**WhatsApp:**
- [ ] Preview shows on Android
- [ ] Preview shows on iOS
- [ ] Preview shows on WhatsApp Web
- [ ] Image loads quickly on 3G

**Facebook:**
- [ ] Preview in Feed
- [ ] Preview in Messenger
- [ ] Preview in Groups
- [ ] Scraper updates on product changes

**Instagram:**
- [ ] Stories link works
- [ ] DM link works
- [ ] Bio link works (if using link service)

---

## 10. Performance Metrics

### Success Indicators

**Engagement:**
- Share button click rate: > 8%
- Shares per product view: > 3%
- Share-to-click rate: > 15%

**Conversion:**
- Share referral conversion: > 5%
- Revenue from shares: > 15% of total
- Average order value (shares): +20% vs organic

**Platform Performance:**
- WhatsApp: 60% of shares (highest in Nigeria)
- Facebook: 25% of shares
- Instagram: 10% of shares
- Twitter: 5% of shares

### ROI Calculation

```
Shares per month: 1,000
Click-through: 15% = 150 clicks
Conversion: 5% = 7.5 conversions ≈ 8 sales
Average order: ₦50,000
Monthly revenue: ₦400,000
Annual revenue: ₦4,800,000
Implementation cost: ₦500,000 (one-time)
ROI: 960% in year 1
```

---

## 11. Maintenance & Updates

### Regular Tasks

**Weekly:**
- Monitor share metrics
- Check for broken images
- Review top shared products

**Monthly:**
- A/B test share button designs
- Optimize OG images
- Update referral rewards

**Quarterly:**
- Review platform algorithm changes
- Test new social platforms
- Update share messaging

---

## 12. Future Enhancements

**Phase 2:**
- [ ] Video OG previews (Facebook supports)
- [ ] Personalized share messages
- [ ] AI-generated share captions
- [ ] Share incentive popups
- [ ] Gamification (share badges, levels)

**Phase 3:**
- [ ] Collaborative wishlists
- [ ] Group buying (share to get discount)
- [ ] Social shopping events
- [ ] Influencer partnership tracking

---

## Summary

The shareable link package transforms Jhema Wears customers into brand ambassadors through:

✅ Beautiful social previews  
✅ One-click sharing  
✅ UTM tracking  
✅ Referral rewards  
✅ Analytics dashboard  
✅ Platform optimization  

**Expected Impact:**
- 30% increase in organic traffic
- 15-20% of revenue from shares
- Lower customer acquisition cost
- Stronger brand community

**Investment:** Included in Standard and Premium packages

---

**Document Version:** 1.0  
**Last Updated:** December 17, 2024  
**Status:** Production Ready
