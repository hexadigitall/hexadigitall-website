export interface TemplateDefinition {
  id: string
  label: string
  description: string
  icon: string
  widgets: string[]
}

export const TEMPLATES: TemplateDefinition[] = [
  {
    id: 'learner',
    label: "I'm Here to Learn",
    description: 'Courses, labs, curriculums, textbooks',
    icon: '🎓',
    widgets: ['tracked-courses', 'textbooks', 'labs', 'quick-actions'],
  },
  {
    id: 'builder',
    label: 'I Want to Build Something',
    description: 'Web dev, mobile apps, custom build, portfolio',
    icon: '🏗️',
    widgets: ['services', 'custom-build', 'portfolio', 'quick-actions'],
  },
  {
    id: 'grow',
    label: 'Grow My Business',
    description: 'Digital marketing, social media, SEO, consulting',
    icon: '📈',
    widgets: ['services', 'recent-activity', 'blog', 'quick-actions'],
  },
  {
    id: 'planner',
    label: 'Planning a Business',
    description: 'Business plans, strategy sessions, proposals, consulting',
    icon: '📋',
    widgets: ['services', 'plans-proposals', 'mentorships', 'quick-actions'],
  },
  {
    id: 'reader',
    label: "I'm Here to Read",
    description: 'Textbooks, publications, blog, resources',
    icon: '📚',
    widgets: ['textbooks', 'blog', 'recent-activity', 'quick-actions'],
  },
  {
    id: 'mentee',
    label: 'I Need Guidance',
    description: 'Mentorship programs, coaching, strategy sessions',
    icon: '🧭',
    widgets: ['mentorships', 'services', 'textbooks', 'quick-actions'],
  },
  {
    id: 'designer',
    label: 'Design & Branding',
    description: 'Logo design, branding kits, portfolio, LinkedIn',
    icon: '🎨',
    widgets: ['services', 'portfolio', 'quick-actions', 'recent-activity'],
  },
  {
    id: 'shopper',
    label: 'Shop & Download',
    description: 'Store, digital assets, templates, bundles',
    icon: '🛍️',
    widgets: ['textbooks', 'services', 'recent-activity', 'quick-actions'],
  },
  {
    id: 'student',
    label: 'Track My Journey',
    description: 'Enrolled courses, payments, library, certificates',
    icon: '📊',
    widgets: ['enrollments', 'payments', 'textbooks', 'labs', 'recent-activity', 'quick-actions'],
  },
  {
    id: 'educator',
    label: "I'm an Educator",
    description: 'My courses, my students, labs, assessments',
    icon: '👨‍🏫',
    widgets: ['enrollments', 'labs', 'recent-activity', 'quick-actions'],
  },
  {
    id: 'explorer',
    label: 'Just Exploring',
    description: 'Recent activity, portfolio, case studies, blog',
    icon: '🌟',
    widgets: ['recent-activity', 'portfolio', 'blog', 'quick-actions'],
  },
  {
    id: 'custom',
    label: 'Mix & Match',
    description: 'Start from scratch — pick widgets one by one',
    icon: '🛠️',
    widgets: [],
  },
]

export function getTemplate(id: string): TemplateDefinition | undefined {
  return TEMPLATES.find((t) => t.id === id)
}

export function getDefaultWidgetsForTemplate(templateId: string): string[] {
  const template = getTemplate(templateId)
  return template?.widgets ?? []
}
