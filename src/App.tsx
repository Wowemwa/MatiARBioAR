import React, { useEffect, useMemo, useState, lazy, Suspense, memo, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, NavLink, useLocation } from 'react-router-dom'
import useTheme from './useTheme'
import { Card, SoftCard, Badge, Button, SectionTitle, MediaThumb } from './components/UI'
import AnimatedText from './components/AnimatedText'
import Atmosphere from './components/Atmosphere'
import ModernHome from './components/ModernHome'
import { WaveIcon, MountainIcon, SpeciesIcon, ARIcon, InfoIcon, MapIcon, EducationIcon, TechIcon, ConservationIcon, LeafIcon } from './components/Icons'
import { HiMapPin } from 'react-icons/hi2'
import { GiButterfly } from 'react-icons/gi'
import { MdAutoAwesome, MdWbSunny, MdNightlight } from 'react-icons/md'
import { IoInformationCircle } from 'react-icons/io5'
import useScrollPosition from './hooks/useScrollPosition'
import { DataProvider, useData } from './context/DataContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import ErrorBoundary from './components/ErrorBoundary'
import PerformanceMonitor from './components/PerformanceMonitor'
import FeedbackFloating from './components/FeedbackFloating'
import { PageLoadingFallback, MapLoadingFallback } from './components/LoadingSpinner'
import About from './components/AboutMinimal'
import { initProgressiveEnhancement } from './utils/progressive-enhancement'
import { DeviceProvider, useDeviceDetection } from './context/DeviceContext'
import SecretAdminPage from './components/SecretAdminPage'
import ARQRViewer from './components/ARQRViewer'
import type { Hotspot, SpeciesDetail } from './data/hotspots'

type HotspotFormValues = Omit<Hotspot, 'lat' | 'lng' | 'areaHectares' | 'image'> & {
  lat: number | ''
  lng: number | ''
  areaHectares?: number | ''
  image?: string
}

type SpeciesFormValues = Omit<SpeciesDetail, 'images'> & {
  images: string[]
}

const createHotspotFormValues = (initialData?: Hotspot): HotspotFormValues => {
  if (!initialData) {
    return {
      id: '',
      name: '',
      type: 'terrestrial',
      barangay: '',
      city: 'Mati City',
      province: 'Davao Oriental',
      designation: '',
      areaHectares: '',
      lat: '',
      lng: '',
      summary: '',
      description: '',
      features: [],
      stewardship: '',
      image: '',
      tags: [],
      highlightSpeciesIds: [],
      floraIds: [],
      faunaIds: [],
      visitorNotes: '',
    }
  }

  return {
    ...initialData,
    areaHectares: initialData.areaHectares ?? '',
    image: initialData.image ?? '',
    lat: initialData.lat,
    lng: initialData.lng,
    features: [...initialData.features],
    tags: [...initialData.tags],
    highlightSpeciesIds: [...initialData.highlightSpeciesIds],
    floraIds: [...initialData.floraIds],
    faunaIds: [...initialData.faunaIds],
    visitorNotes: initialData.visitorNotes ?? '',
  }
}

const createSpeciesFormValues = (initialData?: SpeciesDetail): SpeciesFormValues => {
  if (!initialData) {
    return {
      id: '',
      category: 'flora',
      commonName: '',
      scientificName: '',
      status: 'LC',
      habitat: '',
      blurb: '',
      siteIds: [],
      highlights: [],
      images: [],
    }
  }

  return {
    ...initialData,
    highlights: [...initialData.highlights],
    siteIds: [...initialData.siteIds],
    images: initialData.images ? [...initialData.images] : [],
  }
}

// Lazy load all heavy components for better code splitting and performance
const BiodiversityExplorer = lazy(() => import('./pages/BiodiversityExplorer'))
const SpeciesDetail = lazy(() => import('./pages/SpeciesDetail'))
const GISMapPage = lazy(() => import('./components/GISMapPage'))

const ThemeToggle = memo(function ThemeToggle() {
  const { theme, toggleTheme, isMobile } = useTheme()
  
  const handleToggle = useCallback(() => {
    if (!isMobile) {
      toggleTheme()
    }
  }, [toggleTheme, isMobile])

  const Component = isMobile ? 'div' : 'button'
  
  return (
    <Component
      onClick={handleToggle}
      className={`group relative inline-flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-white/40 dark:border-white/20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl hover:scale-105 transition-all duration-300 ease-out shadow-lg hover:shadow-xl overflow-hidden ${isMobile ? '' : 'cursor-pointer'}`}
      aria-label={isMobile ? "Auto theme (time-based)" : "Toggle dark mode"}
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-blue-600/20 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
      <div className="relative z-10 transition-transform duration-300 ease-out group-hover:scale-105">
        <div
          className={`transition-transform duration-500 ease-out ${
            theme === 'dark'
              ? 'rotate-0 opacity-100'
              : '-rotate-180 opacity-100'
          }`}
        >
          {theme === 'dark' ? <MdNightlight className="w-6 h-6" /> : <MdWbSunny className="w-6 h-6" />}
        </div>
      </div>
      <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none whitespace-nowrap">
        {isMobile ? (
          theme === 'dark' ? 'Auto: Night Mode' : 'Auto: Day Mode'
        ) : (
          theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'
        )}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-white"></div>
      </div>
      {isMobile && (
        <div className="absolute -top-8 left-1/2 transform -translate-x-1/2 bg-blue-500 text-white text-xs font-semibold px-2 py-1 rounded opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none whitespace-nowrap">
          Auto Theme
          <div className="absolute bottom-0 left-1/2 transform -translate-x-1/2 translate-y-1/2 rotate-45 w-2 h-2 bg-blue-500"></div>
        </div>
      )}
    </Component>
  )
})

