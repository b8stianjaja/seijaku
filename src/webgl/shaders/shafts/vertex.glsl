varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;

uniform float uTime;

void main() {
    vUv = uv;
    
    vec3 pos = position;
    
    // Subtle underwater Sway
    // Only sway the bottom vertices (where y is lower)
    float sway = sin(uTime * 0.5 + pos.y) * 0.5;
    if(pos.y < 0.0) {
        pos.x += sway;
        pos.z += sway;
    }

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vWorldPosition = worldPos.xyz;
    
    vec4 viewPos = viewMatrix * worldPos;
    vViewPosition = -viewPos.xyz; // View direction relative to camera
    
    gl_Position = projectionMatrix * viewPos;
}