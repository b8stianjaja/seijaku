import { Canvas, useLoader } from '@react-three/fiber'
import { Stars, Environment } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useStore } from '@state/index'
import { RGBELoader } from 'three-stdlib'
import { useMemo } from 'react'

import { CelestialSun } from './components/CelestialSun'
import { ObsidianWater } from './components/ObsidianWater'

function SceneContent() {
  const debug = useStore((state) => state.debug)

  // 1. MASTER LOAD: Load the HDRI once here
  // Ensure this file exists in your 'public' folder!
  const texture = useLoader(RGBELoader, '/hdr/mainhdr.hdr')

  // 2. CONFIGURE: Set up the texture settings once
  useMemo(() => {
    texture.mapping = THREE.EquirectangularReflectionMapping
    texture.minFilter = THREE.LinearFilter
    texture.magFilter = THREE.LinearFilter
    texture.needsUpdate = true
  }, [texture])

  return (
    <>
      {/* 3. APPLY TO SKY: Pass the loaded texture to Environment */}
      <Environment 
        map={texture} 
        background={true} 
        blur={0.5} 
      />

      <Stars radius={100} depth={50} count={2000} factor={4} saturation={0} fade speed={0.5} />
      
      <CelestialSun />
      
      {/* 4. APPLY TO WATER: Pass the same texture instance down */}
      <ObsidianWater envMap={texture} />

      {debug && <Perf position="top-left" />}
    </>
  )
}

export default function SceneRoot() {
  return (
    <Canvas
      className="canvas-layer"
      dpr={[1, 1.5]} 
      camera={{ position: [0, 2, 14], fov: 35 }} 
      gl={{ 
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 0.8,
        antialias: true 
      }}
    >
      <SceneContent />
    </Canvas>
  )
}