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
  FaSignOutAlt,
  FaChartLine,
  FaPaw,
  FaSeedling,
  FaExclamationTriangle
} from 'react-icons/fa'
import { HiSparkles, HiShieldCheck, HiExclamationTriangle, HiHome, HiArrowRight } from 'react-icons/hi2'

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
              <HiExclamationTriangle className="w-12 h-12 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-4">
              <HiShieldCheck className="inline w-6 h-6 mr-2" />Admin Access Restricted
            </h2>
            <p className="text-gray-600 dark:text-gray-300 mb-6 leading-relaxed">
              For security and optimal performance, the admin panel is only accessible from desktop computers. 
              Please use a desktop device to manage the biodiversity database.
            </p>
            <button
              onClick={() => window.location.href = '/'}
              className="w-full bg-gradient-to-r from-emerald-500 to-blue-500 hover:from-emerald-600 hover:to-blue-600 text-white font-bold py-3 px-6 rounded-2xl transition-all duration-300 hover:scale-105 shadow-lg flex items-center justify-center gap-2"
            >
              <HiHome className="w-5 h-5" />
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
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900 p-4">
      <div className="max-w-7xl mx-auto">
        {/* Header Card */}
        <div className="bg-white dark:bg-slate-800 rounded-lg shadow-md mb-6 p-6">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <HiShieldCheck className="w-7 h-7 text-white" />
              </div>
              <div>
                <h1 className="text-3xl font-bold text-gray-900 dark:text-white">
                  Admin Dashboard
                </h1>
              </div>
            </div>
            <p className="text-gray-600 dark:text-gray-400 flex items-center gap-2 ml-15">
              <FaLeaf className="w-4 h-4 text-emerald-500" />
              Biodiversity management system for Mati City
            </p>
                {loading && (
                  <div className="mt-3 flex items-center gap-2 text-blue-600 dark:text-blue-400 text-sm ml-15">
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-600 border-t-transparent"></div>
                    <span>Loading data...</span>
                  </div>
                )}
        </div>

        {/* Dashboard Grid */}
        <div className="grid gap-4 mb-6">
          {/* Stats Row */}
          <div className="grid gap-4 md:grid-cols-4">
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 border-l-4 border-emerald-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-emerald-600 dark:text-emerald-400 text-xs font-semibold uppercase">Total Species</div>
                <FaChartLine className="text-emerald-500 text-lg" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-16 rounded"></div>
                ) : (
                  species.length
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 border-l-4 border-blue-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-blue-600 dark:text-blue-400 text-xs font-semibold uppercase">Fauna</div>
                <FaPaw className="text-blue-500 text-lg" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  species.filter(s => s.category === 'fauna').length
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 border-l-4 border-green-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-green-600 dark:text-green-400 text-xs font-semibold uppercase">Flora</div>
                <FaSeedling className="text-green-500 text-lg" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  species.filter(s => s.category === 'flora').length
                )}
              </div>
            </div>
            <div className="bg-white dark:bg-slate-800 rounded-lg shadow p-5 border-l-4 border-red-500">
              <div className="flex items-center justify-between mb-2">
                <div className="text-red-600 dark:text-red-400 text-xs font-semibold uppercase">At Risk</div>
                <FaExclamationTriangle className="text-red-500 text-lg" />
              </div>
              <div className="text-3xl font-bold text-gray-900 dark:text-white">
                {loading ? (
                  <div className="animate-pulse bg-gray-300 dark:bg-gray-600 h-8 w-12 rounded"></div>
                ) : (
                  species.filter(s => ['EN', 'CR', 'VU'].includes(s.status)).length
                )}
              </div>
            </div>
          </div>

          {/* Action Cards */}
          <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <div 
            onClick={() => setShowAdminPanel(true)}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-emerald-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-emerald-500 rounded-lg flex items-center justify-center">
                <FaLeaf className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Species Management</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Add, edit, and manage biodiversity data</p>
            <div className="flex items-center text-emerald-600 dark:text-emerald-400 text-sm font-semibold">
              <span>Manage Species</span>
              <HiArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setShowGISManager(true)}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-blue-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-blue-500 rounded-lg flex items-center justify-center">
                <FaMap className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">Map Manager</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">Add or remove conservation map markers</p>
            <div className="flex items-center text-blue-600 dark:text-blue-400 text-sm font-semibold">
              <span>Manage Map</span>
              <HiArrowRight className="w-4 h-4 ml-1" />
            </div>
          </div>

          <div 
            onClick={() => setShowFeedbacksViewer(true)}
            className="bg-white dark:bg-slate-800 rounded-lg shadow p-6 hover:shadow-lg transition-shadow cursor-pointer border border-gray-200 dark:border-gray-700 hover:border-purple-500"
          >
            <div className="flex items-center gap-3 mb-4">
              <div className="w-12 h-12 bg-purple-500 rounded-lg flex items-center justify-center">
                <FaComments className="text-white text-xl" />
              </div>
              <h2 className="text-xl font-bold text-gray-900 dark:text-white">User Feedbacks</h2>
            </div>
            <p className="text-gray-600 dark:text-gray-400 text-sm mb-3">View and manage user feedback submissions</p>
            <div className="flex items-center text-purple-600 dark:text-purple-400 text-sm font-semibold">
              <span>View Feedbacks</span>
              <HiArrowRight className="w-4 h-4 ml-1" />
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