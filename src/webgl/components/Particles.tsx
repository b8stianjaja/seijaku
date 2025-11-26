import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

export default function Particles() {
  const points = useRef<THREE.Points>(null)
  
  // Create 2000 particles filling the river volume
  const particlesCount = 2000
  const positions = useMemo(() => {
    const arr = new Float32Array(particlesCount * 3)
    for(let i = 0; i < particlesCount; i++) {
      // Spread wide (x, z) and deep (y)
      arr[i * 3 + 0] = (Math.random() - 0.5) * 30 
      arr[i * 3 + 1] = (Math.random() - 0.5) * 10 - 2 // Center around -2 depth
      arr[i * 3 + 2] = (Math.random() - 0.5) * 30
    }
    return arr
  }, [])

  useFrame((state, delta) => {
    if (!points.current) return
    
    // Simulate River Flow
    const positions = points.current.geometry.attributes.position.array as Float32Array
    
    for(let i = 0; i < particlesCount; i++) {
      const i3 = i * 3
      
      // Move Z backwards (river flow)
      positions[i3 + 2] += delta * 0.5 
      
      // Reset if too far
      if(positions[i3 + 2] > 15) {
        positions[i3 + 2] = -15
      }
      
      // Slight vertical noise (turbulence)
      positions[i3 + 1] += Math.sin(state.clock.elapsedTime + positions[i3]) * 0.002
    }
    
    points.current.geometry.attributes.position.needsUpdate = true
  })

  return (
    <points ref={points}>
      <bufferGeometry>
        {/* FIXED: 'args' passes [array, itemSize] to the BufferAttribute constructor */}
        <bufferAttribute 
          attach="attributes-position" 
          args={[positions, 3]}
          count={particlesCount} 
          array={positions} 
          itemSize={3} 
        />
      </bufferGeometry>
      <pointsMaterial 
        size={0.03} 
        color="#a5f2f3" // Light teal sediment
        transparent 
        opacity={0.4} 
        sizeAttenuation 
        depthWrite={false}
        blending={THREE.AdditiveBlending}
      />
    </points>
  )
}