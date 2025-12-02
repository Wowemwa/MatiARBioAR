import { useEffect, useState, memo, useRef } from 'react'
import { useData } from '../context/DataContext'
import { supabase } from '../supabaseClient'
import FeedbackFloating from './FeedbackFloating'
import { HiMapPin, HiSparkles, HiDocumentText, HiAcademicCap, HiLightBulb, HiGlobeAlt, HiUsers } from 'react-icons/hi2'
import { BiLeaf, BiWorld } from 'react-icons/bi'
import { GiMicroscope } from 'react-icons/gi'

const About = memo(function About() {
  const [isVisible, setIsVisible] = useState(false)
  const [visitCount, setVisitCount] = useState(0)
  const [isLoadingVisits, setIsLoadingVisits] = useState(true)
  const [showPrivacyModal, setShowPrivacyModal] = useState(false)
  const [showFeedbackModal, setShowFeedbackModal] = useState(false)
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
              <HiSparkles className="w-4 h-4 text-emerald-500" />
              Augmented Reality
            </div>
            <div className="flex items-center gap-2">
              <HiDocumentText className="w-4 h-4 text-blue-500" />
              Biodiversity Data
            </div>
            <div className="flex items-center gap-2">
              <HiAcademicCap className="w-4 h-4 text-purple-500" />
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
                  <HiLightBulb className="w-5 h-5" />
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
                    <BiLeaf className="w-8 h-8 text-emerald-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Preserve</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Protect biodiversity through education</p>
                  </div>
                  <div className="p-4">
                    <GiMicroscope className="w-8 h-8 text-blue-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Research</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Support scientific discovery and monitoring</p>
                  </div>
                  <div className="p-4">
                    <BiWorld className="w-8 h-8 text-purple-500 mx-auto mb-3" />
                    <h3 className="font-bold text-slate-900 dark:text-white mb-1">Connect</h3>
                    <p className="text-sm text-slate-600 dark:text-slate-400">Build community and global partnerships</p>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Meet the Team */}
        <div className={`mb-16 sm:mb-20 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="text-center mb-12">
            <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white mb-4 flex items-center justify-center gap-2">
              <HiUsers className="w-8 h-8 text-blue-500" />
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

            {/* Connect */}
            <div>
              <h4 className="text-lg font-bold text-slate-900 dark:text-white mb-4">Built With</h4>
              <div className="flex flex-wrap gap-4">
                {/* React */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 100 100" className="w-8 h-8">
                    <circle cx="50" cy="50" r="8" fill="#61DAFB"/>
                    <path d="M50 8C27.9 8 10 25.9 10 48s17.9 40 40 40 40-17.9 40-40S72.1 8 50 8zm0 72c-17.7 0-32-14.3-32-32s14.3-32 32-32 32 14.3 32 32-14.3 32-32 32z" fill="#61DAFB"/>
                    <path d="M50 28c-11 0-20 9-20 20s9 20 20 20 20-9 20-20-9-20-20-20zm0 32c-7.7 0-14-6.3-14-14s6.3-14 14-14 14 6.3 14 14-6.3 14-14 14z" fill="#61DAFB"/>
                    <ellipse cx="35" cy="48" rx="3" ry="12" fill="#61DAFB"/>
                    <ellipse cx="65" cy="48" rx="3" ry="12" fill="#61DAFB"/>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">React</span>
                </div>

                {/* TypeScript */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#3178C6">
                    <path d="M1.125 0C.502 0 0 .502 0 1.125v21.75C0 23.498.502 24 1.125 24h21.75c.623 0 1.125-.502 1.125-1.125V1.125C24 .502 23.498 0 22.875 0zm17.363 9.02c.117-.103.233-.215.338-.327.678-.677 1.231-1.521 1.231-2.502 0-1.739-1.407-3.156-3.146-3.156-.866 0-1.658.345-2.249.938-.591.593-.938 1.384-.938 2.25 0 .966.549 1.81 1.227 2.487.11.112.226.224.343.336L12 17.438l-4.688-8.438c.117-.112.233-.224.343-.336.678-.677 1.231-1.521 1.231-2.502 0-1.739-1.407-3.156-3.146-3.156C4.216 3.02 3.424 3.365 2.833 3.958.944 5.847.944 9.02.944 9.02c0 1.98.552 3.824 1.23 4.501.11.112.226.224.343.336L12 21.438l8.482-12.438z"/>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">TypeScript</span>
                </div>

                {/* Vite */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 32 32" className="w-8 h-8" fill="#646CFF">
                    <path d="M29.883 13.2c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L16 22.345 6.437 13.2c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L0 15.2c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718L16 9.655l11.68 5.545c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718l-2.117-2z"/>
                    <path d="M29.883 18.8c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L16 27.945 6.437 18.8c-.624-.455-1.377-.718-2.16-.718-.783 0-1.536.263-2.16.718L0 20.8c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718L16 15.255l11.68 5.545c.624.455 1.377.718 2.16.718.783 0 1.536-.263 2.16-.718l-2.117-2z"/>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Vite</span>
                </div>

                {/* Supabase */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 109 113" className="w-8 h-8" fill="#3ECF8E">
                    <path d="M63.568 38.808c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16zM54.104 47.128c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16z"/>
                    <path d="M21.568 57.808c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16z"/>
                    <path d="M87.568 47.128c-.28-.14-.616-.14-.896 0l-8.32 4.16c-.28.14-.448.42-.448.728v8.32c0 .308.168.588.448.728l8.32 4.16c.28.14.616.14.896 0l8.32-4.16c.28-.14.448-.42.448-.728v-8.32c0-.308-.168-.588-.448-.728l-8.32-4.16z"/>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Supabase</span>
                </div>

                {/* Tailwind */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 54 33" className="w-8 h-8" fill="#06B6D4">
                    <path d="M27 0c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C30.744 13.09 33.808 16.2 40.5 16.2c7.2 0 11.7-3.6 13.5-10.8-2.7 3.6-5.85 4.95-9.45 4.05-2.054-.513-3.522-2.004-5.147-3.653C23.256 2.31 20.192-.8 13.5-.8c-7.2 0-11.7 3.6-13.5 10.8 2.7-3.6 5.85-4.95 9.45-4.05 2.054.513 3.522 2.004 5.147 3.653C6.744 9.69 3.68 12.8 0 12.8c-7.2 0-11.7-3.6-13.5-10.8C-10.8 9 2.35 12.6 9.45 12.6c2.7 0 5.55-.9 8.55-2.85C21.3 6.75 25.35 4.05 27 0z"/>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">Tailwind</span>
                </div>

                {/* A-Frame */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 24 24" className="w-8 h-8" fill="#EF2D5E">
                    <path d="M12 2L2 7l10 5 10-5-10-5zM2 17l10 5 10-5M2 12l10 5 10-5"/>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">A-Frame</span>
                </div>

                {/* AR.js */}
                <div className="flex flex-col items-center gap-2 p-2 bg-white/50 dark:bg-slate-700/50 rounded-lg hover:bg-white/70 dark:hover:bg-slate-700/70 transition-colors">
                  <svg viewBox="0 0 100 100" className="w-8 h-8" fill="#000000">
                    <text x="50" y="35" text-anchor="middle" font-family="Arial, sans-serif" font-size="24" font-weight="bold" fill="#000">AR</text>
                    <text x="50" y="55" text-anchor="middle" font-family="Arial, sans-serif" font-size="16" fill="#666">.js</text>
                  </svg>
                  <span className="text-xs text-slate-600 dark:text-slate-400 font-medium">AR.js</span>
                </div>
              </div>
            </div>
          </div>

          {/* Copyright */}
          <div className="pt-8 border-t border-slate-200/50 dark:border-slate-700/50 text-center">
            <div className="flex flex-col sm:flex-row justify-between items-center gap-4">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                © 2025 Mati Biodiversity Platform. Conserving nature through technology.
              </p>
              <div className="flex gap-6 text-sm text-slate-500 dark:text-slate-400">
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowPrivacyModal(true)
                  }} 
                  className="hover:text-emerald-600 dark:hover:text-emerald-400 transition-colors cursor-pointer"
                >
                  Privacy
                </button>
                <button 
                  type="button"
                  onClick={(e) => {
                    e.preventDefault()
                    setShowFeedbackModal(true)
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

      {/* Privacy Policy Modal */}
      {showPrivacyModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-4xl w-full max-h-[90vh] overflow-y-auto bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Privacy Policy</h2>
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Content */}
            <div className="p-6 space-y-6 text-slate-700 dark:text-slate-300">
              <div className="text-sm text-slate-500 dark:text-slate-400 mb-6">
                Last updated: November 27, 2025
              </div>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">1. Introduction</h3>
                <p className="leading-relaxed">
                  Mati ARBio ("we," "our," or "us") is committed to protecting your privacy and ensuring compliance with the Data Privacy Act of 2012 (Republic Act No. 10173) and other relevant Philippine cybersecurity laws and regulations. This Privacy Policy explains how we collect, use, disclose, and safeguard your information when you use our biodiversity exploration platform.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">2. Information We Collect</h3>
                <div className="space-y-4">
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Personal Information</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Name and contact information (when voluntarily provided)</li>
                      <li>Device information and browser fingerprints for security purposes</li>
                      <li>IP addresses and geolocation data for regional content delivery</li>
                      <li>Usage patterns and interaction data for platform improvement</li>
                    </ul>
                  </div>
                  <div>
                    <h4 className="font-medium text-slate-900 dark:text-white mb-2">Technical Data</h4>
                    <ul className="list-disc list-inside space-y-1 text-sm">
                      <li>Browser type, version, and operating system</li>
                      <li>Device characteristics and screen resolution</li>
                      <li>Access times and referring website URLs</li>
                      <li>Pages viewed and time spent on our platform</li>
                    </ul>
                  </div>
                </div>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">3. Legal Basis for Processing</h3>
                <p className="leading-relaxed mb-4">
                  In accordance with the Data Privacy Act of 2012, we process your personal data based on the following lawful bases:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Consent:</strong> When you voluntarily provide information or agree to our terms</li>
                  <li><strong>Legitimate Interest:</strong> To improve our services and ensure platform security</li>
                  <li><strong>Legal Obligation:</strong> To comply with Philippine laws and regulations</li>
                  <li><strong>Contract:</strong> To fulfill our obligations in providing biodiversity services</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">4. How We Use Your Information</h3>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>Provide and maintain our biodiversity exploration platform</li>
                  <li>Ensure cybersecurity and prevent unauthorized access</li>
                  <li>Analyze usage patterns to improve user experience</li>
                  <li>Comply with legal obligations under Philippine law</li>
                  <li>Communicate important updates about conservation efforts</li>
                  <li>Support environmental education and research initiatives</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">5. Data Sharing and Disclosure</h3>
                <p className="leading-relaxed mb-4">
                  We do not sell, trade, or otherwise transfer your personal information to third parties except in the following circumstances:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>With your explicit consent</li>
                  <li>To comply with legal obligations or court orders</li>
                  <li>To protect our rights, property, or safety</li>
                  <li>With trusted partners for biodiversity research (anonymized data only)</li>
                  <li>In connection with a business transfer or acquisition</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">6. Cybersecurity Measures</h3>
                <p className="leading-relaxed mb-4">
                  In compliance with Republic Act No. 11038 (Expanded National Integrated Protected Areas System Act) and related cybersecurity regulations, we implement robust security measures:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li>SSL/TLS encryption for all data transmission</li>
                  <li>Regular security audits and vulnerability assessments</li>
                  <li>Access controls and authentication mechanisms</li>
                  <li>Data minimization and retention policies</li>
                  <li>Incident response and breach notification procedures</li>
                  <li>Employee training on data protection and cybersecurity</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">7. Your Rights Under Philippine Law</h3>
                <p className="leading-relaxed mb-4">
                  Under the Data Privacy Act of 2012, you have the following rights:
                </p>
                <ul className="list-disc list-inside space-y-2 text-sm">
                  <li><strong>Right to be Informed:</strong> Know what personal data we collect and how we use it</li>
                  <li><strong>Right to Access:</strong> Request copies of your personal data</li>
                  <li><strong>Right to Rectification:</strong> Correct inaccurate or incomplete data</li>
                  <li><strong>Right to Erasure:</strong> Request deletion of your personal data</li>
                  <li><strong>Right to Object:</strong> Object to processing in certain circumstances</li>
                  <li><strong>Right to Data Portability:</strong> Receive your data in a structured format</li>
                </ul>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">8. Data Retention</h3>
                <p className="leading-relaxed">
                  We retain your personal information only as long as necessary to fulfill the purposes outlined in this Privacy Policy, unless a longer retention period is required by law. Technical data for cybersecurity purposes is retained for a maximum of 3 years in accordance with Philippine data protection regulations.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">9. Cookies and Tracking</h3>
                <p className="leading-relaxed">
                  We use essential cookies and similar technologies to ensure platform functionality and security. These help us prevent unauthorized access and maintain service availability. You can control cookie preferences through your browser settings, though disabling essential cookies may affect platform functionality.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">10. International Data Transfers</h3>
                <p className="leading-relaxed">
                  Some of our service providers may be located outside the Philippines. When we transfer personal data internationally, we ensure adequate protection through standard contractual clauses or other legally recognized safeguards in compliance with Philippine data protection laws.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">11. Children's Privacy</h3>
                <p className="leading-relaxed">
                  Our platform is designed for environmental education and is not intended for children under 13. We do not knowingly collect personal information from children under 13. If we become aware that we have collected such information, we will take steps to delete it promptly.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">12. Changes to This Policy</h3>
                <p className="leading-relaxed">
                  We may update this Privacy Policy periodically to reflect changes in our practices or legal requirements. We will notify users of material changes through our platform or via email. Continued use of our services after such changes constitutes acceptance of the updated policy.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">13. Contact Information</h3>
                <p className="leading-relaxed mb-4">
                  For questions, concerns, or to exercise your data privacy rights, please contact our Data Protection Officer:
                </p>
                <div className="bg-slate-50 dark:bg-slate-700 p-4 rounded-lg">
                  <p className="text-sm"><strong>Mati ARBio Data Protection Officer</strong></p>
                  <p className="text-sm">Email: privacy@matiarbio.ph</p>
                  <p className="text-sm">Address: Mati City, Davao Oriental, Philippines</p>
                  <p className="text-sm">Phone: +63 (82) 388-xxxx</p>
                </div>
                <p className="text-sm mt-4">
                  You may also file complaints with the National Privacy Commission (NPC) at privacy.gov.ph or call their hotline at 02-914-2696.
                </p>
              </section>

              <section>
                <h3 className="text-xl font-semibold text-slate-900 dark:text-white mb-4">14. Governing Law</h3>
                <p className="leading-relaxed">
                  This Privacy Policy is governed by and construed in accordance with the laws of the Republic of the Philippines, particularly Republic Act No. 10173 (Data Privacy Act of 2012) and related cybersecurity regulations.
                </p>
              </section>
            </div>

            {/* Footer */}
            <div className="border-t border-slate-200 dark:border-slate-700 p-6 rounded-b-2xl">
              <div className="flex justify-end">
                <button
                  onClick={() => setShowPrivacyModal(false)}
                  className="px-6 py-2 bg-emerald-600 hover:bg-emerald-700 text-white font-medium rounded-lg transition-colors"
                >
                  Close
                </button>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Feedback Modal */}
      {showFeedbackModal && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm">
          <div className="relative max-w-md w-full bg-white dark:bg-slate-800 rounded-2xl shadow-2xl border border-slate-200 dark:border-slate-700">
            {/* Header */}
            <div className="sticky top-0 bg-white dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 p-6 rounded-t-2xl">
              <div className="flex items-center justify-between">
                <h2 className="text-2xl font-bold text-slate-900 dark:text-white">Contact Support</h2>
                <button
                  onClick={() => setShowFeedbackModal(false)}
                  className="p-2 hover:bg-slate-100 dark:hover:bg-slate-700 rounded-lg transition-colors"
                >
                  <svg className="w-6 h-6 text-slate-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>
              </div>
            </div>

            {/* Feedback Content */}
            <div className="p-6">
              <div className="text-center mb-6">
                <div className="w-16 h-16 bg-gradient-to-br from-blue-500 to-emerald-400 rounded-full flex items-center justify-center text-white text-2xl mx-auto mb-4">
                  💬
                </div>
                <h3 className="text-lg font-semibold text-slate-900 dark:text-white mb-2">Share Your Feedback</h3>
                <p className="text-sm text-slate-600 dark:text-slate-400">
                  Help us improve the Mati ARBio platform. Your feedback is valuable to our conservation efforts.
                </p>
              </div>

              {/* Embed the FeedbackFloating component */}
              <div className="relative">
                <FeedbackFloating />
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  )
})

export default About