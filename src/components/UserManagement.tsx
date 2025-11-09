import { useState } from 'react'
import AdminTeam from './AdminTeam'
import { CancelIcon } from './Icons'

interface UserManagementProps {
  isVisible: boolean
  onClose: () => void
}

export default function UserManagement({ isVisible, onClose }: UserManagementProps) {
  const [activeTab, setActiveTab] = useState<'team'>('team')

  if (!isVisible) return null

  return (
    <div className="fixed inset-0 bg-black/60 backdrop-blur-md z-50 flex items-center justify-center p-2">
      <div className="group relative rounded-3xl backdrop-blur-xl bg-white/90 dark:bg-slate-800/90 border border-white/40 dark:border-white/20 shadow-2xl w-full max-w-[92vw] h-[93vh] overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-cyan-500/5 to-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
        
        {/* Header */}
        <div className="relative z-10 bg-gradient-to-r from-blue-500 via-cyan-500 to-emerald-500 text-white p-8">
          <div className="flex items-center justify-between">
            <div>
              <h2 className="text-3xl font-bold mb-2">👥 User Management</h2>
              <p className="text-white/90 text-lg">Manage team members and user information</p>
            </div>
            <button
              type="button"
              onClick={onClose}
              className="group relative overflow-hidden bg-white/20 hover:bg-white/30 p-3 rounded-2xl transition-all duration-300 hover:scale-110 hover:-rotate-12"
            >
              <CancelIcon className="w-6 h-6 transition-transform duration-300 group-hover:rotate-90" />
            </button>
          </div>

          {/* Tabs */}
          <div className="flex gap-2 mt-6">
            <button
              onClick={() => setActiveTab('team')}
              className={`px-6 py-3 rounded-xl font-semibold transition-all ${
                activeTab === 'team'
                  ? 'bg-white text-blue-600'
                  : 'bg-white/10 text-white hover:bg-white/20'
              }`}
            >
              👥 Team Members
            </button>
            {/* Future tabs can be added here */}
          </div>
        </div>

        {/* Content Area */}
        <div className="relative z-10 p-8 overflow-y-auto h-[calc(100vh-240px)]">
          {activeTab === 'team' && <AdminTeam />}
        </div>
      </div>
    </div>
  )
}
