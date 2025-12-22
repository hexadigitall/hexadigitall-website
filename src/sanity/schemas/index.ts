// sanity/schemas/index.ts
import course from './course'
import enrollment from './enrollment'
import pendingEnrollment from './pendingEnrollment'
import faq from './faq'
import post from './post'
import project from './project'
import service from './service'
import serviceCategory from './serviceCategory'
import serviceCaseStudy from './serviceCaseStudy'
import serviceRequest from './serviceRequest'
import serviceStatistics from './serviceStatistics'
import serviceTestimonial from './serviceTestimonial'
import testimonial from './testimonial'
import formSubmission from './formSubmission'
import analyticsEvent from './analyticsEvent'
import user from './user'

export const schemaTypes = [
  course,
  courseCategory, 
  enrollment,
  pendingEnrollment,
  faq,
  post,
  project,
  service,
  serviceCategory,
  serviceCaseStudy,
  serviceRequest,
  serviceStatistics,
  serviceTestimonial,
  testimonial,
  formSubmission,
  analyticsEvent,
  user
]
