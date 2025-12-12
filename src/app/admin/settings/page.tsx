'use client'

import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Breadcrumbs from '@/components/admin/Breadcrumbs'
import { ArrowLeftIcon, KeyIcon, ShieldCheckIcon } from '@heroicons/react/24/outline'

export default function AdminSettingsPage() {
  const router = useRouter()
  const [loading, setLoading] = useState(true)
  const [isAuthenticated, setIsAuthenticated] = useState(false)
  const [username, setUsername] = useState('')
  const [form, setForm] = useState({ currentPassword: '', newPassword: '', confirmPassword: '' })
  const [status, setStatus] = useState<{ type: 'idle'|'success'|'error'; message?: string }>({ type: 'idle' })

  useEffect(() => {
    const checkAuth = async () => {
      const token = localStorage.getItem('admin_token')
      const session = localStorage.getItem('admin_session')
      if (!token || !session) {
        router.push('/admin/login')
        return
      }
      try {
        const res = await fetch('/api/admin/auth', { headers: { Authorization: `Bearer ${token}` } })
        if (res.ok) {
          const data = await res.json()
          setUsername(data.username || JSON.parse(session).username)
          setIsAuthenticated(true)
        } else {
          router.push('/admin/login')
        }
      } finally {
        setLoading(false)
      }
    }
    checkAuth()
  }, [router])

  const onSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setStatus({ type: 'idle' })
    if (!form.newPassword || form.newPassword.length < 8) {
      setStatus({ type: 'error', message: 'New password must be at least 8 characters.' })
      return
    }
    if (form.newPassword !== form.confirmPassword) {
      setStatus({ type: 'error', message: 'Passwords do not match.' })
      return
    }
    try {
      const token = localStorage.getItem('admin_token')
      const res = await fetch('/api/admin/settings/password', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Authorization: `Bearer ${token}` },
        body: JSON.stringify({ currentPassword: form.currentPassword, newPassword: form.newPassword })
      })
      const data = await res.json()
      if (res.ok && data.success) {
        setStatus({ type: 'success', message: 'Password updated successfully.' })
      } else {
        setStatus({ type: 'error', message: data.message || 'Failed to update password.' })
      }
    } catch (err) {
      setStatus({ type: 'error', message: 'Unexpected error.' })
    }
  }

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary" />
      </div>
    )
  }
  if (!isAuthenticated) return null

  return (
    <div className="min-h-screen bg-gray-50">
      <header className="bg-white shadow-sm border-b border-gray-200">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/admin/dashboard" className="p-2 text-gray-400 hover:text-gray-600 rounded-lg hover:bg-gray-100">
              <ArrowLeftIcon className="h-5 w-5" />
            </Link>
            <h1 className="text-2xl font-bold text-gray-900">Admin Settings</h1>
            <div className="hidden md:block">
              <Breadcrumbs items={[
                { label: 'Admin', href: '/admin/dashboard' },
                { label: 'Settings' },
              ]} />
            </div>
          </div>
        </div>
      </header>

      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
        <section className="bg-white rounded-xl shadow-sm border border-gray-200 p-6">
          <div className="flex items-center space-x-3 mb-4">
            <ShieldCheckIcon className="h-6 w-6 text-primary" />
            <h2 className="text-lg font-semibold text-gray-900">Security</h2>
          </div>
          <p className="text-sm text-gray-600 mb-6">Logged in as <span className="font-medium">{username}</span></p>

          <form onSubmit={onSubmit} className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Current password</label>
              <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.currentPassword} onChange={(e)=>setForm({...form, currentPassword: e.target.value})} placeholder="••••••••" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">New password</label>
              <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.newPassword} onChange={(e)=>setForm({...form, newPassword: e.target.value})} placeholder="At least 8 characters" />
            </div>
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Confirm new password</label>
              <input type="password" className="w-full border border-gray-300 rounded-lg px-3 py-2 focus:ring-2 focus:ring-primary focus:border-transparent"
                value={form.confirmPassword} onChange={(e)=>setForm({...form, confirmPassword: e.target.value})} placeholder="Repeat new password" />
            </div>

            {status.type === 'success' && (
              <div className="text-green-700 bg-green-50 border border-green-200 rounded-lg px-3 py-2">{status.message}</div>
            )}
            {status.type === 'error' && (
              <div className="text-red-700 bg-red-50 border border-red-200 rounded-lg px-3 py-2">{status.message}</div>
            )}

            <button type="submit" className="inline-flex items-center space-x-2 px-4 py-2 bg-primary text-white rounded-lg hover:bg-primary/90 transition-colors">
              <KeyIcon className="h-5 w-5" />
              <span>Update Password</span>
            </button>
          </form>
        </section>
      </div>
    </div>
  )
}
