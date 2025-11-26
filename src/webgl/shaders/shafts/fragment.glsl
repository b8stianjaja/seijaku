varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSunPosition;

void main() {
    // 1. POLAR COORDINATES (The "Beam" Logic)
    // We calculate the angle of the pixel relative to the sun center
    vec3 localPos = vWorldPosition - uSunPosition;
    float angle = atan(localPos.x, localPos.z); // Angle around Y axis
    float dist = length(localPos.xz);
    
    // 2. BEAM GENERATION
    // We use sine waves to create "Pillars" of light
    // Layer 1: Wide, slow majestic beams
    float beam1 = sin(angle * 8.0 + uTime * 0.1);
    beam1 = smoothstep(0.5, 1.0, beam1); // Sharpen
    
    // Layer 2: Thin, interference beams
    float beam2 = sin(angle * 25.0 - uTime * 0.15);
    beam2 = smoothstep(0.6, 1.0, beam2);
    
    // Combine
    float rays = max(beam1, beam2 * 0.5);
    
    // 3. VERTICAL SHIMMER (Falling dust)
    // Add a subtle noise that falls down the beams
    float noise = fract(sin(dot(vUv * 50.0, vec2(12.9898, 78.233))) * 43758.5453);
    float shimmer = smoothstep(0.8, 1.0, noise * sin(vUv.y * 10.0 - uTime));
    
    rays += shimmer * 0.2;

    // 4. MASKS
    // Fade Deep (Bottom)
    float depthFade = smoothstep(-10.0, 0.0, vWorldPosition.y);
    
    // Fade Edges (Radial)
    float radialFade = smoothstep(0.0, 0.3, 1.0 - abs(vUv.x - 0.5) * 2.0);
    
    // 5. SUN GLARE (Look at light)
    vec3 viewDir = normalize(vViewPosition);
    vec3 sunDir = normalize(uSunPosition - vWorldPosition);
    float lookAtSun = max(0.0, dot(viewDir, sunDir));
    float glare = pow(lookAtSun, 6.0) * 2.0;

    // Final Alpha
    float alpha = rays * depthFade * radialFade * (0.2 + glare);
    
    // Soft Clamp
    alpha = clamp(alpha, 0.0, 1.0);

    gl_FragColor = vec4(uColor, alpha * 0.5);
}