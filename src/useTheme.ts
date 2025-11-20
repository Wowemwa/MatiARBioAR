import { useCallback, useEffect, useState } from 'react'

// Simple theme (light/dark) management with localStorage persistence.
// Hook returns current theme and a toggle function. It also applies the
// 'dark' class to document.documentElement so Tailwind's dark variants work.
export default function useTheme() {
  const [isMobile, setIsMobile] = useState(false)
  
  const [theme, setTheme] = useState<'light' | 'dark'>(() => {
    if (typeof window === 'undefined') return 'light'
    
    // Check if user is on mobile
    const mobileCheck = window.innerWidth <= 768 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    setIsMobile(mobileCheck)
    
    if (mobileCheck) {
      // Mobile: Use time-based theme
      const now = new Date()
      const hour = now.getHours()
      // Day mode: 6 AM to 6 PM, Night mode: 6 PM to 6 AM
      return (hour >= 6 && hour < 18) ? 'light' : 'dark'
    } else {
      // Desktop: Check stored preference or system preference
      const stored = window.localStorage.getItem('theme') as 'light' | 'dark' | null
      if (stored) return stored
      // prefer system
      const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches
      return prefersDark ? 'dark' : 'light'
    }
  })

  // Apply class to <html>
  useEffect(() => {
    if (typeof document === 'undefined') return
    const root = document.documentElement
    if (theme === 'dark') {
      root.classList.add('dark')
      document.body.classList.add('dark')
    } else {
      root.classList.remove('dark')
      document.body.classList.remove('dark')
    }
    
    // Only save to localStorage on desktop (not mobile with auto-switching)
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) {
      window.localStorage.setItem('theme', theme)
    }
  }, [theme])

  // Listen to system changes if user hasn't explicitly chosen yet (desktop only)
  useEffect(() => {
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    
    if (isMobile) {
      // Mobile: Auto-update theme based on time every minute
      const updateThemeBasedOnTime = () => {
        const now = new Date()
        const hour = now.getHours()
        const newTheme = (hour >= 6 && hour < 18) ? 'light' : 'dark'
        setTheme(newTheme)
      }
      
      // Update immediately
      updateThemeBasedOnTime()
      
      // Update every minute
      const interval = setInterval(updateThemeBasedOnTime, 60000)
      
      return () => clearInterval(interval)
    } else {
      // Desktop: Listen to system preference changes
      const mq = window.matchMedia('(prefers-color-scheme: dark)')
      const listener = (e: MediaQueryListEvent) => {
        const stored = window.localStorage.getItem('theme')
        if (!stored) setTheme(e.matches ? 'dark' : 'light')
      }
      mq.addEventListener('change', listener)
      return () => mq.removeEventListener('change', listener)
    }
  }, [])

  const toggleTheme = useCallback(() => {
    // Only allow manual toggle on desktop
    const isMobile = window.innerWidth <= 768 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)
    if (!isMobile) {
      setTheme(t => t === 'dark' ? 'light' : 'dark')
    }
  }, [])

  return { theme, toggleTheme, isMobile }
}