const Navbar = memo(function Navbar() {
  const { hotspots, species, loading } = useData()
  const { isAdmin, logout } = useAdmin()
  const [open, setOpen] = useState(false)
  const scrolled = useScrollPosition(8)
  const location = useLocation()
  const navigate = useNavigate()
  const { isMobileView, deviceInfo } = useDeviceDetection()
  const navItems = useMemo(() => [
    { to: '/gis', label: 'GIS Map', badge: <HiMapPin className="w-5 h-5" /> },
    { to: '/biodiversity', label: 'Biodiversity', badge: <GiButterfly className="w-5 h-5" /> },
    { to: '/ar', label: 'Augmented Reality', badge: <MdAutoAwesome className="w-5 h-5" /> },
    ...(isAdmin ? [{ to: '/mati-secret-admin-2024', label: 'Admin', badge: '👑', adminOnly: true }] : []),
    { to: '/about', label: 'About', badge: <IoInformationCircle className="w-5 h-5" /> },
  ], [isAdmin])

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-500 ${
        isMobileView 
          ? `mx-1 mt-1 ${deviceInfo.isIOS ? 'top-safe-area-inset-top' : ''}` 
          : 'mx-2 mt-2 hover:mx-1 hover:mt-1'
      } rounded-2xl overflow-hidden`}>
      <div
        className={`relative border transition-all duration-700 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/70 dark:border-slate-700/50 shadow-2xl backdrop-blur-2xl'
            : 'bg-white/90 dark:bg-slate-900/90 border-slate-200/50 dark:border-slate-700/30 backdrop-blur-xl shadow-xl'
        } ${isMobileView ? 'rounded-xl' : 'rounded-2xl hover:rounded-3xl'}`}
      >
        {/* Enhanced gradient overlays */}
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-blue-50/40 via-emerald-50/30 to-purple-50/40 dark:from-blue-900/10 dark:via-emerald-900/10 dark:to-purple-900/10 opacity-60" />
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-transparent via-white/30 to-transparent dark:via-slate-700/20" />
        
        {/* Animated gradient border */}
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-emerald-400/60 to-transparent dark:via-emerald-500/40" />
        <div className="pointer-events-none absolute inset-x-0 top-0 h-px bg-gradient-to-r from-transparent via-blue-400/40 to-transparent dark:via-blue-500/30" />
        <div className="relative mx-auto flex max-w-screen-2xl flex-col gap-2 px-3 pt-2 pb-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group relative flex items-center gap-3 font-black text-2xl lg:text-3xl tracking-tight transition-all duration-500 hover:scale-[1.03]"
              onClick={() => setOpen(false)}
            >
              <div className="relative">
                {/* Glow effect on hover */}
                <div className="absolute inset-0 bg-gradient-to-r from-green-500 via-blue-500 to-purple-500 blur-xl opacity-0 group-hover:opacity-30 transition-opacity duration-500" />
                
                <span className="relative bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent group-hover:from-green-500 group-hover:via-blue-500 group-hover:to-purple-500 transition-all duration-500">
                  Mati
                </span>
                <span className="relative ml-1 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent group-hover:from-green-400 group-hover:to-emerald-400 transition-all duration-500">
                  AR
                </span>
                <span className="relative bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent group-hover:from-blue-500 group-hover:to-cyan-500 transition-all duration-500">
                  Bio
                </span>
                
                {/* Enhanced pulse dot */}
                <div className="absolute -top-1 -right-2 h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-70 group-hover:opacity-100 transition-opacity animate-pulse">
                  <div className="absolute inset-0 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-ping opacity-75" />
                </div>
              </div>
              <div className="flex flex-col leading-tight text-left text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Biodiversity Explorer</span>
                <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  powered by ar.js • leaflet • openstreetmap
                  {deviceInfo.isIOS && ' • iOS'}
                  {deviceInfo.isAndroid && ' • Android'}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <ThemeToggle />
              {isAdmin && (
                <button
                  type="button"
                  onClick={() => logout()}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/50 bg-emerald-500/15 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition-all duration-300 hover:bg-emerald-500/20 hover:text-emerald-900 hover:shadow-md hover:scale-105 dark:border-emerald-400/40 dark:bg-emerald-500/20 dark:text-emerald-200"
                >
                  Exit preview
                </button>
              )}
              <Link
                to="/ar"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-all duration-500 hover:scale-105 hover:shadow-xl hover:-translate-y-0.5"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 transform -skew-x-12 group-hover:translate-x-full" />
                
                <span className="relative z-10 flex items-center gap-2">
                  <ARIcon className="h-4 w-4 group-hover:rotate-12 transition-transform duration-300" />
                  <span>Launch AR</span>
                </span>
              </Link>
            </div>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className={`md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-all duration-500 ${
                open
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent text-white shadow-xl scale-110'
                  : 'border-slate-300/70 text-gray-700 hover:bg-white/80 hover:shadow-lg hover:scale-105 dark:border-slate-600/50 dark:text-gray-200 dark:hover:bg-slate-800/80'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-all duration-500 ${open ? 'rotate-90 scale-110' : 'rotate-0'}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2.5} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/50 bg-emerald-100/90 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 dark:border-emerald-400/40 dark:bg-emerald-900/50 dark:text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Beta Testing
              </span>
            </div>
            <div className="relative flex items-center gap-2 rounded-full border-2 border-emerald-300/70 bg-gradient-to-r from-emerald-100/95 via-teal-100/95 to-blue-100/95 px-3 pt-1 pb-2 shadow-2xl backdrop-blur-3xl transition-all duration-500 hover:shadow-3xl hover:border-emerald-400/80 dark:border-emerald-400/60 dark:bg-gradient-to-r dark:from-emerald-800/80 dark:via-teal-800/80 dark:to-blue-800/80">
              {/* Animated gradient overlays */}
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 rounded-full animate-[gradient-bg_6s_ease-in-out_infinite] opacity-50" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-blue-400/15 via-purple-400/15 to-emerald-400/15 rounded-full animate-[gradient-bg_8s_ease-in-out_infinite_reverse] opacity-50" />
              <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-white/5 rounded-full shadow-inner" />
              
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.to)
                const isAdminItem = 'adminOnly' in item && item.adminOnly
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`group relative z-10 inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-500 ${
                      isActive
                        ? isAdminItem
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-xl scale-110'
                          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white shadow-xl scale-110'
                        : isAdminItem
                            ? 'text-purple-700 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/90 dark:hover:bg-purple-900/70 hover:scale-105 hover:shadow-lg'
                            : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/90 dark:hover:bg-slate-700/70 hover:scale-105 hover:shadow-lg'
                    }`}
                  >
                    {/* Glow effect for active state */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/30 via-teal-500/30 to-blue-500/30 blur-xl" />
                    )}
                    
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-base transition-all duration-500 ${
                      isActive
                        ? 'bg-white/25 text-white shadow-lg'
                        : isAdminItem
                            ? 'bg-purple-100/90 dark:bg-purple-900/50 border border-purple-200/90 dark:border-purple-700/70 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/70 group-hover:scale-110'
                            : 'bg-white/70 dark:bg-slate-600/70 border border-white/90 dark:border-slate-500/70 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/40 group-hover:scale-110'
                    }`}>
                      {item.badge}
                    </span>
                    
                    <div className="flex flex-col items-start">
                      <span className="leading-tight">{item.label}</span>
                    </div>
                  </NavLink>
                )
              })}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-blue-200/70 bg-blue-50/90 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm transition-all duration-300 hover:shadow-md hover:scale-105 dark:border-blue-700/50 dark:bg-blue-900/40 dark:text-blue-300">
              <MapIcon className="h-4 w-4 text-blue-500" />
              <span>Mati, Davao Oriental</span>
            </div>
          </div>

          <div className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-500 ease-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className={`space-y-3 rounded-2xl border border-slate-200/70 bg-white/95 p-4 shadow-2xl backdrop-blur-2xl dark:border-slate-700/50 dark:bg-slate-900/95 ${isMobileView ? 'rounded-xl p-3 space-y-2' : ''}`}>
              {navItems.map((item) => {
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => {
                      return `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-500 ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-xl scale-[1.03]'
                          : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/30 hover:shadow-lg hover:scale-[1.02]'
                      }`
                    }}
                    onClick={() => setOpen(false)}
                  >
                    {({ isActive }) => (
                      <>
                        <div className="flex items-center gap-3">
                          <span className={`flex h-8 w-8 items-center justify-center rounded-full text-lg ${
                            isActive 
                              ? 'bg-white/20 text-white' 
                              : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600'
                          }`}>
                            {item.badge}
                          </span>
                          <div className="flex flex-col leading-tight">
                            <span>{item.label}</span>
                          </div>
                        </div>
                        <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </>
                    )}
                  </NavLink>
                )
              })}

              <Link
                to="/ar"
                onClick={() => setOpen(false)}
                className="group flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-xl transition-all duration-500 hover:shadow-2xl hover:scale-105 relative overflow-hidden"
              >
                {/* Shine effect */}
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 transform -skew-x-12 cursor-pointer" onClick={() => navigate('/ar')} />
                
                <ARIcon className="relative h-4 w-4 group-hover:rotate-12 transition-transform duration-300" /> 
                <span className="relative">Try AR Demo</span>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
})

const Home = memo(function Home() {
  const { hotspots, species, loading } = useData()
  const navigate = useNavigate()
  const [isVisible, setIsVisible] = useState(false)
  const { isMobileView, deviceInfo } = useDeviceDetection()

  useEffect(() => {
    setIsVisible(true)
  }, [])

  const marineSites = useMemo(
    () => hotspots.filter((site) => site.type === 'marine').length,
    [hotspots]
  )
  const terrestrialSites = useMemo(
    () => hotspots.filter((site) => site.type === 'terrestrial').length,
    [hotspots]
  )
  const discoveryGoal = 60
  const speciesCount = species.length
  const discoveryProgress = Math.min(100, Math.round(((speciesCount || 0) / discoveryGoal) * 100))

  const heroHighlights = [
    {
      title: 'Marine + terrestrial sync',
      description: loading
        ? 'Hotspot data is syncing from the field dashboards. Final counts will appear shortly.'
        : `${marineSites} marine / ${terrestrialSites} terrestrial locations keep the navbar counters alive.`,
      icon: <WaveIcon className="h-5 w-5 text-sky-500" />,
    },
    {
      title: 'Species ledger in the header',
      description: loading
        ? 'We are lining up the species roster. Check back in a moment for the full ledger.'
        : `${speciesCount}+ species totals surface in the sticky header and throughout the home layout.`,
      icon: <SpeciesIcon className="h-5 w-5 text-purple-500" />,
    },
    {
      title: 'Unified AR actions',
      description: 'Hero CTAs mirror the Launch AR button in the navbar so journeys feel continuous.',
      icon: <ARIcon className="h-5 w-5 text-teal-500" />,
    },
  ]

  const heroMetrics = [
    {
      label: 'Marine coverage',
      value: loading ? '•••' : `${marineSites} sites`,
      gradient: 'from-cyan-500 to-sky-500',
    },
    {
      label: 'Terrestrial coverage',
      value: loading ? '•••' : `${terrestrialSites} sites`,
      gradient: 'from-emerald-500 to-lime-500',
    },
    {
      label: 'Species logged',
      value: loading ? '•••' : `${speciesCount}+`,
      gradient: 'from-purple-500 to-fuchsia-500',
    },
  ]

  const featureCards = [
    {
      icon: '🧭',
      title: 'Navigation-first flow',
      description: 'Navbar stats repeat at each section so orientation stays intact from header to hero to map.',
    },
    {
      icon: '🪟',
      title: 'Glassmorphic surface',
      description: 'Cards, filters, and CTAs borrow the header’s frosted gradients for a cohesive visual language.',
    },
    {
      icon: '🧠',
      title: 'Contextual CTAs',
      description: 'Primary actions match the sticky Launch AR button, promoting a predictable, guided journey.',
    },
  ]

  const missionPillars = [
    {
      title: 'Habitat guardianship',
      description: 'Celebrate blue carbon mangroves, coral gardens, and upland forests through guided storytelling.',
      icon: <LeafIcon className="h-6 w-6 text-emerald-400" />,
    },
    {
      title: 'Education-first journeys',
      description: 'Teachers and learners get aligned cues—from nav counters to species cards—when exploring.',
      icon: <EducationIcon className="h-6 w-6 text-sky-400" />,
    },
    {
      title: 'Lightweight AR technology',
      description: 'MindAR-powered demos and the sticky Launch AR CTA keep immersive tools just one tap away.',
      icon: <TechIcon className="h-6 w-6 text-teal-400" />,
    },
    {
      title: 'Conservation outcomes',
      description: 'Data cards spotlight protected areas so responsible travel choices are obvious and actionable.',
      icon: <ConservationIcon className="h-6 w-6 text-purple-400" />,
    },
  ]

  const typeMeta = {
    marine: {
      label: 'Marine site',
      gradient: 'from-cyan-500 via-sky-500 to-blue-500',
      chip: 'bg-sky-500/15 text-sky-700 dark:text-sky-200',
      iconBg: 'bg-sky-500/20',
      icon: <WaveIcon className="h-5 w-5 text-sky-100" />,
    },
    terrestrial: {
      label: 'Terrestrial site',
      gradient: 'from-emerald-500 via-green-500 to-lime-500',
      chip: 'bg-emerald-500/15 text-emerald-700 dark:text-emerald-200',
      iconBg: 'bg-emerald-500/20',
      icon: <MountainIcon className="h-5 w-5 text-emerald-100" />,
    },
  } as const

  const featuredSites = useMemo(() => hotspots.slice(0, 4), [hotspots])
  const featuredImages = useMemo(
    () => featuredSites.filter((site) => Boolean(site.image)),
    [featuredSites]
  )
  const [slideshowIndex, setSlideshowIndex] = useState(0)

  useEffect(() => {
    if (featuredImages.length === 0) return

    const interval = window.setInterval(() => {
      setSlideshowIndex((prev) => (prev + 1) % featuredImages.length)
    }, 6500)

    return () => {
      window.clearInterval(interval)
    }
  }, [featuredImages.length])

  useEffect(() => {
    if (slideshowIndex >= featuredImages.length) {
      setSlideshowIndex(0)
    }
  }, [featuredImages.length, slideshowIndex])

  const currentSlide = featuredImages[slideshowIndex] ?? null

  return (
    <div className="space-y-8 min-h-screen">
      <section className={`group relative overflow-hidden rounded-[32px] border transition-all duration-1000 ease-out ${isMobileView ? 'border-blue-400/60 bg-blue-50/95 dark:border-blue-500/50 dark:bg-blue-950/85' : 'border-slate-200/70 bg-white/95 dark:border-slate-700/60 dark:bg-slate-900/85'} backdrop-blur-3xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/20 dark:hover:shadow-blue-500/15 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
        {/* Enhanced glass morphism background with animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-blue-50/50 via-emerald-50/40 to-purple-50/40 dark:from-blue-900/20 dark:via-emerald-900/15 dark:to-purple-900/15 group-hover:from-blue-50/70 group-hover:via-emerald-50/60 group-hover:to-purple-50/60 dark:group-hover:from-blue-900/30 dark:group-hover:via-emerald-900/25 dark:group-hover:to-purple-900/25 transition-all duration-1000" />
        
        {/* Animated gradient orbs */}
        <div className="absolute top-20 left-20 w-72 h-72 bg-gradient-to-br from-blue-400/20 to-emerald-400/10 rounded-full blur-3xl animate-pulse" />
        <div className="absolute bottom-20 right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 to-purple-400/10 rounded-full blur-3xl animate-pulse delay-1000" />
        
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.12),rgba(59,130,246,0.1),rgba(147,51,234,0.12),rgba(6,182,212,0.1),rgba(16,185,129,0.12))] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <Atmosphere variant="hero" className="hidden md:block" />
        <div className={`relative z-10 ${isMobileView 
            ? `flex flex-col gap-4 p-4 ${deviceInfo.isTablet ? 'p-6 gap-6' : ''} ${deviceInfo.isIOS ? 'pb-safe-area-inset-bottom' : ''}` 
            : 'grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-8 p-6 lg:p-12 xl:p-16 2xl:p-20'
          }`}>
          <div className="space-y-10">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/80 px-4 py-2 text-sm font-semibold text-emerald-600 shadow-lg backdrop-blur-xl border border-emerald-200/50 transition-all duration-300 hover:shadow-xl hover:scale-105 dark:bg-slate-800/80 dark:text-emerald-300 dark:border-emerald-700/50">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500 animate-pulse">
                  <span className="absolute h-2 w-2 rounded-full bg-gradient-to-r from-green-400 to-blue-400 animate-ping opacity-75" />
                </span>
                Live beta experience
              </span>
              {isMobileView && (
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50/80 px-4 py-2 text-sm font-semibold text-blue-600 shadow-lg backdrop-blur-xl border border-blue-200/50 transition-all duration-300 hover:scale-105 dark:bg-blue-900/40 dark:text-blue-300 dark:border-blue-700/50">
                  <span className="text-xs">📱</span>
                  Auto-detected
                  {deviceInfo.isIOS && ' • iOS'}
                  {deviceInfo.isAndroid && ' • Android'}
                </span>
              )}
            </div>
            <div className={`space-y-6 ${isMobileView ? 'text-center' : ''}`}>
              <AnimatedText 
                as="h1" 
                className={`font-black tracking-tight bg-gradient-to-r from-slate-900 via-blue-900 to-emerald-900 dark:from-white dark:via-blue-100 dark:to-emerald-100 bg-clip-text text-transparent ${
                  isMobileView 
                    ? `!text-4xl ${deviceInfo.isTablet ? '!text-5xl' : ''} ${deviceInfo.isIOS ? 'tracking-tighter' : ''}` 
                    : '!text-5xl lg:!text-7xl xl:!text-8xl'
                }`}
                text="Mati ARBio" 
              />
              <AnimatedText 
                as="div" 
                className={`!font-bold text-slate-800 dark:text-slate-100 ${
                  isMobileView 
                    ? `!text-lg ${deviceInfo.isTablet ? '!text-xl' : ''}` 
                    : '!text-xl lg:!text-2xl xl:!text-3xl'
                }`}
                text="Explore biodiversity through maps, data, and AR experiences." 
              />
              <p className={`text-slate-600 dark:text-slate-300 leading-relaxed ${
                isMobileView 
                  ? `text-base mx-auto max-w-md ${deviceInfo.isTablet ? 'text-lg max-w-lg' : ''}` 
                  : 'text-lg max-w-2xl xl:text-xl xl:max-w-3xl'
              }`}>
                {isMobileView 
                  ? `Experience ${deviceInfo.isIOS ? 'iOS-optimized' : deviceInfo.isAndroid ? 'Android-optimized' : 'mobile'} biodiversity exploration with touch-friendly interfaces and responsive design.`
                  : 'The redesigned interface takes cues from the navbar—glass surfaces, live counters, and AR-forward cues—to guide every visitor from orientation to action.'
                }
              </p>
            </div>
            <div className={`flex gap-4 ${isMobileView ? 'flex-col w-full' : 'flex-col sm:flex-row lg:flex-row xl:gap-6'}`}>
              <Button
                variant="primary"
                onClick={() => navigate('/gis')}
                className={`group relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-cyan-500 hover:from-emerald-600 hover:via-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/50 transition-all duration-700 ease-out ${
                  isMobileView 
                    ? `w-full py-6 text-lg rounded-3xl shadow-2xl ${deviceInfo.isIOS ? 'active:scale-[0.98]' : 'active:scale-[0.96]'} ${deviceInfo.isAndroid ? 'min-h-[56px]' : 'min-h-[52px]'}` 
                    : 'hover:scale-110 hover:shadow-2xl hover:-rotate-1 hover:-translate-y-2 xl:px-12 xl:py-6 xl:text-xl rounded-3xl'
                }`}
              >
                {/* Enhanced button visual effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/15 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/30 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000 ease-out" />
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.3),transparent,rgba(255,255,255,0.3))] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                
                {/* Glow effect */}
                <div className="absolute inset-0 rounded-3xl bg-gradient-to-r from-emerald-400 to-blue-400 blur-xl opacity-0 group-hover:opacity-60 transition-opacity duration-500" />
                
                <span className={`relative ${isMobileView ? 'text-2xl' : 'text-2xl xl:text-3xl'} group-hover:scale-110 transition-transform duration-300`}>🌊</span>
                <span className="relative">{isMobileView ? 'Explore Map' : 'Explore the map'}</span>
                <svg className={`relative ${isMobileView ? 'h-5 w-5' : 'h-5 w-5 xl:h-6 xl:w-6'} group-hover:translate-x-2 transition-transform duration-300`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Link to="/ar" className={isMobileView ? 'w-full' : ''}>
                <Button 
                  variant="secondary" 
                  className={`group relative overflow-hidden flex items-center justify-center gap-3 transition-all duration-500 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl border-2 border-slate-300 dark:border-slate-600 hover:border-blue-500 dark:hover:border-blue-400 hover:shadow-2xl hover:shadow-blue-500/30 ${
                    isMobileView 
                      ? `w-full py-4 text-lg font-semibold rounded-2xl shadow-lg ${deviceInfo.isIOS ? 'active:scale-98' : 'active:scale-95'} ${deviceInfo.isAndroid ? 'min-h-[48px]' : 'min-h-[44px]'}` 
                      : 'hover:scale-105 hover:-translate-y-1 xl:px-8 xl:py-4 xl:text-lg'
                  }`}
                >
                  {/* Animated gradient background */}
                  <div className="absolute inset-0 bg-gradient-to-r from-blue-500/10 via-purple-500/10 to-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  
                  <ARIcon className={`relative ${isMobileView ? 'h-5 w-5' : 'h-5 w-5 xl:h-6 xl:w-6'} group-hover:rotate-12 transition-transform duration-300`} />
                  <span className="relative">{isMobileView ? 'Augmented Reality' : 'Launch AR demo'}</span>
                </Button>
              </Link>
            </div>
            <div className={`gap-4 ${isMobileView ? 'flex flex-col' : 'grid sm:grid-cols-2'}`}>
              {heroHighlights.map((item) => (
                <div key={item.title} className={`group flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/95 shadow-lg backdrop-blur-xl transition-all duration-500 hover:shadow-xl hover:scale-[1.02] hover:border-emerald-300/60 dark:border-slate-700/60 dark:bg-slate-900/85 dark:hover:border-emerald-500/50 ${isMobileView ? 'px-3 py-4' : 'px-4 py-3'}`}>
                  <span className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500/15 to-blue-500/25 text-lg group-hover:scale-110 group-hover:rotate-3 transition-all duration-500 ${isMobileView ? 'h-12 w-12' : 'h-9 w-9'}`}>
                    {item.icon}
                  </span>
                  <div className="space-y-1">
                    <h4 className={`font-semibold text-slate-800 dark:text-white ${isMobileView ? 'text-base' : 'text-sm'}`}>{item.title}</h4>
                    <p className={`text-slate-500 dark:text-slate-300 ${isMobileView ? 'text-sm' : 'text-xs'}`}>{item.description}</p>
                  </div>
                </div>
              ))}
            </div>
          </div>
          {!isMobileView && (
            <aside className="relative overflow-hidden rounded-3xl border border-slate-300/50 bg-white/85 shadow-2xl backdrop-blur-xl dark:border-white/15 dark:bg-slate-900/85 transition-all duration-500 hover:shadow-3xl hover:scale-[1.01] group">
            <div className="absolute inset-0 bg-gradient-to-br from-slate-100/40 via-white/20 to-slate-50/60 dark:from-slate-800/25 dark:via-slate-700/15 dark:to-slate-800/30 group-hover:from-slate-100/60 group-hover:via-white/30 group-hover:to-slate-50/80 transition-all duration-500" />
            <Atmosphere variant="soft" className="opacity-90 group-hover:opacity-100 transition-opacity duration-500" />
            <div className="relative z-10 space-y-6 p-6 xl:p-8">
              <div className="space-y-3">
                <p className="text-sm font-semibold uppercase tracking-[0.2em] text-emerald-600 dark:text-emerald-300">Navbar data stream</p>
                <h3 className="text-2xl font-bold text-slate-900 dark:text-white">Stats mirrored in navigation</h3>
                <p className="text-sm text-slate-500 dark:text-slate-300">The header, hero, and map filters now share the same counters, so you never lose context as you explore.</p>
              </div>
              <div className="space-y-3">
                {heroMetrics.map((metric) => (
                  <div key={metric.label} className="flex items-center justify-between rounded-2xl border border-slate-200/70 bg-white/85 px-4 py-3 shadow-md dark:border-white/15 dark:bg-slate-900/70">
                    <div>
                      <p className="text-[11px] uppercase tracking-[0.25em] text-slate-500 dark:text-slate-400">{metric.label}</p>
                      <p className="text-lg font-semibold text-slate-900 dark:text-white">{metric.value}</p>
                    </div>
                    <div className={`h-11 w-11 rounded-xl bg-gradient-to-br ${metric.gradient} opacity-80 shadow-inner`} />
                  </div>
                ))}
              </div>
              <div>
                <div className="flex items-center justify-between text-sm font-semibold text-slate-600 dark:text-slate-200">
                  <span>Discovery roadmap</span>
                  <span>{discoveryProgress}%</span>
                </div>
                <div className="mt-3 h-2 rounded-full bg-white/50 dark:bg-white/10">
                  <div className="h-full rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-blue-500" style={{ width: `${discoveryProgress}%` }} />
                </div>
                <p className="mt-3 text-xs text-slate-500 dark:text-slate-300">
                  Catalogued {loading ? '•••' : speciesCount} of {discoveryGoal}+ priority species for Year&nbsp;1 AR experiences.
                </p>
                {currentSlide && featuredImages.length > 0 && (
                  <div className="relative mt-5 overflow-hidden rounded-3xl border border-emerald-300/50 bg-gradient-to-br from-emerald-100/70 via-white/70 to-sky-100/60 shadow-2xl dark:border-emerald-400/30 dark:from-emerald-900/40 dark:via-slate-900/40 dark:to-slate-800/35">
                    <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-white/30 via-transparent to-emerald-200/30 dark:from-white/10" />
                    <div className="relative z-10 space-y-4 p-5">
                      <div className="flex items-center justify-between gap-3">
                        <div className="flex items-center gap-2">
                          <span className="inline-flex h-9 w-9 items-center justify-center rounded-2xl bg-white/70 text-emerald-500 shadow-sm backdrop-blur dark:bg-white/10 dark:text-emerald-200">
                            <MapIcon className="h-5 w-5" />
                          </span>
                          <div>
                            <p className="text-[11px] font-semibold uppercase tracking-[0.35em] text-emerald-600/90 dark:text-emerald-300/90">
                              Field spotlight
                            </p>
                            <p className="text-sm font-semibold text-slate-900 dark:text-white">
                              {currentSlide.name}
                            </p>
                          </div>
                        </div>
                        <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-[11px] font-semibold uppercase tracking-[0.25em] ${
                          currentSlide.type === 'marine'
                            ? 'bg-sky-500/15 text-sky-700 dark:bg-sky-500/20 dark:text-sky-200'
                            : 'bg-emerald-500/15 text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200'
                        }`}>
                          <span className="h-1.5 w-1.5 rounded-full bg-current" />
                          {currentSlide.type === 'marine' ? 'Marine site' : 'Terrestrial site'}
                        </span>
                      </div>

                      <div className="relative overflow-hidden rounded-2xl border border-white/40 bg-slate-900/40 shadow-lg">
                        <div className="relative h-44 sm:h-48">
                          {featuredImages.map((site, index) => (
                            <img
                              key={site.id}
                              src={site.image as string}
                              alt={`${site.name} preview`}
                              loading="lazy"
                              className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-[1200ms] ease-out ${
                                index === slideshowIndex ? 'opacity-100' : 'opacity-0'
                              }`}
                            />
                          ))}
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-slate-900/70 via-slate-900/10 to-transparent" />
                          <div className="pointer-events-none absolute inset-0 bg-gradient-to-br from-emerald-500/20 via-transparent to-sky-500/20" />
                          <div className="absolute bottom-3 left-3 flex items-center gap-3 text-xs font-semibold text-white/90">
                            <span className="inline-flex items-center gap-1 rounded-full bg-black/40 px-2.5 py-1 backdrop-blur">
                              {currentSlide.lat.toFixed(2)}° / {currentSlide.lng.toFixed(2)}°
                            </span>
                          </div>
                        </div>
                      </div>

                      <p className="text-xs text-slate-600 dark:text-slate-300">
                        {currentSlide.summary}
                      </p>

                      <div className="flex flex-wrap gap-2 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-600/80 dark:text-emerald-300/70">
                        {(currentSlide.tags || []).slice(0, 3).map((tag) => (
                          <span key={`${currentSlide.id}-${tag}`} className="rounded-full bg-white/70 px-3 py-1 shadow-sm dark:bg-white/10">
                            #{tag}
                          </span>
                        ))}
                      </div>

                      <div className="flex items-center justify-between gap-4">
                        <div className="flex flex-1 items-center gap-1">
                          {featuredImages.map((site, index) => (
                            <span
                              key={`${site.id}-indicator`}
                              className={`h-1.5 flex-1 rounded-full transition-all duration-500 ease-out ${
                                index === slideshowIndex
                                  ? 'bg-gradient-to-r from-emerald-500 via-teal-500 to-sky-500'
                                  : 'bg-slate-200/70 dark:bg-slate-700/60'
                              }`}
                            />
                          ))}
                        </div>
                        <Link
                          to={`/site/${currentSlide.id}`}
                          className="inline-flex items-center gap-2 rounded-full border border-emerald-400/60 bg-white/80 px-3 py-1.5 text-[11px] font-semibold uppercase tracking-[0.25em] text-emerald-700 shadow-sm transition hover:bg-white/90 dark:border-emerald-400/40 dark:bg-slate-900/70 dark:text-emerald-200"
                        >
                          Explore
                          <svg className="h-3 w-3" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                            <path strokeLinecap="round" strokeLinejoin="round" d="M5 12h14M13 5l7 7-7 7" />
                          </svg>
                        </Link>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </aside>
          )}
          
          {isMobileView && (
            <div className={`w-full mt-6 rounded-2xl border border-blue-200/60 bg-blue-50/90 shadow-xl backdrop-blur dark:border-blue-400/30 dark:bg-blue-950/80 ${deviceInfo.isTablet ? 'p-6' : 'p-4'}`}>
              <div className="text-center space-y-4">
                <div className="flex items-center justify-center gap-2">
                  <div className={`${deviceInfo.isIOS ? 'text-3xl' : deviceInfo.isAndroid ? 'text-3xl' : 'text-3xl'}`}>
                    {deviceInfo.isIOS ? '📱' : deviceInfo.isAndroid ? '🤖' : '📱'}
                  </div>
                  <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                </div>
                <h3 className={`font-bold text-blue-900 dark:text-blue-100 ${deviceInfo.isTablet ? 'text-2xl' : 'text-xl'}`}>
                  {deviceInfo.isIOS ? 'iOS Experience' : deviceInfo.isAndroid ? 'Android Experience' : 'Mobile Experience'}
                </h3>
                <div className={`grid gap-3 text-sm ${deviceInfo.isTablet ? 'grid-cols-4' : 'grid-cols-2'}`}>
                  <div className="bg-blue-100/80 dark:bg-blue-900/40 rounded-xl p-3 backdrop-blur-sm">
                    <div className="font-semibold text-blue-800 dark:text-blue-200">Platform</div>
                    <div className="text-blue-700 dark:text-blue-300 text-xs">
                      {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'Mobile'}
                      {deviceInfo.isTablet ? ' • Tablet' : ''}
                    </div>
                  </div>
                  <div className="bg-green-100/80 dark:bg-green-900/40 rounded-xl p-3 backdrop-blur-sm">
                    <div className="font-semibold text-green-800 dark:text-green-200">Display</div>
                    <div className="text-green-700 dark:text-green-300 text-xs">{deviceInfo.screenWidth}×{deviceInfo.screenHeight}</div>
                  </div>
                  <div className="bg-purple-100/80 dark:bg-purple-900/40 rounded-xl p-3 backdrop-blur-sm">
                    <div className="font-semibold text-purple-800 dark:text-purple-200">Species</div>
                    <div className="text-purple-700 dark:text-purple-300 text-xs">{species.length}+ documented</div>
                  </div>
                  <div className="bg-orange-100/80 dark:bg-orange-900/40 rounded-xl p-3 backdrop-blur-sm">
                    <div className="font-semibold text-orange-800 dark:text-orange-200">Hotspots</div>
                    <div className="text-orange-700 dark:text-orange-300 text-xs">{hotspots.length} locations</div>
                  </div>
                </div>
                <div className="text-xs text-blue-600 dark:text-blue-400 bg-blue-100/50 dark:bg-blue-900/30 rounded-lg p-2">
                  ✨ Touch-optimized interface with {deviceInfo.isIOS ? 'iOS' : deviceInfo.isAndroid ? 'Android' : 'mobile'} design patterns
                </div>
              </div>
            </div>
          )}
        </div>
      </section>

      <section className={`transform transition-all duration-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="relative text-center">
          <SectionTitle icon="🧭" className="text-center relative z-10">
            <span className="bg-gradient-to-r from-emerald-600 via-blue-600 via-purple-600 to-cyan-600 bg-clip-text text-transparent font-black">Navigation-aligned experience</span>
          </SectionTitle>
          {/* Enhanced section visual effects */}
          <div className="absolute -top-4 left-1/2 transform -translate-x-1/2 w-32 h-32 bg-gradient-to-br from-emerald-500/10 via-blue-500/8 to-purple-500/10 rounded-full blur-2xl opacity-60 animate-pulse" />
          <div className="absolute -bottom-4 left-1/2 transform -translate-x-1/2 w-40 h-1 bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-cyan-500 rounded-full opacity-70 animate-pulse" />
          <div className="absolute -bottom-2 left-1/2 transform -translate-x-1/2 w-20 h-0.5 bg-white/50 dark:bg-white/30 rounded-full" />
        </div>
        <p className="mt-3 max-w-3xl text-sm text-slate-500 dark:text-slate-300">
          Every surface references the navbar: same gradients, counters, and action hierarchy. Cards reinforce the story so visitors know where to go next.
        </p>
        <div className={`mt-8 gap-6 ${
          isMobileView 
            ? `flex flex-col ${deviceInfo.isTablet ? 'md:grid md:grid-cols-2' : ''}` 
            : 'grid md:grid-cols-2 lg:grid-cols-3 xl:gap-8'
        }`}>
          {featureCards.map((card, idx) => (
            <div 
              key={card.title} 
              className={`group relative overflow-hidden rounded-3xl border border-white/60 bg-white/90 backdrop-blur-2xl shadow-2xl transition-all duration-700 ease-out dark:border-white/25 dark:bg-slate-900/85 ${
                isMobileView 
                  ? `p-7 ${deviceInfo.isTablet ? 'p-8' : ''} active:scale-[0.98] active:shadow-xl ${deviceInfo.isAndroid ? 'active:bg-white/95 dark:active:bg-slate-900/90' : ''}` 
                  : 'p-10 xl:p-12 hover:-translate-y-4 hover:shadow-3xl hover:shadow-emerald-500/25 dark:hover:shadow-blue-500/25 hover:scale-[1.05] hover:bg-white/95 dark:hover:bg-slate-900/90 hover:border-emerald-500/40 dark:hover:border-blue-500/40 hover:rotate-1'
              }`}
            >
              {/* Enhanced card visual effects */}
              <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/12 via-blue-500/10 via-purple-500/8 to-cyan-500/10 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
              <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_30%,rgba(16,185,129,0.2),rgba(59,130,246,0.15),transparent_70%)] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
              <div className="absolute inset-0 bg-[conic-gradient(from_45deg_at_50%_50%,rgba(16,185,129,0.1),rgba(59,130,246,0.08),rgba(147,51,234,0.1),rgba(6,182,212,0.08))] opacity-0 group-hover:opacity-100 transition-opacity duration-800" />
              <Atmosphere variant="soft" className={`${idx % 2 === 0 ? 'opacity-80' : 'opacity-60'} ${!isMobileView ? 'group-hover:opacity-100' : ''} transition-opacity duration-300`} />
              <div className={`absolute inset-x-4 top-0 h-1 rounded-full bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 transition-opacity duration-300 ${
                isMobileView ? 'opacity-60' : 'opacity-0 group-hover:opacity-100'
              }`} />
              <div className="relative z-10">
                <div className={`drop-shadow-sm ${isMobileView && deviceInfo.isTablet ? 'text-4xl' : 'text-3xl xl:text-4xl'}`}>{card.icon}</div>
                <h4 className={`mt-4 font-semibold text-slate-800 dark:text-white ${
                  isMobileView ? `text-lg ${deviceInfo.isTablet ? 'text-xl' : ''}` : 'text-lg xl:text-xl'
                }`}>
                  {card.title}
                </h4>
                <p className={`mt-2 text-slate-500 dark:text-slate-300 ${
                  isMobileView ? `text-sm ${deviceInfo.isTablet ? 'text-base' : ''}` : 'text-sm xl:text-base'
                }`}>
                  {card.description}
                </p>
              </div>
            </div>
          ))}
        </div>
      </section>

      <section className={`transform transition-all duration-700 delay-100 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <SectionTitle icon="📍">Featured biodiversity sites</SectionTitle>
        <p className="mt-3 max-w-3xl text-sm text-slate-500 dark:text-slate-300">
          These signatures appear in both the navbar counters and the map module. Cards inherit the same frosted gradients so the information feels connected.
        </p>
        <div className="mt-10 grid gap-8 md:grid-cols-2">
          {loading &&
            Array.from({ length: 4 }).map((_, index) => (
              <Card
                key={`placeholder-${index}`}
                className={`relative overflow-hidden border border-white/40 bg-white/70 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
              >
                <div className="h-4 w-24 rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
                <div className="mt-4 h-6 w-3/4 rounded-full bg-slate-200/60 dark:bg-slate-700/60" />
                <div className="mt-3 h-24 rounded-3xl bg-slate-200/40 dark:bg-slate-800" />
                <div className="mt-4 flex gap-2">
                  {Array.from({ length: 3 }).map((_, chipIndex) => (
                    <span
                      key={chipIndex}
                      className="h-6 w-16 rounded-full bg-slate-200/50 dark:bg-slate-700/70"
                    />
                  ))}
                </div>
              </Card>
            ))}

          {!loading && featuredSites.length === 0 && (
            <SoftCard className="col-span-full text-center text-slate-600 dark:text-slate-300">
              🌱 Field teams are still drafting hotspot cards. Check back soon for featured locations.
            </SoftCard>
          )}

          {!loading &&
            featuredSites.map((site, index) => {
              const meta = typeMeta[site.type]
              return (
                <Card
                  key={site.id}
                  className={`group relative overflow-hidden border border-white/40 bg-white/85 p-6 shadow-xl backdrop-blur dark:border-white/10 dark:bg-slate-900/70 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-4 opacity-0'}`}
                  style={{ transitionDelay: `${index * 120}ms` }}
                >
                  <div className={`absolute inset-x-6 top-0 h-1 rounded-full bg-gradient-to-r ${meta.gradient}`} />
                  <div className="flex items-start justify-between gap-4 pt-4">
                    <div className="space-y-3">
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${meta.chip}`}>
                        <span className={`flex h-6 w-6 items-center justify-center rounded-full ${meta.iconBg}`}>{meta.icon}</span>
                        {meta.label}
                      </span>
                      <h3 className="text-2xl font-semibold text-slate-900 transition-colors duration-300 group-hover:text-emerald-600 dark:text-white dark:group-hover:text-emerald-300">
                        {site.name}
                      </h3>
                      <p className="text-sm text-slate-600 dark:text-slate-300">{site.summary}</p>
                    </div>
                    <div className="flex flex-col items-end gap-2 text-right text-xs text-slate-400 dark:text-slate-500">
                      <span>{site.lat.toFixed(3)}°</span>
                      <span>{site.lng.toFixed(3)}°</span>
                    </div>
                  </div>
                  {site.image && (
                    <MediaThumb src={site.image} alt={`${site.name} photo`} className="my-6 h-44 rounded-3xl" />
                  )}
                  <div className="flex flex-wrap gap-2">
                    {site.tags.map((tag) => (
                      <span key={tag} className="rounded-full bg-slate-100 px-3 py-1 text-xs font-medium text-slate-600 transition-colors duration-200 dark:bg-slate-700 dark:text-slate-200">
                        #{tag}
                      </span>
                    ))}
                  </div>
                  <div className="mt-6 flex items-center justify-between border-t border-white/40 pt-4 dark:border-white/10">
                    <Link
                      to={`/site/${site.id}`}
                      className="group/link inline-flex items-center gap-2 rounded-xl bg-gradient-to-r from-green-600 to-blue-600 px-5 py-2 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:gap-3 hover:shadow-xl"
                    >
                      Explore site
                      <svg className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                      </svg>
                    </Link>
                    <Link to="/gis" className="text-xs font-semibold uppercase tracking-[0.3em] text-slate-400 hover:text-slate-600 dark:text-slate-500 dark:hover:text-slate-300">
                      Map view
                    </Link>
                  </div>
                </Card>
              )
            })}
        </div>
      </section>

      <section className={`transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="group relative rounded-[40px] border border-white/50 bg-white/85 p-12 shadow-2xl backdrop-blur-2xl dark:border-white/20 dark:bg-slate-900/80 transition-all duration-500 hover:shadow-3xl hover:shadow-emerald-500/10 dark:hover:shadow-blue-500/10">
          {/* Enhanced card background effects */}
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
          <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.08),rgba(59,130,246,0.06),rgba(147,51,234,0.08),rgba(16,185,129,0.08))] rounded-[40px] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
          <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
            <div className="max-w-xl space-y-4">
              <SectionTitle icon="🌿">Mission pillars</SectionTitle>
              <p className="text-sm text-slate-500 dark:text-slate-300">
                The navbar, hero, and content decks all ladder up to the same conservation story—blending tourism, education, and tech for Mati’s ecosystems.
              </p>
            </div>
            <Link to="/about" className="inline-flex items-center gap-3 rounded-2xl border border-white/50 bg-white/70 px-6 py-3 text-sm font-semibold text-emerald-700 shadow-sm transition hover:border-white/80 hover:bg-white/90 dark:border-white/10 dark:bg-slate-800/60 dark:text-emerald-300 dark:hover:bg-slate-800/80">
              <InfoIcon className="h-4 w-4" />
              Learn about the project
            </Link>
          </div>
          <div className="mt-8 grid gap-6 sm:grid-cols-2">
            {missionPillars.map((pillar) => (
              <div key={pillar.title} className="flex gap-4 rounded-2xl border border-white/40 bg-white/75 p-5 shadow-sm backdrop-blur dark:border-white/10 dark:bg-slate-900/60">
                <span className="flex h-12 w-12 items-center justify-center rounded-2xl bg-gradient-to-br from-green-500/15 to-blue-500/20">
                  {pillar.icon}
                </span>
                <div className="space-y-1.5">
                  <h4 className="text-base font-semibold text-slate-800 dark:text-white">{pillar.title}</h4>
                  <p className="text-sm text-slate-500 dark:text-slate-300">{pillar.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className={`transform transition-all duration-700 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-6 opacity-0'}`}>
        <div className="relative overflow-hidden flex flex-col gap-6 rounded-3xl bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 p-8 text-white shadow-2xl sm:flex-row sm:items-center sm:justify-between">
          <Atmosphere variant="cta" className="opacity-80" />
          <div className="relative z-10 max-w-xl space-y-2">
            <span className="inline-flex items-center gap-2 rounded-full bg-white/20 px-3 py-1 text-xs font-semibold uppercase tracking-[0.3em] text-white/80">
              <span className="h-1.5 w-1.5 rounded-full bg-white" />
              Compass mode
            </span>
            <h3 className="text-2xl font-bold">Stay oriented with Mati ARBio</h3>
            <p className="text-sm text-white/80">
              The navbar is your compass—jump into the AR demo or continue exploring data-driven stories of Mati City’s biodiversity.
            </p>
          </div>
          <div className="relative z-10 flex flex-wrap gap-4">
            <Link to="/ar" className="inline-flex items-center gap-3 rounded-2xl bg-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              <ARIcon className="h-4 w-4" />
              Launch AR
            </Link>
            <Link to="/biodiversity" className="inline-flex items-center gap-3 rounded-2xl bg-white/12 px-5 py-3 text-sm font-semibold text-white transition hover:bg-white/20">
              <SpeciesIcon className="h-4 w-4" />
              Browse species
            </Link>
          </div>
        </div>
      </section>
    </div>
  )
})


const GISMap = memo(function GISMap() {
  return <GISMapPage />
})

const SitePage = memo(function SitePage() {
  const { id } = useParams()
  const { hotspots, species, loading } = useData()

  const site = useMemo(() => hotspots.find((s) => s.id === id), [hotspots, id])

  const highlightSpecies = useMemo(
    () => (site ? species.filter((sp) => site.highlightSpeciesIds.includes(sp.id)) : []),
    [site, species]
  )
  const flora = useMemo(
    () => (site ? species.filter((sp) => site.floraIds.includes(sp.id)) : []),
    [site, species]
  )
  const fauna = useMemo(
    () => (site ? species.filter((sp) => site.faunaIds.includes(sp.id)) : []),
    [site, species]
  )
  const associatedSpecies = useMemo(
    () =>
      site
        ? species.filter(
            (sp) =>
              sp.siteIds.includes(site.id) &&
              !site.highlightSpeciesIds.includes(sp.id) &&
              !site.floraIds.includes(sp.id) &&
              !site.faunaIds.includes(sp.id)
          )
        : [],
    [site, species]
  )

  const locationText = site ? [site.barangay, site.city, site.province].filter(Boolean).join(', ') : ''

  const formatCoordinate = (value: number, axis: 'lat' | 'lng') => {
    const cardinal = axis === 'lat' ? (value >= 0 ? 'N' : 'S') : value >= 0 ? 'E' : 'W'
    return `${Math.abs(value).toFixed(3)}°${cardinal}`
  }

  const statusMeta: Record<string, { label: string; classes: string }> = {
    CR: { label: 'Critically Endangered', classes: 'bg-gradient-to-r from-red-200 to-rose-100 text-red-800 border border-red-200/60' },
    EN: { label: 'Endangered', classes: 'bg-gradient-to-r from-amber-200 to-orange-100 text-orange-800 border border-orange-200/60' },
    VU: { label: 'Vulnerable', classes: 'bg-gradient-to-r from-yellow-100 to-lime-100 text-lime-800 border border-lime-200/60' },
    NT: { label: 'Near Threatened', classes: 'bg-gradient-to-r from-emerald-100 to-green-100 text-emerald-800 border border-emerald-200/60' },
    LC: { label: 'Least Concern', classes: 'bg-gradient-to-r from-slate-100 to-slate-50 text-slate-700 border border-slate-200/60' },
    DD: { label: 'Data Deficient', classes: 'bg-gradient-to-r from-indigo-100 to-purple-100 text-indigo-800 border border-indigo-200/60' },
  }

  if (loading && !site) {
    return (
      <div className="py-20 text-center">
        <p className="text-sm font-semibold uppercase tracking-[0.3em] text-slate-400 dark:text-slate-500">Loading site profile…</p>
      </div>
    )
  }

  if (!site) {
    return (
      <SoftCard className="mx-auto my-20 max-w-2xl text-center text-slate-600 dark:text-slate-300">
        <h2 className="mb-3 text-2xl font-bold text-slate-800 dark:text-white">Site not found</h2>
        <p className="text-sm">We couldn’t locate that hotspot. It may have been renamed or isn’t part of the current dataset yet.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/gis" className="btn-primary inline-flex items-center gap-2">
            <MapIcon className="h-4 w-4" />
            Back to map
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200">
            <ARIcon className="h-4 w-4" />
            Home
          </Link>
        </div>
      </SoftCard>
    )
  }

  const typeBadge = site.type === 'marine'
    ? 'bg-gradient-to-r from-sky-500/90 to-blue-600/90 text-white shadow-lg shadow-blue-900/30'
    : 'bg-gradient-to-r from-emerald-500/90 to-green-600/90 text-white shadow-lg shadow-emerald-900/30'

  const infoCards = [
    {
      title: 'Location',
      value: locationText || 'Mati City, Davao Oriental',
      sub: `Coordinates · ${formatCoordinate(site.lat, 'lat')} · ${formatCoordinate(site.lng, 'lng')}`,
      icon: site.type === 'marine' ? '🌊' : '⛰️',
    },
    {
      title: 'Protection Status',
      value: site.designation,
      sub: site.areaHectares ? `≈ ${site.areaHectares.toLocaleString()} ha protected landscape` : undefined,
      icon: '🛡️',
    },
    {
      title: 'Ecological Highlights',
      value: `${site.features.length} signature features`,
      sub: `${highlightSpecies.length} flagship species`,
      icon: '✨',
    },
    {
      title: 'Visitor Notes',
      value: site.visitorNotes || 'Coordinate with local guides for responsible visits.',
      sub: 'Respect carrying capacity and wildlife guidelines.',
      icon: '🧭',
    },
  ]

  return (
    <div className="space-y-6">
      <section className="relative overflow-hidden rounded-3xl border border-white/20 bg-slate-900 text-white shadow-2xl">
        {site.image && (
          <img
            src={site.image}
            alt={`${site.name} landscape`}
            className="absolute inset-0 h-full w-full object-cover opacity-70"
            loading="lazy"
          />
        )}
        <div className="absolute inset-0 bg-gradient-to-br from-slate-900/90 via-slate-900/75 to-slate-900/90" />
        <div className="relative space-y-6 p-8 sm:p-12">
          <span className={`inline-flex items-center gap-2 rounded-full px-4 py-1 text-sm font-semibold uppercase tracking-wide ${typeBadge}`}>
            {site.type === 'marine' ? 'Marine Protected Area' : 'Terrestrial Wildlife Sanctuary'}
          </span>
          <div className="space-y-4">
            <h1 className="text-4xl font-black sm:text-5xl">{site.name}</h1>
            <p className="text-lg text-slate-200 sm:max-w-3xl break-words">{site.summary}</p>
            <p className="text-sm font-semibold uppercase tracking-[0.2em] text-slate-300/80">{site.designation}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {site.tags.map((tag) => (
              <span
                key={tag}
                className="rounded-full border border-white/20 bg-white/10 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-slate-100"
              >
                #{tag}
              </span>
            ))}
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
        {infoCards.map((card) => (
          <div
            key={card.title}
            className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/70 p-6 shadow-lg backdrop-blur dark:border-white/10 dark:bg-slate-900/60"
          >
            <div className="absolute -top-10 -right-10 h-24 w-24 rounded-full bg-gradient-to-br from-white/40 to-transparent blur-2xl transition-opacity duration-500 group-hover:opacity-70" />
            <div className="relative space-y-2">
              <span className="inline-flex items-center gap-2 text-xs font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">
                <span className="text-lg">{card.icon}</span>
                {card.title}
              </span>
              <p className="text-lg font-bold text-slate-800 dark:text-slate-100 break-words">{card.value}</p>
              {card.sub && <p className="text-sm text-slate-500 dark:text-slate-300/80 break-words">{card.sub}</p>}
            </div>
          </div>
        ))}
      </section>

      <section className="space-y-6">
        <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Why it matters</h2>
  <p className="text-slate-600 dark:text-slate-300/90 break-words">{site.description}</p>
        <div className="grid gap-4 md:grid-cols-2">
          {site.features.map((feature) => (
            <div
              key={feature}
              className="flex gap-3 rounded-2xl border border-slate-200 bg-white/80 p-4 text-slate-700 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-800/60 dark:text-slate-200"
            >
              <span className="mt-1 text-xl">🌿</span>
              <p className="text-sm leading-relaxed break-words">{feature}</p>
            </div>
          ))}
        </div>
      </section>

      {highlightSpecies.length > 0 && (
        <section className="space-y-6">
          <div className="flex flex-wrap items-center justify-between gap-4">
            <h2 className="text-2xl font-bold text-slate-900 dark:text-slate-100">Flagship species</h2>
            <span className="rounded-full bg-emerald-100 px-3 py-1 text-sm font-semibold text-emerald-700 dark:bg-emerald-500/20 dark:text-emerald-200">
              {highlightSpecies.length} highlighted
            </span>
          </div>
          <div className="grid gap-6 md:grid-cols-2 xl:grid-cols-3">
            {highlightSpecies.map((sp) => {
              const status = statusMeta[sp.status] ?? statusMeta.LC
              const heroImage = sp.images?.[0]
              return (
                <Link
                  key={sp.id}
                  to={`/species/${sp.id}`}
                  className="group relative overflow-hidden rounded-3xl border border-white/40 bg-white/80 shadow-xl transition-transform hover:-translate-y-1 hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/70"
                >
                  {heroImage && (
                    <img
                      src={heroImage}
                      alt={`${sp.commonName} in habitat`}
                      className="absolute inset-0 h-full w-full object-cover opacity-60 transition-opacity duration-500 group-hover:opacity-80"
                      loading="lazy"
                    />
                  )}
                  <div className="absolute inset-0 bg-gradient-to-br from-white/85 via-white/80 to-white/40 dark:from-slate-950/80 dark:via-slate-950/70 dark:to-slate-900/40" />
                  <div className="relative space-y-3 p-6">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <span className="text-sm font-semibold uppercase tracking-wide text-slate-500 dark:text-slate-300">{sp.category === 'flora' ? 'Flora' : 'Fauna'}</span>
                      <span className={`inline-flex items-center gap-2 rounded-full px-3 py-1 text-xs font-semibold ${status.classes}`}>
                        <span>{sp.status}</span>
                        <span className="hidden sm:inline">{status.label}</span>
                      </span>
                    </div>
                    <div>
                      <p className="text-xl font-bold text-slate-900 dark:text-slate-100">{sp.commonName}</p>
                      <p className="text-sm italic text-slate-500 dark:text-slate-300">{sp.scientificName}</p>
                    </div>
                    <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/90 break-words">{sp.blurb}</p>
                    <div className="inline-flex items-center gap-2 text-sm font-semibold text-emerald-600 transition-colors group-hover:text-emerald-700 dark:text-emerald-300 dark:group-hover:text-emerald-200">
                      <span>Read species profile</span>
                      <span>→</span>
                    </div>
                  </div>
                </Link>
              )
            })}
          </div>
        </section>
      )}

      {(flora.length > 0 || fauna.length > 0) && (
        <section className="grid gap-6 md:grid-cols-2">
          {[
            { title: 'Key flora assemblage', data: flora },
            { title: 'Key fauna assemblage', data: fauna },
          ].map((bucket) => (
            <div
              key={bucket.title}
              className="space-y-4 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60"
            >
              <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">{bucket.title}</h3>
              <div className="flex flex-wrap gap-2">
                {bucket.data.map((species) => (
                  <Link
                    to={`/species/${species.id}`}
                    key={species.id}
                    className="inline-flex flex-col rounded-2xl border border-slate-200 bg-white/90 px-3 py-2 text-left text-xs font-semibold text-slate-700 shadow-sm transition-transform hover:-translate-y-0.5 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-800/80 dark:text-slate-200 break-words"
                  >
                    <span>{species.commonName}</span>
                    <span className="text-[10px] font-normal italic text-slate-500 dark:text-slate-400">{species.scientificName}</span>
                  </Link>
                ))}
              </div>
            </div>
          ))}
        </section>
      )}

      {associatedSpecies.length > 0 && (
        <section className="space-y-4">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Other species recorded here</h3>
          <div className="flex flex-wrap gap-2">
            {associatedSpecies.map((species) => (
              <Link
                to={`/species/${species.id}`}
                key={species.id}
                className="inline-flex items-center gap-1 rounded-full border border-slate-200 bg-white/80 px-3 py-1 text-left text-xs font-semibold text-slate-600 hover:border-emerald-200 hover:text-emerald-700 dark:border-slate-700 dark:bg-slate-900/60 dark:text-slate-300 break-words"
              >
                <span>{species.commonName}</span>
                <span className="text-[10px] italic text-slate-500 dark:text-slate-400">{species.scientificName}</span>
              </Link>
            ))}
          </div>
        </section>
      )}

      <section className="grid gap-6 lg:grid-cols-2">
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Stewardship and management</h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/90 break-words">{site.stewardship}</p>
        </div>
        <div className="space-y-3 rounded-3xl border border-slate-200 bg-white/80 p-6 shadow-sm backdrop-blur dark:border-slate-700 dark:bg-slate-900/60">
          <h3 className="text-lg font-semibold text-slate-800 dark:text-slate-100">Responsible visitation</h3>
          <p className="text-sm leading-relaxed text-slate-600 dark:text-slate-300/90 break-words">
            {site.visitorNotes || 'Coordinate with the local tourism office for accredited guides, observe leave-no-trace ethics, and respect wildlife distances during your visit.'}
          </p>
        </div>
      </section>
    </div>
  )
})

const SpeciesList = memo(function SpeciesList() {
  const { species, hotspots, loading } = useData()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  const siteLookup = useMemo(() => new Map(hotspots.map((site) => [site.id, site])), [hotspots])
  
  const getStatusColor = (status: string) => {
    switch (status) {
      case 'VU': return 'bg-gradient-to-r from-yellow-100 to-orange-100 text-orange-700 border-orange-200'
      case 'EN': return 'bg-gradient-to-r from-red-100 to-pink-100 text-red-700 border-red-200'
      case 'CR': return 'bg-gradient-to-r from-red-200 to-red-100 text-red-800 border-red-300'
      default: return 'bg-gradient-to-r from-green-100 to-emerald-100 text-green-700 border-green-200'
    }
  }
  
  const getStatusText = (status: string) => {
    switch (status) {
      case 'VU': return 'Vulnerable'
      case 'EN': return 'Endangered'
      case 'CR': return 'Critically Endangered'
      default: return status
    }
  }
  
  return (
    <div className="space-y-8 min-h-screen">
      <div className={`transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <SectionTitle icon="🌿">🦋 Species Gallery</SectionTitle>
      </div>
      
      <div className={`grid sm:grid-cols-2 lg:grid-cols-3 gap-8 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        {loading &&
          Array.from({ length: 6 }).map((_, index) => (
            <SoftCard key={`species-skeleton-${index}`} className="relative h-full p-6">
              <div className="mb-4 h-48 rounded-3xl bg-slate-200/60 dark:bg-slate-800/60" />
              <div className="space-y-3">
                <div className="h-6 w-3/4 rounded-full bg-slate-200/70 dark:bg-slate-800/70" />
                <div className="h-4 w-1/2 rounded-full bg-slate-200/60 dark:bg-slate-800/60" />
                <div className="h-20 rounded-2xl bg-slate-100/60 dark:bg-slate-900/60" />
              </div>
            </SoftCard>
          ))}

        {!loading && species.length === 0 && (
          <SoftCard className="col-span-full text-center text-slate-600 dark:text-slate-300">
            🐾 Species cards are still syncing. Check back once the database has been hydrated.
          </SoftCard>
        )}

        {!loading && species.map((sp, index) => (
          <SoftCard
            key={sp.id}
            className="group relative p-6 hover:-rotate-1 transform hover:scale-[1.02]"
            style={{ animationDelay: `${index * 140}ms` }}
          >
            {/* Floating status indicator */}
            <div className="absolute -top-3 -right-3 icon-badge w-12 h-12">
              <span className="text-sm font-semibold tracking-wide">{sp.status}</span>
            </div>
            
            {/* Species images */}
            {sp.images && sp.images.length > 0 && (
              <div className="mb-6 relative">
                <MediaThumb src={sp.images[0]} alt={sp.commonName} className="h-48" />
                {sp.images.length > 1 && (
                  <div className="absolute bottom-2 right-2 bg-black/55 backdrop-blur-sm text-white text-xs px-2 py-1 rounded-full">+{sp.images.length - 1} more</div>
                )}
              </div>
            )}
            
            <div className="space-y-4">
              <div className="flex items-start justify-between">
                <Link 
                  to={`/species/${sp.id}`} 
                  className="group/link text-xl font-bold text-gray-800 hover:text-green-700 transition-colors duration-300"
                >
                  <span className="group-hover/link:scale-105 transform inline-block transition-transform duration-300">
                    {sp.commonName}
                  </span>
                </Link>
                <span className={`text-xs px-3 py-1 rounded-full font-medium border ${getStatusColor(sp.status)} group-hover:animate-pulse`}>
                  {getStatusText(sp.status)}
                </span>
              </div>
              
              <p className="text-sm text-gray-600 italic font-medium bg-gray-50 p-2 rounded-lg">
                {sp.scientificName}
              </p>
              
              <p className="text-sm text-gray-700 leading-relaxed">
                {sp.blurb}
              </p>
              
              <div className="flex items-center justify-between pt-2 border-t border-gray-100">
                <Link 
                  to={`/species/${sp.id}`}
                  className="group/btn flex items-center gap-2 text-green-700 font-semibold hover:text-green-800 transition-colors duration-300"
                >
                  Learn more
                  <svg className="w-4 h-4 group-hover/btn:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                  </svg>
                </Link>
                
                <div className="flex gap-1">
                  {sp.siteIds.map((siteId, i) => {
                    const site = siteLookup.get(siteId)
                    return site ? (
                      <span key={`${sp.id}-${siteId}-${i}`} className="text-xs px-2 py-1 bg-blue-100 text-blue-600 rounded-full hover:bg-blue-200 transition-colors duration-200">
                        {site.type === 'marine' ? <WaveIcon className="w-4 h-4" /> : <MountainIcon className="w-4 h-4" />}
                      </span>
                    ) : null
                  })}
                </div>
              </div>
            </div>
          </SoftCard>
        ))}
      </div>
    </div>
  )
})

const SpeciesPage = memo(function SpeciesPage() {
  const { id } = useParams()
  const { species, hotspots, loading } = useData()
  const sp = useMemo(() => species.find((x) => x.id === id), [species, id])
  const where = useMemo(() => (sp ? hotspots.filter((s) => sp.siteIds.includes(s.id)) : []), [hotspots, sp])

  if (loading && !sp) {
    return (
      <div className="py-16 text-center text-slate-500 dark:text-slate-400">
        Loading species profile…
      </div>
    )
  }

  if (!sp) {
    return (
      <SoftCard className="mx-auto my-16 max-w-xl text-center text-slate-600 dark:text-slate-300">
        <h2 className="text-2xl font-bold text-slate-800 dark:text-white">Species not found</h2>
        <p className="mt-2 text-sm">The species you’re looking for isn’t in this build. Try exploring the biodiversity gallery for available profiles.</p>
        <div className="mt-6 flex justify-center gap-3">
          <Link to="/species" className="btn-primary inline-flex items-center gap-2">
            <SpeciesIcon className="h-4 w-4" />
            Browse species
          </Link>
          <Link to="/" className="inline-flex items-center gap-2 rounded-xl border border-slate-200 px-4 py-2 text-sm font-semibold text-slate-600 transition hover:border-emerald-200 hover:text-emerald-600 dark:border-slate-700 dark:text-slate-200">
            <ARIcon className="h-4 w-4" />
            Home
          </Link>
        </div>
      </SoftCard>
    )
  }

  return (
    <div className="space-y-3">
      <h2 className="text-2xl font-semibold">{sp.commonName}</h2>
      <p className="text-gray-700 italic">{sp.scientificName}</p>
      <p>Status: {sp.status}</p>
      <p>{sp.blurb}</p>
      {sp.images && sp.images.length > 0 && (
        <div className="grid sm:grid-cols-2 gap-3 mt-3">
          {sp.images.map((url, i) => (
            <img key={i} src={url} alt={`${sp.commonName} ${i+1}`} className="w-full h-48 object-cover rounded" />
          ))}
        </div>
      )}
      <h3 className="text-xl font-semibold mt-4">Where to see</h3>
      <ul className="list-disc pl-6">
        {where.map((s) => (
          <li key={s.id}><Link to={`/site/${s.id}`}>{s.name}</Link></li>
        ))}
      </ul>
      <div className="mt-4">
        <Link to="/ar" className="text-green-700 underline">Try AR demo</Link>
      </div>
    </div>
  )
})

const ARDemo = memo(function ARDemo() {
  const { isAdmin } = useAdmin()
  const { isMobileView } = useDeviceDetection()
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  // Species available in AR Viewer
  const arSpecies = [
    {
      id: 'eagle',
      name: 'Philippine Eagle',
      scientific: 'Pithecophaga jefferyi',
      status: 'Critically Endangered',
      description: 'The largest eagle in the Philippines, known for its impressive wingspan and hunting prowess.',
      modelUrl: '/models/philippine-eagle.glb', // Placeholder - update when available
      image: '/images/eagle-thumb.jpg' // Placeholder
    },
    {
      id: 'tarsier',
      name: 'Philippine Tarsier',
      scientific: 'Carlito syrichta',
      status: 'Near Threatened',
      description: 'A tiny primate with enormous eyes, perfectly adapted for nocturnal life in the rainforest.',
      modelUrl: '/models/philippine-tarsier.glb',
      image: '/images/tarsier-thumb.jpg'
    },
    {
      id: 'butterfly',
      name: 'Mati Blue Butterfly',
      scientific: 'Graphium sarpedon',
      status: 'Common',
      description: 'A beautiful butterfly species found in Mati City, known for its striking blue wings.',
      modelUrl: '/models/mati-blue-butterfly.glb',
      image: '/images/butterfly-thumb.jpg'
    },
    {
      id: 'mangrove',
      name: 'Red Mangrove',
      scientific: 'Rhizophora mangle',
      status: 'Ecologically Important',
      description: 'Vital coastal tree that protects shorelines and provides habitat for marine life.',
      modelUrl: '/models/red-mangrove.glb',
      image: '/images/mangrove-thumb.jpg'
    },
    {
      id: 'coral',
      name: 'Staghorn Coral',
      scientific: 'Acropora cervicornis',
      status: 'Threatened',
      description: 'Branching coral that forms complex reef structures essential for marine biodiversity.',
      modelUrl: '/models/staghorn-coral.glb',
      image: '/images/coral-thumb.jpg'
    },
    {
      id: 'palm',
      name: 'Coconut Palm',
      scientific: 'Cocos nucifera',
      status: 'Abundant',
      description: 'Iconic tropical tree that provides food, shelter, and economic value to local communities.',
      modelUrl: '/models/coconut-palm.glb',
      image: '/images/palm-thumb.jpg'
    },
    {
      id: 'koi',
      name: 'Tri-Coloured Koi',
      scientific: 'Cyprinus carpio',
      status: 'Cultivated',
      description: 'A beautiful ornamental fish with striking tri-color patterns, symbolizing good fortune in Asian cultures.',
      modelUrl: '/models/tri-coloured-koi.glb',
      image: '/images/koi-thumb.jpg'
    }
  ]

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Critically Endangered': return 'text-red-600 bg-red-100 dark:text-red-400 dark:bg-red-900/30'
      case 'Endangered': return 'text-orange-600 bg-orange-100 dark:text-orange-400 dark:bg-orange-900/30'
      case 'Vulnerable': return 'text-yellow-600 bg-yellow-100 dark:text-yellow-400 dark:bg-yellow-900/30'
      case 'Near Threatened': return 'text-blue-600 bg-blue-100 dark:text-blue-400 dark:bg-blue-900/30'
      default: return 'text-green-600 bg-green-100 dark:text-green-400 dark:bg-green-900/30'
    }
  }

  // Import species data
  const { species: allMatiSpecies } = useData()
  const [selectedSpecies, setSelectedSpecies] = useState<string | null>(null)
  const [showARExperienceModal, setShowARExperienceModal] = useState(false)
  const [arExperienceUrl, setArExperienceUrl] = useState<string>('')

  // Search and filter state
  const [searchQuery, setSearchQuery] = useState('')
  const [selectedCategory, setSelectedCategory] = useState<string | null>(null)
  const [selectedStatus, setSelectedStatus] = useState<string | null>(null)

  // Filtered species based on search and filters
  const filteredSpecies = useMemo(() => {
    return allMatiSpecies.filter((species) => {
      // Search filter
      const matchesSearch = searchQuery === '' || 
        species.commonName.toLowerCase().includes(searchQuery.toLowerCase()) ||
        species.scientificName.toLowerCase().includes(searchQuery.toLowerCase())

      // Category filter
      const matchesCategory = selectedCategory === null || 
        selectedCategory === 'all' || 
        species.category === selectedCategory

      // Status filter
      const matchesStatus = selectedStatus === null || 
        selectedStatus === 'all' || 
        species.status === selectedStatus

      return matchesSearch && matchesCategory && matchesStatus
    })
  }, [allMatiSpecies, searchQuery, selectedCategory, selectedStatus])

  const selectedSpeciesData = selectedSpecies 
    ? allMatiSpecies.find(s => s.id === selectedSpecies)
    : null

  // Check if species has AR content (experience URL only)
  const hasARContent = selectedSpeciesData?.arExperienceUrl

  // Generate AR viewer URL
  const getARViewerUrl = () => {
    if (!selectedSpeciesData || !hasARContent) return ''
    
    const params = new URLSearchParams({
      experience: selectedSpeciesData.arExperienceUrl || '',
      scale: selectedSpeciesData.arModelScale?.toString() || '1.0',
      rx: selectedSpeciesData.arModelRotation?.x?.toString() || '0',
      ry: selectedSpeciesData.arModelRotation?.y?.toString() || '0',
      rz: selectedSpeciesData.arModelRotation?.z?.toString() || '0',
      name: encodeURIComponent(selectedSpeciesData.commonName),
      scientific: encodeURIComponent(selectedSpeciesData.scientificName)
    })
    
    return `/ar-viewer-arjs.html?${params.toString()}`
  }

  return (
    <div className="min-h-screen bg-gray-50 dark:bg-slate-900">
      {/* Hero Section */}
      <div className="relative bg-gradient-to-br from-emerald-600 via-blue-600 to-purple-700 text-white overflow-hidden">
        {/* Animated mesh background */}
        <div className="absolute inset-0 opacity-20">
          <div className="absolute inset-0" style={{
            backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23ffffff' fill-opacity='0.4'%3E%3Cpath d='M36 34v-4h-2v4h-4v2h4v4h2v-4h4v-2h-4zm0-30V0h-2v4h-4v2h4v4h2V6h4V4h-4zM6 34v-4H4v4H0v2h4v4h2v-4h4v-2H6zM6 4V0H4v4H0v2h4v4h2V6h4V4H6z'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
          }}></div>
        </div>

        <div className="container mx-auto px-4 py-16 md:py-24 relative z-10">
          <div className="max-w-4xl mx-auto text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-md px-4 py-2 rounded-full mb-6 border border-white/30">
              <ARIcon className="w-5 h-5" />
              <span className="text-sm font-semibold">Augmented Reality Experience</span>
            </div>
            
            <h1 className="text-5xl md:text-7xl font-black mb-6 leading-tight">
              <AnimatedText text="Mati City" />
              <br />
              <span className="text-emerald-200">Biodiversity AR Gallery</span>
            </h1>
            
            <p className="text-xl md:text-2xl text-white/90 mb-8 leading-relaxed">
              Explore our interactive species gallery. Click any species to reveal its unique QR code and experience it in stunning 3D augmented reality.
            </p>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-12 max-w-7xl">
        {/* Search and Filter Section */}
        <div className="mb-8 space-y-4">
          {/* Search Bar */}
          <div className="relative max-w-md mx-auto">
            <div className="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
              <svg className="h-5 w-5 text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
              </svg>
            </div>
            <input
              type="text"
              placeholder="Search species by name..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="block w-full pl-10 pr-3 py-3 border border-slate-300 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white placeholder-slate-500 dark:placeholder-slate-400 focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all duration-200"
            />
          </div>

          {/* Filter Buttons */}
          <div className="flex flex-wrap justify-center gap-2">
            {/* Category Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'all' ? null : 'all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === 'all'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                All Categories
              </button>
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'fauna' ? null : 'fauna')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === 'fauna'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                🦊 Fauna
              </button>
              <button
                onClick={() => setSelectedCategory(selectedCategory === 'flora' ? null : 'flora')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedCategory === 'flora'
                    ? 'bg-green-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                🌱 Flora
              </button>
            </div>

            {/* Status Filters */}
            <div className="flex gap-2">
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'all' ? null : 'all')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedStatus === 'all'
                    ? 'bg-purple-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                All Status
              </button>
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'CR' ? null : 'CR')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedStatus === 'CR'
                    ? 'bg-red-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Critically Endangered
              </button>
              <button
                onClick={() => setSelectedStatus(selectedStatus === 'EN' ? null : 'EN')}
                className={`px-4 py-2 rounded-xl font-medium transition-all duration-200 ${
                  selectedStatus === 'EN'
                    ? 'bg-orange-500 text-white shadow-lg'
                    : 'bg-slate-100 dark:bg-slate-700 text-slate-700 dark:text-slate-300 hover:bg-slate-200 dark:hover:bg-slate-600'
                }`}
              >
                Endangered
              </button>
            </div>
          </div>

          {/* Results Count */}
          <div className="text-center text-sm text-slate-600 dark:text-slate-400">
            Showing {filteredSpecies.length} of {allMatiSpecies.length} species
          </div>
        </div>

        {/* Gallery Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-12">
          {filteredSpecies.map((species) => {
            const speciesImage = species.images && species.images.length > 0 ? species.images[0] : 
              (species.category === 'fauna' 
                ? 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop&crop=center'
                : 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=600&fit=crop&crop=center')
            
            const isSelected = selectedSpecies === species.id
            
            return (
              <button
                key={species.id}
                onClick={() => setSelectedSpecies(isSelected ? null : species.id)}
                className={`group relative overflow-hidden rounded-2xl transition-all duration-500 ${
                  isSelected 
                    ? 'ring-4 ring-purple-600 ring-offset-4 ring-offset-gray-50 dark:ring-offset-slate-900 scale-105 shadow-2xl' 
                    : 'hover:scale-105 hover:shadow-xl'
                }`}
                style={{ height: '300px' }}
              >
                {/* Image */}
                <img 
                  src={speciesImage} 
                  alt={species.commonName}
                  className="absolute inset-0 w-full h-full object-cover transition-transform duration-700 group-hover:scale-110"
                />
                
                {/* Gradient Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black via-black/40 to-transparent opacity-80 group-hover:opacity-90 transition-opacity duration-300"></div>
                
                {/* Content */}
                <div className="absolute inset-0 p-4 flex flex-col justify-end">
                  {/* Status Badge */}
                  <div className="absolute top-3 right-3">
                    <Badge className={`text-xs px-2 py-1 rounded-full font-bold ${getStatusColor(
                      species.status === 'CR' ? 'Critically Endangered' :
                      species.status === 'EN' ? 'Endangered' :
                      species.status === 'VU' ? 'Vulnerable' :
                      species.status === 'NT' ? 'Near Threatened' :
                      'Least Concern'
                    )}`}>
                      {species.status}
                    </Badge>
                  </div>

                  {/* Title */}
                  <h3 className="text-white font-black text-lg mb-1 leading-tight group-hover:text-emerald-300 transition-colors duration-300">
                    {species.commonName}
                  </h3>
                  <p className="text-white/70 text-xs italic mb-2">{species.scientificName}</p>
                  
                  {/* Category */}
                  <div className="flex items-center gap-2">
                    <span className="text-xs bg-white/20 backdrop-blur-md px-2 py-1 rounded-full text-white font-medium">
                      {species.category === 'fauna' ? '🦊 Fauna' : '🌱 Flora'}
                    </span>
                    {isSelected && (
                      <span className="text-xs bg-purple-600 px-2 py-1 rounded-full text-white font-bold animate-pulse">
                        Selected
                      </span>
                    )}
                  </div>
                </div>

                {/* Click Indicator */}
                {!isSelected && (
                  <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 pointer-events-none">
                    <div className="bg-white/95 backdrop-blur-md px-6 py-3 rounded-full shadow-2xl">
                      <span className="text-sm font-bold text-purple-600">Click to view AR</span>
                    </div>
                  </div>
                )}
              </button>
            )
          })}
        </div>

        {/* QR Code Modal/Section */}
        {selectedSpeciesData && (
          <div className="fixed inset-0 bg-black/70 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-300"
               onClick={() => setSelectedSpecies(null)}>
            <div className="bg-gradient-to-br from-white via-slate-50 to-blue-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden animate-in slide-in-from-bottom-4 duration-500 border border-slate-200/50 dark:border-slate-700/50"
                 onClick={(e) => e.stopPropagation()}>

              {/* Enhanced Header with Floating Elements */}
              <div className="relative h-48 sm:h-64 flex-shrink-0 overflow-hidden">
                {/* Background Image with Enhanced Overlay */}
                <img
                  src={selectedSpeciesData.images && selectedSpeciesData.images.length > 0
                    ? selectedSpeciesData.images[0]
                    : (selectedSpeciesData.category === 'fauna'
                      ? 'https://images.unsplash.com/photo-1564349683136-77e08dba1ef7?w=800&h=600&fit=crop&crop=center'
                      : 'https://images.unsplash.com/photo-1466781783364-36c955e42a7f?w=800&h=600&fit=crop&crop=center')}
                  alt={selectedSpeciesData.commonName}
                  className="w-full h-full object-cover"
                />

                {/* Multi-layered gradient overlays */}
                <div className="absolute inset-0 bg-gradient-to-br from-black/60 via-black/40 to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-t from-slate-900/80 via-transparent to-transparent"></div>
                <div className="absolute inset-0 bg-gradient-to-r from-blue-900/30 via-transparent to-purple-900/30"></div>

                {/* Animated floating particles */}
                <div className="absolute inset-0 overflow-hidden">
                  <div className="absolute top-10 left-10 w-2 h-2 bg-white/30 rounded-full animate-pulse"></div>
                  <div className="absolute top-20 right-20 w-1 h-1 bg-blue-300/40 rounded-full animate-pulse delay-1000"></div>
                  <div className="absolute bottom-20 left-1/4 w-1.5 h-1.5 bg-purple-300/30 rounded-full animate-pulse delay-500"></div>
                  <div className="absolute top-1/3 right-10 w-1 h-1 bg-emerald-300/40 rounded-full animate-pulse delay-1500"></div>
                </div>

                {/* Enhanced Close Button */}
                <button
                  onClick={() => setSelectedSpecies(null)}
                  className="absolute top-6 right-6 bg-white/10 backdrop-blur-xl hover:bg-white/20 text-white p-3 rounded-2xl transition-all duration-300 hover:scale-110 shadow-lg border border-white/20"
                >
                  <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                  </svg>
                </button>

                {/* Enhanced Title Section */}
                <div className="absolute bottom-4 sm:bottom-6 left-4 sm:left-6 right-4 sm:right-6">
                  <div className="flex items-end justify-between">
                    <div className="space-y-1 sm:space-y-2">
                      <h2 className="text-2xl sm:text-4xl font-black text-white leading-tight drop-shadow-lg">
                        {selectedSpeciesData.commonName}
                      </h2>
                      <p className="text-white/90 italic text-sm sm:text-lg font-medium drop-shadow-md">
                        {selectedSpeciesData.scientificName}
                      </p>
                    </div>

                    {/* Floating Status Badge */}
                    <div className="bg-white/95 backdrop-blur-xl px-3 sm:px-4 py-1 sm:py-2 rounded-2xl shadow-xl border border-white/20">
                      <span className={`inline-flex items-center gap-2 text-xs sm:text-sm font-bold px-2 sm:px-3 py-1 rounded-xl ${
                        selectedSpeciesData.status === 'CR' ? 'bg-red-100 text-red-700' :
                        selectedSpeciesData.status === 'EN' ? 'bg-orange-100 text-orange-700' :
                        selectedSpeciesData.status === 'VU' ? 'bg-yellow-100 text-yellow-700' :
                        selectedSpeciesData.status === 'NT' ? 'bg-blue-100 text-blue-700' :
                        'bg-green-100 text-green-700'
                      }`}>
                        <span className="w-1.5 h-1.5 sm:w-2 sm:h-2 rounded-full bg-current animate-pulse"></span>
                        {selectedSpeciesData.status}
                      </span>
                    </div>
                  </div>
                </div>
              </div>

              {/* Enhanced Content Section - Scrollable */}
              <div className="flex-1 overflow-y-auto">
                <div className="p-4 sm:p-8">
                  <div className="grid lg:grid-cols-3 gap-6 sm:gap-8">

                    {/* Left Column - Species Information */}
                    <div className="lg:col-span-2 space-y-4 sm:space-y-6">

                      {/* Enhanced Status and Category Cards */}
                      <div className="grid grid-cols-2 gap-3 sm:gap-4">
                        <div className="bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-900/20 dark:to-green-900/20 p-3 sm:p-4 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/50">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-emerald-500 rounded-xl">
                              <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z" />
                              </svg>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-emerald-700 dark:text-emerald-300 uppercase tracking-wide">Status</p>
                              <p className="text-xs sm:text-sm font-bold text-emerald-800 dark:text-emerald-200">
                                {selectedSpeciesData.status === 'CR' ? 'Critically Endangered' :
                                 selectedSpeciesData.status === 'EN' ? 'Endangered' :
                                 selectedSpeciesData.status === 'VU' ? 'Vulnerable' :
                                 selectedSpeciesData.status === 'NT' ? 'Near Threatened' :
                                 'Least Concern'}
                              </p>
                            </div>
                          </div>
                        </div>

                        <div className="bg-gradient-to-br from-blue-50 to-indigo-50 dark:from-blue-900/20 dark:to-indigo-900/20 p-3 sm:p-4 rounded-2xl border border-blue-200/50 dark:border-blue-700/50">
                          <div className="flex items-center gap-2 sm:gap-3">
                            <div className="p-1.5 sm:p-2 bg-blue-500 rounded-xl">
                              <span className="text-sm sm:text-lg">{selectedSpeciesData.category === 'fauna' ? '🦊' : '🌱'}</span>
                            </div>
                            <div>
                              <p className="text-xs font-semibold text-blue-700 dark:text-blue-300 uppercase tracking-wide">Category</p>
                              <p className="text-xs sm:text-sm font-bold text-blue-800 dark:text-blue-200">
                                {selectedSpeciesData.category === 'fauna' ? 'Fauna' : 'Flora'}
                              </p>
                            </div>
                          </div>
                        </div>
                      </div>

                      {/* Enhanced Description Section */}
                      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl">
                            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">About</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                          {selectedSpeciesData.blurb}
                        </p>
                      </div>

                      {/* Enhanced Habitat Section */}
                      <div className="bg-white dark:bg-slate-800 p-4 sm:p-6 rounded-2xl shadow-lg border border-slate-200/50 dark:border-slate-700/50">
                        <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                          <div className="p-1.5 sm:p-2 bg-gradient-to-br from-teal-500 to-cyan-500 rounded-xl">
                            <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white">Habitat</h3>
                        </div>
                        <p className="text-slate-600 dark:text-slate-300 leading-relaxed text-sm sm:text-base">
                          {selectedSpeciesData.habitat}
                        </p>
                      </div>
                    </div>

                    {/* Right Column - AR Experience */}
                    <div className="space-y-4 sm:space-y-6">
                      {hasARContent ? (
                        <>
                          {/* Enhanced AR Marker Display */}
                          <div className="bg-gradient-to-br from-purple-600 via-blue-600 to-indigo-600 p-4 sm:p-6 rounded-3xl shadow-2xl relative overflow-hidden">
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-br from-white/10 via-transparent to-purple-500/20 animate-pulse"></div>

                            <div className="relative text-center">
                              <div className="mb-3 sm:mb-4">
                                {selectedSpeciesData.arMarkerImageUrl ? (
                                  <img
                                    src={selectedSpeciesData.arMarkerImageUrl}
                                    alt={`${selectedSpeciesData.commonName} AR Marker`}
                                    className="w-24 h-24 sm:w-32 sm:h-32 object-contain mx-auto rounded-2xl shadow-lg bg-white/90 p-2"
                                    onError={(e) => {
                                      console.log('Marker image failed to load for:', selectedSpeciesData.commonName);
                                    }}
                                  />
                                ) : (
                                  <div className="w-24 h-24 sm:w-32 sm:h-32 mx-auto bg-white/20 rounded-2xl flex items-center justify-center">
                                    <svg className="w-12 h-12 sm:w-16 sm:h-16 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                    </svg>
                                  </div>
                                )}
                              </div>

                              <h4 className="text-lg sm:text-xl font-bold text-white mb-2">AR Marker</h4>
                              <p className="text-white/80 text-xs sm:text-sm mb-4 sm:mb-6">
                                Download and print this marker to begin your AR experience
                              </p>

                              {/* Download Button */}
                              {selectedSpeciesData.arMarkerImageUrl && (
                                <a
                                  href={selectedSpeciesData.arMarkerImageUrl}
                                  download={`${selectedSpeciesData.commonName.replace(/\s+/g, '_')}_AR_Marker.png`}
                                  target="_blank"
                                  rel="noopener noreferrer"
                                  className="inline-flex items-center gap-2 px-4 py-2 sm:px-6 sm:py-3 bg-white/20 hover:bg-white/30 backdrop-blur-sm text-white rounded-xl font-semibold shadow-lg transition-all hover:scale-105 border border-white/30 mb-3 sm:mb-4 text-sm sm:text-base"
                                >
                                  <svg className="w-4 h-4 sm:w-5 sm:h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                                  </svg>
                                  Download Marker
                                </a>
                              )}
                            </div>
                          </div>

                          {/* Enhanced AR Experience Button */}
                          <button
                            onClick={() => {
                              console.log('Opening AR experience for:', selectedSpeciesData.commonName);
                              console.log('AR URL:', selectedSpeciesData.arExperienceUrl);

                              if (selectedSpeciesData.arExperienceUrl) {
                                setArExperienceUrl(selectedSpeciesData.arExperienceUrl);
                                setShowARExperienceModal(true);
                              }
                            }}
                            className="w-full bg-gradient-to-r from-blue-600 via-purple-600 to-indigo-600 hover:from-blue-700 hover:via-purple-700 hover:to-indigo-700 text-white rounded-3xl font-bold shadow-2xl transition-all hover:scale-105 hover:shadow-3xl p-4 sm:p-6 relative overflow-hidden group"
                          >
                            {/* Animated background */}
                            <div className="absolute inset-0 bg-gradient-to-r from-white/20 via-transparent to-white/20 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                            <div className="relative flex flex-col items-center gap-2 sm:gap-3">
                              <div className="p-2 sm:p-3 bg-white/20 rounded-2xl group-hover:scale-110 transition-transform duration-300">
                                <svg className="w-6 h-6 sm:w-8 sm:h-8" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                                </svg>
                              </div>
                              <div className="text-center">
                                <h4 className="text-lg sm:text-xl font-bold mb-1">Click to view AR</h4>
                                <p className="text-white/80 text-xs sm:text-sm">Immerse yourself in augmented reality</p>
                              </div>
                            </div>
                          </button>

                          {/* AR Instructions Card */}
                          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-700 p-4 sm:p-6 rounded-2xl border border-slate-200/50 dark:border-slate-600/50">
                            <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                              <div className="p-1.5 sm:p-2 bg-gradient-to-br from-amber-500 to-orange-500 rounded-xl">
                                <svg className="w-3 h-3 sm:w-5 sm:h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                                </svg>
                              </div>
                              <h4 className="font-bold text-slate-900 dark:text-white text-sm sm:text-base">Quick Start</h4>
                            </div>
                            <div className="space-y-2 sm:space-y-3 text-xs sm:text-sm text-slate-600 dark:text-slate-300">
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold mt-1 text-xs sm:text-sm">1.</span>
                                <span>Download and print the AR marker above</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold mt-1 text-xs sm:text-sm">2.</span>
                                <span>Point your camera at the marker</span>
                              </div>
                              <div className="flex items-start gap-2">
                                <span className="text-emerald-500 font-bold mt-1 text-xs sm:text-sm">3.</span>
                                <span>Watch the 3D model come to life!</span>
                              </div>
                            </div>
                          </div>
                        </>
                      ) : (
                        /* Enhanced No AR Content Message */
                        <div className="bg-gradient-to-br from-slate-100 to-slate-200 dark:from-slate-800 dark:to-slate-700 p-6 sm:p-8 rounded-3xl text-center border border-slate-200/50 dark:border-slate-600/50">
                          <div className="mb-4 sm:mb-6">
                            <div className="w-16 h-16 sm:w-20 sm:h-20 mx-auto bg-gradient-to-br from-slate-400 to-slate-500 rounded-2xl flex items-center justify-center mb-3 sm:mb-4">
                              <svg className="w-8 h-8 sm:w-10 sm:h-10 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                              </svg>
                            </div>
                            <h4 className="text-lg sm:text-xl font-bold text-slate-900 dark:text-white mb-2">AR Experience Coming Soon</h4>
                            <p className="text-slate-600 dark:text-slate-300 text-sm sm:text-base">
                              This species doesn&apos;t have an AR experience configured yet. We&apos;re working on bringing you immersive 3D content!
                            </p>
                          </div>
                        </div>
                      )}
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        {/* AR Experience Modal */}
        {showARExperienceModal && arExperienceUrl && (
          <div className="fixed inset-0 bg-black/90 backdrop-blur-md z-50 flex items-center justify-center p-4 animate-in fade-in duration-500"
               onClick={() => setShowARExperienceModal(false)}>
            <style dangerouslySetInnerHTML={{
              __html: `
                .hide-scrollbar::-webkit-scrollbar {
                  display: none;
                }
                .hide-scrollbar {
                  -ms-overflow-style: none;
                  scrollbar-width: none;
                }
              `
            }} />
            <div className="bg-white dark:bg-slate-900 rounded-3xl max-w-7xl w-full h-[80vh] sm:h-[95vh] shadow-2xl overflow-y-auto animate-in slide-in-from-bottom-6 duration-700 border border-slate-200/50 dark:border-slate-700/50 hide-scrollbar"
                 onClick={(e) => e.stopPropagation()}>
              {/* Enhanced Header */}
              <div className="relative h-20 bg-gradient-to-r from-purple-600 via-blue-600 to-indigo-600 flex items-center justify-between px-4 sm:px-8 overflow-hidden">
                {/* Animated background elements */}
                <div className="absolute inset-0 opacity-20">
                  <div className="absolute top-0 left-0 w-32 h-32 bg-white/10 rounded-full -translate-x-16 -translate-y-16 animate-pulse"></div>
                  <div className="absolute top-0 right-0 w-24 h-24 bg-white/10 rounded-full translate-x-12 -translate-y-12 animate-pulse delay-1000"></div>
                  <div className="absolute bottom-0 left-1/2 w-20 h-20 bg-white/10 rounded-full -translate-x-10 translate-y-10 animate-pulse delay-500"></div>
                </div>

                <div className="flex items-center gap-4 relative z-10">
                  <div className="p-3 bg-white/20 backdrop-blur-sm rounded-2xl shadow-lg">
                    <svg className="w-8 h-8 text-white animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M14 10l-2 1m0 0l-2-1m2 1v2.5M20 7l-2 1m2-1l-2-1m2 1v2.5M14 4l-2-1-2 1M4 7l2-1M4 7l2 1M4 7v2.5M12 21l-2-1m2 1l2-1m-2 1v-2.5M6 18l-2-1v-2.5M18 18l2-1v-2.5" />
                    </svg>
                  </div>
                  <div>
                    <h2 className="text-xl sm:text-2xl font-black text-white">AR Experience</h2>
                    <p className="text-white/80 text-sm font-medium">Immersive Augmented Reality</p>
                  </div>
                </div>

                <div className="flex items-center gap-3 relative z-10">
                  {/* Instructions Button */}
                  <button
                    onClick={() => {/* Could add instructions modal */}}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-300 hover:scale-105"
                    title="AR Instructions"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                    </svg>
                  </button>

                  {/* Close Button */}
                  <button
                    onClick={() => setShowARExperienceModal(false)}
                    className="p-3 bg-white/10 hover:bg-white/20 backdrop-blur-sm rounded-xl text-white transition-all duration-300 hover:scale-105 hover:rotate-90"
                  >
                    <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                    </svg>
                  </button>
                </div>
              </div>

              {/* Enhanced Content Area */}
              <div className={`flex ${isMobileView ? 'flex-col' : ''} h-full`}>
                {/* Side Panel with Instructions - Hidden on mobile */}
                {!isMobileView && (
                  <div className="w-80 bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 border-r border-slate-200 dark:border-slate-700 overflow-y-auto">
                  <div className="space-y-6">
                    {/* Species Info Card */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                      <div className="flex items-center gap-3 mb-3">
                        <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                          <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                          </svg>
                        </div>
                        <h3 className="font-bold text-slate-900 dark:text-white">AR Instructions</h3>
                      </div>
                      <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">1.</span>
                          <span>Point your camera at the downloaded AR marker</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">2.</span>
                          <span>Ensure good lighting for better detection</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">3.</span>
                          <span>Hold steady and wait for the 3D model to appear</span>
                        </div>
                        <div className="flex items-start gap-2">
                          <span className="text-green-500 mt-1">4.</span>
                          <span>Move your device to explore different angles</span>
                        </div>
                      </div>
                    </div>

                    {/* Quick Actions */}
                    <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                        <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                        </svg>
                        Quick Actions
                      </h4>
                      <div className="space-y-2">
                        <button 
                          className="w-full text-left p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 rounded-xl transition-all duration-200 border border-green-200 dark:border-green-800"
                          onClick={() => {
                            if (selectedSpeciesData?.arMarkerImageUrl) {
                              const link = document.createElement('a');
                              link.href = selectedSpeciesData.arMarkerImageUrl;
                              link.download = `${selectedSpeciesData.commonName.replace(/\s+/g, '_')}_AR_Marker.png`;
                              link.target = '_blank';
                              link.rel = 'noopener noreferrer';
                              document.body.appendChild(link);
                              link.click();
                              document.body.removeChild(link);
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                            </svg>
                            <span className="text-sm font-medium text-green-700 dark:text-green-300">Download Marker Again</span>
                          </div>
                        </button>
                        <button 
                          className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 rounded-xl transition-all duration-200 border border-purple-200 dark:border-purple-800"
                          onClick={async () => {
                            try {
                              // Try to capture the AR iframe content
                              const arContainer = document.querySelector('.relative.w-full.h-full.max-w-4xl.mx-auto');
                              const iframe = arContainer?.querySelector('iframe') as HTMLIFrameElement;
                              
                              if (iframe && iframe.contentDocument) {
                                // Try to access the iframe's canvas directly
                                const iframeDoc = iframe.contentDocument;
                                const canvas = iframeDoc.querySelector('canvas') as HTMLCanvasElement;
                                
                                if (canvas) {
                                  // Convert canvas to blob and download
                                  canvas.toBlob((blob) => {
                                    if (blob) {
                                      const url = URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `AR_Capture_${selectedSpeciesData?.commonName.replace(/\s+/g, '_') || 'Screenshot'}_${new Date().toISOString().split('T')[0]}.png`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(url);
                                    }
                                  }, 'image/png');
                                } else {
                                  // Fallback to html2canvas if canvas not found
                                  const html2canvas = (await import('html2canvas')).default;
                                  const canvas = await html2canvas(arContainer as HTMLElement, {
                                    useCORS: true,
                                    allowTaint: false,
                                    scale: 1,
                                    width: 800,
                                    height: 600,
                                    ignoreElements: (element) => {
                                      // Ignore elements that might cause issues
                                      return element.tagName === 'VIDEO' || element.tagName === 'CANVAS';
                                    }
                                  });
                                  
                                  canvas.toBlob((blob) => {
                                    if (blob) {
                                      const url = URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `AR_Capture_${selectedSpeciesData?.commonName.replace(/\s+/g, '_') || 'Screenshot'}_${new Date().toISOString().split('T')[0]}.png`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(url);
                                    }
                                  }, 'image/png');
                                }
                              } else {
                                // Fallback: try html2canvas on the container
                                const html2canvas = (await import('html2canvas')).default;
                                const canvas = await html2canvas(arContainer as HTMLElement, {
                                  useCORS: true,
                                  allowTaint: false,
                                  scale: 1,
                                  width: 800,
                                  height: 600
                                });
                                
                                canvas.toBlob((blob) => {
                                  if (blob) {
                                    const url = URL.createObjectURL(blob);
                                    const link = document.createElement('a');
                                    link.href = url;
                                    link.download = `AR_Capture_${selectedSpeciesData?.commonName.replace(/\s+/g, '_') || 'Screenshot'}_${new Date().toISOString().split('T')[0]}.png`;
                                    document.body.appendChild(link);
                                    link.click();
                                    document.body.removeChild(link);
                                    URL.revokeObjectURL(url);
                                  }
                                }, 'image/png');
                              }
                            } catch (error) {
                              console.error('Screenshot failed:', error);
                              // Try browser native screenshot API as last resort
                              try {
                                // Simple fallback: alert user to use browser screenshot
                                alert('Screenshot failed. Please try again or use your browser\'s screenshot feature (F12 > Screenshot).');
                              } catch (fallbackError) {
                                console.error('All screenshot methods failed:', fallbackError);
                                alert('Screenshot failed. Please try again or use your browser\'s screenshot feature (F12 > Screenshot).');
                              }
                            }
                          }}
                        >
                          <div className="flex items-center gap-3">
                            <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                            </svg>
                            <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Capture</span>
                          </div>
                        </button>
                      </div>
                    </div>

                    {/* Tech Info */}
                    <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
                      <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                        <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                        </svg>
                        AR Technology
                      </h4>
                      <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                        Powered by AR.js and A-Frame for marker-based augmented reality experiences. Uses WebRTC for camera access and Three.js for 3D rendering. Compatible with modern browsers and AR-capable devices.
                      </p>
                    </div>
                  </div>
                </div>
                )}

                {/* Main Content Area */}
                <div className="flex-1 flex flex-col">
                  {/* Loading/Status Bar */}
                  <div className="h-12 bg-slate-50 dark:bg-slate-800 border-b border-slate-200 dark:border-slate-700 flex items-center justify-between px-4 sm:px-6">
                    <div className="flex items-center gap-3">
                      <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
                      <span className="text-sm font-medium text-slate-600 dark:text-slate-300">AR Experience Ready</span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 dark:text-slate-400">
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 18h.01M8 21h8a2 2 0 002-2V5a2 2 0 00-2-2H8a2 2 0 00-2 2v14a2 2 0 002 2z" />
                      </svg>
                      <span>Mobile Optimized</span>
                    </div>
                  </div>

                  {/* AR Content */}
                  <div className="flex-1 relative bg-slate-900 overflow-hidden">
                    {/* Background Pattern */}
                    <div className="absolute inset-0 opacity-5">
                      <div className="absolute inset-0" style={{
                        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%239C92AC' fill-opacity='0.1'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`,
                      }}></div>
                    </div>

                    {/* AR Content Container */}
                    <div className="h-full flex items-center justify-center p-4 sm:p-8">
                      {(() => {
                        const is3DModel = /\.(gltf|glb|obj|fbx|dae|3ds|ply|stl)$/i.test(arExperienceUrl);

                        if (is3DModel) {
                          // Enhanced AR Viewer for 3D models
                          const arUrl = getARViewerUrl();
                          return (
                            <div className="relative w-full h-full max-w-4xl mx-auto">
                              {/* AR Viewer Frame */}
                              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <iframe
                                  src={arUrl}
                                  className="w-full h-full min-h-[400px] sm:min-h-[600px] border-0"
                                  title="AR Experience"
                                  allow="camera; microphone; gyroscope; accelerometer"
                                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation"
                                />
                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-purple-500 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-blue-500 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-indigo-500 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-purple-500 rounded-br-lg"></div>
                              </div>

                              {/* Floating Instructions */}
                              <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium animate-in slide-in-from-left duration-500 delay-1000">
                                📱 Point camera at AR marker to begin
                              </div>
                            </div>
                          );
                        } else {
                          // Enhanced iframe for other content
                          return (
                            <div className="relative w-full h-full max-w-6xl mx-auto">
                              <div className="relative bg-white dark:bg-slate-800 rounded-2xl shadow-2xl overflow-hidden border border-slate-200 dark:border-slate-700">
                                <iframe
                                  src={arExperienceUrl}
                                  className="w-full h-full min-h-[400px] sm:min-h-[600px] border-0"
                                  title="External Content"
                                  allow="camera *; microphone *; gyroscope *; accelerometer *; xr-spatial-tracking *"
                                  sandbox="allow-same-origin allow-scripts allow-forms allow-popups allow-presentation allow-downloads"
                                />
                                {/* Corner decorations */}
                                <div className="absolute top-0 left-0 w-8 h-8 border-l-4 border-t-4 border-green-500 rounded-tl-lg"></div>
                                <div className="absolute top-0 right-0 w-8 h-8 border-r-4 border-t-4 border-teal-500 rounded-tr-lg"></div>
                                <div className="absolute bottom-0 left-0 w-8 h-8 border-l-4 border-b-4 border-emerald-500 rounded-bl-lg"></div>
                                <div className="absolute bottom-0 right-0 w-8 h-8 border-r-4 border-b-4 border-green-500 rounded-br-lg"></div>
                              </div>

                              {/* Floating Instructions */}
                              <div className="absolute top-4 right-4 bg-black/80 backdrop-blur-md text-white px-4 py-2 rounded-xl text-sm font-medium animate-in slide-in-from-right duration-500 delay-1000">
                                🎯 Interactive content loaded
                              </div>
                            </div>
                          );
                        }
                      })()}
                    </div>
                  </div>
                </div>

                {/* Mobile Instructions and Actions - Shown below camera on mobile */}
                {isMobileView && (
                  <div className="bg-gradient-to-b from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 p-4 sm:p-6 border-t border-slate-200 dark:border-slate-700">
                    <div className="space-y-6">
                      {/* Species Info Card */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                        <div className="flex items-center gap-3 mb-3">
                          <div className="p-2 bg-gradient-to-br from-purple-500 to-blue-500 rounded-lg">
                            <svg className="w-5 h-5 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
                            </svg>
                          </div>
                          <h3 className="font-bold text-slate-900 dark:text-white">AR Instructions</h3>
                        </div>
                        <div className="space-y-3 text-sm text-slate-600 dark:text-slate-300">
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">1.</span>
                            <span>Point your camera at the downloaded AR marker</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">2.</span>
                            <span>Ensure good lighting for better detection</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">3.</span>
                            <span>Hold steady and wait for the 3D model to appear</span>
                          </div>
                          <div className="flex items-start gap-2">
                            <span className="text-green-500 mt-1">4.</span>
                            <span>Move your device to explore different angles</span>
                          </div>
                        </div>
                      </div>

                      {/* Quick Actions */}
                      <div className="bg-white dark:bg-slate-800 rounded-2xl p-4 shadow-lg border border-slate-200 dark:border-slate-700">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-3 flex items-center gap-2">
                          <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                          </svg>
                          Quick Actions
                        </h4>
                        <div className="space-y-2">
                          <button 
                            className="w-full text-left p-3 bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 hover:from-green-100 hover:to-emerald-100 dark:hover:from-green-900/30 dark:hover:to-emerald-900/30 rounded-xl transition-all duration-200 border border-green-200 dark:border-green-800"
                            onClick={() => {
                              if (selectedSpeciesData?.arMarkerImageUrl) {
                                const link = document.createElement('a');
                                link.href = selectedSpeciesData.arMarkerImageUrl;
                                link.download = `${selectedSpeciesData.commonName.replace(/\s+/g, '_')}_AR_Marker.png`;
                                link.target = '_blank';
                                link.rel = 'noopener noreferrer';
                                document.body.appendChild(link);
                                link.click();
                                document.body.removeChild(link);
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 10v6m0 0l-3-3m3 3l3-3m2 8H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
                              </svg>
                              <span className="text-sm font-medium text-green-700 dark:text-green-300">Download Marker Again</span>
                            </div>
                          </button>
                          <button 
                            className="w-full text-left p-3 bg-gradient-to-r from-purple-50 to-pink-50 dark:from-purple-900/20 dark:to-pink-900/20 hover:from-purple-100 hover:to-pink-100 dark:hover:from-purple-900/30 dark:hover:to-pink-900/30 rounded-xl transition-all duration-200 border border-purple-200 dark:border-purple-800"
                            onClick={async () => {
                              try {
                                // Try to capture the AR iframe content
                                const arContainer = document.querySelector('.relative.w-full.h-full.max-w-4xl.mx-auto');
                                const iframe = arContainer?.querySelector('iframe') as HTMLIFrameElement;
                                
                                if (iframe && iframe.contentDocument) {
                                  // Try to access the iframe's canvas directly
                                  const iframeDoc = iframe.contentDocument;
                                  const canvas = iframeDoc.querySelector('canvas') as HTMLCanvasElement;
                                  
                                  if (canvas) {
                                    // Convert canvas to blob and download
                                    canvas.toBlob((blob) => {
                                      if (blob) {
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `AR_Capture_${selectedSpeciesData?.commonName.replace(/\s+/g, '_') || 'Screenshot'}_${new Date().toISOString().split('T')[0]}.png`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        URL.revokeObjectURL(url);
                                      }
                                    }, 'image/png');
                                  } else {
                                    // Fallback to html2canvas if canvas not found
                                    const html2canvas = (await import('html2canvas')).default;
                                    const canvas = await html2canvas(arContainer as HTMLElement, {
                                      useCORS: true,
                                      allowTaint: false,
                                      scale: 1,
                                      width: 800,
                                      height: 600,
                                      ignoreElements: (element) => {
                                        // Ignore elements that might cause issues
                                        return element.tagName === 'VIDEO' || element.tagName === 'CANVAS';
                                      }
                                    });
                                    
                                    canvas.toBlob((blob) => {
                                      if (blob) {
                                        const url = URL.createObjectURL(blob);
                                        const link = document.createElement('a');
                                        link.href = url;
                                        link.download = `AR_Capture_${selectedSpeciesData?.commonName.replace(/\s+/g, '_') || 'Screenshot'}_${new Date().toISOString().split('T')[0]}.png`;
                                        document.body.appendChild(link);
                                        link.click();
                                        document.body.removeChild(link);
                                        URL.revokeObjectURL(url);
                                      }
                                    }, 'image/png');
                                  }
                                } else {
                                  // Fallback: try html2canvas on the container
                                  const html2canvas = (await import('html2canvas')).default;
                                  const canvas = await html2canvas(arContainer as HTMLElement, {
                                    useCORS: true,
                                    allowTaint: false,
                                    scale: 1,
                                    width: 800,
                                    height: 600
                                  });
                                  
                                  canvas.toBlob((blob) => {
                                    if (blob) {
                                      const url = URL.createObjectURL(blob);
                                      const link = document.createElement('a');
                                      link.href = url;
                                      link.download = `AR_Capture_${selectedSpeciesData?.commonName.replace(/\s+/g, '_') || 'Screenshot'}_${new Date().toISOString().split('T')[0]}.png`;
                                      document.body.appendChild(link);
                                      link.click();
                                      document.body.removeChild(link);
                                      URL.revokeObjectURL(url);
                                    }
                                  }, 'image/png');
                                }
                              } catch (error) {
                                console.error('Screenshot failed:', error);
                                // Try browser native screenshot API as last resort
                                try {
                                  // Simple fallback: alert user to use browser screenshot
                                  alert('Screenshot failed. Please try again or use your browser\'s screenshot feature (F12 > Screenshot).');
                                } catch (fallbackError) {
                                  console.error('All screenshot methods failed:', fallbackError);
                                  alert('Screenshot failed. Please try again or use your browser\'s screenshot feature (F12 > Screenshot).');
                                }
                              }
                            }}
                          >
                            <div className="flex items-center gap-3">
                              <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 9a2 2 0 012-2h.93a2 2 0 001.664-.89l.812-1.22A2 2 0 0110.07 4h3.86a2 2 0 011.664.89l.812 1.22A2 2 0 0018.07 7H19a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V9z" />
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M15 13a3 3 0 11-6 0 3 3 0 016 0z" />
                              </svg>
                              <span className="text-sm font-medium text-purple-700 dark:text-purple-300">Capture</span>
                            </div>
                          </button>
                        </div>
                      </div>

                      {/* Tech Info */}
                      <div className="bg-gradient-to-br from-purple-50 to-blue-50 dark:from-purple-900/20 dark:to-blue-900/20 rounded-2xl p-4 border border-purple-200 dark:border-purple-800">
                        <h4 className="font-bold text-slate-900 dark:text-white mb-2 flex items-center gap-2">
                          <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                          </svg>
                          AR Technology
                        </h4>
                        <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">
                          Powered by AR.js and A-Frame for marker-based augmented reality experiences. Uses WebRTC for camera access and Three.js for 3D rendering. Compatible with modern browsers and AR-capable devices.
                        </p>
                      </div>
                    </div>
                  </div>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Footer CTA */}
        <div className="text-center mt-16">
          <div className="inline-flex items-center gap-4 bg-white dark:bg-slate-800 rounded-2xl p-6 shadow-xl border border-gray-200 dark:border-slate-700">
            <div className="text-4xl">🎯</div>
            <div className="text-left">
              <h3 className="font-bold text-gray-900 dark:text-white">How to Use</h3>
              <p className="hidden sm:block text-sm text-gray-600 dark:text-gray-400">Click any species → Click to view AR → Enjoy augmented reality</p>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
})


// Form Components
const HotspotForm = memo(function HotspotForm({ initialData, onSave, onCancel }: { initialData?: Hotspot, onSave: (data: HotspotFormValues) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<HotspotFormValues>(() => createHotspotFormValues(initialData))

  useEffect(() => {
    setFormData(createHotspotFormValues(initialData))
  }, [initialData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(formData)
  }

  return (
    <form onSubmit={handleSubmit} className="space-y-4">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Name *
          </label>
          <input
            type="text"
            required
            value={formData.name}
            onChange={(e) => setFormData((prev) => ({ ...prev, name: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Type *
          </label>
          <select
            required
            value={formData.type}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, type: e.target.value as Hotspot['type'] }))
            }
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="terrestrial">Terrestrial</option>
            <option value="marine">Marine</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Latitude *
          </label>
          <input
            type="number"
            step="any"
            required
            value={formData.lat === '' ? '' : formData.lat}
            onChange={(e) => {
              const { value } = e.target
              setFormData((prev) => ({ ...prev, lat: value === '' ? '' : Number(value) }))
            }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Longitude *
          </label>
          <input
            type="number"
            step="any"
            required
            value={formData.lng === '' ? '' : formData.lng}
            onChange={(e) => {
              const { value } = e.target
              setFormData((prev) => ({ ...prev, lng: value === '' ? '' : Number(value) }))
            }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Area (hectares)
          </label>
          <input
            type="number"
            value={formData.areaHectares === '' || typeof formData.areaHectares === 'undefined' ? '' : formData.areaHectares}
            onChange={(e) => {
              const { value } = e.target
              setFormData((prev) => ({
                ...prev,
                areaHectares: value === '' ? '' : Number(value),
              }))
            }}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Image URL
          </label>
          <input
            type="url"
            value={formData.image ?? ''}
            onChange={(e) => setFormData((prev) => ({ ...prev, image: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Summary *
        </label>
        <input
          type="text"
          required
          value={formData.summary}
          onChange={(e) => setFormData((prev) => ({ ...prev, summary: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Description *
        </label>
        <textarea
          required
          rows={4}
          value={formData.description}
          onChange={(e) => setFormData((prev) => ({ ...prev, description: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div className="flex gap-3 justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all"
        >
          Cancel
        </button>
        <button
          type="submit"
          className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 text-white rounded-xl font-medium transition-all"
        >
          {initialData ? 'Update' : 'Create'} Hotspot
        </button>
      </div>
    </form>
  )
})

const SpeciesForm = memo(function SpeciesForm({ initialData, onSave, onCancel }: { initialData?: SpeciesDetail, onSave: (data: SpeciesFormValues) => void, onCancel: () => void }) {
  const [formData, setFormData] = useState<SpeciesFormValues>(() => createSpeciesFormValues(initialData))
  const [showImageModal, setShowImageModal] = useState(false)
  const [imageUrlInput, setImageUrlInput] = useState('')
  const [uploadingImage, setUploadingImage] = useState(false)

  useEffect(() => {
    setFormData(createSpeciesFormValues(initialData))
  }, [initialData])

  const handleSubmit = (e: React.FormEvent<HTMLFormElement>) => {
    e.preventDefault()
    onSave(formData)
  }

  const handleAddImageUrl = () => {
    if (imageUrlInput.trim()) {
      setFormData((prev) => ({ 
        ...prev, 
        images: [...(prev.images || []), imageUrlInput.trim()] 
      }))
      setImageUrlInput('')
      setShowImageModal(false)
    }
  }

  const handleImageUpload = async (file: File) => {
    if (!file) return
    
    setUploadingImage(true)
    try {
      const reader = new FileReader()
      reader.onload = (e) => {
        const base64 = e.target?.result as string
        setFormData((prev) => ({ 
          ...prev, 
          images: [...(prev.images || []), base64] 
        }))
        setUploadingImage(false)
        setShowImageModal(false)
      }
      reader.readAsDataURL(file)
    } catch (error) {
      console.error('Error uploading image:', error)
      setUploadingImage(false)
    }
  }

  const removeImage = (index: number) => {
    setFormData((prev) => ({ 
      ...prev, 
      images: prev.images?.filter((_, i) => i !== index) || [] 
    }))
  }

  return (
    <>
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Form Header with Icon */}
        <div className="flex items-center gap-3 pb-4 border-b border-slate-200 dark:border-slate-700">
          <div className="p-3 bg-gradient-to-br from-emerald-500 to-teal-500 rounded-xl shadow-lg">
            <svg className="w-6 h-6 text-white" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
          </div>
          <div>
            <h3 className="text-xl font-bold text-slate-900 dark:text-white">
              {initialData ? 'Edit Species' : 'Add New Species'}
            </h3>
            <p className="text-sm text-slate-500 dark:text-slate-400">
              Fill in the details about the species
            </p>
          </div>
        </div>

        {/* Image Gallery Preview */}
        {formData.images && formData.images.length > 0 && (
          <div className="bg-gradient-to-br from-slate-50 to-slate-100 dark:from-slate-800 dark:to-slate-900 rounded-2xl p-4 border border-slate-200 dark:border-slate-700">
            <div className="flex items-center justify-between mb-3">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200 flex items-center gap-2">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                </svg>
                Images ({formData.images.length})
              </h4>
              <button
                type="button"
                onClick={() => setShowImageModal(true)}
                className="text-xs text-emerald-600 dark:text-emerald-400 hover:underline font-medium"
              >
                Manage
              </button>
            </div>
            <div className="flex gap-2 overflow-x-auto pb-2">
              {formData.images.slice(0, 5).map((image, index) => (
                <img 
                  key={index}
                  src={image} 
                  alt={`Preview ${index + 1}`} 
                  className="w-20 h-20 object-cover rounded-lg border-2 border-white dark:border-slate-700 shadow-md"
                />
              ))}
              {formData.images.length > 5 && (
                <div className="w-20 h-20 flex items-center justify-center bg-slate-200 dark:bg-slate-700 rounded-lg border-2 border-white dark:border-slate-600">
                  <span className="text-xs font-bold text-slate-600 dark:text-slate-300">
                    +{formData.images.length - 5}
                  </span>
                </div>
              )}
            </div>
          </div>
        )}

        {/* Form Fields with Icons */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            <svg className="w-4 h-4 text-emerald-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 7h.01M7 3h5c.512 0 1.024.195 1.414.586l7 7a2 2 0 010 2.828l-7 7a2 2 0 01-2.828 0l-7-7A1.994 1.994 0 013 12V7a4 4 0 014-4z" />
            </svg>
            Common Name *
          </label>
          <input
            type="text"
            required
            value={formData.commonName}
            onChange={(e) => setFormData((prev) => ({ ...prev, commonName: e.target.value }))}
            placeholder="e.g., Philippine Eagle"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 transition-all group-hover:border-emerald-300 dark:group-hover:border-emerald-700"
          />
        </div>
        
        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            <svg className="w-4 h-4 text-blue-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
            </svg>
            Scientific Name *
          </label>
          <input
            type="text"
            required
            value={formData.scientificName}
            onChange={(e) => setFormData((prev) => ({ ...prev, scientificName: e.target.value }))}
            placeholder="e.g., Pithecophaga jefferyi"
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-blue-500 focus:border-blue-500 italic transition-all group-hover:border-blue-300 dark:group-hover:border-blue-700"
          />
        </div>

        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            <svg className="w-4 h-4 text-purple-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 21a4 4 0 01-4-4V5a2 2 0 012-2h4a2 2 0 012 2v12a4 4 0 01-4 4zm0 0h12a2 2 0 002-2v-4a2 2 0 00-2-2h-2.343M11 7.343l1.657-1.657a2 2 0 012.828 0l2.829 2.829a2 2 0 010 2.828l-8.486 8.485M7 17h.01" />
            </svg>
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value as SpeciesDetail['category'] }))
            }
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-purple-500 focus:border-purple-500 transition-all group-hover:border-purple-300 dark:group-hover:border-purple-700 cursor-pointer"
          >
            <option value="flora">🌱 Flora (Plants)</option>
            <option value="fauna">🦊 Fauna (Animals)</option>
          </select>
        </div>

        <div className="group">
          <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
            <svg className="w-4 h-4 text-amber-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            Conservation Status *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value as SpeciesDetail['status'] }))
            }
            className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-amber-500 focus:border-amber-500 transition-all group-hover:border-amber-300 dark:group-hover:border-amber-700 cursor-pointer"
          >
            <option value="LC">✅ Least Concern (LC)</option>
            <option value="NT">⚠️ Near Threatened (NT)</option>
            <option value="VU">🟡 Vulnerable (VU)</option>
            <option value="EN">🟠 Endangered (EN)</option>
            <option value="CR">🔴 Critically Endangered (CR)</option>
            <option value="DD">❓ Data Deficient (DD)</option>
          </select>
        </div>
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          <svg className="w-4 h-4 text-teal-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3.055 11H5a2 2 0 012 2v1a2 2 0 002 2 2 2 0 012 2v2.945M8 3.935V5.5A2.5 2.5 0 0010.5 8h.5a2 2 0 012 2 2 2 0 104 0 2 2 0 012-2h1.064M15 20.488V18a2 2 0 012-2h3.064M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
          </svg>
          Habitat *
        </label>
        <input
          type="text"
          required
          value={formData.habitat}
          onChange={(e) => setFormData((prev) => ({ ...prev, habitat: e.target.value }))}
          placeholder="e.g., Tropical rainforests, mountainous regions"
          className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-teal-500 focus:border-teal-500 transition-all group-hover:border-teal-300 dark:group-hover:border-teal-700"
        />
      </div>

      <div className="group">
        <label className="flex items-center gap-2 text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2">
          <svg className="w-4 h-4 text-indigo-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 6h16M4 12h16M4 18h7" />
          </svg>
          Description *
        </label>
        <textarea
          required
          rows={4}
          value={formData.blurb}
          onChange={(e) => setFormData((prev) => ({ ...prev, blurb: e.target.value }))}
          placeholder="Provide a detailed description of the species..."
          className="w-full px-4 py-3 border-2 border-slate-200 dark:border-slate-600 rounded-xl bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-all group-hover:border-indigo-300 dark:group-hover:border-indigo-700 resize-none"
        />
      </div>

      <div className="flex gap-3 justify-between pt-6 border-t border-slate-200 dark:border-slate-700">
        <button
          type="button"
          onClick={onCancel}
          className="px-6 py-3 bg-slate-100 hover:bg-slate-200 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-200 rounded-xl font-semibold transition-all shadow-sm hover:shadow-md"
        >
          Cancel
        </button>
        <div className="flex gap-3">
          <button
            type="button"
            onClick={() => setShowImageModal(true)}
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-teal-500 hover:from-emerald-600 hover:to-teal-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
            </svg>
            Add Images ({formData.images?.length || 0})
          </button>
          <button
            type="submit"
            className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-500 to-indigo-500 hover:from-blue-600 hover:to-indigo-600 text-white rounded-xl font-semibold transition-all shadow-lg hover:shadow-xl"
          >
            <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
            </svg>
            {initialData ? 'Update' : 'Create'} Species
          </button>
        </div>
      </div>
    </form>

    {/* Image Management Modal */}
    {showImageModal && (
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
        <div className="bg-white dark:bg-slate-800 rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto p-6 space-y-4">
          <div className="flex items-center justify-between sticky top-0 bg-white dark:bg-slate-800 pb-4 border-b border-slate-200 dark:border-slate-700">
            <h3 className="text-lg font-bold text-slate-900 dark:text-white">Manage Images</h3>
            <button
              onClick={() => setShowImageModal(false)}
              className="text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 p-2"
            >
              ✕
            </button>
          </div>

          {/* Current Images */}
          {formData.images && formData.images.length > 0 && (
            <div className="space-y-2">
              <h4 className="text-sm font-semibold text-slate-700 dark:text-slate-200">Current Images ({formData.images.length})</h4>
              <div className="grid grid-cols-2 gap-3">
                {formData.images.map((image, index) => (
                  <div key={index} className="relative group">
                    <img 
                      src={image} 
                      alt={`Image ${index + 1}`} 
                      className="w-full h-32 object-cover rounded-lg border border-slate-200 dark:border-slate-700"
                    />
                    <button
                      type="button"
                      onClick={() => removeImage(index)}
                      className="absolute top-2 right-2 bg-red-500 hover:bg-red-600 text-white p-1.5 rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                    >
                      <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                      </svg>
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          <div className="space-y-4">
            {/* URL Input Option */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Add Image from URL
              </label>
              <div className="flex gap-2">
                <input
                  type="url"
                  value={imageUrlInput}
                  onChange={(e) => setImageUrlInput(e.target.value)}
                  placeholder="https://example.com/image.jpg"
                  className="flex-1 px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-700 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
                />
                <button
                  type="button"
                  onClick={handleAddImageUrl}
                  disabled={!imageUrlInput.trim()}
                  className="px-4 py-2 bg-emerald-500 hover:bg-emerald-600 disabled:bg-slate-300 disabled:cursor-not-allowed text-white rounded-lg font-medium transition-all"
                >
                  Add
                </button>
              </div>
            </div>

            <div className="relative">
              <div className="absolute inset-0 flex items-center">
                <div className="w-full border-t border-slate-300 dark:border-slate-600"></div>
              </div>
              <div className="relative flex justify-center text-sm">
                <span className="px-2 bg-white dark:bg-slate-800 text-slate-500">or</span>
              </div>
            </div>

            {/* File Upload Option */}
            <div>
              <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-2">
                Upload Image File
              </label>
              <div className="border-2 border-dashed border-slate-300 dark:border-slate-600 rounded-lg p-6 text-center hover:border-emerald-500 transition-colors">
                <input
                  type="file"
                  accept="image/*"
                  onChange={(e) => {
                    const file = e.target.files?.[0]
                    if (file) handleImageUpload(file)
                  }}
                  className="hidden"
                  id="image-upload"
                  disabled={uploadingImage}
                />
                <label htmlFor="image-upload" className="cursor-pointer">
                  {uploadingImage ? (
                    <div className="flex items-center justify-center gap-2">
                      <div className="animate-spin rounded-full h-5 w-5 border-b-2 border-emerald-500"></div>
                      <span className="text-slate-600 dark:text-slate-400">Uploading...</span>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <svg className="w-12 h-12 mx-auto text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12" />
                      </svg>
                      <p className="text-sm text-slate-600 dark:text-slate-400">
                        Click to upload or drag and drop
                      </p>
                      <p className="text-xs text-slate-500">PNG, JPG, GIF up to 10MB</p>
                    </div>
                  )}
                </label>
              </div>
            </div>
          </div>

          <div className="flex justify-end pt-4 border-t border-slate-200 dark:border-slate-700">
            <button
              onClick={() => setShowImageModal(false)}
              className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all"
            >
              Done
            </button>
          </div>
        </div>
      </div>
    )}
    </>
  )
})

// About component moved to separate file
export default function App() {
  // Ensure hook initialized so initial theme applied early
  useTheme()
  
  // Initialize progressive enhancements
  useEffect(() => {
    initProgressiveEnhancement()
  }, [])

  // Keyboard shortcut for admin access (120108) - Desktop only
  useEffect(() => {
    const targetSequence = '120108'
    let currentSequence = ''
    let timeoutId: NodeJS.Timeout

    const handleKeyDown = (event: KeyboardEvent) => {
      // Block admin access on mobile devices
      if (window.innerWidth <= 768 || /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent)) {
        return
      }
      
      // Only track number keys
      if (event.key >= '0' && event.key <= '9') {
        currentSequence += event.key
        
        // Clear previous timeout
        clearTimeout(timeoutId)
        
        // Set new timeout to reset sequence after 2 seconds of inactivity
        timeoutId = setTimeout(() => {
          currentSequence = ''
        }, 2000)
        
        // Check if sequence matches
        if (currentSequence === targetSequence) {
          currentSequence = ''
          clearTimeout(timeoutId)
          // Navigate to admin page
          window.location.href = '/mati-secret-admin-2024'
        }
        
        // Reset if sequence gets too long
        if (currentSequence.length > targetSequence.length) {
          currentSequence = ''
        }
      } else {
        // Reset on non-number key
        currentSequence = ''
        clearTimeout(timeoutId)
      }
    }

    document.addEventListener('keydown', handleKeyDown)
    
    return () => {
      document.removeEventListener('keydown', handleKeyDown)
      clearTimeout(timeoutId)
    }
  }, [])
  
  return (
    <ErrorBoundary>
      <DeviceProvider>
        <AdminProvider>
          <DataProvider>
            <BrowserRouter future={{ v7_startTransition: true, v7_relativeSplatPath: true }}>
            <div className="min-h-screen w-full bg-gradient-to-br from-sky-50/40 via-indigo-50/30 to-emerald-50/30 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 overflow-x-hidden">
              {/* Optimized background - reduced animations for better performance */}
              <div className="fixed inset-0 overflow-hidden pointer-events-none">
                {/* Simplified static gradients - no heavy blur animations */}
                <div className="absolute -top-20 -right-20 w-96 h-96 bg-gradient-to-br from-emerald-400/20 via-blue-400/15 to-purple-400/10 rounded-full blur-3xl opacity-50"></div>
                <div className="absolute -bottom-20 -left-20 w-96 h-96 bg-gradient-to-br from-cyan-400/15 via-purple-400/10 to-pink-400/8 rounded-full blur-3xl opacity-40"></div>
              </div>
              
              <div className="app relative z-10">
                <a href="#main" className="sr-only focus:not-sr-only focus:absolute focus:top-2 focus:left-2 bg-green-600 text-white px-4 py-2 rounded-lg shadow-glow-green">
                  Skip to content
                </a>
                
                <ErrorBoundary fallback={<div className="p-4 text-center text-red-600">Navigation error</div>}>
                  <Navbar />
                </ErrorBoundary>
                
                <main id="main" className="pt-4 lg:pt-6">
                  <div className="w-full px-2 pb-8 sm:px-4 lg:px-6 xl:px-8">
                    <ErrorBoundary>
                      <Routes>
                        <Route path="/" element={<ModernHome />} />
                        
                        <Route path="/gis" element={
                          <Suspense fallback={<MapLoadingFallback />}>
                            <GISMap />
                          </Suspense>
                        } />
                        
                        <Route path="/site/:id" element={<SitePage />} />
                        <Route path="/species" element={<SpeciesList />} />
                        <Route path="/species/:id" element={<SpeciesPage />} />
                        
                        <Route path="/biodiversity" element={
                          <Suspense fallback={<PageLoadingFallback />}>
                            <BiodiversityExplorer />
                          </Suspense>
                        } />
                        
                        <Route path="/biodiversity/:id" element={
                          <Suspense fallback={<PageLoadingFallback />}>
                            <SpeciesDetail />
                          </Suspense>
                        } />
                        
                        <Route path="/ar" element={<ARDemo />} />
                        {/* Main admin route */}
                        <Route path="/mati-secret-admin-2024" element={<SecretAdminPage />} />
                        <Route path="/about" element={<About />} />
                        
                        <Route path="*" element={
                          <div className="text-center py-16">
                            <div className="text-6xl mb-4">🔍</div>
                            <h2 className="text-2xl font-bold text-gray-700 dark:text-gray-300 mb-2">Page not found</h2>
                            <p className="text-gray-600 dark:text-gray-400 mb-6">The page you&rsquo;re looking for doesn&rsquo;t exist.</p>
                            <Link to="/" className="inline-flex items-center px-4 py-2 bg-emerald-600 text-white rounded-lg hover:bg-emerald-700 transition-colors">
                              🏠 Go Home
                            </Link>
                          </div>
                        } />
                      </Routes>
                    </ErrorBoundary>
                  </div>
                </main>

                {/* Floating feedback widget */}
                <FeedbackFloating />
              </div>
              
              {/* Performance Monitor - only in development */}
              <PerformanceMonitor />
            </div>
            </BrowserRouter>
          </DataProvider>
        </AdminProvider>
      </DeviceProvider>
    </ErrorBoundary>
  )
}
