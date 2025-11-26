varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

void main() {
    vUv = uv;
    
    // Standard transforms
    vec4 worldPos = modelMatrix * vec4(position, 1.0);
    vWorldPosition = worldPos.xyz;
    
    vec4 viewPos = viewMatrix * worldPos;
    vViewPosition = -viewPos.xyz; // Direction from camera to pixel
    
    gl_Position = projectionMatrix * viewPos;
}