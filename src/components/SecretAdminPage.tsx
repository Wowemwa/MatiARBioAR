import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import { useData } from '../context/DataContext'
import { useDeviceDetection } from '../context/DeviceContext'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'
import UserManagement from './UserManagement'
import AdminGISManager from './AdminGISManager'
import AdminFeedbacksViewer from './AdminFeedbacksViewer'
import { 
  FaLeaf, 
  FaMap, 
  FaComments, 
  FaUsers, 
  FaSignOutAlt 
} from 'react-icons/fa'

export default function SecretAdminPage() {
  const { isAdmin, logout } = useAdmin()
  const { species, loading } = useData()
  const { isMobileView } = useDeviceDetection()
  const [showAdminPanel, setShowAdminPanel] = useState(false)
  const [showUserManagement, setShowUserManagement] = useState(false)
  const [showGISManager, setShowGISManager] = useState(false)
  const [showFeedbacksViewer, setShowFeedbacksViewer] = useState(false)

  // Block mobile access to admin panel
  if (isMobileView) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <div className="max-w-md mx-auto text-center">
          <div className="bg-white dark:bg-slate-800 rounded-3xl shadow-2xl p-8 border border-gray-200 dark:border-gray-700">
            <div className="w-20 h-20 bg-gradient-to-r from-red-500 to-pink-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <svg className="w-10 h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
              </svg>
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              🚫 Admin Access Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              For security and optimal performance, the admin panel is only accessible from desktop computers. 
              Please use a desktop device to manage the biodiversity database.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg"
            >
              Return to Home
            </button>
          </div>
        </div>
      </div>
    )
  }

  if (!isAdmin) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-sky-100 via-white to-emerald-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 flex items-center justify-center p-4">
        <AdminLogin 
          isVisible={true} 
          onClose={() => {
            // Navigate to home page when cancel is clicked
            window.location.href = '/'
          }} 
        />
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
                {loading && (
                  <div className="mt-4 flex items-center gap-2 text-blue-600 dark:text-blue-400">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span className="text-sm font-medium">Loading biodiversity data...</span>
                  </div>
                )}
              </div>
              <button
                onClick={() => logout()}
                className="group relative overflow-hidden bg-gradient-to-r from-red-500 to-pink-500 hover:from-red-600 hover:to-pink-600 text-white font-bold px-6 py-3 rounded-2xl shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-rotate-1 active:scale-95 flex items-center gap-2"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <FaSignOutAlt className="relative z-10 w-5 h-5" />
                <span className="relative z-10">Logout</span>
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
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-16 rounded"></div>
                ) : (
                  species.length
                )}
              </div>
            </div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-blue-500/20 to-cyan-500/20 border border-blue-500/30 shadow-xl p-6">
              <div className="text-blue-600 dark:text-blue-300 text-sm font-semibold mb-2">Fauna</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  species.filter(s => s.category === 'fauna').length
                )}
              </div>
            </div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-green-500/20 to-teal-500/20 border border-green-500/30 shadow-xl p-6">
              <div className="text-green-600 dark:text-green-300 text-sm font-semibold mb-2">Flora</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  species.filter(s => s.category === 'flora').length
                )}
              </div>
            </div>
            <div className="relative rounded-2xl backdrop-blur-xl bg-gradient-to-br from-red-500/20 to-orange-500/20 border border-red-500/30 shadow-xl p-6">
              <div className="text-red-600 dark:text-red-300 text-sm font-semibold mb-2">At Risk</div>
              <div className="text-4xl font-black text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  species.filter(s => ['EN', 'CR', 'VU'].includes(s.status)).length
                )}
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
              <div className="w-16 h-16 bg-gradient-to-r from-emerald-500 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaLeaf className="text-white text-3xl" />
              </div>
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
            onClick={() => setShowGISManager(true)}
            className="group cursor-pointer relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:rotate-1 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/20 via-cyan-500/20 to-teal-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaMap className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">Interactive Map Manager</h2>
              <p className="text-gray-600 dark:text-gray-300">Add or remove markers on the conservation map</p>
              <div className="mt-4 flex items-center text-blue-600 dark:text-blue-400 font-semibold">
                <span>Manage Map</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setShowFeedbacksViewer(true)}
            className="group cursor-pointer relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:rotate-1 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-purple-500/20 via-pink-500/20 to-rose-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-purple-500 to-pink-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaComments className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">User Feedbacks</h2>
              <p className="text-gray-600 dark:text-gray-300">View and manage feedback submissions from users</p>
              <div className="mt-4 flex items-center text-purple-600 dark:text-purple-400 font-semibold">
                <span>View Feedbacks</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>

          <div 
            onClick={() => setShowUserManagement(true)}
            className="group cursor-pointer relative rounded-3xl backdrop-blur-xl bg-white/85 dark:bg-slate-800/75 border border-white/40 dark:border-white/20 shadow-xl hover:shadow-2xl transition-all duration-700 hover:-translate-y-2 hover:rotate-1 overflow-hidden p-8"
          >
            <div className="absolute inset-0 bg-gradient-to-br from-cyan-500/20 via-blue-500/20 to-emerald-500/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10">
              <div className="w-16 h-16 bg-gradient-to-r from-cyan-500 to-blue-500 rounded-full flex items-center justify-center mb-6 group-hover:scale-110 transition-transform duration-300">
                <FaUsers className="text-white text-3xl" />
              </div>
              <h2 className="text-2xl font-bold text-gray-800 dark:text-gray-100 mb-3">User Management</h2>
              <p className="text-gray-600 dark:text-gray-300">Manage team members displayed on the About page</p>
              <div className="mt-4 flex items-center text-cyan-600 dark:text-cyan-400 font-semibold">
                <span>Manage Team</span>
                <svg className="w-5 h-5 ml-2 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </div>
            </div>
          </div>
        </div>
        </div>
      </div>

      <AdminPanel isVisible={showAdminPanel} onClose={() => setShowAdminPanel(false)} />
      <UserManagement isVisible={showUserManagement} onClose={() => setShowUserManagement(false)} />
      <AdminGISManager isVisible={showGISManager} onClose={() => setShowGISManager(false)} />
      <AdminFeedbacksViewer isVisible={showFeedbacksViewer} onClose={() => setShowFeedbacksViewer(false)} />
    </div>
  )
}