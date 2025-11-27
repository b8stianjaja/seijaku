import { Environment } from '@react-three/drei'
import { EffectComposer, Bloom, Noise, Vignette } from '@react-three/postprocessing'
import Water from './components/Water'
import SunShafts from './components/SunShafts'
import RiverBed from './components/RiverBed'
import Particles from './components/Particles'

export default function Experience() {
  return (
    <>
      <Environment preset="city" />
      <color attach="background" args={['#00101a']} />
      <fog attach="fog" args={['#00101a', 5, 40]} />

      <group>
          <RiverBed />
          <SunShafts />
          <Particles />
          <Water /> 
      </group>

      {/* FIXED: Removed disableNormalPass */}
      <EffectComposer multisampling={0}>
        <Bloom 
            luminanceThreshold={0.8} 
            intensity={0.5} 
            mipmapBlur 
            radius={0.6}
        />
        <Noise opacity={0.03} />
        <Vignette darkness={0.4} />
      </EffectComposer>
    </>
  )
}