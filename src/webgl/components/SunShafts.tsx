import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from '../shaders/shafts/vertex.glsl'
import fragmentShader from '../shaders/shafts/fragment.glsl'

export default function SunShafts() {
  const meshRef = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#ffffff') },
    uSunPosition: { value: new THREE.Vector3(0, 0, -10) } // Match Floor!
  }), [])

  // Fix: Rename unused 'state' to '_'
  useFrame((_, delta) => {
    if (meshRef.current) {
      (meshRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value += delta
    }
  })

  return (
    // Large Volume Cone
    <mesh ref={meshRef} position={[0, -5, -10]} rotation={[0, 0, 0]}>
      <cylinderGeometry args={[5, 20, 40, 64, 1, true]} />
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent={true}
        depthWrite={false}
        blending={THREE.AdditiveBlending}
        side={THREE.DoubleSide}
      />
    </mesh>
  )
}