'use client'

import { CheckCircleIcon, XCircleIcon, AcademicCapIcon } from '@heroicons/react/24/outline'
import type { GradingResult } from '@/types/simulation'

interface GradeResultProps {
  result: GradingResult
  onClose: () => void
}

const scoreConfig = {
  high: { bar: 'bg-emerald-500', bg: 'bg-emerald-900/10', border: 'border-emerald-700/30', text: 'text-emerald-400', icon: 'text-emerald-400' },
  mid: { bar: 'bg-amber-500', bg: 'bg-amber-900/10', border: 'border-amber-700/30', text: 'text-amber-400', icon: 'text-amber-400' },
  low: { bar: 'bg-red-500', bg: 'bg-red-900/10', border: 'border-red-700/30', text: 'text-red-400', icon: 'text-red-400' },
}

export default function GradeResult({ result, onClose }: GradeResultProps) {
  const pct = result.totalPoints > 0
    ? Math.round((result.earnedPoints / result.totalPoints) * 100)
    : 0

  const cfg = pct >= 80 ? scoreConfig.high : pct >= 50 ? scoreConfig.mid : scoreConfig.low

  return (
    <div className="p-6">
      {/* Header */}
      <div className="flex items-center justify-between mb-6">
        <div className="flex items-center gap-3">
          <div className={`w-12 h-12 rounded-2xl flex items-center justify-center ${cfg.bg}`}>
            <AcademicCapIcon className={`h-6 w-6 ${cfg.text}`} />
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-100">Grading Results</h2>
            <p className="text-xs text-slate-500">{result.submittedAt}</p>
          </div>
        </div>
        <button
          onClick={onClose}
          className="px-3 py-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-xs text-slate-400 transition-colors"
        >
          Close
        </button>
      </div>

      {/* Score summary */}
      <div className={`p-4 rounded-xl border mb-6 ${cfg.bg} ${cfg.border}`}>
        <div className="flex items-baseline gap-2">
          <span className="text-3xl font-bold text-slate-100">{result.earnedPoints}</span>
          <span className="text-slate-500">/ {result.totalPoints} points</span>
          <span className={`ml-auto text-lg font-bold ${cfg.text}`}>{pct}%</span>
        </div>
        <div className="mt-2 h-2 bg-slate-800 rounded-full overflow-hidden">
          <div
            className={`h-full ${cfg.bar} rounded-full transition-all duration-500`}
            style={{ width: `${pct}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-slate-500">
          {result.passed} of {result.total} checks passed
        </p>
      </div>

      {/* Individual checks */}
      <div className="space-y-2">
        {result.checks.map((check, i) => (
          <div
            key={i}
            className={`flex items-start gap-3 p-3 rounded-lg border ${
              check.passed
                ? 'bg-emerald-900/10 border-emerald-800/30'
                : 'bg-red-900/10 border-red-800/30'
            }`}
          >
            {check.passed ? (
              <CheckCircleIcon className="h-5 w-5 text-emerald-400 mt-0.5 shrink-0" />
            ) : (
              <XCircleIcon className="h-5 w-5 text-red-400 mt-0.5 shrink-0" />
            )}
            <div className="flex-1 min-w-0">
              <p className="text-sm font-medium text-slate-200">{check.label}</p>
              <p className="text-xs text-slate-500 font-mono mt-0.5">
                {check.targetId} {check.jsonPath}
              </p>
              <div className="flex items-center gap-4 mt-1 text-xs">
                <span className="text-slate-500">
                  Expected: <code className="text-cyan-300">{check.expected}</code>
                </span>
                <span className="text-slate-500">
                  Actual: <code className={check.passed ? 'text-emerald-300' : 'text-red-300'}>
                    {String(check.actual ?? 'undefined')}
                  </code>
                </span>
                <span className="text-slate-600 ml-auto">{check.points}pt</span>
              </div>
            </div>
          </div>
        ))}
      </div>
    </div>
  )
}
