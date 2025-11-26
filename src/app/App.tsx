import { Leva } from 'leva'
import { useStore } from '@state/index'
// Fix: Use named import to match 'export const SceneRoot'
import { SceneRoot } from '@webgl/SceneRoot'
import InterfaceRoot from '@interface/InterfaceRoot'
import Loader from '@interface/Loader'
import '@styles/main.scss'

export default function App() {
  const debug = useStore((state) => state.debug)

  return (
    <>
      {/* 1. The 3D Layer - Renders the Canvas */}
      <SceneRoot />

      {/* 2. The DOM Layer - UI Overlays (Pointer events handled in CSS) */}
      <InterfaceRoot />
      
      {/* 3. The Loading Layer - Global loader state */}
      <Loader />

      {/* 4. The Debug Layer - Controlled by Zustand state */}
      {/* We hide Leva when debug is false, keeping the DOM clean */}
      <Leva hidden={!debug} collapsed={false} />
    </>
  )
}