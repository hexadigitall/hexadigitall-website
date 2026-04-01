import Link from 'next/link'

export const dynamic = 'force-dynamic'

export default function MentorshipLandingPage() {
  return (
    <main className="min-h-screen bg-slate-50">
      <section className="relative overflow-hidden bg-gradient-to-br from-slate-900 via-teal-900 to-amber-900">
        <div className="absolute inset-0 opacity-20">
          <div className="absolute left-[-10%] top-[-20%] h-80 w-80 rounded-full bg-amber-400 blur-[160px]" />
          <div className="absolute bottom-[-20%] right-[-10%] h-80 w-80 rounded-full bg-teal-400 blur-[160px]" />
        </div>

        <div className="relative mx-auto max-w-6xl px-6 pb-14 pt-14">
          <div className="max-w-3xl">
            <div className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/10 px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] text-white">
              Mentorship-only plans
            </div>
            <h1 className="mt-6 text-4xl font-bold text-white sm:text-5xl">
              Mentorships for Textbook Learners
            </h1>
            <p className="mt-4 text-lg text-white/80">
              Bought a Hexadigitall textbook from our store or a vendor? Activate mentorship support, grading, and
              portfolio guidance without enrolling in the full cohort.
            </p>
            <div className="mt-8 flex flex-wrap gap-4">
              <Link
                href="/mentorships/courses"
                className="inline-flex items-center justify-center rounded-xl bg-amber-400 px-6 py-3 text-sm font-semibold text-slate-900 transition-colors hover:bg-amber-300"
              >
                Explore mentorship courses
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-xl border border-white/30 px-6 py-3 text-sm font-semibold text-white transition-colors hover:bg-white/10"
              >
                View full courses
              </Link>
            </div>
          </div>
        </div>
      </section>

      <section className="mx-auto max-w-6xl px-6 py-16">
        <div className="grid gap-10 lg:grid-cols-[1.1fr_1fr]">
          <div>
            <h2 className="text-3xl font-bold text-slate-900">Why mentorship-only?</h2>
            <p className="mt-3 text-slate-600">
              The mentorship path mirrors our live cohort structure. You follow the same weekly schedule from the
              textbook while our mentors grade your assessments and guide your GitHub portfolio development.
            </p>
            <div className="mt-8 grid gap-4 sm:grid-cols-2">
              {[
                {
                  title: 'Assessment grading',
                  body: 'Weekly quizzes, tests, and lab solutions reviewed by a mentor.'
                },
                {
                  title: 'Portfolio feedback',
                  body: 'GitHub structure and project progress assessed every week.'
                },
                {
                  title: 'Google Classroom access',
                  body: 'Submit work and get tracked against official rubrics.'
                },
                {
                  title: 'Accountability loop',
                  body: 'Mentor follow-ups keep you on pace with the textbook.'
                }
              ].map((item) => (
                <div key={item.title} className="rounded-2xl border border-slate-200 bg-white p-5 shadow-sm">
                  <h3 className="text-lg font-semibold text-slate-900">{item.title}</h3>
                  <p className="mt-2 text-sm text-slate-600">{item.body}</p>
                </div>
              ))}
            </div>
          </div>

          <div className="rounded-3xl border border-slate-200 bg-white p-8 shadow-sm">
            <h3 className="text-xl font-semibold text-slate-900">Mentorship activation flow</h3>
            <div className="mt-6 space-y-4">
              {[
                'Pick the mentorship course that matches your textbook.',
                'Subscribe monthly and complete the onboarding form.',
                'We connect with you on WhatsApp and add you to Google Classroom.',
                'Submit weekly assessments and GitHub milestones for review.'
              ].map((step, index) => (
                <div key={step} className="flex items-start gap-4">
                  <div className="flex h-8 w-8 items-center justify-center rounded-full bg-teal-600 text-xs font-semibold text-white">
                    {index + 1}
                  </div>
                  <p className="text-sm text-slate-600">{step}</p>
                </div>
              ))}
            </div>
            <div className="mt-8 rounded-2xl border border-amber-200 bg-amber-50 p-5 text-sm text-slate-700">
              Tip: Mentorship is highly recommended if you want graded feedback and portfolio validation, but you can
              still use the textbook independently if you choose.
            </div>
          </div>
        </div>
      </section>

      <section className="bg-white">
        <div className="mx-auto grid max-w-6xl gap-8 px-6 py-16 lg:grid-cols-[1fr_1fr]">
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Bought a textbook already?</h3>
            <p className="mt-3 text-sm text-slate-600">
              Create your student account to activate mentorship access, track your progress, and manage your
              schedule. If you later enroll in a full course, your same account gets upgraded automatically.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/student/signup?source=mentorships&next=/mentorships/courses"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                Create student account
              </Link>
              <Link
                href="/student/login?source=mentorships&next=/mentorships/courses"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400"
              >
                I already have an account
              </Link>
            </div>
          </div>
          <div className="rounded-2xl border border-slate-200 bg-slate-50 p-6">
            <h3 className="text-xl font-semibold text-slate-900">Ready to start?</h3>
            <p className="mt-3 text-sm text-slate-600">
              Explore mentorship offerings per course and choose the plan that matches your textbook purchase.
            </p>
            <div className="mt-5 flex flex-wrap gap-3">
              <Link
                href="/mentorships/courses"
                className="inline-flex items-center justify-center rounded-lg bg-slate-900 px-4 py-2 text-sm font-semibold text-white transition-colors hover:bg-slate-800"
              >
                View mentorship courses
              </Link>
              <Link
                href="/courses"
                className="inline-flex items-center justify-center rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 transition-colors hover:border-slate-400"
              >
                Explore full courses
              </Link>
            </div>
          </div>
        </div>
      </section>
    </main>
  )
}
