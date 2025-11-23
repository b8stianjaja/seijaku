import { shaderMaterial } from '@react-three/drei'
import { extend } from '@react-three/fiber'
import * as THREE from 'three'
import vertexShader from '../shaders/water/vertex.glsl'
import fragmentShader from '../shaders/water/fragment.glsl'

const WaterMaterial = shaderMaterial(
  {
    uTime: 0,
    uColor: new THREE.Color('#000000'),
    uDistortion: 0.5,
    uSpeed: 0.2,
    envMap: null, 
  },
  vertexShader,
  fragmentShader
)

extend({ WaterMaterial })

// TypeScript support for the new element
declare global {
  namespace JSX {
    interface IntrinsicElements {
      // eslint-disable-next-line @typescript-eslint/no-explicit-any
      waterMaterial: any
    }
  }
}

export { WaterMaterial }