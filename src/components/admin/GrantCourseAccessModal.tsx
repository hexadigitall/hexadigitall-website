'use client'

import { useEffect, useState } from 'react'
import { XMarkIcon, BookOpenIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Course {
  _id: string
  title: string
  slug: string
}

interface GrantCourseAccessModalProps {
  userId: string
  userName: string
  userEmail: string
  onClose: () => void
  onSuccess: () => void
}

export default function GrantCourseAccessModal({
  userId,
  userName,
  userEmail,
  onClose,
  onSuccess,
}: GrantCourseAccessModalProps) {
  const [courses, setCourses] = useState<Course[]>([])
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedCourseId, setSelectedCourseId] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [successMessage, setSuccessMessage] = useState<string | null>(null)

  useEffect(() => {
    const loadCourses = async () => {
      const token = localStorage.getItem('admin_token')
      if (!token) return

      setLoading(true)
      setError(null)
      try {
        const res = await fetch('/api/admin/courses', {
          headers: { Authorization: `Bearer ${token}` },
        })
        const data = await res.json()
        if (res.ok) {
          setCourses(data.courses || [])
        } else {
          setError(data.message || 'Failed to load courses')
        }
      } catch {
        setError('Failed to load courses')
      } finally {
        setLoading(false)
      }
    }

    void loadCourses()
  }, [])

  const handleGrant = async () => {
    if (!selectedCourseId) return

    const token = localStorage.getItem('admin_token')
    if (!token) return

    setSaving(true)
    setError(null)
    setSuccessMessage(null)

    try {
      const res = await fetch('/api/admin/enrollments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({
          userId,
          courseId: selectedCourseId,
          studentName: userName,
          studentEmail: userEmail,
        }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        const course = courses.find((c) => c._id === selectedCourseId)
        setSuccessMessage(
          data.message
            ? data.message
            : `Access granted to "${course?.title ?? 'course'}".`
        )
        onSuccess()
        setTimeout(onClose, 1500)
      } else {
        setError(data.message || 'Failed to grant access')
      }
    } catch {
      setError('Failed to grant access')
    } finally {
      setSaving(false)
    }
  }

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-lg w-full max-h-[85vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <BookOpenIcon className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Grant Course Access</h2>
              <p className="text-sm text-gray-600">{userName}</p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        {/* Body */}
        <div className="flex-1 overflow-y-auto px-6 py-4 space-y-4">
          {error && (
            <div className="px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {successMessage && (
            <div className="flex items-center gap-2 px-4 py-3 rounded-lg bg-green-50 border border-green-200 text-green-800 text-sm">
              <CheckCircleIcon className="h-5 w-5 shrink-0" />
              {successMessage}
            </div>
          )}

          <p className="text-sm text-gray-600">
            Select a course to grant <span className="font-medium">{userName}</span> full access. An enrollment record will be created and course access will be immediately activated.
          </p>

          {loading ? (
            <div className="flex items-center justify-center py-8">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : courses.length === 0 ? (
            <p className="text-sm text-gray-500 text-center py-8">No courses found.</p>
          ) : (
            <ul className="divide-y divide-gray-100 border border-gray-200 rounded-lg overflow-hidden">
              {courses.map((course) => (
                <li key={course._id}>
                  <label className="flex items-center gap-3 px-4 py-3 hover:bg-gray-50 cursor-pointer">
                    <input
                      type="radio"
                      name="course"
                      value={course._id}
                      checked={selectedCourseId === course._id}
                      onChange={() => setSelectedCourseId(course._id)}
                      className="accent-primary h-4 w-4"
                    />
                    <span className="text-sm text-gray-900">{course.title}</span>
                  </label>
                </li>
              ))}
            </ul>
          )}
        </div>

        {/* Footer */}
        <div className="flex items-center justify-end gap-3 px-6 py-4 border-t border-gray-200">
          <button
            type="button"
            onClick={onClose}
            className="px-4 py-2 text-sm text-gray-700 hover:text-gray-900 border border-gray-300 rounded-lg hover:bg-gray-50"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={handleGrant}
            disabled={!selectedCourseId || saving}
            className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white text-sm rounded-lg hover:bg-primary/90 disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {saving ? 'Granting...' : 'Grant Access'}
          </button>
        </div>
      </div>
    </div>
  )
}
