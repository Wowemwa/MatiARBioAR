import { memo } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, MapPin, Camera, Globe, Sparkles, Zap } from 'lucide-react'

/**
 * Modern Features Component - Showcasing platform capabilities
 * with interactive cards, micro-animations, and modern design
 */
const ModernFeatures = memo(function ModernFeatures() {
  const features = [
    {
      icon: MapPin,
      title: 'Interactive Mapping',
      description: 'Explore biodiversity hotspots with our advanced GIS system featuring real-time data and satellite imagery.',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/gis',
      emoji: '🗺️'
    },
    {
      icon: Camera,
      title: 'AR Experiences',
      description: 'Immerse yourself in augmented reality to visualize species in their natural habitats using your device.',
      gradient: 'from-purple-500 to-pink-500',
      link: '/ar-demo',
      emoji: '📱'
    },
    {
      icon: Leaf,
      title: 'Species Database',
      description: 'Access comprehensive information on hundreds of species with photos, conservation status, and ecological data.',
      gradient: 'from-emerald-500 to-teal-500',
      link: '/biodiversity',
      emoji: '🦋'
    },
    {
      icon: Globe,
      title: 'Ecosystem Insights',
      description: 'Discover the interconnected web of life across marine, terrestrial, and freshwater ecosystems.',
      gradient: 'from-indigo-500 to-blue-500',
      link: '/biodiversity',
      emoji: '🌍'
    },
    {
      icon: Sparkles,
      title: 'Conservation Tools',
      description: 'Track conservation efforts, monitor endangered species, and contribute to preservation initiatives.',
      gradient: 'from-amber-500 to-orange-500',
      link: '/biodiversity',
      emoji: '🛡️'
    },
    {
      icon: Zap,
      title: 'Real-time Updates',
      description: 'Stay informed with live data feeds, citizen science contributions, and ecological monitoring systems.',
      gradient: 'from-rose-500 to-red-500',
      link: '/gis',
      emoji: '⚡'
    }
  ]

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl mx-auto">
        {/* Section Header */}
        <div className="text-center mb-12 space-y-4">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full text-sm font-bold text-blue-700 dark:text-emerald-400 mb-4">
            <Sparkles className="w-4 h-4" />
            Platform Features
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black text-slate-900 dark:text-white">
            Powered by
            <span className="block mt-2 bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">
              Modern Technology
            </span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience biodiversity conservation through cutting-edge tools designed for researchers, educators, and nature enthusiasts.
          </p>
        </div>

        {/* Features Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
          {features.map((feature, index) => {
            const Icon = feature.icon
            return (
              <Link
                key={index}
                to={feature.link}
                className="group relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-8 border border-slate-200/70 dark:border-slate-700/70 hover:border-emerald-400/80 dark:hover:border-emerald-400/80 transition-all duration-500 hover:-translate-y-2 hover:shadow-2xl overflow-hidden"
              >
                {/* Animated gradient background */}
                <div className={`absolute inset-0 bg-gradient-to-br ${feature.gradient} opacity-0 group-hover:opacity-10 transition-opacity duration-500`} />
                
                {/* Glow effect */}
                <div className={`absolute -inset-0.5 bg-gradient-to-r ${feature.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-opacity duration-500`} />
                
                {/* Floating particles effect */}
                <div className="absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                
                <div className="relative">
                  {/* Icon container with gradient background */}
                  <div className={`inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br ${feature.gradient} rounded-2xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-8 h-8 text-white" strokeWidth={2.5} />
                  </div>
                  
                  {/* Emoji accent */}
                  <div className="absolute top-0 right-0 text-4xl opacity-20 group-hover:opacity-40 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500">
                    {feature.emoji}
                  </div>
                  
                  <h3 className="text-2xl font-bold text-slate-900 dark:text-white mb-3 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-emerald-500 transition-all duration-300">
                    {feature.title}
                  </h3>
                  
                  <p className="text-slate-600 dark:text-slate-300 leading-relaxed mb-6">
                    {feature.description}
                  </p>
                  
                  {/* Arrow link indicator */}
                  <div className="flex items-center gap-2 text-sm font-bold text-blue-600 dark:text-emerald-400 group-hover:gap-4 transition-all duration-300">
                    Learn More
                    <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
                
                {/* Bottom corner accent */}
                <div className={`absolute bottom-0 left-0 w-24 h-24 bg-gradient-to-tr ${feature.gradient} opacity-0 group-hover:opacity-10 rounded-tr-3xl transition-opacity duration-500`} />
              </Link>
            )
          })}
        </div>

        {/* Call to Action */}
        <div className="mt-20 text-center">
          <div className="inline-flex flex-col sm:flex-row items-center gap-4">
            <Link
              to="/gis"
              className="group relative px-8 py-4 bg-gradient-to-r from-blue-600 via-emerald-600 to-teal-600 hover:from-blue-700 hover:via-emerald-700 hover:to-teal-700 text-white font-bold text-lg rounded-2xl shadow-2xl hover:shadow-emerald-500/50 transition-all duration-500 overflow-hidden transform hover:scale-105"
            >
              <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-700 transform -skew-x-12 group-hover:translate-x-full" />
              <span className="relative flex items-center gap-3">
                <MapPin className="w-5 h-5" />
                Start Exploring Now
                <svg className="w-5 h-5 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </span>
            </Link>
          </div>
        </div>
      </div>
    </section>
  )
})

export default ModernFeatures
