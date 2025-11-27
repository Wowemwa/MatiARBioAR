import { memo } from 'react'

const AboutMission = memo(function AboutMission() {
  return (
    <div className="mb-16 sm:mb-20">
      <div className="relative group max-w-5xl mx-auto">
        <div className="absolute -inset-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl opacity-20 group-hover:opacity-30 blur-lg transition-all duration-300"></div>
        <div className="relative p-8 bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50 shadow-xl">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-purple-600/10 to-pink-600/10 backdrop-blur-sm border border-purple-600/20 rounded-full text-sm font-semibold text-purple-700 dark:text-purple-400 mb-6">
              <span className="text-lg">🎯</span>
              Our Mission
            </div>

            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6">
              Bridging Technology & Conservation
            </h2>

            <p className="text-lg text-slate-700 dark:text-slate-300 leading-relaxed mb-8 max-w-4xl mx-auto">
              To create accessible tools for biodiversity documentation and conservation education,
              bridging the gap between scientific research and public understanding through innovative technology.
            </p>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6 text-center">
              <div className="p-4">
                <div className="text-2xl mb-2">🌱</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Preserve</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Protect biodiversity through education</p>
              </div>
              <div className="p-4">
                <div className="text-2xl mb-2">🔬</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Research</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Support scientific discovery and monitoring</p>
              </div>
              <div className="p-4">
                <div className="text-2xl mb-2">🌍</div>
                <h3 className="font-bold text-slate-900 dark:text-white mb-1">Connect</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">Build community and global partnerships</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default AboutMission