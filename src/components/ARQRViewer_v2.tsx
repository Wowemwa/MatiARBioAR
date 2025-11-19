import { useEffect, useRef, useState } from 'react'
import { Html5Qrcode } from 'html5-qrcode'
import 'aframe'
import { SpeciesDetail } from '../data/mati-hotspots'
import { useData } from '../context/DataContext'

// A-Frame JSX type declarations
/* eslint-disable @typescript-eslint/no-namespace */
declare global {
  namespace JSX {
    interface IntrinsicElements {
      'a-scene': any
      'a-entity': any
      'a-marker': any
      'a-plane': any
      'a-text': any
      'a-box': any
      'a-sphere': any
      'a-cylinder': any
      'a-sky': any
      'a-camera': any
      'a-light': any
    }
  }
}
/* eslint-enable @typescript-eslint/no-namespace */

interface ARQRViewerProps {
  onClose: () => void
}

/**
 * AR QR Viewer with Proper Marker-Based Tracking
 * 
 * This component implements true marker-based AR using MindAR:
 * 1. Scans QR code to identify species
 * 2. Uses image tracking to anchor 3D model to printed marker
 * 3. Continuously tracks marker position for stable AR rendering
 */
export default function ARQRViewer({ onClose }: ARQRViewerProps) {
  const { species } = useData()
  const [scanning, setScanning] = useState(true)
  const [detectedSpecies, setDetectedSpecies] = useState<SpeciesDetail | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [cameraPermission, setCameraPermission] = useState<'pending' | 'granted' | 'denied'>('pending')
  const [arReady, setArReady] = useState(false)
  const scannerRef = useRef<Html5Qrcode | null>(null)
  const qrReaderRef = useRef<HTMLDivElement>(null)
  const sceneRef = useRef<any>(null)

  // Initialize QR scanner
  useEffect(() => {
    if (!scanning || !qrReaderRef.current) return

    const initScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ 
          video: { facingMode: 'environment' } 
        })
        stream.getTracks().forEach(track => track.stop())
        setCameraPermission('granted')

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
            console.log('[ARQRViewer] QR Code detected:', decodedText)
            handleQRCodeDetected(decodedText)
          },
          (_errorMessage) => {
            // Scanning errors are expected and frequent
          }
        )
      } catch (err) {
        console.error('[ARQRViewer] Camera error:', err)
        setCameraPermission('denied')
        setError('Camera access denied. Please allow camera access to use AR.')
      }
    }

    initScanner()

    return () => {
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error('Failed to stop scanner:', err))
      }
    }
  }, [scanning])

  // Initialize AR scene when species is detected
  useEffect(() => {
    if (!detectedSpecies || arReady) return

    const initAR = async () => {
      try {
        // Wait for A-Frame and MindAR to be ready
        await new Promise(resolve => {
          if (document.querySelector('a-scene')) {
            const scene = document.querySelector('a-scene')!
            if ((scene as any).hasLoaded) {
              resolve(true)
            } else {
              scene.addEventListener('loaded', () => resolve(true))
            }
          } else {
            setTimeout(resolve, 1000)
          }
        })

        setArReady(true)
        console.log('[ARQRViewer] AR scene initialized')
      } catch (err) {
        console.error('[ARQRViewer] AR initialization error:', err)
        setError('Failed to initialize AR. Please try again.')
      }
    }

    initAR()
  }, [detectedSpecies, arReady])

  const handleQRCodeDetected = (qrData: string) => {
    // Stop scanning
    setScanning(false)
    if (scannerRef.current) {
      scannerRef.current.stop().catch(err => console.error('Failed to stop scanner:', err))
    }

    // Parse QR data - expect species ID or URL containing species ID
    let speciesId = qrData
    
    // If QR contains URL, extract species ID
    if (qrData.includes('species')) {
      const match = qrData.match(/species[-_][\w-]+/i) || qrData.match(/[\w-]+$/)
      if (match) {
        speciesId = match[0].replace(/species[-_]/i, '')
      }
    }

    // Find species by ID
    const foundSpecies = species.find(s => 
      s.id === speciesId || 
      s.id === `species-${speciesId}` ||
      s.commonName.toLowerCase().replace(/\s+/g, '-') === speciesId.toLowerCase()
    )
    
    if (foundSpecies) {
      console.log('[ARQRViewer] Species found:', foundSpecies.commonName)
      setDetectedSpecies(foundSpecies)
      setError(null)
    } else {
      console.error('[ARQRViewer] Species not found for ID:', speciesId)
      setError(`Species not found. Scanned: ${speciesId}`)
      setScanning(true)
    }
  }

  const handleRescan = () => {
    setDetectedSpecies(null)
    setError(null)
    setArReady(false)
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
        <div className="bg-gradient-to-r from-emerald-600 to-teal-600 text-white p-4">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <div>
              <h2 className="text-xl font-bold">🔍 Scan Species QR Code</h2>
              <p className="text-sm text-emerald-100">Point camera at QR code marker</p>
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
              <div className="inline-block bg-emerald-600 text-white px-6 py-3 rounded-full shadow-lg">
                <span className="animate-pulse">📷 Scanning...</span>
              </div>
            </div>
          </div>
        </div>

        {error && (
          <div className="bg-red-500 text-white p-4 text-center">
            <p className="font-semibold">{error}</p>
            <button onClick={handleRescan} className="mt-2 underline">Try Again</button>
          </div>
        )}

        {/* Instructions */}
        <div className="bg-gray-800 text-white p-6 text-center">
          <p className="text-sm max-w-2xl mx-auto">
            <strong>Step 1:</strong> Scan the QR code on the species information card. 
            Once detected, point your camera at the <strong>AR marker image</strong> to see the 3D model.
          </p>
        </div>
      </div>
    )
  }

  if (detectedSpecies) {
    // Determine model URL (use GLB from Supabase or fallback)
    const modelUrl = detectedSpecies.arModelUrl || '/models/fallback-cube.glb'
    const hasModel = !!detectedSpecies.arModelUrl

    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* MindAR Image Tracking Scene */}
        <a-scene
          ref={sceneRef}
          mindar-image={`imageTargetSrc: /ar-targets/${detectedSpecies.id}-target.mind; autoStart: true; uiLoading: no; uiError: no; uiScanning: no;`}
          color-space="sRGB"
          renderer="colorManagement: true; physicallyCorrectLights: true; precision: medium;"
          vr-mode-ui="enabled: false"
          device-orientation-permission-ui="enabled: false"
        >
          {/* Camera */}
          <a-entity camera look-controls-enabled="false" position="0 0 0"></a-entity>

          {/* Image target with 3D model */}
          <a-entity mindar-image-target="targetIndex: 0">
            {hasModel ? (
              // Render actual GLB model
              <a-entity
                gltf-model={modelUrl}
                scale={`${detectedSpecies.arModelScale || 1} ${detectedSpecies.arModelScale || 1} ${detectedSpecies.arModelScale || 1}`}
                rotation="0 0 0"
                position="0 0 0"
                animation__rotate="property: rotation; to: 0 360 0; loop: true; dur: 8000; easing: linear"
                shadow="cast: true; receive: true"
              />
            ) : (
              // Fallback: Show species image as textured plane
              <a-plane
                src={detectedSpecies.images?.[0] || ''}
                width="1"
                height="1"
                rotation="-90 0 0"
                position="0 0 0"
                opacity="0.95"
              />
            )}

            {/* Info card above model */}
            <a-entity position="0 0.6 0" look-at="[camera]">
              <a-plane
                color="#ffffff"
                width="1.5"
                height="0.4"
                opacity="0.95"
                shader="flat"
              />
              <a-text
                value={detectedSpecies.commonName}
                align="center"
                width="1.4"
                color="#000000"
                position="0 0.05 0.01"
              />
              <a-text
                value={detectedSpecies.scientificName}
                align="center"
                width="1.2"
                color="#555555"
                position="0 -0.05 0.01"
                scale="0.7 0.7 0.7"
              />
            </a-entity>
          </a-entity>
        </a-scene>

        {/* UI Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/80 to-transparent p-4 z-10">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <div className="text-white">
              <h2 className="text-lg font-bold flex items-center gap-2">
                {detectedSpecies.commonName}
                {hasModel && <span className="text-xs bg-emerald-500 px-2 py-1 rounded-full">3D Model</span>}
                {!hasModel && <span className="text-xs bg-amber-500 px-2 py-1 rounded-full">Image Only</span>}
              </h2>
              <p className="text-sm text-gray-300">{detectedSpecies.scientificName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRescan}
                className="px-4 py-2 bg-emerald-600 hover:bg-emerald-700 text-white rounded-lg transition-colors text-sm"
              >
                🔄 Rescan
              </button>
              <button
                onClick={onClose}
                className="px-4 py-2 bg-white/20 hover:bg-white/30 text-white rounded-lg transition-colors text-sm"
              >
                ✕ Close
              </button>
            </div>
          </div>
        </div>

        {/* Instructions overlay at bottom */}
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/80 to-transparent p-6 z-10">
          <div className="max-w-2xl mx-auto">
            {!arReady ? (
              <div className="text-center text-white">
                <div className="inline-block animate-spin rounded-full h-8 w-8 border-4 border-white border-t-transparent mb-2"></div>
                <p className="text-sm">Initializing AR...</p>
              </div>
            ) : (
              <div className="text-center">
                <p className="text-white text-sm mb-2">
                  <strong>📸 Point camera at the species marker image</strong> to see the {detectedSpecies.commonName} in AR.
                </p>
                <p className="text-gray-300 text-xs">
                  {hasModel 
                    ? 'The 3D model will appear when the marker is detected and will stay anchored to it.'
                    : 'No 3D model available - displaying photo instead. Upload a .glb file in Admin Panel.'}
                </p>
                {!hasModel && (
                  <a 
                    href="https://github.com/hiukim/mind-ar-js#compile-image-targets" 
                    target="_blank" 
                    rel="noopener noreferrer"
                    className="inline-block mt-2 text-emerald-400 hover:text-emerald-300 underline text-xs"
                  >
                    Learn how to create AR markers →
                  </a>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    )
  }

  return null
}
