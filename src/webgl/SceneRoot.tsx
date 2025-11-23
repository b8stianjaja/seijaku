import { Canvas } from '@react-three/fiber'
import { Float, Environment, ContactShadows, MeshTransmissionMaterial, Sphere } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { useStore } from '@state/index'

export default function SceneRoot() {
  const debug = useStore((state) => state.debug)

  return (
    <Canvas
      className="canvas-layer"
      shadows
      dpr={[1, 2]} // Support high-res displays
      camera={{ position: [0, 0, 14], fov: 30 }}
      eventSource={document.getElementById('root')!}
    >
      {/* Background: Washi Paper Tone */}
      <color attach="background" args={['#F2F0EB']} />
      
      {/* Lighting: High-quality Studio HDRI for crisp reflections */}
      <Environment files="https://dl.polyhaven.org/file/ph-assets/HDRIs/hdr/1k/studio_small_09_1k.hdr" />
      
      {/* THE MODEL: A Floating Water Droplet
          Simple geometry + complex material = Seijaku.
      */}
      <Float 
        speed={2} 
        rotationIntensity={0.5} 
        floatIntensity={1} 
        floatingRange={[-0.5, 0.5]}
      >
        <Sphere args={[1.5, 64, 64]} castShadow>
          <MeshTransmissionMaterial 
            backside
            backsideThickness={1}
            thickness={3}          // Deep water look
            roughness={0.02}       // Highly polished
            transmission={1}       // Perfectly clear
            chromaticAberration={0.03} // Subtle prism effect at edges
            anisotropicBlur={0.1}
            distortion={0.3}       // Creates the "fluid" wobble
            distortionScale={0.4}  // Large, gentle waves
            temporalDistortion={0.1} // Moves slowly over time
            color="#ffffff"
            ior={1.33}             // 1.33 is the Index of Refraction for Water
          />
        </Sphere>
      </Float>

      {/* Grounding Shadow */}
      <ContactShadows 
        position={[0, -3, 0]} 
        opacity={0.3} 
        scale={20} 
        blur={2.5} 
        far={5} 
        color="#8C8883" 
      />

      {/* Debug Overlay */}
      {debug && <Perf position="top-left" />}
    </Canvas>
  )
}