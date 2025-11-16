import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import 'aframe'
import { SpeciesDetail } from '../data/mati-hotspots'
import { useData } from '../context/DataContext'

interface ARQRViewerProps {
  onClose: () => void
}

export default function ARQRViewer({ onClose }: ARQRViewerProps) {
  const { species } = useData()
  const [scanning, setScanning] = useState(true)
  const [detectedSpecies, setDetectedSpecies] = useState<SpeciesDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrReaderRef = useRef<HTMLDivElement>(null)

  // Add error boundary for AR rendering
  useEffect(() => {
    const handleError = (event: ErrorEvent) => {
      console.error('[ARQRViewer] Runtime error:', event.error)
      setError(`AR Error: ${event.error?.message || 'Unknown error'}`)
    }
    
    window.addEventListener('error', handleError)
    return () => window.removeEventListener('error', handleError)
  }, [])

  // Initialize QR scanner
  useEffect(() => {
    if (!scanning || !qrReaderRef.current) return

    let isActive = true
    const initScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        stream.getTracks().forEach(track => track.stop())
        setCameraPermission('granted')

        if (!isActive) return // Component unmounted

        // Initialize Html5Qrcode
        const scanner = new Html5Qrcode('qr-reader')
        scannerRef.current = scanner

        // Start scanning
        await scanner.start(
          { facingMode: 'environment' },
          {
            fps: 10,
            qrbox: { width: 250, height: 250 },
            aspectRatio: 1.0
          },
          (decodedText) => {
            if (isActive) {
              console.log('[ARQRViewer] QR Code detected:', decodedText)
              // Stop scanner immediately to prevent multiple detections
              scanner.stop().then(() => {
                if (isActive) {
                  handleQRCodeDetected(decodedText)
                }
              }).catch(() => {})
            }
          },
          (_errorMessage) => {
            // Scanning errors are expected, ignore
          }
        )
      } catch (err) {
        console.error('[ARQRViewer] Camera error:', err)
        if (isActive) {
          setCameraPermission('denied')
          setError('Camera access denied. Please allow camera access to use AR.')
        }
      }
    }

    initScanner()

    return () => {
      isActive = false
      // Cleanup scanner
      if (scannerRef.current) {
        scannerRef.current.stop().catch(() => {})
        scannerRef.current = null
      }
    }
  }, [scanning])

  const handleQRCodeDetected = (qrData: string) => {
    // Mark scanning as false
    setScanning(false)
    scannerRef.current = null

    // Parse QR data - expect species ID or URL containing species ID
    let speciesId = qrData.trim()
    
    // If QR contains URL, extract species ID from it
    if (qrData.includes('species-') || qrData.includes('/')) {
      const match = qrData.match(/species-[\w-]+/)
      if (match) {
        speciesId = match[0]
      } else {
        // Try to extract last part of URL
        const parts = qrData.split('/').filter(Boolean)
        if (parts.length > 0) {
          speciesId = parts[parts.length - 1]
        }
      }
    }

    console.log('[ARQRViewer] Looking for species with ID:', speciesId)
    console.log('[ARQRViewer] Available species IDs:', species.map(s => s.id).join(', '))

    // Find species by ID
    const foundSpecies = species.find(s => s.id === speciesId)
    
    if (foundSpecies) {
      console.log('[ARQRViewer] Species found:', foundSpecies.commonName)
      setDetectedSpecies(foundSpecies)
      setError(null)
    } else {
      console.error('[ARQRViewer] Species not found for ID:', speciesId)
      setError(`Species "${speciesId}" not found. Available: ${species.slice(0, 3).map(s => s.id).join(', ')}...`)
      setScanning(true) // Resume scanning
    }
  }

  const handleRescan = () => {
    setDetectedSpecies(null)
    setError(null)
    setScanning(true)
  }

  if (cameraPermission === 'denied') {
    return (
      <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
        <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md text-center">
          <svg className="w-16 h-16 mx-auto mb-4 text-red-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
          </svg>
          <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">Camera Access Required</h2>
          <p className="text-gray-600 dark:text-gray-400 mb-6">
            Please allow camera access in your browser settings to use AR features.
          </p>
          <button
            onClick={onClose}
            className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
          >
            Close AR
          </button>
        </div>
      </div>
    )
  }

  if (scanning) {
    return (
      <div className="fixed inset-0 bg-black z-50 flex flex-col">
        {/* Header */}
        <div className="bg-gradient-to-r from-blue-600 to-purple-600 text-white p-4">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <div>
              <h2 className="text-xl font-bold">Scan Species QR Code</h2>
              <p className="text-sm text-blue-100">Point camera at QR code</p>
            </div>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>

        {/* QR Scanner */}
        <div className="flex-1 flex items-center justify-center p-4 bg-gray-900">
          <div className="relative max-w-md w-full">
            <div id="qr-reader" ref={qrReaderRef} className="rounded-2xl overflow-hidden shadow-2xl"></div>
            
            {/* Scanning indicator */}
            <div className="absolute bottom-4 left-0 right-0 text-center">
              <div className="inline-block bg-blue-600 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="animate-pulse">📷 Scanning...</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 text-center">
            <p className="font-semibold">{error}</p>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 text-white p-6 text-center">
          <p className="text-sm max-w-2xl mx-auto mb-4">
            <strong>Instructions:</strong> Position the species QR code within the camera frame. 
            The AR experience will start automatically once detected.
          </p>
          
          {/* Debug: Test with first species */}
          {species.length > 0 && (
            <button
              onClick={() => {
                const testSpecies = species[0]
                console.log('[ARQRViewer] Testing with first species:', testSpecies.id)
                handleQRCodeDetected(testSpecies.id)
              }}
              className="px-4 py-2 bg-purple-600 hover:bg-purple-700 text-white rounded-lg text-sm transition-colors"
            >
              🧪 Skip QR - Test with {species[0]?.commonName || 'First Species'}
            </button>
          )}
        </div>
      </div>
    )
  }

  if (detectedSpecies) {
    // Debug: Log species data
    console.log('[ARQRViewer] Rendering AR for species:', {
      id: detectedSpecies.id,
      commonName: detectedSpecies.commonName,
      hasArModel: !!detectedSpecies.arModelUrl,
      arModelUrl: detectedSpecies.arModelUrl,
      hasImages: !!(detectedSpecies.images && detectedSpecies.images.length > 0),
      firstImage: detectedSpecies.images?.[0]
    })

    // Check if we have something to display
    const hasContent = detectedSpecies.arModelUrl || (detectedSpecies.images && detectedSpecies.images.length > 0)
    
    if (!hasContent) {
      return (
        <div className="fixed inset-0 bg-black z-50 flex items-center justify-center p-6">
          <div className="bg-white dark:bg-slate-800 rounded-2xl p-8 max-w-md text-center">
            <svg className="w-16 h-16 mx-auto mb-4 text-yellow-500" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 9v2m0 4h.01m-6.938 4h13.856c1.54 0 2.502-1.667 1.732-3L13.732 4c-.77-1.333-2.694-1.333-3.464 0L3.34 16c-.77 1.333.192 3 1.732 3z" />
            </svg>
            <h2 className="text-2xl font-bold text-gray-900 dark:text-white mb-2">No AR Content</h2>
            <p className="text-gray-600 dark:text-gray-400 mb-6">
              {detectedSpecies.commonName} doesn't have AR content yet. Please upload a 3D model or images in the Admin Panel.
            </p>
            <div className="flex gap-3 justify-center">
              <button
                onClick={handleRescan}
                className="px-6 py-3 bg-blue-600 hover:bg-blue-700 text-white rounded-xl font-semibold transition-colors"
              >
                🔄 Try Another
              </button>
              <button
                onClick={onClose}
                className="px-6 py-3 bg-gray-600 hover:bg-gray-700 text-white rounded-xl font-semibold transition-colors"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>
      )
    }

    // Render AR scene in a stable div to avoid React re-render issues
    return (
      <ARSceneRenderer
        species={detectedSpecies}
        onClose={onClose}
        onRescan={handleRescan}
      />
    )
  }

  return null
}

