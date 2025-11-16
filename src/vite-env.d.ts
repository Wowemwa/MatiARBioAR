/// <reference types="vite/client" />
/// <reference types="aframe" />

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
