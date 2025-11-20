import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useTheme from '../useTheme'
import useScrollPosition from '../hooks/useScrollPosition'
import { ARIcon } from './Icons'

function ThemeToggle() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex items-center justify-center w-14 h-14 rounded-3xl border-2 border-white/50 dark:border-white/25 bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl hover:scale-110 hover:rotate-12 transition-all duration-700 ease-out shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/20 dark:hover:shadow-blue-500/20 overflow-hidden"
      aria-label="Toggle dark mode"
    >
      {/* Enhanced background effects */}
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/25 via-orange-400/20 via-pink-400/15 to-blue-600/25 dark:from-blue-600/25 dark:via-purple-600/20 dark:via-indigo-600/15 dark:to-slate-600/25 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
      <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(251,191,36,0.3),rgba(249,115,22,0.2),rgba(59,130,246,0.3))] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/10 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      
      <div className="relative z-10 transition-all duration-700 group-hover:scale-125 group-hover:rotate-180">
        <div className={`text-3xl transition-all duration-700 ease-out ${
          theme === 'dark'
            ? 'rotate-0 opacity-100 scale-100'
            : '-rotate-180 opacity-100 scale-100'
        }`}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
      
      {/* Enhanced tooltip */}
      <div className="absolute -bottom-14 left-1/2 transform -translate-x-1/2 bg-gradient-to-r from-slate-900 to-slate-800 dark:from-white dark:to-slate-100 text-white dark:text-slate-900 text-xs font-bold px-4 py-2 rounded-2xl opacity-0 group-hover:opacity-100 transition-all duration-500 pointer-events-none whitespace-nowrap shadow-2xl backdrop-blur-xl">
        {theme === 'dark' ? 'Switch to Light ☀️' : 'Switch to Dark 🌙'}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-3 h-3 bg-gradient-to-br from-slate-900 to-slate-800 dark:from-white dark:to-slate-100"></div>
      </div>
    </button>
  )
}

