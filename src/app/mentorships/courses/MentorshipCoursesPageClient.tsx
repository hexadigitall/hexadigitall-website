"use client"

import { useMemo, useState } from 'react'
import MentorshipCourseCard, { MentorshipCourse } from '@/components/mentorships/MentorshipCourseCard'

interface MentorshipCoursesPageClientProps {
  courses: MentorshipCourse[]
}

export default function MentorshipCoursesPageClient({ courses }: MentorshipCoursesPageClientProps) {
  const [query, setQuery] = useState('')

  const filteredCourses = useMemo(() => {
    if (!query.trim()) return courses
    const search = query.trim().toLowerCase()
    return courses.filter((course) => {
      return (
        course.title?.toLowerCase().includes(search) ||
        course.summary?.toLowerCase().includes(search) ||
        course.description?.toLowerCase().includes(search) ||
        course.level?.toLowerCase().includes(search)
      )
    })
  }, [courses, query])

  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-teal-900 via-slate-900 to-amber-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-0 top-0 h-72 w-72 rounded-full bg-teal-400 blur-[140px]" />
          <div className="absolute bottom-0 right-0 h-72 w-72 rounded-full bg-amber-400 blur-[140px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-20 pt-24 sm:pt-28">
          <div className="max-w-2xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Mentorship-only track
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
              Course Mentorships for Textbook Learners
            </h1>
            <p className="mt-5 text-lg text-white/80">
              Buy any Hexadigitall textbook anywhere, then enroll here to get a dedicated mentor, Google Classroom
              access, graded assessments, and portfolio guidance.
            </p>
          </div>

          <div className="mt-10 grid gap-6 sm:grid-cols-3">
            {[
              {
                title: 'Mentor-led feedback',
                body: 'Weekly reviews, corrections, and growth plans mapped to the textbook structure.'
              },
              {
                title: 'Google Classroom access',
                body: 'Get classroom enrollment, quizzes, and grading workflows with progress tracking.'
              },
              {
                title: 'Portfolio-first pathway',
                body: 'Start GitHub portfolio building from Week 1 and get mentor checkpoints.'
              }
            ].map((item) => (
              <div key={item.title} className="rounded-2xl border border-white/10 bg-white/5 p-6 text-white">
                <h3 className="text-lg font-semibold">{item.title}</h3>
                <p className="mt-2 text-sm text-white/70">{item.body}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-14">
        <div className="grid gap-8 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-2xl font-bold text-slate-900">Find your mentorship course</h2>
            <p className="mt-2 text-slate-600">
              Search by course name or level. Every mentorship includes assessment grading, portfolio reviews, and
              direct mentor support.
            </p>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-white p-4 shadow-sm">
            <label className="text-xs font-semibold uppercase tracking-wide text-slate-500">Search</label>
            <input
              type="search"
              value={query}
              onChange={(event) => setQuery(event.target.value)}
              placeholder="Try 'DevOps', 'Beginner', or 'Cloud'"
              className="mt-2 w-full rounded-lg border border-slate-200 px-4 py-3 text-sm text-slate-700 focus:border-teal-500 focus:ring-teal-200"
            />
          </div>
        </div>

        <div className="mt-10 grid gap-8 md:grid-cols-2 xl:grid-cols-3">
          {filteredCourses.map((course) => (
            <MentorshipCourseCard key={course._id} course={course} />
          ))}
        </div>

        {filteredCourses.length === 0 ? (
          <div className="mt-12 rounded-2xl border border-dashed border-slate-300 bg-white p-8 text-center text-slate-600">
            No mentorship courses match that search yet. Try another keyword or browse all courses.
          </div>
        ) : null}
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1.2fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">How the mentorship flow works</h2>
            <p className="mt-3 text-slate-600">
              We keep the process simple so learners who already bought the textbook can quickly activate support.
            </p>
            <div className="mt-8 space-y-4">
              {[
                'Enroll in the mentorship plan for your chosen course.',
                'Complete payment and receive an enrollment confirmation.',
                'Our team connects with you on WhatsApp and adds you to Google Classroom.',
                'Submit weekly assessments and GitHub milestones for mentor review.'
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-4 rounded-xl border border-slate-200 bg-slate-50 p-4">
                  <div className="flex h-9 w-9 items-center justify-center rounded-full bg-teal-600 text-sm font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-600">{step}</p>
                </div>
              ))}
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-gradient-to-br from-amber-50 via-white to-teal-50 p-8">
            <h3 className="text-xl font-semibold text-slate-900">Built for independent learners</h3>
            <p className="mt-3 text-sm text-slate-600">
              This mentorship-only track is ideal if you bought the textbook from our bookstore or a vendor and still
              want structured grading, guidance, and accountability.
            </p>
            <div className="mt-6 space-y-3 text-sm text-slate-600">
              <div className="rounded-lg bg-white/80 p-4 shadow-sm">
                Weekly assessments graded by a Hexadigitall mentor.
              </div>
              <div className="rounded-lg bg-white/80 p-4 shadow-sm">
                Portfolio milestones tracked against the official course rubric.
              </div>
              <div className="rounded-lg bg-white/80 p-4 shadow-sm">
                Feedback loops that mirror the live-course experience.
              </div>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