// Separate component to render A-Frame scene without React interference
function ARSceneRenderer({ species, onClose, onRescan }: { 
  species: SpeciesDetail
  onClose: () => void 
  onRescan: () => void
}) {
  const sceneContainerRef = useRef<HTMLDivElement>(null)
  const [arReady, setArReady] = useState(false)

  useEffect(() => {
    if (!sceneContainerRef.current) return

    // Wait for A-Frame to be ready
    const initAR = () => {
      if (!sceneContainerRef.current) return

      // Create A-Frame scene HTML as string
      const arSceneHTML = `
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: true; detectionMode: mono_and_matrix; matrixCodeType: 3x3; trackingMethod: best;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; precision: medium; antialias: true; colorManagement: true;"
          loading-screen="enabled: false"
          device-orientation-permission-ui="enabled: false">
          
          <a-entity camera look-controls-enabled="false" wasd-controls-enabled="false"></a-entity>
          
          <a-marker preset="hiro" emitevents="true">
            ${species.arModelUrl ? `
              <a-entity
                gltf-model="url(${species.arModelUrl})"
                scale="0.5 0.5 0.5"
                rotation="0 0 0"
                position="0 0 0"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear">
              </a-entity>
            ` : species.images && species.images[0] ? `
              <a-plane
                src="${species.images[0]}"
                width="1"
                height="0.75"
                rotation="-90 0 0"
                position="0 0 0">
              </a-plane>
            ` : ''}
            
            <a-entity position="0 1.5 0">
              <a-plane color="#ffffff" width="2" height="0.6" opacity="0.9"></a-plane>
              <a-text
                value="${species.commonName.replace(/"/g, '&quot;')}"
                align="center"
                width="1.8"
                color="#000000"
                position="0 0.1 0.01">
              </a-text>
              <a-text
                value="${species.scientificName.replace(/"/g, '&quot;')}"
                align="center"
                width="1.6"
                color="#666666"
                position="0 -0.1 0.01"
                scale="0.7 0.7 0.7">
              </a-text>
            </a-entity>
          </a-marker>
        </a-scene>
      `

      // Inject A-Frame scene HTML directly to avoid React re-render issues
      sceneContainerRef.current.innerHTML = arSceneHTML

      // Wait for scene to initialize
      setTimeout(() => {
        const scene = sceneContainerRef.current?.querySelector('a-scene')
        if (scene) {
          console.log('[ARQRViewer] A-Frame scene initialized')
          
          // Listen for AR.js events
          ;(scene as any).addEventListener('arjs-video-loaded', () => {
            console.log('[ARQRViewer] AR camera loaded')
            setArReady(true)
          })
          
          ;(scene as any).addEventListener('camera-error', (error: any) => {
            console.error('[ARQRViewer] Camera error:', error)
          })
        }
      }, 100)
    }

    // Initialize after a short delay to ensure DOM is ready
    const timeoutId = setTimeout(initAR, 100)

    // Cleanup: remove scene when component unmounts
    return () => {
      clearTimeout(timeoutId)
      if (sceneContainerRef.current) {
        try {
          const scene = sceneContainerRef.current.querySelector('a-scene')
          if (scene) {
            // Remove camera and video streams first
            const video = scene.querySelector('video')
            if (video && video.srcObject) {
              const stream = video.srcObject as MediaStream
              stream.getTracks().forEach(track => track.stop())
            }
            // Clear the container
            sceneContainerRef.current.innerHTML = ''
          }
        } catch (e) {
          // Ignore cleanup errors
          console.warn('[ARQRViewer] Cleanup warning:', e)
        }
      }
    }
  }, [species.id])

  return (
    <div className="fixed inset-0 bg-black z-50">
      {/* A-Frame AR Scene Container */}
      <div ref={sceneContainerRef} className="w-full h-full" />

      {/* A-Frame AR Scene Container */}
      <div ref={sceneContainerRef} className="w-full h-full" />

      {/* UI Overlay */}
      <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10 pointer-events-none">
        <div className="flex items-center justify-between max-w-screen-xl mx-auto">
          <div className="text-white">
            <h2 className="text-lg font-bold">{species.commonName}</h2>
            <p className="text-sm text-gray-300">{species.scientificName}</p>
          </div>
          <div className="flex gap-2 pointer-events-auto">
            <button
              onClick={onRescan}
              className="px-4 py-2 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-colors"
            >
              🔄 Rescan
            </button>
            <button
              onClick={onClose}
              className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors"
            >
              ✕ Close
            </button>
          </div>
        </div>
      </div>

      {/* Instructions overlay at bottom */}
      <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-10 text-center pointer-events-none">
        {!arReady && (
          <div className="bg-yellow-600/90 text-white px-4 py-2 rounded-lg inline-block mb-2">
            <p className="text-sm font-semibold">📷 Initializing AR camera...</p>
          </div>
        )}
        <p className="text-white text-sm max-w-2xl mx-auto">
          <strong>Point your camera at a HIRO marker</strong> to see the {species.commonName} in AR.
          {!species.arModelUrl && ' (Using fallback image - no 3D model available)'}
        </p>
        <a 
          href="https://github.com/jeromeetienne/AR.js/blob/master/data/images/hiro.png" 
          target="_blank" 
          rel="noopener noreferrer"
          className="inline-block mt-2 text-blue-400 hover:text-blue-300 underline text-sm pointer-events-auto"
        >
          Download HIRO marker →
        </a>
        <p className="text-gray-300 text-xs mt-2">
          Camera feed should appear automatically. If black screen persists, refresh the page.
        </p>
      </div>
    </div>
  )
}
