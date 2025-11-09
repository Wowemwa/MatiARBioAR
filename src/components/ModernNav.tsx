import { memo, useState, useEffect } from 'react'
import { Link, useLocation } from 'react-router-dom'
import { Menu, X, Leaf, MapPin, BookOpen, Sparkles } from 'lucide-react'
import useTheme from '../useTheme'

/**
 * Modern Navigation Component - Glassmorphism design with smooth animations
 */
const ModernNav = memo(function ModernNav() {
  const [isOpen, setIsOpen] = useState(false)
  const [isScrolled, setIsScrolled] = useState(false)
  const location = useLocation()
  const { theme, toggleTheme } = useTheme()

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20)
    }
    window.addEventListener('scroll', handleScroll)
    return () => window.removeEventListener('scroll', handleScroll)
  }, [])

  useEffect(() => {
    setIsOpen(false)
  }, [location])

  const navLinks = [
    { to: '/', label: 'Home', icon: Sparkles },
    { to: '/gis', label: 'Explore Map', icon: MapPin },
    { to: '/biodiversity', label: 'Species', icon: Leaf },
    { to: '/ar-demo', label: 'AR Demo', icon: BookOpen }
  ]

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <nav
        className={`fixed top-0 left-0 right-0 z-50 transition-all duration-500 ${
          isScrolled
            ? 'bg-white/80 dark:bg-slate-900/80 backdrop-blur-2xl shadow-xl border-b border-slate-200/50 dark:border-slate-700/50'
            : 'bg-transparent'
        }`}
      >
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-20">
            {/* Logo */}
            <Link
              to="/"
              className="flex items-center gap-3 group"
            >
              <div className="relative">
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-2xl blur-lg opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                <div className="relative w-12 h-12 bg-gradient-to-br from-blue-600 to-emerald-600 rounded-2xl flex items-center justify-center transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg">
                  <Leaf className="w-7 h-7 text-white" strokeWidth={2.5} />
                </div>
              </div>
              <div className="hidden sm:block">
                <div className="text-xl font-black text-slate-900 dark:text-white group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:from-blue-600 group-hover:to-emerald-500 group-hover:bg-clip-text transition-all duration-300">
                  Mati Biodiversity
                </div>
                <div className="text-xs font-semibold text-slate-500 dark:text-slate-400 tracking-wider">
                  Conservation Platform
                </div>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <div className="hidden md:flex items-center gap-2">
              {navLinks.map((link) => {
                const Icon = link.icon
                const active = isActive(link.to)
                return (
                  <Link
                    key={link.to}
                    to={link.to}
                    className={`group relative px-5 py-2.5 rounded-xl font-bold text-sm transition-all duration-300 ${
                      active
                        ? 'text-white'
                        : 'text-slate-700 dark:text-slate-200 hover:text-slate-900 dark:hover:text-white'
                    }`}
                  >
                    {active && (
                      <>
                        <div className="absolute inset-0 bg-gradient-to-r from-blue-600 to-emerald-600 rounded-xl" />
                        <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-xl blur-md opacity-50" />
                      </>
                    )}
                    {!active && (
                      <div className="absolute inset-0 bg-slate-100 dark:bg-slate-800 rounded-xl opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                    )}
                    <span className="relative flex items-center gap-2">
                      <Icon className="w-4 h-4" />
                      {link.label}
                    </span>
                  </Link>
                )
              })}

              {/* Theme Toggle */}
              <button
                onClick={toggleTheme}
                className="relative ml-2 p-3 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-all duration-300 group overflow-hidden"
                aria-label="Toggle theme"
              >
                <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="relative">
                  {theme === 'dark' ? (
                    <svg className="w-5 h-5 text-yellow-500 transform group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
                      <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                    </svg>
                  ) : (
                    <svg className="w-5 h-5 text-slate-700 transform group-hover:rotate-180 transition-transform duration-500" fill="currentColor" viewBox="0 0 20 20">
                      <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                    </svg>
                  )}
                </div>
              </button>
            </div>

            {/* Mobile Menu Button */}
            <button
              onClick={() => setIsOpen(!isOpen)}
              className="md:hidden relative p-2 rounded-xl bg-slate-100 dark:bg-slate-800 hover:bg-slate-200 dark:hover:bg-slate-700 transition-colors duration-300"
              aria-label="Toggle menu"
            >
              {isOpen ? (
                <X className="w-6 h-6 text-slate-700 dark:text-slate-200" />
              ) : (
                <Menu className="w-6 h-6 text-slate-700 dark:text-slate-200" />
              )}
            </button>
          </div>
        </div>

        {/* Mobile Menu */}
        <div
          className={`md:hidden overflow-hidden transition-all duration-500 ${
            isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
          }`}
        >
          <div className="px-4 pt-2 pb-6 space-y-2 bg-white/95 dark:bg-slate-900/95 backdrop-blur-2xl border-t border-slate-200/50 dark:border-slate-700/50">
            {navLinks.map((link) => {
              const Icon = link.icon
              const active = isActive(link.to)
              return (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm transition-all duration-300 ${
                    active
                      ? 'bg-gradient-to-r from-blue-600 to-emerald-600 text-white shadow-lg'
                      : 'text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-5 h-5" />
                  {link.label}
                </Link>
              )
            })}
            
            <button
              onClick={toggleTheme}
              className="w-full flex items-center gap-3 px-4 py-3 rounded-xl font-bold text-sm text-slate-700 dark:text-slate-200 hover:bg-slate-100 dark:hover:bg-slate-800 transition-all duration-300"
            >
              {theme === 'dark' ? (
                <>
                  <svg className="w-5 h-5 text-yellow-500" fill="currentColor" viewBox="0 0 20 20">
                    <path fillRule="evenodd" d="M10 2a1 1 0 011 1v1a1 1 0 11-2 0V3a1 1 0 011-1zm4 8a4 4 0 11-8 0 4 4 0 018 0zm-.464 4.95l.707.707a1 1 0 001.414-1.414l-.707-.707a1 1 0 00-1.414 1.414zm2.12-10.607a1 1 0 010 1.414l-.706.707a1 1 0 11-1.414-1.414l.707-.707a1 1 0 011.414 0zM17 11a1 1 0 100-2h-1a1 1 0 100 2h1zm-7 4a1 1 0 011 1v1a1 1 0 11-2 0v-1a1 1 0 011-1zM5.05 6.464A1 1 0 106.465 5.05l-.708-.707a1 1 0 00-1.414 1.414l.707.707zm1.414 8.486l-.707.707a1 1 0 01-1.414-1.414l.707-.707a1 1 0 011.414 1.414zM4 11a1 1 0 100-2H3a1 1 0 000 2h1z" clipRule="evenodd" />
                  </svg>
                  Light Mode
                </>
              ) : (
                <>
                  <svg className="w-5 h-5 text-slate-700" fill="currentColor" viewBox="0 0 20 20">
                    <path d="M17.293 13.293A8 8 0 016.707 2.707a8.001 8.001 0 1010.586 10.586z" />
                  </svg>
                  Dark Mode
                </>
              )}
            </button>
          </div>
        </div>
      </nav>

      {/* Spacer to prevent content from hiding under fixed nav */}
      <div className="h-20" />
    </>
  )
})

export default ModernNav
