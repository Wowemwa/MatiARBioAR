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

  // Initialize QR scanner
  useEffect(() => {
    if (!scanning || !qrReaderRef.current) return

    const initScanner = async () => {
      try {
        // Request camera permission
        const stream = await navigator.mediaDevices.getUserMedia({ video: { facingMode: 'environment' } })
        stream.getTracks().forEach(track => track.stop()) // Stop the stream after checking permission
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
          (errorMessage) => {
            // Scanning errors are expected and frequent, don't log them
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
      // Cleanup scanner
      if (scannerRef.current) {
        scannerRef.current.stop().catch(err => console.error('Failed to stop scanner:', err))
      }
    }
  }, [scanning])

  const handleQRCodeDetected = (qrData: string) => {
    // Stop scanning
    setScanning(false)
    if (scannerRef.current) {
      scannerRef.current.stop().catch(err => console.error('Failed to stop scanner:', err))
    }

    // Parse QR data - expect species ID or URL containing species ID
    let speciesId = qrData
    
    // If QR contains URL, extract species ID from it
    if (qrData.includes('species-')) {
      const match = qrData.match(/species-[\w-]+/)
      if (match) {
        speciesId = match[0]
      }
    }

    // Find species by ID
    const foundSpecies = species.find(s => s.id === speciesId)
    
    if (foundSpecies) {
      console.log('[ARQRViewer] Species found:', foundSpecies.commonName)
      setDetectedSpecies(foundSpecies)
      setError(null)
    } else {
      console.error('[ARQRViewer] Species not found for ID:', speciesId)
      setError(`Species not found. QR code: ${speciesId}`)
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
          <p className="text-sm max-w-2xl mx-auto">
            <strong>Instructions:</strong> Position the species QR code within the camera frame. 
            The AR experience will start automatically once detected.
          </p>
        </div>
      </div>
    )
  }

  if (detectedSpecies) {
    return (
      <div className="fixed inset-0 bg-black z-50">
        {/* A-Frame AR Scene */}
        <a-scene
          embedded
          arjs="sourceType: webcam; debugUIEnabled: false; detectionMode: mono_and_matrix; matrixCodeType: 3x3;"
          vr-mode-ui="enabled: false"
          renderer="logarithmicDepthBuffer: true; precision: medium;"
        >
          {/* Camera */}
          <a-entity camera look-controls-enabled="false"></a-entity>

          {/* AR Marker - using pattern marker */}
          <a-marker preset="hiro" emitevents="true">
            {/* Render 3D model if available */}
            {detectedSpecies.arModelUrl && (
              <a-entity
                gltf-model={`url(${detectedSpecies.arModelUrl})`}
                scale="0.5 0.5 0.5"
                rotation="0 0 0"
                position="0 0 0"
                animation="property: rotation; to: 0 360 0; loop: true; dur: 10000; easing: linear"
              />
            )}

            {/* Fallback: Render image plane if no 3D model */}
            {!detectedSpecies.arModelUrl && detectedSpecies.images && detectedSpecies.images[0] && (
              <a-plane
                src={detectedSpecies.images[0]}
                width="1"
                height="0.75"
                rotation="-90 0 0"
                position="0 0 0"
              />
            )}

            {/* Info card floating above */}
            <a-entity position="0 1.5 0">
              <a-plane
                color="#ffffff"
                width="2"
                height="0.6"
                opacity="0.9"
              />
              <a-text
                value={detectedSpecies.commonName}
                align="center"
                width="1.8"
                color="#000000"
                position="0 0.1 0.01"
              />
              <a-text
                value={detectedSpecies.scientificName}
                align="center"
                width="1.6"
                color="#666666"
                position="0 -0.1 0.01"
                scale="0.7 0.7 0.7"
              />
            </a-entity>
          </a-marker>
        </a-scene>

        {/* UI Overlay */}
        <div className="absolute top-0 left-0 right-0 bg-gradient-to-b from-black/70 to-transparent p-4 z-10">
          <div className="flex items-center justify-between max-w-screen-xl mx-auto">
            <div className="text-white">
              <h2 className="text-lg font-bold">{detectedSpecies.commonName}</h2>
              <p className="text-sm text-gray-300">{detectedSpecies.scientificName}</p>
            </div>
            <div className="flex gap-2">
              <button
                onClick={handleRescan}
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
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-6 z-10 text-center">
          <p className="text-white text-sm max-w-2xl mx-auto">
            <strong>Point your camera at a HIRO marker</strong> to see the {detectedSpecies.commonName} in AR. 
            {!detectedSpecies.arModelUrl && ' (Using fallback image - no 3D model available)'}
          </p>
          <a 
            href="https://github.com/jeromeetienne/AR.js/blob/master/data/images/hiro.png" 
            target="_blank" 
            rel="noopener noreferrer"
            className="inline-block mt-2 text-blue-400 hover:text-blue-300 underline text-sm"
          >
            Download HIRO marker →
          </a>
        </div>
      </div>
    )
  }

  return null
}
