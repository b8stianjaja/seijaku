import { Canvas, useFrame, useThree } from '@react-three/fiber'
import { PerspectiveCamera, Stars, Float } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from '@state/index'
import * as THREE from 'three'
import { useRef, useMemo, useEffect } from 'react'

// Import custom material logic
import '@webgl/materials/WaterMaterial'

// --- 1. ART DIRECTION: THE MOODS ---
// We use HSL-like thinking here.
// Horizon = Bright, Glowing (The light source)
// Sky = Deep, Rich (The void)
const MOODS: Record<string, any> = {
  default: { 
    color: '#eef2ff', // Water Base: Silvery White
    horizon: '#ffffff', // Horizon: Pure Light
    sky: '#8baac4',     // Zenith: Soft Slate Blue
    sun: '#ffffff'      // Sun: White
  },
  lashes:  { 
    color: '#1a1a1a', // Water Base: Dark Ink
    horizon: '#ffc0cb', // Horizon: Soft Pink
    sky: '#2a0a10',     // Zenith: Deep Burgundy
    sun: '#ff8095'      // Sun: Rose
  },
  nails:   { 
    color: '#fff0f5', // Water Base: Lavender Blush
    horizon: '#ffd700', // Horizon: Gold
    sky: '#fbcce7',     // Zenith: Pastel Pink
    sun: '#ffcc00'      // Sun: Gold
  },
  brows:   { 
    color: '#e6e2dd', // Water Base: Taupe
    horizon: '#dcbfac', // Horizon: Warm Beige
    sky: '#8c7b75',     // Zenith: Earthy Brown
    sun: '#ffffff' 
  },
  facial:  { 
    color: '#e0f7fa', // Water Base: Icy Blue
    horizon: '#00ffff', // Horizon: Cyan Glow
    sky: '#004466',     // Zenith: Deep Ocean
    sun: '#aaddff' 
  },
}

// --- 2. PROCEDURAL SKY GENERATOR ---
// Creates a custom HDRI on the fly. No downloads. Unique to your brand.
function ProceduralSky() {
  const { scene } = useThree()
  const hoveredService = useStore((state) => state.hoveredService)

  // Create a high-dynamic-range-like canvas texture
  const texture = useMemo(() => {
    const canvas = document.createElement('canvas')
    canvas.width = 512 // Higher res for smoother gradient
    canvas.height = 512
    const tex = new THREE.CanvasTexture(canvas)
    tex.mapping = THREE.EquirectangularReflectionMapping // Vital for reflections
    tex.colorSpace = THREE.SRGBColorSpace
    return tex
  }, [])

  useEffect(() => {
    const target = hoveredService && MOODS[hoveredService] ? MOODS[hoveredService] : MOODS.default
    const canvas = texture.image
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    // Draw the Sky Gradient (Equirectangular Projection)
    // y=0 (South Pole), y=0.5 (Horizon), y=1 (North Pole)
    const gradient = ctx.createLinearGradient(0, 0, 0, 512)
    
    // 1. Bottom (Reflection of sky) - Slightly darker
    gradient.addColorStop(0, target.sky) 
    // 2. Horizon - The Glow!
    gradient.addColorStop(0.45, target.sky) 
    gradient.addColorStop(0.5, target.horizon) 
    gradient.addColorStop(0.55, target.sky)
    // 3. Top (Zenith) - Deep Space
    gradient.addColorStop(1, target.sky)

    ctx.fillStyle = gradient
    ctx.fillRect(0, 0, 512, 512)
    
    texture.needsUpdate = true
    
    // Apply to Scene
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
  
  useFrame((state, delta) => {
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
    <group position={[0, 5, -30]}>
      <Float speed={2} floatIntensity={0.5}>
        <mesh ref={meshRef}>
          <sphereGeometry args={[2, 64, 64]} />
          <meshBasicMaterial color="#ffffff" toneMapped={false} />
        </mesh>
      </Float>
      {/* High intensity light to create sparkles on water waves */}
      <pointLight ref={lightRef} intensity={100} distance={200} decay={2} color="#ffffff" />
    </group>
  )
}

function ObsidianShaderWater() {
  const hoveredService = useStore((state) => state.hoveredService)
  const { scene } = useThree()
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const materialRef = useRef<any>(null)

  useFrame((state, delta) => {
    if (!materialRef.current) return

    const target = hoveredService && MOODS[hoveredService] ? MOODS[hoveredService] : MOODS.default
    const lerpSpeed = 2.0 * delta

    // Update Uniforms
    materialRef.current.uTime = state.clock.elapsedTime
    
    // We keep distortion constant-ish but change speed
    materialRef.current.uDistortion = 0.8 
    materialRef.current.uSpeed = 0.15
    
    // IMPORTANT: Lerp the base water color
    materialRef.current.uColor.lerp(new THREE.Color(target.color), lerpSpeed)
    
    // Ensure the shader reads our procedural sky for reflections
    if (scene.environment) {
      materialRef.current.envMap = scene.environment
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -2, 0]}>
      {/* High segment count for smooth vertex displacement if we add it later */}
      <planeGeometry args={[100, 100, 64, 64]} />
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
      camera={{ position: [0, 3, 12], fov: 45 }}
      gl={{ 
        toneMappingExposure: 1.0, 
        antialias: true 
      }}
    >
      {/* 1. Generate the Custom Sky */}
      <ProceduralSky />
      
      {/* 2. The Sun (Visual + Light Source) */}
      <CelestialSun />
      
      {/* 3. The Water */}
      <ObsidianShaderWater />
      
      {/* 4. Atmospheric Particles */}
      <Stars radius={60} depth={50} count={3000} factor={4} saturation={0} fade speed={1} />

      {debug && <Perf position="top-left" />}
    </Canvas>
  )
}