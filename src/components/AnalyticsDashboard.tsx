import { CancelIcon } from './Icons'
import AdminAnalytics from './AdminAnalytics'

interface AnalyticsDashboardProps {
  isVisible: boolean
  onClose: () => void
}

export default function AnalyticsDashboard({ isVisible, onClose }: AnalyticsDashboardProps) {
  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2">
      <div className="group relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-[92vw] h-[85vh] sm:h-[90vh] lg:h-[93vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 via-pink-500/5 to-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-purple-500 via-pink-500 to-blue-500 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">📊 Analytics Dashboard</h2>
              <p className="text-white/90 text-lg">Monitor website performance and user engagement</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="group relative overflow-hidden bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12"
            >
              <CancelIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-8 overflow-y-auto h-[calc(100vh-200px)] sm:h-[calc(100vh-240px)] lg:h-[calc(100vh-280px)]">
          <AdminAnalytics />
        </div>
      </div>
    </div>
  )
}
