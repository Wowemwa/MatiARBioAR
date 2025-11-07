import React, { useEffect, useMemo, useState, lazy, Suspense, memo, useCallback } from 'react'
import { BrowserRouter, Routes, Route, Link, useParams, useNavigate, NavLink, useLocation } from 'react-router-dom'
import useTheme from './useTheme'
import { Card, SoftCard, Badge, Button, SectionTitle, MediaThumb } from './components/UI'
import AnimatedText from './components/AnimatedText'
import Atmosphere from './components/Atmosphere'
import ComingSoon from './components/ComingSoon'
import { WaveIcon, MountainIcon, SpeciesIcon, ARIcon, InfoIcon, MapIcon, CameraIcon, TargetIcon, StarIcon, MissionIcon, EducationIcon, TechIcon, ConservationIcon, LeafIcon } from './components/Icons'
import useScrollPosition from './hooks/useScrollPosition'
import { DataProvider, useData } from './context/DataContext'
import { AdminProvider, useAdmin } from './context/AdminContext'
import ErrorBoundary from './components/ErrorBoundary'
import PerformanceMonitor from './components/PerformanceMonitor'
import { PageLoadingFallback, MapLoadingFallback } from './components/LoadingSpinner'
import { initProgressiveEnhancement } from './utils/progressive-enhancement'
import { DeviceProvider, useDeviceDetection } from './context/DeviceContext'
import type { Hotspot, SpeciesDetail } from './data/hotspots'

type AdminTab = 'login' | 'dashboard' | 'data' | 'system'
type DataViewMode = 'hotspots' | 'species'

type HotspotFormValues = Omit<Hotspot, 'lat' | 'lng' | 'areaHectares' | 'image'> & {
  lat: number | ''
  lng: number | ''
  areaHectares?: number | ''
  image?: string
}

type SpeciesFormValues = Omit<SpeciesDetail, 'images'> & {
  images: string[]
}

const isHotspotRecord = (item: Hotspot | SpeciesDetail | null): item is Hotspot => Boolean(item && 'type' in item)
const isSpeciesRecord = (item: Hotspot | SpeciesDetail | null): item is SpeciesDetail => Boolean(item && 'category' in item)

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
  const { theme, toggleTheme } = useTheme()
  
  const handleToggle = useCallback(() => {
    toggleTheme()
  }, [toggleTheme])

  return (
    <button
      onClick={handleToggle}
      className="group relative inline-flex items-center justify-center w-12 h-12 rounded-2xl border-2 border-white/40 dark:border-white/20 bg-white/70 dark:bg-slate-800/70 backdrop-blur-xl hover:scale-105 transition-all duration-300 ease-out shadow-lg hover:shadow-xl overflow-hidden"
      aria-label="Toggle dark mode"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-yellow-400/20 via-orange-400/20 to-blue-600/20 dark:from-blue-600/20 dark:via-purple-600/20 dark:to-slate-600/20 opacity-0 group-hover:opacity-100 transition-opacity duration-300 ease-out" />
      <div className="relative z-10 transition-transform duration-300 ease-out group-hover:scale-105">
        <div
          className={`text-2xl transition-transform duration-500 ease-out ${
            theme === 'dark'
              ? 'rotate-0 opacity-100'
              : '-rotate-180 opacity-100'
          }`}
        >
          {theme === 'dark' ? '🌙' : '☀️'}
        </div>
      </div>
  <div className="absolute -bottom-12 left-1/2 transform -translate-x-1/2 bg-gray-900 dark:bg-white text-white dark:text-gray-900 text-xs font-semibold px-3 py-1.5 rounded-lg opacity-0 group-hover:opacity-100 transition-opacity duration-200 ease-out pointer-events-none whitespace-nowrap">
        {theme === 'dark' ? 'Switch to Light' : 'Switch to Dark'}
        <div className="absolute top-0 left-1/2 transform -translate-x-1/2 -translate-y-1/2 rotate-45 w-2 h-2 bg-gray-900 dark:bg-white"></div>
      </div>
    </button>
  )
})

