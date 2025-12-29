import { useEffect, useState, Suspense, useRef } from 'react'
import { useLoader, useFrame, useThree } from '@react-three/fiber'
import { TextureLoader, BackSide, Euler, Quaternion, Vector3 } from 'three'
import { PanoramaControls } from 'three-panorama-controls/react'
import { Html, useGLTF } from '@react-three/drei'
import type { PanoramaMarker, PanoramaSceneProps } from '../types/panorama'

function GLBModel({ url }: { url: string }) {
  console.log('Attempting to load GLB from:', url)
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={2} />
}

function LinkItem({ link, onClick, targetPanorama }: { link: any, onClick?: (link: any) => void, targetPanorama?: any }) {
  const [hovered, setHovered] = useState(false)
  const [showTooltip, setShowTooltip] = useState(false)
  const [typedLabel, setTypedLabel] = useState('')
  const [typedSubtext, setTypedSubtext] = useState('')
  const meshRef = useRef<any>()
  const tooltipTimeoutRef = useRef<any>()
  const typingTimeoutRef = useRef<any>()

  const handleClick = (e: any) => {
    e.stopPropagation()
    console.log('Link clicked:', link)
    onClick?.(link)
  }

  const handlePointerOver = (e: any) => {
    e.stopPropagation()
    if (!hovered) {
      setHovered(true)
      document.body.style.cursor = 'pointer'
      
      // Show tooltip after 500ms delay
      tooltipTimeoutRef.current = setTimeout(() => {
        setShowTooltip(true)
        
        // Start typing animation for label
        const fullLabel = link.label || 'Navigate'
        let i = 0
        const typeLabel = () => {
          if (i < fullLabel.length) {
            setTypedLabel(fullLabel.substring(0, i + 1))
            i++
            typingTimeoutRef.current = setTimeout(typeLabel, 50)
          } else {
            // After label is done, type subtext
            if (targetPanorama) {
              const subtext = `→ ${targetPanorama.title}`
              let j = 0
              const typeSubtext = () => {
                if (j < subtext.length) {
                  setTypedSubtext(subtext.substring(0, j + 1))
                  j++
                  typingTimeoutRef.current = setTimeout(typeSubtext, 30)
                }
              }
              typeSubtext()
            }
          }
        }
        typeLabel()
      }, 500)
    }
  }

  const handlePointerOut = (e: any) => {
    e.stopPropagation()
    if (hovered) {
      setHovered(false)
      setShowTooltip(false)
      setTypedLabel('')
      setTypedSubtext('')
      document.body.style.cursor = 'auto'
      
      // Clear all timeouts
      if (tooltipTimeoutRef.current) {
        clearTimeout(tooltipTimeoutRef.current)
      }
      if (typingTimeoutRef.current) {
        clearTimeout(typingTimeoutRef.current)
      }
    }
  }

  // Cleanup on unmount
  useEffect(() => {
    return () => {
      if (tooltipTimeoutRef.current) clearTimeout(tooltipTimeoutRef.current)
      if (typingTimeoutRef.current) clearTimeout(typingTimeoutRef.current)
    }
  }, [])

  return (
    <group position={[link.position_x, link.position_y, link.position_z]} rotation={[0, link.rotation || 0, 0]}>
      {/* Invisible larger collision box to stabilize hover detection */}
      <mesh
        ref={meshRef}
        onClick={handleClick}
        onPointerOver={handlePointerOver}
        onPointerOut={handlePointerOut}
      >
        <boxGeometry args={[1.2, 2, 1.2]} />
        <meshBasicMaterial visible={false} />
      </mesh>

      {/* Navigation Arrow - Google Street Map Style - Base circle */}
      <mesh position={[0, 0, 0]} rotation={[Math.PI / 2, 0, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.15, 32]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={hovered ? 1.0 : 0.9}
          emissive="#3b82f6"
          emissiveIntensity={hovered ? 0.6 : 0.4}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Arrow shaft */}
      <mesh position={[0, 0.5, 0]}>
        <cylinderGeometry args={[0.18, 0.18, 1.0, 16]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={hovered ? 1.0 : 0.95}
          emissive="#3b82f6"
          emissiveIntensity={hovered ? 0.7 : 0.5}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Arrow cone on top - Pointing up */}
      <mesh position={[0, 1.0, 0]}>
        <coneGeometry args={[0.4, 0.6, 16]} />
        <meshStandardMaterial 
          color="#60a5fa" 
          transparent 
          opacity={hovered ? 1.0 : 0.95}
          emissive="#3b82f6"
          emissiveIntensity={hovered ? 0.8 : 0.6}
          metalness={0.1}
          roughness={0.2}
        />
      </mesh>

      {/* Subtle glow effect - Static, just changes opacity */}
      <mesh>
        <sphereGeometry args={[1.1, 16, 16]} />
        <meshBasicMaterial 
          color="#3b82f6" 
          transparent 
          opacity={hovered ? 0.25 : 0.15} 
        />
      </mesh>

      {/* Label - Google Street Map Style with Delayed Appearance and Typing Animation */}
      {showTooltip && (
        <Html 
          position={[0, -1.5, 0]} 
          center 
          style={{ pointerEvents: 'none', userSelect: 'none' }}
          zIndexRange={[100, 0]}
        >
          <div className="bg-white text-gray-800 px-4 py-2.5 rounded-lg text-sm whitespace-nowrap shadow-2xl border border-gray-200 animate-in fade-in slide-in-from-top-2 duration-300">
            <div className="font-semibold flex items-center gap-2">
              <svg className="w-4 h-4 text-blue-600 animate-pulse" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 7l5 5m0 0l-5 5m5-5H6" />
              </svg>
              <span className="font-mono">{typedLabel}<span className="animate-pulse">|</span></span>
            </div>
            {targetPanorama && typedSubtext && (
              <div className="text-[11px] text-gray-600 mt-1 font-mono">{typedSubtext}<span className="animate-pulse">|</span></div>
            )}
            <div className="text-[10px] text-gray-500 mt-1.5 italic">Click to travel</div>
          </div>
        </Html>
      )}
    </group>
  )
}

