'use client'

import { useCallback, useEffect, useMemo, useRef, useState } from 'react'

interface Option {
  id: string
  text: string
}

interface Question {
  id: string
  prompt: string
  options: Option[]
}

interface PublicAssessment {
  courseSlug: string
  slug: string
  title: string
  phase: string
  phaseLabel: string
  description: string
  instructions: string[]
  durationMinutes: number
  passPercentage: number
  totalQuestions: number
  questions: Question[]
}

interface ResultPayload {
  scoreRaw: number
  scorePercent: number
  passed: boolean
  passPercentage: number
  totalQuestions: number
  timeSpentSeconds: number
}

interface AttemptPayload {
  attemptId: string
  startedAt: string
  expiresAt: string
  submittedAt?: string
  status: string
  answers: Record<string, string>
  attemptNumber: number
  resultCode?: string
  result?: ResultPayload
}

interface Props {
  courseTitle: string
  courseSlug: string
  assessment: PublicAssessment
  viewerName: string
  viewerRole: 'guest' | 'student' | 'teacher' | 'admin'
  canAttempt: boolean
  accessMessage: string
}

function formatTimeRemaining(seconds: number) {
  const clamped = Math.max(0, seconds)
  const mins = Math.floor(clamped / 60)
  const secs = clamped % 60
  return `${String(mins).padStart(2, '0')}:${String(secs).padStart(2, '0')}`
}

function formatDuration(seconds: number) {
  const minutes = Math.floor(seconds / 60)
  const secs = seconds % 60
  if (minutes > 0) return `${minutes}m ${secs}s`
  return `${secs}s`
}

