import { useRef, useEffect } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { useStore } from '@state/index'
import { MOODS } from '@webgl/config/moods'
import '@webgl/materials/WaterMaterial'

// Define the props this component expects
interface ObsidianWaterProps {
  envMap: THREE.Texture
}

export function ObsidianWater({ envMap }: ObsidianWaterProps) {
  const hoveredService = useStore((state) => state.hoveredService)
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)
  
  const sunPosition = useRef(new THREE.Vector3(0, 10, -50)).current

  // Update the material whenever the envMap prop changes
  useEffect(() => {
    if (materialRef.current) {
      materialRef.current.envMap = envMap
    }
  }, [envMap])

  useFrame((state) => {
    if (!materialRef.current) return

    const target = (hoveredService && MOODS[hoveredService]) ? MOODS[hoveredService] : MOODS.default
    
    materialRef.current.uTime = state.clock.elapsedTime
    materialRef.current.uDistortion = 0.4 
    materialRef.current.uSpeed = 0.05     
    materialRef.current.uSunPosition = sunPosition
    materialRef.current.uColor.lerp(new THREE.Color(target.color), 0.05)
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[150, 150, 512, 512]} /> 
      {/* @ts-expect-error: custom element */}
      <waterMaterial 
        ref={materialRef} 
        transparent
      />
    </mesh>
  )
}