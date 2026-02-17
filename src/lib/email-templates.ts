// src/lib/email-templates.ts
import { CourseEnrollmentData, ServiceInquiryData } from './email-types';
import { ContactFormData } from './email';

// Base email template wrapper
const createEmailWrapper = (content: string) => `
  <div style="font-family: 'Segoe UI', Tahoma, Geneva, Verdana, sans-serif; max-width: 600px; margin: 0 auto; background: #ffffff;">
    ${content}
    
    <!-- Footer -->
    <div style="background: #f8f9fa; padding: 30px 20px; text-align: center; border-top: 1px solid #e9ecef;">
      <div style="margin-bottom: 20px;">
        <img src="https://hexadigitall.com/logo.png" alt="Hexadigitall" style="height: 40px; margin-bottom: 10px;" />
      </div>
      
      <div style="color: #6c757d; font-size: 14px; line-height: 1.6;">
        <p style="margin: 0 0 10px 0;"><strong>Hexadigitall</strong></p>
        <p style="margin: 0 0 10px 0;">Transforming Ideas into Digital Reality</p>
        
        <div style="margin: 20px 0; padding-top: 20px; border-top: 1px solid #dee2e6;">
          <p style="margin: 0 0 5px 0;">📧 info@hexadigitall.com | 📞 +234 812 580 2140</p>
          <p style="margin: 0 0 15px 0;">🌐 <a href="https://hexadigitall.com" style="color: #0A4D68; text-decoration: none;">hexadigitall.com</a></p>
        </div>
        
        <div style="font-size: 12px; color: #868e96;">
          <p style="margin: 0;">© ${new Date().getFullYear()} Hexadigitall. All rights reserved.</p>
        </div>
      </div>
    </div>
  </div>
`;

// Header component
const createEmailHeader = (title: string, subtitle: string, bgColor: string = '#0A4D68') => `
  <div style="background: linear-gradient(135deg, ${bgColor} 0%, #088395 100%); color: white; padding: 40px 30px; text-align: center;">
    <h1 style="margin: 0 0 10px 0; font-size: 28px; font-weight: 600;">${title}</h1>
    <p style="margin: 0; font-size: 16px; opacity: 0.9;">${subtitle}</p>
  </div>
`;

// Contact form templates
export const createContactFormEmailTemplate = (data: ContactFormData) => {
  const content = `
    ${createEmailHeader('New Contact Form Submission', 'Someone reached out through your website')}
    
    <div style="padding: 40px 30px;">
      <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h2 style="color: #0A4D68; margin: 0 0 20px 0; font-size: 20px;">Contact Details</h2>
        
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #495057; width: 120px;">Name:</td>
              <td style="padding: 8px 0; color: #212529;">${data.name}</td>
            </tr>
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #495057;">Email:</td>
              <td style="padding: 8px 0;"><a href="mailto:${data.email}" style="color: #0A4D68; text-decoration: none;">${data.email}</a></td>
            </tr>
            ${data.service ? `
            <tr>
              <td style="padding: 8px 0; font-weight: 600; color: #495057;">Service:</td>
              <td style="padding: 8px 0; color: #212529;">${data.service}</td>
            </tr>
            ` : ''}
          </table>
        </div>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 12px;">
        <h3 style="color: #0A4D68; margin: 0 0 15px 0; font-size: 18px;">Message:</h3>
        <div style="background: white; padding: 20px; border-radius: 8px; box-shadow: 0 2px 4px rgba(0,0,0,0.1);">
          <p style="margin: 0; line-height: 1.7; color: #212529; white-space: pre-wrap;">${data.message}</p>
        </div>
      </div>
      
      <div style="margin-top: 30px; padding: 20px; background: linear-gradient(135deg, #e3f2fd 0%, #f3e5f5 100%); border-radius: 8px; border-left: 4px solid #2196F3;">
        <p style="margin: 0; color: #1565C0; font-weight: 500;">⏱️ Response Time Goal: Within 4-6 hours during business hours</p>
        <p style="margin: 8px 0 0 0; color: #424242; font-size: 14px;">Business Hours: Mon-Fri 9AM-6PM WAT</p>
      </div>
    </div>
  `;
  
  return createEmailWrapper(content);
};

