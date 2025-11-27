import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'

const vertexShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;
void main() {
    vUv = uv;
    // Pass world position for consistent caustic mapping
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

const fragmentShader = `
varying vec2 vUv;
varying vec3 vWorldPosition;
uniform float uTime;
uniform vec3 uColorSand;
uniform vec3 uColorCaustic;
uniform vec3 uSunPosition;

// Rotate function to align with sun
vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c) * v;
}

void main() {
    // 1. SAND BASE (Soft noise)
    float grain = fract(sin(dot(vUv * 150.0, vec2(12.9898, 78.233))) * 43758.5453);
    vec3 sand = uColorSand * (0.95 + grain * 0.05);

    // 2. CAUSTIC PROJECTION (Physically matched to SunShafts)
    
    // Get Sun Direction angle
    vec3 sunDir = normalize(uSunPosition);
    float sunAngle = atan(sunDir.x, sunDir.z);

    // Rotate floor coordinates to face the sun
    vec2 alignedPos = rotate(vWorldPosition.xz, -sunAngle);

    // Cartesian Wave Pattern (Curtains)
    // Matches the "Beam Logic" from your SunShafts shader
    float wave1 = sin(alignedPos.x * 0.5 + uTime * 0.2); 
    
    // Interference pattern
    vec2 crossingPos = rotate(alignedPos, 0.5);
    float wave2 = sin(crossingPos.x * 0.8 - uTime * 0.15);
    
    // Caustic Focus
    // We create sharp lines where waves overlap
    float causticVal = max(0.0, wave1 + wave2 - 0.2);
    causticVal = pow(causticVal, 4.0); // Sharpen
    
    // Chromatic Aberration for Caustics (RGB Split on the floor too!)
    vec3 causticColor = vec3(0.0);
    causticColor.r = pow(max(0.0, sin(alignedPos.x * 0.5 + 0.05 + uTime * 0.2) + wave2 - 0.2), 4.0);
    causticColor.g = causticVal;
    causticColor.b = pow(max(0.0, sin(alignedPos.x * 0.5 - 0.05 + uTime * 0.2) + wave2 - 0.2), 4.0);
    
    // Mix
    vec3 light = causticColor * uColorCaustic * 1.5;

    // 3. MASK (Vignette for the floor)
    float mask = smoothstep(50.0, 20.0, length(vWorldPosition.xz));

    gl_FragColor = vec4(sand + light * mask, 1.0);
}
`

export default function RiverBed() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)

  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorSand: { value: new THREE.Color('#e6e2d3') },
    uColorCaustic: { value: new THREE.Color('#00ffff') },
    uSunPosition: { value: new THREE.Vector3(0, 0, -10) }
  }), [])

  useFrame((_, delta) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value += delta
  })

  return (
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, -30, 0]}>
      {/* Increased size to match the volume */}
      <planeGeometry args={[100, 100]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
      />
    </mesh>
  )
}