import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'

interface AdminLoginProps {
  isVisible: boolean
  onClose: () => void
}

export default function AdminLogin({ isVisible, onClose }: AdminLoginProps) {
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [error, setError] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const { login } = useAdmin()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setIsLoading(true)
    setError('')

    try {
      const success = await login({ email, password })
      if (success) {
        setEmail('')
        setPassword('')
        onClose()
      } else {
        setError('Invalid email or password. Please try again.')
      }
    } catch (error) {
      setError('Login failed. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-4">
      <div className="group relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-md overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        <div className="relative z-10 p-8">
          <div className="text-center mb-8">
            <div className="w-20 h-20 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mx-auto mb-6 shadow-xl group-hover:scale-110 transition-transform duration-300">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 15v2m-6 4h12a2 2 0 002-2v-6a2 2 0 00-2-2H6a2 2 0 00-2 2v6a2 2 0 002 2zm10-10V7a4 4 0 00-8 0v4h8z" />
              </svg>
            </div>
            <h2 className="text-3xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
              🔐 Admin Access
            </h2>
            <p className="text-gray-600 dark:text-gray-300 text-lg">
              Enter your credentials to access the biodiversity management system
            </p>
          </div>

          <form onSubmit={handleSubmit} className="space-y-6">
            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                📧 Admin Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-lg font-medium"
                placeholder="Enter your admin email"
                required
                disabled={isLoading}
              />
            </div>

            <div>
              <label className="block text-sm font-bold text-gray-700 dark:text-gray-300 mb-3">
                🔑 Admin Password
              </label>
              <input
                type="password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                className="w-full px-5 py-4 border-2 border-gray-200 dark:border-gray-600 rounded-2xl bg-white/80 dark:bg-slate-700/80 backdrop-blur-xl text-gray-900 dark:text-gray-100 focus:ring-4 focus:ring-emerald-500/50 focus:border-emerald-500 transition-all duration-300 text-lg font-medium"
                placeholder="Enter your admin password"
                required
                disabled={isLoading}
              />
            </div>

            {error && (
              <div className="group relative overflow-hidden bg-gradient-to-r from-red-50 to-pink-50 dark:from-red-900/30 dark:to-pink-900/30 border-2 border-red-200 dark:border-red-800 rounded-2xl p-4">
                <div className="absolute inset-0 bg-gradient-to-r from-red-500/10 to-pink-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative flex items-center gap-3">
                  <div className="w-6 h-6 bg-red-500 rounded-full flex items-center justify-center text-white text-sm font-bold">!</div>
                  <p className="text-red-700 dark:text-red-300 font-semibold">{error}</p>
                </div>
              </div>
            )}

            <div className="flex gap-4">
              <button
                type="button"
                onClick={onClose}
                className="relative flex-1 px-6 py-4 border-2 border-gray-300 dark:border-gray-600 rounded-2xl font-semibold bg-white/70 dark:bg-slate-700/50 backdrop-blur-xl hover:bg-white/90 dark:hover:bg-slate-600/70 hover:border-gray-400 hover:shadow-xl transition-all duration-500 hover:scale-105 text-gray-700 dark:text-gray-300 z-10"
                disabled={isLoading}
              >
                ❌ Cancel
              </button>
              <button
                type="submit"
                className="relative overflow-hidden flex-1 bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-bold px-6 py-4 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed z-10"
                disabled={isLoading}
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">
                  {isLoading ? '⏳ Authenticating...' : '🚀 Login'}
                </span>
              </button>
            </div>
          </form>

          <div className="mt-8 pt-6 border-t border-gray-200/60 dark:border-gray-600/60">
            <div className="text-center">
              <p className="text-sm text-gray-500 dark:text-gray-400">
                🔐 Secure Admin Authentication System
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}