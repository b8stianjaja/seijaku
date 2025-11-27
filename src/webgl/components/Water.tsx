import { useRef, useMemo } from 'react'
import { useFrame } from '@react-three/fiber'
import * as THREE from 'three'
import { RIVER_CONFIG } from '../config/riverConfig'

// --- SHADER LOGIC ---
// We simulate "Snell's Window". 
// If the ray refracts out of the water, we see the Sky Color.
// If it reflects back down (Total Internal Reflection), we see the Deep Color.

const vertexShader = `
varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vWorldNormal;

uniform float uTime;

// Simple, fast noise function
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Gentle rolling waves simulation
    float speed = 0.5;
    vec2 flow = vec2(pos.x * 0.2, pos.z * 0.2 + uTime * speed * 0.2);
    
    float height = noise(flow) * 1.5;
    height += noise(flow * 3.4 + uTime) * 0.2;
    
    pos.y += height;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vViewPosition = worldPos.xyz - cameraPosition;
    
    // Approximate normal for lighting (cheap version)
    float eps = 0.1;
    float h1 = noise(vec2((pos.x + eps) * 0.2, flow.y));
    float h2 = noise(vec2(pos.x * 0.2, flow.y + eps));
    vec3 n = normalize(vec3(height - h1, eps, height - h2));
    vWorldNormal = normalize(mat3(modelMatrix) * n);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}
`

const fragmentShader = `
varying vec3 vViewPosition;
varying vec3 vWorldNormal;

uniform vec3 uColorWater;
uniform vec3 uColorDeep;
uniform vec3 uSunPosition;

void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vWorldNormal);
    
    // Invert normal because we are looking form BELOW the surface
    vec3 surfaceNormal = -normal; 
    
    // 1. Calculate Snell's Window (Refraction)
    // IOR Water = 1.33. Ratio = 1.0 / 1.33
    vec3 refractDir = refract(viewDir, surfaceNormal, 1.0/1.33);
    
    // If length(refractDir) is 0.0, it's Total Internal Reflection (TIR)
    // We can check the y component. If it points up, it hit sky.
    
    vec3 color;
    
    if (length(refractDir) > 0.0 && refractDir.y > 0.0) {
        // --- HIT SKY ---
        // Simple procedural sky gradient
        float sunMix = max(0.0, dot(refractDir, normalize(uSunPosition)));
        sunMix = pow(sunMix, 20.0); // Sun glare
        
        vec3 skyColor = mix(vec3(0.5, 0.7, 0.9), vec3(1.0), sunMix);
        color = skyColor;
    } else {
        // --- REFLECTED DEEP ---
        // We see the bottom of the river/deep water
        // Add some "absorption" color
        color = uColorDeep;
    }
    
    // Fresnel attenuation for smooth transition
    float fresnel = 0.04 + 0.96 * pow(1.0 - dot(-viewDir, surfaceNormal), 5.0);
    
    // Mix based on physics approximation
    vec3 finalColor = mix(color, uColorWater, 0.2); // Tint everything with water color

    gl_FragColor = vec4(finalColor, 0.9); // Slight transparency to blend with fog
    
    #include <colorspace_fragment>
}
`

export default function Water() {
  const materialRef = useRef<THREE.ShaderMaterial>(null)
  
  const uniforms = useMemo(() => ({
    uTime: { value: 0 },
    uColorWater: { value: RIVER_CONFIG.colors.water },
    uColorDeep: { value: RIVER_CONFIG.colors.deep },
    uSunPosition: { value: RIVER_CONFIG.sunPosition }
  }), [])

  useFrame((state) => {
    if (materialRef.current) materialRef.current.uniforms.uTime.value = state.clock.elapsedTime
  })

  return (
    // Render back side because we look up at it
    <mesh rotation={[-Math.PI / 2, 0, 0]} position={[0, 0, 0]}>
      {/* Reduced geometry density for performance */}
      <planeGeometry args={[60, 60, 128, 128]} />
      <shaderMaterial
        ref={materialRef}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        side={THREE.BackSide} 
      />
    </mesh>
  )
}