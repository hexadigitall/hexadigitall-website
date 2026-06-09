'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { ArrowLeftIcon, UserGroupIcon, AcademicCapIcon, CheckCircleIcon } from '@heroicons/react/24/outline'

interface Student {
  _id: string
  name: string
  email: string
  username: string
}

interface LabDef {
  _id: string
  title: string
  difficulty: string
}

interface Assignment {
  id: string
  lab_definition_id: string
  student_id: string
  status: string
  grade: number | null
  grade_max: number | null
  started_at: string | null
  completed_at: string | null
  created_at: string
}

const statusBadge: Record<string, string> = {
  not_started: 'bg-slate-800 text-slate-400',
  in_progress: 'bg-blue-900/50 text-blue-300',
  completed: 'bg-emerald-900/50 text-emerald-300',
  expired: 'bg-amber-900/50 text-amber-300',
  failed: 'bg-red-900/50 text-red-300',
}

export default function StudentProgressPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [students, setStudents] = useState<Student[]>([])
  const [labDefs, setLabDefs] = useState<LabDef[]>([])
  const [assignments, setAssignments] = useState<Assignment[]>([])

  useEffect(() => {
    const token = localStorage.getItem('admin_token')
    if (!token) { router.push('/teacher/login'); return }
    loadData(token)
  }, [router])

  async function loadData(token: string) {
    try {
      const [studentsRes, labsRes, assignRes] = await Promise.all([
        fetch('/api/sim/students', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/sim/labs', {
          headers: { Authorization: `Bearer ${token}` },
        }),
        fetch('/api/sim/assignments', {
          headers: { Authorization: `Bearer ${token}` },
        }),
      ])

      if (studentsRes.ok) {
        const d = await studentsRes.json()
        setStudents(d.data || [])
      }
      if (labsRes.ok) {
        const d = await labsRes.json()
        setLabDefs(d.data || [])
      }
      if (assignRes.ok) {
        const d = await assignRes.json()
        setAssignments(d.data || [])
      }
    } catch {
      /* silent */
    } finally {
      setLoading(false)
    }
  }

  function getAssignment(studentId: string, labDefId: string): Assignment | undefined {
    return assignments.find(a => a.student_id === studentId && a.lab_definition_id === labDefId)
  }

  function getStats(studentId: string) {
    const studentAssignments = assignments.filter(a => a.student_id === studentId)
    const completed = studentAssignments.filter(a => a.status === 'completed').length
    const inProgress = studentAssignments.filter(a => a.status === 'in_progress').length
    const totalGrade = studentAssignments.reduce((sum, a) => sum + (a.grade || 0), 0)
    const totalMax = studentAssignments.reduce((sum, a) => sum + (a.grade_max || 0), 0)
    return { total: studentAssignments.length, completed, inProgress, totalGrade, totalMax }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-[#f5f5f7] dark:bg-slate-950">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-teal-600" />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-[#f5f5f7] dark:bg-slate-950">
      <div className="bg-gradient-to-br from-teal-900 via-teal-800 to-cyan-900 dark:from-slate-950 dark:via-teal-950 dark:to-slate-900">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          <div className="flex items-center gap-4">
            <Link href="/teacher/labs" className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white transition-colors">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <div>
              <h1 className="text-2xl font-bold text-white">Student Lab Progress</h1>
              <p className="text-sm text-white/70 mt-1">
                {students.length} students · {labDefs.length} labs · {assignments.length} assignments
              </p>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {students.length === 0 ? (
          <div className="text-center py-16">
            <div className="w-20 h-20 bg-teal-50 dark:bg-teal-950/20 rounded-3xl flex items-center justify-center mx-auto mb-5">
              <UserGroupIcon className="h-10 w-10 text-teal-400" />
            </div>
            <h2 className="text-xl font-bold text-gray-900 dark:text-slate-100 mb-2">No Students Yet</h2>
            <p className="text-gray-500 dark:text-slate-400 max-w-md mx-auto">
              Students will appear here once they register and start working on lab simulations.
            </p>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-slate-800">
                  <th className="text-left py-3 px-4 text-slate-400 font-medium">Student</th>
                  {labDefs.map(lab => (
                    <th key={lab._id} className="text-center py-3 px-3 text-slate-400 font-medium min-w-[100px]">
                      <div className="text-xs truncate max-w-[100px] mx-auto" title={lab.title}>
                        {lab.title}
                      </div>
                    </th>
                  ))}
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Progress</th>
                  <th className="text-center py-3 px-4 text-slate-400 font-medium">Grade</th>
                </tr>
              </thead>
              <tbody>
                {students.map(student => {
                  const stats = getStats(student._id)
                  return (
                    <tr key={student._id} className="border-b border-slate-800/50 hover:bg-slate-900/50 transition-colors">
                      <td className="py-3 px-4">
                        <div className="text-slate-200 font-medium">{student.name || student.username}</div>
                        <div className="text-xs text-slate-500">{student.email}</div>
                      </td>
                      {labDefs.map(lab => {
                        const assignment = getAssignment(student._id, lab._id)
                        return (
                          <td key={lab._id} className="text-center py-3 px-3">
                            {assignment ? (
                              <div className="flex flex-col items-center gap-1">
                                <span className={`inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-medium ${statusBadge[assignment.status] || statusBadge.not_started}`}>
                                  {assignment.status === 'completed' && <CheckCircleIcon className="h-3 w-3" />}
                                  {assignment.status.replace('_', ' ')}
                                </span>
                                {assignment.grade !== null && (
                                  <span className="text-[10px] text-slate-500">
                                    {assignment.grade}/{assignment.grade_max}
                                  </span>
                                )}
                              </div>
                            ) : (
                              <span className="text-slate-600 text-[10px]">—</span>
                            )}
                          </td>
                        )
                      })}
                      <td className="text-center py-3 px-4">
                        <div className="flex items-center justify-center gap-2">
                          <div className="flex gap-1 text-xs">
                            <span className="text-emerald-400">{stats.completed}</span>
                            <span className="text-slate-600">/</span>
                            <span className="text-blue-400">{stats.inProgress}</span>
                            <span className="text-slate-600">/</span>
                            <span className="text-slate-500">{stats.total}</span>
                          </div>
                        </div>
                      </td>
                      <td className="text-center py-3 px-4">
                        {stats.totalMax > 0 ? (
                          <span className="text-sm font-medium text-slate-200">
                            {Math.round((stats.totalGrade / stats.totalMax) * 100)}%
                          </span>
                        ) : (
                          <span className="text-slate-600 text-xs">—</span>
                        )}
                      </td>
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        )}

        {students.length > 0 && (
          <div className="mt-6 p-4 rounded-xl bg-slate-900/50 border border-slate-800">
            <div className="flex items-center gap-2 text-xs text-slate-500">
              <AcademicCapIcon className="h-4 w-4" />
              <span>
                <strong className="text-slate-300">{students.length}</strong> students ·{' '}
                <strong className="text-slate-300">{assignments.filter(a => a.status === 'completed').length}</strong> completed assignments ·{' '}
                <strong className="text-slate-300">{assignments.filter(a => a.status === 'in_progress').length}</strong> in progress
              </span>
            </div>
          </div>
        )}
      </div>
    </div>
  )
}
