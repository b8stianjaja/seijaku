import { PerspectiveCamera, Environment } from '@react-three/drei'
import { Perf } from 'r3f-perf'
import { EffectComposer, Bloom, Vignette, Noise, TiltShift2 } from '@react-three/postprocessing'
import { useStore } from '@state/index'
import Water from './components/Water'
import Particles from './components/Particles'
import SunShafts from './components/SunShafts'
import RiverBed from './components/RiverBed'

export default function Experience() {
  const debug = useStore((state) => state.debug)

  return (
    <>
      {debug && <Perf position="top-left" />}
      
      <PerspectiveCamera 
        makeDefault 
        position={[0, -5, 5]} 
        rotation={[0.3, 0, 0]} 
        fov={65}
      />

      <Environment preset="city" />

      <color attach="background" args={['#000a12']} />
      <fog attach="fog" args={['#000a12', 5, 40]} />

      <group>
          <Water />
          <SunShafts />
          <Particles />
          <RiverBed />
      </group>

      <EffectComposer disableNormalPass>
        {/* @ts-ignore */}
        <Bloom 
            luminanceThreshold={0.65} 
            intensity={0.6} 
            mipmapBlur
            radius={0.4}
        />
        
        {/* @ts-ignore */}
        <TiltShift2 blur={0.15} />
        
        {/* @ts-ignore */}
        <Vignette darkness={0.5} offset={0.3} />
        
        {/* @ts-ignore */}
        <Noise opacity={0.03} /> 
      </EffectComposer>
    </>
  )
}