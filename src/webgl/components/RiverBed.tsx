import { Caustics } from '@react-three/drei'

export default function RiverBed() {
  return (
    <group position={[0, -8, 0]}> 
      <Caustics
        color="#ffffff"
        lightSource={[5, 10, -5]}
        intensity={2}
        worldRadius={20}
        ior={1.4}
        backside={false}
        causticsOnly={false} // Fixed: Required prop in stricter TS types
      >
        <mesh rotation={[-Math.PI / 2, 0, 0]} receiveShadow>
          <planeGeometry args={[60, 60]} />
          <meshStandardMaterial 
            color="#0b1a24"
            roughness={0.8}
            metalness={0.2}
          />
        </mesh>
      </Caustics>
    </group>
  )
}