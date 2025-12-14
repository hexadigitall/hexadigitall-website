'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import AdminNavbar from '@/components/admin/AdminNavbar'
import {
  ArrowLeftIcon,
  PlusIcon,
  UsersIcon,
  CheckBadgeIcon,
  NoSymbolIcon,
  KeyIcon,
} from '@heroicons/react/24/outline'

interface User {
  _id: string
  username: string
  email: string
  name?: string
  role: 'admin' | 'teacher' | 'student'
  status: 'active' | 'suspended'
  createdAt?: string
}

const roleOptions: Array<{ label: string; value: User['role'] }> = [
  { label: 'Admin', value: 'admin' },
  { label: 'Teacher', value: 'teacher' },
  { label: 'Student', value: 'student' },
]

const statusColors: Record<User['status'], string> = {
  active: 'bg-green-100 text-green-800',
  suspended: 'bg-red-100 text-red-700',
}

export default function AdminUsersPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [currentUser, setCurrentUser] = useState('')
  const [users, setUsers] = useState<User[]>([])
  const [creating, setCreating] = useState(false)
  const [savingId, setSavingId] = useState<string | null>(null)
  const [feedback, setFeedback] = useState<{ type: 'success' | 'error'; message: string } | null>(null)
  const [roleEdits, setRoleEdits] = useState<Record<string, User['role']>>({})
  const [form, setForm] = useState({
    name: '',
    username: '',
    email: '',
    role: 'teacher' as User['role'],
    status: 'active' as User['status'],
    password: '',
  })

  const isEmptyState = users.length === 0

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')

      if (!token || !session) {
        router.push('/admin/login')
        return
      }

      try {
        const res = await fetch('/api/admin/auth', {
          headers: { Authorization: `Bearer ${token}` },
        })

        if (res.ok) {
          const data = await res.json()
          setIsAuthenticated(true)
          setCurrentUser(data.username || JSON.parse(session).username)
          await loadUsers()
        } else {
          router.push('/admin/login')
        }
      } catch (error) {
        console.error('Auth check failed:', error)
        router.push('/admin/login')
      } finally {
        setLoading(false)
      }
    }

    void checkAuth()
  }, [router])

  const loadUsers = async () => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    try {
      const res = await fetch('/api/admin/users', {
        headers: { Authorization: `Bearer ${token}` },
      })
      if (res.status === 401 || res.status === 403) {
        router.push('/admin/login')
        return
      }
      const data = await res.json()
      setUsers(data.users || [])
      const mappedRoles: Record<string, User['role']> = {}
      ;(data.users || []).forEach((u: User) => {
        mappedRoles[u._id] = u.role
      })
      setRoleEdits(mappedRoles)
    } catch (error) {
      console.error('Failed to load users:', error)
      setFeedback({ type: 'error', message: 'Failed to load users' })
    }
  }

  const handleCreateUser = async (e: React.FormEvent) => {
    e.preventDefault()
    setFeedback(null)

    if (!form.username || !form.email || !form.password) {
      setFeedback({ type: 'error', message: 'Username, email, and password are required.' })
      return
    }

    if (form.password.length < 8) {
      setFeedback({ type: 'error', message: 'Password must be at least 8 characters.' })
      return
    }

    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    setCreating(true)
    try {
      const res = await fetch('/api/admin/users', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify(form),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'User created.' })
        setForm({ name: '', username: '', email: '', role: 'teacher', status: 'active', password: '' })
        await loadUsers()
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to create user.' })
      }
    } catch (error) {
      console.error('Create user failed:', error)
      setFeedback({ type: 'error', message: 'Failed to create user.' })
    } finally {
      setCreating(false)
    }
  }

  const handleStatusToggle = async (user: User) => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    if (user.username === currentUser && user.role === 'admin') {
      setFeedback({ type: 'error', message: 'You cannot suspend your own admin account.' })
      return
    }

    const nextStatus = user.status === 'active' ? 'suspended' : 'active'
    setSavingId(user._id)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ status: nextStatus }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: `User ${nextStatus === 'active' ? 'activated' : 'suspended'}.` })
        await loadUsers()
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to update status.' })
      }
    } catch (error) {
      console.error('Status update failed:', error)
      setFeedback({ type: 'error', message: 'Failed to update status.' })
    } finally {
      setSavingId(null)
    }
  }

  const handleRoleSave = async (user: User) => {
    const nextRole = roleEdits[user._id] || user.role
    if (nextRole === user.role) {
      return
    }
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }
    if (user.username === currentUser && user.role === 'admin') {
      setFeedback({ type: 'error', message: 'You cannot change your own admin role.' })
      return
    }

    setSavingId(user._id)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ role: nextRole }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Role updated.' })
        await loadUsers()
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to update role.' })
      }
    } catch (error) {
      console.error('Role update failed:', error)
      setFeedback({ type: 'error', message: 'Failed to update role.' })
    } finally {
      setSavingId(null)
    }
  }

  const handleResetPassword = async (user: User) => {
    const token = localStorage.getItem('admin_token')
    if (!token) {
      router.push('/admin/login')
      return
    }

    const newPassword = window.prompt(`Set a new password for ${user.username}`)
    if (!newPassword) {
      return
    }
    if (newPassword.length < 8) {
      setFeedback({ type: 'error', message: 'Password must be at least 8 characters.' })
      return
    }

    setSavingId(user._id)
    setFeedback(null)
    try {
      const res = await fetch(`/api/admin/users/${user._id}`, {
        method: 'PATCH',
        headers: {
          'Content-Type': 'application/json',
          Authorization: `Bearer ${token}`,
        },
        body: JSON.stringify({ password: newPassword }),
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setFeedback({ type: 'success', message: 'Password reset.' })
        await loadUsers()
      } else {
        setFeedback({ type: 'error', message: data.message || 'Failed to reset password.' })
      }
    } catch (error) {
      console.error('Password reset failed:', error)
      setFeedback({ type: 'error', message: 'Failed to reset password.' })
    } finally {
      setSavingId(null)
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }

  if (!isAuthenticated) {
    return null
  }

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link
                href="/admin/dashboard"
                className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100"
              >
                <ArrowLeftIcon className="h-5 w-5" />
              </Link>
              <div>
                <h1 className="text-2xl font-bold text-gray-900">Users</h1>
                <p className="text-sm text-gray-600">Invite admins, teachers, and students.</p>
              </div>
            </div>
            <div className="hidden md:block">
              <Breadcrumbs
                items={[
                  { label: 'Admin', href: '/admin/dashboard' },
                  { label: 'Users' },
                ]}
              />
            </div>
          </div>
        </div>
      </header>

      <AdminNavbar />

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        {feedback && (
          <div
            className={`px-4 py-3 rounded-lg border ${
              feedback.type === 'success'
                ? 'bg-green-50 border-green-200 text-green-800'
                : 'bg-red-50 border-red-200 text-red-700'
            }`}
          >
            {feedback.message}
          </div>
        )}

        <section className="bg-white rounded-lg shadow-sm border border-gray-200 p-4 md:p-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center space-x-3">
              <UsersIcon className="h-6 w-6 text-primary" />
              <div>
                <h2 className="text-lg font-semibold text-gray-900">Add user</h2>
                <p className="text-sm text-gray-600">Create admin, teacher, or student accounts.</p>
              </div>
            </div>
            <button
              onClick={loadUsers}
              className="text-sm text-gray-600 hover:text-gray-900"
              title="Refresh"
            >
              Refresh
            </button>
          </div>

          <form onSubmit={handleCreateUser} className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Name</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.name}
                onChange={(e) => setForm({ ...form, name: e.target.value })}
                placeholder="Full name"
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Username</label>
              <input
                type="text"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.username}
                onChange={(e) => setForm({ ...form, username: e.target.value })}
                placeholder="username"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Email</label>
              <input
                type="email"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.email}
                onChange={(e) => setForm({ ...form, email: e.target.value })}
                placeholder="user@example.com"
                required
              />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Role</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.role}
                onChange={(e) => setForm({ ...form, role: e.target.value as User['role'] })}
              >
                {roleOptions.map((opt) => (
                  <option key={opt.value} value={opt.value}>
                    {opt.label}
                  </option>
                ))}
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Status</label>
              <select
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.status}
                onChange={(e) => setForm({ ...form, status: e.target.value as User['status'] })}
              >
                <option value="active">Active</option>
                <option value="suspended">Suspended</option>
              </select>
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Password</label>
              <input
                type="password"
                className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.password}
                onChange={(e) => setForm({ ...form, password: e.target.value })}
                placeholder="At least 8 characters"
                required
              />
            </div>
            <div className="md:col-span-2 lg:col-span-3 flex items-center justify-end space-x-3">
              <button
                type="submit"
                disabled={creating}
                className="inline-flex items-center gap-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors disabled:opacity-60"
              >
                <PlusIcon className="h-5 w-5" />
                <span>{creating ? 'Creating...' : 'Create user'}</span>
              </button>
            </div>
          </form>
        </section>

        <section className="bg-white rounded-lg shadow-sm border border-gray-200">
          <div className="flex items-center justify-between px-6 py-4 border-b border-gray-200">
            <div className="flex items-center space-x-3">
              <CheckBadgeIcon className="h-6 w-6 text-primary" />
              <h2 className="text-lg font-semibold text-gray-900">User directory</h2>
            </div>
            <span className="text-sm text-gray-600">{users.length} total</span>
          </div>

          {isEmptyState ? (
            <div className="p-6 text-center text-gray-500">No users yet. Create one above.</div>
          ) : (
            <div className="overflow-x-auto">
              <table className="min-w-full divide-y divide-gray-200">
                <thead className="bg-gray-50">
                  <tr>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">User</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Email</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Role</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Status</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Created</th>
                    <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">Actions</th>
                  </tr>
                </thead>
                <tbody className="bg-white divide-y divide-gray-200">
                  {users.map((user) => {
                    const isSelf = currentUser ? user.username === currentUser : false
                    const roleValue = roleEdits[user._id] || user.role
                    return (
                      <tr key={user._id} className="hover:bg-gray-50">
                        <td className="px-6 py-4 whitespace-nowrap">
                          <div className="text-sm font-medium text-gray-900">{user.name || user.username}</div>
                          <div className="text-xs text-gray-500">{user.username}</div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">{user.email}</td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                          <div className="flex items-center space-x-2">
                            <select
                              value={roleValue}
                              onChange={(e) =>
                                setRoleEdits((prev) => ({ ...prev, [user._id]: e.target.value as User['role'] }))
                              }
                              disabled={savingId === user._id || isSelf}
                              className="border border-gray-300 rounded-lg px-2 py-1 text-sm focus:ring-2 focus:ring-primary focus:border-transparent disabled:opacity-50"
                            >
                              {roleOptions.map((opt) => (
                                <option key={opt.value} value={opt.value}>
                                  {opt.label}
                                </option>
                              ))}
                            </select>
                            <button
                              type="button"
                              onClick={() => handleRoleSave(user)}
                              disabled={savingId === user._id || roleValue === user.role || isSelf}
                              className="text-sm text-primary hover:text-primary/80 disabled:opacity-50"
                            >
                              Save
                            </button>
                          </div>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap">
                          <span className={`px-3 py-1 rounded-full text-xs font-medium ${statusColors[user.status]}`}>
                            {user.status === 'active' ? 'Active' : 'Suspended'}
                          </span>
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-500">
                          {user.createdAt ? new Date(user.createdAt).toLocaleDateString() : '—'}
                        </td>
                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-700 space-x-3">
                          <button
                            type="button"
                            onClick={() => handleStatusToggle(user)}
                            disabled={savingId === user._id}
                            className="inline-flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
                          >
                            {user.status === 'active' ? (
                              <>
                                <NoSymbolIcon className="h-4 w-4" />
                                <span>Suspend</span>
                              </>
                            ) : (
                              <>
                                <CheckBadgeIcon className="h-4 w-4" />
                                <span>Activate</span>
                              </>
                            )}
                          </button>
                          <button
                            type="button"
                            onClick={() => handleResetPassword(user)}
                            disabled={savingId === user._id}
                            className="inline-flex items-center space-x-1 text-sm text-gray-700 hover:text-gray-900 disabled:opacity-50"
                          >
                            <KeyIcon className="h-4 w-4" />
                            <span>Reset password</span>
                          </button>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </section>
      </div>
    </div>
  )
}
