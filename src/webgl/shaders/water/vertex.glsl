varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

uniform float uTime;

// Smoother, rolling swells (Longer wavelength, lower amplitude)
float getElevation(vec2 uv) {
    // Wave 1: Large diagonal swell
    float elevation = sin(uv.x * 0.5 + uTime * 0.3) * sin(uv.y * 0.3 + uTime * 0.2) * 0.5;
    // Wave 2: Secondary gentle ripple
    elevation += sin(uv.x * 1.0 - uTime * 0.2) * 0.1;
    return elevation;
}

void main() {
    vUv = uv;

    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    // Apply the smoother elevation
    float elevation = getElevation(modelPosition.xz);
    modelPosition.y += elevation;

    vWorldPosition = modelPosition.xyz;

    // We keep the base normal pointing up. 
    // The Fragment shader handles the detailed surface lighting.
    vWorldNormal = normalize(mat3(modelMatrix) * normal);

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}