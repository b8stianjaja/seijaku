import { Canvas, useLoader } from '@react-three/fiber'
import { Perf } from 'r3f-perf'
import * as THREE from 'three'
import { useStore } from '@state/index'
import { RGBELoader } from 'three-stdlib'
import { useMemo, Suspense } from 'react'
import { Environment } from '@react-three/drei'

function SceneContent() {
  const debug = useStore((state) => state.debug)

  


  return (
    <>
     
      <Environment preset='city'/>
     

     

      {debug && <Perf position="top-left" />}
    </>
  )
}

export default function SceneRoot() {
  return (
    <Canvas
      className="canvas-layer"
      dpr={[1, 1.5]} 
      camera={{ position: [0, 5, 10], fov: 45 }}
      gl={{ 
        toneMapping: THREE.ACESFilmicToneMapping,
        toneMappingExposure: 1.0,
        antialias: true 
      }}
    >
      <Suspense fallback={null}>
        <SceneContent />
      </Suspense>
    </Canvas>
  )
}