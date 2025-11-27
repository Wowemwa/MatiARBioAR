import { memo } from 'react'

interface AboutFooterProps {
  onShowPrivacyModal: () => void
  onShowFeedbackModal: () => void
}

const AboutFooter = memo(function AboutFooter({ onShowPrivacyModal, onShowFeedbackModal }: AboutFooterProps) {
  return (
    <footer className="relative py-16 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-700/50 bg-gradient-to-br from-slate-50/80 to-white/80 dark:from-slate-900/80 dark:to-slate-800/80 backdrop-blur-sm">
      <div className="max-w-7xl 3xl:max-w-8xl 4xl:max-w-9xl mx-auto">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-12">
          {/* Brand */}
          <div className="md:col-span-2">
            <div className="flex items-center gap-3 mb-4">
              <div className="w-10 h-10 bg-gradient-to-r from-green-500 to-blue-500 rounded-xl flex items-center justify-center">
                <span className="text-white font-bold text-lg">M</span>
              </div>
              <div>
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">Mati ARBio</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Biodiversity Explorer</p>
              </div>
            </div>
            <p className="text-slate-600 dark:text-slate-400 leading-relaxed mb-6 max-w-md">
              A comprehensive platform for exploring and preserving the rich biodiversity of Mati City through technology and community engagement.
            </p>
            <div className="flex gap-4">
              <div className="w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">f</div>
              <div className="w-8 h-8 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">t</div>
              <div className="w-8 h-8 bg-gradient-to-r from-purple-500 to-pink-500 rounded-lg flex items-center justify-center text-white text-sm font-bold">i</div>
            </div>
          </div>

          {/* Quick Links */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Explore</h4>
            <ul className="space-y-3 text-sm">
              <li>
                <a href="/gis" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-emerald-500 rounded-full"></span>
                  Interactive Map
                </a>
              </li>
              <li>
                <a href="/biodiversity" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-blue-500 rounded-full"></span>
                  Species Database
                </a>
              </li>
              <li>
                <a href="/ar" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-purple-500 rounded-full"></span>
                  AR Experience
                </a>
              </li>
              <li>
                <a href="/about" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200 flex items-center gap-2">
                  <span className="w-1.5 h-1.5 bg-cyan-500 rounded-full"></span>
                  About Us
                </a>
              </li>
            </ul>
          </div>

          {/* Connect */}
          <div>
            <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Built With</h4>
            <div className="flex flex-wrap gap-4">
              {/* React */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 100 100" className="w-8 h-8">
                  <circle cx="50" cy="50" r="8" fill="#61DAFB"/>
                  <path d="M50 8C27.9 8 10 25.9 10 48s17.9 40 40 40 40-17.9 40-40S72.1 8 50 8zm0 72c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" fill="#61DAFB"/>
                  <path d="M50 28c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 32c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14z" fill="#61DAFB"/>
                  <ellipse cx="35" cy="48" rx="3" ry="12" fill="#61DAFB"/>
                  <ellipse cx="65" cy="48" rx="3" ry="12" fill="#61DAFB"/>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">React</span>
              </div>

              {/* TypeScript */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#3178C6">
                  <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.02c.117-.103.233-.215.338-.327.678-.677 1.231-1.521 1.231-2.502 0-1.739-1.407-3.156-3.146-3.156-.866 0-1.658.345-2.249.938-.591.593-.938 1.384-.938 2.25 0 .966.549 1.81 1.227 2.487.11.112.226.224.343.336L12 17.438l-4.688-8.438c.117-.112.233-.224.343-.336.678-.677 1.231-1.521 1.231-2.502 0-1.739-1.407-3.156-3.146-3.156C4.216 3.02 3.424 3.365 2.833 3.958.944 5.847.944 9.02.944 9.02c0 1.98.552 3.824 1.23 4.501.11.112.226.224.343.336L12 21.438l8.482-12.438z"/>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">TypeScript</span>
              </div>

              {/* Vite */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 32 32" className="w-8 h-8" fill="#646CFF">
                  <path d="M29.883 13.2c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L16 22.345 6.437 13.2c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L0 15.2c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718L16 9.655l11.68 5.545c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718l-2.117-2z"/>
                  <path d="M29.883 18.8c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L16 27.945 6.437 18.8c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L0 20.8c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718L16 15.255l11.68 5.545c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718l-2.117-2z"/>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Vite</span>
              </div>

              {/* Supabase */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 109 113" className="w-8 h-8" fill="#3ECF8E">
                  <path d="M63.568 38.808c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16zM54.104 47.128c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16z"/>
                  <path d="M21.568 57.808c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16z"/>
                  <path d="M87.568 47.128c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16z"/>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Supabase</span>
              </div>

              {/* Tailwind */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 54 33" className="w-8 h-8" fill="#06B6D4">
                  <path d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 2.31 20.192-.8 13.5-.8c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C6.744 9.69 3.68 12.8 0 12.8c-7.2 0-11.7-3.6-13.5-10.8C-10.8 9 2.35 12.6 9.45 12.6c2.7 0 5.55-.9 8.55-2.85C21.3 6.75 25.35 4.05 27 0z"/>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Tailwind</span>
              </div>

              {/* A-Frame */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#EF2D5E">
                  <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">A-Frame</span>
              </div>

              {/* AR.js */}
              <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                <svg viewBox="0 0 100 100" className="w-8 h-8" fill="#000000">
                  <text x="50" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#000">AR</text>
                  <text x="50" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">.js</text>
                </svg>
                <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">AR.js</span>
              </div>
            </div>
          </div>
        </div>

        {/* Copyright */}
        <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
          <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2025 Mati Biodiversity Platform. Conserving nature through technology.
            </p>
            <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onShowPrivacyModal()
                }}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Privacy
              </button>
              <button
                type="button"
                onClick={(e) => {
                  e.preventDefault()
                  onShowFeedbackModal()
                }}
                className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
              >
                Support
              </button>
            </div>
          </div>
        </div>
      </div>
    </footer>
  )
})

export default AboutFooter