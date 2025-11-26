import { PerspectiveCamera, Environment } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { EffectComposer, Bloom, Vignette, Noise, TiltShift2 } from '@react-three/postprocessing'
import { useStore } from '@state/index'
import Water from './components/Water'
import SunShafts from './components/SunShafts'
import RiverBed from './components/RiverBed'

export default function Experience() {
  const debug = useStore((state) => state.debug)

  return (
    <>
      {debug && <Perf position="top-left" />}
      
      {/* Cinematic Wide Angle */}
      <PerspectiveCamera 
        makeDefault 
        position={[0, -6, 5]} 
        rotation={[0.6, 0, 0]} 
        fov={90}
      />

      {/* HDRI for Water Reflections */}
      <Environment preset="city" blur={0.5} />

      {/* Deep Ocean Background */}
      <color attach="background" args={['#00101a']} />
      <fog attach="fog" args={['#00101a', 5, 60]} />

      <group>
          <RiverBed />
          <SunShafts />
          {/* Water MUST be rendered last if transparent, but Transmission handles it */}
          <Water />
      </group>

      <EffectComposer disableNormalPass>
        {/* @ts-ignore */}
        <Bloom 
            luminanceThreshold={0.7} 
            intensity={0.8} 
            mipmapBlur
            radius={0.5}
        />
        
        {/* @ts-ignore */}
        <TiltShift2 blur={0.05} />
        
        {/* @ts-ignore */}
        <Vignette darkness={0.5} offset={0.2} />
        
        {/* @ts-ignore */}
        <Noise opacity={0.02} /> 
      </EffectComposer>
    </>
  )
}