import { Canvas } from '@react-three/fiber'
import { OrbitControls, PerspectiveCamera } from '@react-three/drei'
import Experience  from './Experience.tsx'

export const SceneRoot = () => {
  return (
    <Canvas>
      <Experience/> 
    </Canvas>
  )
}