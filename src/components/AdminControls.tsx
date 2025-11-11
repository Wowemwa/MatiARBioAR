import { useState } from 'react'
import { useAdmin } from '../context/AdminContext'
import AdminLogin from './AdminLogin'
import AdminPanel from './AdminPanel'

export default function AdminControls() {
  const { isAdmin, isAdminPanelOpen, openAdminPanel, closeAdminPanel, logout } = useAdmin()
  const [showLogin, setShowLogin] = useState(false)

  if (isAdmin) {
    return (
      <>
        <div className="fixed top-4 right-4 z-40 flex gap-2">
          <button
            onClick={openAdminPanel}
            className="px-4 py-2 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm"
          >
            Species Admin
          </button>
          <button
            onClick={() => logout()}
            className="px-4 py-2 bg-red-500 text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm hover:bg-red-600"
          >
            Logout
          </button>
        </div>
        
        <AdminPanel isVisible={isAdminPanelOpen} onClose={closeAdminPanel} />
      </>
    )
  }

  return (
    <>
      <div className="fixed top-4 right-4 z-40">
        <button
          onClick={() => setShowLogin(true)}
          className="px-4 py-2 bg-gray-800/80 backdrop-blur-sm text-white rounded-xl font-semibold shadow-lg hover:shadow-xl transition-all duration-300 text-sm hover:bg-gray-700/80"
        >
          Admin
        </button>
      </div>
      
      <AdminLogin isVisible={showLogin} onClose={() => setShowLogin(false)} />
    </>
  )
}