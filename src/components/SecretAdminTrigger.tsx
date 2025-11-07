import { useEffect, useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { useAdmin } from '../context/AdminContext'
import AdminLogin from './AdminLogin'

/**
 * Secret Admin Trigger - Backdoor Access
 * 
 * Activation methods:
 * 1. Press Ctrl+Shift+A (Windows/Linux) or Cmd+Shift+A (Mac)
 * 2. Type the secret code: "matiadmin" anywhere on the page
 * 3. Navigate directly to /secret-admin-portal-2024
 * 
 * This component is invisible and has no UI presence on the public site.
 */
export default function SecretAdminTrigger() {
  const [showLogin, setShowLogin] = useState(false)
  const [keyBuffer, setKeyBuffer] = useState('')
  const navigate = useNavigate()
  const { isAdmin, openAdminPanel } = useAdmin()

  useEffect(() => {
    const SECRET_CODE = 'matiadmin'
    const SECRET_CODE_ALT = 'admin123'
    let buffer = ''

    const handleKeyDown = (e: KeyboardEvent) => {
      // Method 1: Keyboard shortcut Ctrl+Shift+A or Cmd+Shift+A
      if ((e.ctrlKey || e.metaKey) && e.shiftKey && e.key.toLowerCase() === 'a') {
        e.preventDefault()
        console.log('🔐 Secret admin shortcut triggered')
        setShowLogin(true)
        return
      }

      // Method 2: Secret code typing
      if (e.key.length === 1) {
        buffer += e.key.toLowerCase()
        
        // Keep buffer manageable
        if (buffer.length > 20) {
          buffer = buffer.slice(-20)
        }

        // Check for secret codes
        if (buffer.endsWith(SECRET_CODE) || buffer.endsWith(SECRET_CODE_ALT)) {
          console.log('🔐 Secret code detected')
          setShowLogin(true)
          buffer = '' // Reset buffer
        }
      }
    }

    // Method 3: Triple click on logo (handled elsewhere)
    document.addEventListener('keydown', handleKeyDown)

    return () => {
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [])

  // Auto-open admin panel if already logged in and navigating to admin route
  useEffect(() => {
    if (isAdmin && window.location.pathname === '/secret-admin-portal-2024') {
      navigate('/admin')
    }
  }, [isAdmin, navigate])

  return (
    <>
      {showLogin && !isAdmin && (
        <AdminLogin 
          isVisible={true} 
          onClose={() => setShowLogin(false)} 
        />
      )}
    </>
  )
}
