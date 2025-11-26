import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from '../shaders/shafts/vertex.glsl'
import fragmentShader from '../shaders/shafts/fragment.glsl'

export default function SunShafts() {
  const outerCone = useRef<THREE.Mesh>(null)
  const innerCone = useRef<THREE.Mesh>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColor: { value: new THREE.Color('#e0ffff') },
    uSunDirection: { value: new THREE.Vector3(0, 1, 0) }
  }), [])

  // Fixed: '_state' removes the unused variable warning
  useFrame((_state, delta) => {
    uniforms.uTime.value += delta
    
    // Sun position logic
    const sunPos = new THREE.Vector3(0, 15, -2).normalize()
    uniforms.uSunDirection.value.copy(sunPos)
    
    if (outerCone.current) outerCone.current.rotation.y += delta * 0.02
    if (innerCone.current) innerCone.current.rotation.y -= delta * 0.01
  })

  return (
    <group position={[0, 8, -5]} rotation={[0.2, 0, 0]}>
      <mesh ref={outerCone}>
        <cylinderGeometry args={[5, 20, 40, 32, 1, true]} />
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

      <mesh ref={innerCone} position={[0, -2, 0]}>
        <cylinderGeometry args={[2, 10, 35, 32, 1, true]} />
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
    </group>
  )
}