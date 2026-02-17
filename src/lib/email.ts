// src/lib/email.ts
import { Resend } from 'resend';
import { 
  EMAIL_CONFIGS, 
  CourseEnrollmentData, 
  ServiceInquiryData 
} from './email-types';
import {
  createContactFormEmailTemplate,
  createCourseEnrollmentConfirmationTemplate,
  createCourseEnrollmentAdminTemplate,
  createServiceInquiryConfirmationTemplate,
  createServiceInquiryAdminTemplate,
  createNewsletterWelcomeTemplate
} from './email-templates';

interface EmailOptions {
  to: string | string[];
  subject: string;
  html: string;
  from?: string;
  replyTo?: string;
  attachments?: Array<{ filename: string; content: string; contentType?: string }>;
}

interface NewsletterSubscription {
  email: string;
  source?: string;
}

export interface ContactFormData {
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
        from: options.from || process.env.FROM_EMAIL || 'info@hexadigitall.com',
        to: options.to,
        subject: options.subject,
        html: options.html,
        // Always ensure replies go to a working email address
        replyTo: options.replyTo || process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com',
        attachments: options.attachments,
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

    const recipients = Array.isArray(options.to) ? options.to : [options.to];
    const response = await fetch('https://api.sendgrid.com/v3/mail/send', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${process.env.SENDGRID_API_KEY}`
      },
      body: JSON.stringify({
        personalizations: [{
          to: recipients.map((email) => ({ email }))
        }],
        from: {
          email: options.from || process.env.FROM_EMAIL || 'info@hexadigitall.com'
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
    console.log(`To: ${Array.isArray(options.to) ? options.to.join(', ') : options.to}`);
    console.log(`Subject: ${options.subject}`);
    console.log(`Reply-To: ${options.replyTo || 'N/A'}`);
    if (options.attachments && options.attachments.length > 0) {
      console.log(`Attachments: ${options.attachments.map((a) => a.filename).join(', ')}`);
    }
    console.log('--- HTML Content ---');
    console.log(options.html);
    console.log('==========================================');

    return { success: true, message: 'Email logged to console (development mode)' };
  }

  async sendContactForm(data: ContactFormData): Promise<{ success: boolean; message?: string; error?: string }> {
    const config = EMAIL_CONFIGS.CONTACT_FORM;
    const recipientEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com';
    
    return await this.sendEmail({
      to: recipientEmail,
      from: config.from,
      subject: `${config.subject}: ${data.name} - ${data.service || 'General Inquiry'}`,
      html: createContactFormEmailTemplate(data),
      replyTo: data.email
    });
  }

  async subscribeToNewsletter(data: NewsletterSubscription): Promise<{ success: boolean; message?: string; error?: string }> {
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com';
    const adminConfig = EMAIL_CONFIGS.NEWSLETTER_ADMIN;
    const welcomeConfig = EMAIL_CONFIGS.NEWSLETTER_WELCOME;
    
    // Create admin notification HTML
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

    // Send admin notification
    await this.sendEmail({
      to: adminEmail,
      from: adminConfig.from,
      subject: adminConfig.subject,
      html: adminHtml,
      replyTo: adminConfig.replyTo
    });

    // Send welcome email to subscriber
    return await this.sendEmail({
      to: data.email,
      from: welcomeConfig.from,
      subject: welcomeConfig.subject,
      html: createNewsletterWelcomeTemplate(),
      replyTo: welcomeConfig.replyTo
    });
  }

  async sendCourseEnrollmentEmails(data: CourseEnrollmentData): Promise<{ success: boolean; message?: string; error?: string }> {
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com';
    const confirmationConfig = EMAIL_CONFIGS.COURSE_ENROLLMENT_CONFIRMATION;
    const adminConfig = EMAIL_CONFIGS.COURSE_ENROLLMENT_ADMIN;

    try {
      // Send confirmation email to student
      const studentResult = await this.sendEmail({
        to: data.studentEmail,
        from: confirmationConfig.from,
        subject: `${confirmationConfig.subject} - ${data.courseName}`,
        html: createCourseEnrollmentConfirmationTemplate(data),
        replyTo: confirmationConfig.replyTo
      });

      if (!studentResult.success) {
        throw new Error(`Failed to send confirmation email: ${studentResult.error}`);
      }

      // Send notification to admin
      const adminResult = await this.sendEmail({
        to: adminEmail,
        from: adminConfig.from,
        subject: `${adminConfig.subject} - ${data.courseName}`,
        html: createCourseEnrollmentAdminTemplate(data),
        replyTo: adminConfig.replyTo
      });

      return {
        success: true,
        message: `Course enrollment emails sent successfully. Student: ${studentResult.success}, Admin: ${adminResult.success}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending course enrollment emails'
      };
    }
  }

  async sendServiceInquiryEmails(data: ServiceInquiryData): Promise<{ success: boolean; message?: string; error?: string }> {
    const adminEmail = process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'hexadigitztech@gmail.com';
    const confirmationConfig = EMAIL_CONFIGS.SERVICE_INQUIRY_CONFIRMATION;
    const adminConfig = EMAIL_CONFIGS.SERVICE_INQUIRY_ADMIN;

    try {
      // Send confirmation email to client
      const clientResult = await this.sendEmail({
        to: data.clientEmail,
        from: confirmationConfig.from,
        subject: `${confirmationConfig.subject} - ${data.serviceName}`,
        html: createServiceInquiryConfirmationTemplate(data),
        replyTo: confirmationConfig.replyTo
      });

      if (!clientResult.success) {
        throw new Error(`Failed to send confirmation email: ${clientResult.error}`);
      }

      // Send notification to admin
      const adminResult = await this.sendEmail({
        to: adminEmail,
        from: adminConfig.from,
        subject: `${adminConfig.subject} - ${data.serviceName}`,
        html: createServiceInquiryAdminTemplate(data),
        replyTo: adminConfig.replyTo
      });

      return {
        success: true,
        message: `Service inquiry emails sent successfully. Client: ${clientResult.success}, Admin: ${adminResult.success}`
      };
    } catch (error) {
      return {
        success: false,
        error: error instanceof Error ? error.message : 'Unknown error sending service inquiry emails'
      };
    }
  }
}

export const emailService = new EmailService();
