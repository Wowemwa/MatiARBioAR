import { useEffect, useState, memo, useRef } from 'react'
import { useData } from '../context/DataContext'
import { supabase } from '../supabaseClient'

const About = memo(function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [visitCount, setVisitCount] = useState(0)
  const [isLoadingVisits, setIsLoadingVisits] = useState(true)
  const hasTrackedVisit = useRef(false)
  const { teamMembers, species, hotspots } = useData()

  // Generate unique visitor ID based on device fingerprint
  const generateVisitorId = () => {
    const canvas = document.createElement('canvas')
    const ctx = canvas.getContext('2d')
    ctx?.fillText('fingerprint', 10, 10)
    const fingerprint = [
      navigator.userAgent,
      navigator.language,
      screen.width + 'x' + screen.height,
      new Date().getTimezoneOffset(),
      !!window.sessionStorage,
      !!window.localStorage,
      !!window.indexedDB,
      canvas.toDataURL()
    ].join('|')

    // Create a hash-like identifier
    let hash = 0
    for (let i = 0; i < fingerprint.length; i++) {
      const char = fingerprint.charCodeAt(i)
      hash = ((hash << 5) - hash) + char
      hash = hash & hash // Convert to 32-bit integer
    }
    return 'visitor_' + Math.abs(hash).toString(36)
  }

  // Track site visit and get total visitor count
  const trackVisit = async () => {
    try {
      const visitorId = generateVisitorId()
      const userAgent = navigator.userAgent

      // Check if we've already tracked this visitor today
      const today = new Date().toDateString()
      const lastTracked = localStorage.getItem('mati_last_visit_date')

      if (lastTracked === today) {
        // Already tracked today, just get the stored count
        const storedCount = localStorage.getItem('mati_visitor_count')
        if (storedCount) {
          setVisitCount(parseInt(storedCount))
          setIsLoadingVisits(false)
          return
        }
      }

      // Call the database function to track visit
      const { data, error } = await supabase.rpc('track_site_visit', {
        p_visitor_id: visitorId,
        p_user_agent: userAgent
      })

      if (error) {
        console.error('Database tracking failed:', error)
        throw error
      }

      // Update state and localStorage
      setVisitCount(data || 0)
      localStorage.setItem('mati_visitor_count', data?.toString() || '0')
      localStorage.setItem('mati_last_visit_date', today)

    } catch (error) {
      console.error('Error tracking visit:', error)

      // Fallback: increment localStorage counter
      const today = new Date().toDateString()
      const lastTracked = localStorage.getItem('mati_last_visit_date')

      if (lastTracked !== today) {
        // First visit today, increment counter
        const currentCount = parseInt(localStorage.getItem('mati_visitor_count') || '0')
        const newCount = currentCount + 1
        localStorage.setItem('mati_visitor_count', newCount.toString())
        localStorage.setItem('mati_last_visit_date', today)
        setVisitCount(newCount)
      } else {
        // Already visited today, use stored count
        const storedCount = localStorage.getItem('mati_visitor_count')
        if (storedCount) {
          setVisitCount(parseInt(storedCount))
        }
      }
    } finally {
      setIsLoadingVisits(false)
    }
  }

  useEffect(() => {
    setIsVisible(true)
    
    // Prevent multiple calls in development mode (React Strict Mode)
    if (!hasTrackedVisit.current) {
      hasTrackedVisit.current = true
      trackVisit()
    }
  }, [])

  const timeline = [
    { year: '2024', event: 'Platform founded with initial biodiversity surveys', status: 'completed', icon: '🌱' },
    { year: '2025', event: 'AR features launched and community partnerships established', status: 'completed', icon: '🎯' },
    { year: '2026', event: `Expanded to ${hotspots.length} protected areas with ${species.length} documented species`, status: 'current', icon: '📈' },
    { year: '2027', event: 'Planning international collaboration and advanced monitoring tools', status: 'planned', icon: '🚀' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800 relative overflow-hidden">
      {/* Background decorative elements */}
      <div className="absolute inset-0 overflow-hidden pointer-events-none">
        <div className="absolute -top-40 -right-40 w-80 h-80 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-3xl"></div>
        <div className="absolute -bottom-40 -left-40 w-80 h-80 bg-gradient-to-br from-emerald-400/20 to-teal-400/20 rounded-full blur-3xl"></div>
        <div className="absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 w-96 h-96 bg-gradient-to-br from-purple-400/10 to-pink-400/10 rounded-full blur-3xl"></div>
      </div>

      <div className="relative max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-20">
        {/* Hero Header */}
        <div className={`text-center mb-16 sm:mb-20 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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

        {/* Mission Statement */}
        <div className={`mb-16 sm:mb-20 transform transition-all duration-1000 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
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

        {/* Timeline */}
        <div className={`mb-16 sm:mb-20 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">📅</span>
              Our Journey
            </h2>
            <p className="text-slate-600 dark:text-slate-400">
              From concept to conservation impact
            </p>
          </div>

          <div className="relative max-w-4xl mx-auto">
            {/* Timeline line */}
            <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gradient-to-b from-blue-500 via-purple-500 to-emerald-500"></div>

            <div className="space-y-8">
              {timeline.map((item, index) => (
                <div key={index} className="relative flex items-start gap-6 group">
                  {/* Timeline dot */}
                  <div className={`relative z-10 w-16 h-16 rounded-full flex items-center justify-center text-2xl shadow-lg transition-all duration-300 ${
                    item.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-emerald-500/50' :
                    item.status === 'current' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-blue-500/50 animate-pulse' :
                    'bg-slate-400'
                  }`}>
                    {item.icon}
                  </div>

                  {/* Content */}
                  <div className="flex-1 bg-white/80 dark:bg-slate-800/80 backdrop-blur-sm rounded-xl p-6 border border-slate-200/50 dark:border-slate-700/50 hover:shadow-lg transition-all duration-300 group-hover:border-blue-300 dark:group-hover:border-emerald-500/50">
                    <div className="flex flex-col sm:flex-row sm:items-center gap-4">
                      <div className="flex-shrink-0">
                        <div className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                          {item.year}
                        </div>
                      </div>
                      <div className="flex-1">
                        <p className="text-slate-700 dark:text-slate-300 leading-relaxed">
                          {item.event}
                        </p>
                      </div>
                      <div className={`flex-shrink-0 px-3 py-1 rounded-full text-xs font-semibold ${
                        item.status === 'completed' ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' :
                        item.status === 'current' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' :
                        'bg-slate-100 text-slate-600 dark:bg-slate-700 dark:text-slate-400'
                      }`}>
                        {item.status}
                      </div>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className={`mb-16 sm:mb-20 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <span className="text-2xl">👥</span>
              Meet Our Team
            </h2>
            <p className="text-slate-600 dark:text-slate-400 max-w-2xl mx-auto">
              Passionate individuals dedicated to biodiversity conservation and technology innovation
            </p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group relative">
                <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl opacity-0 group-hover:opacity-100 blur transition-all duration-300"></div>
                <div className="relative bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-500 overflow-hidden border border-slate-200 dark:border-slate-700 group-hover:border-blue-300 dark:group-hover:border-emerald-500/50">

                  {/* Professional Header with Photo */}
                  <div className="relative overflow-hidden">
                    <div className="h-48 bg-gradient-to-br from-slate-100 via-blue-50 to-slate-200 dark:from-slate-700 dark:via-slate-600 dark:to-slate-800 flex items-center justify-center transition-all duration-500 group-hover:scale-105">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover transition-all duration-500 group-hover:scale-110"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-avatar') as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      {/* Professional Avatar Fallback */}
                      <div
                        className="fallback-avatar w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 via-purple-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-white dark:border-slate-800 transition-all duration-300 group-hover:scale-110"
                        style={{ display: member.image ? 'none' : 'flex' }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    {/* Subtle overlay */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                  </div>

                  {/* Professional Content Section */}
                  <div className="p-6">
                    {/* Name and Title */}
                    <div className="text-center mb-4">
                      <h3 className="text-xl font-bold text-slate-900 dark:text-white mb-2 group-hover:text-blue-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {member.name}
                      </h3>
                      <div className="inline-block px-3 py-1 bg-gradient-to-r from-blue-100 to-purple-100 dark:from-slate-700 dark:to-slate-600 text-blue-700 dark:text-slate-300 text-sm font-medium rounded-full border border-blue-200 dark:border-slate-500">
                        {member.role}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center mb-4">
                      {member.description}
                    </p>

                    {/* Professional accent line */}
                    <div className="flex justify-center">
                      <div className="w-16 h-1 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-full transition-all duration-300 group-hover:w-24"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

      </div>

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
                  <a href="/ar" className="text-slate-600 dark:text-slate-400 hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors duration-200">
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

export default About