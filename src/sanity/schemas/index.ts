import { type SchemaTypeDefinition } from 'sanity'

// Documents
import post from './post'
import user from './user'
import category from './serviceCategory' // Assuming this is your category schema
import course from './course'
import school from './school'
import service from './service' // Individual service
import project from './project'
import serviceRequest from './serviceRequest'
import enrollment from './enrollment'
import pendingEnrollment from './pendingEnrollment'
import formSubmission from './formSubmission'
import faq from './faq'
import testimonial from './testimonial'
import serviceTestimonial from './serviceTestimonial'
import serviceCaseStudy from './serviceCaseStudy'
import serviceStatistics from './serviceStatistics'
import servicesPage from './servicesPage' // 👈 IMPORTED HERE
import pageOgAssets from './pageOgAssets'

// Objects (if any, though most seem to be documents based on your file list)
// ...

export const schema: { types: SchemaTypeDefinition[] } = {
  types: [
    post,
    user,
    category,
    course,
    school,
    service,
    project,
    serviceRequest,
    enrollment,
    pendingEnrollment,
    formSubmission,
    faq,
    testimonial,
    serviceTestimonial,
    serviceCaseStudy,
    serviceStatistics,
    servicesPage, // 👈 ADDED HERE
    pageOgAssets,
  ],
}