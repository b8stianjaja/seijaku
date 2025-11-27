varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform float uTime;
uniform vec3 uColor;
uniform vec3 uSunPosition;

// Rotate logic to align rays with sun direction
vec2 rotate(vec2 v, float a) {
    float s = sin(a);
    float c = cos(a);
    return mat2(c, -s, s, c) * v;
}

void main() {
    // 1. PHYSICS: ALIGNMENT
    // Calculate the direction of the sun on the horizon (XZ plane)
    vec3 sunDir = normalize(uSunPosition);
    float sunAngle = atan(sunDir.x, sunDir.z);

    // Rotate our world coordinates to face the sun.
    // This ensures the "waves" of light are perpendicular to the light source.
    vec2 alignedPos = rotate(vWorldPosition.xz, -sunAngle);

    // 2. CAUSTIC GENERATION (The "Curtains")
    // Real underwater shafts are projections of surface wave caustics.
    // We simulate this by crossing two sine waves in Cartesian space (not Polar).
    
    // Wave 1: Main swell direction
    float wave1 = sin(alignedPos.x * 0.5 + uTime * 0.2); 
    
    // Wave 2: Crossing interference (creates the "net" pattern of caustics)
    // We offset the angle slightly for the second wave
    vec2 crossingPos = rotate(alignedPos, 0.5); 
    float wave2 = sin(crossingPos.x * 0.8 - uTime * 0.15);

    // Combine: The 'max' operation creates sharp peaks (focus points of light)
    float caustics = max(0.0, wave1 + wave2 - 0.5); // -0.5 threshold sharpens the rays
    caustics = pow(caustics, 4.0); // Power creates defined "shafts" vs muddy fog

    // 3. ATTENUATION (Depth & Edge)
    
    // Vertical: Light absorbs as it goes deeper.
    // vUv.y=1 is Surface, vUv.y=0 is Deep.
    float depthFade = smoothstep(0.0, 1.0, vUv.y); 
    depthFade = pow(depthFade, 1.5); // Beer's Law approximation (exponential decay)

    // Radial: Soften the edges of our giant cylinder volume so it blends seamlessly
    float distFromCenter = length(vWorldPosition.xz);
    float containerFade = smoothstep(50.0, 30.0, distFromCenter);

    // 4. MIE SCATTERING (The "Glare" physics)
    // Volumetric light is brightest when looking TOWARDS the light source.
    vec3 viewDir = normalize(vViewPosition); // Camera -> Pixel
    vec3 lightDir = normalize(uSunPosition - vWorldPosition);
    
    // Phase function: How much does the water scatter light towards the camera?
    float phase = max(0.0, dot(viewDir, lightDir));
    float scattering = pow(phase, 8.0); // High power = strong forward scattering

    // 5. COMPOSITE
    // The shaft visibility depends on:
    // - The Caustic Pattern exists there
    // - We are not too deep (depthFade)
    // - We are looking roughly towards the sun (scattering boosts it)
    
    float alpha = caustics * depthFade * containerFade;
    
    // Mix scattering: It creates a base glow + boosts the shafts
    // We keep base opacity low (0.05) so it's transparent "glassy" water
    float finalAlpha = alpha * 0.1 + (scattering * alpha * 0.4);

    gl_FragColor = vec4(uColor, clamp(finalAlpha, 0.0, 1.0));
}