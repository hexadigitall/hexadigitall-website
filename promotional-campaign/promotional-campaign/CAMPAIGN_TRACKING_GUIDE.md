# Campaign Tracking Setup & Reference

This document explains the tracking system for the 30-day aggressive market penetration campaign.

---

## Overview

Track every post across all platforms and cities to identify:
- **Hot city/service combos** (high engagement, low cost per lead)
- **Underperformers** (pivot copy or reallocate budget)
- **Best platforms** (Facebook vs. Twitter vs. IG for each service)
- **Optimal posting times** (when your audience is most active)

---

## Tracking Sheet Template

**Use this in Google Sheets, Excel, or Airtable.**

### Column Headers

| A | B | C | D | E | F | G | H | I | J | K | L | M | N | O |
|---|---|---|---|---|---|---|---|---|---|---|---|---|---|---|
| Date | Service | City | Platform | URL | Copy Angle | Posted Time | Reach | Impressions | Engagement | Clicks | CTR % | Leads | Lead Cost | Conversions |

### Sample Row (Day 1 — Web Development, Lagos)

| Date | Service | City | Platform | URL | Copy Angle | Posted Time | Reach | Impressions | Engagement | Clicks | CTR % | Leads | Lead Cost | Conversions |
|------|---------|------|----------|-----|-----------|------------|-------|-------------|-----------|--------|-------|-------|-----------|-------------|
| 12/19/25 | Web | Lagos | Facebook | [URL link] | Authority | 8:00 AM | 2,450 | 8,320 | 128 | 67 | 2.7% | 8 | ₦8,375 | 1 |
| 12/19/25 | Web | Lagos | Instagram | [URL link] | Authority | 1:00 PM | 1,890 | 5,210 | 203 | 82 | 4.3% | 11 | ₦6,090 | 2 |
| 12/19/25 | Web | Lagos | Twitter | [URL link] | Authority | 9:00 AM | 892 | 3,450 | 45 | 28 | 3.1% | 2 | ₦14,000 | 0 |

### What Each Column Means

**Basic Info:**
- **Date**: YYYY-MM-DD format (e.g., 12/19/25)
- **Service**: Web, Marketing, Ecommerce, Business Plans, Portfolio
- **City**: Lagos, Abuja, Port Harcourt, Calabar, Ibadan, Kano, Enugu
- **Platform**: Facebook, Instagram, Twitter, WhatsApp
- **URL**: Paste the city-specific tracked link (from SOCIAL_SHARE_GUIDE.md)
- **Copy Angle**: Authority, Speed, Proof, Urgency, FOMO, Social Proof
- **Posted Time**: Nigeria time (8:00 AM, 1:00 PM, etc.)

**Reach & Engagement:**
- **Reach**: # of unique people who saw the post (Facebook/Instagram native metric)
- **Impressions**: # of times post was shown (may include repeats; Twitter metric)
- **Engagement**: Likes + Comments + Shares
- **Clicks**: # of people who clicked the link
- **CTR %**: (Clicks / Reach) × 100 = Click-through rate (auto-calc formula)

**Conversion:**
- **Leads**: # of people who clicked + filled out form / replied to DM (manual entry from CRM/form tool)
- **Lead Cost**: (Total Ad Spend for that post) / Leads (if you boosted the post; else leave blank)
- **Conversions**: # of leads who became paying customers (track after 30-day window)

---

## Google Sheets Setup (Recommended)

### Step 1: Create Sheet
1. Open Google Sheets
2. Title: "Hexadigitall Campaign Tracking - Dec 2025"
3. Share with team (Editor access)

### Step 2: Add Headers
Copy-paste the headers above into row 1.

### Step 3: Format & Formulas
```
Column L (CTR %):
=IF(H2>0, (K2/H2)*100, 0)
(Calculates: Clicks / Reach × 100)

Column N (Lead Cost):
=IF(M2>0, BUDGET_PER_POST / M2, 0)
(Adjust BUDGET_PER_POST to actual spend, or leave blank for organic)
```

### Step 4: Conditional Formatting (optional but powerful)
**Highlight high performers (CTR > 3%)**
1. Select Column L (CTR %)
2. Format → Conditional Formatting
3. Format rules: "Greater than or equal to" → 3 → Fill green
4. Format rules: "Less than or equal to" → 1 → Fill red

**This makes it visually obvious which posts are working.**

### Step 5: Create Summary Tab
Create a second sheet called "Summary" with these rollups:

