'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'

export default function AdminLogin() {
  const router = useRouter()
  const [credentials, setCredentials] = useState({ username: '', password: '' })
  const [error, setError] = useState('')
  const [loading, setLoading] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setError('')
    setLoading(true)

    try {
      const response = await fetch('/api/admin/auth', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(credentials),
      })

      const data = await response.json()

      if (response.ok) {
        // Store auth token
        localStorage.setItem('admin_token', data.token)
        localStorage.setItem('admin_session', JSON.stringify({
          username: data.username,
          loginTime: new Date().toISOString(),
        }))
        router.push('/admin/dashboard')
      } else {
        setError(data.message || 'Invalid credentials')
      }
    } catch {
      setError('Login failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-primary via-purple-600 to-blue-700 flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/20"></div>
      
      <div className="relative w-full max-w-md">
        <div className="bg-white/95 backdrop-blur-md rounded-2xl shadow-2xl p-8">
          {/* Logo */}
          <div className="flex justify-center mb-8">
            <div className="relative w-32 h-32">
              <Image
                src="/digitall_partner.png"
                alt="Hexadigitall Logo"
                fill
                className="object-contain"
              />
            </div>
          </div>

          <h1 className="text-3xl font-bold text-center text-gray-900 mb-2">
            Admin Portal
          </h1>
          <p className="text-center text-gray-600 mb-8">
            Sign in to access your dashboard
          </p>

          {error && (
            <div className="mb-6 p-4 bg-red-50 border border-red-200 rounded-lg text-red-700 text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Username
              </label>
              <input
                type="text"
                required
                value={credentials.username}
                onChange={(e) => setCredentials({ ...credentials, username: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Enter your username"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Password
              </label>
              <input
                type="password"
                required
                value={credentials.password}
                onChange={(e) => setCredentials({ ...credentials, password: e.target.value })}
                className="w-full px-4 py-3 border border-gray-300 rounded-lg focus:ring-2 focus:ring-primary focus:border-primary transition-colors"
                placeholder="Enter your password"
              />
            </div>

            <button
              type="submit"
              disabled={loading}
              className="w-full py-3 px-6 bg-gradient-to-r from-primary to-purple-600 text-white rounded-lg font-semibold hover:from-primary/90 hover:to-purple-600/90 transition-all duration-300 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg hover:shadow-xl"
            >
              {loading ? 'Signing in...' : 'Sign In'}
            </button>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200">
            <p className="text-center text-sm text-gray-500">
              Protected admin area • Unauthorized access is prohibited
            </p>
          </div>
        </div>

        <div className="mt-6 text-center text-white/80 text-sm">
          <p>Hexadigitall © {new Date().getFullYear()}</p>
        </div>
      </div>
    </div>
  )
}
