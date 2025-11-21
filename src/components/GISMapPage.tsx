import { useState, useMemo } from 'react'
import { Link } from 'react-router-dom'
import { useData } from '../context/DataContext'
import { getUnifiedSpecies } from '../data/adapters'
import DetailedGISMap from './DetailedGISMap'
import AnimatedText from './AnimatedText'
import { WaveIcon, MountainIcon, SpeciesIcon, MapIcon, InfoIcon, TargetIcon, ConservationIcon } from './Icons'

interface GISMapPageProps {
  className?: string
}

export default function GISMapPage({ className = '' }: GISMapPageProps) {
  const { hotspots, species, loading } = useData()

  return (
    <div className={`min-h-screen relative ${className}`}>
      {/* Modern Gradient Background */}
      <div className="fixed inset-0 bg-gradient-to-br from-slate-50 via-blue-50/30 to-emerald-50/40 dark:from-slate-950 dark:via-slate-900 dark:to-slate-900 -z-10" />
      <div className="fixed inset-0 opacity-30 -z-10" style={{
        backgroundImage: `radial-gradient(circle at 20% 50%, rgba(6, 182, 212, 0.08) 0%, transparent 50%), radial-gradient(circle at 80% 80%, rgba(16, 185, 129, 0.08) 0%, transparent 50%)`
      }} />
      
      <div className="relative max-w-7xl mx-auto space-y-4 sm:space-y-6 lg:space-y-8 px-3 py-3 sm:px-4 sm:py-4 lg:px-6 lg:py-6 xl:px-8">
        {/* Show Map First */}
        <section aria-label="Conservation Map" className="order-first">
          <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-xl sm:shadow-2xl">
            <div className="absolute inset-0 bg-gradient-to-br from-blue-500/3 to-emerald-500/3" />
            <div className="relative min-h-[60vh] sm:min-h-[65vh] lg:min-h-[70vh] xl:min-h-[78vh]">
              {loading ? (
                <div className="absolute inset-0 flex items-center justify-center bg-slate-50/80 dark:bg-slate-900/80 backdrop-blur-sm z-10">
                  <div className="text-center space-y-3 sm:space-y-4 px-4">
                    <div className="relative w-12 h-12 sm:w-16 sm:h-16 mx-auto">
                      <div className="absolute inset-0 border-4 border-slate-200 dark:border-slate-700 rounded-full"></div>
                      <div className="absolute inset-0 border-4 border-blue-500 border-t-transparent rounded-full animate-spin"></div>
                    </div>
                    <div>
                      <div className="text-base sm:text-lg font-bold text-slate-900 dark:text-slate-100">Loading Map</div>
                      <div className="text-xs sm:text-sm text-slate-600 dark:text-slate-400 mt-1">Preparing conservation data...</div>
                    </div>
                  </div>
                </div>
              ) : (
                <DetailedGISMap />
              )}
            </div>
          </div>
        </section>

        {/* Map Guide - Always Visible */}
        <div className="relative overflow-hidden rounded-xl sm:rounded-2xl bg-white/70 dark:bg-slate-900/70 backdrop-blur-xl border border-slate-200/60 dark:border-slate-700/60 shadow-lg sm:shadow-xl">
          <div className="absolute inset-0 bg-gradient-to-br from-indigo-500/5 via-purple-500/5 to-pink-500/5" />
          <div className="relative p-4 sm:p-6 lg:p-8 space-y-4 sm:space-y-6">
            <div className="flex items-center gap-2">
              <InfoIcon className="w-5 h-5 sm:w-6 sm:h-6 text-indigo-600 dark:text-indigo-400" />
              <h3 className="text-lg sm:text-xl lg:text-2xl font-bold text-slate-900 dark:text-slate-100">Map Guide</h3>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 sm:gap-6">
              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-blue-500 to-blue-600 flex items-center justify-center text-white text-xs">🗺️</span>
                  Features
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 sm:mt-1">→</span>
                    <span>Click markers for detailed site information and species data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 sm:mt-1">→</span>
                    <span>Switch between Street, Satellite, and Topographic views</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5 sm:mt-1">→</span>
                    <span>Use scroll to zoom and drag to pan around the map</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-amber-500 mt-0.5 sm:mt-1">→</span>
                    <span>Click any species card to view its photo gallery</span>
                  </li>
                </ul>
              </div>

              <div className="space-y-3">
                <h4 className="text-sm sm:text-base font-bold text-slate-900 dark:text-slate-100 flex items-center gap-2">
                  <span className="w-5 h-5 sm:w-6 sm:h-6 rounded-lg bg-gradient-to-br from-emerald-500 to-emerald-600 flex items-center justify-center text-white text-xs">📊</span>
                  Data Sources
                </h4>
                <ul className="space-y-2 text-xs sm:text-sm text-slate-700 dark:text-slate-300">
                  <li className="flex items-start gap-2">
                    <span className="text-blue-500 mt-0.5 sm:mt-1">→</span>
                    <span><strong>DENR-BMB</strong> - Biodiversity Management Bureau</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-emerald-500 mt-0.5 sm:mt-1">→</span>
                    <span><strong>UNESCO</strong> - World Heritage Site data</span>
                  </li>
                  <li className="flex items-start gap-2">
                    <span className="text-purple-500 mt-0.5 sm:mt-1">→</span>
                    <span><strong>Local Research</strong> - Regional institutions</span>
                  </li>
                </ul>
              </div>
            </div>

            <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3 p-3 sm:p-4 bg-gradient-to-r from-slate-50 to-blue-50/50 dark:from-slate-800/50 dark:to-blue-900/20 rounded-lg sm:rounded-xl border border-slate-200/50 dark:border-slate-700/50">
              <div className="flex items-center gap-1.5 sm:gap-2">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs font-mono">Click</kbd>
                <span className="text-xs text-slate-600 dark:text-slate-400">Select</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs font-mono">Scroll</kbd>
                <span className="text-xs text-slate-600 dark:text-slate-400">Zoom</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs font-mono">Drag</kbd>
                <span className="text-xs text-slate-600 dark:text-slate-400">Pan</span>
              </div>
              <div className="flex items-center gap-1.5 sm:gap-2">
                <kbd className="px-1.5 sm:px-2 py-0.5 sm:py-1 bg-white dark:bg-slate-700 rounded border border-slate-200 dark:border-slate-600 text-xs font-mono">Layer</kbd>
                <span className="text-xs text-slate-600 dark:text-slate-400">Switch</span>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}