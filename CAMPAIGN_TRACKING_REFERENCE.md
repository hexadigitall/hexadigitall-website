# Campaign Tracking Reference
**Date:** December 20, 2025  
**Scope:** Aggressive Local Market Penetration (ALMP) – 7 cities × 4 services

## Live URLs & Forms
- Campaign landing pages (auto-UTM capture via form):
  - https://hexadigitall.com/campaign/almp
  - https://hexadigitall.com/campaign/web-dev
  - https://hexadigitall.com/campaign/digital-marketing
  - https://hexadigitall.com/campaign/business-planning
- Form endpoint for campaign leads: `/api/campaign/leads`
- Admin dashboard: `/admin/submissions` (filters now include campaign, source, service)

## UTM Structure (required)
- `utm_source`: whatsapp | instagram | facebook | linkedin | tiktok | email
- `utm_medium`: social | email | web | organic | paid
- `utm_campaign`: dec_jan_2025 (default)
- `utm_content`: service key (web-dev | digital-marketing | business-planning | portfolio-design)
- `utm_term`: city slug (lagos | abuja | calabar | kano | port-harcourt | benin | ibadan)

Example:
```
https://hexadigitall.com/campaign/web-dev?utm_source=whatsapp&utm_medium=social&utm_campaign=dec_jan_2025&utm_content=web-dev&utm_term=lagos
```

## Preset Links (7 cities × 4 services)
Generate and copy from `/tools/utm` → "Campaign presets" section. Presets automatically use your current source/medium/campaign selections and set:
- content = service key
- term = city slug

## Data Capture & Storage
- Stored document: `formSubmission` (Sanity)
- New fields captured: `campaignName`, `campaignSource`, `campaignMedium`, `campaignContent`, `campaignTerm`, `service`, `city`, `landingPage`, `formData` (json)
- Metadata: `ipAddress`, `userAgent`, `referrer`, `submittedAt`

## Admin Filters & Views
- Filters: status, campaign, source, service, text search (name/email/message/city/campaign)
- Columns show: city, service, campaign, source/medium
- Detail view: full payload + metadata

## OG Images
- All live under `/public/og-images/` and accessible via HTTPS.
- Recommended per landing:
  - Web Dev: `/og-images/service-web-development.jpg`
  - Digital Marketing: `/og-images/service-digital-marketing.jpg`
  - Business Planning: `/og-images/service-business-planning.jpg`
  - Portfolio: `/og-images/service-portfolio.jpg`
  - City variants available (e.g., `service-web-development-lagos.jpg`).

## Verification Checklist
1) Open any campaign URL with UTM params → confirm GA4 real-time sees the session.
2) Submit form → check `/admin/submissions` for new entry with campaign fields populated.
3) Confirm email notification received at `hexadigitztech@gmail.com`.
4) Share the same link on WhatsApp/Instagram → verify OG preview shows correct image/title.

## Quick How-To
- Need tracked links fast? Open `/tools/utm`, set source/medium/campaign, scroll to presets, copy all.
- Need a city-specific OG? Use the city image variant in the page metadata or the docs.
- Need to triage leads? Filter by campaign or source in `/admin/submissions`, then update status/priority.

## Owners
- Tech/Analytics: Hexadigitall engineering
- Marketing Ops: Campaign manager (dec_jan_2025)