// Course enrollment templates
export const createCourseEnrollmentConfirmationTemplate = (data: CourseEnrollmentData) => {
  const content = `
    ${createEmailHeader('Course Enrollment Confirmed! 🎉', `Welcome to ${data.courseName}`, '#28a745')}
    
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #28a745; margin: 0 0 10px 0;">Thank You, ${data.studentName}!</h2>
        <p style="color: #6c757d; font-size: 16px; margin: 0;">Your enrollment has been successfully processed</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="color: #0A4D68; margin: 0 0 20px 0;">Enrollment Details</h3>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Course:</td>
              <td style="padding: 10px 0; color: #212529;">${data.courseName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Price:</td>
              <td style="padding: 10px 0; color: #28a745; font-weight: 600;">$${data.coursePrice}</td>
            </tr>
            ${data.paymentPlan ? `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Payment Plan:</td>
              <td style="padding: 10px 0; color: #212529;">${data.paymentPlan}</td>
            </tr>
            ` : ''}
            ${data.enrollmentId ? `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Enrollment ID:</td>
              <td style="padding: 10px 0; color: #6c757d; font-family: monospace;">${data.enrollmentId}</td>
            </tr>
            ` : ''}
          </table>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #e8f5e8 0%, #f0f8ff 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="color: #155724; margin: 0 0 15px 0;">What's Next?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #155724; line-height: 1.8;">
          <li>You'll receive course access details within 24 hours</li>
          <li>Course materials will be available in your student dashboard</li>
          <li>Live sessions schedule will be emailed separately</li>
          <li>Our support team will contact you for onboarding</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="https://hexadigitall.com/dashboard" style="display: inline-block; background: #0A4D68; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0;">Access Dashboard</a>
        <a href="https://hexadigitall.com/contact" style="display: inline-block; background: transparent; color: #0A4D68; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #0A4D68;">Need Help?</a>
      </div>
    </div>
  `;
  
  return createEmailWrapper(content);
};

export const createCourseEnrollmentAdminTemplate = (data: CourseEnrollmentData) => {
  const content = `
    ${createEmailHeader('New Course Enrollment', 'A student just enrolled in a course', '#17a2b8')}
    
    <div style="padding: 40px 30px;">
      <div style="background: #d1ecf1; border: 1px solid #bee5eb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #0c5460; margin: 0 0 15px 0;">Student Information</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${data.studentName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.studentEmail}" style="color: #0c5460;">${data.studentEmail}</a></p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px;">
        <h3 style="color: #0A4D68; margin: 0 0 15px 0;">Enrollment Details</h3>
        <p style="margin: 5px 0;"><strong>Course:</strong> ${data.courseName}</p>
        <p style="margin: 5px 0;"><strong>Price:</strong> $${data.coursePrice}</p>
        ${data.paymentPlan ? `<p style="margin: 5px 0;"><strong>Payment Plan:</strong> ${data.paymentPlan}</p>` : ''}
        ${data.enrollmentId ? `<p style="margin: 5px 0;"><strong>Enrollment ID:</strong> ${data.enrollmentId}</p>` : ''}
        <p style="margin: 15px 0 5px 0;"><strong>Enrollment Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #fff3cd; border: 1px solid #ffeaa7; border-radius: 8px;">
        <p style="margin: 0; color: #856404;"><strong>Action Required:</strong> Set up course access and send welcome materials to the student.</p>
      </div>
    </div>
  `;
  
  return createEmailWrapper(content);
};

// Service inquiry templates
export const createServiceInquiryConfirmationTemplate = (data: ServiceInquiryData) => {
  const content = `
    ${createEmailHeader('Service Inquiry Received! 🚀', 'We\'ll be in touch soon', '#17a2b8')}
    
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #17a2b8; margin: 0 0 10px 0;">Thank You, ${data.clientName}!</h2>
        <p style="color: #6c757d; font-size: 16px; margin: 0;">Your service inquiry has been received</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="color: #0A4D68; margin: 0 0 20px 0;">Inquiry Details</h3>
        
        <div style="background: white; padding: 20px; border-radius: 8px;">
          <table style="width: 100%; border-collapse: collapse;">
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Service:</td>
              <td style="padding: 10px 0; color: #212529;">${data.serviceName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Package:</td>
              <td style="padding: 10px 0; color: #212529;">${data.packageName}</td>
            </tr>
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Price:</td>
              <td style="padding: 10px 0; color: #17a2b8; font-weight: 600;">$${data.packagePrice}</td>
            </tr>
            ${data.paymentPlan ? `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Payment Plan:</td>
              <td style="padding: 10px 0; color: #212529;">${data.paymentPlan}</td>
            </tr>
            ` : ''}
            ${data.inquiryId ? `
            <tr>
              <td style="padding: 10px 0; font-weight: 600; color: #495057;">Inquiry ID:</td>
              <td style="padding: 10px 0; color: #6c757d; font-family: monospace;">${data.inquiryId}</td>
            </tr>
            ` : ''}
          </table>
        </div>
      </div>
      
      <div style="background: linear-gradient(135deg, #e1f5fe 0%, #f3e5f5 100%); padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="color: #01579B; margin: 0 0 15px 0;">What Happens Next?</h3>
        <ul style="margin: 0; padding-left: 20px; color: #01579B; line-height: 1.8;">
          <li>Our project manager will contact you within 4-6 hours</li>
          <li>We'll schedule a detailed consultation call</li>
          <li>You'll receive a custom project proposal</li>
          <li>We'll finalize requirements and timeline</li>
        </ul>
      </div>
      
      <div style="text-align: center;">
        <a href="https://hexadigitall.com/portfolio" style="display: inline-block; background: #0A4D68; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; margin: 0 10px 10px 0;">View Our Work</a>
        <a href="https://hexadigitall.com/contact" style="display: inline-block; background: transparent; color: #0A4D68; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600; border: 2px solid #0A4D68;">Contact Us</a>
      </div>
    </div>
  `;
  
  return createEmailWrapper(content);
};

