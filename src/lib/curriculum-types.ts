export interface CurriculumLinkedCourse {
  _id?: string
  title: string
  slug: { current: string }
  summary?: string
  description?: string
}

export interface CurriculumRelatedCourse {
  _key?: string
  title: string
  description?: string
}

export interface CurriculumWeek {
  _key?: string
  weekNumber: number
  duration?: string
  topic: string
  outcomes: string[]
  labTitle?: string
  labItems: string[]
}

export interface CurriculumProject {
  _key?: string
  title: string
  description?: string
  deliverables: string[]
}

export interface CurriculumDocument {
  _id?: string
  _type?: 'curriculum'
  title: string
  slug: { current: string }
  course?: CurriculumLinkedCourse
  summary?: string
  heroSummary?: string
  heroTags?: string[]
  duration?: string
  level?: string
  studyTime?: string
  schoolName?: string
  welcomeTitle?: string
  welcomeMessages?: string[]
  prerequisites?: string[]
  complementaryCourses?: CurriculumRelatedCourse[]
  essentialResources?: string[]
  learningRoadmap?: string[]
  weeks?: CurriculumWeek[]
  capstoneProjects?: CurriculumProject[]
  sourceHtmlFile?: string
  importedAt?: string
}
