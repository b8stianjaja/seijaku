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
      // Wait 500ms for the fade-out animation before unmounting
      timer = setTimeout(() => {
        setVisible(false)
      }, 500)
    }

    return () => clearTimeout(timer)
  }, [active])

  if (!visible) return null

  return (
    <div className={`loader-container ${active ? '' : 'fading-out'}`}>
      <div className="loader-content">
        <h1 className="loader-title">Excellencia</h1>
        
        <div className="progress-track">
          <div 
            className="progress-bar" 
            style={{ width: `${progress}%` }} 
          />
        </div>
        
        <p className="loader-text">{progress.toFixed(0)}% Loaded</p>
      </div>
    </div>
  )
}