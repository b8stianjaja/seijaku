import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
varying vec3 vPosition;
void main() {
    vUv = uv;
    vPosition = position;
    gl_Position = projectionMatrix * viewMatrix * modelMatrix * vec4(position, 1.0);
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vPosition;
uniform float uTime;
uniform vec3 uColorSand;
uniform vec3 uColorCaustic;
uniform vec3 uSunPosition;

void main() {
    // 1. SAND BASE
    float grain = fract(sin(dot(vUv * 100.0, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 sand = uColorSand * (0.9 + grain * 0.1);

    // 2. CAUSTIC PROJECTION
    // We project the same "Sun Angle" logic as the shafts onto the floor
    vec3 localPos = vPosition - vec3(uSunPosition.x, 0.0, uSunPosition.z);
    float angle = atan(localPos.x, localPos.z);
    float dist = length(localPos.xz);
    
    // Radial Caustics (Matches the Shafts!)
    float wave1 = sin(angle * 8.0 + uTime * 0.1 + dist * 0.5); // Bending waves
    float wave2 = sin(angle * 25.0 - uTime * 0.15 + dist * 0.2);
    
    float caustic = smoothstep(0.8, 1.0, wave1 * wave2); // Sharp intersections
    
    // Chromatic Aberration (RGB Split)
    vec3 light = vec3(0.0);
    light.r = smoothstep(0.8, 1.0, sin(angle * 8.05 + uTime * 0.1 + dist * 0.5));
    light.g = caustic;
    light.b = smoothstep(0.8, 1.0, sin(angle * 7.95 + uTime * 0.1 + dist * 0.5));
    
    light *= uColorCaustic * 2.0;

    // 3. MASK
    float mask = smoothstep(40.0, 10.0, length(vPosition.xz));

    gl_FragColor = vec4(sand + light * mask, 1.0);
}
`

export default function RiverBed() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorSand: { value: new THREE.Color('#e6e2d3') }, // Clean Sand
    uColorCaustic: { value: new THREE.Color('#00ffff') }, // Cyan Light
    uSunPosition: { value: new THREE.Vector3(0, 0, -10) }
  }), [])

  useFrame((state, delta) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value += delta
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -10, 0]}>
      <planeGeometry args={[80, 80]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}