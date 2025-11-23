import { useProgress } from '@react-three/drei'
import { useEffect, useState } from 'react'

export default function Loader() {
  const { active, progress } = useProgress()
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    let timer: ReturnType<typeof setTimeout>

    if (active) {
      setVisible(true)
    } else {
      // Wait 800ms for a smoother fade-out animation
      timer = setTimeout(() => {
        setVisible(false)
      }, 800)
    }

    return () => clearTimeout(timer)
  }, [active])

  if (!visible) return null

  return (
    <div className={`loader-container ${active ? '' : 'fading-out'}`}>
      <div className="loader-content">
        <h1 className="loader-title" style={{ 
          fontFamily: '"Playfair Display", serif',
          color: '#b76e79',
          fontSize: '1.5rem' 
        }}>
          Lumina Aesthetics
        </h1>
        
        <div className="progress-track" style={{ background: 'rgba(183, 110, 121, 0.1)' }}>
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%`, background: '#b76e79' }} 
          />
        </div>
        
        <p className="loader-text" style={{ color: '#4a4a4a' }}>
          Preparing Experience... {progress.toFixed(0)}%
        </p>
      </div>
    </div>
  )
}