function MarkerItem({ marker, onClick }: { marker: PanoramaMarker, onClick?: (m: PanoramaMarker) => void }) {
  const [showModel, setShowModel] = useState(false)
  const [hovered, setHovered] = useState(false)

  useEffect(() => {
    if (marker.model_url) {
      console.log('Marker has model URL:', marker.model_url)
    }
  }, [marker.model_url])

  const handleClick = (e: any) => {
    e.stopPropagation()
    if (marker.model_url) {
      setShowModel(!showModel)
    }
    onClick?.(marker)
  }

  return (
    <group position={[marker.position_x, marker.position_y, marker.position_z]}>
      {/* Marker Sphere/Icon */}
      <mesh 
        onClick={handleClick}
        onPointerOver={(e) => {
          e.stopPropagation()
          setHovered(true)
          document.body.style.cursor = 'pointer'
        }}
        onPointerOut={(e) => {
          e.stopPropagation()
          setHovered(false)
          document.body.style.cursor = 'auto'
        }}
      >
        <sphereGeometry args={[0.3, 16, 16]} />
        <meshBasicMaterial 
          color={marker.model_url ? "#22c55e" : "#ef4444"} 
          transparent 
          opacity={0.8} 
        />
      </mesh>

      {/* 3D Model */}
      {showModel && marker.model_url && (
        <group position={[0, 0.5, 0]}>
          <Suspense fallback={<Html><div className="text-white text-xs">Loading...</div></Html>}>
            <GLBModel url={marker.model_url} />
          </Suspense>
        </group>
      )}

      {/* Label */}
      {(hovered || showModel) && (
        <Html position={[0, -0.4, 0]} center>
          <div className="bg-black/80 text-white px-3 py-1.5 rounded-lg text-sm whitespace-nowrap backdrop-blur-sm border border-white/20">
            <div className="font-medium">{marker.title}</div>
            {showModel && <div className="text-[10px] text-gray-300 mt-0.5">Click to hide model</div>}
            {!showModel && marker.model_url && <div className="text-[10px] text-green-300 mt-0.5">Click to view 3D</div>}
          </div>
        </Html>
      )}
    </group>
  )
}

