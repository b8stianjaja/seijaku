import { useStore } from '@state/index'

export default function InterfaceRoot() {
  const { debug, toggleDebug } = useStore()

  return (
    <div className="interface-layer">
      <div style={{ 
        position: 'absolute', 
        bottom: 40, 
        left: 40, 
        color: 'white' 
      }}>
        <h1 style={{ margin: 0, fontSize: '1.5rem' }}>Excellencia Engine</h1>
        <p style={{ opacity: 0.6, marginTop: '0.5rem' }}>Production Template</p>
        
        <button 
          onClick={toggleDebug}
          style={{ 
            marginTop: '1rem', 
            padding: '12px 24px', 
            background: 'white', 
            color: 'black',
            border: 'none',
            borderRadius: '4px',
            fontWeight: 'bold',
            cursor: 'pointer' 
          }}
        >
          {debug ? 'HIDE DEBUG' : 'SHOW DEBUG'}
        </button>
      </div>
    </div>
  )
}