export default function AssessmentExamClient({
  courseTitle,
  courseSlug,
  assessment,
  viewerName,
  viewerRole,
  canAttempt,
  accessMessage,
}: Props) {
  const [stage, setStage] = useState<'intro' | 'exam' | 'result'>('intro')
  const [attempt, setAttempt] = useState<AttemptPayload | null>(null)
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentIndex, setCurrentIndex] = useState(0)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [result, setResult] = useState<ResultPayload | null>(null)
  const [timedOut, setTimedOut] = useState(false)
  const [secondsRemaining, setSecondsRemaining] = useState<number>(assessment.durationMinutes * 60)

  const saveTimeoutRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const submitInFlightRef = useRef(false)

  const totalAnswered = useMemo(
    () => Object.values(answers).filter(Boolean).length,
    [answers],
  )

  const activeQuestion = assessment.questions[currentIndex]

  const startAssessment = async () => {
    const token = typeof window !== 'undefined' ? localStorage.getItem('admin_token') : null
    if (!token) {
      window.location.href = `/student/login?next=${encodeURIComponent(window.location.pathname)}`
      return
    }

    setLoading(true)
    setError(null)

    try {
      const response = await fetch(`/api/assessments/${courseSlug}/${assessment.slug}/start`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to start assessment.')
      }

      const nextAttempt = data.attempt as AttemptPayload
      setAttempt(nextAttempt)
      setAnswers(nextAttempt.answers || {})

      if (nextAttempt.status === 'submitted' || nextAttempt.status === 'expired') {
        if (nextAttempt.result) {
          setResult(nextAttempt.result)
          setTimedOut(nextAttempt.status === 'expired')
          setStage('result')
        } else {
          setStage('intro')
          setError('Previous attempt is already closed and result data was unavailable.')
        }
      } else {
        setStage('exam')
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to start assessment.')
    } finally {
      setLoading(false)
    }
  }

  const submitAssessment = useCallback(async (forceTimeout = false) => {
    if (!attempt || submitInFlightRef.current) return

    submitInFlightRef.current = true
    setLoading(true)
    setError(null)

    try {
      const token = localStorage.getItem('admin_token')
      if (!token) throw new Error('Session expired. Please sign in again.')

      const response = await fetch(`/api/assessments/${courseSlug}/${assessment.slug}/submit`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          attemptId: attempt.attemptId,
          answers,
        }),
      })

      const data = await response.json()
      if (!response.ok || !data.success) {
        throw new Error(data.message || 'Unable to submit assessment.')
      }

      const resultData = data.attempt?.result as ResultPayload
      if (!resultData) {
        throw new Error('Result payload missing from assessment submission.')
      }

      setResult(resultData)
      setTimedOut(Boolean(data.timedOut || forceTimeout))
      setAttempt((prev) => (prev ? {
        ...prev,
        submittedAt: data.attempt.submittedAt,
        status: data.attempt.status,
      } : prev))
      setStage('result')
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Unable to submit assessment.')
    } finally {
      setLoading(false)
      submitInFlightRef.current = false
    }
  }, [answers, assessment.slug, attempt, courseSlug])

  useEffect(() => {
    if (!attempt || stage !== 'exam') return

    const interval = setInterval(() => {
      const seconds = Math.max(0, Math.floor((new Date(attempt.expiresAt).getTime() - Date.now()) / 1000))
      setSecondsRemaining(seconds)

      if (seconds <= 0) {
        clearInterval(interval)
        setTimedOut(true)
        void submitAssessment(true)
      }
    }, 1000)

    return () => clearInterval(interval)
  }, [attempt, stage, submitAssessment])

  useEffect(() => {
    if (!attempt || stage !== 'exam') return

    if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)

    saveTimeoutRef.current = setTimeout(async () => {
      try {
        const token = localStorage.getItem('admin_token')
        if (!token) return

        await fetch(`/api/assessments/${courseSlug}/${assessment.slug}/save`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
            Authorization: `Bearer ${token}`,
          },
          body: JSON.stringify({
            attemptId: attempt.attemptId,
            answers,
          }),
        })
      } catch {
        // Silent autosave failure; submit remains authoritative.
      }
    }, 800)

    return () => {
      if (saveTimeoutRef.current) clearTimeout(saveTimeoutRef.current)
    }
  }, [answers, attempt, stage, courseSlug, assessment.slug])

  const onSelectAnswer = (questionId: string, optionId: string) => {
    setAnswers((prev) => ({ ...prev, [questionId]: optionId }))
  }

  return (
    <section className="space-y-6 print:space-y-3">
      <header className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm print:border-0 print:shadow-none print:p-0">
        <p className="text-xs font-semibold uppercase tracking-wider text-cyan-700">Professional Timed Assessment</p>
        <h1 className="mt-2 text-2xl font-bold text-slate-900">{assessment.title}</h1>
        <p className="mt-2 text-sm text-slate-600">{assessment.description}</p>
      </header>

      {stage === 'intro' && (
        <article className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Candidate" value={viewerName} />
            <Metric label="Questions" value={String(assessment.totalQuestions)} />
            <Metric label="Duration" value={`${assessment.durationMinutes} mins`} />
            <Metric label="Pass Mark" value={`${assessment.passPercentage}%`} />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4">
            <p className="text-sm font-semibold text-slate-800">Assessment Instructions</p>
            <ul className="mt-2 list-disc space-y-1 pl-5 text-sm text-slate-600">
              {assessment.instructions.map((item) => (
                <li key={item}>{item}</li>
              ))}
            </ul>
          </div>

          <div className="mt-6 rounded-xl border border-cyan-200 bg-cyan-50 p-4 text-sm text-cyan-900">
            {accessMessage}
          </div>

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap items-center gap-3">
            <button
              type="button"
              onClick={() => void startAssessment()}
              disabled={!canAttempt || loading || viewerRole === 'guest'}
              className="inline-flex items-center rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-slate-300"
            >
              {loading ? 'Preparing assessment...' : 'Start Assessment'}
            </button>
            <span className="text-xs text-slate-500">
              Timer starts immediately when you click start.
            </span>
          </div>
        </article>
      )}

      {stage === 'exam' && attempt && (
        <article className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm">
          <div className="mb-5 flex flex-wrap items-center justify-between gap-3 border-b border-slate-200 pb-4">
            <div>
              <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">Attempt #{attempt.attemptNumber}</p>
              <p className="text-sm text-slate-700">Answered {totalAnswered} of {assessment.totalQuestions}</p>
            </div>
            <div className="rounded-lg border border-amber-300 bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-800">
              Time Remaining: {formatTimeRemaining(secondsRemaining)}
            </div>
          </div>

          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-slate-900">
              Question {currentIndex + 1} of {assessment.totalQuestions}
            </h2>
            <p className="text-sm leading-6 text-slate-800">{activeQuestion.prompt}</p>

            <div className="space-y-2">
              {activeQuestion.options.map((option) => {
                const checked = answers[activeQuestion.id] === option.id
                return (
                  <label
                    key={option.id}
                    className={`flex cursor-pointer items-start gap-3 rounded-lg border p-3 text-sm transition ${checked ? 'border-slate-900 bg-slate-100' : 'border-slate-200 hover:border-slate-300'}`}
                  >
                    <input
                      type="radio"
                      name={activeQuestion.id}
                      checked={checked}
                      onChange={() => onSelectAnswer(activeQuestion.id, option.id)}
                      className="mt-0.5 h-4 w-4"
                    />
                    <span>{option.text}</span>
                  </label>
                )
              })}
            </div>
          </div>

          {error && <p className="mt-4 text-sm font-medium text-red-600">{error}</p>}

          <div className="mt-6 flex flex-wrap items-center justify-between gap-3">
            <div className="flex gap-2">
              <button
                type="button"
                onClick={() => setCurrentIndex((value) => Math.max(0, value - 1))}
                disabled={currentIndex === 0}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Previous
              </button>
              <button
                type="button"
                onClick={() => setCurrentIndex((value) => Math.min(assessment.questions.length - 1, value + 1))}
                disabled={currentIndex === assessment.questions.length - 1}
                className="rounded-lg border border-slate-300 px-4 py-2 text-sm font-semibold text-slate-700 disabled:cursor-not-allowed disabled:opacity-50"
              >
                Next
              </button>
            </div>

            <button
              type="button"
              onClick={() => void submitAssessment(false)}
              disabled={loading || submitInFlightRef.current}
              className="rounded-lg bg-cyan-700 px-5 py-2.5 text-sm font-semibold text-white disabled:cursor-not-allowed disabled:bg-cyan-300"
            >
              {loading ? 'Submitting...' : 'Submit Assessment'}
            </button>
          </div>
        </article>
      )}

      {stage === 'result' && result && (
        <article className="rounded-2xl border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-6 shadow-sm print:border-0 print:shadow-none">
          <header className="border-b border-slate-200 pb-4 print:border-slate-300">
            <p className="text-xs font-semibold uppercase tracking-wider text-slate-500">Assessment Result</p>
            <h2 className="mt-2 text-2xl font-bold text-slate-900">{assessment.title}</h2>
            <p className="mt-1 text-sm text-slate-600">{courseTitle}</p>
          </header>

          <div className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
            <Metric label="Candidate" value={viewerName} />
            <Metric label="Score" value={`${result.scoreRaw}/${result.totalQuestions}`} />
            <Metric label="Percentage" value={`${result.scorePercent}%`} />
            <Metric label="Status" value={result.passed ? 'Passed' : 'Not Passed'} accent={result.passed ? 'text-green-700' : 'text-red-700'} />
            <Metric label="Pass Mark" value={`${result.passPercentage}%`} />
            <Metric label="Time Spent" value={formatDuration(result.timeSpentSeconds)} />
            <Metric label="Result Code" value={attempt?.resultCode || 'N/A'} />
            <Metric label="Timed Status" value={timedOut ? 'Auto-submitted on timeout' : 'Submitted normally'} />
          </div>

          <div className="mt-6 rounded-xl border border-slate-200 bg-slate-50 p-4 text-sm text-slate-700">
            Print this result page and submit it to your teacher or classroom workflow as required.
          </div>

          <div className="mt-6 flex flex-wrap gap-3 print:hidden">
            <button
              type="button"
              onClick={() => window.print()}
              className="rounded-lg bg-slate-900 px-5 py-2.5 text-sm font-semibold text-white"
            >
              Print Result
            </button>
            <button
              type="button"
              onClick={() => {
                setStage('intro')
                setCurrentIndex(0)
                setError(null)
              }}
              className="rounded-lg border border-slate-300 px-5 py-2.5 text-sm font-semibold text-slate-700"
            >
              Return to Assessment Intro
            </button>
          </div>
        </article>
      )}
    </section>
  )
}

function Metric({ label, value, accent }: { label: string; value: string; accent?: string }) {
  return (
    <div className="rounded-lg border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 p-3">
      <p className="text-xs font-semibold uppercase tracking-wide text-slate-500">{label}</p>
      <p className={`mt-1 text-sm font-semibold text-slate-900 ${accent || ''}`}>{value}</p>
    </div>
  )
}
