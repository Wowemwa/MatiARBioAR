import { useEffect, useState } from 'react'
import { Link } from 'react-router-dom'
import { getConservationInfo, ConservationInfo } from '../services/conservationInfo'
import { ConservationIcon } from './Icons'

interface ConservationSectionProps {
  scientificName: string
  commonName: string
  category: string
  status: any
  statusCode: string
  sites: any[]
  isModal?: boolean
}

export default function ConservationSection({
  scientificName,
  commonName,
  category,
  status,
  statusCode,
  sites,
  isModal = false
}: ConservationSectionProps) {
  const [conservationInfo, setConservationInfo] = useState<ConservationInfo | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    loadConservationData()
  }, [scientificName])

  const loadConservationData = async () => {
    setLoading(true)
    
    try {
      const info = await getConservationInfo(scientificName, category, statusCode, sites.length)
      setConservationInfo(info)
    } catch (err) {
      console.error('Error loading conservation data:', err)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="bg-white/80 dark:bg-slate-900/80 backdrop-blur-xl rounded-xl sm:rounded-2xl border border-white/40 dark:border-white/20 p-3 sm:p-4 md:p-6 lg:p-8 shadow-lg">
      <h2 className="text-base sm:text-lg md:text-xl lg:text-2xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-1.5 sm:gap-2 lg:gap-3">
        <ConservationIcon className="w-4 h-4 sm:w-5 sm:h-5 lg:w-6 lg:h-6 text-purple-500" />
        Conservation Status & Efforts
        {loading && (
          <div className="ml-auto">
            <div className="animate-spin rounded-full h-4 w-4 sm:h-5 sm:w-5 border-2 border-purple-500 border-t-transparent"></div>
          </div>
        )}
      </h2>
      
      {/* Status Overview Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <div className={`p-3 sm:p-4 md:p-5 lg:p-6 rounded-xl sm:rounded-2xl border ${status.bg} ${status.border}`}>
          <h3 className="text-sm sm:text-base lg:text-lg font-semibold mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
            <span className="text-lg sm:text-xl lg:text-2xl">⚠️</span>
            Current Conservation Status
          </h3>
          <div className="space-y-2 sm:space-y-3">
            <div className={`inline-flex items-center gap-1.5 sm:gap-2 px-3 py-1.5 sm:px-4 sm:py-2 lg:px-5 lg:py-2.5 rounded-lg sm:rounded-xl font-bold ${status.text} text-xs sm:text-sm lg:text-base`}>
              <span>{statusCode}</span>
              <span>•</span>
              <span>{status.label}</span>
            </div>
            <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 leading-relaxed">
              This species is classified as <strong>{status.label}</strong> according to conservation assessments. 
              Regular monitoring and protection efforts are essential for its continued survival.
            </p>
            {conservationInfo?.iucnInfo && (
              <p className="text-xs sm:text-sm text-gray-600 dark:text-gray-400 mt-2 sm:mt-3 pt-2 sm:pt-3 border-t border-gray-200/50 dark:border-gray-700/30">
                <strong>IUCN Note:</strong> {conservationInfo.iucnInfo}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Threats & Protected Areas Section */}
      {(conservationInfo?.threats && conservationInfo.threats.length > 0) || sites.length > 0 ? (
        <div className="mb-4 sm:mb-6 lg:mb-8 grid md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Threats */}
          {conservationInfo?.threats && conservationInfo.threats.length > 0 && (
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-red-50 dark:bg-red-900/20 rounded-xl sm:rounded-2xl border border-red-200/50 dark:border-red-700/30">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                <span className="text-red-500 text-sm sm:text-base">⚡</span>
                Known Threats
              </h3>
              <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-xs sm:text-sm">
                {conservationInfo.threats.map((threat, index) => (
                  <li key={index} className="flex items-start gap-3">
                    <span className="text-red-500 mt-0.5 flex-shrink-0">•</span>
                    <span className="text-gray-700 dark:text-gray-300">{threat}</span>
                  </li>
                ))}
              </ul>
            </div>
          )}
          
          {/* Protected Areas */}
          {sites.length > 0 && (
            <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-blue-50 dark:bg-blue-900/20 rounded-xl sm:rounded-2xl border border-blue-200/50 dark:border-blue-700/30">
              <h3 className="text-sm sm:text-base lg:text-lg font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
                <span className="text-blue-500 text-sm sm:text-base">🏛️</span>
                Protected Areas in Mati City
              </h3>
              <p className="text-xs sm:text-sm text-gray-700 dark:text-gray-300 mb-2 sm:mb-3">
                Found in <strong>{sites.length}</strong> protected conservation {sites.length !== 1 ? 'sites' : 'site'}
              </p>
              <div className="space-y-1.5 sm:space-y-2 max-h-48 overflow-y-auto pr-1">
                {sites.map((site: any) => (
                  isModal ? (
                    <div
                      key={site.id}
                      className="block p-2 sm:p-2.5 lg:p-3 bg-white/80 dark:bg-slate-700/80 rounded-lg sm:rounded-xl border border-blue-200/50 dark:border-blue-700/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{site.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          site.type === 'marine' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                        }`}>
                          {site.type}
                        </span>
                      </div>
                    </div>
                  ) : (
                    <Link
                      key={site.id}
                      to={`/site/${site.id}`}
                      className="block p-2 sm:p-2.5 lg:p-3 bg-white/80 dark:bg-slate-700/80 rounded-lg sm:rounded-xl hover:bg-blue-100 dark:hover:bg-blue-900/30 transition-colors border border-blue-200/50 dark:border-blue-700/30"
                    >
                      <div className="flex items-center justify-between gap-2">
                        <span className="font-medium text-sm text-gray-900 dark:text-gray-100">{site.name}</span>
                        <span className={`px-2 py-1 rounded-full text-xs font-semibold flex-shrink-0 ${
                          site.type === 'marine' 
                            ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/50 dark:text-blue-300'
                            : 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300'
                        }`}>
                          {site.type}
                        </span>
                      </div>
                    </Link>
                  )
                ))}
              </div>
            </div>
          )}
        </div>
      ) : null}

      {/* Conservation Efforts Section */}
      <div className="mb-4 sm:mb-6 lg:mb-8">
        <h3 className="text-base sm:text-lg md:text-xl font-bold text-gray-900 dark:text-gray-100 mb-3 sm:mb-4 lg:mb-6 flex items-center gap-1.5 sm:gap-2">
          <span className="text-lg sm:text-xl lg:text-2xl">🛡️</span>
          Active Conservation Programs
        </h3>
        
        <div className="grid md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6">
          {/* Local Efforts (Mati City) */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-emerald-50 dark:bg-emerald-900/20 rounded-xl sm:rounded-2xl border border-emerald-200/50 dark:border-emerald-700/30">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
              <span className="text-emerald-500 text-sm sm:text-base">🌱</span>
              Mati City Conservation Efforts
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-xs sm:text-sm">
              {conservationInfo?.localEfforts?.map((effort, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-emerald-500 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{effort}</span>
                </li>
              ))}
            </ul>
          </div>

          {/* National/Regional Efforts */}
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-purple-50 dark:bg-purple-900/20 rounded-xl sm:rounded-2xl border border-purple-200/50 dark:border-purple-700/30">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
              <span className="text-purple-500 text-sm sm:text-base">🇵🇭</span>
              Philippine Conservation Programs
            </h4>
            <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-xs sm:text-sm">
              {conservationInfo?.internationalEfforts?.map((effort, index) => (
                <li key={index} className="flex items-start gap-3">
                  <span className="text-purple-500 mt-0.5 flex-shrink-0">•</span>
                  <span className="text-gray-700 dark:text-gray-300">{effort}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>
      </div>

      {/* Organizations & How to Help Section */}
      <div className="grid md:grid-cols-2 gap-3 sm:gap-4 lg:gap-6 mb-3 sm:mb-4 lg:mb-6">
        {/* Organizations Involved */}
        {conservationInfo?.organizationsInvolved && conservationInfo.organizationsInvolved.length > 0 && (
          <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-cyan-50 dark:bg-cyan-900/20 rounded-xl sm:rounded-2xl border border-cyan-200/50 dark:border-cyan-700/30">
            <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
              <span className="text-cyan-500 text-sm sm:text-base">🌍</span>
              International Organizations
            </h4>
            <div className="space-y-1.5 sm:space-y-2">
              {conservationInfo.organizationsInvolved.map((org, index) => (
                <div key={index} className="px-2 py-1.5 sm:px-2.5 sm:py-2 lg:px-3 bg-white/60 dark:bg-slate-800/60 rounded-lg text-xs sm:text-sm text-gray-700 dark:text-gray-300 border border-cyan-100 dark:border-cyan-800/30">
                  {org}
                </div>
              ))}
            </div>
          </div>
        )}

        {/* How You Can Help */}
        <div className="p-3 sm:p-4 md:p-5 lg:p-6 bg-amber-50 dark:bg-amber-900/20 rounded-xl sm:rounded-2xl border border-amber-200/50 dark:border-amber-700/30">
          <h4 className="text-xs sm:text-sm lg:text-base font-semibold text-gray-900 dark:text-gray-100 mb-2 sm:mb-3 lg:mb-4 flex items-center gap-1.5 sm:gap-2">
            <span className="text-amber-500 text-sm sm:text-base">🤝</span>
            How You Can Help
          </h4>
          <ul className="space-y-1.5 sm:space-y-2 lg:space-y-2.5 text-xs sm:text-sm">
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">Support responsible eco-tourism in Mati City</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">Participate in citizen science programs</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">Share educational content about biodiversity</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">Respect protected areas and wildlife guidelines</span>
            </li>
            <li className="flex items-start gap-3">
              <span className="text-amber-500 mt-0.5 flex-shrink-0">•</span>
              <span className="text-gray-700 dark:text-gray-300">Report wildlife sightings to local authorities</span>
            </li>
          </ul>
        </div>
      </div>

      {/* Data Sources Note */}
      <div className="bg-gradient-to-r from-slate-50 to-gray-50 dark:from-slate-800/50 dark:to-gray-800/50 rounded-lg sm:rounded-xl p-3 sm:p-4 border border-slate-200/50 dark:border-slate-700/30">
        <div className="flex items-start gap-2 sm:gap-3">
          <div className="flex-shrink-0">
            <svg className="w-4 h-4 sm:w-5 sm:h-5 text-slate-600 dark:text-slate-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
          </div>
          <div className="flex-1">
            <h4 className="text-xs font-semibold text-gray-900 dark:text-gray-100 mb-1">Conservation Data Sources</h4>
            <p className="text-xs text-gray-600 dark:text-gray-400 leading-relaxed">
              Information compiled from IUCN Red List, GBIF, Wikipedia, Philippine DENR, 
              and Mati City biodiversity programs. Efforts coordinated between local, national, 
              and international conservation organizations.
            </p>
          </div>
        </div>
      </div>
    </div>
  )
}
