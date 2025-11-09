import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { useData } from '../context/DataContext'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

export default function SecretAdminPage() {
  const { isAdmin, logout } = useAdmin()
  const { species, resetToDefault } = useData()
  const [showAdminPanel, setShowAdminPanel] = useState(false)

  const handleResetData = () => {
    if (confirm('⚠️ Are you sure you want to reset all species data to default?\n\nThis will permanently delete all your edits and cannot be undone!')) {
      resetToDefault()
      alert('✅ Species data has been reset to default!')
    }
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <AdminLogin isVisible={true} onClose={() => window.history.back()} />
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 p-4">
      <div className="max-w-6xl mx-auto">
        {/* Header Card */}
        <div className="group relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-2xl mb-8 overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/10 via-blue-500/10 to-purple-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="relative z-10 p-8">
            <div className="flex items-center justify-between">
              <div>
                <h1 className="text-4xl font-bold bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                  🔒 Admin Dashboard
                </h1>
                <p className="text-gray-600 dark:text-gray-300 text-lg">
                  Secure biodiversity management system for Mati City
                </p>
              </div>
              <button
                onClick={logout}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-rotate-1 active:scale-95"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <span className="relative z-10">🚪 Logout</span>
              </button>
            </div>
          </div>
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-6 mb-8">
          {/* Stats Row */}
          <div className="grid gap-6 md:grid-cols-4">
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-emerald-500/20 to-green-500/20 border border-emerald-500/30 shadow-xl p-6">
              <div className="text-emerald-600 dark:text-emerald-300 text-sm font-semibold mb-2">Total Species</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">{species.length}</div>
            </div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 shadow-xl p-6">
              <div className="text-blue-600 dark:text-blue-300 text-sm font-semibold mb-2">Fauna</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {species.filter(s => s.category === 'fauna').length}
              </div>
            </div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 shadow-xl p-6">
              <div className="text-green-600 dark:text-green-300 text-sm font-semibold mb-2">Flora</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {species.filter(s => s.category === 'flora').length}
              </div>
            </div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 shadow-xl p-6">
              <div className="text-red-600 dark:text-red-300 text-sm font-semibold mb-2">At Risk</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {species.filter(s => ['EN', 'CR', 'VU'].includes(s.status)).length}
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid gap-6 md:grid-cols-2 lg:grid-cols-3">
          <div 
            onClick={() => setShowAdminPanel(true)}
            className="group cursor-pointer relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:rotate-1 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-blue-500/20 to-green-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">🌿</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Species Management</h2>
              <p className="text-gray-600 dark:text-gray-300">Add, edit, and manage biodiversity data with comprehensive CRUD operations</p>
              <div className="mt-4 flex items-center text-emerald-600 dark:text-emerald-400 font-semibold">
                <span>Manage Species</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div
            onClick={handleResetData}
            className="group cursor-pointer relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:rotate-1 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/20 via-red-500/20 to-yellow-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl mb-6 group-hover:scale-110 transition-transform duration-300">🔄</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Reset to Default</h2>
              <p className="text-gray-600 dark:text-gray-300">Restore all species data to the original defaults</p>
              <div className="mt-4 flex items-center text-orange-600 dark:text-orange-400 font-semibold">
                <span>Reset Data</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div className="group relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl opacity-60 cursor-not-allowed overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/10 via-pink-500/10 to-indigo-500/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mb-6">📊</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Analytics</h2>
              <p className="text-gray-600 dark:text-gray-300">Coming soon - Usage statistics and reports</p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">🚧 Under Development</div>
            </div>
          </div>

          <div className="group relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl opacity-60 cursor-not-allowed overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-orange-500/10 via-red-500/10 to-yellow-500/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-orange-500 to-red-500 rounded-full flex items-center justify-center text-3xl mb-6">⚙️</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">System Settings</h2>
              <p className="text-gray-600 dark:text-gray-300">Configure system preferences and options</p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">🚧 Under Development</div>
            </div>
          </div>

          <div className="group relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl opacity-60 cursor-not-allowed overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/10 via-cyan-500/10 to-teal-500/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center text-3xl mb-6">👥</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">User Management</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage admin accounts and permissions</p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">🚧 Under Development</div>
            </div>
          </div>

          <div className="group relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl opacity-60 cursor-not-allowed overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/10 via-violet-500/10 to-purple-500/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-indigo-500 to-violet-500 rounded-full flex items-center justify-center text-3xl mb-6">🗂️</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Media Library</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage images and media assets</p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">🚧 Under Development</div>
            </div>
          </div>

          <div className="group relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl opacity-60 cursor-not-allowed overflow-hidden p-8">
            <div className="absolute inset-0 bg-gradient-to-br from-rose-500/10 via-pink-500/10 to-fuchsia-500/10" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center text-3xl mb-6">📋</div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Content Review</h2>
              <p className="text-gray-600 dark:text-gray-300">Review and moderate submitted content</p>
              <div className="mt-4 text-sm text-gray-500 dark:text-gray-400 font-medium">🚧 Under Development</div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <AdminPanel isVisible={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
    </div>
  )
}