const Navbar = memo(function Navbar() {
  const { hotspots, species, loading } = useData()
  const { isAdmin, logout } = useAdmin()
  const [open, setOpen] = useState(false)
  const scrolled = useScrollPosition(8)
  const location = useLocation()
  const { isMobileView, deviceInfo } = useDeviceDetection()
  const navItems = useMemo(() => [
    { to: '/gis', label: 'GIS Map', badge: '🗺️' },
    { to: '/biodiversity', label: 'Biodiversity', badge: '🌿' },
    { to: '/ar', label: 'AR Demo', badge: '✨', comingSoon: !isAdmin },
    ...(isAdmin ? [{ to: '/admin', label: 'Admin', badge: '👑', adminOnly: true }] : []),
    { to: '/about', label: 'About', badge: '💡' },
  ], [isAdmin])
  
  const marineCount = useMemo(
    () => hotspots.filter((site) => site.type === 'marine').length,
    [hotspots]
  )
  const terrestrialCount = useMemo(
    () => hotspots.filter((site) => site.type === 'terrestrial').length,
    [hotspots]
  )

  useEffect(() => {
    setOpen(false)
  }, [location.pathname])

  return (
    <header className={`sticky top-0 z-40 transition-all duration-300 ${
        isMobileView 
          ? `mx-1 mt-1 ${deviceInfo.isIOS ? 'top-safe-area-inset-top' : ''}` 
          : 'mx-2 mt-2 hover:mx-1 hover:mt-1'
      } rounded-2xl overflow-hidden`}>
      <div
        className={`relative border transition-all duration-500 ${
          scrolled
            ? 'bg-white/95 dark:bg-slate-900/95 border-slate-200/60 dark:border-white/20 shadow-xl backdrop-blur-md'
            : 'bg-white/85 dark:bg-slate-900/85 border-slate-200/40 dark:border-white/10 backdrop-blur-sm shadow-lg'
        } ${isMobileView ? 'rounded-xl' : 'rounded-2xl hover:rounded-3xl'}`}
      >
        <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-slate-50/30 via-white/20 to-slate-100/40 dark:from-slate-800/20 dark:via-slate-700/10 dark:to-slate-800/25" />
        <div className="pointer-events-none absolute inset-x-0 bottom-0 h-px bg-gradient-to-r from-transparent via-slate-300/60 to-transparent dark:via-white/15" />
        <div className="relative mx-auto flex max-w-none flex-col gap-2 px-3 py-3 sm:px-4 lg:px-6 xl:px-8">
          <div className="flex items-center justify-between gap-4">
            <Link
              to="/"
              className="group relative flex items-center gap-3 font-black text-2xl lg:text-3xl tracking-tight transition-transform duration-300 hover:scale-[1.02]"
              onClick={() => setOpen(false)}
            >
              <div className="relative">
                <span className="bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mati
                </span>
                <span className="ml-1 bg-gradient-to-r from-green-500 to-emerald-500 bg-clip-text text-transparent">
                  AR
                </span>
                <span className="bg-gradient-to-r from-blue-600 to-cyan-600 bg-clip-text text-transparent">
                  Bio
                </span>
                <div className="absolute -top-1 -right-2 h-3 w-3 rounded-full bg-gradient-to-r from-green-500 to-blue-500 opacity-70 transition-opacity group-hover:opacity-100 animate-pulse" />
              </div>
              <div className="hidden sm:flex flex-col leading-tight text-left text-xs text-gray-500 dark:text-gray-400">
                <span className="font-semibold">Biodiversity Explorer</span>
                <span className="text-[11px] uppercase tracking-wide text-gray-400 dark:text-gray-500">
                  {isMobileView ? 'Mobile • ' : ''}MindAR • Leaflet{isMobileView ? '' : ' • Eco-tourism'}
                  {deviceInfo.isIOS && ' • iOS'}
                  {deviceInfo.isAndroid && ' • Android'}
                </span>
              </div>
            </Link>

            <div className="hidden md:flex items-center gap-3">
              <div className="hidden lg:flex items-center gap-2 text-xs font-semibold">
                <span className="flex items-center gap-2 rounded-xl border border-blue-200/60 bg-blue-50/80 px-3 py-1.5 text-blue-700 shadow-sm backdrop-blur dark:border-blue-700/40 dark:bg-blue-900/30 dark:text-blue-300">
                  <WaveIcon className="h-4 w-4" />
                  <span>{marineCount} marine</span>
                </span>
                <span className="flex items-center gap-2 rounded-xl border border-emerald-200/60 bg-emerald-50/80 px-3 py-1.5 text-emerald-700 shadow-sm backdrop-blur dark:border-emerald-700/40 dark:bg-emerald-900/30 dark:text-emerald-300">
                  <MountainIcon className="h-4 w-4" />
                  <span>{terrestrialCount} terrestrial</span>
                </span>
                <span className="flex items-center gap-2 rounded-xl border border-purple-200/60 bg-purple-50/80 px-3 py-1.5 text-purple-700 shadow-sm backdrop-blur dark:border-purple-700/40 dark:bg-purple-900/30 dark:text-purple-300">
                  <SpeciesIcon className="h-4 w-4" />
                  <span>{loading ? '—' : `${species.length}+`} species</span>
                </span>
              </div>
              <ThemeToggle />
              {isAdmin && (
                <button
                  type="button"
                  onClick={logout}
                  className="inline-flex items-center gap-2 rounded-xl border border-emerald-400/40 bg-emerald-500/10 px-4 py-2 text-xs font-semibold text-emerald-700 shadow-sm transition hover:bg-emerald-500/15 hover:text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200"
                >
                  Exit preview
                </button>
              )}
              <Link
                to="/ar"
                className="group relative overflow-hidden rounded-2xl bg-gradient-to-r from-green-500 via-teal-500 to-blue-500 px-5 py-2.5 text-sm font-semibold text-white shadow-lg transition-transform duration-300 ease-out hover:scale-[1.02]"
              >
                <span className="relative z-10 flex items-center gap-2">
                  <ARIcon className="h-4 w-4" />
                  <span>Launch AR</span>
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-white/20 to-transparent opacity-0 transition-opacity duration-300 ease-out group-hover:opacity-100" />
              </Link>
            </div>

            <button
              aria-label="Toggle menu"
              aria-expanded={open}
              onClick={() => setOpen((prev) => !prev)}
              className={`md:hidden inline-flex h-11 w-11 items-center justify-center rounded-2xl border-2 transition-colors duration-300 ease-out ${
                open
                  ? 'bg-gradient-to-r from-green-500 to-blue-500 border-transparent text-white shadow-lg'
                  : 'border-white/60 text-gray-700 hover:bg-white/70 dark:border-white/20 dark:text-gray-200 dark:hover:bg-slate-800/70'
              }`}
            >
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className={`h-6 w-6 transition-transform duration-200 ease-out ${open ? 'rotate-45' : ''}`}
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d={open ? 'M6 18L18 6M6 6l12 12' : 'M4 6h16M4 12h16M4 18h16'} />
              </svg>
            </button>
          </div>

          <div className="hidden lg:flex items-center justify-between gap-6">
            <div className="flex items-center gap-3">
              <span className="inline-flex items-center gap-1 rounded-full border border-emerald-400/40 bg-emerald-100/80 px-3 py-1.5 text-xs font-bold uppercase tracking-wide text-emerald-700 shadow-sm dark:border-emerald-400/30 dark:bg-emerald-900/40 dark:text-emerald-200">
                <span className="h-1.5 w-1.5 rounded-full bg-emerald-500 animate-pulse" />
                Live Beta
              </span>
            </div>
            <div className="relative flex items-center gap-2 rounded-full border-2 border-emerald-300/60 bg-gradient-to-r from-emerald-100/95 via-teal-100/95 to-blue-100/95 px-3 py-2 shadow-2xl backdrop-blur-3xl dark:border-emerald-400/50 dark:bg-gradient-to-r dark:from-emerald-800/70 dark:via-teal-800/70 dark:to-blue-800/70">
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-r from-emerald-500/25 via-teal-500/25 to-blue-500/25 rounded-full animate-[gradient_6s_ease-in-out_infinite]" />
              <div className="pointer-events-none absolute inset-0 bg-gradient-to-l from-blue-400/20 via-purple-400/20 to-emerald-400/20 rounded-full animate-[gradient_8s_ease-in-out_infinite_reverse]" />
              <div className="pointer-events-none absolute inset-0 bg-white/10 dark:bg-white/5 rounded-full shadow-inner" />
              
              {navItems.map((item) => {
                const isActive = location.pathname.startsWith(item.to)
                const showSoon = item.comingSoon && !isAdmin
                const isAdminItem = 'adminOnly' in item && item.adminOnly
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={`group relative z-10 inline-flex items-center gap-3 rounded-full px-4 py-2.5 text-sm font-semibold transition-all duration-300 ease-out ${
                      isActive
                        ? isAdminItem
                          ? 'bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 text-white shadow-lg scale-105'
                          : 'bg-gradient-to-r from-emerald-500 via-teal-500 to-blue-500 text-white shadow-lg scale-105'
                        : showSoon 
                          ? 'text-slate-400 dark:text-slate-500 cursor-not-allowed'
                          : isAdminItem
                            ? 'text-purple-700 dark:text-purple-300 hover:text-purple-600 dark:hover:text-purple-400 hover:bg-purple-100/80 dark:hover:bg-purple-900/60'
                            : 'text-slate-700 dark:text-slate-200 hover:text-emerald-600 dark:hover:text-emerald-400 hover:bg-white/80 dark:hover:bg-slate-700/60'
                    }`}
                  >
                    <span className={`flex h-8 w-8 items-center justify-center rounded-full text-base transition-all duration-300 ${
                      isActive
                        ? 'bg-white/20 text-white'
                        : showSoon
                          ? 'bg-slate-100 dark:bg-slate-700 text-slate-400 dark:text-slate-500'
                          : isAdminItem
                            ? 'bg-purple-100/80 dark:bg-purple-900/40 border border-purple-200/80 dark:border-purple-700/60 group-hover:bg-purple-50 dark:group-hover:bg-purple-900/60'
                            : 'bg-white/60 dark:bg-slate-600/60 border border-white/80 dark:border-slate-500/60 group-hover:bg-emerald-50 dark:group-hover:bg-emerald-900/30'
                    }`}>
                      {item.badge}
                    </span>
                    
                    <div className="flex flex-col items-start">
                      <span className="leading-tight">{item.label}</span>
                      {showSoon && (
                        <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400 border border-amber-200 dark:border-amber-700/50">
                          SOON
                        </span>
                      )}
                    </div>

                    {/* Active indicator */}
                    {isActive && (
                      <div className="absolute inset-0 rounded-full bg-gradient-to-r from-emerald-500/20 via-teal-500/20 to-blue-500/20 blur-lg" />
                    )}
                  </NavLink>
                )
              })}
            </div>
            <div className="flex items-center gap-2 rounded-full border border-blue-200/60 bg-blue-50/80 px-3 py-1.5 text-xs font-semibold text-blue-700 shadow-sm dark:border-blue-700/40 dark:bg-blue-900/30 dark:text-blue-300">
              <MapIcon className="h-4 w-4 text-blue-500" />
              <span>Mati, Davao Oriental</span>
            </div>
          </div>

          <div className={`md:hidden overflow-hidden transition-[max-height,opacity] duration-300 ease-out ${open ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'}`}>
            <div className={`space-y-3 rounded-2xl border border-white/60 bg-white/90 p-4 shadow-lg backdrop-blur-xl dark:border-white/15 dark:bg-slate-900/90 ${isMobileView ? 'rounded-xl p-3 space-y-2' : ''}`}>
              {navItems.map((item) => {
                const showSoon = item.comingSoon && !isAdmin
                return (
                  <NavLink
                    key={item.to}
                    to={item.to}
                    className={({ isActive }) => {
                      return `flex items-center justify-between rounded-xl px-4 py-3 text-sm font-semibold transition-all duration-300 ease-out ${
                        isActive
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg scale-[1.02]'
                          : showSoon
                            ? 'text-gray-400 dark:text-gray-500 bg-gray-50 dark:bg-slate-800/50 cursor-not-allowed'
                            : 'text-gray-700 dark:text-gray-200 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:shadow-md'
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
                              : showSoon
                                ? 'bg-gray-100 dark:bg-gray-700 text-gray-400'
                                : 'bg-white dark:bg-slate-700 border border-gray-200 dark:border-gray-600'
                          }`}>
                            {item.badge}
                          </span>
                          <div className="flex flex-col leading-tight">
                            <span>{item.label}</span>
                            {showSoon && (
                              <span className="inline-flex items-center rounded-full bg-amber-100 dark:bg-amber-900/30 px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider text-amber-600 dark:text-amber-400">
                                SOON
                              </span>
                            )}
                          </div>
                        </div>
                        {!showSoon && (
                          <svg className="h-4 w-4 transition-transform duration-200 group-hover:translate-x-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                          </svg>
                        )}
                      </>
                    )}
                  </NavLink>
                )
              })}

              <div className="flex items-center gap-3 border-t border-white/50 pt-3 dark:border-white/15">
                <input
                  type="text"
                  placeholder="Search..."
                  className="flex-1 rounded-xl border border-white/60 bg-white/85 px-4 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-green-500/40 dark:border-white/15 dark:bg-slate-800/80"
                />
                <ThemeToggle />
              </div>

              <Link
                to="/ar"
                onClick={() => setOpen(false)}
                className="flex items-center justify-center gap-3 rounded-xl bg-gradient-to-r from-green-500 to-blue-500 py-3 text-sm font-semibold text-white shadow-lg transition-all duration-300 hover:shadow-xl"
              >
                <ARIcon className="h-4 w-4" /> Try AR Demo
              </Link>
            </div>
          </div>
        </div>
      </div>
    </header>
  )
})

