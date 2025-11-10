import { useMemo, useState } from 'react'
import Fuse from 'fuse.js'
import { getSites } from '../data/adapters'
import { useData } from '../context/DataContext'
import AnimatedText from '../components/AnimatedText'
import { MountainIcon, SpeciesIcon } from '../components/Icons'

const STATUS_ORDER = ['CR','EN','VU','NT','LC','DD']

export default function BiodiversityExplorer() {
  const { unifiedSpecies: allSpecies } = useData()
  const sites = useMemo(()=>getSites(),[])
  const [query, setQuery] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<'all'|'flora'|'fauna'>('all')
  const [siteFilter, setSiteFilter] = useState<string>('all')
  const [endemicOnly, setEndemicOnly] = useState(false)

  const fuse = useMemo(()=>new Fuse(allSpecies, { keys: ['commonName','scientificName','description','habitats'], threshold: 0.36 }),[allSpecies])
  const results = useMemo(()=>{
    let base = query.trim() ? fuse.search(query).map(r=>r.item) : allSpecies
    if (statusFilter !== 'all') base = base.filter(s => s.status === statusFilter)
    if (typeFilter !== 'all') base = base.filter(s => s.type === typeFilter)
    if (siteFilter !== 'all') base = base.filter(s => s.siteIds.includes(siteFilter))
    if (endemicOnly) base = base.filter(s => s.endemic)
    return base.sort((a,b)=> STATUS_ORDER.indexOf(a.status) - STATUS_ORDER.indexOf(b.status))
  },[query,fuse,statusFilter,typeFilter,siteFilter,endemicOnly,allSpecies])

  return (
    <div className="min-h-screen relative">
      {/* Enhanced Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-emerald-50 via-blue-50 to-purple-50 dark:from-slate-900 dark:via-slate-800 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: `url("data:image/svg+xml,%3Csvg width='60' height='60' viewBox='0 0 60 60' xmlns='http://www.w3.org/2000/svg'%3E%3Cg fill='none' fill-rule='evenodd'%3E%3Cg fill='%23059669' fill-opacity='0.03'%3E%3Ccircle cx='30' cy='30' r='2'/%3E%3C/g%3E%3C/g%3E%3C/svg%3E")`
      }} />
      
      <div className="relative space-y-8 sm:space-y-10 lg:space-y-12 px-4 py-8 sm:px-6 lg:px-8">
        {/* Enhanced Header */}
        <header className="relative overflow-hidden rounded-3xl border border-white/30 bg-white/80 backdrop-blur-2xl shadow-2xl dark:border-white/10 dark:bg-slate-900/80">
          <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5" />
          <div className="absolute top-0 left-0 w-32 h-32 bg-gradient-to-br from-emerald-400/20 to-blue-400/20 rounded-full blur-2xl" />
          <div className="absolute bottom-0 right-0 w-40 h-40 bg-gradient-to-tl from-purple-400/20 to-pink-400/20 rounded-full blur-2xl" />
          
          <div className="relative p-8 space-y-8">
            <div className="text-center space-y-4">
              <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-emerald-100/80 dark:bg-emerald-900/30 border border-emerald-200/60 dark:border-emerald-700/60 backdrop-blur-sm">
                <SpeciesIcon className="w-5 h-5 text-emerald-600 dark:text-emerald-400" />
                <span className="text-sm font-semibold text-emerald-700 dark:text-emerald-300">Mati City Biodiversity Database</span>
              </div>
              
              <h1 className="text-4xl sm:text-5xl md:text-6xl lg:text-7xl font-black tracking-tight bg-gradient-to-r from-emerald-600 via-blue-600 to-purple-600 bg-clip-text text-transparent mb-6">
                <AnimatedText text="Biodiversity Explorer" />
              </h1>
              
              <p className="text-xl text-gray-700 dark:text-gray-300 max-w-3xl mx-auto leading-relaxed">
                Discover and explore the rich flora and fauna of Mati City&apos;s protected areas and biodiversity hotspots
              </p>
              
              <div className="flex justify-center items-center gap-6 mt-8">
                <div className="text-center">
                  <div className="text-3xl font-black text-emerald-600 dark:text-emerald-400">{allSpecies.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Total Species</div>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                <div className="text-center">
                  <div className="text-3xl font-black text-blue-600 dark:text-blue-400">{sites.length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Conservation Sites</div>
                </div>
                <div className="w-px h-12 bg-gradient-to-b from-transparent via-gray-300 to-transparent dark:via-gray-600" />
                <div className="text-center">
                  <div className="text-3xl font-black text-purple-600 dark:text-purple-400">{allSpecies.filter(s => s.endemic).length}</div>
                  <div className="text-sm text-gray-600 dark:text-gray-400 font-medium">Endemic Species</div>
                </div>
              </div>
            </div>

            {/* Enhanced Search and Filters */}
            <div className="space-y-6">
              {/* Search Bar */}
              <div className="flex flex-col lg:flex-row gap-4">
                <div className="flex-1 relative group">
                  <div className="absolute inset-0 bg-gradient-to-r from-emerald-500/20 to-blue-500/20 rounded-2xl blur opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                  <div className="relative">
                    <div className="absolute left-4 top-1/2 -translate-y-1/2 text-gray-400">
                      <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                      </svg>
                    </div>
                    <input 
                      value={query} 
                      onChange={e=>setQuery(e.target.value)} 
                      placeholder="Search by species name, scientific name, or habitat..." 
                      className="w-full pl-12 pr-12 py-5 rounded-2xl bg-white/90 dark:bg-slate-800/90 border border-white/60 dark:border-white/20 shadow-xl backdrop-blur-xl text-gray-900 dark:text-gray-100 placeholder-gray-500 dark:placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-500/40 focus:border-emerald-500/40 transition-all duration-300 hover:shadow-2xl" 
                    />
                    {query && (
                      <button 
                        onClick={()=>setQuery('')} 
                        className="absolute right-4 top-1/2 -translate-y-1/2 p-1 rounded-full text-gray-400 hover:text-emerald-600 hover:bg-emerald-100/80 dark:hover:bg-emerald-900/30 transition-all duration-200"
                      >
                        <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M6 18L18 6M6 6l12 12" />
                        </svg>
                      </button>
                    )}
                  </div>
                </div>
              </div>

              {/* Filter Pills */}
              <div className="space-y-4">
                <div className="flex flex-wrap gap-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                      <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M3 4a1 1 0 011-1h16a1 1 0 011 1v2.586a1 1 0 01-.293.707l-6.414 6.414a1 1 0 00-.293.707V17l-4 4v-6.586a1 1 0 00-.293-.707L3.293 7.414A1 1 0 013 6.707V4z" />
                    </svg>
                    Conservation Status:
                  </span>
                  {['all','CR','EN','VU','NT','LC','DD'].map(s => (
                    <button 
                      key={s} 
                      onClick={()=>setStatusFilter(s)} 
                      className={`px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 ${
                        statusFilter===s
                          ? 'bg-gradient-to-r from-emerald-500 to-blue-500 text-white border-transparent shadow-lg shadow-emerald-500/25'
                          : 'bg-white/80 dark:bg-slate-800/80 border-white/60 dark:border-white/20 hover:border-emerald-400 dark:hover:border-emerald-500 text-gray-700 dark:text-gray-300 hover:bg-emerald-50 dark:hover:bg-emerald-900/20'
                      }`}
                    >
                      {s==='all'?'All Status':s}
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <SpeciesIcon className="w-4 h-4" />
                    Type:
                  </span>
                  {[
                    { key: 'all', label: 'All Types', icon: '🌍' },
                    { key: 'flora', label: 'Flora', icon: '🌿' },
                    { key: 'fauna', label: 'Fauna', icon: '🐾' }
                  ].map(t => (
                    <button 
                      key={t.key} 
                      onClick={()=>setTypeFilter(t.key as any)} 
                      className={`px-4 py-2 rounded-xl border backdrop-blur-sm transition-all duration-300 font-medium hover:scale-105 flex items-center gap-2 ${
                        typeFilter===t.key
                          ? 'bg-gradient-to-r from-purple-500 to-pink-500 text-white border-transparent shadow-lg shadow-purple-500/25'
                          : 'bg-white/80 dark:bg-slate-800/80 border-white/60 dark:border-white/20 hover:border-purple-400 dark:hover:border-purple-500 text-gray-700 dark:text-gray-300 hover:bg-purple-50 dark:hover:bg-purple-900/20'
                      }`}
                    >
                      <span>{t.icon}</span>
                      <span>{t.label}</span>
                    </button>
                  ))}
                </div>

                <div className="flex flex-wrap gap-3 items-center">
                  <span className="text-sm font-semibold text-gray-700 dark:text-gray-300 flex items-center gap-2">
                    <MountainIcon className="w-4 h-4" />
                    Location:
                  </span>
                  <select 
                    value={siteFilter} 
                    onChange={e=>setSiteFilter(e.target.value)} 
                    className="px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/20 backdrop-blur-sm transition-all duration-300 hover:border-blue-400 dark:hover:border-blue-500 text-gray-700 dark:text-gray-300 focus:outline-none focus:ring-2 focus:ring-blue-500/40"
                  >
                    <option value="all">All Sites</option>
                    {sites.map(s=> <option key={s.id} value={s.id}>{s.name}</option>)}
                  </select>
                  
                  <label className="inline-flex items-center gap-3 px-4 py-2 rounded-xl bg-white/80 dark:bg-slate-800/80 border border-white/60 dark:border-white/20 backdrop-blur-sm transition-all duration-300 hover:border-amber-400 dark:hover:border-amber-500 cursor-pointer group">
                    <input 
                      type="checkbox" 
                      checked={endemicOnly} 
                      onChange={e=>setEndemicOnly(e.target.checked)} 
                      className="w-4 h-4 text-amber-500 bg-transparent border-2 border-amber-400 rounded focus:ring-amber-500 focus:ring-2 transition-colors" 
                    />
                    <span className="text-sm font-medium text-gray-700 dark:text-gray-300 group-hover:text-amber-600 dark:group-hover:text-amber-400 flex items-center gap-1">
                      <span>⭐</span>
                      <span>Endemic Only</span>
                    </span>
                  </label>
                </div>
              </div>
            </div>
          </div>
        </header>

        {/* Results Section */}
        <div className="space-y-6">
          <div className="flex items-center justify-between p-4 rounded-2xl bg-white/60 dark:bg-slate-900/60 backdrop-blur-xl border border-white/40 dark:border-white/20">
            <div className="flex items-center gap-4">
              <div className="text-lg font-bold text-gray-900 dark:text-gray-100">
                {results.length} result{results.length!==1 && 's'} found
              </div>
              <div className="text-sm text-gray-600 dark:text-gray-400">
                {query ? 'Filtered' : 'All'} dataset • Mati City biodiversity
              </div>
            </div>
            
            {results.length > 0 && (
              <div className="flex items-center gap-2 text-sm text-gray-600 dark:text-gray-400">
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-emerald-500 rounded-full"></div>
                  <span>{results.filter(r => r.type === 'flora').length} Flora</span>
                </div>
                <div className="flex items-center gap-1">
                  <div className="w-3 h-3 bg-amber-500 rounded-full"></div>
                  <span>{results.filter(r => r.type === 'fauna').length} Fauna</span>
                </div>
              </div>
            )}
          </div>

          {/* Species Grid */}
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 3xl:grid-cols-5 4xl:grid-cols-6 gap-6">
            {results.map((s, index) => (
              <div 
                key={s.id} 
                className="group relative overflow-hidden rounded-2xl border border-white/30 bg-white/80 backdrop-blur-xl shadow-xl hover:shadow-2xl dark:border-white/10 dark:bg-slate-900/80 transition-all duration-500 hover:-translate-y-2 hover:scale-105"
                style={{ animationDelay: `${index * 50}ms` }}
              >
                {/* Background Effects */}
                <div className="absolute inset-0 bg-gradient-to-br from-emerald-500/5 via-blue-500/5 to-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className={`absolute top-0 right-0 w-20 h-20 rounded-full blur-2xl opacity-20 group-hover:opacity-40 transition-opacity duration-500 ${
                  s.type === 'flora' ? 'bg-emerald-400' : 'bg-amber-400'
                }`} />

                {/* Species Photo */}
                {s.media && s.media.length > 0 && s.media[0].type === 'image' && (
                  <div className="relative h-48 overflow-hidden">
                    <img 
                      src={s.media[0].url} 
                      alt={s.media[0].caption || s.commonName}
                      className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-110"
                      loading="lazy"
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
                    <div className="absolute top-3 right-3">
                      <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                        s.type === 'flora' 
                          ? 'bg-emerald-100/90 text-emerald-700 dark:bg-emerald-900/50 dark:text-emerald-300' 
                          : 'bg-amber-100/90 text-amber-700 dark:bg-amber-900/50 dark:text-amber-300'
                      }`}>
                        <span>{s.type === 'flora' ? '🌿' : '🐾'}</span>
                        <span>{s.type}</span>
                      </span>
                    </div>
                  </div>
                )}

                <div className="relative p-6 space-y-4">
                  {/* Header */}
                  <div className="flex items-start justify-between">
                    <div className="flex-1">
                      <h3 className="text-lg font-bold text-gray-900 dark:text-gray-100 group-hover:text-emerald-600 dark:group-hover:text-emerald-400 transition-colors duration-300">
                        {s.commonName}
                      </h3>
                      <p className="text-sm font-medium italic text-gray-600 dark:text-gray-400 mt-1">
                        {s.scientificName}
                      </p>
                    </div>
                    
                    <div className="flex flex-col items-end gap-2">
                      {/* Only show type badge here if there's no image */}
                      {(!s.media || s.media.length === 0 || s.media[0].type !== 'image') && (
                        <span className={`px-2 py-1 rounded-full text-xs font-bold flex items-center gap-1 ${
                          s.type === 'flora' 
                            ? 'bg-emerald-100 text-emerald-700 dark:bg-emerald-900/30 dark:text-emerald-300' 
                            : 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-300'
                        }`}>
                          <span>{s.type === 'flora' ? '🌿' : '🐾'}</span>
                          <span>{s.type}</span>
                        </span>
                      )}
                      
                      <span className={`px-2 py-1 rounded-full text-xs font-bold ${
                        s.status === 'CR' ? 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-300' :
                        s.status === 'EN' ? 'bg-orange-100 text-orange-700 dark:bg-orange-900/30 dark:text-orange-300' :
                        s.status === 'VU' ? 'bg-yellow-100 text-yellow-700 dark:bg-yellow-900/30 dark:text-yellow-300' :
                        'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-300'
                      }`}>
                        {s.status}
                      </span>
                      
                      {s.endemic && (
                        <span className="px-2 py-1 rounded-full text-xs font-bold bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300 flex items-center gap-1">
                          <span>⭐</span>
                          <span>Endemic</span>
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Description */}
                  <p className="text-sm text-gray-700 dark:text-gray-300 leading-relaxed line-clamp-3">
                    {s.description}
                  </p>

                  {/* Habitats */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Habitats
                    </div>
                    <div className="flex flex-wrap gap-1">
                      {s.habitats.slice(0, 3).map(h => (
                        <span 
                          key={h} 
                          className="text-xs px-2 py-1 rounded-full bg-blue-100 dark:bg-blue-900/30 text-blue-700 dark:text-blue-300 border border-blue-200/50 dark:border-blue-700/50"
                        >
                          {h}
                        </span>
                      ))}
                      {s.habitats.length > 3 && (
                        <span className="text-xs px-2 py-1 text-gray-500 dark:text-gray-400">
                          +{s.habitats.length - 3} more
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Sites */}
                  <div className="space-y-2">
                    <div className="text-xs font-semibold text-gray-600 dark:text-gray-400 uppercase tracking-wide">
                      Found At
                    </div>
                    <div className="text-xs text-gray-600 dark:text-gray-400">
                      {s.siteIds.length} conservation site{s.siteIds.length !== 1 ? 's' : ''}
                    </div>
                  </div>
                </div>

                {/* Hover Overlay */}
                <div className="absolute inset-0 bg-gradient-to-t from-black/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
              </div>
            ))}
          </div>

          {results.length === 0 && (
            <div className="text-center py-16">
              <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-gray-100 dark:bg-slate-800 mb-4">
                <SpeciesIcon className="w-8 h-8 text-gray-400" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 dark:text-gray-100 mb-2">No species found</h3>
              <p className="text-gray-600 dark:text-gray-400 max-w-md mx-auto">
                Try adjusting your search criteria or clearing some filters to see more results.
              </p>
              {(query || statusFilter !== 'all' || typeFilter !== 'all' || siteFilter !== 'all' || endemicOnly) && (
                <button 
                  onClick={() => {
                    setQuery('')
                    setStatusFilter('all')
                    setTypeFilter('all')
                    setSiteFilter('all')
                    setEndemicOnly(false)
                  }}
                  className="mt-4 px-6 py-3 bg-gradient-to-r from-emerald-500 to-blue-500 text-white rounded-xl font-semibold hover:shadow-lg transition-all duration-300 hover:scale-105"
                >
                  Clear All Filters
                </button>
              )}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}