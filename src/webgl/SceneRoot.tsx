import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { Stars, Float } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from '@state/index'
import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'

// Import custom material logic
import '@webgl/materials/WaterMaterial'

// --- MOODS ---
const MOODS: Record<string, any> = {
  default: { 
    color: '#F0F8FF',   // AliceBlue
    horizon: '#ffffff', 
    sky: '#87CEFA',     
    sun: '#ffffff'
  },
  lashes:  { 
    color: '#E6E6FA',   
    horizon: '#FFDEE9', 
    sky: '#B5FFFC',     
    sun: '#FFFFFF'
  },
  nails:   { 
    color: '#FFF5EE',   
    horizon: '#FDFBFB', 
    sky: '#EBEDEE',     
    sun: '#FFE4E1'      
  },
  brows:   { 
    color: '#F5F5F5',   
    horizon: '#E0C3FC', 
    sky: '#8EC5FC',     
    sun: '#FFFFFF' 
  },
  facial:  { 
    color: '#E0FFFF',   
    horizon: '#FFFFFF', 
    sky: '#00BFFF',     
    sun: '#E0FFFF' 
  },
}

// --- SKY ---
function ProceduralSky() {
  const { scene } = useThree()
  const hoveredService = useStore((state) => state.hoveredService)

  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 1024 
    canvas.height = 1024
    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping 
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useEffect(() => {
    const target = hoveredService && MOODS[hoveredService] ? MOODS[hoveredService] : MOODS.default
    const canvas = texture.image
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const gradient = ctx.createLinearGradient(0, 0, 0, 1024)
    
    // Smooth Heaven Gradient
    gradient.addColorStop(0, target.sky) 
    gradient.addColorStop(0.4, target.sky) 
    gradient.addColorStop(0.5, target.horizon) 
    gradient.addColorStop(0.52, target.horizon) 
    gradient.addColorStop(0.6, target.sky)
    gradient.addColorStop(1, target.sky)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 1024, 1024)
    
    texture.needsUpdate = true
    scene.background = texture
    scene.environment = texture
    
    return () => {
      scene.background = null
      scene.environment = null
    }
  }, [hoveredService, scene, texture])

  return null
}

function CelestialSun() {
  const hoveredService = useStore((state) => state.hoveredService)
  const meshRef = useRef<THREE.Mesh>(null)
  const lightRef = useRef<THREE.PointLight>(null)
  
  useFrame((_, delta) => {
    const target = hoveredService && MOODS[hoveredService] ? MOODS[hoveredService] : MOODS.default
    const targetColor = new THREE.Color(target.sun)
    
    if (meshRef.current) {
      // @ts-expect-error: material color access
      meshRef.current.material.color.lerp(targetColor, delta * 2)
    }
    if (lightRef.current) {
      lightRef.current.color.lerp(targetColor, delta * 2)
    }
  })

  return (
    <group position={[0, 6, -45]}>
      <Float speed={2} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[5, 64, 64]} /> 
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </Float>
      <pointLight ref={lightRef} intensity={400} distance={200} decay={2} color="#ffffff" /> 
    </group>
  )
}

function ObsidianShaderWater() {
  const hoveredService = useStore((state) => state.hoveredService)
  const { scene } = useThree()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)
  
  const sunPosition = useMemo(() => new THREE.Vector3(0, 6, -45), [])

  useFrame((state, delta) => {
    if (!materialRef.current) return

    const target = hoveredService && MOODS[hoveredService] ? MOODS[hoveredService] : MOODS.default
    const lerpSpeed = 2.0 * delta

    materialRef.current.uTime = state.clock.elapsedTime
    
    // CALMER WATER SETTINGS
    materialRef.current.uDistortion = 0.8
    materialRef.current.uSpeed = 0.08
    materialRef.current.uSunPosition = sunPosition

    materialRef.current.uColor.lerp(new THREE.Color(target.color), lerpSpeed)
    
    if (scene.environment) {
      materialRef.current.envMap = scene.environment
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      <planeGeometry args={[150, 150, 256, 256]} />
      {/* @ts-expect-error: custom element */}
      <waterMaterial 
        ref={materialRef} 
        transparent
      />
    </mesh>
  )
}

export default function SceneRoot() {
  const debug = useStore((state) => state.debug)

  return (
    <Canvas
      className="canvas-layer"
      dpr={[1, 2]}
      camera={{ position: [0, 1.5, 12], fov: 40 }} 
      gl={{ 
        toneMappingExposure: 1.0, 
        antialias: true 
      }}
    >
      <ProceduralSky />
      <CelestialSun />
      <ObsidianShaderWater />
      <Stars radius={90} depth={50} count={3000} factor={4} saturation={0} fade speed={0.5} />

      {debug && <Perf position="top-left" />}
    </Canvas>
  )
}