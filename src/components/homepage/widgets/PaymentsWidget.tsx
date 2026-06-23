'use client'

import { useState, useEffect } from 'react'
import { useHomepage } from '@/contexts/HomepageContext'
import type { WidgetItem } from '@/contexts/HomepageContext'

interface Enrollment {
  _id: string
  courseType?: string
  monthlyAmount?: number
  nextPaymentDue?: string
  paymentStatus?: string
  status: string
  course?: { title: string; slug: { current: string } }
}

function PendingPayments({ onLoad }: { onLoad: () => void }) {
  const [pending, setPending] = useState<Enrollment[]>([])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      onLoad()
      return
    }
    fetch('/api/student/enrollments', {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => {
        if (d.success) {
          const due = (d.enrollments || []).filter(
            (e: Enrollment) =>
              e.status === 'active' &&
              e.courseType === 'live' &&
              e.monthlyAmount
          )
          setPending(due.slice(0, 3))
        }
      })
      .catch(() => {})
      .finally(onLoad)
  }, [onLoad])

  if (pending.length === 0) {
    return <p className="text-xs text-gray-400 dark:text-slate-500">No pending payments.</p>
  }

  return (
    <div className="space-y-2">
      {pending.map((e) => (
        <div
          key={e._id}
          className="p-3 bg-gray-50 dark:bg-slate-900/50 rounded-xl border border-gray-100 dark:border-slate-700"
        >
          <div className="flex items-center justify-between mb-1">
            <p className="text-xs font-semibold text-gray-800 dark:text-slate-200 truncate flex-1">
              {e.course?.title || 'Course'}
            </p>
            <span className="ml-2 text-xs font-bold text-emerald-600 dark:text-emerald-400 shrink-0">
              ₦{e.monthlyAmount?.toLocaleString()}
            </span>
          </div>
          {e.nextPaymentDue && (
            <p className="text-[10px] text-gray-400 dark:text-slate-500">
              Due: {new Date(e.nextPaymentDue).toLocaleDateString()}
            </p>
          )}
        </div>
      ))}
    </div>
  )
}

export function PaymentsWidget({ widget }: { widget: WidgetItem }) {
  const { userRole } = useHomepage()
  const [loading, setLoading] = useState(true)

  if (userRole !== 'student') {
    return (
      <div className="p-5 text-center">
        <p className="text-xs text-gray-400 dark:text-slate-500">Payments tracking available for students.</p>
      </div>
    )
  }

  return (
    <div className="p-5">
      <h3 className="text-sm font-bold text-gray-900 dark:text-slate-100 mb-3">
        {widget.title || 'Payments'}
      </h3>
      {loading ? (
        <div className="space-y-3">
          {[1, 2].map((i) => (
            <div key={i} className="h-14 bg-gray-100 dark:bg-slate-800 rounded-xl animate-pulse" />
          ))}
        </div>
      ) : (
        <PendingPayments onLoad={() => setLoading(false)} />
      )}
    </div>
  )
}
