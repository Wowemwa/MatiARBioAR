import { memo, useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { useDeviceDetection } from '../context/DeviceContext'
import { HiMapPin } from 'react-icons/hi2'
import { GiButterfly } from 'react-icons/gi'
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
    }
  ]

  return (
    <div className={`relative min-h-[70vh] sm:min-h-[80vh] lg:min-h-[85vh] flex items-center justify-center rounded-3xl transition-all duration-1000 ${
      isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-8'
    }`}>
      {/* Enhanced Subtle overlay - works with main app background */}
      <div className="absolute inset-0">
        {/* Multi-layered gradient overlays */}
        <div className="absolute top-10 left-10 w-96 h-96 bg-gradient-to-br from-blue-400/15 to-cyan-400/8 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-10 right-10 w-[500px] h-[500px] bg-gradient-to-br from-emerald-400/15 to-teal-400/8 rounded-full blur-3xl animate-pulse delay-1000" />
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-[800px] h-[800px] bg-gradient-to-r from-purple-400/5 via-transparent to-pink-400/5 rounded-full blur-3xl animate-pulse delay-500" />

        {/* Animated mesh pattern */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0 animate-pulse" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='80' height='80' viewBox='0 0 80 80' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.1'%3E%3Cpath d='M50 50c0-5.5-4.5-10-10-10s-10 4.5-10 10 4.5 10 10 10 10-4.5 10-10zm-10-30c5.5 0 10 4.5 10 10s-4.5 10-10 10-10-4.5-10-10 4.5-10 10-10z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
            backgroundSize: '80px 80px'
          }}></div>
        </div>
      </div>

      {/* Enhanced Grid Pattern Overlay */}
      <div className="absolute inset-0 bg-grid-slate-100 dark:bg-grid-slate-800 opacity-10 rounded-3xl"
           style={{
             backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.08'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
           }}
      />

      {/* Content */}
      <div className="relative z-10 container mx-auto px-4 sm:px-6 lg:px-8 pt-8 md:pt-12 pb-8">
        <div className="text-center space-y-8 max-w-6xl mx-auto pb-4">
          {/* Enhanced Platform Badge */}
          <div className={`transition-all duration-1000 ${
            isVisible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4'
          }`}>
            <span className="inline-flex items-center gap-3 px-6 py-3 bg-gradient-to-r from-blue-500/10 via-emerald-500/10 to-purple-500/10 backdrop-blur-xl border border-blue-500/20 dark:border-emerald-500/20 rounded-full text-sm font-bold text-blue-700 dark:text-emerald-400 shadow-lg">
              <div className="flex gap-1">
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse"></div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-blue-500 to-purple-500 animate-pulse delay-150"></div>
                <div className="w-2 h-2 rounded-full bg-gradient-to-r from-purple-500 to-emerald-500 animate-pulse delay-300"></div>
              </div>
              Mati City Biodiversity Platform
            </span>
          </div>

          {/* Enhanced Main Heading */}
          <h1
            className={`relative z-10 text-4xl sm:text-5xl md:text-6xl lg:text-7xl xl:text-8xl font-black tracking-tight leading-tight transition-opacity duration-1000 delay-100 ${
              isVisible ? 'opacity-100' : 'opacity-0'
            }`}
            style={{ transform: 'none', backfaceVisibility: 'hidden', WebkitFontSmoothing: 'antialiased' }}
          >
            <span className="block text-slate-900 dark:text-white drop-shadow-sm font-black">
              Discover Mati
            </span>
            <span className="block mt-0 md:mt-1 relative z-40 bg-gradient-to-r from-blue-600 via-emerald-500 via-purple-500 to-cyan-500 bg-clip-text text-transparent drop-shadow-sm animate-gradient-x font-extrabold leading-tight">
              Through Technology
            </span>

            {/* Floating accent elements */}
            <div className="absolute -top-4 -right-4 w-8 h-8 bg-gradient-to-r from-blue-500 to-cyan-500 rounded-full opacity-60 animate-bounce delay-500"></div>
            <div className="absolute -bottom-2 -left-2 w-6 h-6 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-full opacity-60 animate-bounce delay-1000"></div>
          </h1>

          {/* Enhanced Subtitle */}
          <p className={`mt-8 sm:mt-10 text-lg sm:text-xl md:text-2xl lg:text-3xl text-slate-600 dark:text-slate-300 max-w-4xl mx-auto font-medium leading-relaxed transition-all duration-1000 delay-200 bg-transparent backdrop-blur-none ${
            isVisible ? 'mt-0 opacity-100' : 'mt-4 opacity-0'
          }`}>
            Explore Mati&apos;s rich biodiversity through <span className="text-emerald-600 dark:text-emerald-400 font-bold">interactive maps</span>, <span className="text-blue-600 dark:text-blue-400 font-bold">AR experiences</span>, and <span className="text-purple-600 dark:text-purple-400 font-bold">comprehensive species data</span>.
          </p>

          {/* Enhanced Stats Grid */}
          <div className={`grid grid-cols-1 sm:grid-cols-2 gap-8 mt-20 md:mt-24 transition-all duration-1000 delay-400 ${
            isVisible ? 'opacity-100' : 'opacity-0'
          }`}>
            {stats.map((stat, index) => (
              <div
                key={index}
                className="group relative bg-white/80 dark:bg-slate-800/80 backdrop-blur-2xl rounded-3xl p-8 border border-slate-200/70 dark:border-slate-700/70 hover:border-emerald-400/80 dark:hover:border-emerald-400/80 transition-all duration-500 hover:transform hover:-translate-y-3 hover:shadow-2xl overflow-hidden"
                style={{ animationDelay: `${index * 200}ms` }}
              >
                {/* Enhanced animated background gradient */}
                <div className="absolute inset-0 bg-gradient-to-br from-blue-500/0 via-emerald-500/0 to-purple-500/0 group-hover:from-blue-500/10 group-hover:via-emerald-500/10 group-hover:to-purple-500/10 rounded-3xl opacity-0 group-hover:opacity-100 transition-all duration-700" />

                {/* Enhanced Glow effect */}
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 to-emerald-500 rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500" />

                {/* Floating particles */}
                <div className="absolute top-4 right-4 w-16 h-16 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500" />

                <div className="relative">
                  <div className="mb-6 flex justify-center transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    <div className={`w-16 h-16 bg-gradient-to-br ${stat.gradient} rounded-3xl flex items-center justify-center shadow-lg group-hover:shadow-xl transition-all duration-300`}>
                      {stat.icon}
                    </div>
                  </div>
                  <div className={`text-5xl font-black bg-gradient-to-r ${stat.gradient} bg-clip-text text-transparent mb-4 group-hover:scale-110 transition-transform duration-300`}>
                    {stat.value}
                  </div>
                  <div className="text-lg font-bold text-slate-600 dark:text-slate-400 uppercase tracking-wider group-hover:text-slate-800 dark:group-hover:text-slate-200 transition-colors duration-300">
                    {stat.label}
                  </div>
                </div>

                {/* Enhanced corner accent */}
                <div className="absolute top-0 right-0 w-24 h-24 bg-gradient-to-br from-emerald-400/20 to-transparent rounded-bl-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute bottom-0 left-0 w-16 h-16 bg-gradient-to-tr from-blue-400/15 to-transparent rounded-tr-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-500 delay-200" />
              </div>
            ))}
          </div>
        </div>
      </div>
    </div>
  )
})

export default ModernHero