const Footer = memo(function Footer() {
  return (
    <footer className="relative mt-20 overflow-hidden">
      <div className="relative rounded-t-[3rem] backdrop-blur-xl bg-gradient-to-br from-slate-900/90 to-slate-800/90 dark:from-slate-900/95 dark:to-slate-800/95 border-t border-white/20 py-16">
        <div className="absolute inset-0 bg-gradient-to-br from-green-500/10 via-blue-500/10 to-purple-500/10" />
        
        <div className="relative z-10 text-center space-y-8">
          <div className="flex items-center justify-center gap-6 mb-8">
            <div className="animate-pulse text-3xl">🌊</div>
            <div className="text-4xl font-black bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Mati ARBio
            </div>
            <div className="animate-pulse text-3xl">🦋</div>
          </div>
          
          <div className="max-w-2xl mx-auto">
            <p className="text-xl text-gray-200 font-medium mb-6">
              Connecting nature, technology, and conservation for a sustainable future
            </p>
            <p className="text-gray-400">
              © {new Date().getFullYear()} Mati ARBio • Web-based educational & eco-tourism platform
            </p>
          </div>
          
          <div className="grid sm:grid-cols-3 gap-6 max-w-4xl mx-auto">
            <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3 group-hover:animate-bounce">🌱</div>
              <h4 className="font-bold text-green-400 mb-2">Biodiversity Protection</h4>
              <p className="text-sm text-gray-400">Preserving ecosystems for future generations</p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3 group-hover:animate-bounce">🔬</div>
              <h4 className="font-bold text-blue-400 mb-2">Education & Research</h4>
              <p className="text-sm text-gray-400">Learning through interactive experiences</p>
            </div>
            
            <div className="group p-6 rounded-2xl bg-white/5 backdrop-blur-md border border-white/10 hover:bg-white/10 transition-all duration-300 hover:scale-105">
              <div className="text-3xl mb-3 group-hover:animate-bounce">🚀</div>
              <h4 className="font-bold text-purple-400 mb-2">AR Innovation</h4>
              <p className="text-sm text-gray-400">Cutting-edge augmented reality technology</p>
            </div>
          </div>
          
          <div className="pt-8 border-t border-white/10">
            <p className="text-sm text-gray-500 flex items-center justify-center gap-2">
              <span>Made with</span>
              <span className="text-red-400 animate-pulse">❤️</span>
              <span>for environmental conservation and education</span>
            </p>
          </div>
        </div>
        
        {/* Floating decorative elements */}
        <div className="absolute inset-0 overflow-hidden pointer-events-none">
          <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gradient-to-br from-green-400/20 to-blue-400/20 rounded-full blur-2xl animate-pulse"></div>
          <div className="absolute -bottom-10 -right-10 w-40 h-40 bg-gradient-to-br from-blue-400/20 to-purple-400/20 rounded-full blur-2xl animate-pulse delay-1000"></div>
          <div className="absolute top-0 left-1/2 transform -translate-x-1/2 w-24 h-24 bg-gradient-to-br from-purple-400/20 to-green-400/20 rounded-full blur-xl animate-pulse delay-500"></div>
        </div>
      </div>
    </footer>
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
      <section className={`group relative overflow-hidden rounded-[32px] border transition-all duration-1000 ease-out ${isMobileView ? 'border-blue-400/50 bg-blue-50/90 dark:border-blue-500/40 dark:bg-blue-950/80' : 'border-white/60 bg-white/90 dark:border-white/30 dark:bg-slate-900/80'} backdrop-blur-2xl shadow-2xl hover:shadow-3xl hover:shadow-emerald-500/10 dark:hover:shadow-blue-500/10 ${isVisible ? 'translate-y-0 opacity-100 scale-100' : 'translate-y-8 opacity-0 scale-95'}`}>
        {/* Enhanced glass morphism background with animated gradients */}
        <div className="absolute inset-0 bg-gradient-to-br from-white/60 via-sky-50/40 via-purple-50/30 to-emerald-50/50 dark:from-slate-800/40 dark:via-slate-700/20 dark:to-slate-800/35 group-hover:from-white/70 group-hover:via-sky-50/50 group-hover:to-emerald-50/60 transition-all duration-700" />
        <div className="absolute inset-0 bg-[conic-gradient(from_0deg_at_50%_50%,rgba(16,185,129,0.1),rgba(59,130,246,0.08),rgba(147,51,234,0.1),rgba(6,182,212,0.08),rgba(16,185,129,0.1))] opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
        <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/8 via-blue-500/6 to-purple-500/8 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
        <Atmosphere variant="hero" className="hidden md:block" />
        <div className={`relative z-10 ${isMobileView 
            ? `flex flex-col gap-4 p-4 ${deviceInfo.isTablet ? 'p-6 gap-6' : ''} ${deviceInfo.isIOS ? 'pb-safe-area-inset-bottom' : ''}` 
            : 'grid lg:grid-cols-[minmax(0,1fr)_380px] xl:grid-cols-[minmax(0,1fr)_420px] gap-8 p-6 lg:p-12 xl:p-16 2xl:p-20'
          }`}>
          <div className="space-y-10">
            <div className="flex flex-wrap gap-2">
              <span className="inline-flex items-center gap-2 rounded-full bg-white/70 px-4 py-2 text-sm font-semibold text-emerald-600 shadow-sm dark:bg-slate-800/70 dark:text-emerald-300">
                <span className="h-2 w-2 rounded-full bg-gradient-to-r from-green-500 to-blue-500" />
                Live beta experience
              </span>
              {isMobileView && (
                <span className="inline-flex items-center gap-2 rounded-full bg-blue-50/70 px-4 py-2 text-sm font-semibold text-blue-600 shadow-sm dark:bg-blue-900/30 dark:text-blue-300">
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
                className={`font-black tracking-tight text-slate-900 dark:text-white ${
                  isMobileView 
                    ? `!text-4xl ${deviceInfo.isTablet ? '!text-5xl' : ''} ${deviceInfo.isIOS ? 'tracking-tighter' : ''}` 
                    : '!text-5xl lg:!text-7xl xl:!text-8xl'
                }`}
                text="Mati ARBio" 
              />
              <AnimatedText 
                as="div" 
                className={`!font-semibold text-slate-800 dark:text-slate-100 ${
                  isMobileView 
                    ? `!text-lg ${deviceInfo.isTablet ? '!text-xl' : ''}` 
                    : '!text-xl lg:!text-2xl xl:!text-3xl'
                }`}
                text="Explore biodiversity through maps, data, and AR experiences." 
              />
              <p className={`text-slate-600 dark:text-slate-300 ${
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
                className={`group relative overflow-hidden flex items-center justify-center gap-3 bg-gradient-to-r from-emerald-500 via-blue-500 via-purple-500 to-cyan-500 hover:from-emerald-600 hover:via-blue-600 hover:via-purple-600 hover:to-cyan-600 text-white font-bold shadow-2xl hover:shadow-3xl transition-all duration-700 ease-out ${
                  isMobileView 
                    ? `w-full py-6 text-lg rounded-3xl shadow-2xl ${deviceInfo.isIOS ? 'active:scale-[0.98]' : 'active:scale-[0.96]'} ${deviceInfo.isAndroid ? 'min-h-[56px]' : 'min-h-[52px]'}` 
                    : 'hover:scale-110 hover:shadow-2xl hover:shadow-emerald-500/40 hover:-rotate-1 hover:-translate-y-1 xl:px-12 xl:py-6 xl:text-xl rounded-3xl'
                }`}
              >
                {/* Enhanced button visual effects */}
                <div className="absolute inset-0 bg-gradient-to-r from-white/30 via-white/15 to-white/30 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/25 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                <div className="absolute inset-0 bg-[conic-gradient(from_0deg,rgba(255,255,255,0.3),transparent,rgba(255,255,255,0.3))] opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                <span className={`${isMobileView ? 'text-2xl' : 'text-2xl xl:text-3xl'}`}>🌊</span>
                <span>{isMobileView ? 'Explore Map' : 'Explore the map'}</span>
                <svg className={`${isMobileView ? 'h-5 w-5' : 'h-5 w-5 xl:h-6 xl:w-6'}`} fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                </svg>
              </Button>
              <Link to="/ar" className={isMobileView ? 'w-full' : ''}>
                <Button 
                  variant="secondary" 
                  className={`flex items-center justify-center gap-3 transition-all duration-300 ${
                    isMobileView 
                      ? `w-full py-4 text-lg font-semibold rounded-2xl shadow-lg ${deviceInfo.isIOS ? 'active:scale-98' : 'active:scale-95'} ${deviceInfo.isAndroid ? 'min-h-[48px]' : 'min-h-[44px]'}` 
                      : 'hover:scale-105 hover:shadow-xl hover:shadow-blue-500/25 xl:px-8 xl:py-4 xl:text-lg'
                  }`}
                >
                  <ARIcon className={`${isMobileView ? 'h-5 w-5' : 'h-5 w-5 xl:h-6 xl:w-6'}`} />
                  <span>{isMobileView ? 'AR Demo' : 'Launch AR demo'}</span>
                </Button>
              </Link>
            </div>
            <div className={`gap-4 ${isMobileView ? 'flex flex-col' : 'grid sm:grid-cols-2'}`}>
              {heroHighlights.map((item) => (
                <div key={item.title} className={`flex items-start gap-3 rounded-2xl border border-slate-200/80 bg-white/90 shadow-md backdrop-blur dark:border-white/20 dark:bg-slate-900/75 ${isMobileView ? 'px-3 py-4' : 'px-4 py-3'}`}>
                  <span className={`flex items-center justify-center rounded-xl bg-gradient-to-br from-green-500/15 to-blue-500/25 text-lg ${isMobileView ? 'h-12 w-12' : 'h-9 w-9'}`}>
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
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])

  if (!isAdmin) {
    return (
      <ComingSoon
        icon={<ARIcon className="h-9 w-9" />}
        title="Augmented reality module"
        description="We’re polishing the AR field guide so MindAR models load quickly on mid-range devices. The experience will roll out once assets, targets, and accessibility checks are finalized."
        highlight="Preview restricted to project admins"
        items={[
          {
            label: 'Target image refresh',
            status: 'in-progress',
            detail: 'Compressing the MindAR target set and swapping in higher-contrast markers for classroom lighting.',
          },
          {
            label: 'GLB asset optimization',
            status: 'queued',
            detail: 'Re-exporting species models with Draco compression for faster WebGL loads.',
          },
          {
            label: 'Teacher pilot run',
            status: 'queued',
            detail: 'Schedule usability testing with STEM teachers before public launch.',
          },
        ]}
        footer={
          <p>
            Authorized maintainers can unlock the preview via the secure admin link. Keep this route private to avoid sharing the password publicly.
          </p>
        }
      />
    )
  }

  return (
    <div className="space-y-8 min-h-screen">
      <SoftCard className="border border-emerald-400/40 bg-emerald-500/10 text-emerald-900 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-100">
        <div className="flex flex-col gap-2 text-sm sm:flex-row sm:items-center sm:justify-between">
          <span className="font-semibold uppercase tracking-[0.3em]">Admin preview</span>
          <span className="text-emerald-700 dark:text-emerald-200">Live models are visible only while you’re authenticated.</span>
        </div>
      </SoftCard>

      <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="text-center">
          <h2 className="text-5xl font-black tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <AnimatedText text="AR Experience" />
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Experience Mati&rsquo;s biodiversity through cutting-edge augmented reality technology
          </p>
        </div>
        
        <div className="relative rounded-3xl p-12 bg-gradient-to-br from-purple-100/50 to-pink-100/50 border-2 border-white/30 backdrop-blur-sm overflow-hidden">
          <div className="absolute inset-0 bg-gradient-to-br from-purple-500/5 to-pink-500/5 rounded-3xl"></div>
          
          <div className="relative z-10 space-y-6">
            <div className="text-6xl animate-pulse mb-6"><CameraIcon className="w-16 h-16" /></div>
            
            <h3 className="text-2xl font-bold text-gray-800">Immersive AR Demo</h3>
            
            <p className="text-lg text-gray-700 max-w-2xl mx-auto leading-relaxed">
              Experience Mati&rsquo;s biodiversity like never before! Our augmented reality demo uses cutting-edge
              MindAR + A-Frame technology to bring species to life in your environment.
            </p>
            
            <div className="grid md:grid-cols-3 gap-6 my-8">
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-white/30 overflow-hidden">
                <div className="text-3xl mb-3"><CameraIcon className="w-8 h-8" /></div>
                <h4 className="font-bold mb-2">Camera Access</h4>
                <p className="text-sm text-gray-600">Allow camera permission for the best AR experience</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-white/30 overflow-hidden">
                <div className="text-3xl mb-3"><TargetIcon className="w-8 h-8" /></div>
                <h4 className="font-bold mb-2">Target Recognition</h4>
                <p className="text-sm text-gray-600">Point your camera at target images to see AR content</p>
              </div>
              <div className="bg-white/60 rounded-2xl p-6 backdrop-blur-sm border border-white/30 overflow-hidden">
                <div className="text-3xl mb-3"><StarIcon className="w-8 h-8" /></div>
                <h4 className="font-bold mb-4">Interactive 3D</h4>
                <p className="text-sm text-gray-600">Interact with 3D models of Mati&rsquo;s amazing species</p>
              </div>
            </div>
            
            <a 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-purple-600 to-pink-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-purple-500/25 transform hover:scale-105 transition-all duration-300 hover:rotate-1" 
              href="/ar-demo/" 
              target="_blank" 
              rel="noreferrer"
            >
              <span className="text-2xl group-hover:animate-bounce"><ARIcon className="w-6 h-6" /></span>
              Launch AR Demo
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
              </svg>
            </a>
          </div>
        </div>
      </div>
    </div>
  )
})


const AdminPreview = memo(function AdminPreview() {
  const { isAdmin, login, logout, lastLoginAt } = useAdmin()
  const { hotspots, species, loading } = useData()
  const [password, setPassword] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [status, setStatus] = useState<'idle' | 'success' | 'error'>('idle')
  const [message, setMessage] = useState('')
  const [activeTab, setActiveTab] = useState<AdminTab>('login')
  const [dataView, setDataView] = useState<DataViewMode>('hotspots')
  const [editingItem, setEditingItem] = useState<Hotspot | SpeciesDetail | null>(null)
  const [showForm, setShowForm] = useState(false)
  const [deleteConfirm, setDeleteConfirm] = useState<string | null>(null)

  const secretConfigured = Boolean(import.meta.env.VITE_ADMIN_PASS?.length)

  useEffect(() => {
    if (isAdmin) {
      setActiveTab('dashboard')
    }
  }, [isAdmin])

  const handleSubmit: React.FormEventHandler<HTMLFormElement> = async (event) => {
    event.preventDefault()
    if (submitting || password.trim().length === 0) return
    setSubmitting(true)
    const ok = await login({ password })
    setSubmitting(false)
    setPassword('')
    if (ok) {
      setStatus('success')
      setMessage('Admin preview unlocked. You can now access protected pages in this session.')
      setActiveTab('dashboard')
    } else {
      setStatus('error')
      setMessage(secretConfigured ? 'That passphrase did not match our records. Try again.' : 'No admin password is configured. Set VITE_ADMIN_PASS in your .env file.')
    }
  }

  const stats = useMemo(() => {
    if (loading) return null
    return {
      totalHotspots: hotspots.length,
      marineHotspots: hotspots.filter(h => h.type === 'marine').length,
      terrestrialHotspots: hotspots.filter(h => h.type === 'terrestrial').length,
      totalSpecies: species.length,
      flora: species.filter(s => s.category === 'flora').length,
      fauna: species.filter(s => s.category === 'fauna').length,
      criticallyEndangered: species.filter(s => s.status === 'CR').length,
      endangered: species.filter(s => s.status === 'EN').length,
      vulnerable: species.filter(s => s.status === 'VU').length,
    }
  }, [hotspots, species, loading])

  // CRUD Functions
  const handleAdd = () => {
    setEditingItem(null)
    setShowForm(true)
  }

  const handleDelete = (id: string) => {
    setDeleteConfirm(id)
  }

  const confirmDelete = () => {
    if (deleteConfirm) {
      // In a real app, this would call an API
      alert(`Item ${deleteConfirm} would be deleted from the database`)
      setDeleteConfirm(null)
    }
  }

  const handleSaveHotspot = (formData: HotspotFormValues) => {
    const normalized = {
      ...formData,
      lat: typeof formData.lat === 'number' ? formData.lat : parseFloat(String(formData.lat)),
      lng: typeof formData.lng === 'number' ? formData.lng : parseFloat(String(formData.lng)),
      areaHectares:
        formData.areaHectares === '' || typeof formData.areaHectares === 'undefined'
          ? undefined
          : Number(formData.areaHectares),
    }

    if (isHotspotRecord(editingItem)) {
      alert(`Item ${editingItem.id} would be updated with: ${JSON.stringify(normalized)}`)
    } else {
      alert(`New hotspot would be created with: ${JSON.stringify(normalized)}`)
    }

    setShowForm(false)
    setEditingItem(null)
  }

  const handleSaveSpecies = (formData: SpeciesFormValues) => {
    if (isSpeciesRecord(editingItem)) {
      alert(`Item ${editingItem.id} would be updated with: ${JSON.stringify(formData)}`)
    } else {
      alert(`New species would be created with: ${JSON.stringify(formData)}`)
    }

    setShowForm(false)
    setEditingItem(null)
  }

  const adminNavTabs: Array<{ id: Exclude<AdminTab, 'login'>; label: string; icon: string }> = [
    { id: 'dashboard', label: 'Dashboard', icon: '📊' },
    { id: 'data', label: 'Data Management', icon: '🗄️' },
    { id: 'system', label: 'System Status', icon: '⚙️' },
  ]

  const exportData = (type: 'hotspots' | 'species', format: 'csv' | 'json') => {
    const data = type === 'hotspots' ? hotspots : species
    const filename = `mati-${type}-${new Date().toISOString().split('T')[0]}.${format}`
    
    if (format === 'json') {
      const blob = new Blob([JSON.stringify(data, null, 2)], { type: 'application/json' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    } else {
      // Simple CSV export
      const headers = Object.keys(data[0] || {}).join(',')
      const rows = data.map(item => Object.values(item).map(val => 
        typeof val === 'string' ? `"${val.replace(/"/g, '""')}"` : val
      ).join(','))
      const csv = [headers, ...rows].join('\n')
      
      const blob = new Blob([csv], { type: 'text/csv' })
      const url = URL.createObjectURL(blob)
      const a = document.createElement('a')
      a.href = url
      a.download = filename
      a.click()
      URL.revokeObjectURL(url)
    }
    
    alert(`${type} data exported as ${format.toUpperCase()}!`)
  }

  if (!isAdmin) {
    return (
      <div className="mx-auto flex min-h-[60vh] max-w-2xl flex-col gap-6 py-16">
        <SoftCard className="border border-white/50 bg-white/85 dark:border-white/10 dark:bg-slate-900/70">
          <div className="space-y-6">
            <div className="text-center">
              <div className="mx-auto w-16 h-16 rounded-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 flex items-center justify-center mb-4">
                <span className="text-2xl">🔐</span>
              </div>
              <Badge tone="success" className="bg-gradient-to-r from-emerald-500/20 via-blue-500/20 to-purple-500/20 text-emerald-700 dark:text-emerald-200">
                Admin Control Center
              </Badge>
              <h1 className="mt-4 text-4xl font-black tracking-tight text-slate-900 dark:text-white">
                <span className="bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent">
                  Mati ARBio
                </span>
              </h1>
              <h2 className="text-2xl font-bold text-slate-700 dark:text-slate-200 mb-2">Admin Dashboard</h2>
              <p className="text-slate-600 dark:text-slate-300">
                Comprehensive biodiversity management system with advanced analytics and content management capabilities.
              </p>
            </div>

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="block text-sm font-semibold text-slate-700 dark:text-slate-200 mb-2" htmlFor="admin-pass">
                  🔑 Administrator Passphrase
                </label>
                <input
                  id="admin-pass"
                  type="password"
                  value={password}
                  onChange={(event) => {
                    setPassword(event.target.value)
                    if (status !== 'idle') {
                      setStatus('idle')
                      setMessage('')
                    }
                  }}
                  placeholder="Enter your secure passphrase"
                  className="w-full rounded-2xl border border-slate-200/80 bg-white/95 px-6 py-4 text-sm shadow-lg focus:border-emerald-400 focus:outline-none focus:ring-4 focus:ring-emerald-300/40 dark:border-slate-700/80 dark:bg-slate-800/90 dark:text-slate-100 transition-all duration-300"
                />
              </div>
              
              <Button 
                type="submit" 
                disabled={submitting}
                className="w-full bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 hover:from-emerald-600 hover:via-blue-600 hover:to-purple-600 text-white font-semibold py-4 shadow-xl hover:shadow-2xl transition-all duration-300"
              >
                {submitting ? (
                  <span className="flex items-center gap-2">
                    <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Authenticating…
                  </span>
                ) : (
                  <span className="flex items-center gap-2">
                    🚀 Access Admin Dashboard
                  </span>
                )}
              </Button>
            </form>

            {status !== 'idle' && (
              <SoftCard
                className={`border text-sm animate-in slide-in-from-top-2 duration-300 ${
                  status === 'success'
                    ? 'border-emerald-400/40 bg-emerald-500/10 text-emerald-700 dark:border-emerald-400/30 dark:bg-emerald-500/15 dark:text-emerald-200'
                    : 'border-rose-400/40 bg-rose-500/10 text-rose-700 dark:border-rose-400/30 dark:bg-rose-500/15 dark:text-rose-200'
                }`}
              >
                <div className="flex items-center gap-2">
                  {status === 'success' ? '✅' : '❌'}
                  {message}
                </div>
              </SoftCard>
            )}

            {!secretConfigured && (
              <SoftCard className="border border-amber-400/40 bg-amber-500/10 text-sm text-amber-800 dark:border-amber-400/30 dark:bg-amber-500/15 dark:text-amber-200">
                <div className="flex items-start gap-2">
                  <span className="text-base">⚠️</span>
                  <div>
                    <p className="font-medium mb-1">Environment Configuration Required</p>
                    <p>
                      Add <code className="rounded bg-black/10 px-1.5 py-0.5 text-xs font-mono">VITE_ADMIN_PASS=your_password</code> to your <code className="rounded bg-black/10 px-1.5 py-0.5 text-xs font-mono">.env.local</code> file.
                    </p>
                  </div>
                </div>
              </SoftCard>
            )}
          </div>
        </SoftCard>
      </div>
    )
  }

  return (
    <div className="mx-auto max-w-7xl py-8 space-y-6">
      {/* Admin Header */}
      <div className="bg-gradient-to-r from-emerald-500 via-blue-500 to-purple-500 rounded-3xl p-6 text-white shadow-2xl">
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 rounded-full bg-white/20 flex items-center justify-center">
                <span className="text-xl">👑</span>
              </div>
              <div>
                <h1 className="text-2xl font-black tracking-tight">Admin Dashboard</h1>
                <p className="text-white/80 text-sm">Mati ARBio Control Center</p>
              </div>
            </div>
            {lastLoginAt && (
              <p className="text-white/70 text-xs">
                Session started: {new Date(lastLoginAt).toLocaleString()}
              </p>
            )}
          </div>
          <button
            onClick={logout}
            className="flex items-center gap-2 bg-white/20 hover:bg-white/30 px-4 py-2 rounded-xl text-sm font-medium transition-all duration-200"
          >
            🚪 Sign Out
          </button>
        </div>
      </div>

      {/* Navigation Tabs */}
      <div className="flex flex-wrap gap-2 bg-white/50 dark:bg-slate-800/50 p-2 rounded-2xl backdrop-blur-xl border border-white/30 dark:border-white/15">
        {adminNavTabs.map((tab) => (
          <button
            key={tab.id}
            onClick={() => setActiveTab(tab.id)}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl font-medium text-sm transition-all duration-200 ${
              activeTab === tab.id
                ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                : 'text-slate-600 dark:text-slate-300 hover:bg-white/60 dark:hover:bg-slate-700/60'
            }`}
          >
            <span>{tab.icon}</span>
            {tab.label}
          </button>
        ))}
      </div>

      {/* Dashboard Content */}
      {activeTab === 'dashboard' && stats && (
        <div className="space-y-6">
          {/* Quick Stats */}
          <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-4">
            {[
              { label: 'Biodiversity Hotspots', value: stats.totalHotspots, icon: '🏔️', color: 'emerald' },
              { label: 'Species Documented', value: stats.totalSpecies, icon: '🦎', color: 'blue' },
              { label: 'Flora Species', value: stats.flora, icon: '🌿', color: 'green' },
              { label: 'Fauna Species', value: stats.fauna, icon: '🦅', color: 'purple' },
            ].map((stat) => (
              <SoftCard key={stat.label} className="text-center p-6 border border-white/40 bg-white/80 dark:border-white/10 dark:bg-slate-800/80">
                <div className="text-3xl mb-2">{stat.icon}</div>
                <div className="text-3xl font-black text-slate-900 dark:text-white mb-1">
                  {stat.value}
                </div>
                <div className="text-sm text-slate-600 dark:text-slate-300 font-medium">
                  {stat.label}
                </div>
              </SoftCard>
            ))}
          </div>

          {/* Conservation Status */}
          <SoftCard className="p-6 border border-white/40 bg-white/80 dark:border-white/10 dark:bg-slate-800/80">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              🚨 Conservation Status Overview
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-red-600 dark:text-red-400">{stats.criticallyEndangered}</div>
                <div className="text-sm text-red-700 dark:text-red-300">Critically Endangered</div>
              </div>
              <div className="bg-orange-50 dark:bg-orange-900/20 border border-orange-200 dark:border-orange-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-orange-600 dark:text-orange-400">{stats.endangered}</div>
                <div className="text-sm text-orange-700 dark:text-orange-300">Endangered</div>
              </div>
              <div className="bg-yellow-50 dark:bg-yellow-900/20 border border-yellow-200 dark:border-yellow-800 rounded-xl p-4">
                <div className="text-2xl font-bold text-yellow-600 dark:text-yellow-400">{stats.vulnerable}</div>
                <div className="text-sm text-yellow-700 dark:text-yellow-300">Vulnerable</div>
              </div>
            </div>
          </SoftCard>

          {/* Quick Actions */}
          <SoftCard className="p-6 border border-white/40 bg-white/80 dark:border-white/10 dark:bg-slate-800/80">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⚡ Quick Actions
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-4">
              {[
                { label: 'AR Experience', path: '/ar', icon: '🥽', desc: 'Test AR features' },
                { label: 'GIS Mapping', path: '/gis', icon: '🗺️', desc: 'Review hotspots' },
                { label: 'Species Explorer', path: '/biodiversity', icon: '🔬', desc: 'Browse data' },
                { label: 'System Logs', path: '#', icon: '📋', desc: 'Check activity' },
                { label: 'Data Export', path: '#', icon: '💾', desc: 'Download data' },
              ].map((action) => (
                <Link
                  key={action.label}
                  to={action.path}
                  className="flex items-center gap-3 p-4 rounded-xl border border-slate-200 dark:border-slate-700 hover:border-emerald-300 dark:hover:border-emerald-600 bg-white/60 dark:bg-slate-800/60 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 transition-all duration-200 group"
                >
                  <div className="text-2xl">{action.icon}</div>
                  <div>
                    <div className="font-medium text-slate-900 dark:text-white group-hover:text-emerald-700 dark:group-hover:text-emerald-300">
                      {action.label}
                    </div>
                    <div className="text-xs text-slate-600 dark:text-slate-400">
                      {action.desc}
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </SoftCard>
        </div>
      )}

      {/* Data Management Tab */}
      {activeTab === 'data' && (
        <div className="space-y-6">
          {/* Data Management Header */}
          <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <div>
              <h2 className="text-2xl font-bold text-slate-900 dark:text-white flex items-center gap-2">
                🗄️ Data Management
              </h2>
              <p className="text-slate-600 dark:text-slate-300 text-sm">
                Create, edit, and manage biodiversity data
              </p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={() => setDataView('hotspots')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  dataView === 'hotspots'
                    ? 'bg-emerald-500 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-emerald-100 dark:hover:bg-emerald-900/20'
                }`}
              >
                🏔️ Hotspots ({stats?.totalHotspots})
              </button>
              <button
                onClick={() => setDataView('species')}
                className={`px-4 py-2 rounded-xl font-medium text-sm transition-all ${
                  dataView === 'species'
                    ? 'bg-blue-500 text-white shadow-lg'
                    : 'bg-white/60 dark:bg-slate-700/60 text-slate-700 dark:text-slate-300 hover:bg-blue-100 dark:hover:bg-blue-900/20'
                }`}
              >
                🦎 Species ({stats?.totalSpecies})
              </button>
            </div>
          </div>

          {/* Data Table Controls */}
          <SoftCard className="p-4 border border-white/40 bg-white/80 dark:border-white/10 dark:bg-slate-800/80">
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-center gap-3">
                <button
                  onClick={handleAdd}
                  className="flex items-center gap-2 px-4 py-2 bg-gradient-to-r from-emerald-500 to-green-500 text-white rounded-xl font-medium text-sm shadow-lg hover:shadow-xl transition-all duration-200 hover:scale-105"
                >
                  ➕ Add New {dataView === 'hotspots' ? 'Hotspot' : 'Species'}
                </button>
                <div className="h-6 w-px bg-slate-300 dark:bg-slate-600"></div>
                <span className="text-sm text-slate-600 dark:text-slate-400">
                  {dataView === 'hotspots' ? hotspots.length : species.length} records
                </span>
              </div>
              
              <div className="flex items-center gap-2">
                <button
                  onClick={() => exportData(dataView, 'csv')}
                  className="flex items-center gap-2 px-3 py-2 bg-emerald-100 hover:bg-emerald-200 dark:bg-emerald-900/30 dark:hover:bg-emerald-900/50 text-emerald-700 dark:text-emerald-300 rounded-lg text-sm font-medium transition-all"
                >
                  📊 Export CSV
                </button>
                <button
                  onClick={() => exportData(dataView, 'json')}
                  className="flex items-center gap-2 px-3 py-2 bg-blue-100 hover:bg-blue-200 dark:bg-blue-900/30 dark:hover:bg-blue-900/50 text-blue-700 dark:text-blue-300 rounded-lg text-sm font-medium transition-all"
                >
                  💾 Export JSON
                </button>
              </div>
            </div>
          </SoftCard>

          {/* Data Table */}
          <SoftCard className="border border-white/40 bg-white/80 dark:border-white/10 dark:bg-slate-800/80 overflow-hidden">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead className="bg-slate-50 dark:bg-slate-700/50 border-b border-slate-200 dark:border-slate-600">
                  <tr>
                    {dataView === 'hotspots' ? (
                      <>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Name</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Type</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">City</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Area (ha)</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Species</th>
                        <th className="text-center p-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                      </>
                    ) : (
                      <>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Common Name</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Scientific Name</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Category</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Status</th>
                        <th className="text-left p-4 font-semibold text-slate-700 dark:text-slate-200">Sites</th>
                        <th className="text-center p-4 font-semibold text-slate-700 dark:text-slate-200">Actions</th>
                      </>
                    )}
                  </tr>
                </thead>
                <tbody className="divide-y divide-slate-200 dark:divide-slate-600">
                  {dataView === 'hotspots' 
                    ? hotspots.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-slate-900 dark:text-white">{item.name}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{item.summary}</div>
                          </td>
                          <td className="p-4">
                            <Badge className={`${item.type === 'marine' ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300' : 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'}`}>
                              {item.type === 'marine' ? '🌊 Marine' : '🏔️ Terrestrial'}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">{item.city}</td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">{item.areaHectares?.toLocaleString() || 'N/A'}</td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">{(item.floraIds?.length || 0) + (item.faunaIds?.length || 0)}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                                title="Edit hotspot"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                                title="Delete hotspot"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                    : species.map((item) => (
                        <tr key={item.id} className="hover:bg-slate-50 dark:hover:bg-slate-700/30 transition-colors">
                          <td className="p-4">
                            <div className="font-medium text-slate-900 dark:text-white">{item.commonName}</div>
                            <div className="text-xs text-slate-500 dark:text-slate-400 truncate max-w-xs">{item.blurb}</div>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300 italic">{item.scientificName}</td>
                          <td className="p-4">
                            <Badge className={`${item.category === 'flora' ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300' : 'bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300'}`}>
                              {item.category === 'flora' ? '🌿 Flora' : '🦎 Fauna'}
                            </Badge>
                          </td>
                          <td className="p-4">
                            <Badge className={`${
                              item.status === 'CR' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                              item.status === 'EN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                              item.status === 'VU' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                              'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-300'
                            }`}>
                              {item.status}
                            </Badge>
                          </td>
                          <td className="p-4 text-slate-700 dark:text-slate-300">{item.siteIds?.length || 0}</td>
                          <td className="p-4">
                            <div className="flex gap-2">
                              <button
                                onClick={() => setEditingItem(item)}
                                className="text-blue-600 hover:text-blue-800 dark:text-blue-400 dark:hover:text-blue-300 p-1 rounded"
                                title="Edit species"
                              >
                                ✏️
                              </button>
                              <button
                                onClick={() => handleDelete(item.id)}
                                className="text-red-600 hover:text-red-800 dark:text-red-400 dark:hover:text-red-300 p-1 rounded"
                                title="Delete species"
                              >
                                🗑️
                              </button>
                            </div>
                          </td>
                        </tr>
                      ))
                  }
                </tbody>
              </table>
            </div>
          </SoftCard>
        </div>
      )}

      {/* System Status Tab */}
      {activeTab === 'system' && (
        <div className="space-y-6">
          <SoftCard className="p-6 border border-white/40 bg-white/80 dark:border-white/10 dark:bg-slate-800/80">
            <h3 className="text-xl font-bold mb-4 flex items-center gap-2">
              ⚙️ System Information
            </h3>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">Application Status</h4>
                <div className="space-y-2 text-sm">
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>Database Connection: Online</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>API Services: Operational</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <div className="w-2 h-2 bg-green-500 rounded-full"></div>
                    <span>AR Module: Ready</span>
                  </div>
                </div>
              </div>
              
              <div className="space-y-3">
                <h4 className="font-semibold text-slate-700 dark:text-slate-200">Environment</h4>
                <div className="space-y-2 text-sm font-mono">
                  <div>Mode: Development</div>
                  <div>Version: v0.5.0</div>
                  <div>Build: Latest</div>
                  <div>Auth: {secretConfigured ? 'Configured' : 'Not Set'}</div>
                </div>
              </div>
            </div>
          </SoftCard>
        </div>
      )}

      {/* Delete Confirmation Modal */}
      {deleteConfirm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4">
          <SoftCard className="max-w-md w-full border border-red-200 dark:border-red-800 bg-white/95 dark:bg-slate-900/95">
            <div className="p-6 space-y-4">
              <div className="text-center">
                <div className="text-4xl mb-2">⚠️</div>
                <h3 className="text-xl font-bold text-red-600 dark:text-red-400">Confirm Deletion</h3>
                <p className="text-slate-600 dark:text-slate-300 mt-2">
                  Are you sure you want to delete this {dataView === 'hotspots' ? 'hotspot' : 'species'}? This action cannot be undone.
                </p>
              </div>
              <div className="flex gap-3 justify-center">
                <button
                  onClick={() => setDeleteConfirm(null)}
                  className="px-4 py-2 bg-slate-200 hover:bg-slate-300 dark:bg-slate-700 dark:hover:bg-slate-600 text-slate-700 dark:text-slate-300 rounded-xl font-medium transition-all"
                >
                  Cancel
                </button>
                <button
                  onClick={confirmDelete}
                  className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-xl font-medium transition-all"
                >
                  Delete
                </button>
              </div>
            </div>
          </SoftCard>
        </div>
      )}

      {/* Add/Edit Form Modal */}
      {showForm && (
        <div className="fixed inset-0 bg-black/50 backdrop-blur-sm flex items-center justify-center z-50 p-4 overflow-y-auto">
          <SoftCard className="max-w-2xl w-full border border-white/40 bg-white/95 dark:bg-slate-900/95 my-8">
            <div className="p-6 space-y-6">
              <div className="flex items-center justify-between">
                <h3 className="text-xl font-bold text-slate-900 dark:text-white">
                  {editingItem ? 'Edit' : 'Add New'} {dataView === 'hotspots' ? 'Hotspot' : 'Species'}
                </h3>
                <button
                  onClick={() => {
                    setShowForm(false)
                    setEditingItem(null)
                  }}
                  className="p-2 text-slate-500 hover:text-slate-700 dark:text-slate-400 dark:hover:text-slate-200 rounded-lg transition-all"
                >
                  ✕
                </button>
              </div>

              {dataView === 'hotspots' ? (
                <HotspotForm
                  initialData={isHotspotRecord(editingItem) ? editingItem : undefined}
                  onSave={handleSaveHotspot}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingItem(null)
                  }}
                />
              ) : (
                <SpeciesForm
                  initialData={isSpeciesRecord(editingItem) ? editingItem : undefined}
                  onSave={handleSaveSpecies}
                  onCancel={() => {
                    setShowForm(false)
                    setEditingItem(null)
                  }}
                />
              )}
            </div>
          </SoftCard>
        </div>
      )}
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

  useEffect(() => {
    setFormData(createSpeciesFormValues(initialData))
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
            Common Name *
          </label>
          <input
            type="text"
            required
            value={formData.commonName}
            onChange={(e) => setFormData((prev) => ({ ...prev, commonName: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          />
        </div>
        
        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Scientific Name *
          </label>
          <input
            type="text"
            required
            value={formData.scientificName}
            onChange={(e) => setFormData((prev) => ({ ...prev, scientificName: e.target.value }))}
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500 italic"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Category *
          </label>
          <select
            required
            value={formData.category}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, category: e.target.value as SpeciesDetail['category'] }))
            }
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="flora">Flora</option>
            <option value="fauna">Fauna</option>
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
            Conservation Status *
          </label>
          <select
            required
            value={formData.status}
            onChange={(e) =>
              setFormData((prev) => ({ ...prev, status: e.target.value as SpeciesDetail['status'] }))
            }
            className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
          >
            <option value="LC">Least Concern (LC)</option>
            <option value="NT">Near Threatened (NT)</option>
            <option value="VU">Vulnerable (VU)</option>
            <option value="EN">Endangered (EN)</option>
            <option value="CR">Critically Endangered (CR)</option>
            <option value="DD">Data Deficient (DD)</option>
          </select>
        </div>
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Habitat *
        </label>
        <input
          type="text"
          required
          value={formData.habitat}
          onChange={(e) => setFormData((prev) => ({ ...prev, habitat: e.target.value }))}
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
          value={formData.blurb}
          onChange={(e) => setFormData((prev) => ({ ...prev, blurb: e.target.value }))}
          className="w-full px-3 py-2 border border-slate-300 dark:border-slate-600 rounded-lg bg-white dark:bg-slate-800 text-slate-900 dark:text-white focus:ring-2 focus:ring-emerald-500 focus:border-emerald-500"
        />
      </div>

      <div>
        <label className="block text-sm font-medium text-slate-700 dark:text-slate-200 mb-1">
          Image URL
        </label>
        <input
          type="url"
          value={formData.images[0] ?? ''}
          onChange={(e) =>
            setFormData((prev) => ({ ...prev, images: e.target.value ? [e.target.value] : [] }))
          }
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
          className="px-4 py-2 bg-blue-500 hover:bg-blue-600 text-white rounded-xl font-medium transition-all"
        >
          {initialData ? 'Update' : 'Create'} Species
        </button>
      </div>
    </form>
  )
})

