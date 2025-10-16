import { useParams, Link } from 'react-router-dom'
import { useState, useEffect, useMemo } from 'react'
import { findSpeciesById, findSiteById, getUnifiedSpecies } from '../data/adapters'
import AnimatedText from '../components/AnimatedText'
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
      
      <div className="relative space-y-8 px-4 py-8 sm:px-6 lg:px-8">
        {/* Back Navigation */}
        <div className={`transform transition-all duration-500 ${isVisible ? 'translate-y-0 opacity-100' : '-translate-y-4 opacity-0'}`}>
          <Link 
            to="/biodiversity" 
            className="inline-flex items-center gap-2 px-4 py-2 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl border border-white/60 dark:border-white/20 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20 hover:border-emerald-400 dark:hover:border-emerald-500 transition-all duration-300 group"
          >
            <svg className="w-4 h-4 group-hover:-translate-x-1 transition-transform duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 19l-7-7m0 0l7-7m-7 7h18" />
            </svg>
            <span className="font-semibold">Back to Explorer</span>
          </Link>
        </div>

        {/* Enhanced Header */}
        <header className={`relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/80 transform transition-all duration-700 delay-200 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
          
          <div className="relative p-8 space-y-6">
            {/* Species Image */}
            {unifiedRecord?.media && unifiedRecord.media.length > 0 && unifiedRecord.media[0].type === 'image' && (
              <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl border border-white/30 dark:border-white/20 shadow-xl">
                <img 
                  src={unifiedRecord.media[0].url} 
                  alt={unifiedRecord.media[0].caption || unifiedRecord.commonName}
                  className="w-full h-full object-cover"
                  loading="lazy"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                <div className="absolute bottom-4 left-4 right-4">
                  <p className="text-white/90 text-sm bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                    {unifiedRecord.media[0].caption || `${unifiedRecord.commonName} (${unifiedRecord.scientificName})`}
                  </p>
                </div>
              </div>
            )}
            
            <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
              <div className="space-y-4 flex-1">
                <div className="flex flex-wrap items-center gap-3">
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${status.bg} ${status.text} ${status.border}`}>
                    {record.status} - {status.label}
                  </span>
                  <span className={`px-3 py-1 rounded-full text-sm font-bold border ${
                    record.category === 'flora' 
                      ? 'bg-emerald-100 text-emerald-700 border-emerald-200 dark:bg-emerald-900/30 dark:text-emerald-300 dark:border-emerald-700' 
                      : 'bg-amber-100 text-amber-700 border-amber-200 dark:bg-amber-900/30 dark:text-amber-300 dark:border-amber-700'
                  }`}>
                    {record.category === 'flora' ? '🌿 Flora' : '🐾 Fauna'}
                  </span>
                  {unifiedRecord?.endemic && (
                    <span className="px-3 py-1 rounded-full text-sm font-bold bg-purple-100 text-purple-700 border border-purple-200 dark:bg-purple-900/30 dark:text-purple-300 dark:border-purple-700">
                      ⭐ Endemic
                    </span>
                  )}
                </div>
                
                <div>
                  <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-3">
                    <AnimatedText text={record.commonName} />
                  </h1>
                  <p className="text-xl md:text-2xl font-medium italic text-gray-600 dark:text-gray-300">
                    {record.scientificName}
                  </p>
                </div>
                
                <p className="text-lg text-gray-700 dark:text-gray-300 leading-relaxed max-w-3xl">
                  {record.blurb}
                </p>
              </div>

              {/* Quick Stats */}
              <div className="bg-white/90 dark:bg-slate-800/90 rounded-2xl border border-white/60 dark:border-white/20 backdrop-blur-xl p-6 space-y-4 lg:min-w-[300px]">
                <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                  <TargetIcon className="w-5 h-5 text-blue-500" />
                  Quick Facts
                </h3>
                
                <div className="space-y-3 text-sm">
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Category:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100 capitalize">{record.category}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Status:</span>
                    <span className={`font-semibold ${status.text}`}>{record.status}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Habitat:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{record.habitat}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-gray-600 dark:text-gray-400">Sites found:</span>
                    <span className="font-semibold text-gray-900 dark:text-gray-100">{sites.length}</span>
                  </div>
                </div>
                
                {record.highlights && record.highlights.length > 0 && (
                  <div className="pt-4 border-t border-white/40 dark:border-white/20">
                    <div className="text-sm font-semibold text-gray-700 dark:text-gray-300 mb-2">Key Highlights:</div>
                    <ul className="text-sm space-y-1">
                      {record.highlights.slice(0, 3).map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-2">
                          <span className="text-emerald-500 mt-0.5">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          </div>
        </header>

        {/* Enhanced Tabs */}
        <div className={`transform transition-all duration-700 delay-400 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex flex-wrap gap-2 p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20">
            {tabs.map(tab => (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id as any)}
                className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 ${
                  activeTab === tab.id
                    ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                    : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
                }`}
              >
                <tab.icon className="w-4 h-4" />
                <span>{tab.label}</span>
              </button>
            ))}
          </div>
        </div>

        {/* Enhanced Content Sections */}
        <div className={`transform transition-all duration-700 delay-600 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          {activeTab === 'overview' && (
            <div className="space-y-6">
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                  <InfoIcon className="w-6 h-6 text-blue-500" />
                  Species Overview
                </h2>
                
                <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                  <p className="leading-relaxed text-lg">{record.blurb}</p>
                </div>

                {record.highlights && record.highlights.length > 0 && (
                  <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                      <span className="text-emerald-500">✨</span>
                      Key Features
                    </h3>
                    <ul className="grid md:grid-cols-2 gap-3">
                      {record.highlights.map((highlight: string, i: number) => (
                        <li key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl">
                          <span className="text-emerald-500 mt-0.5 font-bold">•</span>
                          <span className="text-gray-700 dark:text-gray-300">{highlight}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                )}
              </div>
            </div>
          )}

          {activeTab === 'ecology' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <SpeciesIcon className="w-6 h-6 text-emerald-500" />
                Ecological Information
              </h2>
              
              <div className="grid md:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-emerald-500">🏡</span>
                      Habitat
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{record.habitat}</p>
                  </div>
                  
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-blue-500">📍</span>
                      Distribution Range
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300">Found across {sites.length} conservation site{sites.length !== 1 ? 's' : ''} in Mati City</p>
                    <div className="mt-3 flex flex-wrap gap-2">
                      {sites.slice(0, 3).map((site: any) => (
                        <Link
                          key={site.id}
                          to={`/site/${site.id}`}
                          className="px-3 py-1 bg-white/80 dark:bg-slate-700/80 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200/50 dark:border-blue-700/30"
                        >
                          {site.name}
                        </Link>
                      ))}
                      {sites.length > 3 && (
                        <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
                          +{sites.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-purple-500">🎯</span>
                      Conservation Status
                    </h3>
                    <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} ${status.text} border ${status.border}`}>
                      <span className="font-bold">{record.status}</span>
                      <span>•</span>
                      <span>{status.label}</span>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-amber-500">🔬</span>
                      Taxonomy
                    </h3>
                    <div className="space-y-2 text-sm">
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Scientific Name:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 italic">{record.scientificName}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-gray-600 dark:text-gray-400">Category:</span>
                        <span className="font-medium text-gray-900 dark:text-gray-100 capitalize">{record.category}</span>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          )}

          {activeTab === 'distribution' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <MapIcon className="w-6 h-6 text-blue-500" />
                Geographic Distribution
              </h2>
              
              {sites.length > 0 ? (
                <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                  {sites.map((site: any) => (
                    <Link
                      key={site.id}
                      to={`/site/${site.id}`}
                      className="group p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-white/60 dark:border-white/20 hover:shadow-lg hover:scale-105 transition-all duration-300"
                    >
                      <div className="flex items-start justify-between mb-4">
                        <div className="flex items-center gap-2">
                          {site.type === 'marine' ? (
                            <WaveIcon className="w-5 h-5 text-blue-500" />
                          ) : (
                            <MountainIcon className="w-5 h-5 text-emerald-500" />
                          )}
                          <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                            site.type === 'marine' 
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-300'
                              : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300'
                          }`}>
                            {site.type}
                          </span>
                        </div>
                        <svg className="w-4 h-4 text-gray-400 group-hover:text-blue-500 group-hover:translate-x-1 transition-all duration-200" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
                        </svg>
                      </div>
                      
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 group-hover:text-blue-600 dark:group-hover:text-blue-400 transition-colors mb-2">
                        {site.name}
                      </h3>
                      
                      <p className="text-sm text-gray-600 dark:text-gray-400 mb-4 line-clamp-2">
                        {site.description}
                      </p>
                      
                      <div className="flex items-center gap-4 text-xs text-gray-500 dark:text-gray-400">
                        <span>📍 {site.coordinates.lat.toFixed(3)}°, {site.coordinates.lng.toFixed(3)}°</span>
                      </div>
                    </Link>
                  ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <div className="w-16 h-16 bg-gray-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                    <MapIcon className="w-8 h-8 text-gray-400" />
                  </div>
                  <p className="text-gray-600 dark:text-gray-400">No distribution data available for this species.</p>
                </div>
              )}
            </div>
          )}

          {activeTab === 'conservation' && (
            <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg">
              <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                <ConservationIcon className="w-6 h-6 text-purple-500" />
                Conservation Status & Efforts
              </h2>
              
              <div className="grid lg:grid-cols-2 gap-8">
                <div className="space-y-6">
                  <div className={`p-6 rounded-2xl border ${status.bg} ${status.border}`}>
                    <h3 className="text-lg font-semibold mb-3 flex items-center gap-2">
                      <span className="text-2xl">⚠️</span>
                      Current Status
                    </h3>
                    <div className="space-y-3">
                      <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl font-bold ${status.text}`}>
                        <span>{record.status}</span>
                        <span>•</span>
                        <span>{status.label}</span>
                      </div>
                      <p className="text-gray-700 dark:text-gray-300 leading-relaxed">
                        This species is classified as <strong>{status.label}</strong> according to conservation assessments. 
                        Regular monitoring and protection efforts are essential for its continued survival.
                      </p>
                    </div>
                  </div>
                  
                  <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-blue-500">🏛️</span>
                      Protected Areas
                    </h3>
                    <p className="text-gray-700 dark:text-gray-300 mb-3">
                      This species is found in {sites.length} protected conservation site{sites.length !== 1 ? 's' : ''} within Mati City&apos;s biodiversity network.
                    </p>
                    <div className="space-y-2">
                      {sites.map((site: any) => (
                        <Link
                          key={site.id}
                          to={`/site/${site.id}`}
                          className="block p-3 bg-white/80 dark:bg-slate-700/80 rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200/50 dark:border-blue-700/30"
                        >
                          <div className="flex items-center justify-between">
                            <span className="font-medium text-gray-900 dark:text-gray-100">{site.name}</span>
                            <span className={`px-2 py-1 rounded-full text-xs font-semibold ${
                              site.type === 'marine' 
                                ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                                : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                            }`}>
                              {site.type}
                            </span>
                          </div>
                        </Link>
                      ))}
                    </div>
                  </div>
                </div>
                
                <div className="space-y-6">
                  <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-emerald-500">🌱</span>
                      Conservation Actions
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Habitat protection through designated conservation areas</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Regular monitoring and population assessments</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Community education and awareness programs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-emerald-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Research and data collection initiatives</span>
                      </li>
                    </ul>
                  </div>
                  
                  <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
                    <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                      <span className="text-amber-500">🤝</span>
                      How You Can Help
                    </h3>
                    <ul className="space-y-3 text-sm">
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Support responsible eco-tourism in Mati City</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Participate in citizen science programs</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Share educational content about biodiversity</span>
                      </li>
                      <li className="flex items-start gap-3">
                        <span className="text-amber-500 mt-0.5">•</span>
                        <span className="text-gray-700 dark:text-gray-300">Respect protected areas and wildlife guidelines</span>
                      </li>
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          )}
        </div>

        {/* Enhanced Navigation */}
        <div className={`flex flex-col sm:flex-row items-center justify-between gap-4 p-6 bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 shadow-lg transform transition-all duration-700 delay-800 ${isVisible ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}>
          <div className="flex items-center gap-4">
            <Link 
              to="/biodiversity" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
            >
              <SpeciesIcon className="w-4 h-4" />
              Browse All Species
            </Link>
            <Link 
              to="/gis" 
              className="inline-flex items-center gap-2 px-6 py-3 bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/20 text-gray-700 dark:text-gray-300 rounded-xl font-semibold hover:bg-blue-50 dark:hover:bg-blue-900/20 hover:border-blue-400 dark:hover:border-blue-500 transition-all duration-300"
            >
              <MapIcon className="w-4 h-4" />
              View on Map
            </Link>
          </div>
          
          <div className="text-sm text-gray-500 dark:text-gray-400">
            Part of Mati City&apos;s biodiversity conservation network
          </div>
        </div>
      </div>
    </div>
  )
}