import { Float } from '@react-three/drei'

export function CelestialSun() {
  return (
    <group position={[0, 10, -50]}>
      {/* Floating animation for the sun mesh */}
      <Float speed={2} floatIntensity={0.5}>
        <mesh>
          <sphereGeometry args={[5, 64, 64]} /> 
          <meshBasicMaterial color="#fffaed" toneMapped={false} />
        </mesh>
      </Float>
      {/* High intensity point light to match HDRI brightness */}
      <pointLight intensity={200} distance={500} decay={1.5} color="#fffaed" /> 
    </group>
  )
}