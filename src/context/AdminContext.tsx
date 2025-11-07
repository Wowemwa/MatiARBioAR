import { createContext, ReactNode, useContext, useEffect, useMemo, useState } from 'react'
import { storageService } from '../services/storage'
import { getAdminPassword } from '../utils/runtimeConfig'

type AdminContextValue = {
  isAdmin: boolean
  isAdminPanelOpen: boolean
  login: (credentials: { password: string }) => Promise<boolean>
  logout: () => void
  openAdminPanel: () => void
  closeAdminPanel: () => void
  lastLoginAt?: string
}

const STORAGE_KEY = 'mati-admin-mode:v1'

const AdminContext = createContext<AdminContextValue | undefined>(undefined)

interface AdminProviderProps {
  children: ReactNode
}

export function AdminProvider({ children }: AdminProviderProps) {
  const [isAdmin, setIsAdmin] = useState(false)
  const [isAdminPanelOpen, setIsAdminPanelOpen] = useState(false)
  const [lastLoginAt, setLastLoginAt] = useState<string | undefined>(undefined)

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY)
    if (stored) {
      try {
        const parsed = JSON.parse(stored) as { isAdmin: boolean; lastLoginAt?: string }
        if (parsed.isAdmin) {
          setIsAdmin(true)
          setLastLoginAt(parsed.lastLoginAt)
        }
      } catch (error) {
        console.warn('[AdminProvider] Failed to parse stored admin state', error)
        localStorage.removeItem(STORAGE_KEY)
      }
    }
  }, [])

  const login: AdminContextValue['login'] = async ({ password }) => {
    const expected = await getAdminPassword()

    if (!expected) {
      console.warn('[AdminProvider] Admin password is not configured. Provide VITE_ADMIN_PASS at build time or create /runtime-config.json')
      return false
    }

    const isValid = password === expected
    if (isValid) {
      const timestamp = new Date().toISOString()
      setIsAdmin(true)
      setLastLoginAt(timestamp)
      localStorage.setItem(STORAGE_KEY, JSON.stringify({ isAdmin: true, lastLoginAt: timestamp }))
      
      // 🔥 Log admin login to localStorage
      try {
        await storageService.logAdminLogin('admin')
        console.log('✅ Admin login logged')
      } catch (error) {
        console.warn('⚠️ Failed to log admin login:', error)
        // Continue even if logging fails
      }
    }
    return isValid
  }

  const logout = () => {
    setIsAdmin(false)
    setIsAdminPanelOpen(false)
    setLastLoginAt(undefined)
    localStorage.removeItem(STORAGE_KEY)
  }

  const openAdminPanel = () => {
    if (isAdmin) {
      setIsAdminPanelOpen(true)
    }
  }

  const closeAdminPanel = () => {
    setIsAdminPanelOpen(false)
  }

  const value = useMemo<AdminContextValue>(() => ({ 
    isAdmin, 
    isAdminPanelOpen,
    login, 
    logout, 
    openAdminPanel,
    closeAdminPanel,
    lastLoginAt 
  }), [isAdmin, isAdminPanelOpen, lastLoginAt])

  return <AdminContext.Provider value={value}>{children}</AdminContext.Provider>
}

export function useAdmin() {
  const context = useContext(AdminContext)
  if (!context) {
    throw new Error('useAdmin must be used within an AdminProvider')
  }
  return context
}
