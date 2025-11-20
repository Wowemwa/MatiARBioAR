import { useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import useTheme from '../../useTheme'
import useScrollPosition from '../../hooks/useScrollPosition'
import { WaveIcon, SpeciesIcon, ARIcon, InfoIcon } from '../Icons'

export function ThemeToggleClassic() {
  const { theme, toggleTheme } = useTheme()
  return (
    <button
      onClick={toggleTheme}
      className="group relative inline-flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-white/40 dark:border-white/20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl hover:scale-110 transition-all duration-500 shadow-lg hover:shadow-xl overflow-hidden"
      aria-label="Toggle dark mode"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-blue-600/20 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
      <div className="relative z-10 transition-all duration-500 group-hover:scale-110">
        <div className={`text-2xl transition-all duration-700 ${
          theme === 'dark'
            ? 'rotate-0 opacity-100'
            : '-rotate-180 opacity-100'
        }`}>
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-all duration-300 pointer-events-none whitespace-nowrap">
        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-white"></div>
      </div>
    </button>
  )
}

export default function NavbarClassic() {
  const [open, setOpen] = useState(false)
  const scrolled = useScrollPosition(8)
  const location = useLocation()

  const navItems = [
    { to: '/explore', label: 'Explore', icon: <WaveIcon className="w-4 h-4" /> },
    { to: '/biodiversity', label: 'Biodiversity', icon: <SpeciesIcon className="w-4 h-4" /> },
    { to: '/ar', label: 'AR Demo', icon: <ARIcon className="w-4 h-4" /> },
    { to: '/about', label: 'About', icon: <InfoIcon className="w-4 h-4" /> },
  ]

  const pillRefs = useRef<HTMLButtonElement[]>([])
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
    <header
      className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
        scrolled ? 'backdrop-blur-xl/80' : 'backdrop-blur-2xl'
      }`}
    >
      {/* Top gradient bar / scroll progress */}
      <div
        className="pointer-events-none h-1 w-full bg-gradient-to-r from-green-500/20 via-blue-500/20 to-purple-500/20"
      >
        <div
          className="h-full bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 transition-all duration-300"
          style={{ width: `${Math.min(100, progress)}%` }}
        />
      </div>

      <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
        <nav
          className={`mt-2 flex items-center justify-between gap-3 rounded-2xl border border-white/40 bg-white/80 px-4 py-2.5 text-sm shadow-lg shadow-slate-900/5 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/80 ${
            scrolled ? 'mt-2' : 'mt-4'
          }`}
        >
          {/* Brand */}
          <Link
            to="/"
            onClick={() => setOpen(false)}
            className="group flex items-center gap-3"
          >
            <div className="relative flex items-center gap-1 text-lg font-bold tracking-tight sm:text-xl">
              <span className="bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 bg-clip-text text-transparent">
                Mati
              </span>
              <span className="bg-gradient-to-r from-emerald-400 to-emerald-600 bg-clip-text text-transparent">
                AR
              </span>
              <span className="bg-gradient-to-r from-blue-500 to-cyan-400 bg-clip-text text-transparent">
                Bio
              </span>
              <span className="sr-only">Mati AR Bio - Biodiversity Explorer</span>
              <div className="absolute -right-2 -top-1 h-2.5 w-2.5 rounded-full bg-gradient-to-r from-green-400 to-blue-500 opacity-60 shadow-[0_0_12px_rgba(34,197,94,0.8)] group-hover:opacity-100" />
            </div>

            <span className="hidden border-l border-slate-200 pl-3 text-[11px] font-medium text-slate-500 dark:border-slate-700 dark:text-slate-400 md:inline">
              Biodiversity Explorer
            </span>
          </Link>

          {/* Desktop nav */}
          <div className="hidden items-center gap-6 md:flex">
            <div className="relative flex items-center gap-1 rounded-full bg-slate-50/80 px-1 py-1 text-xs font-medium text-slate-700 shadow-inner dark:bg-slate-800/80 dark:text-slate-100">
              {/* Active pill */}
              <div
                className="pointer-events-none absolute inset-y-1 rounded-full bg-gradient-to-r from-green-500 to-blue-500 shadow-md transition-all duration-300"
                style={{
                  width: pillStyle.width ? `${pillStyle.width}px` : '0px',
                  left: pillStyle.left,
                }}
              />

              {navItems.map((item, index) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `relative z-10 inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 transition-all duration-200 ${
                      isActive
                        ? 'text-white'
                        : 'text-slate-600 hover:text-slate-900 dark:text-slate-200 dark:hover:text-white'
                    }`
                  }
                  ref={(el) => {
                    if (el) pillRefs.current[index] = el
                  }}
                >
                  {item.icon}
                  <span>{item.label}</span>
                </NavLink>
              ))}
            </div>

            {/* Right side controls */}
            <div className="flex items-center gap-3">
              <div className="hidden items-center gap-2 rounded-xl bg-slate-50/80 px-3 py-1.5 text-[11px] font-medium text-slate-500 shadow-inner dark:bg-slate-800/80 dark:text-slate-300 lg:flex">
                <span className="inline-flex h-6 w-6 items-center justify-center rounded-lg bg-slate-900 text-[10px] font-semibold text-white shadow-sm dark:bg-slate-100 dark:text-slate-900">
                  ⌘K
                </span>
                <span>Quick search</span>
              </div>

              <ThemeToggleClassic />

              <Link
                to="/ar"
                className="hidden items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-4 py-2 text-xs font-semibold text-white shadow-lg shadow-green-500/30 transition hover:scale-105 hover:shadow-xl hover:brightness-110 sm:inline-flex"
              >
                <ARIcon className="h-4 w-4" />
                <span>Try AR</span>
              </Link>
            </div>
          </div>

          {/* Mobile controls */}
          <div className="flex items-center gap-2 md:hidden">
            <ThemeToggleClassic />

            <button
              aria-label="Toggle navigation menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className="inline-flex h-11 w-11 items-center justify-center rounded-2xl border border-slate-200 bg-white/80 text-slate-700 shadow-sm transition hover:scale-105 hover:border-green-400 hover:text-green-600 dark:border-slate-700 dark:bg-slate-900/80 dark:text-slate-100"
            >
              <span className="sr-only">Open navigation</span>
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-5 w-5 transition-transform duration-200 ${open ? 'rotate-90' : ''}`}
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
          </div>
        </nav>

        {/* Mobile menu */}
        <div
          className={`md:hidden transform pt-1 transition-all duration-300 ${
            open ? 'pointer-events-auto opacity-100' : 'pointer-events-none opacity-0'
          }`}
        >
          <div className="rounded-2xl border border-white/40 bg-white/90 p-3 text-sm shadow-xl shadow-slate-900/10 backdrop-blur-xl dark:border-white/10 dark:bg-slate-900/95">
            <div className="space-y-1">
              {navItems.map((item) => (
                <NavLink
                  key={item.to}
                  to={item.to}
                  onClick={() => setOpen(false)}
                  className={({ isActive }) =>
                    `flex items-center justify-between rounded-xl px-3.5 py-2.5 text-sm font-medium transition ${
                      isActive
                        ? 'bg-gradient-to-r from-green-500 to-blue-500 text-white shadow-md'
                        : 'text-slate-700 hover:bg-slate-50 dark:text-slate-200 dark:hover:bg-slate-800'
                    }`
                  }
                >
                  <div className="flex items-center gap-2">
                    {item.icon}
                    <span>{item.label}</span>
                  </div>

                  <span className="text-[10px] uppercase tracking-wide text-slate-400 dark:text-slate-500">
                    {item.to === '/ar' ? 'Live' : 'Browse'}
                  </span>
                </NavLink>
              ))}
            </div>

            <div className="mt-3 flex items-center justify-between rounded-xl bg-slate-50 px-3 py-2.5 text-xs text-slate-500 dark:bg-slate-800 dark:text-slate-300">
              <span>Scroll to explore the full experience</span>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
}
