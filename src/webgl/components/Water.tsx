import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RIVER_CONFIG } from '../config/riverConfig'

// Import the updated "Beautiful" shaders
import vertexShader from '../shaders/water/vertex.glsl'
import fragmentShader from '../shaders/water/fragment.glsl'

export default function Water() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    // Matched to the shader's "uColorWater"
    uColorWater: { value: RIVER_CONFIG.colors.water },
    uColorDeep: { value: RIVER_CONFIG.colors.deep },
    uSunPosition: { value: RIVER_CONFIG.sunPosition }
  }), [])

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    // Render back side because we look up at it
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* Reduced geometry density for performance */}
      <planeGeometry args={[60, 60, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide} 
      />
    </mesh>
  )
}