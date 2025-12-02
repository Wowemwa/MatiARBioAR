import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { findSpeciesById, findSiteById, getUnifiedSpecies } from '../data/adapters'
import AnimatedText from '../components/AnimatedText'
import INaturalistMap from '../components/INaturalistMap'
import EcologySection from '../components/EcologySection'
import ConservationSection from '../components/ConservationSection'
import { WaveIcon, MountainIcon, SpeciesIcon, MapIcon, InfoIcon, ConservationIcon, TargetIcon } from '../components/Icons'

export default function SpeciesDetail() {
  const { id } = useParams()
  const [isVisible, setIsVisible] = useState(false)
  const [activeTab, setActiveTab] = useState<'overview' | 'ecology' | 'distribution' | 'conservation'>('overview')
  
  const record = id ? findSpeciesById(id) : undefined
  const unifiedSpecies = useMemo(() => getUnifiedSpecies(), [])
  const unifiedRecord = unifiedSpecies.find(s => s.id === id)
  
  useEffect(() => {
    setIsVisible(true)
    // Smooth scroll to top on mount
    window.scrollTo({ top: 0, behavior: 'smooth' })
  }, [])

  if (!record) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center space-y-4">
          <div className="w-16 h-16 bg-gray-200 dark:bg-slate-700 rounded-full flex items-center justify-center mx-auto">
            <SpeciesIcon className="w-8 h-8 text-gray-400" />
          </div>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100">Species not found</h2>
          <p className="text-gray-600 dark:text-gray-400">The species you&apos;re looking for doesn&apos;t exist in our database.</p>
          <Link 
            to="/biodiversity" 
            className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300"
          >
            <SpeciesIcon className="w-4 h-4" />
            Browse All Species
          </Link>
        </div>
      </div>
    )
  }

  const sites = record.siteIds?.map((siteId: string) => findSiteById(siteId)).filter(Boolean) || []
  
  const statusMeta = {
    CR: { label: 'Critically Endangered', color: 'red', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
    EN: { label: 'Endangered', color: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700' },
    VU: { label: 'Vulnerable', color: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' },
    NT: { label: 'Near Threatened', color: 'lime', bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-700' },
    LC: { label: 'Least Concern', color: 'green', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700' },
    DD: { label: 'Data Deficient', color: 'gray', bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' }
  }

  const status = statusMeta[record.status as keyof typeof statusMeta] || statusMeta.DD

  const tabs = [
    { id: 'overview', label: 'Overview', icon: InfoIcon },
    { id: 'ecology', label: 'Ecology', icon: SpeciesIcon },
    { id: 'distribution', label: 'Distribution', icon: MapIcon },
    { id: 'conservation', label: 'Conservation', icon: ConservationIcon }
  ]

  return (
    <div className="min-h-screen relative">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 opacity-20 -z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.05'%3E%3Ccircle cx='30' cy='30' r='3'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative space-y-4 sm:space-y-6 lg:space-y-8 px-3 py-4 sm:px-4 sm:py-6 lg:px-8 lg:py-8">
        {/* Back Navigation */}
        <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <Link 
            to="/biodiversity" 
            className="inline-flex items-center gap-2 px-3 py-2 sm:px-4 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-lg sm:rounded-xl border border-white/60 dark:border-white/20 text-sm sm:text-base text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Explorer</span>
          </Link>
        </div>

        {/* Enhanced Header */}
        <header className={`relative overflow-hidden rounded-2xl sm:rounded-3xl border border-white/30 bg-white/80 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/80 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
          
          <div className="relative p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            {/* Species Image */}
            {unifiedRecord?.media && unifiedRecord.media.length > 0 && unifiedRecord.media[0].type === 'image' && (
              <div className="relative h-48 sm:h-64 md:h-80 lg:h-96 overflow-hidden rounded-xl sm:rounded-2xl border border-white/30 dark:border-white/20 shadow-xl">
                <img 
                  src={unifiedRecord.media[0].url} 
                  alt={unifiedRecord.media[0].caption || unifiedRecord.commonName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-2 sm:bottom-4 left-2 sm:left-4 right-2 sm:right-4">
                  <p className="text-white/90 text-xs sm:text-sm bg-black/30 backdrop-blur-sm rounded-lg px-2 py-1.5 sm:px-3 sm:py-2">
                    {unifiedRecord.media[0].caption || `${unifiedRecord.commonName} (${unifiedRecord.scientificName})`}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-4 sm:gap-6">
              <div className="space-y-3 sm:space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-2">
                  <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold border ${status.bg} ${status.text} ${status.border}`}>
                    {record.status} - {status.label}
                  </span>
                  <span className={`px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold border ${
                    record.category === 'flora' 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700' 
                      : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                  }`}>
                    {record.category === 'flora' ? '🌿 Flora' : '🐾 Fauna'}
                  </span>
                  {unifiedRecord?.endemic && (
                    <span className="px-2 py-0.5 sm:px-3 sm:py-1 rounded-full text-xs sm:text-sm font-bold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700">
                      ⭐ Endemic
                    </span>
                  )}
                </div>
                
                <div>
                  <h1 className="text-2xl sm:text-3xl md:text-4xl lg:text-5xl xl:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-2 sm:mb-3">
                    <AnimatedText text={record.commonName} />
                  </h1>
                  <p className="text-base sm:text-lg md:text-xl lg:text-2xl font-medium italic text-gray-600 dark:text-gray-300">
                    {record.scientificName}
                  </p>
                </div>
                
                <p className="text-sm sm:text-base lg:text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {record.blurb}
                </p>
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Tabs */}
        <div className={`transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-wrap gap-1.5 sm:gap-2 p-1.5 sm:p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 dark:border-white/20">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-1.5 sm:gap-2 px-3 py-2 sm:px-4 sm:py-2.5 lg:px-6 lg:py-3 rounded-lg sm:rounded-xl text-xs sm:text-sm lg:text-base font-semibold transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
                }`}
              >
                <tab.icon className="w-3 h-3 sm:w-4 sm:h-4" />
                <span className="hidden xs:inline sm:inline">{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content Sections */}
        <div className={`transform transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {activeTab === 'overview' && (
            <div className="space-y-3 sm:space-y-4 lg:space-y-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 dark:border-white/20 p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg">
                <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-1.5 sm:gap-2 lg:gap-3">
                  <InfoIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-blue-500" />
                  Species Overview
                </h2>
                
                <div className="prose prose-sm sm:prose-base lg:prose-lg max-w-none text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed text-xs sm:text-sm md:text-base lg:text-lg">{record.blurb}</p>
                </div>

                {record.highlights && record.highlights.length > 0 && (
                  <div className="mt-3 sm:mt-4 md:mt-6 lg:mt-8 p-3 sm:p-4 md:p-5 lg:p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-lg sm:rounded-xl lg:rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30">
                    <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                      <span className="text-emerald-500 text-sm sm:text-base">✨</span>
                      Key Features
                    </h3>
                    <ul className="grid gap-1.5 sm:gap-2 md:gap-2.5 lg:gap-3 sm:grid-cols-2">
                      {record.highlights.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-1.5 sm:gap-2 lg:gap-3 p-2 sm:p-2.5 lg:p-3 bg-white/60 dark:bg-slate-800/60 rounded-lg sm:rounded-xl">
                          <span className="text-emerald-500 mt-0.5 text-xs sm:text-sm font-bold flex-shrink-0">•</span>
                          <span className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-snug">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ecology' && (
            <EcologySection 
              scientificName={record.scientificName}
              commonName={record.commonName}
              existingHabitat={record.habitat}
              existingStatus={record.status}
              sites={sites}
              status={status}
              category={record.category}
            />
          )}

          {activeTab === 'distribution' && (
            <div className="space-y-4 sm:space-y-6">
              {/* Distribution Map Section */}
              <div className="relative overflow-hidden bg-gradient-to-br from-blue-50 via-cyan-50 to-teal-50 dark:from-blue-900/20 dark:via-cyan-900/20 dark:to-teal-900/20 rounded-xl sm:rounded-2xl border-2 border-blue-200/50 dark:border-blue-700/30 p-4 sm:p-6 shadow-xl">
                <div className="absolute top-0 right-0 w-32 h-32 bg-blue-400/10 rounded-full blur-3xl"></div>
                <div className="absolute bottom-0 left-0 w-40 h-40 bg-teal-400/10 rounded-full blur-3xl"></div>
                
                <div className="relative">
                  <div className="flex items-center gap-2 sm:gap-3 mb-3 sm:mb-4">
                    <div className="p-2 sm:p-2.5 bg-blue-500 rounded-lg sm:rounded-xl shadow-lg">
                      <MapIcon className="w-4 h-4 sm:w-5 sm:h-5 text-white" />
                    </div>
                    <div>
                      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100">
                        Geographic Distribution
                      </h2>
                      <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                        Observed locations and habitat range
                      </p>
                    </div>
                  </div>
                  
                  <div className="bg-white/90 dark:bg-slate-800/90 backdrop-blur-sm rounded-lg sm:rounded-xl overflow-hidden border border-blue-200/50 dark:border-blue-700/30 shadow-lg">
                    <INaturalistMap 
                      scientificName={record.scientificName}
                      commonName={record.commonName}
                    />
                  </div>
                </div>
              </div>

              {/* Local Conservation Sites */}
              {sites.length > 0 && (
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 dark:border-white/20 p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg">
                  <div className="flex items-center justify-between mb-4 sm:mb-6 pb-3 sm:pb-4 border-b border-gray-200 dark:border-gray-700">
                    <div className="flex items-center gap-2 sm:gap-3">
                      <div className="p-1.5 sm:p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                        <MountainIcon className="w-4 h-4 sm:w-5 sm:h-5 text-emerald-600 dark:text-emerald-400" />
                      </div>
                      <div>
                        <h3 className="text-sm sm:text-base md:text-lg lg:text-xl font-bold text-gray-900 dark:text-gray-100">
                          Mati City Conservation Sites
                        </h3>
                        <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400">
                          Protected areas where this species is found
                        </p>
                      </div>
                    </div>
                    <div className="flex items-center gap-1.5 px-2.5 py-1 sm:px-3 sm:py-1.5 bg-emerald-100 dark:bg-emerald-900/30 rounded-full">
                      <span className="text-lg sm:text-xl font-bold text-emerald-600 dark:text-emerald-400">{sites.length}</span>
                      <span className="text-xs sm:text-sm font-medium text-emerald-700 dark:text-emerald-300">
                        {sites.length === 1 ? 'site' : 'sites'}
                      </span>
                    </div>
                  </div>
                  
                  <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-3 sm:gap-4">
                    {sites.map((site: any, index: number) => (
                      <Link
                        key={site.id}
                        to={`/site/${site.id}`}
                        className="group relative overflow-hidden bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-xl sm:rounded-2xl border-2 border-gray-200 dark:border-gray-700 hover:border-blue-400 dark:hover:border-blue-500 hover:shadow-2xl transition-all duration-300 hover:-translate-y-1"
                      >
                        {/* Card Number Badge */}
                        <div className="absolute top-2 right-2 w-6 h-6 sm:w-7 sm:h-7 bg-gradient-to-br from-gray-200 to-gray-300 dark:from-slate-600 dark:to-slate-700 rounded-full flex items-center justify-center text-xs font-bold text-gray-600 dark:text-gray-300 shadow-sm">
                          {index + 1}
                        </div>
                        
                        <div className="p-3 sm:p-4 lg:p-5">
                          {/* Site Type Badge */}
                          <div className="flex items-center gap-1.5 sm:gap-2 mb-3">
                            {site.type === 'marine' ? (
                              <div className="p-1.5 sm:p-2 bg-blue-100 dark:bg-blue-900/30 rounded-lg">
                                <WaveIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-blue-600 dark:text-blue-400" />
                              </div>
                            ) : (
                              <div className="p-1.5 sm:p-2 bg-emerald-100 dark:bg-emerald-900/30 rounded-lg">
                                <MountainIcon className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-emerald-600 dark:text-emerald-400" />
                              </div>
                            )}
                            <span className={`px-2 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-xs font-bold uppercase tracking-wide ${
                              site.type === 'marine' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/40 dark:text-blue-300 border border-blue-200 dark:border-blue-700'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/40 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-700'
                            }`}>
                              {site.type}
                            </span>
                          </div>
                          
                          {/* Site Name */}
                          <h4 className="text-sm sm:text-base lg:text-lg font-bold text-gray-900 dark:text-gray-100 mb-2 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors leading-tight">
                            {site.name}
                          </h4>
                          
                          {/* Description */}
                          <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mb-3 line-clamp-2 leading-relaxed">
                            {site.description}
                          </p>
                          
                          {/* Coordinates Footer */}
                          <div className="flex items-center justify-between pt-3 border-t border-gray-200 dark:border-gray-700">
                            <div className="flex items-center gap-1 text-xs text-gray-500 dark:text-gray-400">
                              <span className="text-sm">📍</span>
                              <span className="font-mono">{site.coordinates.lat.toFixed(2)}°, {site.coordinates.lng.toFixed(2)}°</span>
                            </div>
                            <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                            </svg>
                          </div>
                        </div>
                      </Link>
                    ))}
                  </div>
                </div>
              )}
            </div>
          )}

          {activeTab === 'conservation' && (
            <ConservationSection 
              scientificName={record.scientificName}
              commonName={record.commonName}
              category={record.category}
              status={status}
              statusCode={record.status}
              sites={sites}
            />
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-3 sm:gap-4 p-4 sm:p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 dark:border-white/20 shadow-lg transform transition-all duration-700 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-3 w-full sm:w-auto">
            <Link 
              to="/biodiversity" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 w-full sm:w-auto bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <SpeciesIcon className="w-4 h-4" />
              <span className="hidden xs:inline">Browse All Species</span>
              <span className="xs:hidden">All Species</span>
            </Link>
            <Link 
              to="/gis" 
              className="inline-flex items-center justify-center gap-2 px-4 py-2.5 sm:px-5 sm:py-3 w-full sm:w-auto bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-lg sm:rounded-xl text-sm sm:text-base font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
            >
              <MapIcon className="w-4 h-4" />
              <span className="hidden xs:inline">View on Map</span>
              <span className="xs:hidden">Map</span>
            </Link>
          </div>
          
          <div className="text-xs sm:text-sm text-gray-500 dark:text-gray-400 text-center sm:text-right">
            Part of Mati City&apos;s biodiversity conservation network
          </div>
        </div>
      </div>
    </div>
  )
}