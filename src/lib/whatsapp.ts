// src/lib/whatsapp.ts

// ✅ Your Business Number (No '+' sign, just country code + number)
export const BUSINESS_PHONE = '2348125802140'; 

/**
 * Generates a WhatsApp link with a pre-filled message.
 */
export const getWhatsAppLink = (message: string) => {
  const encodedMessage = encodeURIComponent(message);
  return `https://wa.me/${BUSINESS_PHONE}?text=${encodedMessage}`;
};

/**
 * Message for Course Inquiries (Context-Aware)
 */
export const getCourseInquiryMessage = (courseTitle: string, price: string) => {
  return `Hello Hexadigitall, 👋\n\nI am interested in the *${courseTitle}* course (${price}).\n\nCould you provide more details on the start date and payment process?`;
};

/**
 * Message for General/Service Inquiries
 */
export const getServiceInquiryMessage = (serviceName: string) => {
  return `Hello Hexadigitall, 👋\n\nI would like to discuss a project regarding *${serviceName}*.\n\nAre you available for a brief chat?`;
};

/**
 * Message for the Floating Widget (General)
 */
export const getGeneralInquiryMessage = () => {
  return `Hello Hexadigitall, 👋\n\nI have an inquiry about your services.\n\nCan we chat?`;
};