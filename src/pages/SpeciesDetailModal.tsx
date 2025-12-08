import { useState, useEffect } from 'react'
import { findSiteById } from '../data/adapters'
import AnimatedText from '../components/AnimatedText'
import INaturalistMap from '../components/INaturalistMap'
import EcologySection from '../components/EcologySection'
import ConservationSection from '../components/ConservationSection'
import { WaveIcon, MountainIcon, SpeciesIcon, MapIcon, InfoIcon, ConservationIcon, TargetIcon } from '../components/Icons'

interface SpeciesDetailModalProps {
  species: any
  isOpen: boolean
  onClose: () => void
}

export default function SpeciesDetailModal({ species, isOpen, onClose }: SpeciesDetailModalProps) {
  const [activeTab, setActiveTab] = useState<'overview' | 'ecology' | 'distribution' | 'conservation'>('overview')

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden'
      setActiveTab('overview')
    } else {
      document.body.style.overflow = 'unset'
    }

    return () => {
      document.body.style.overflow = 'unset'
    }
  }, [isOpen])

  if (!isOpen || !species) return null

  const sites = species.siteIds?.map((siteId: string) => findSiteById(siteId)).filter(Boolean) || []

  const statusMeta = {
    CR: { label: 'Critically Endangered', color: 'red', bg: 'bg-red-100 dark:bg-red-900/30', text: 'text-red-700 dark:text-red-300', border: 'border-red-200 dark:border-red-700' },
    EN: { label: 'Endangered', color: 'orange', bg: 'bg-orange-100 dark:bg-orange-900/30', text: 'text-orange-700 dark:text-orange-300', border: 'border-orange-200 dark:border-orange-700' },
    VU: { label: 'Vulnerable', color: 'yellow', bg: 'bg-yellow-100 dark:bg-yellow-900/30', text: 'text-yellow-700 dark:text-yellow-300', border: 'border-yellow-200 dark:border-yellow-700' },
    NT: { label: 'Near Threatened', color: 'lime', bg: 'bg-lime-100 dark:bg-lime-900/30', text: 'text-lime-700 dark:text-lime-300', border: 'border-lime-200 dark:border-lime-700' },
    LC: { label: 'Least Concern', color: 'green', bg: 'bg-green-100 dark:bg-green-900/30', text: 'text-green-700 dark:text-green-300', border: 'border-green-200 dark:border-green-700' },
    DD: { label: 'Data Deficient', color: 'gray', bg: 'bg-gray-100 dark:bg-gray-900/30', text: 'text-gray-700 dark:text-gray-300', border: 'border-gray-200 dark:border-gray-700' }
  }

  const status = statusMeta[species.status as keyof typeof statusMeta] || statusMeta.DD

  const tabs = [
    { id: 'overview', label: 'Overview', icon: InfoIcon },
    { id: 'ecology', label: 'Ecology', icon: SpeciesIcon },
    { id: 'distribution', label: 'Distribution', icon: MapIcon },
    { id: 'conservation', label: 'Conservation', icon: ConservationIcon }
  ]

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm animate-in fade-in duration-300">
      <div className="relative w-full max-w-6xl max-h-[90vh] overflow-hidden bg-white dark:bg-slate-900 rounded-3xl shadow-2xl animate-in zoom-in-95 duration-300 delay-100">
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 z-10 w-10 h-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur-xl rounded-full flex items-center justify-center text-gray-600 dark:text-gray-400 hover:text-gray-900 dark:hover:text-gray-100 hover:bg-white dark:hover:bg-slate-800 transition-all duration-200 shadow-lg animate-in fade-in zoom-in duration-300 delay-300"
        >
          <svg className="w-6 h-6" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
          </svg>
        </button>

        {/* Modal Content */}
        <div className="overflow-y-auto max-h-[90vh]">
          {/* Header */}
          <div className="relative overflow-hidden rounded-t-3xl border-b border-white/30 bg-white/80 backdrop-blur-2xl dark:border-white/10 dark:bg-slate-900/80 animate-in slide-in-from-top-4 duration-500 delay-200">
            <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
            <div className="absolute top-0 left-0 w-40 h-40 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-3xl" />
            <div className="absolute bottom-0 right-0 w-32 h-32 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />

            <div className="relative p-8">
              {/* Species Image */}
              {species.media && species.media.length > 0 && species.media[0].type === 'image' && (
                <div className="relative h-64 md:h-80 lg:h-96 overflow-hidden rounded-2xl border border-white/30 dark:border-white/20 shadow-xl mb-6 animate-in zoom-in-95 duration-500 delay-300">
                  <img
                    src={species.media[0].url}
                    alt={species.media[0].caption || species.commonName}
                    className="w-full h-full object-cover"
                    loading="lazy"
                    onError={(e) => {
                      console.error('SpeciesDetailModal image failed to load:', species.media[0].url, 'for species:', species.commonName)
                    }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-black/40 via-transparent to-transparent" />
                  <div className="absolute bottom-4 left-4 right-4">
                    <p className="text-white/90 text-sm bg-black/30 backdrop-blur-sm rounded-lg px-3 py-2">
                      {species.media[0].caption || `${species.commonName} (${species.scientificName})`}
                    </p>
                  </div>
                </div>
              )}

              <div className="flex flex-col lg:flex-row lg:items-start lg:justify-between gap-6">
                <div className="space-y-4 flex-1 animate-in slide-in-from-left-4 duration-500 delay-400">
                  <div className="flex flex-wrap items-center gap-3">
                    {[
                      { label: `${species.status} - ${status.label}`, bg: status.bg, text: status.text, border: status.border },
                      {
                        label: species.type === 'flora' ? '🌿 Flora' : '🐾 Fauna',
                        bg: species.type === 'flora' ? 'bg-emerald-100 dark:bg-emerald-900/30' : 'bg-amber-100 dark:bg-amber-900/30',
                        text: species.type === 'flora' ? 'text-emerald-700 dark:text-emerald-300' : 'text-amber-700 dark:text-amber-300',
                        border: species.type === 'flora' ? 'border-emerald-200 dark:border-emerald-700' : 'border-amber-200 dark:border-amber-700'
                      },
                      ...(species.endemic ? [{
                        label: '⭐ Endemic',
                        bg: 'bg-purple-100 dark:bg-purple-900/30',
                        text: 'text-purple-700 dark:text-purple-300',
                        border: 'border-purple-200 dark:border-purple-700'
                      }] : [])
                    ].map((tag, index) => (
                      <span
                        key={tag.label}
                        className={`px-3 py-1 rounded-full text-sm font-bold border ${tag.bg} ${tag.text} ${tag.border} animate-in fade-in duration-300`}
                        style={{ animationDelay: `${500 + index * 100}ms` }}
                      >
                        {tag.label}
                      </span>
                    ))}
                  </div>

                  <div>
                    <h1 className="text-4xl md:text-5xl lg:text-6xl font-black tracking-tight mb-3 relative">
                      <AnimatedText text={species.commonName} color="text-gray-900 dark:text-white" className="relative" />
                    </h1>
                    <p className="text-xl md:text-2xl font-medium italic text-gray-600 dark:text-gray-300">
                      {species.scientificName}
                    </p>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Tabs */}
          <div className="px-8 py-4 animate-in slide-in-from-bottom-4 duration-500 delay-700">
            <div className="flex flex-wrap gap-2 p-2 bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20">
              {tabs.map((tab, index) => (
                <button
                  key={tab.id}
                  onClick={() => setActiveTab(tab.id as any)}
                  className={`flex items-center gap-2 px-6 py-3 rounded-xl font-semibold transition-all duration-300 hover:scale-105 animate-in fade-in duration-300 ${
                    activeTab === tab.id
                      ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white shadow-lg'
                      : 'text-gray-700 dark:text-gray-300 hover:bg-white/80 dark:hover:bg-slate-800/80'
                  }`}
                  style={{ animationDelay: `${800 + index * 100}ms` }}
                >
                  <tab.icon className="w-4 h-4" />
                  <span>{tab.label}</span>
                </button>
              ))}
            </div>
          </div>

          {/* Content */}
          <div className="px-8 pb-8">
            {activeTab === 'overview' && (
              <div className="space-y-6 animate-in fade-in duration-500 delay-900">
                <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg animate-in slide-in-from-bottom-4 duration-500 delay-1000">
                  <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                    <InfoIcon className="w-6 h-6 text-blue-500" />
                    Species Overview
                  </h2>

                  <div className="prose prose-lg max-w-none text-gray-700 dark:text-gray-300">
                    <p className="leading-relaxed text-lg">{species.blurb || species.description}</p>
                  </div>

                  {species.highlights && species.highlights.length > 0 && (
                    <div className="mt-8 p-6 bg-gradient-to-br from-emerald-50 to-blue-50 dark:from-emerald-900/20 dark:to-blue-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30 animate-in zoom-in-95 duration-500 delay-1100">
                      <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-4 flex items-center gap-2">
                        <span className="text-emerald-500">✨</span>
                        Key Features
                      </h3>
                      <ul className="grid md:grid-cols-2 gap-3">
                        {species.highlights.map((highlight: string, i: number) => (
                          <li key={i} className="flex items-start gap-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl animate-in slide-in-from-left-2 duration-300" style={{ animationDelay: `${1200 + i * 100}ms` }}>
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
              <EcologySection 
                scientificName={species.scientificName}
                commonName={species.commonName}
                existingHabitat={species.habitat}
                existingStatus={species.status}
                sites={sites}
                status={status}
                category={species.type}
                isModal={true}
              />
            )}

            {activeTab === 'distribution' && (
              <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg animate-in slide-in-from-bottom-4 duration-500 delay-1000">
                <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
                  <MapIcon className="w-6 h-6 text-blue-500" />
                  Geographic Distribution
                </h2>

                {/* iNaturalist Distribution Map */}
                <div className="mb-8">
                  <INaturalistMap 
                    scientificName={species.scientificName}
                    commonName={species.commonName}
                  />
                </div>

                {/* Local Conservation Sites */}
                {sites.length > 0 && (
                  <div className="space-y-4">
                    <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 flex items-center gap-2">
                      <MountainIcon className="w-5 h-5 text-emerald-500" />
                      Found in Mati City Conservation Sites
                    </h3>
                    <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {sites.map((site: any, index: number) => (
                        <div
                          key={site.id}
                          className="group p-6 bg-gradient-to-br from-white to-gray-50 dark:from-slate-800 dark:to-slate-700 rounded-2xl border border-white/60 dark:border-white/20 hover:shadow-lg hover:scale-105 transition-all duration-300 animate-in zoom-in-95 duration-500"
                          style={{ animationDelay: `${1100 + index * 100}ms` }}
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
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}

            {activeTab === 'conservation' && (
              <ConservationSection 
                scientificName={species.scientificName}
                commonName={species.commonName}
                category={species.type}
                status={status}
                statusCode={species.status}
                sites={sites}
                isModal={true}
              />
            )}
          </div>
        </div>
      </div>
    </div>
  )
}