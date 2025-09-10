// src/lib/email.ts
import { Resend } from 'resend';

interface EmailOptions {
  to: string;
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
}

interface NewsletterSubscription {
  email: string;
  source?: string;
}

interface ContactFormData {
  name: string;
  email: string;
  message: string;
  service?: string;
}

class EmailService {
  private provider: 'resend' | 'sendgrid' | 'nodemailer' | 'webhook';
  private resend?: Resend;
  
  constructor() {
    // Determine which email provider to use based on environment variables
    if (process.env.RESEND_API_KEY) {
      this.provider = 'resend';
      this.resend = new Resend(process.env.RESEND_API_KEY);
    } else if (process.env.SENDGRID_API_KEY) {
      this.provider = 'sendgrid';
    } else if (process.env.EMAIL_WEBHOOK_URL) {
      this.provider = 'webhook';
    } else {
      this.provider = 'nodemailer'; // fallback to console logging for development
    }
  }

  async sendEmail(options: EmailOptions): Promise<{ success: boolean; message?: string; error?: string }> {
    try {
      switch (this.provider) {
        case 'resend':
          return await this.sendWithResend(options);
        case 'sendgrid':
          return await this.sendWithSendGrid(options);
        case 'webhook':
          return await this.sendWithWebhook(options);
        default:
          return await this.sendWithConsole(options);
      }
    } catch (error) {
      console.error('Email sending failed:', error);
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error'
      };
    }
  }

  private async sendWithResend(options: EmailOptions) {
    if (!this.resend) {
      throw new Error('Resend not initialized');
    }

    try {
      const result = await this.resend.emails.send({
        from: options.from || process.env.FROM_EMAIL || 'noreply@hexadigitall.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        replyTo: options.replyTo
      });

      if (result.error) {
        throw new Error(`Resend error: ${result.error.message}`);
      }

      return { success: true, message: `Email sent via Resend (ID: ${result.data?.id})` };
    } catch (error) {
      throw new Error(`Resend SDK error: ${error instanceof Error ? error.message : 'Unknown error'}`);
    }
  }

  private async sendWithSendGrid(options: EmailOptions) {
    if (!process.env.SENDGRID_API_KEY) {
      throw new Error('SENDGRID_API_KEY not configured');
    }

    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [{
          to: [{ email: options.to }]
        }],
        from: {
          email: options.from || process.env.FROM_EMAIL || 'noreply@hexadigitall.com'
        },
        subject: options.subject,
        content: [{
          type: 'text/html',
          value: options.html
        }],
        reply_to: options.replyTo ? { email: options.replyTo } : undefined
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`SendGrid API error: ${error}`);
    }

    return { success: true, message: 'Email sent via SendGrid' };
  }

  private async sendWithWebhook(options: EmailOptions) {
    if (!process.env.EMAIL_WEBHOOK_URL) {
      throw new Error('EMAIL_WEBHOOK_URL not configured');
    }

    const headers: Record<string, string> = {
      'Content-Type': 'application/json'
    };
    
    if (process.env.EMAIL_WEBHOOK_SECRET) {
      headers['Authorization'] = `Bearer ${process.env.EMAIL_WEBHOOK_SECRET}`;
    }
    
    const response = await fetch(process.env.EMAIL_WEBHOOK_URL, {
      method: 'POST',
      headers,
      body: JSON.stringify({
        type: 'email',
        ...options
      })
    });

    if (!response.ok) {
      const error = await response.text();
      throw new Error(`Webhook error: ${error}`);
    }

    return { success: true, message: 'Email sent via webhook' };
  }

  private async sendWithConsole(options: EmailOptions) {
    console.log('=== EMAIL SIMULATION (Development Mode) ===');
    console.log(`From: ${options.from || 'noreply@hexadigitall.com'}`);
    console.log(`To: ${options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Reply-To: ${options.replyTo || 'N/A'}`);
    console.log('--- HTML Content ---');
    console.log(options.html);
    console.log('==========================================');

    return { success: true, message: 'Email logged to console (development mode)' };
  }

  async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message?: string; error?: string }> {
    const recipientEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com';
    
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #0A4D68; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Contact Form Submission</h1>
          <p style="margin: 5px 0;">Hexadigitall Website</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <h2 style="color: #0A4D68; margin-bottom: 20px;">Contact Details</h2>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin-bottom: 20px;">
            <p><strong>Name:</strong> ${data.name}</p>
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            ${data.service ? `<p><strong>Service Interest:</strong> ${data.service}</p>` : ''}
          </div>

          <div style="background: white; padding: 20px; border-radius: 8px;">
            <h3 style="color: #0A4D68; margin-top: 0;">Message:</h3>
            <p style="line-height: 1.6; white-space: pre-wrap;">${data.message}</p>
          </div>
        </div>
        
        <div style="background: #088395; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">This message was sent from the Hexadigitall contact form.</p>
          <p style="margin: 5px 0;">Please respond within 24 hours for the best customer experience.</p>
        </div>
      </div>
    `;

    return await this.sendEmail({
      to: recipientEmail,
      subject: `New Contact Form: ${data.name} - ${data.service || 'General Inquiry'}`,
      html,
      replyTo: data.email
    });
  }

  async subscribeToNewsletter(data: NewsletterSubscription): Promise<{ success: boolean; message?: string; error?: string }> {
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com';
    
    // Send notification to admin
    const adminHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: #F5A623; color: white; padding: 20px; text-align: center;">
          <h1 style="margin: 0;">New Newsletter Subscription!</h1>
          <p style="margin: 5px 0;">Hexadigitall Website</p>
        </div>
        
        <div style="padding: 30px; background: #f9f9f9;">
          <div style="background: white; padding: 20px; border-radius: 8px;">
            <p><strong>Email:</strong> <a href="mailto:${data.email}">${data.email}</a></p>
            <p><strong>Source:</strong> ${data.source || 'Footer Newsletter'}</p>
            <p><strong>Date:</strong> ${new Date().toLocaleString()}</p>
          </div>
        </div>
        
        <div style="background: #0A4D68; color: white; padding: 15px; text-align: center; font-size: 12px;">
          <p style="margin: 0;">Add this email to your newsletter list and send a welcome email!</p>
        </div>
      </div>
    `;

    // Send welcome email to subscriber
    const welcomeHtml = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <div style="background: linear-gradient(135deg, #0A4D68 0%, #088395 100%); color: white; padding: 30px; text-align: center;">
          <h1 style="margin: 0; font-size: 28px;">Welcome to Hexadigitall!</h1>
          <p style="margin: 10px 0; font-size: 16px; opacity: 0.9;">Thank you for subscribing to our newsletter</p>
        </div>
        
        <div style="padding: 40px 30px; background: #f9f9f9;">
          <h2 style="color: #0A4D68; margin-bottom: 20px;">You're now part of our digital community!</h2>
          
          <p style="line-height: 1.6; margin-bottom: 20px;">
            Get ready to receive exclusive updates on:
          </p>
          
          <ul style="line-height: 1.8; color: #333;">
            <li>Latest digital trends and insights</li>
            <li>New course launches and special offers</li>
            <li>Business tips and success stories</li>
            <li>Behind-the-scenes updates from our team</li>
          </ul>
          
          <div style="background: white; padding: 20px; border-radius: 8px; margin: 30px 0; border-left: 4px solid #F5A623;">
            <h3 style="margin: 0 0 10px 0; color: #0A4D68;">Need immediate help?</h3>
            <p style="margin: 0; line-height: 1.6;">
              Don't wait for our newsletter! Contact us anytime at 
              <a href="mailto:hexadigitztech@gmail.com" style="color: #088395;">hexadigitztech@gmail.com</a> 
              or call <a href="tel:+2348125802140" style="color: #088395;">+234 812 580 2140</a>
            </p>
          </div>
        </div>
        
        <div style="background: #0A4D68; color: white; padding: 25px; text-align: center;">
          <p style="margin: 0 0 15px 0; font-size: 16px;">Ready to transform your business idea?</p>
          <a href="https://hexadigitall.com/contact" style="display: inline-block; background: #F5A623; color: white; padding: 12px 24px; text-decoration: none; border-radius: 6px; font-weight: bold;">Get Started Today</a>
        </div>
        
        <div style="padding: 15px; text-align: center; font-size: 12px; color: #666;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Hexadigitall. All rights reserved.</p>
          <p style="margin: 5px 0;">You can unsubscribe at any time by replying to this email.</p>
        </div>
      </div>
    `;

    // Send admin notification
    await this.sendEmail({
      to: adminEmail,
      subject: 'New Newsletter Subscription - Hexadigitall',
      html: adminHtml
    });

    // Send welcome email to subscriber
    return await this.sendEmail({
      to: data.email,
      subject: 'Welcome to Hexadigitall Newsletter! 🚀',
      html: welcomeHtml
    });
  }
}

export const emailService = new EmailService();
