import { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useDeviceDetection } from '../context/DeviceContext'
import { HiMapPin } from 'react-icons/hi2'
import { GiButterfly } from 'react-icons/gi'
import { MdWaves } from 'react-icons/md'
import AnimatedText from './AnimatedText'

/**
 * Modern Hero Component - Bold, Clean, Professional Design
 * Features: Large typography, bold CTAs, animated gradients
 */
const ModernHero = memo(function ModernHero() {
  const { hotspots, species, loading } = useData()
  const navigate = useNavigate()
  const { isMobileView } = useDeviceDetection()
  const [isVisible, setIsVisible] = useState(false)

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const stats = [
    {
      value: loading ? '...' : hotspots.length,
      label: 'Biodiversity Hotspots',
      icon: <HiMapPin className="w-12 h-12 text-cyan-500" />,
      gradient: 'from-cyan-500 to-blue-600'
    },
    {
      value: loading ? '...' : species.length,
      label: 'Species Documented',
      icon: <GiButterfly className="w-12 h-12 text-emerald-500" />,
      gradient: 'from-emerald-500 to-teal-600'
    },
    {
      value: loading ? '...' : hotspots.filter(h => h.type === 'marine').length,
      label: 'Marine Ecosystems',
      icon: <MdWaves className="w-12 h-12 text-blue-500" />,
      gradient: 'from-blue-500 to-indigo-600'
    }
  ]

  return (
    <div className={`relative min-h-[60vh] sm:min-h-[70vh] lg:min-h-[75vh] flex items-center justify-center overflow-hidden rounded-3xl transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Subtle overlay - works with main app background */}
      <div className="absolute inset-0">
        {/* Subtle gradient overlays */}
        <div className="absolute top-20 left-10 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-cyan-400/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 right-10 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-teal-400/10 rounded-full blur-3xl" />
      </div>

      {/* Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-30 rounded-3xl" 
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-4 md:pt-10 pb-6">
        <div className="text-center space-y-6 max-w-5xl mx-auto pb-2">
          {/* Platform Badge */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <span className="inline-flex items-center gap-2 px-4 py-2 bg-blue-600/10 dark:bg-emerald-500/10 backdrop-blur-sm border border-blue-600/20 dark:border-emerald-500/20 rounded-full text-sm font-semibold text-blue-700 dark:text-emerald-400">
              <span className="w-2 h-2 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"></span>
              Mati City Biodiversity Platform
            </span>
          </div>

          {/* Main Heading - solid colors (no gradient, no per-char animation) */}
          <h1
            className={`relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight md:leading-snug transition-opacity duration-1000 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transform: 'none', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
          >
            <span className="block text-slate-900 dark:text-white">
              Discover Mati
            </span>
            <span className="block mt-1 md:mt-2 relative z-40 text-blue-600 dark:text-emerald-400 pb-0.5">
              Through Technology
            </span>
          </h1>

          {/* Subtitle */}
          <p className={`mt-6 sm:mt-8 text-base sm:text-lg md:text-xl lg:text-2xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto font-medium leading-relaxed transition-all duration-1000 delay-200 bg-transparent backdrop-blur-none ${
            isVisible ? 'mt-0 opacity-100' : 'mt-3 opacity-0'
          }`}>
            Explore Mati&apos;s rich biodiversity through interactive maps, AR experiences,
            and comprehensive species data. Conservation meets innovation.
          </p>

          {/* CTA Buttons - Enhanced with modern effects */}
          <div className={`flex flex-col sm:flex-row items-center justify-center gap-4 transition-all duration-1000 delay-300 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            <button
              onClick={() => navigate('/gis')}
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-blue-700 to-emerald-600 hover:from-blue-700 hover:via-blue-800 hover:to-emerald-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 overflow-hidden w-full sm:w-auto transform hover:scale-105 hover:-translate-y-1"
            >
              {/* Animated shine effect */}
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:translate-x-full" 
                   style={{ animation: 'shimmer 2s infinite' }} />
              
              {/* Glow pulse */}
              <div className="absolute inset-0 rounded-2xl bg-gradient-to-r from-blue-400 to-emerald-400 blur-xl opacity-0 group-hover:opacity-50 transition-opacity duration-500" />
              
              <span className="relative flex items-center justify-center gap-3">
                <HiMapPin className="w-6 h-6 transform group-hover:rotate-12 transition-transform duration-300" />
                Explore Interactive Map
                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </button>

            <Link
              to="/biodiversity"
              className="group relative px-8 py-4 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl text-slate-800 dark:text-white font-bold text-lg rounded-2xl border-2 border-slate-300 dark:border-slate-600 hover:border-emerald-500 dark:hover:border-emerald-400 shadow-xl hover:shadow-2xl transition-all duration-500 overflow-hidden w-full sm:w-auto transform hover:scale-105 hover:-translate-y-1"
            >
              {/* Animated gradient background */}
              <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500 bg-[length:200%_100%] group-hover:animate-gradient" />
              
              <span className="relative flex items-center justify-center gap-3">
                <GiButterfly className="w-6 h-6 transform group-hover:scale-110 transition-transform duration-300" />
                Browse Species
                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>

          {/* Stats Grid - Enhanced with better hover effects */}
          <div className={`grid grid-cols-1 sm:grid-cols-3 gap-6 mt-16 md:mt-20 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-8 border border-slate-200/70 dark:border-slate-700/70 hover:border-emerald-400/80 dark:hover:border-emerald-400/80 transition-all duration-500 hover:transform hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                {/* Animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-emerald-500/0 to-blue-500/0 group-hover:from-blue-500/10 group-hover:via-emerald-500/10 group-hover:to-blue-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />
                
                {/* Glow effect on hover */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />
                
                <div className="relative">
                  <div className="mb-4 flex justify-center transform group-hover:scale-110 group-hover:rotate-3 transition-transform duration-500">
                    {stat.icon}
                  </div>
                  <div className={`text-4xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-3 group-hover:scale-105 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-sm font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider">
                    {stat.label}
                  </div>
                </div>
                
                {/* Corner accent */}
                <div className="absolute top-0 right-0 w-20 h-20 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default ModernHero
