import { Canvas } from '@react-three/fiber'
// FIXED: Removed unused PerspectiveCamera import
import Experience from './Experience'
import { StrictMode } from 'react'

export const SceneRoot = () => {
  return (
    <StrictMode>
      <Canvas
        dpr={[1, 1.5]}
        gl={{ 
            antialias: false,
            toneMapping: 3, 
            toneMappingExposure: 1.0,
            powerPreference: "high-performance"
        }}
        camera={{ position: [0, -6, 5], fov: 45 }}
      >
         <Experience />
      </Canvas>
    </StrictMode>
  )
}