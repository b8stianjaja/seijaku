varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vNormal;
varying float vElevation;

uniform vec3 uColorDeep;
uniform vec3 uColorSurface;
uniform vec3 uSunPosition;
uniform float uTime;
uniform float uShininess;
uniform float uReflectivity;

// Voronoi Crystal Pattern
float voronoi(vec2 x) {
    vec2 n = floor(x);
    vec2 f = fract(x);
    float dist = 1.0;
    for(int j=-1; j<=1; j++) {
        for(int i=-1; i<=1; i++) {
            vec2 b = vec2(i, j);
            vec2 r = vec2(b) - f + fract(sin(dot(n + b, vec2(127.1, 311.7))) * 43758.5453);
            float d = length(r);
            dist = min(dist, d);
        }
    }
    return dist;
}

float getLightIntensity(vec2 uv, vec3 viewDir, vec3 normal, vec3 sunDir, float offset) {
    // Distort UVs based on normal for refraction
    vec2 distortedUV = uv + (normal.xz * 0.15 * offset); // Stronger distortion for river
    
    // Add flow to the voronoi pattern
    distortedUV.y += uTime * 0.1; 

    float crystal = voronoi(distortedUV * 2.5);
    crystal = smoothstep(0.05, 0.6, crystal);
    
    vec3 halfVec = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(normal, halfVec));
    float light = pow(NdotH, uShininess);
    
    return light + (light * crystal * 1.5);
}

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunPosition);

    // 1. Fresnel / Snell's Window
    float viewingAngle = dot(viewDir, normal);
    float fresnel = pow(1.0 - abs(viewingAngle), 2.5);

    // 2. Chromatic Aberration
    vec2 baseUV = vWorldPosition.xz * 0.4;
    float aberration = 0.015;
    
    float r = getLightIntensity(baseUV, viewDir, normal, sunDir, 1.0 + aberration);
    float g = getLightIntensity(baseUV, viewDir, normal, sunDir, 1.0);
    float b = getLightIntensity(baseUV, viewDir, normal, sunDir, 1.0 - aberration);
    
    vec3 crystalLight = vec3(r, g, b);

    // 3. River Volume Colors
    // Mix based on "thickness" of looking through the water
    vec3 waterColor = mix(uColorSurface, uColorDeep, fresnel * 1.2);
    
    vec3 finalColor = waterColor;
    
    // Add crystal light (fades at horizon)
    finalColor += crystalLight * uColorSurface * 2.5 * smoothstep(0.0, 0.3, viewingAngle);

    // 4. Sun Glow (Volumetric feel)
    float sunGlow = max(0.0, dot(viewDir, sunDir));
    sunGlow = pow(sunGlow, 8.0);
    finalColor += vec3(1.0, 1.0, 0.8) * sunGlow * 0.4;

    // 5. DISTANCE FOG (Crucial for "Deep" look)
    // Calculate distance from camera to this pixel
    float dist = length(vWorldPosition - cameraPosition);
    // Fog starts at 5 units, ends at 25 units
    float fogFactor = smoothstep(5.0, 25.0, dist);
    
    // Blend final color into the deep background color
    finalColor = mix(finalColor, uColorDeep, fogFactor);

    gl_FragColor = vec4(finalColor, 1.0);
    
    #include <colorspace_fragment>
}