```
DAILY TOTALS (auto-sum):
Total Reach: =SUM(H:H)
Total Engagement: =SUM(J:J)
Total Clicks: =SUM(K:K)
Total Leads: =SUM(M:M)
Avg CTR: =AVERAGE(L:L)

BY SERVICE:
Web Dev: Reach=?, Engagement=?, CTR=?, Leads=?
Marketing: Reach=?, Engagement=?, CTR=?, Leads=?
Ecommerce: Reach=?, Engagement=?, CTR=?, Leads=?
Business Plans: Reach=?, Engagement=?, CTR=?, Leads=?
Portfolio: Reach=?, Engagement=?, CTR=?, Leads=?

BY CITY (example):
Lagos: Reach=?, Engagement=?, CTR=?, Leads=?
Abuja: Reach=?, Engagement=?, CTR=?, Leads=?
...

BY PLATFORM:
Facebook: Reach=?, Engagement=?, CTR=?, Leads=?
Instagram: Reach=?, Engagement=?, CTR=?, Leads=?
Twitter: Reach=?, Engagement=?, CTR=?, Leads=?
WhatsApp: Reach=?, Engagement=?, CTR=?, Leads=?
```

Use SUMIF formulas to pull these automatically:
```
=SUMIF(B:B, "Web", H:H)  // Sum Reach where Service = Web
=AVERAGEIF(C:C, "Lagos", L:L)  // Avg CTR where City = Lagos
```

---

## Daily Tracking Workflow

### During Posting (2 minutes per post)
1. Copy URL from [docs/SOCIAL_SHARE_GUIDE.md](docs/SOCIAL_SHARE_GUIDE.md)
2. Paste into sheet Column E
3. Note copy angle (Urgency, Authority, etc.)
4. Record posting time

### 2 Hours Post-Posting (5 minutes)
1. Pull metrics from each platform:
   - **Facebook**: Post → Insights → Reach, Engagement, Link Clicks
   - **Instagram**: Post → Insights → Impressions, Engagement, Clicks
   - **Twitter**: Tweet → Analytics → Impressions, Engagements, Link Clicks
   - **WhatsApp**: Manual count from replies in CRM or group DMs
2. Fill columns H–K in sheet

### End of Day (10 minutes)
1. Check CRM/form tool for lead count (Column M)
2. Calculate CTR % (auto-formula)
3. Note any anomalies in "Notes" column

### Weekly Review (30 minutes)
1. Review Summary tab
2. Identify top 3 city/service/platform combos
3. Identify bottom 3 underperformers
4. **Action**: Double down on top 3 (boost budget, post more often)
5. **Action**: Pivot copy on bottom 3 (test new angle next rotation)

---

## Key Metrics & Targets

### Daily Targets
- **Reach**: 500–1,000 per post (platform-dependent)
- **Engagement Rate**: 2–5% (good is 3%+)
- **CTR**: 1–3% (good is 2%+)
- **Lead rate**: 5–15% of clickers (test until you hit 10%+)

### 30-Day Aggregate Targets
- **Total Reach**: 150,000–200,000 (across all platforms/cities)
- **Total Engagement**: 4,000–6,000
- **Total Clicks**: 3,000–5,000
- **Total Leads**: 300–500 (depends on lead quality; track to first meeting)
- **Lead Cost**: ₦2,000–₦5,000 per lead (if boosting with budget)

### Conversion Targets (track beyond 30 days)
- **Lead → First Call**: 40–50% (e.g., 300 leads → 120–150 calls)
- **First Call → Paid**: 5–10% (e.g., 120 calls → 6–12 customers)
- **AOV per service**: Web ₦299k · Marketing ₦300k/mo · Ecommerce ₦199k · Plans ₦199k · Portfolio ₦299k

---

## Optimization Rules

### Green Light (Keep doing this)
- CTR > 3%
- Engagement > 5%
- Lead cost < ₦3,000

### Yellow Light (Test modifications)
- CTR 1–3%
- Engagement 2–5%
- Lead cost ₦3,000–₦5,000

### Red Light (Pivot or pause)
- CTR < 1%
- Engagement < 2%
- Lead cost > ₦7,000

### Weekly Pivot Rules
1. **If underperforming (<1% CTR)**:
   - Next rotation: Change copy angle (e.g., Authority → Urgency)
   - Try different posting time (+1–2 hours)
   - Swap city or service if no improvement after 2nd rotation

2. **If outperforming (>3% CTR)**:
   - Boost spend if budget allows
   - Post same service/city combo +1 more time per week
   - Test with different platform next week

3. **If middling (1–2% CTR)**:
   - Keep posting but monitor closely
   - Test new copy angle in next rotation
   - If still middling after 3 rotations, archive combo and reallocate

---

## Sample Post-Campaign Report (Day 7 example)

