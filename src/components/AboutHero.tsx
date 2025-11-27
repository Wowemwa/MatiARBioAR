import { memo } from 'react'

const AboutHero = memo(function AboutHero() {
  return (
    <div className="text-center mb-16 sm:mb-20">
      <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-600/10 via-purple-600/10 to-emerald-600/10 backdrop-blur-sm border border-blue-600/20 rounded-full text-sm font-semibold text-blue-700 dark:text-emerald-400 mb-6 shadow-lg">
        <span className="w-2 h-2 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-full animate-pulse"></span>
        About the Platform
      </div>

      <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black bg-gradient-to-r from-slate-900 via-blue-800 to-emerald-800 dark:from-white dark:via-blue-200 dark:to-emerald-200 bg-clip-text text-transparent mb-6 leading-tight">
        Mati ARBio
      </h1>

      <p className="text-lg sm:text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto mb-8 leading-relaxed">
        A revolutionary digital platform connecting cutting-edge technology with biodiversity conservation in Mati City, Davao Oriental.
      </p>

      <div className="flex flex-wrap justify-center gap-4 text-sm text-slate-500 dark:text-slate-400">
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-emerald-500 rounded-full"></span>
          Augmented Reality
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-blue-500 rounded-full"></span>
          Biodiversity Data
        </div>
        <div className="flex items-center gap-2">
          <span className="w-2 h-2 bg-purple-500 rounded-full"></span>
          Conservation Education
        </div>
      </div>
    </div>
  )
})

export default AboutHero