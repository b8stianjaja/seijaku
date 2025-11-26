import { OrbitControls } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from '@state/index'
import { MOODS } from './config/moods'

export default function Experience() {
  // Access the debug flag from Zustand store
  const debug = useStore((state) => state.debug)

  return (
    <>
      {/* --- Helpers --- */}
      {/* Only render performance monitor if debug mode is active */}
      {debug && <Perf position="top-left" />}
      
      {/* MakeDefault ensures these controls interact correctly with other drei components */}
      <OrbitControls makeDefault />

      {/* --- Lighting --- */}
      <ambientLight intensity={0.5} />
      <directionalLight 
        position={[10, 10, 5]} 
        intensity={1} 
        castShadow 
      />

      {/* --- Content --- */}
      {/* Placeholder mesh to verify the scene is rendering */}
      <mesh position-y={0}>
        <boxGeometry />
        <meshStandardMaterial color={MOODS.default.color} />
      </mesh>
    </>
  )
}