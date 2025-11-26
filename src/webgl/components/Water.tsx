import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from '../shaders/water/vertex.glsl'
import fragmentShader from '../shaders/water/fragment.glsl'
import { useStore } from '@state/index'
import { useControls } from 'leva'

export default function Water() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  const debug = useStore((state) => state.debug)

  const config = useControls('Deep River', {
    // Palette: Deep Emerald / River Teal
    colorDeep: { value: '#001e2b' },     // Darkest Abyss
    colorSurface: { value: '#006994' },  // Clear River Blue/Green
    
    // Motion
    speed: { value: 0.5, min: 0, max: 2 }, // Faster for river flow
    elevation: { value: 0.25, min: 0, max: 1 },
    noiseFrequency: { value: 0.4, min: 0, max: 5 },
    
    // Crystal Properties
    shininess: { value: 150.0, min: 50, max: 500 },
    reflectivity: { value: 0.6, min: 0, max: 1 },
    
    sunPos: { value: [0, 15, -2] } 
  }, { render: () => debug })

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uColorDeep: { value: new THREE.Color(config.colorDeep) },
      uColorSurface: { value: new THREE.Color(config.colorSurface) },
      uElevation: { value: config.elevation },
      uNoiseFrequency: { value: config.noiseFrequency },
      uSpeed: { value: config.speed },
      uSunPosition: { value: new THREE.Vector3(...config.sunPos) },
      uShininess: { value: config.shininess },
      uReflectivity: { value: config.reflectivity },
    }),
    []
  )

  useFrame((_state, delta) => {
    if (materialRef.current) {
      materialRef.current.uniforms.uTime.value += delta
      
      materialRef.current.uniforms.uColorDeep.value.set(config.colorDeep)
      materialRef.current.uniforms.uColorSurface.value.set(config.colorSurface)
      materialRef.current.uniforms.uElevation.value = config.elevation
      materialRef.current.uniforms.uNoiseFrequency.value = config.noiseFrequency
      materialRef.current.uniforms.uSpeed.value = config.speed
      materialRef.current.uniforms.uSunPosition.value.set(...config.sunPos)
      materialRef.current.uniforms.uShininess.value = config.shininess
      materialRef.current.uniforms.uReflectivity.value = config.reflectivity
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* Large plane to cover the view */}
      <planeGeometry args={[60, 60, 512, 512]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        side={THREE.BackSide}
        transparent={true}
      />
    </mesh>
  )
}