varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;

uniform float uTime;

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
    
    // PHYSICS CORRECTION:
    // Slower flow = More realism for a deep river.
    float flowSpeed = 0.1; 
    
    // Larger texture scale (0.15) for bigger, gentler swells
    vec2 flowUV = pos.xz * 0.15;
    flowUV.y -= uTime * flowSpeed;
    
    // Gentle swell
    float elevation = noise(flowUV) * 0.8;
    // Micro ripple
    elevation += noise(flowUV * 4.0 + uTime * 0.1) * 0.05;
    
    pos.y += elevation;

    // Normals (Finite Difference)
    float eps = 0.1; // Larger epsilon for smoother normals
    vec2 uvA = (pos.xz + vec2(eps, 0.0)) * 0.15; uvA.y -= uTime * flowSpeed;
    vec2 uvB = (pos.xz + vec2(0.0, eps)) * 0.15; uvB.y -= uTime * flowSpeed;
    
    float hA = noise(uvA) * 0.8 + noise(uvA * 4.0 + uTime * 0.1) * 0.05;
    float hB = noise(uvB) * 0.8 + noise(uvB * 4.0 + uTime * 0.1) * 0.05;
    
    vec3 computedNormal = normalize(vec3(elevation - hA, eps, elevation - hB));
    
    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    vNormal = normalize(normalMatrix * computedNormal);
    vViewPosition = (viewMatrix * worldPos).xyz;

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}