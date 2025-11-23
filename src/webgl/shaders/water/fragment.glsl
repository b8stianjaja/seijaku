uniform float uTime;
uniform vec3 uColor;
uniform float uDistortion;
uniform float uSpeed;
uniform vec3 uSunPosition; 
uniform sampler2D envMap;

varying vec2 vUv;
varying vec3 vWorldPosition;
varying vec3 vWorldNormal;

#define PI 3.14159265359

// --- Noise Functions ---
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

vec2 equirectangularMapping(vec3 dir) {
    vec2 uv = vec2(atan(dir.z, dir.x), asin(dir.y));
    uv *= vec2(0.1591, 0.3183);
    uv += 0.5;
    return uv;
}

void main() {
    vec3 viewDir = normalize(cameraPosition - vWorldPosition);

    float t = uTime * uSpeed;
    
    // REDUCED FREQUENCY: Makes the ripples larger and smoother
    float noise1 = snoise(vUv * 4.0 + t * 0.4); 
    float noise2 = snoise(vUv * 12.0 - t * 0.6); 
    
    // Perturb normal
    vec3 normalOffset = vec3(noise1 + noise2, 1.0, noise1 - noise2) * uDistortion * 0.15; 
    vec3 normal = normalize(vWorldNormal + normalOffset);

    // Reflection
    vec3 reflectDir = reflect(-viewDir, normal);
    vec2 envUv = equirectangularMapping(normalize(reflectDir));
    
    vec3 reflectionColor = texture2D(envMap, envUv).rgb;
    reflectionColor *= 1.2; 

    // Fresnel
    float fresnel = pow(1.0 - dot(viewDir, normal), 3.0);
    fresnel = clamp(fresnel, 0.0, 1.0);

    // Specular (Sun)
    vec3 sunDir = normalize(uSunPosition - vWorldPosition);
    vec3 halfVector = normalize(sunDir + viewDir);
    float NdotH = max(0.0, dot(normal, halfVector));
    
    // SOFTENED HIGHLIGHT
    float specular = pow(NdotH, 50.0); 
    
    // Mix Base + Reflection
    vec3 mixColor = mix(uColor, reflectionColor, fresnel * 0.8 + 0.2);
    
    // Add specular (Cleaned calculation)
    vec3 finalColor = mixColor + (vec3(0.9) * specular);

    gl_FragColor = vec4(finalColor, 1.0);
    
    // Tone mapping
    gl_FragColor.rgb = gl_FragColor.rgb / (gl_FragColor.rgb + vec3(1.0));
    gl_FragColor.rgb = pow(gl_FragColor.rgb, vec3(1.0 / 2.2));
}