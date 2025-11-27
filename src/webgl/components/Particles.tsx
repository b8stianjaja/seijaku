import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
uniform float uTime;
attribute float aSize;
attribute vec3 aRandom;

void main() {
    vec3 pos = position;
    
    // --- GPU ANIMATION ---
    float speed = aRandom.x * 0.5 + 0.2;
    float flowLimit = 20.0;
    
    // 1. Linear Flow along Z
    pos.z = mod(pos.z + uTime * speed + flowLimit, flowLimit * 2.0) - flowLimit;
    
    // 2. Turbulence
    pos.y += sin(uTime * aRandom.y + pos.x) * 0.2;
    pos.x += cos(uTime * 0.3 + pos.z) * 0.1;

    vec4 mvPosition = modelViewMatrix * vec4(pos, 1.0);
    gl_Position = projectionMatrix * mvPosition;
    
    gl_PointSize = aSize * (50.0 / -mvPosition.z);
}
`

const fragmentShader = `
void main() {
    vec2 uv = gl_PointCoord - 0.5;
    float r = length(uv) * 2.0;
    if (r > 1.0) discard;
    float alpha = 1.0 - r;
    alpha = pow(alpha, 3.0);
    gl_FragColor = vec4(0.8, 0.9, 0.9, alpha * 0.5);
}
`

export default function Particles() {
  const pointsRef = useRef<THREE.Points>(null)
  const count = 3000
  
  const { positions, randoms, sizes } = useMemo(() => {
    const pos = new Float32Array(count * 3)
    const rnd = new Float32Array(count * 3)
    const sz = new Float32Array(count)
    
    for(let i = 0; i < count; i++) {
        pos[i * 3 + 0] = (Math.random() - 0.5) * 40
        pos[i * 3 + 1] = (Math.random() - 0.5) * 12 - 5
        pos[i * 3 + 2] = (Math.random() - 0.5) * 40
        
        rnd[i * 3 + 0] = Math.random();
        rnd[i * 3 + 1] = Math.random();
        rnd[i * 3 + 2] = Math.random();
        
        sz[i] = Math.random() * 0.5 + 0.5;
    }
    return { positions: pos, randoms: rnd, sizes: sz }
  }, [])

  useFrame((state) => {
    if (pointsRef.current) {
        (pointsRef.current.material as THREE.ShaderMaterial).uniforms.uTime.value = state.clock.elapsedTime
    }
  })

  return (
    <points ref={pointsRef}>
      <bufferGeometry>
        {/* FIXED: Added 'args' which is required for the constructor */}
        <bufferAttribute 
            attach="attributes-position" 
            count={count} 
            array={positions} 
            itemSize={3} 
            args={[positions, 3]} 
        />
        <bufferAttribute 
            attach="attributes-aRandom" 
            count={count} 
            array={randoms} 
            itemSize={3} 
            args={[randoms, 3]} 
        />
        <bufferAttribute 
            attach="attributes-aSize" 
            count={count} 
            array={sizes} 
            itemSize={1} 
            args={[sizes, 1]} 
        />
      </bufferGeometry>
      <shaderMaterial
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={{ uTime: { value: 0 } }}
        transparent
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}