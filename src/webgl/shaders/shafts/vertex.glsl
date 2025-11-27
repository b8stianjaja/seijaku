varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    // We still pass view position if needed, but the main logic is now World-based
    vViewPosition = worldPos.xyz - cameraPosition;
    
    gl_Position = projectionMatrix * viewMatrix * worldPos;
}