import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RIVER_CONFIG } from '../config/riverConfig'
import vertexShader from '../shaders/shafts/vertex.glsl'
import fragmentShader from '../shaders/shafts/fragment.glsl'

export default function SunShafts() {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: RIVER_CONFIG.colors.sun },
    uSunPosition: { value: RIVER_CONFIG.sunPosition }
  }), [])

  useFrame((state, delta) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value += delta
    }
  })

  return (
    // Position: y=-30 means the top of the 60-unit cylinder is at y=0 (Surface)
    <mesh ref={meshRef} position={[0, -30, 0]} renderOrder={1}>
      {/* Geometry: Massive cylinder to encompass the view.
         Radius: 60 (Huge field of view)
         Height: 60 (Deep water fade)
      */}
      <cylinderGeometry args={[60, 60, 60, 64, 1, true]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}