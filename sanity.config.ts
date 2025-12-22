import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import course from "./src/sanity/schemas/course";
import school from "./src/sanity/schemas/school";
import enrollment from "./src/sanity/schemas/enrollment";
import pendingEnrollment from "./src/sanity/schemas/pendingEnrollment";
import faq from "./src/sanity/schemas/faq";
import post from "./src/sanity/schemas/post";
import project from "./src/sanity/schemas/project";
import service from "./src/sanity/schemas/service";
import serviceCategory from "./src/sanity/schemas/serviceCategory";
import serviceCaseStudy from "./src/sanity/schemas/serviceCaseStudy";
import serviceRequest from "./src/sanity/schemas/serviceRequest";
import serviceStatistics from "./src/sanity/schemas/serviceStatistics";
import serviceTestimonial from "./src/sanity/schemas/serviceTestimonial";
import testimonial from "./src/sanity/schemas/testimonial";
import user from "./src/sanity/schemas/user";
import formSubmission from "./src/sanity/schemas/formSubmission";
import analyticsEvent from "./src/sanity/schemas/analyticsEvent";

console.log("✅ Loading all 14 schemas");

const projectId = process.env.NEXT_PUBLIC_SANITY_PROJECT_ID!;
const dataset = process.env.NEXT_PUBLIC_SANITY_DATASET!;

export default defineConfig({
  basePath: "/studio",
  name: "hexadigitall_content_studio",
  title: "Hexadigitall Content Studio",
  projectId,
  dataset,
  plugins: [structureTool(), visionTool()],
  schema: {
    types: [
      course,
      school,
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
      user,
      formSubmission,
      analyticsEvent,
    ],
  },
});