const About = memo(function About() {
  const [isVisible, setIsVisible] = useState(false)
  
  useEffect(() => {
    setIsVisible(true)
  }, [])
  
  return (
    <div className="space-y-8 min-h-screen">
      <div className={`space-y-8 transform transition-all duration-1000 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
        <div className="text-center">
          <h2 className="text-5xl font-black tracking-tight bg-gradient-to-r from-green-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-4">
            <AnimatedText text="About Mati ARBio" />
          </h2>
          <p className="text-xl text-gray-600 dark:text-gray-300 max-w-2xl mx-auto">
            Discover our mission to preserve biodiversity through innovative technology and education
          </p>
        </div>
        
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          <div className={`space-y-6 transform transition-all duration-1000 delay-300 ${isVisible ? 'translate-x-0 opacity-100' : '-translate-x-8 opacity-0'}`}>
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-green-100/50 to-blue-100/50 border-2 border-white/30 backdrop-blur-sm overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><MissionIcon className="w-6 h-6" /> Our Mission</h3>
              <p className="text-gray-700 leading-relaxed">
                Mati ARBio is an innovative web-based educational and eco-tourism platform designed to showcase 
                the incredible biodiversity of Mati City. We combine cutting-edge augmented reality technology 
                with comprehensive species databases to create immersive learning experiences.
              </p>
            </div>
            
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-blue-100/50 to-purple-100/50 border-2 border-white/30 backdrop-blur-sm overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><ConservationIcon className="w-6 h-6" /> Conservation Impact</h3>
              <p className="text-gray-700 leading-relaxed">
                Through interactive maps, detailed species profiles, and immersive AR experiences, we aim to 
                raise awareness about environmental conservation while promoting sustainable eco-tourism in the region.
              </p>
            </div>
          </div>
          
          <div className={`space-y-6 transform transition-all duration-1000 delay-500 ${isVisible ? 'translate-x-0 opacity-100' : 'translate-x-8 opacity-0'}`}>
            <div className="grid grid-cols-2 gap-4">
              <div className="bg-white/60 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="text-3xl mb-2"><MapIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg mb-1">Interactive Maps</h4>
                <p className="text-sm text-gray-600">Explore biodiversity hotspots</p>
              </div>
              
              <div className="bg-white/60 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="text-3xl mb-2"><SpeciesIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg mb-1">Species Database</h4>
                <p className="text-sm text-gray-600">Comprehensive species profiles</p>
              </div>
              
              <div className="bg-white/60 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="text-3xl mb-2"><TechIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg mb-1">AR Technology</h4>
                <p className="text-sm text-gray-600">Immersive 3D experiences</p>
              </div>
              
              <div className="bg-white/60 rounded-2xl p-6 text-center backdrop-blur-sm border border-white/30 hover:scale-105 transition-transform duration-300 overflow-hidden">
                <div className="text-3xl mb-2"><EducationIcon className="w-8 h-8" /></div>
                <h4 className="font-bold text-lg mb-1">Education</h4>
                <p className="text-sm text-gray-600">Learn about conservation</p>
              </div>
            </div>
            
            <div className="relative rounded-3xl p-8 bg-gradient-to-br from-purple-100/50 to-pink-100/50 border-2 border-white/30 backdrop-blur-sm overflow-hidden">
              <h3 className="text-2xl font-bold text-gray-800 mb-4 flex items-center gap-2"><TechIcon className="w-6 h-6" /> Technology Stack</h3>
              <div className="flex flex-wrap gap-2">
                {['React', 'TypeScript', 'Tailwind CSS', 'Leaflet Maps', 'MindAR', 'A-Frame'].map((tech, i) => (
                  <span key={i} className="px-3 py-1 bg-white/60 rounded-full text-sm font-medium text-gray-700 border border-white/30">
                    {tech}
                  </span>
                ))}
              </div>
            </div>
          </div>
        </div>
        
        <div className={`text-center transform transition-all duration-1000 delay-700 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="relative rounded-3xl p-12 bg-gradient-to-br from-green-400/20 via-blue-400/20 to-purple-400/20 border-2 border-white/30 backdrop-blur-sm overflow-hidden">
            <h3 className="text-3xl font-bold mb-6 bg-gradient-to-r from-green-600 to-blue-600 bg-clip-text text-transparent">
              Join Our Conservation Mission
            </h3>
            <p className="text-xl text-gray-700 mb-8 max-w-3xl mx-auto">
              Together, we can protect and preserve Mati&rsquo;s unique biodiversity for future generations.
              Start exploring today and become part of the conservation community!
            </p>
            <Link 
              to="/gis" 
              className="group inline-flex items-center gap-3 bg-gradient-to-r from-green-600 to-blue-600 text-white px-8 py-4 rounded-2xl font-bold text-lg shadow-2xl hover:shadow-green-500/25 transform hover:scale-105 transition-all duration-300"
            >
              <span className="text-2xl group-hover:animate-bounce">🌟</span>
              Start Exploring
              <svg className="w-5 h-5 group-hover:translate-x-1 transition-transform duration-300" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
})

export default function App() {
  // Ensure hook initialized so initial theme applied early
  useTheme()
  
  // Initialize progressive enhancements
  useEffect(() => {
    initProgressiveEnhancement()
  }, [])
  
  return (
    <ErrorBoundary>
      <DeviceProvider>
        <AdminProvider>
          <DataProvider>
            <BrowserRouter>
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
                        <Route path="/" element={<Home />} />
                        
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
                        <Route path="/admin/preview" element={<AdminPreview />} />
                        <Route path="/admin" element={<AdminPreview />} />
                        {/* Admin route removed - component not found */}
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
                
                <ErrorBoundary fallback={<div className="p-4 text-center text-gray-600">Footer unavailable</div>}>
                  <Footer />
                </ErrorBoundary>
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
