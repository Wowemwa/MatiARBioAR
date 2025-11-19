import { useEffect, useState } from 'react'
import { useData } from '../context/DataContext'

interface ARJSViewerProps {
  isVisible: boolean
  onClose: () => void
  speciesId?: string
}

export default function ARJSViewer({ isVisible, onClose, speciesId }: ARJSViewerProps) {
  const { species } = useData()
  const [selectedSpecies, setSelectedSpecies] = useState<typeof species[0] | null>(null)
  const [arReady, setArReady] = useState(false)

  useEffect(() => {
    if (speciesId) {
      const found = species.find(s => s.id === speciesId)
      setSelectedSpecies(found || null)
    }
  }, [speciesId, species])

  useEffect(() => {
    if (!isVisible) {
      setArReady(false)
      return
    }

    // Load AR.js and A-Frame scripts
    const loadScripts = async () => {
      // Check if already loaded
      if (document.querySelector('script[src*="aframe"]')) {
        setArReady(true)
        return
      }

      // Load A-Frame
      const aframeScript = document.createElement('script')
      aframeScript.src = 'https://cdn.jsdelivr.net/npm/aframe@1.4.2/dist/aframe-master.min.js'
      aframeScript.async = false
      
      // Load AR.js
      const arjsScript = document.createElement('script')
      arjsScript.src = 'https://cdn.jsdelivr.net/npm/ar.js@3.4.5/aframe/build/aframe-ar.min.js'
      arjsScript.async = false

      aframeScript.onload = () => {
        document.head.appendChild(arjsScript)
      }

      arjsScript.onload = () => {
        setArReady(true)
      }

      document.head.appendChild(aframeScript)
    }

    loadScripts()
  }, [isVisible])

  if (!isVisible) return null

  const hasARContent = selectedSpecies?.arModelUrl && selectedSpecies?.arPatternUrl

  return (
    <div className="fixed inset-0 z-[9999] bg-black">
      {/* Header */}
      <div className="absolute top-0 left-0 right-0 z-[10000] bg-gradient-to-b from-black/80 to-transparent p-4">
        <div className="flex items-center justify-between">
          <div className="text-white">
            <h2 className="text-xl font-bold">{selectedSpecies?.commonName || 'AR Viewer'}</h2>
            {selectedSpecies?.scientificName && (
              <p className="text-sm text-white/80 italic">{selectedSpecies.scientificName}</p>
            )}
          </div>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-red-500 hover:bg-red-600 text-white rounded-lg font-semibold transition-all"
          >
            ✕ Close
          </button>
        </div>
      </div>

      {/* AR Scene */}
      {arReady && hasARContent ? (
        <div 
          id="ar-scene-container"
          dangerouslySetInnerHTML={{
            __html: `
              <a-scene
                embedded
                arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
                vr-mode-ui="enabled: false"
                renderer="logarithmicDepthBuffer: true; precision: medium;"
              >
                <!-- Camera -->
                <a-entity camera></a-entity>

                <!-- AR Marker -->
                <a-marker
                  type="pattern"
                  url="${selectedSpecies.arPatternUrl}"
                  smooth="true"
                  smoothCount="10"
                  smoothTolerance="0.01"
                  smoothThreshold="5"
                >
                  <!-- 3D Model -->
                  <a-entity
                    gltf-model="${selectedSpecies.arModelUrl}"
                    scale="${selectedSpecies.arModelScale || 1} ${selectedSpecies.arModelScale || 1} ${selectedSpecies.arModelScale || 1}"
                    rotation="${selectedSpecies.arModelRotation?.x || 0} ${selectedSpecies.arModelRotation?.y || 0} ${selectedSpecies.arModelRotation?.z || 0}"
                    position="0 0 0"
                    animation="property: rotation; to: ${selectedSpecies.arModelRotation?.x || 0} ${(selectedSpecies.arModelRotation?.y || 0) + 360} ${selectedSpecies.arModelRotation?.z || 0}; loop: true; dur: 10000; easing: linear"
                  ></a-entity>

                  <!-- Optional: Add lighting -->
                  <a-light type="ambient" color="#BBB"></a-light>
                  <a-light type="directional" color="#FFF" intensity="0.6" position="-1 2 1"></a-light>
                </a-marker>
              </a-scene>
            `
          }}
        />
      ) : (
        <div className="flex items-center justify-center h-full">
          <div className="text-center text-white p-6 max-w-md">
            {!arReady ? (
              <>
                <div className="animate-spin rounded-full h-16 w-16 border-b-2 border-white mx-auto mb-4"></div>
                <p className="text-lg font-semibold">Loading AR...</p>
              </>
            ) : !hasARContent ? (
              <>
                <svg className="w-20 h-20 mx-auto mb-4 text-yellow-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
                </svg>
                <h3 className="text-xl font-bold mb-2">AR Content Not Available</h3>
                <p className="text-white/80 mb-4">
                  This species doesn&apos;t have AR content configured yet. Please upload:
                </p>
                <ul className="text-left text-white/70 space-y-2">
                  <li>• 3D Model (.glb file)</li>
                  <li>• AR Pattern (.patt file)</li>
                  <li>• Marker Image (for scanning)</li>
                </ul>
              </>
            ) : null}
          </div>
        </div>
      )}

      {/* Instructions */}
      {arReady && hasARContent && (
        <div className="absolute bottom-0 left-0 right-0 z-[10000] bg-gradient-to-t from-black/80 to-transparent p-4">
          <div className="text-white text-center">
            <p className="text-sm mb-2">📱 Point your camera at the marker to see the AR model</p>
            <div className="flex items-center justify-center gap-4 text-xs text-white/70">
              <span>🔍 Focus on marker</span>
              <span>💡 Good lighting</span>
              <span>📐 Keep marker flat</span>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
