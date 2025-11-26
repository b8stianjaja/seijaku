import { useRef } from 'react'
import { MeshTransmissionMaterial } from '@react-three/drei'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Water() {
  const materialRef = useRef<THREE.ShaderMaterial>(null) // Type hack for ref access

  useFrame((state) => {
    if (materialRef.current) {
      // Slowly animate the distortion time offset
      materialRef.current.time = state.clock.elapsedTime * 0.2
    }
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* High res geometry for smooth physical waves */}
      <planeGeometry args={[60, 60, 256, 256]} />
      
      {/* The Gold Standard for Clear Water */}
      <MeshTransmissionMaterial
        ref={materialRef}
        backside={false} // Render front face
        samples={4} // Quality of refraction
        resolution={512} // Resolution of the refraction buffer
        transmission={1} // 100% Optical Clarity
        roughness={0.05} // Almost mirror polish
        thickness={3.0} // Volume simulation
        ior={1.33} // Index of Refraction for Water
        chromaticAberration={0.06} // "Prism" effect
        anisotropy={0.5} // Shaping the highlights
        distortion={0.4} // Wave height
        distortionScale={0.4} // Wave frequency
        temporalDistortion={0.1} // Wave speed
        color="#cceeff" // Pale Ice Blue tint
        background={new THREE.Color('#001e2b')} // Deep water backdrop color
      />
    </mesh>
  )
}