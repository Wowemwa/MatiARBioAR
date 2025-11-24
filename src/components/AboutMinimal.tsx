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
    { year: '2024', event: 'Platform founded with initial biodiversity surveys', status: 'completed' },
    { year: '2025', event: 'AR features launched and community partnerships established', status: 'completed' },
    { year: '2026', event: `Expanded to ${hotspots.length} protected areas with ${species.length} documented species`, status: 'current' },
    { year: '2027', event: 'Planning international collaboration and advanced monitoring tools', status: 'planned' }
  ]

  const impact = [
    { metric: species.length.toString(), label: 'Species documented' },
    { metric: hotspots.length.toString(), label: 'Protected areas mapped' },
    { metric: isLoadingVisits ? '...' : visitCount.toLocaleString(), label: 'Unique visitors' },
    { metric: '0', label: 'Partner organizations' }
  ]

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/30 dark:from-slate-900 dark:via-slate-900 dark:to-slate-800">
      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-8 sm:py-12 lg:py-16">
        {/* Header */}
        <div className={`text-center mb-12 sm:mb-16 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-blue-600/10 dark:bg-emerald-500/10 backdrop-blur-sm border border-blue-600/20 dark:border-emerald-500/20 rounded-full text-xs sm:text-sm font-semibold text-blue-700 dark:text-emerald-400 mb-4 sm:mb-6">
            <span className="w-2 h-2 bg-blue-600 dark:bg-emerald-500 rounded-full animate-pulse"></span>
            About the Platform
          </div>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-black text-slate-900 dark:text-white mb-4 px-2">
            Mati ARBio
          </h2>
          <p className="text-base sm:text-lg text-slate-600 dark:text-slate-300 max-w-2xl mx-auto px-4">
            A digital platform connecting technology with biodiversity conservation in Mati City.
          </p>
        </div>

        {/* Timeline */}
        <div className={`mb-12 sm:mb-16 transform transition-all duration-1000 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <h3 className="text-xl sm:text-2xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 text-center flex items-center justify-center gap-2 px-4">
            <span className="text-xl sm:text-2xl">📅</span>
            Project Timeline
          </h3>
          <div className="space-y-3 sm:space-y-4">
            {timeline.map((item, index) => (
              <div key={index} className="group relative">
                <div className={`absolute -left-1 top-0 bottom-0 w-1 ${
                  item.status === 'completed' ? 'bg-gradient-to-b from-emerald-500 to-teal-500' :
                  item.status === 'current' ? 'bg-gradient-to-b from-blue-500 to-cyan-500' :
                  'bg-slate-300 dark:bg-slate-600'
                }`}></div>
                <div className="ml-4 sm:ml-6 flex flex-col sm:flex-row sm:items-center gap-3 sm:gap-6 p-3 sm:p-4 bg-white/50 dark:bg-slate-800/50 rounded-xl border border-slate-200/50 dark:border-slate-700/50 backdrop-blur-sm transition-all duration-300 hover:shadow-lg hover:border-blue-300 dark:hover:border-emerald-500/50">
                  <div className="flex-shrink-0 w-12 sm:w-16 text-center">
                    <div className="text-xs sm:text-sm font-bold text-slate-900 dark:text-white">{item.year}</div>
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="text-sm sm:text-base text-slate-700 dark:text-slate-300 leading-relaxed">{item.event}</p>
                  </div>
                  <div className="flex-shrink-0 self-start sm:self-center">
                    <div className={`w-3 h-3 rounded-full ${
                      item.status === 'completed' ? 'bg-gradient-to-br from-emerald-500 to-teal-500 shadow-lg shadow-emerald-500/50' :
                      item.status === 'current' ? 'bg-gradient-to-br from-blue-500 to-cyan-500 shadow-lg shadow-blue-500/50 animate-pulse' :
                      'bg-slate-400'
                    }`}></div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Meet the Team */}
        <div className={`mb-12 sm:mb-16 transform transition-all duration-1000 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-8 sm:mb-12 px-4">
            <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-3 flex items-center justify-center gap-2">
              <span className="text-2xl sm:text-3xl">👥</span>
              Meet the Team
            </h3>
            <p className="text-sm sm:text-base text-slate-600 dark:text-slate-400">The people behind Mati ARBio</p>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6 sm:gap-8">
            {teamMembers.map((member, index) => (
              <div key={index} className="group">
                <div className="bg-white dark:bg-slate-800 rounded-xl shadow-lg hover:shadow-2xl transition-all duration-300 overflow-hidden border border-slate-200 dark:border-slate-700">
                  {/* Professional Header with Photo */}
                  <div className="relative">
                    <div className="h-48 bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-700 dark:to-slate-600 flex items-center justify-center">
                      {member.image ? (
                        <img
                          src={member.image}
                          alt={member.name}
                          className="w-full h-full object-cover"
                          onError={(e) => {
                            e.currentTarget.style.display = 'none'
                            const fallback = e.currentTarget.parentElement?.querySelector('.fallback-avatar') as HTMLElement
                            if (fallback) fallback.style.display = 'flex'
                          }}
                        />
                      ) : null}
                      {/* Professional Avatar Fallback */}
                      <div
                        className="fallback-avatar w-20 h-20 rounded-full bg-gradient-to-br from-blue-500 to-indigo-600 flex items-center justify-center text-white text-xl font-bold shadow-lg border-4 border-white dark:border-slate-800"
                        style={{ display: member.image ? 'none' : 'flex' }}
                      >
                        {member.name.split(' ').map(n => n[0]).join('').toUpperCase()}
                      </div>
                    </div>
                    {/* Subtle overlay for better text contrast */}
                    <div className="absolute inset-0 bg-gradient-to-t from-black/20 to-transparent"></div>
                  </div>

                  {/* Professional Content Section */}
                  <div className="p-6">
                    {/* Name and Title */}
                    <div className="text-center mb-4">
                      <h4 className="text-xl font-bold text-slate-900 dark:text-white mb-1">
                        {member.name}
                      </h4>
                      <div className="inline-block px-3 py-1 bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 text-sm font-medium rounded-full">
                        {member.role}
                      </div>
                    </div>

                    {/* Description */}
                    <p className="text-sm text-slate-600 dark:text-slate-400 leading-relaxed text-center">
                      {member.description}
                    </p>

                    {/* Professional accent line */}
                    <div className="mt-4 pt-4 border-t border-slate-200 dark:border-slate-700">
                      <div className="w-12 h-1 bg-gradient-to-r from-blue-500 to-indigo-600 rounded-full mx-auto"></div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Impact Section */}
        <div className={`mb-12 sm:mb-16 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative group">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-emerald-500 to-teal-500 rounded-2xl opacity-20 group-hover:opacity-30 blur transition-opacity duration-300"></div>
            <div className="relative bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-2xl p-4 sm:p-6 lg:p-8 border border-slate-200/50 dark:border-slate-700/50">
              <h3 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-6 sm:mb-8 text-center flex items-center justify-center gap-2 px-4">
                <span className="text-2xl sm:text-3xl">📊</span>
                Our Impact
              </h3>
              <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 lg:gap-6">
                {impact.map((item, index) => (
                  <div key={index} className="text-center p-3 sm:p-4 lg:p-6 bg-gradient-to-br from-emerald-50 to-teal-50/50 dark:from-slate-700/50 dark:to-slate-700/30 rounded-xl border border-emerald-200/50 dark:border-slate-600/50 transition-all duration-300 hover:shadow-xl hover:scale-105 sm:hover:scale-110">
                    <div className="text-2xl sm:text-3xl lg:text-4xl font-black bg-gradient-to-r from-emerald-600 to-teal-600 bg-clip-text text-transparent mb-1 sm:mb-2">{item.metric}</div>
                    <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 font-medium leading-tight">{item.label}</div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>

        {/* Mission Statement */}
        <div className={`text-center transform transition-all duration-1000 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative group max-w-4xl mx-auto">
            <div className="absolute -inset-0.5 bg-gradient-to-r from-blue-500 via-purple-500 to-emerald-500 rounded-xl opacity-20 group-hover:opacity-30 blur-lg transition-opacity duration-300"></div>
            <div className="relative p-4 sm:p-6 lg:p-8 bg-white/50 dark:bg-slate-800/50 backdrop-blur-sm rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="inline-flex items-center gap-2 px-3 sm:px-4 py-2 bg-purple-600/10 dark:bg-purple-500/10 backdrop-blur-sm border border-purple-600/20 dark:border-purple-500/20 rounded-full text-xs sm:text-sm font-semibold text-purple-700 dark:text-purple-400 mb-4 sm:mb-6">
                <span className="text-lg sm:text-xl">🎯</span>
                Our Mission
              </div>
              <p className="text-base sm:text-lg text-slate-700 dark:text-slate-300 leading-relaxed px-2 sm:px-0">
                To create accessible tools for biodiversity documentation and conservation education,
                bridging the gap between scientific research and public understanding through technology.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})

export default About