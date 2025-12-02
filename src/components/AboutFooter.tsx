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

          {/* Animated Logo Section */}
          <div className="flex flex-col gap-4 justify-center md:justify-start">
            <div className="group inline-block">
              <div className="relative text-4xl font-black">
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500"></div>
                <span className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-green-500 group-hover:via-blue-500 group-hover:to-purple-500 transition-all duration-500">
                  Mati
                </span>
                <span className="relative ml-1 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-500">
                  AR
                </span>
                <span className="relative bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-500">
                  Bio
                </span>
              </div>
            </div>
            <p className="text-sm text-slate-500 dark:text-slate-400 max-w-xs">
              © 2025 Mati Biodiversity Platform. All rights reserved.
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