export const createServiceInquiryAdminTemplate = (data: ServiceInquiryData) => {
  const content = `
    ${createEmailHeader('New Service Inquiry', 'A client is interested in your services', '#dc3545')}
    
    <div style="padding: 40px 30px;">
      <div style="background: #f8d7da; border: 1px solid #f5c6cb; padding: 20px; border-radius: 8px; margin-bottom: 30px;">
        <h3 style="color: #721c24; margin: 0 0 15px 0;">Client Information</h3>
        <p style="margin: 5px 0;"><strong>Name:</strong> ${data.clientName}</p>
        <p style="margin: 5px 0;"><strong>Email:</strong> <a href="mailto:${data.clientEmail}" style="color: #721c24;">${data.clientEmail}</a></p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 8px;">
        <h3 style="color: #0A4D68; margin: 0 0 15px 0;">Service Inquiry Details</h3>
        <p style="margin: 5px 0;"><strong>Service:</strong> ${data.serviceName}</p>
        <p style="margin: 5px 0;"><strong>Package:</strong> ${data.packageName}</p>
        <p style="margin: 5px 0;"><strong>Price:</strong> $${data.packagePrice}</p>
        ${data.paymentPlan ? `<p style="margin: 5px 0;"><strong>Payment Plan:</strong> ${data.paymentPlan}</p>` : ''}
        ${data.inquiryId ? `<p style="margin: 5px 0;"><strong>Inquiry ID:</strong> ${data.inquiryId}</p>` : ''}
        <p style="margin: 15px 0 5px 0;"><strong>Inquiry Time:</strong> ${new Date().toLocaleString()}</p>
      </div>
      
      <div style="margin-top: 20px; padding: 15px; background: #d4edda; border: 1px solid #c3e6cb; border-radius: 8px;">
        <p style="margin: 0; color: #155724;"><strong>Priority Action:</strong> Contact the client within 4-6 hours to discuss their requirements.</p>
      </div>
    </div>
  `;
  
  return createEmailWrapper(content);
};

// Newsletter templates (keeping existing ones but updating styling)
export const createNewsletterWelcomeTemplate = () => {
  const content = `
    ${createEmailHeader('Welcome to Hexadigitall! 🎉', 'Thank you for subscribing to our newsletter', '#F5A623')}
    
    <div style="padding: 40px 30px;">
      <div style="text-align: center; margin-bottom: 30px;">
        <h2 style="color: #F5A623; margin: 0 0 10px 0;">You're now part of our community!</h2>
        <p style="color: #6c757d; font-size: 16px; margin: 0;">Get ready for exclusive updates and insights</p>
      </div>
      
      <div style="background: #f8f9fa; padding: 25px; border-radius: 12px; margin-bottom: 30px;">
        <h3 style="color: #0A4D68; margin: 0 0 15px 0;">What to Expect:</h3>
        <ul style="margin: 0; padding-left: 20px; color: #333; line-height: 1.8;">
          <li>Latest digital trends and insights</li>
          <li>New course launches and special offers</li>
          <li>Business tips and success stories</li>
          <li>Behind-the-scenes updates from our team</li>
        </ul>
      </div>
      
      <div style="background: linear-gradient(135deg, #fff3cd 0%, #f8d7da 100%); padding: 20px; border-radius: 8px; margin-bottom: 30px; border-left: 4px solid #F5A623;">
        <h4 style="margin: 0 0 10px 0; color: #0A4D68;">Need immediate help?</h4>
        <p style="margin: 0; line-height: 1.6; color: #333;">
          Don't wait for our newsletter! Contact us anytime at 
          <a href="mailto:hexadigitztech@gmail.com" style="color: #0A4D68; text-decoration: none;">hexadigitztech@gmail.com</a> 
          or call <a href="tel:+2348125802140" style="color: #0A4D68; text-decoration: none;">+234 812 580 2140</a>
        </p>
      </div>
      
      <div style="text-align: center;">
        <a href="https://hexadigitall.com/contact" style="display: inline-block; background: #F5A623; color: white; padding: 15px 30px; text-decoration: none; border-radius: 8px; font-weight: 600;">Transform Your Business Today</a>
      </div>
    </div>
  `;
  
  return createEmailWrapper(content);
};