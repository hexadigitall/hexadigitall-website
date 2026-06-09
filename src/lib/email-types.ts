// src/lib/email-types.ts

export interface EmailConfig {
  from: string;
  replyTo: string;
  subject: string;
}

export interface CourseEnrollmentData {
  studentName: string;
  studentEmail: string;
  courseName: string;
  coursePrice: number;
  paymentPlan?: string;
  enrollmentId?: string;
}

export interface ServiceInquiryData {
  clientName: string;
  clientEmail: string;
  serviceName: string;
  packageName: string;
  packagePrice: number;
  paymentPlan?: string;
  inquiryId?: string;
}

// Email address configuration
export const EMAIL_ADDRESSES = {
  // For sending emails (these work with Resend)
  NOREPLY: 'info@hexadigitall.com',
  HELLO: 'info@hexadigitall.com',
  SUPPORT: 'info@hexadigitall.com',
  ENQUIRY: 'info@hexadigitall.com',
  ADMIN: 'info@hexadigitall.com',
  
  // For receiving emails (fallback to Gmail until email hosting is set up)
  REPLY_TO_GENERAL: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com',
  REPLY_TO_SUPPORT: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com',
  REPLY_TO_ADMIN: process.env.CONTACT_FORM_RECIPIENT_EMAIL || 'info@hexadigitall.com',
} as const;

// Email configurations for different purposes
export const EMAIL_CONFIGS = {
  CONTACT_FORM: {
    from: EMAIL_ADDRESSES.ENQUIRY,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_GENERAL,
    subject: 'New Contact Form Submission - Hexadigitall'
  },
  
  COURSE_ENROLLMENT_CONFIRMATION: {
    from: EMAIL_ADDRESSES.HELLO,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_SUPPORT,
    subject: 'Course Enrollment Confirmation - Hexadigitall'
  },
  
  COURSE_ENROLLMENT_ADMIN: {
    from: EMAIL_ADDRESSES.ADMIN,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_ADMIN,
    subject: 'New Course Enrollment - Hexadigitall'
  },
  
  SERVICE_INQUIRY_CONFIRMATION: {
    from: EMAIL_ADDRESSES.HELLO,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_SUPPORT,
    subject: 'Service Inquiry Confirmation - Hexadigitall'
  },
  
  SERVICE_INQUIRY_ADMIN: {
    from: EMAIL_ADDRESSES.ADMIN,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_ADMIN,
    subject: 'New Service Inquiry - Hexadigitall'
  },
  
  NEWSLETTER_WELCOME: {
    from: EMAIL_ADDRESSES.HELLO,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_GENERAL,
    subject: 'Welcome to Hexadigitall Newsletter! 🚀'
  },
  
  NEWSLETTER_ADMIN: {
    from: EMAIL_ADDRESSES.ADMIN,
    replyTo: EMAIL_ADDRESSES.REPLY_TO_ADMIN,
    subject: 'New Newsletter Subscription - Hexadigitall'
  }
} as const;