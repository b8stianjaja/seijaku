varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;

uniform vec3 uColorSurface;
uniform vec3 uColorDeep;
uniform vec3 uSunPosition;
uniform float uTime;

float safe_pow(float x, float y) {
    return pow(max(0.0, x), y);
}

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);
    vec3 normal = normalize(vNormal);
    vec3 sunDir = normalize(uSunPosition - vWorldPosition);

    // 1. Fresnel (Snell's Window)
    float NdotV = max(0.0, dot(normal, viewDir));
    float fresnel = safe_pow(1.0 - NdotV, 4.0);

    // 2. SPECTRAL SPECULAR (The "Diamond" Effect)
    // We calculate specular highlight for R, G, and B separately
    // by slightly bending the normal for each channel (Dispersion)
    
    vec3 halfVec = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(normal, halfVec));
    
    // Base Specular Intensity
    float specBase = safe_pow(NdotH, 600.0); 
    
    // Chromatic Shift
    // Green is center, Red/Blue are offset
    float specR = safe_pow(NdotH * 0.995, 600.0); 
    float specG = specBase;
    float specB = safe_pow(NdotH * 1.005, 600.0);
    
    vec3 specularColor = vec3(specR, specG, specB) * 6.0; // Bright!

    // 3. Background/Refraction
    // Very clear water (pale tint)
    vec3 waterColor = mix(uColorSurface, uColorDeep, fresnel * 0.8);
    
    // 4. Final Composite
    vec3 finalColor = waterColor + specularColor;

    // 5. Alpha / Transmission
    // Center = 0.02 (Glass clear), Edges = Reflector
    float alpha = 0.02 + (0.95 * fresnel);
    
    // Ensure the sun highlight is always solid
    float maxSpec = max(specR, max(specG, specB));
    alpha = max(alpha, maxSpec);

    gl_FragColor = vec4(finalColor, clamp(alpha, 0.0, 1.0));
    
    #include <colorspace_fragment>
}