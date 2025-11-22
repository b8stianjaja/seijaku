import { Leva } from 'leva'
import { useStore } from '@state/index'
import SceneRoot from '@webgl/SceneRoot'
import InterfaceRoot from '@interface/InterfaceRoot'
import Loader from '@interface/Loader'
import '@styles/main.scss'

export default function App() {
  const debug = useStore((state) => state.debug)

  return (
    <>
      {/* 1. The 3D Layer */}
      <SceneRoot />

      {/* 2. The DOM Layer */}
      <InterfaceRoot />
      
      {/* 3. The Loading Layer */}
      <Loader />

      {/* 4. The Debug Layer */}
      <Leva hidden={!debug} />
    </>
  )
}