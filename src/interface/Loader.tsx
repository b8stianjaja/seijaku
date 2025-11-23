import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'
import { useStore } from '@state/index'

export default function Loader() {
  const { active, progress } = useProgress()
  const [visible, setVisible] = useState(true)
  const setAppReady = useStore((state) => state.setAppReady)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (!active && progress === 100) {
      // Wait 800ms for a smoother fade-out animation
      timer = setTimeout(() => {
        setVisible(false)
        setAppReady(true) // <--- Trigger the interface entrance
      }, 800)
    }

    return () => clearTimeout(timer)
  }, [active, progress, setAppReady])

  if (!visible) return null

  return (
    <div className={`loader-container ${active ? '' : 'fading-out'}`}>
      <div className="loader-content">
        {/* FIXED: Brand Name */}
        <h1 className="loader-title" style={{ 
          fontFamily: '"Playfair Display", serif',
          color: '#2C2C2C', // Sumi ink
          fontSize: '1.5rem',
          letterSpacing: '0.1em',
          textTransform: 'uppercase'
        }}>
          Seijaku
        </h1>
        
        <div className="progress-track" style={{ background: 'rgba(44, 44, 44, 0.1)' }}>
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%`, background: '#8C8883' }} 
          />
        </div>
        
        <p className="loader-text" style={{ color: '#8C8883', fontFamily: '"Helvetica Neue", sans-serif' }}>
          Tranquility Loading... {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  )
}