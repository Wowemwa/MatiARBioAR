import { memo, useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { Leaf, MapPin, Camera, Globe, Sparkles, ChevronLeft, ChevronRight } from 'lucide-react'

/**
 * Modern Features Component - Showcasing platform capabilities
 * with interactive carousel, smooth animations, and modern design
 */
const ModernFeatures = memo(function ModernFeatures() {
  const [currentSlide, setCurrentSlide] = useState(0)
  const [isAutoPlaying, setIsAutoPlaying] = useState(true)
  const [isTransitioning, setIsTransitioning] = useState(false)

  const features = [
    {
      icon: MapPin,
      title: 'Interactive Mapping',
      description: 'Explore biodiversity hotspots with our advanced Interactive Map system featuring real-time data and satellite imagery.',
      gradient: 'from-blue-500 to-cyan-500',
      link: '/gis',
      emoji: '🗺️'
    },
    {
      icon: Camera,
      title: 'AR Experiences',
      description: 'Immerse yourself in augmented reality to visualize species in their natural habitats using your device.',
      gradient: 'from-purple-500 to-pink-500',
      link: '/ar',
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
      description: 'Track conservation efforts, monitor endangered species, and be educated with preservation initiatives.',
      gradient: 'from-amber-500 to-orange-500',
      link: '/biodiversity',
      emoji: '🛡️'
    }
  ]

  // Auto-play functionality
  useEffect(() => {
    if (!isAutoPlaying || isTransitioning) return

    const interval = setInterval(() => {
      setIsTransitioning(true)
      setTimeout(() => {
        setCurrentSlide((prev) => (prev + 1) % features.length)
        setTimeout(() => setIsTransitioning(false), 50)
      }, 300)
    }, 5000) // Change slide every 5 seconds

    return () => clearInterval(interval)
  }, [isAutoPlaying, features.length, isTransitioning, currentSlide])

  const goToSlide = (index: number) => {
    if (isTransitioning || index === currentSlide) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide(index)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const nextSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev + 1) % features.length)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const prevSlide = () => {
    if (isTransitioning) return
    setIsTransitioning(true)
    setTimeout(() => {
      setCurrentSlide((prev) => (prev - 1 + features.length) % features.length)
      setTimeout(() => setIsTransitioning(false), 50)
    }, 300)
  }

  const currentFeature = features[currentSlide]
  const Icon = currentFeature.icon

  return (
    <section className="relative py-8 px-4 sm:px-6 lg:px-8 overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl" />
      <div className="absolute bottom-0 right-1/4 w-96 h-96 bg-emerald-400/10 rounded-full blur-3xl" />
      
      <div className="relative max-w-7xl 3xl:max-w-8xl 4xl:max-w-9xl mx-auto">
        {/* Section Header */}
        <div className="pt-0 md:pt-4 text-center mb-8 space-y-3">
          <div className="inline-flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-blue-500/10 to-emerald-500/10 backdrop-blur-sm border border-blue-500/20 rounded-full text-sm font-bold text-blue-700 dark:text-emerald-400 mb-4">
            <Sparkles className="w-4 h-4" />
            Platform Features
          </div>
          
          <h2 className="text-4xl sm:text-5xl md:text-6xl font-black leading-tight tracking-tight text-slate-900 dark:text-white">
            Powered by <span className="bg-gradient-to-r from-blue-600 via-emerald-500 to-teal-500 bg-clip-text text-transparent">Modern Technology</span>
          </h2>
          
          <p className="text-xl text-slate-600 dark:text-slate-300 max-w-3xl mx-auto leading-relaxed">
            Experience biodiversity conservation through cutting-edge tools designed for researchers, educators, and nature enthusiasts.
          </p>
        </div>

        {/* Features Carousel */}
        <div className="relative max-w-4xl mx-auto">
          {/* Main Feature Card */}
          <div className="relative overflow-hidden">
            <Link
              to={currentFeature.link}
              className={`group block relative bg-white/70 dark:bg-slate-800/70 backdrop-blur-2xl rounded-3xl p-8 md:p-12 border border-slate-200/70 dark:border-slate-700/70 hover:border-emerald-400/80 dark:hover:border-emerald-400/80 transition-all duration-500 ease-in-out hover:-translate-y-2 hover:shadow-2xl overflow-hidden ${
                isTransitioning ? 'opacity-0 transform scale-95 blur-sm' : 'opacity-100 transform scale-100 blur-0'
              }`}
            >
              {/* Animated gradient background */}
              <div className={`absolute inset-0 bg-gradient-to-br ${currentFeature.gradient} opacity-0 group-hover:opacity-10 transition-all duration-500 ease-in-out ${
                isTransitioning ? 'scale-110 opacity-5' : 'scale-100'
              }`} />

              {/* Glow effect */}
              <div className={`absolute -inset-0.5 bg-gradient-to-r ${currentFeature.gradient} rounded-3xl blur-lg opacity-0 group-hover:opacity-20 transition-all duration-500 ease-in-out ${
                isTransitioning ? 'scale-105' : 'scale-100'
              }`} />

              {/* Floating particles effect */}
              <div className={`absolute top-4 right-4 w-20 h-20 bg-gradient-to-br from-white/20 to-transparent rounded-full blur-xl opacity-0 group-hover:opacity-100 transition-all duration-500 ease-in-out ${
                isTransitioning ? 'scale-75' : 'scale-100'
              }`} />

              <div className="relative flex flex-col md:flex-row items-center gap-8 md:gap-12">
                {/* Left side - Icon and Emoji */}
                <div className={`flex-shrink-0 text-center md:text-left transition-all duration-500 ease-in-out ${
                  isTransitioning ? 'opacity-0 transform -translate-x-8 scale-90' : 'opacity-100 transform translate-x-0 scale-100'
                }`}>
                  {/* Icon container with gradient background */}
                  <div className={`inline-flex items-center justify-center w-20 h-20 md:w-24 md:h-24 bg-gradient-to-br ${currentFeature.gradient} rounded-3xl mb-6 transform group-hover:scale-110 group-hover:rotate-6 transition-all duration-500 shadow-lg`}>
                    <Icon className="w-10 h-10 md:w-12 md:h-12 text-white" strokeWidth={2.5} />
                  </div>

                  {/* Emoji accent */}
                  <div className={`text-6xl md:text-7xl opacity-20 group-hover:opacity-40 transform group-hover:scale-125 group-hover:rotate-12 transition-all duration-500`}>
                    {currentFeature.emoji}
                  </div>
                </div>

                {/* Right side - Content */}
                <div className={`flex-1 text-center md:text-left transition-all duration-500 ease-in-out delay-75 ${
                  isTransitioning ? 'opacity-0 transform translate-x-8 scale-95' : 'opacity-100 transform translate-x-0 scale-100'
                }`}>
                  <h3 className="text-3xl md:text-4xl font-bold text-slate-900 dark:text-white mb-4 group-hover:text-transparent group-hover:bg-gradient-to-r group-hover:bg-clip-text group-hover:from-blue-600 group-hover:to-emerald-500 transition-all duration-300">
                    {currentFeature.title}
                  </h3>

                  <p className="text-lg md:text-xl text-slate-600 dark:text-slate-300 leading-relaxed mb-8">
                    {currentFeature.description}
                  </p>

                  {/* Arrow link indicator */}
                                    {/* Arrow link indicator */}
                  <div className={`flex items-center justify-center md:justify-start gap-2 text-lg font-bold text-blue-600 dark:text-emerald-400 group-hover:gap-4 transition-all duration-500 ease-in-out delay-100 ${
                    isTransitioning ? 'opacity-0 transform translate-y-4' : 'opacity-100 transform translate-y-0'
                  }`}>
                    Learn More
                    <svg className="w-6 h-6 transform group-hover:translate-x-2 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                    </svg>
                  </div>
                </div>
              </div>

              {/* Bottom corner accent */}
              <div className={`absolute bottom-0 left-0 w-32 h-32 bg-gradient-to-tr ${currentFeature.gradient} opacity-0 group-hover:opacity-10 rounded-tr-3xl transition-all duration-500 ease-in-out ${
                isTransitioning ? 'scale-75 -rotate-12' : 'scale-100 rotate-0'
              }`} />
            </Link>
          </div>

          {/* Navigation Buttons */}
          <button
            onClick={prevSlide}
            className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-4 md:-translate-x-8 w-12 h-12 md:w-14 md:h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label="Previous feature"
          >
            <ChevronLeft className="w-6 h-6 md:w-7 md:h-7 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
          </button>

          <button
            onClick={nextSlide}
            className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-4 md:translate-x-8 w-12 h-12 md:w-14 md:h-14 bg-white/80 dark:bg-slate-800/80 backdrop-blur-xl rounded-full shadow-lg border border-slate-200/50 dark:border-slate-700/50 hover:bg-white dark:hover:bg-slate-800 hover:shadow-xl transition-all duration-300 flex items-center justify-center group"
            aria-label="Next feature"
          >
            <ChevronRight className="w-6 h-6 md:w-7 md:h-7 text-slate-600 dark:text-slate-300 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors duration-300" />
          </button>

          {/* Slide Indicators */}
          <div className="flex justify-center gap-3 mt-8">
            {features.map((_, index) => (
              <button
                key={index}
                onClick={() => goToSlide(index)}
                className={`w-3 h-3 rounded-full transition-all duration-500 ease-out ${
                  index === currentSlide
                    ? 'bg-blue-600 dark:bg-emerald-400 scale-125 shadow-lg'
                    : 'bg-slate-300 dark:bg-slate-600 hover:bg-slate-400 dark:hover:bg-slate-500 hover:scale-110'
                } ${isTransitioning ? 'opacity-60' : 'opacity-100'}`}
                aria-label={`Go to feature ${index + 1}`}
              />
            ))}
          </div>

          {/* Auto-play indicator */}
          <div className="flex justify-center mt-4">
            <button
              onClick={() => setIsAutoPlaying(!isAutoPlaying)}
              className="text-sm text-slate-500 dark:text-slate-400 hover:text-blue-600 dark:hover:text-emerald-400 transition-colors duration-300 flex items-center gap-2"
            >
              <div className={`w-2 h-2 rounded-full ${isAutoPlaying ? 'bg-green-500 animate-pulse' : 'bg-slate-400'}`} />
              {isAutoPlaying ? 'Auto-playing' : 'Paused'}
            </button>
          </div>
        </div>
      </div>
    </section>
  )
})

export default ModernFeatures
