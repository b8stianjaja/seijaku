varying vec3 vViewPosition;
varying vec3 vWorldNormal;

uniform vec3 uColorWater;
uniform vec3 uColorDeep;
uniform vec3 uSunPosition;

// Safe power function
float safe_pow(float x, float y) {
    return pow(max(0.0, x), y);
}

void main() {
    vec3 viewDir = normalize(vViewPosition);
    vec3 normal = normalize(vWorldNormal);
    
    // Invert normal because we are looking form BELOW the surface
    vec3 surfaceNormal = -normal; 
    
    // --- THE NAIL: CHROMATIC DISPERSION ---
    // Real water splits light like a prism.
    // We calculate Refraction for Red, Green, and Blue separately.
    
    float ior = 1.333;
    float spread = 0.015; // How much the rainbow spreads
    
    // Calculate 3 distinct refraction vectors
    vec3 refractR = refract(viewDir, surfaceNormal, 1.0 / (ior - spread));
    vec3 refractG = refract(viewDir, surfaceNormal, 1.0 / ior);
    vec3 refractB = refract(viewDir, surfaceNormal, 1.0 / (ior + spread));
    
    // Helper to get Sky or Deep color for a single channel
    // This allows the R, G, and B channels to "switch" to sky at different angles
    vec3 colorR, colorG, colorB;
    
    // RED CHANNEL
    if (length(refractR) > 0.0 && refractR.y > 0.0) {
        float sunMix = max(0.0, dot(refractR, normalize(uSunPosition)));
        sunMix = safe_pow(sunMix, 20.0);
        colorR = mix(vec3(0.5, 0.7, 0.9), vec3(1.0), sunMix); // Sky
    } else {
        colorR = uColorDeep; // Deep
    }

    // GREEN CHANNEL
    if (length(refractG) > 0.0 && refractG.y > 0.0) {
        float sunMix = max(0.0, dot(refractG, normalize(uSunPosition)));
        sunMix = safe_pow(sunMix, 20.0);
        colorG = mix(vec3(0.5, 0.7, 0.9), vec3(1.0), sunMix);
    } else {
        colorG = uColorDeep;
    }

    // BLUE CHANNEL
    if (length(refractB) > 0.0 && refractB.y > 0.0) {
        float sunMix = max(0.0, dot(refractB, normalize(uSunPosition)));
        sunMix = safe_pow(sunMix, 20.0);
        colorB = mix(vec3(0.5, 0.7, 0.9), vec3(1.0), sunMix);
    } else {
        colorB = uColorDeep;
    }
    
    // Recombine the separated channels
    // We only take the specific component (R from colorR, etc.)
    vec3 refractedColor = vec3(colorR.r, colorG.g, colorB.b);
    
    // Fresnel attenuation (Surface reflection)
    // When looking at a shallow angle, the surface acts like a mirror
    float fresnel = 0.02 + 0.98 * safe_pow(1.0 - dot(-viewDir, surfaceNormal), 5.0);
    
    // Mix refraction with the water tint
    vec3 finalColor = mix(refractedColor, uColorWater, 0.25); 

    // Add a bit of the deep color back in based on fresnel for volume illusion
    finalColor = mix(finalColor, uColorDeep, fresnel * 0.5);

    gl_FragColor = vec4(finalColor, 0.95); // High opacity, let the refraction do the work
    
    #include <colorspace_fragment>
}