import { useEffect, useState, Suspense } from 'react'
import { useLoader, useFrame, useThree } from '@react-three/fiber'
import { TextureLoader, BackSide, Euler, Quaternion, Vector3 } from 'three'
import { PanoramaControls } from 'three-panorama-controls/react'
import { Html, useGLTF } from '@react-three/drei'

interface PanoramaMarker {
  id: string
  panorama_id: string
  type: 'info' | 'image' | 'video'
  position_x: number
  position_y: number
  position_z: number
  title: string
  content: string
  icon_url: string
  model_url?: string
}

function GLBModel({ url }: { url: string }) {
  console.log('Attempting to load GLB from:', url)
  const { scene } = useGLTF(url)
  return <primitive object={scene} scale={2} />
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
        onPointerOver={() => setHovered(true)}
        onPointerOut={() => setHovered(false)}
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

interface PanoramaSceneProps {
  imageUrl: string
  onDebugUpdate?: (data: any) => void
  calibrationOffsets?: { alpha: number, beta: number, gamma: number }
  shouldRecalibrate?: boolean
  onRecalibrateDone?: () => void
  setCalibrationOffsets?: (offsets: { alpha: number, beta: number, gamma: number }) => void
  gyroEnabled?: boolean
  onLoadComplete?: () => void
  onSceneClick?: (point: Vector3) => void
  markers?: PanoramaMarker[]
  onMarkerClick?: (marker: PanoramaMarker) => void
}

export default function PanoramaScene({ 
  imageUrl, 
  onDebugUpdate = () => {}, 
  calibrationOffsets = { alpha: 0, beta: 0, gamma: 0 }, 
  shouldRecalibrate = false, 
  onRecalibrateDone = () => {}, 
  setCalibrationOffsets = () => {}, 
  gyroEnabled = false, 
  onLoadComplete = () => {},
  onSceneClick,
  markers = [],
  onMarkerClick
}: PanoramaSceneProps) {
  const texture = useLoader(TextureLoader, imageUrl)
  const { camera } = useThree()
  const [gyroscopeEnabled, setGyroscopeEnabled] = useState(false)
  const [isTextureLoaded, setIsTextureLoaded] = useState(false)

  // Mark texture as loaded and trigger callback
  useEffect(() => {
    if (texture) {
      setIsTextureLoaded(true)
      onLoadComplete()
    }
  }, [texture, onLoadComplete])

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

  return (
    <>
      <ambientLight intensity={1.5} />
      <directionalLight position={[5, 10, 5]} intensity={2} />
      <directionalLight position={[-5, 5, 5]} intensity={1} />
      <pointLight position={[0, 0, 0]} intensity={1} />

      {/* Panorama sphere */}
      <mesh scale={[-1, 1, 1]} onClick={handleClick}>
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

      <PanoramaControls
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
