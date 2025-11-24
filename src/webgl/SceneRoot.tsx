import { Canvas, useLoader } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useStore } from '@state/index'
import { RGBELoader } from 'three-stdlib'
import { useMemo } from 'react'



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