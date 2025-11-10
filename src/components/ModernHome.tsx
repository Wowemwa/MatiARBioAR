import { memo } from 'react'
import ModernHero from './ModernHero'
import ModernFeatures from './ModernFeatures'

/**
 * Modern Home Component - Combines Hero and Features
 * into a cohesive modern landing page experience
 */
const ModernHome = memo(function ModernHome() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <ModernHero />
      
      {/* Decorative Separator */}
      <div className="max-w-7xl 3xl:max-w-8xl 4xl:max-w-9xl mx-auto px-4 sm:px-6 lg:px-8 -mt-24 mb-4">
        <div className="relative">
          <div className="absolute inset-0 flex items-center" aria-hidden="true">
            <div className="w-full border-t border-slate-200/50 dark:border-slate-700/50" />
          </div>
          <div className="relative flex justify-center">
            <span className="px-6 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
              <div className="flex items-center gap-2">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-cyan-500 animate-pulse" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-emerald-500 to-teal-500 animate-pulse delay-75" />
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-pink-500 animate-pulse delay-150" />
              </div>
            </span>
          </div>
        </div>
      </div>
      
      <ModernFeatures />
      
      {/* Footer */}
      <footer className="relative py-12 px-4 sm:px-6 lg:px-8 border-t border-slate-200/50 dark:border-slate-700/50">
        <div className="max-w-7xl 3xl:max-w-8xl 4xl:max-w-9xl mx-auto">
          <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-8">
            {/* About */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                About Mati Biodiversity
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                A comprehensive platform for exploring and preserving the rich biodiversity of Mati City through technology and community engagement.
              </p>
            </div>
            
            {/* Quick Links */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Quick Links
              </h3>
              <ul className="space-y-2 text-sm">
                <li>
                  <a href="/gis" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                    Interactive Map
                  </a>
                </li>
                <li>
                  <a href="/biodiversity" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                    Species Database
                  </a>
                </li>
                <li>
                  <a href="/ar-demo" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
                    AR Experience
                  </a>
                </li>
              </ul>
            </div>
            
            {/* Connect */}
            <div>
              <h3 className="text-lg font-bold text-slate-900 dark:text-white mb-3">
                Connect
              </h3>
              <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed">
                Join our conservation efforts and stay updated on biodiversity research and initiatives.
              </p>
            </div>
          </div>
          
          {/* Copyright */}
          <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
            <p className="text-sm text-slate-500 dark:text-slate-400">
              © 2025 Mati Biodiversity Platform. Conserving nature through technology.
            </p>
          </div>
        </div>
      </footer>
    </div>
  )
})

export default ModernHome
