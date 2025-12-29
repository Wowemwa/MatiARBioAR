// Panorama TypeScript Interfaces
// Corresponds to the database schema in supabase/migrations/20251227000000_create_panorama_tables.sql

export interface Panorama {
  id: string
  title: string
  description?: string
  image_url: string
  thumbnail_url?: string
  is_active: boolean
  initial_view_h: number
  initial_view_v: number
  initial_fov: number
  location_lat?: number
  location_lng?: number
  floor_plan_x: number
  floor_plan_y: number
  site_id?: string
  created_at: string
  updated_at: string
}

export interface PanoramaLink {
  id: string
  from_panorama_id: string
  to_panorama_id: string
  position_x: number
  position_y: number
  position_z: number
  rotation_y: number
  label?: string
  created_at: string
}

export interface PanoramaMarker {
  id: string
  panorama_id: string
  type: 'info' | 'image' | 'video'
  position_x: number
  position_y: number
  position_z: number
  title?: string
  content?: string
  icon_url?: string
  model_url?: string
  created_at: string
}

// UI/Component specific types
export interface PanoramaSceneProps {
  links?: PanoramaLink[]
  onLinkClick?: (link: PanoramaLink) => void
  allPanoramas?: Panorama[]
  imageUrl: string
  onDebugUpdate?: (data: any) => void
  calibrationOffsets?: CalibrationOffsets
  shouldRecalibrate?: boolean
  onRecalibrateDone?: () => void
  setCalibrationOffsets?: (offsets: CalibrationOffsets) => void
  gyroEnabled?: boolean
  onLoadComplete?: () => void
  onSceneClick?: (point: { x: number; y: number; z: number }) => void
  markers?: PanoramaMarker[]
  onMarkerClick?: (marker: PanoramaMarker) => void
}

export interface CalibrationOffsets {
  alpha: number
  beta: number
  gamma: number
}

export interface PanoramaDebugData {
  alpha?: number
  beta?: number
  gamma?: number
  rotation?: {
    x: number
    y: number
    z: number
  }
  offsetsApplied?: CalibrationOffsets
}

// For progressive image loading
export interface PanoramaLoadingState {
  isLoading: boolean
  progress: number // 0-100
  previewLoaded: boolean
  fullResLoaded: boolean
  error?: string
}
