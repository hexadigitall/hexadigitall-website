import Link from 'next/link'
import type { CurriculumDocument } from '@/lib/curriculum-types'

interface CurriculumDocumentViewProps {
  curriculum: CurriculumDocument
  showActions?: boolean
}

function SectionList({ items }: { items?: string[] }) {
  if (!items?.length) return null

  return (
    <ul className="space-y-3 text-sm leading-7 text-slate-700 dark:text-slate-300">
      {items.map((item, index) => (
        <li key={`${item}-${index}`} className="flex gap-3">
          <span className="mt-2 h-2.5 w-2.5 shrink-0 rounded-full bg-cyan-500" />
          <span>{item}</span>
        </li>
      ))}
    </ul>
  )
}

export default function CurriculumDocumentView({ curriculum, showActions = true }: CurriculumDocumentViewProps) {
  const slug = curriculum.course?.slug.current || curriculum.slug.current

  return (
    <div className="space-y-8">
      {showActions && (
        <div className="flex flex-col gap-3 sm:flex-row sm:flex-wrap">
          <a
            href={`/api/curriculum/${slug}/pdf`}
            className="inline-flex items-center justify-center rounded-xl bg-slate-900 px-5 py-3 text-sm font-semibold text-white transition hover:bg-slate-800"
          >
            Download PDF
          </a>
          <Link
            href={`/courses/${slug}`}
            className="inline-flex items-center justify-center rounded-xl border border-slate-300 dark:border-slate-600 px-5 py-3 text-sm font-semibold text-slate-700 dark:text-slate-300 transition hover:border-slate-400 dark:hover:border-slate-500 hover:bg-slate-50 dark:hover:bg-slate-800"
          >
            Back to Course
          </Link>
        </div>
      )}

      <section className="overflow-hidden rounded-[28px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-900 shadow-[0_24px_80px_-40px_rgba(15,23,42,0.35)]">
        <div className="border-b border-slate-200 bg-[linear-gradient(132deg,#0b1329_0%,#0e3558_55%,#0d5770_100%)] px-6 py-8 sm:px-10 lg:px-12">
          <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_290px] lg:items-start">
            <div className="space-y-5 rounded-2xl border border-white/20 bg-slate-950/28 p-5 shadow-xl backdrop-blur-sm sm:p-6">
              <div className="inline-flex rounded-full border border-white/45 bg-white dark:bg-slate-900 dark:bg-slate-900/22 px-4 py-1 text-xs font-semibold uppercase tracking-[0.22em] text-white">
                Curriculum
              </div>
              <div className="space-y-3">
                <h2 className="max-w-4xl text-3xl font-semibold tracking-tight leading-tight text-white sm:text-4xl">
                  {curriculum.title}
                </h2>
                <p className="max-w-3xl text-sm leading-7 text-white/95 sm:text-base">
                  {curriculum.heroSummary || curriculum.summary || curriculum.course?.summary || curriculum.course?.description}
                </p>
              </div>
            </div>
            <div className="rounded-3xl border border-white/30 bg-slate-950/45 p-5 shadow-2xl backdrop-blur-md">
              <div className="grid gap-3 text-sm text-white/90">
                {curriculum.duration && <div><span className="font-semibold text-cyan-100/85">Duration:</span> <span className="text-white">{curriculum.duration}</span></div>}
                {curriculum.level && <div><span className="font-semibold text-cyan-100/85">Level:</span> <span className="text-white">{curriculum.level}</span></div>}
                {curriculum.studyTime && <div><span className="font-semibold text-cyan-100/85">Study Time:</span> <span className="text-white">{curriculum.studyTime}</span></div>}
                {curriculum.schoolName && <div><span className="font-semibold text-cyan-100/85">School:</span> <span className="text-white">{curriculum.schoolName}</span></div>}
              </div>
              {!!curriculum.heroTags?.length && (
                <div className="mt-4 flex flex-wrap gap-2">
                  {curriculum.heroTags.map((tag, index) => (
                    <span key={`${tag}-${index}`} className="rounded-full border border-cyan-100/35 bg-white dark:bg-slate-900/90 px-3 py-1 text-xs font-semibold text-cyan-800 dark:text-cyan-300">
                      {tag}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        </div>

        <div className="space-y-8 px-6 py-8 sm:px-10 lg:px-12 lg:py-10">
          {!!curriculum.welcomeMessages?.length && (
            <section className="rounded-[24px] border border-cyan-100 dark:border-cyan-900/50 bg-cyan-50/70 dark:bg-cyan-950/20 p-6 sm:p-8">
              {curriculum.welcomeTitle && (
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{curriculum.welcomeTitle}</h3>
              )}
              <div className="mt-4 space-y-4 text-sm leading-7 text-slate-700 dark:text-slate-300 sm:text-base">
                {curriculum.welcomeMessages.map((message, index) => (
                  <p key={`${message.slice(0, 32)}-${index}`}>{message}</p>
                ))}
              </div>
            </section>
          )}

          <div className="grid gap-6 xl:grid-cols-2">
            {!!curriculum.prerequisites?.length && (
              <section className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Prerequisites</h3>
                <div className="mt-5">
                  <SectionList items={curriculum.prerequisites} />
                </div>
              </section>
            )}

            {!!curriculum.essentialResources?.length && (
              <section className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Essential Resources</h3>
                <div className="mt-5">
                  <SectionList items={curriculum.essentialResources} />
                </div>
              </section>
            )}
          </div>

          {!!curriculum.complementaryCourses?.length && (
              <section className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Complementary Courses</h3>
                <div className="mt-5 grid gap-4 md:grid-cols-2 xl:grid-cols-3">
                  {curriculum.complementaryCourses.map((item, index) => (
                    <article key={`${item.title}-${index}`} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-5">
                      <h4 className="text-base font-semibold text-slate-950 dark:text-slate-100">{item.title}</h4>
                      {item.description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{item.description}</p>}
                  </article>
                ))}
              </div>
            </section>
          )}

          {!!curriculum.learningRoadmap?.length && (
              <section className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
                <h3 className="text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Learning Roadmap</h3>
              <div className="mt-5">
                <SectionList items={curriculum.learningRoadmap} />
              </div>
            </section>
          )}

          {!!curriculum.weeks?.length && (
            <section className="space-y-4">
              <div>
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Detailed Weekly Curriculum</h3>
                <p className="mt-2 text-sm text-slate-600 dark:text-slate-400">Each week includes outcomes and practical lab work aligned to the curriculum structure.</p>
              </div>
              <div className="space-y-4">
                {curriculum.weeks.map((week) => (
                  <article key={week._key || `${week.weekNumber}-${week.topic}`} className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 sm:p-8">
                    <div className="flex flex-col gap-3 border-b border-slate-100 dark:border-slate-700 pb-4 sm:flex-row sm:items-start sm:justify-between">
                      <div>
                        <div className="text-xs font-semibold uppercase tracking-[0.22em] text-cyan-700 dark:text-cyan-400">Week {week.weekNumber}</div>
                        <h4 className="mt-2 text-xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">{week.topic}</h4>
                      </div>
                      {week.duration && (
                        <span className="inline-flex rounded-full bg-slate-100 dark:bg-slate-700 px-3 py-1 text-xs font-medium text-slate-700 dark:text-slate-300">
                          {week.duration}
                        </span>
                      )}
                    </div>
                    {!!week.outcomes?.length && (
                      <div className="mt-5">
                        <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-500 dark:text-slate-400">Learning Outcomes</h5>
                        <div className="mt-4">
                          <SectionList items={week.outcomes} />
                        </div>
                      </div>
                    )}
                    {!!week.labItems?.length && (
                      <div className="mt-6 rounded-2xl border border-cyan-100 dark:border-cyan-900/50 bg-cyan-50/60 dark:bg-cyan-950/20 p-5">
                        <h5 className="text-sm font-semibold uppercase tracking-[0.2em] text-cyan-800 dark:text-cyan-400">{week.labTitle || 'Lab Exercise'}</h5>
                        <div className="mt-4">
                          <SectionList items={week.labItems} />
                        </div>
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}

          {!!curriculum.capstoneProjects?.length && (
              <section className="rounded-[24px] border border-slate-200 dark:border-slate-700 bg-slate-50 dark:bg-slate-800/50 p-6 sm:p-8">
                <h3 className="text-2xl font-semibold tracking-tight text-slate-950 dark:text-slate-100">Capstone Projects</h3>
                <div className="mt-5 grid gap-4 xl:grid-cols-3">
                  {curriculum.capstoneProjects.map((project, index) => (
                    <article key={`${project.title}-${index}`} className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-5">
                      <h4 className="text-base font-semibold text-slate-950 dark:text-slate-100">{project.title}</h4>
                      {project.description && <p className="mt-2 text-sm leading-6 text-slate-600 dark:text-slate-400">{project.description}</p>}
                    {!!project.deliverables?.length && (
                      <div className="mt-4">
                        <SectionList items={project.deliverables} />
                      </div>
                    )}
                  </article>
                ))}
              </div>
            </section>
          )}
        </div>
      </section>
    </div>
  )
}
