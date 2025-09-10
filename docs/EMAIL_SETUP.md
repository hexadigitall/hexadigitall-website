# Email Service Setup Guide

This guide explains how to configure email services for the contact form and newsletter subscription features.

## Overview

The email system supports multiple providers and automatically detects which one to use based on environment variables:

1. **Resend** (Recommended) - Modern email API
2. **SendGrid** - Traditional email service
3. **Custom Webhook** - For integration with external systems
4. **Console Logging** - Development fallback

## Quick Setup (Resend - Recommended)

### 1. Get Resend API Key
1. Go to [resend.com](https://resend.com) and create an account
2. Verify your domain or use their development domain
3. Generate an API key from the dashboard

### 2. Configure Environment Variables
Add these to your `.env.local` file:

```bash
# Resend Configuration (Primary)
RESEND_API_KEY=re_your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
CONTACT_FORM_RECIPIENT_EMAIL=your-email@gmail.com

# Optional: Override default from address
FROM_EMAIL=contact@hexadigitall.com
```

### 3. Domain Setup (Production)
For production emails, you'll need to:
1. Add your domain to Resend
2. Add DNS records (SPF, DKIM, DMARC)
3. Verify domain ownership
4. Update `FROM_EMAIL` to use your domain

## Alternative Providers

### SendGrid Setup
```bash
# SendGrid Configuration
SENDGRID_API_KEY=SG.your_api_key_here
FROM_EMAIL=noreply@yourdomain.com
CONTACT_FORM_RECIPIENT_EMAIL=your-email@gmail.com
```

### Webhook Integration
```bash
# Custom Webhook
EMAIL_WEBHOOK_URL=https://your-webhook-endpoint.com/email
EMAIL_WEBHOOK_SECRET=your-webhook-secret
CONTACT_FORM_RECIPIENT_EMAIL=your-email@gmail.com
```

## Environment Variables Reference

| Variable | Required | Description |
|----------|----------|-------------|
| `RESEND_API_KEY` | Yes (if using Resend) | Your Resend API key |
| `SENDGRID_API_KEY` | Yes (if using SendGrid) | Your SendGrid API key |
| `EMAIL_WEBHOOK_URL` | Yes (if using webhook) | Custom webhook endpoint |
| `EMAIL_WEBHOOK_SECRET` | No | Webhook authentication secret |
| `FROM_EMAIL` | No | Default sender email (falls back to noreply@hexadigitall.com) |
| `CONTACT_FORM_RECIPIENT_EMAIL` | No | Where contact forms are sent (falls back to hexadigitztech@gmail.com) |

## Features

### Contact Form Emails
- Professional HTML formatting with Hexadigitall branding
- Includes sender details, service interest, and message
- Reply-to set to sender's email for easy responses
- Admin receives formatted notification

### Newsletter Subscriptions
- **Admin Notification**: Alerts you of new subscribers
- **Welcome Email**: Automatic branded welcome message to subscribers
- **Validation**: Email format validation and disposable email blocking
- **Tracking**: Source tracking (Footer Newsletter, etc.)

### Email Templates
Both contact and newsletter emails use professionally designed HTML templates with:
- Hexadigitall branding and colors
- Mobile-responsive design
- Clear call-to-actions
- Proper email client compatibility

## Testing

### Development Mode
Without any email provider configured, the system will log emails to the console:

```bash
=== EMAIL SIMULATION (Development Mode) ===
From: noreply@hexadigitall.com
To: user@example.com
Subject: Welcome to Hexadigitall Newsletter! 🚀
# Full HTML content will be displayed
==========================================
```

### Production Testing
1. Set up environment variables
2. Test contact form submission
3. Test newsletter subscription
4. Check email delivery and formatting
5. Verify reply-to functionality

## Troubleshooting

### Common Issues

#### Emails Not Sending
1. Check environment variables are set correctly
2. Verify API key is valid and active
3. Check console logs for error messages
4. Ensure domain is verified (production)

#### Emails Going to Spam
1. Set up proper DNS records (SPF, DKIM, DMARC)
2. Use a verified domain for FROM_EMAIL
3. Ensure content isn't triggering spam filters
4. Check sender reputation

#### Rate Limiting
1. Resend: 100 emails/hour on free plan
2. SendGrid: 100 emails/day on free plan
3. Consider upgrading plan for higher limits

### Debug Mode
Check the console logs to see which provider is being used:
```
Email sent via Resend (ID: email_id_here)
```

## Security Considerations

1. **Environment Variables**: Never commit API keys to version control
2. **Rate Limiting**: Implement client-side and server-side rate limiting
3. **Validation**: Email validation prevents malicious submissions
4. **CORS**: API endpoints are server-side only
5. **Error Handling**: Generic error messages prevent information leakage

## Production Checklist

- [ ] Domain verified with email provider
- [ ] DNS records configured (SPF, DKIM, DMARC)
- [ ] Environment variables set in production
- [ ] FROM_EMAIL uses verified domain
- [ ] Test contact form end-to-end
- [ ] Test newsletter subscription
- [ ] Monitor email delivery rates
- [ ] Set up monitoring/alerting for failed emails

## Support

For issues with:
- **Resend**: Check their documentation at [resend.com/docs](https://resend.com/docs)
- **SendGrid**: Visit [sendgrid.com/docs](https://sendgrid.com/docs)
- **Code Issues**: Check server logs and console output

The email system is designed to be robust with fallbacks, but proper configuration is essential for production use.
