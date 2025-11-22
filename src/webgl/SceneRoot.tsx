import { Canvas } from '@react-three/fiber'
import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from '@state/index'

export default function SceneRoot() {
  const debug = useStore((state) => state.debug)

  return (
    <Canvas
      className="canvas-layer"
      shadows
      camera={{ position: [0, 0, 8], fov: 45 }}
      // eventSource is crucial for mixing DOM and Canvas events
      eventSource={document.getElementById('root')!}
    >
      <color attach="background" args={['#111']} />
      
      {/* --- Staging --- */}
      <OrbitControls makeDefault />
      <ambientLight intensity={0.5} />
      <pointLight position={[10, 10, 10]} intensity={1} castShadow />

      {/* --- Objects (Placeholder) --- */}
      <mesh castShadow receiveShadow>
        <boxGeometry args={[1, 1, 1]} />
        <meshNormalMaterial />
      </mesh>

      {/* --- Debug Tools --- */}
      {debug && <Perf position="top-left" />}
    </Canvas>
  )
}