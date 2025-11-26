varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vViewPosition;
varying vec3 vNormal;
varying float vElevation;

uniform float uTime;
uniform float uSpeed;
uniform float uElevation;
uniform float uNoiseFrequency;

float hash(vec2 p) {
    return fract(sin(dot(p, vec2(12.9898, 78.233))) * 43758.5453);
}

float noise(vec3 x) {
    const vec3 step = vec3(110, 241, 171);
    vec3 i = floor(x);
    vec3 f = fract(x);
    float n = dot(i, step);
    vec3 u = f * f * (3.0 - 2.0 * f);
    return mix(mix(mix( hash(i.xy + vec2(0,0)), hash(i.xy + vec2(1,0)), u.x),
                   mix( hash(i.xy + vec2(0,1)), hash(i.xy + vec2(1,1)), u.x), u.y),
               mix(mix( hash(i.xy + vec2(0,0)), hash(i.xy + vec2(1,0)), u.x),
                   mix( hash(i.xy + vec2(0,1)), hash(i.xy + vec2(1,1)), u.x), u.y), u.z);
}

float getWaveHeight(vec3 p) {
    float height = 0.0;
    float amp = uElevation;
    float freq = uNoiseFrequency;
    
    // RIVER FLOW LOGIC:
    // Move the noise domain along Z to simulate current
    vec3 flowP = p;
    flowP.z += uTime * uSpeed; 

    for(int i = 0; i < 3; i++) {
        height += noise(vec3(flowP.xz * freq, uTime * uSpeed * 0.2)) * amp;
        amp *= 0.5;
        freq *= 2.0;
    }
    return height;
}

void main() {
    vUv = uv;
    vec4 modelPosition = modelMatrix * vec4(position, 1.0);
    
    float elevation = getWaveHeight(modelPosition.xyz);
    modelPosition.y += elevation;
    vElevation = elevation;

    // Normal Calc
    float eps = 0.05;
    float hA = getWaveHeight(modelPosition.xyz + vec3(eps, 0.0, 0.0));
    float hB = getWaveHeight(modelPosition.xyz + vec3(0.0, 0.0, -eps));
    
    vec3 computedNormal = normalize(vec3(
        elevation - hA, 
        eps, 
        elevation - hB
    ));

    vNormal = normalize(normalMatrix * computedNormal);
    vWorldPosition = modelPosition.xyz;
    vViewPosition = (viewMatrix * modelPosition).xyz;

    gl_Position = projectionMatrix * viewMatrix * modelPosition;
}