```
WEEK 1 SUMMARY: Web Development Focus

Total Posts: 21 (3 services × 7 cities)
Total Reach: 47,340
Total Engagement: 1,203 (2.5% avg rate)
Total Clicks: 987
Total Leads: 123
Avg Lead Cost: ₦3,840

Top 3 Combos:
1. Web + Lagos + Facebook: 8.2% engagement, ₦2,450 reach, 67 clicks, 8 leads ✅
2. Web + Abuja + Instagram: 6.3% engagement, ₦1,890 reach, 82 clicks, 11 leads ✅
3. Web + Port Harcourt + Twitter: 5.1% engagement, ₦892 reach, 28 clicks, 2 leads ✅

Bottom 3 Combos:
1. Web + Kano + WhatsApp: 0.3% engagement, ₦1,200 reach, 8 clicks, 1 lead ❌
2. Web + Enugu + Twitter: 0.8% engagement, ₦650 reach, 12 clicks, 1 lead ❌
3. Web + Calabar + Instagram: 1.2% engagement, ₦1,450 reach, 19 clicks, 2 leads ⚠️

ACTIONS FOR WEEK 2:
✅ Boost Web + Lagos (add 1 extra post/week)
✅ Keep Web + Abuja, Port Harcourt (momentum strong)
⚠️ Test new copy angle for Calabar (Urgency instead of Authority)
❌ Pause Kano/Enugu WhatsApp until we fix messaging
→ Reallocate Kano/Enugu budget to top 3 performers for 1 week test
```

---

## Export & Sharing

Every Friday:
1. Export sheet as CSV: File → Download → CSV
2. Save to: `promotional-campaign/tracking/campaign_tracking_{WEEK}.csv`
3. Share summary screenshot in team Slack/email
4. Highlight wins + action items for next week

---

## Platform-Specific Notes

### Facebook
- Reach = unique people; Impressions may be higher
- Save post link for easy access: facebook.com/[page]/posts/[post-id]
- Click metrics often lag 2–4 hours; check again at end of day

### Instagram
- Insights tab takes 24 hours to populate fully
- Story metrics (swipe-ups) export separately from feed posts
- Clicks = taps to link in bio; count manual story link-clicks separately

### Twitter/X
- Analytics tab shows Impressions (accurate), not Reach (estimate)
- Engagement = Retweets + Likes + Replies
- Click data less reliable; use bit.ly or short.link for accurate tracking

### WhatsApp Business
- No native analytics; track manually via CRM or spreadsheet
- Count: Delivered, Read, Replied, Clicked (if you include link)
- Personal follow-up via voice note = high conversion (track separately)

---

## Tools to Use

**Recommended free/cheap tools for tracking:**
1. **Google Sheets** (free) — recommended for simplicity + team sharing
2. **Airtable** ($12/mo) — if you want more automation
3. **Metricool** ($25/mo) — single dashboard for FB/IG/Twitter analytics
4. **Bit.ly** ($5/mo) — accurate link click tracking across all platforms

**Setup tip**: Use bit.ly links with campaign parameters:
- Original: https://hexadigitall.com/services/websites-lagos?utm_source=facebook&utm_medium=social&utm_campaign=local_penetration
- Bit.ly: https://bit.ly/hex-web-lagos-fb
- Track clicks easily without relying on platform native metrics

---

## 30-Day Campaign Success Checklist

By day 30, track:
- [ ] Total reach: 150k–200k
- [ ] Total leads: 300–500
- [ ] Avg lead cost: < ₦5,000
- [ ] Avg CTR: > 2%
- [ ] Top 3 city/service combos identified and doubled down
- [ ] Bottom 3 pivoted or paused
- [ ] Copy angles tested and winners locked in
- [ ] Best platform per service identified
- [ ] Weekly learnings documented for next campaign
- [ ] First conversions tracked and attributed

---

## Next Steps (Post-Campaign, Jan 19+)

1. Analyze full 30 days of data
2. Calculate customer acquisition cost (CAC) per service/city
3. Calculate lifetime value (LTV) per customer
4. ROI = (Total Revenue - Total Spend) / Total Spend
5. Double down on top ROI performers
6. Scale budget to high-performers
7. Archive learnings in playbook for next campaign

---

## Questions? Use This Checklist

- **"Why are leads so high but conversions low?"** → Check lead quality (form/DM qualifier weak)
- **"Why is this city performing worse?"** → Check: language, local holidays, time zone, competitor activity
- **"Should I boost this post?"** → Yes, if CTR > 2% and engagement > 3%
- **"Why aren't we seeing conversions yet?"** → Track time lag; B2B/complex sales = 2–4 weeks post-click
- **"Which platform is best?"** → Look at CTR + Lead Cost; adjust budget accordingly
