import { Canvas } from '@react-three/fiber'
import Experience from './Experience'

export const SceneRoot = () => {
  return (
    <Canvas
      shadows
      camera={{
        position: [0, 0, 5],
        fov: 45,
        near: 0.1,
        far: 200
      }}
      // Optional: Add dpr for better performance on high-res screens
      dpr={[1, 2]} 
    >
      <Experience /> 
    </Canvas>
  )
}