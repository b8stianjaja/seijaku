varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSunDirection;

// Fast Procedural Noise (No texture lookup needed)
float hash(float n) { return fract(sin(n) * 43758.5453123); }
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    float n = i.x + i.y * 57.0;
    return mix(mix(hash(n + 0.0), hash(n + 1.0), f.x),
               mix(hash(n + 57.0), hash(n + 58.0), f.x), f.y);
}

void main() {
    // 1. Vertical Fade (Top to Bottom)
    // Brighter near surface (y=0), fading into deep water (y=1)
    float depthFade = smoothstep(1.0, 0.2, vUv.y);
    
    // 2. Ray Generation (The "God Rays")
    // We stretch noise vertically to create "beams"
    // We scroll it slowly to simulate the sun moving/water rippling
    float rays = noise(vec2(vUv.x * 20.0, vUv.y * 0.5 - uTime * 0.2));
    
    // Add a second layer for complexity (Interference pattern)
    rays += noise(vec2(vUv.x * 10.0 + 10.0, vUv.y * 0.2 - uTime * 0.15)) * 0.5;
    
    // Sharpen the rays to make them distinct
    rays = max(0.0, rays - 0.4); 
    rays = pow(rays, 3.0); // Contrast boost

    // 3. Radial Fade (Cone edges)
    // Smoothly fade out the left/right edges of the cone so it doesn't look like a shape
    float radialFade = 1.0 - abs(vUv.x - 0.5) * 2.0;
    radialFade = smoothstep(0.0, 0.4, radialFade);

    // 4. View Angle Factor
    // Real volumetric light is brighter when looking towards the light source
    vec3 viewDir = normalize(vViewPosition);
    float viewIncidence = max(0.0, dot(viewDir, uSunDirection));
    float incidenceBoost = 1.0 + pow(viewIncidence, 4.0) * 2.0; // Explosion of light when looking at sun

    // Combine
    float alpha = rays * depthFade * radialFade * incidenceBoost;
    
    // Final Opacity Clamp
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(uColor, alpha * 0.4); // Base opacity 0.4
}