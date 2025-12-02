import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getSpeciesEcologicalInfo, getWikipediaSummary, getGBIFTaxonomy } from '../services/speciesInfo'
import { getObservationsBySpecies } from '../services/inaturalist'
import { SpeciesIcon } from './Icons'

interface EcologySectionProps {
  scientificName: string
  commonName: string
  existingHabitat?: string
  existingStatus?: string
  sites: any[]
  status: any
  category?: string
  isModal?: boolean
}

export default function EcologySection({
  scientificName,
  commonName,
  existingHabitat,
  existingStatus,
  sites,
  status,
  category,
  isModal = false
}: EcologySectionProps) {
  const [ecologicalInfo, setEcologicalInfo] = useState<any>(null)
  const [taxonomy, setTaxonomy] = useState<any>(null)
  const [wikipediaUrl, setWikipediaUrl] = useState<string>('')
  const [observationCount, setObservationCount] = useState<number>(0)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadEcologicalData()
  }, [scientificName])

  const loadEcologicalData = async () => {
    setLoading(true)
    
    try {
      const [ecoInfo, wikiInfo, taxInfo, observations] = await Promise.all([
        getSpeciesEcologicalInfo(scientificName, commonName),
        getWikipediaSummary(scientificName),
        getGBIFTaxonomy(scientificName),
        getObservationsBySpecies(scientificName, {
          bounds: {
            swlat: 6.75,
            swlng: 126.0,
            nelat: 7.15,
            nelng: 126.5
          }
        })
      ])
      
      setEcologicalInfo(ecoInfo)
      setTaxonomy(taxInfo)
      setObservationCount(observations.length)
      
      if (wikiInfo?.content_urls?.desktop?.page) {
        setWikipediaUrl(wikiInfo.content_urls.desktop.page)
      } else {
        setWikipediaUrl(`https://en.wikipedia.org/wiki/${encodeURIComponent(scientificName)}`)
      }
    } catch (err) {
      console.error('Error loading ecological data:', err)
    } finally {
      setLoading(false)
    }
  }

  // Combine existing data with fetched data
  const habitat = ecologicalInfo?.habitat || existingHabitat || 'Habitat information not available'
  const conservationStatusText = ecologicalInfo?.conservationStatus || existingStatus
  const diet = ecologicalInfo?.diet
  const nativeRange = ecologicalInfo?.nativeRange

  const LinkWrapper = isModal ? 'div' : Link

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-2xl border border-white/40 dark:border-white/20 p-8 shadow-lg">
      <h2 className="text-2xl font-bold text-gray-900 dark:text-gray-100 mb-6 flex items-center gap-3">
        <SpeciesIcon className="w-6 h-6 text-emerald-500" />
        Ecological Information
        {loading && (
          <div className="ml-auto">
            <div className="animate-spin rounded-full h-5 w-5 border-2 border-emerald-500 border-t-transparent"></div>
          </div>
        )}
      </h2>
      
      <div className="grid md:grid-cols-2 gap-8">
        {/* Left Column */}
        <div className="space-y-6">
          {/* Habitat */}
          <div className="p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-emerald-500">🏡</span>
              Habitat
            </h3>
            <p className="text-gray-700 dark:text-gray-300 leading-relaxed">{habitat}</p>
            {nativeRange && (
              <div className="mt-3 pt-3 border-t border-emerald-200/50 dark:border-emerald-700/30">
                <p className="text-sm text-gray-600 dark:text-gray-400">
                  <span className="font-semibold">Native Range:</span> {nativeRange}
                </p>
              </div>
            )}
          </div>

          {/* Diet (for fauna) */}
          {diet && category === 'fauna' && (
            <div className="p-6 bg-orange-50 dark:bg-orange-900/20 rounded-2xl border border-orange-200/50 dark:border-orange-700/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-orange-500">🍽️</span>
                Diet
              </h3>
              <p className="text-gray-700 dark:text-gray-300 leading-relaxed capitalize">{diet}</p>
            </div>
          )}
          
          {/* Distribution Range */}
          <div className="p-6 bg-blue-50 dark:bg-blue-900/20 rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-blue-500">📍</span>
              Distribution Range
            </h3>
            
            {/* Observation Count */}
            {loading ? (
              <div className="flex items-center gap-2 text-gray-600 dark:text-gray-400 mb-3">
                <div className="animate-spin rounded-full h-4 w-4 border-2 border-blue-500 border-t-transparent"></div>
                <span className="text-sm">Loading observations...</span>
              </div>
            ) : observationCount > 0 ? (
              <div className="mb-3 p-3 bg-white/60 dark:bg-slate-800/60 rounded-xl border border-blue-200/50 dark:border-blue-700/30">
                <div className="flex items-center justify-between">
                  <span className="text-sm font-medium text-gray-700 dark:text-gray-300">Recorded Observations</span>
                  <span className="text-2xl font-bold text-blue-600 dark:text-blue-400">{observationCount}</span>
                </div>
                <p className="text-xs text-gray-600 dark:text-gray-400 mt-1">
                  Total observations in Mati City area
                </p>
              </div>
            ) : null}

            {/* Local Conservation Sites */}
            {sites.length > 0 && (
              <>
                <p className="text-gray-700 dark:text-gray-300 mb-2">Found across {sites.length} conservation site{sites.length !== 1 ? 's' : ''} in Mati City</p>
                <div className="flex flex-wrap gap-2">
                  {sites.slice(0, 3).map((site: any) => (
                    isModal ? (
                      <div
                        key={site.id}
                        className="px-3 py-1 bg-white/80 dark:bg-slate-700/80 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 border border-blue-200/50 dark:border-blue-700/30"
                      >
                        {site.name}
                      </div>
                    ) : (
                      <Link
                        key={site.id}
                        to={`/site/${site.id}`}
                        className="px-3 py-1 bg-white/80 dark:bg-slate-700/80 rounded-full text-sm font-medium text-blue-600 dark:text-blue-400 hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200/50 dark:border-blue-700/30"
                      >
                        {site.name}
                      </Link>
                    )
                  ))}
                  {sites.length > 3 && (
                    <span className="px-3 py-1 bg-gray-100 dark:bg-slate-700 rounded-full text-sm text-gray-600 dark:text-gray-400">
                      +{sites.length - 3} more
                    </span>
                  )}
                </div>
              </>
            )}
          </div>
        </div>
        
        {/* Right Column */}
        <div className="space-y-6">
          {/* Conservation Status */}
          <div className="p-6 bg-purple-50 dark:bg-purple-900/20 rounded-2xl border border-purple-200/50 dark:border-purple-700/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-purple-500">🎯</span>
              Conservation Status
            </h3>
            <div className={`inline-flex items-center gap-2 px-4 py-2 rounded-xl ${status.bg} ${status.text} border ${status.border}`}>
              <span className="font-bold">{existingStatus}</span>
              <span>•</span>
              <span>{status.label}</span>
            </div>
            {conservationStatusText && conservationStatusText !== existingStatus && (
              <p className="mt-3 text-sm text-gray-600 dark:text-gray-400">
                Additional info: {conservationStatusText}
              </p>
            )}
          </div>
          
          {/* Taxonomy */}
          <div className="p-6 bg-amber-50 dark:bg-amber-900/20 rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
            <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
              <span className="text-amber-500">🔬</span>
              Taxonomy
            </h3>
            <div className="space-y-2 text-sm">
              {taxonomy?.kingdom && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Kingdom:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{taxonomy.kingdom}</span>
                </div>
              )}
              {taxonomy?.phylum && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Phylum:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{taxonomy.phylum}</span>
                </div>
              )}
              {taxonomy?.class && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Class:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{taxonomy.class}</span>
                </div>
              )}
              {taxonomy?.order && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Order:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{taxonomy.order}</span>
                </div>
              )}
              {taxonomy?.family && (
                <div className="flex justify-between">
                  <span className="text-gray-600 dark:text-gray-400">Family:</span>
                  <span className="font-medium text-gray-900 dark:text-gray-100">{taxonomy.family}</span>
                </div>
              )}
              <div className="flex justify-between pt-2 border-t border-amber-200/50 dark:border-amber-700/30">
                <span className="text-gray-600 dark:text-gray-400">Scientific Name:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100 italic">{scientificName}</span>
              </div>
              <div className="flex justify-between">
                <span className="text-gray-600 dark:text-gray-400">Common Name:</span>
                <span className="font-medium text-gray-900 dark:text-gray-100">{commonName}</span>
              </div>
            </div>
          </div>

          {/* Physical Description */}
          {ecologicalInfo?.physicalDescription && (
            <div className="p-6 bg-teal-50 dark:bg-teal-900/20 rounded-2xl border border-teal-200/50 dark:border-teal-700/30">
              <h3 className="text-lg font-semibold text-gray-900 dark:text-gray-100 mb-3 flex items-center gap-2">
                <span className="text-teal-500">📝</span>
                Description
              </h3>
              <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-4">
                {ecologicalInfo.physicalDescription}
              </p>
            </div>
          )}
        </div>
      </div>

      {/* Wikipedia Reference */}
      {wikipediaUrl && (
        <div className="mt-6 bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-xl p-4 border border-slate-200/50 dark:border-slate-700/30">
          <div className="flex items-start gap-3">
            <div className="flex-shrink-0">
              <svg className="w-6 h-6 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
              </svg>
            </div>
            <div className="flex-1">
              <h4 className="text-sm font-semibold text-gray-900 dark:text-gray-100 mb-1">Data Sources</h4>
              <p className="text-xs text-gray-700 dark:text-gray-300 leading-relaxed mb-2">
                Ecological information sourced from Wikipedia and GBIF (Global Biodiversity Information Facility).
              </p>
              <a
                href={wikipediaUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center gap-1 text-xs text-blue-600 dark:text-blue-400 hover:underline font-medium"
              >
                Read more on Wikipedia
                <svg className="w-3 h-3" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M10 6H6a2 2 0 00-2 2v10a2 2 0 002 2h10a2 2 0 002-2v-4M14 4h6m0 0v6m0-6L10 14" />
                </svg>
              </a>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
