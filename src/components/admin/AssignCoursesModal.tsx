'use client'

import { useEffect, useState } from 'react'
import { XMarkIcon, AcademicCapIcon } from '@heroicons/react/24/outline'

interface Course {
  _id: string
  title: string
  slug: string
  description?: string
}

interface AssignCoursesModalProps {
  teacherId: string
  teacherName: string
  onClose: () => void
  onSuccess: () => void
}

export default function AssignCoursesModal({
  teacherId,
  teacherName,
  onClose,
  onSuccess,
}: AssignCoursesModalProps) {
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [courses, setCourses] = useState<Course[]>([])
  const [assignedCourseIds, setAssignedCourseIds] = useState<Set<string>>(new Set())
  const [selectedCourseIds, setSelectedCourseIds] = useState<Set<string>>(new Set())
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    loadCourses()
  }, [teacherId])

  const loadCourses = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setLoading(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${teacherId}/courses`, {
        headers: { Authorization: `Bearer ${token}` },
      })
      const data = await res.json()
      if (res.ok) {
        setCourses(data.allCourses || [])
        const assigned = new Set<string>(data.assignedCourseIds || [])
        setAssignedCourseIds(assigned)
        setSelectedCourseIds(new Set<string>(assigned))
      } else {
        setError(data.message || 'Failed to load courses')
      }
    } catch (err) {
      console.error('Failed to load courses:', err)
      setError('Failed to load courses')
    } finally {
      setLoading(false)
    }
  }

  const handleToggle = (courseId: string) => {
    setSelectedCourseIds((prev) => {
      const next = new Set(prev)
      if (next.has(courseId)) {
        next.delete(courseId)
      } else {
        next.add(courseId)
      }
      return next
    })
  }

  const handleSave = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) return

    setSaving(true)
    setError(null)
    try {
      const res = await fetch(`/api/admin/users/${teacherId}/courses`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ courseIds: Array.from(selectedCourseIds) }),
      })
      const data = await res.json()
      if (res.ok) {
        onSuccess()
        onClose()
      } else {
        setError(data.message || 'Failed to save assignments')
      }
    } catch (err) {
      console.error('Failed to save assignments:', err)
      setError('Failed to save assignments')
    } finally {
      setSaving(false)
    }
  }

  const hasChanges = 
    selectedCourseIds.size !== assignedCourseIds.size ||
    Array.from(selectedCourseIds).some((id) => !assignedCourseIds.has(id))

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-50 p-4">
      <div className="bg-white rounded-lg shadow-xl max-w-2xl w-full max-h-[90vh] overflow-hidden flex flex-col">
        <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
          <div className="flex items-center space-x-3">
            <AcademicCapIcon className="h-6 w-6 text-primary" />
            <div>
              <h2 className="text-lg font-semibold text-gray-900">Assign Courses</h2>
              <p className="text-sm text-gray-600">{teacherName}</p>
            </div>
          </div>
          <button
            onClick={onClose}
            className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
          >
            <XMarkIcon className="h-5 w-5" />
          </button>
        </div>

        <div className="flex-1 overflow-y-auto px-6 py-4">
          {error && (
            <div className="mb-4 px-4 py-3 rounded-lg bg-red-50 border border-red-200 text-red-700 text-sm">
              {error}
            </div>
          )}

          {loading ? (
            <div className="flex items-center justify-center py-12">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary" />
            </div>
          ) : courses.length === 0 ? (
            <div className="text-center py-12 text-gray-500">
              No courses available. Create courses in Sanity Studio first.
            </div>
          ) : (
            <div className="space-y-2">
              {courses.map((course) => {
                const isSelected = selectedCourseIds.has(course._id)
                return (
                  <label
                    key={course._id}
                    className={`flex items-start space-x-3 p-4 rounded-lg border-2 cursor-pointer transition-colors ${
                      isSelected
                        ? 'border-primary bg-primary/5'
                        : 'border-gray-200 hover:border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    <input
                      type="checkbox"
                      checked={isSelected}
                      onChange={() => handleToggle(course._id)}
                      className="mt-1 h-4 w-4 text-primary focus:ring-primary border-gray-300 rounded"
                    />
                    <div className="flex-1 min-w-0">
                      <div className="font-medium text-gray-900">{course.title}</div>
                      {course.description && (
                        <div className="text-sm text-gray-600 mt-1 line-clamp-2">
                          {course.description}
                        </div>
                      )}
                      <div className="text-xs text-gray-500 mt-1">{course.slug}</div>
                    </div>
                  </label>
                )
              })}
            </div>
          )}
        </div>

        <div className="flex items-center justify-between px-6 py-4 border-t border-gray-200">
          <div className="text-sm text-gray-600">
            {selectedCourseIds.size} course{selectedCourseIds.size !== 1 ? 's' : ''} selected
          </div>
          <div className="flex items-center space-x-3">
            <button
              onClick={onClose}
              className="px-4 py-2 text-gray-700 hover:text-gray-900 rounded-lg hover:bg-gray-100"
            >
              Cancel
            </button>
            <button
              onClick={handleSave}
              disabled={saving || !hasChanges}
              className="px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-50"
            >
              {saving ? 'Saving...' : 'Save Changes'}
            </button>
          </div>
        </div>
      </div>
    </div>
  )
}