export default function ShowcaseNavbar() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrollPosition(8)
  const location = useLocation()
  const navItems = [
    { to: '/explore', label: 'Explore', badge: '🗺️' },
    { to: '/biodiversity', label: 'Biodiversity', badge: '🌿' },
    { to: '/ar', label: 'Augmented Reality', badge: '🎯' },
    { to: '/about', label: 'About', badge: '💡' },
  ]
  const pillRefs = useRef<HTMLDivElement[]>([])
  const [pillStyle, setPillStyle] = useState<{ width: number; left: number }>({ width: 0, left: 0 })
  const progress = typeof window !== 'undefined'
    ? (window.scrollY / (document.documentElement.scrollHeight - window.innerHeight)) * 100
    : 0

  useEffect(() => {
    const idx = navItems.findIndex((item) => location.pathname.startsWith(item.to))
    const target = pillRefs.current[idx >= 0 ? idx : 0]
    if (target) {
      setPillStyle({ width: target.offsetWidth, left: target.offsetLeft })
    }
  }, [location.pathname, open])

  return (
    <header className={`fixed top-0 left-0 right-0 z-50 transition-all duration-700 ${scrolled ? 'py-3' : 'py-6'}`}>
      <div className={`mx-auto max-w-7xl px-6 transition-all duration-700 ${scrolled ? 'scale-95' : 'scale-100'}`}>
        <nav className={`relative overflow-hidden rounded-2xl backdrop-blur-2xl transition-all duration-700 ${
          scrolled
            ? 'bg-white/90 dark:bg-slate-900/90 shadow-2xl shadow-black/10 border border-white/20 dark:border-white/10'
            : 'bg-white/60 dark:bg-slate-900/60 shadow-xl border border-white/30 dark:border-white/15'
        }`}>
          <div className="absolute inset-0 bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20 opacity-0 transition-opacity duration-500 hover:opacity-100 pointer-events-none" />
          <div className="relative px-8 py-4">
            <div className="flex items-center justify-between">
              <Link
                to="/"
                className="group relative flex items-center gap-3 font-black text-2xl lg:text-3xl tracking-tight hover:scale-105 transition-all duration-500"
                onClick={() => setOpen(false)}
              >
                <div className="relative">
                  <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                    Mati
                  </span>
                  <span className="bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent ml-1">
                    AR
                  </span>
                  <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                    Bio
                  </span>
                  <div className="absolute -top-1 -right-2 w-3 h-3 bg-gradient-to-r from-green-500 to-blue-500 rounded-full animate-pulse opacity-60 group-hover:opacity-100 transition-opacity" />
                </div>
                <div className="hidden xl:block text-xs font-medium text-gray-500 dark:text-gray-400 border-l border-gray-300 dark:border-gray-600 pl-3 ml-1">
                  Biodiversity Explorer
                </div>
              </Link>

              <button
                aria-label="Toggle menu"
                aria-expanded={open}
                onClick={() => setOpen(!open)}
                className={`lg:hidden relative p-3 rounded-2xl border-2 transition-all duration-500 hover:scale-110 ${
                  open
                    ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent text-white rotate-180 shadow-lg'
                    : 'border-white/40 dark:border-white/20 text-gray-700 dark:text-gray-200 hover:bg-white/50 dark:hover:bg-slate-700/50'
                }`}
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className={`h-6 w-6 transition-transform duration-300 ${open ? 'rotate-45' : ''}`}
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth={2}
                    d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'}
                  />
                </svg>
              </button>

              <div className="hidden lg:flex items-center gap-8">
                <div className="relative flex items-center gap-2 p-2 rounded-2xl bg-white/40 dark:bg-slate-800/40 backdrop-blur-xl border border-white/30 dark:border-white/15">
                  <div
                    className="absolute top-2 bottom-2 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl transition-all duration-500 shadow-lg"
                    style={{
                      width: pillStyle.width ? `${pillStyle.width}px` : '0px',
                      left: `${pillStyle.left + 8}px`
                    }}
                  />

                  {navItems.map((item, i) => (
                    <div key={item.to} ref={(el) => { if (el) pillRefs.current[i] = el }}>
                      <NavLink
                        to={item.to}
                        onClick={() => setOpen(false)}
                        className={({ isActive }) => `
                          relative z-10 flex items-center gap-2 px-4 py-2.5 rounded-xl font-semibold text-sm transition-all duration-300 hover:scale-105
                          ${isActive ? 'text-white shadow-md' : 'text-gray-700 dark:text-gray-200 hover:text-green-600 dark:hover:text-green-400'}
                        `}
                      >
                        <span className="text-lg">{item.badge}</span>
                        <span>{item.label}</span>
                      </NavLink>
                    </div>
                  ))}
                </div>

                <div className="relative hidden xl:block">
                  <div className="absolute inset-y-0 left-0 pl-4 flex items-center pointer-events-none">
                    <svg className="h-5 w-5 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                    </svg>
                  </div>
                  <input
                    type="text"
                    placeholder="Search species, sites..."
                    className="w-64 pl-12 pr-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-white/40 dark:border-white/20 rounded-2xl backdrop-blur-xl text-sm font-medium text-gray-900 dark:text-gray-100 placeholder-gray-500 focus:outline-none focus:ring-2 focus:ring-green-500/50 focus:border-green-500/50 transition-all duration-300 hover:bg-white/80 dark:hover:bg-slate-700/80"
                  />
                </div>

                <ThemeToggle />

                <Link
                  to="/ar"
                  className="group relative overflow-hidden bg-gradient-to-r from-green-600 to-blue-600 hover:from-green-500 hover:to-blue-500 text-white px-6 py-3 rounded-2xl font-bold text-sm shadow-xl hover:shadow-2xl transition-all duration-500 hover:scale-110 hover:-rotate-1"
                >
                  <span className="relative z-10 flex items-center gap-2">
                    <ARIcon className="w-4 h-4" />
                    <span>Try AR</span>
                  </span>
                  <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                </Link>
              </div>
            </div>

            <div className={`lg:hidden overflow-hidden transition-all duration-500 ${open ? 'max-h-96 opacity-100 mt-6' : 'max-h-0 opacity-0'}`}>
              <div className="space-y-2 p-4 bg-white/50 dark:bg-slate-800/50 rounded-2xl backdrop-blur-xl border border-white/30 dark:border-white/15">
                {navItems.map((item) => (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => `
                      flex items-center gap-4 p-4 rounded-xl font-semibold transition-all duration-300 hover:scale-105
                      ${isActive ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-lg' : 'hover:bg-white/60 dark:hover:bg-slate-700/60 text-gray-700 dark:text-gray-200'}
                    `}
                    onClick={() => setOpen(false)}
                  >
                    <span className="text-2xl">{item.badge}</span>
                    <span>{item.label}</span>
                  </NavLink>
                ))}

                <div className="flex items-center gap-3 pt-4 mt-4 border-t border-white/30 dark:border-white/15">
                  <input
                    type="text"
                    placeholder="Search..."
                    className="flex-1 px-4 py-3 bg-white/70 dark:bg-slate-800/70 border border-white/40 dark:border-white/20 rounded-xl backdrop-blur-xl text-sm focus:outline-none focus:ring-2 focus:ring-green-500/50"
                  />
                  <ThemeToggle />
                </div>
              </div>
            </div>
          </div>

          <div
            className="absolute bottom-0 left-0 h-1 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-300 rounded-full"
            style={{ width: `${Math.min(100, progress)}%` }}
          />
        </nav>
      </div>
    </header>
  )
}
