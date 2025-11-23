uniform float uTime;
uniform vec3 uColor;
uniform float uDistortion;
uniform float uSpeed;
uniform sampler2D envMap; // The HDRI texture

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

#define PI 3.14159265359

// --- Noise Functions (Ashima Arts) ---
vec3 mod289(vec3 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec2 mod289(vec2 x) { return x - floor(x * (1.0 / 289.0)) * 289.0; }
vec3 permute(vec3 x) { return mod289(((x*34.0)+1.0)*x); }

float snoise(vec2 v) {
  const vec4 C = vec4(0.211324865405187, 0.366025403784439, -0.577350269189626, 0.024390243902439);
  vec2 i  = floor(v + dot(v, C.yy) );
  vec2 x0 = v - i + dot(i, C.xx);
  vec2 i1;
  i1 = (x0.x > x0.y) ? vec2(1.0, 0.0) : vec2(0.0, 1.0);
  vec4 x12 = x0.xyxy + C.xxzz;
  x12.xy -= i1;
  i = mod289(i);
  vec3 p = permute( permute( i.y + vec3(0.0, i1.y, 1.0 )) + i.x + vec3(0.0, i1.x, 1.0 ));
  vec3 m = max(0.5 - vec3(dot(x0,x0), dot(x12.xy,x12.xy), dot(x12.zw,x12.zw)), 0.0);
  m = m*m ;
  m = m*m ;
  vec3 x = 2.0 * fract(p * C.www) - 1.0;
  vec3 h = abs(x) - 0.5;
  vec3 ox = floor(x + 0.5);
  vec3 a0 = x - ox;
  m *= 1.79284291400159 - 0.85373472095314 * ( a0*a0 + h*h );
  vec3 g;
  g.x  = a0.x  * x0.x  + h.x  * x0.y;
  g.yz = a0.yz * x12.xz + h.yz * x12.yw;
  return 130.0 * dot(m, g);
}

// Equirectangular mapping helper
vec2 equirectangularMapping(vec3 dir) {
    vec2 uv = vec2(atan(dir.z, dir.x), asin(dir.y));
    uv *= vec2(0.1591, 0.3183); // inv(2*PI), inv(PI)
    uv += 0.5;
    return uv;
}

void main() {
    // 1. View Vector
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    // 2. Generate Surface Noise (Ripples)
    float t = uTime * uSpeed;
    float noise1 = snoise(vUv * 10.0 + t);
    float noise2 = snoise(vUv * 25.0 - t * 0.5);
    
    // Combine noise to perturb the normal
    vec3 normalOffset = vec3(noise1 + noise2, 1.0, noise1 - noise2) * uDistortion * 0.1;
    vec3 normal = normalize(vWorldNormal + normalOffset);

    // 3. Reflection (Environment Mapping)
    vec3 reflectDir = reflect(-viewDir, normal);
    vec2 envUv = equirectangularMapping(normalize(reflectDir));
    vec3 reflectionColor = texture2D(envMap, envUv).rgb;

    // 4. Fresnel Effect (Darker at center, reflective at edges)
    float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
    fresnel = clamp(fresnel, 0.0, 1.0);

    // 5. Combine: Obsidian Base + Reflection
    vec3 finalColor = mix(uColor, reflectionColor, fresnel * 0.8 + 0.2);

    gl_FragColor = vec4(finalColor, 1.0);
    
    // Tone mapping (simple reinhard to avoid blown out whites)
    gl_FragColor.rgb = gl_FragColor.rgb / (gl_FragColor.rgb + vec3(1.0));
}