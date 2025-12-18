# Diva's Kloset Social Media Marketing Assets

## 📦 What's Inside

This folder contains a **complete, ready-to-post social media campaign** for Diva's Kloset's December marketing initiative.

### Folder Structure

```
forSMM/
├── templates/           # HTML/CSS/JS design files
├── images/             # Generated social media assets (PNG & JPG)
├── generate-social-images.mjs   # Puppeteer script to (re)generate images
├── CAMPAIGN_GUIDE.md   # Complete strategy & posting guide
└── README.md           # This file
```

---

## 🎨 5 Campaign Themes

Each theme targets different customer emotions and buying triggers:

1. **Season of Style** – Elegant holiday collection launch
2. **Slay into 2026** – Confidence & New Year vibes
3. **Gift the Style** – Gifting/gift guide content
4. **24-Hour Flash** – Daily flash sales with urgency
5. **Meet the Curator** – Behind-the-scenes brand story

---

## 📱 Ready-to-Use Image Assets

All images are generated in **4 platform formats** for each theme:

- **Instagram Square** (1080×1080) – Feed posts
- **Instagram Story & TikTok** (1080×1920) – Vertical content
- **Facebook** (1200×628) – Feed & sharing
- **Both PNG & JPG** – Choose based on file size vs. quality

**Total Assets:** 5 themes × 4 formats × 2 file types = **40 production-ready images**

### Quick Access

```
images/
├── season-of-style/
│   ├── instagram-square/
│   ├── instagram-story/
│   ├── facebook/
│   └── tiktok/
├── slay-into-2026/
├── gift-the-style/
├── flash-sale/
└── meet-curator/
```

---

## 📋 How to Use

### For Social Media Posting

1. **Pick a theme** based on the posting calendar in `CAMPAIGN_GUIDE.md`
2. **Download the image** for your platform (e.g., `instagram-square.jpg` for Instagram feed)
3. **Add your caption** from the suggested copy in the guide
4. **Post & engage!**

### For Design Customization

If you want to change colors, text, or layout:

1. **Edit the HTML file** in `/templates/`
   - Example: `season-of-style.html`
   - Change colors, copy, emoji, CTA text
2. **Regenerate images** by running:
   ```bash
   cd forSMM
   node generate-social-images.mjs
   ```
3. **New images appear in** `/images/` folder

---

## 🎯 Campaign Timeline

- **Week 1-2:** Season of Style + Slay into 2026 (launch phase)
- **Week 3:** Gift the Style + Meet the Curator (gifting season)
- **Week 4:** 24-Hour Flash Sales (daily rotation)
- **Ongoing:** Community engagement & UGC

See `CAMPAIGN_GUIDE.md` for detailed posting calendar and copy suggestions.

---

## 🚀 Quick Start Checklist

- [ ] Open `CAMPAIGN_GUIDE.md` for complete strategy
- [ ] Download images from `/images/` for this week
- [ ] Schedule posts on Instagram/Facebook/TikTok
- [ ] Copy suggested captions from the guide
- [ ] Set up UTM codes for tracking
- [ ] Monitor engagement daily

---

## 🎨 Brand Identity

**Colors:**
- Magenta: #FF1493 (primary, high energy)
- Gold: #FFD700 (accents, luxury)
- Charcoal: #1A1A1A (sophistication)
- Cream: #F5F1E8 (balance)

**Typography:** Bold sans-serif headers, clean secondary fonts

**Aesthetic:** Luxury boutique, glossy, high-contrast, aspirational

---

## 💾 File Specifications

| Format | Best For | Size | Quality |
|--------|----------|------|---------|
| JPG | Web posting, faster load | ~200-400 KB | 95% (excellent) |
| PNG | Backup, print quality | ~600-1.2 MB | Lossless |

**Recommendation:** Use JPG for all social posting (faster uploads, smaller files). Keep PNG as backup.

---

## 🔄 Regenerating Images

The `generate-social-images.mjs` script uses **Puppeteer** to convert HTML templates to high-quality images.

**Prerequisites:**
- Node.js installed
- Puppeteer package (included in project)

**To regenerate:**
```bash
cd forSMM
npm install puppeteer  # if not already installed
node generate-social-images.mjs
```

**Processing Time:** ~2-3 minutes for all 40 images

---

## 📊 Success Metrics to Track

- **Engagement Rate:** 4-6% on Instagram, 2-3% on Facebook
- **Click-Through Rate:** 2-4% on CTAs
- **Conversion Rate:** 1-2% from social to purchase
- **Video Completion:** 60%+ on TikTok

Track in native platform analytics + Google Analytics with UTM codes.

---

## 🎁 Campaign Extensions

**Email Integration:** Send campaign emails to subscriber list  
**Influencer Collaboration:** Micro-influencers wearing Diva's Kloset pieces  
**User-Generated Content:** Repost customer photos (branded hashtag #StyleWithDivas)  
**Paid Ads:** Retargeting on Instagram/Facebook (optional boost)

---

## 📞 Notes for the Meeting

**Selling Points:**
- ✨ **5 distinct themes** = varied messaging, no fatigue
- 🎨 **Luxury aesthetic** = brand positioning at premium tier
- 📱 **Multi-platform optimized** = Instagram, Facebook, TikTok ready
- ⚡ **Urgency-driven** = flash sales maximizing December conversions
- 👑 **Brand storytelling** = humanize the business, build loyalty
- 📊 **Trackable & measurable** = data-driven optimization

---

## Questions?

See `CAMPAIGN_GUIDE.md` for complete details on:
- Theme messaging & target audience
- Social copy suggestions
- Posting calendar & frequency
- Platform-specific tips
- Tracking & analytics setup

---

**Ready to launch your December SMM campaign!** 🚀✨

