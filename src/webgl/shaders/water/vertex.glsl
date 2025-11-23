varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

uniform float uTime;

// Smoother, rolling swells
float getElevation(vec2 uv) {
    // Wave 1: Very large, slow swell
    float elevation = sin(uv.x * 0.3 + uTime * 0.1) * sin(uv.y * 0.2 + uTime * 0.1) * 0.4;
    
    // Wave 2: Subtle secondary variation
    elevation += sin(uv.x * 0.8 - uTime * 0.05) * 0.1;
    
    return elevation;
}

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);

    // Apply elevation
    float elevation = getElevation(modelPosition.xz);
    modelPosition.y += elevation;

    vWorldPosition = modelPosition.xyz;
    
    // Recalculate normal approximation for the large swells
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}