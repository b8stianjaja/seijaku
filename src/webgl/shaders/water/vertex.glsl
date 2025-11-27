varying vec2 vUv;
varying vec3 vViewPosition;
varying vec3 vWorldNormal;

uniform float uTime;

// Simple, fast noise function
float hash(vec2 p) { return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453); }
float noise(vec2 p) {
    vec2 i = floor(p);
    vec2 f = fract(p);
    vec2 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(hash(i + vec2(0.0,0.0)), hash(i + vec2(1.0,0.0)), u.x),
               mix(hash(i + vec2(0.0,1.0)), hash(i + vec2(1.0,1.0)), u.x), u.y);
}

void main() {
    vUv = uv;
    vec3 pos = position;
    
    // Gentle rolling waves simulation
    float speed = 0.5;
    vec2 flow = vec2(pos.x * 0.2, pos.z * 0.2 + uTime * speed * 0.2);
    
    float height = noise(flow) * 1.5;
    height += noise(flow * 3.4 + uTime) * 0.2;
    
    pos.y += height;

    vec4 worldPos = modelMatrix * vec4(pos, 1.0);
    vViewPosition = worldPos.xyz - cameraPosition;
    
    // Approximate normal for lighting (cheap version)
    float eps = 0.1;
    float h1 = noise(vec2((pos.x + eps) * 0.2, flow.y));
    float h2 = noise(vec2(pos.x * 0.2, flow.y + eps));
    vec3 n = normalize(vec3(height - h1, eps, height - h2));
    vWorldNormal = normalize(mat3(modelMatrix) * n);

    gl_Position = projectionMatrix * viewMatrix * worldPos;
}