// Custom hook for progressive image loading with progress tracking
function useProgressiveLoader(imageUrl: string, onProgress?: (progress: number) => void) {
  const [texture, setTexture] = useState<any>(null)
  const [progress, setProgress] = useState(0)
  const [error, setError] = useState<string | null>(null)
  
  useEffect(() => {
    const loader = new TextureLoader()
    
    loader.load(
      imageUrl,
      (loadedTexture) => {
        setTexture(loadedTexture)
        setProgress(100)
        onProgress?.(100)
      },
      (xhr) => {
        if (xhr.lengthComputable) {
          const percentComplete = (xhr.loaded / xhr.total) * 100
          setProgress(percentComplete)
          onProgress?.(percentComplete)
        }
      },
      (err) => {
        console.error('Error loading panorama:', err)
        setError('Failed to load panorama image')
      }
    )
  }, [imageUrl, onProgress])
  
  return { texture, progress, error }
}

export default function PanoramaScene({ 
  imageUrl, 
  audioUrl,
  onDebugUpdate = () => {}, 
  calibrationOffsets = { alpha: 0, beta: 0, gamma: 0 }, 
  shouldRecalibrate = false, 
  onRecalibrateDone = () => {}, 
  setCalibrationOffsets = () => {}, 
  gyroEnabled = false, 
  onLoadComplete = () => {},
  onSceneClick,
  markers = [],
  onMarkerClick,
  links = [],
  onLinkClick,
  allPanoramas = []
}: PanoramaSceneProps) {
  const { camera } = useThree()
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false)
  const [loadingProgress, setLoadingProgress] = useState(0)
  const controlsRef = useRef<any>(null)
  const [isUserInteracting, setIsUserInteracting] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const interactionTimeoutRef = useRef<any>(null)
  
  // Use progressive loading
  const { texture, progress, error } = useProgressiveLoader(imageUrl, setLoadingProgress)

  // Auto-pan rotation when not interacting
  useFrame((state, delta) => {
    // Auto-rotate when not interacting
    if (!isUserInteracting && !gyroEnabled && camera && controlsRef.current) {
      camera.rotation.y += delta * 0.05 // Slow rotation speed
    }
  })

  // Track user interaction
  useEffect(() => {
    const handleInteractionStart = () => {
      setIsUserInteracting(true)
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }

    const handleInteractionEnd = () => {
      // Resume auto-pan after 3 seconds of no interaction
      interactionTimeoutRef.current = setTimeout(() => {
        setIsUserInteracting(false)
      }, 3000)
    }

    window.addEventListener('mousedown', handleInteractionStart)
    window.addEventListener('touchstart', handleInteractionStart)
    window.addEventListener('mouseup', handleInteractionEnd)
    window.addEventListener('touchend', handleInteractionEnd)
    window.addEventListener('wheel', handleInteractionStart)

    return () => {
      window.removeEventListener('mousedown', handleInteractionStart)
      window.removeEventListener('touchstart', handleInteractionStart)
      window.removeEventListener('mouseup', handleInteractionEnd)
      window.removeEventListener('touchend', handleInteractionEnd)
      window.removeEventListener('wheel', handleInteractionStart)
      if (interactionTimeoutRef.current) {
        clearTimeout(interactionTimeoutRef.current)
      }
    }
  }, [])

  // Audio playback - continues across panorama navigation within same site
  useEffect(() => {
    console.log('[Audio Playback] Effect triggered. audioUrl:', audioUrl, 'texture loaded:', !!texture)
    
    if (audioUrl && texture) {
      // Only create/update if URL changed or audio doesn't exist
      if (!audioRef.current || audioRef.current.src !== audioUrl) {
        console.log('[Audio Playback] Creating/updating audio element')
        
        // Pause old audio if changing to different audio
        if (audioRef.current && audioRef.current.src !== audioUrl) {
          audioRef.current.pause()
          audioRef.current.currentTime = 0
        }
        
        // Create or update audio element
        if (!audioRef.current) {
          audioRef.current = new Audio(audioUrl)
          audioRef.current.loop = true
          audioRef.current.volume = 0.3 // 30% volume
        } else {
          audioRef.current.src = audioUrl
        }

        // Play audio
        audioRef.current.play().catch(err => {
          console.log('Audio autoplay blocked, waiting for user interaction:', err)
          // Browser blocked autoplay, wait for user interaction
          const playOnInteraction = () => {
            audioRef.current?.play().catch(e => console.error('Audio play error:', e))
            window.removeEventListener('click', playOnInteraction)
            window.removeEventListener('touchstart', playOnInteraction)
          }
          window.addEventListener('click', playOnInteraction, { once: true })
          window.addEventListener('touchstart', playOnInteraction, { once: true })
        })
      }
    } else if (!audioUrl && audioRef.current) {
      // Stop audio if no audio URL (switched to site without audio)
      audioRef.current.pause()
      audioRef.current.currentTime = 0
    }

    // Cleanup audio only on unmount (not on panorama change)
    return () => {
      if (audioRef.current && !audioUrl) {
        audioRef.current.pause()
        audioRef.current.currentTime = 0
      }
    }
  }, [audioUrl, texture])

  // Listen for reset view event
  useEffect(() => {
    const handleReset = () => {
      camera.rotation.set(0, 0, 0)
      camera.quaternion.set(0, 0, 0, 1)
      if (controlsRef.current?.reset) {
        controlsRef.current.reset()
      }
    }
    
    window.addEventListener('resetPanoramaView', handleReset)
    return () => window.removeEventListener('resetPanoramaView', handleReset)
  }, [camera])

  // Mark texture as loaded and trigger callback
  useEffect(() => {
    if (texture && progress === 100) {
      onLoadComplete()
    }
  }, [texture, progress, onLoadComplete])

  const [deviceOrientation, setDeviceOrientation] = useState<{ alpha: number | null, beta: number | null, gamma: number | null }>({
    alpha: null,
    beta: null,
    gamma: null
  })

  // Recalibrate gyroscope
  const recalibrateGyroscope = () => {
    if (deviceOrientation.alpha !== null && deviceOrientation.beta !== null && deviceOrientation.gamma !== null) {
      setCalibrationOffsets({
        alpha: deviceOrientation.alpha,
        beta: deviceOrientation.beta,
        gamma: deviceOrientation.gamma
      })
    }
  }

  // Handle recalibration trigger
  useEffect(() => {
    if (shouldRecalibrate) {
      recalibrateGyroscope()
      onRecalibrateDone()
    }
  }, [shouldRecalibrate, deviceOrientation, setCalibrationOffsets, onRecalibrateDone])

  // Request gyroscope permission when component mounts
  useEffect(() => {
    const requestGyroscopePermission = async () => {
      if (typeof DeviceOrientationEvent !== 'undefined' &&
          typeof (DeviceOrientationEvent as any).requestPermission === 'function') {
        try {
          const permission = await (DeviceOrientationEvent as any).requestPermission()
          if (permission === 'granted') {
            setGyroscopeEnabled(true)
          }
        } catch (error) {
          console.error('Error requesting gyroscope permission:', error)
        }
      } else {
        setGyroscopeEnabled(true)
      }
    }

    requestGyroscopePermission()
  }, [])

  // Auto-calibrate on first device orientation reading
  const [hasAutoCalibrated, setHasAutoCalibrated] = useState(false)
  useEffect(() => {
    if (!hasAutoCalibrated && gyroscopeEnabled && deviceOrientation.alpha !== null && deviceOrientation.beta !== null && deviceOrientation.gamma !== null) {
      setCalibrationOffsets({
        alpha: deviceOrientation.alpha,
        beta: deviceOrientation.beta,
        gamma: deviceOrientation.gamma
      })
      setHasAutoCalibrated(true)
    }
  }, [gyroscopeEnabled, deviceOrientation, hasAutoCalibrated, setCalibrationOffsets])

  // Handle device orientation changes
  useEffect(() => {
    if (!gyroscopeEnabled) {
      onDebugUpdate({ gyroscopeEnabled: false, deviceOrientation: null })
      return
    }

    const handleDeviceOrientation = (event: DeviceOrientationEvent) => {
      const orientation = {
        alpha: event.alpha,
        beta: event.beta,
        gamma: event.gamma
      }
      setDeviceOrientation(orientation)
      onDebugUpdate({ gyroscopeEnabled: true, deviceOrientation: orientation })
    }

    window.addEventListener('deviceorientation', handleDeviceOrientation)

    return () => {
      window.removeEventListener('deviceorientation', handleDeviceOrientation)
    }
  }, [gyroscopeEnabled, onDebugUpdate])

  // Apply device orientation to camera
  useFrame(() => {
    if (!gyroEnabled || !gyroscopeEnabled || !deviceOrientation.alpha || !deviceOrientation.beta || !deviceOrientation.gamma) return

    const alpha = ((deviceOrientation.alpha - calibrationOffsets.alpha) * Math.PI) / 180
    const beta = ((deviceOrientation.beta - calibrationOffsets.beta) * Math.PI) / 180
    const gamma = ((deviceOrientation.gamma - calibrationOffsets.gamma) * Math.PI) / 180

    const euler = new Euler(beta, alpha, -gamma, 'YXZ')
    const quaternion = new Quaternion()
    quaternion.setFromEuler(euler)

    camera.quaternion.copy(quaternion)
  })

  const handleClick = (e: any) => {
    if (onSceneClick) {
      onSceneClick(e.point)
    }
  }

  // Method to reset camera view
  const resetView = () => {
    camera.rotation.set(0, 0, 0)
    camera.quaternion.set(0, 0, 0, 1)
    if (controlsRef.current?.reset) {
      controlsRef.current.reset()
    }
  }

  // Show error only - loading is handled by earth loader in parent
  if (error) {
    return (
      <Html center>
        <div className="flex flex-col items-center gap-3 bg-black/80 backdrop-blur-md px-6 py-4 rounded-xl border border-white/20">
          <div className="text-red-400 text-sm font-medium">⚠️ {error}</div>
          <button 
            onClick={() => window.location.reload()}
            className="px-4 py-2 bg-red-500/20 hover:bg-red-500/30 text-red-300 rounded-lg text-xs transition-colors"
          >
            Retry
          </button>
        </div>
      </Html>
    )
  }

  if (!texture) {
    return null
  }

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={1} />

      {/* Panorama sphere - only clickable in edit mode */}
      <mesh scale={[-1, 1, 1]} onClick={onSceneClick ? handleClick : undefined}>
        <sphereGeometry args={[10, 128, 64]} />
        <meshBasicMaterial map={texture} side={BackSide} />
      </mesh>

      {/* Markers */}
      {markers.map(marker => (
        <MarkerItem 
          key={marker.id} 
          marker={marker} 
          onClick={onMarkerClick} 
        />
      ))}

      {/* Navigation Links */}
      {links.map(link => {
        const targetPanorama = allPanoramas.find(p => p.id === link.to_panorama_id)
        return (
          <LinkItem 
            key={link.id} 
            link={link}
            targetPanorama={targetPanorama}
            onClick={onLinkClick} 
          />
        )
      })}

      <PanoramaControls
        ref={controlsRef}
        makeDefault={true}
        enabled={true}
        zoomable
        minFov={40}
        maxFov={75}
        zoomSpeed={0.05}
        panSpeed={0.1}
      />
    </>
  )
}
