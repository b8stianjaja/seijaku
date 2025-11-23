import { useStore } from '@state/index'

export default function InterfaceRoot() {
  const { debug, toggleDebug } = useStore()

  const services = [
    { id: 'lashes', label: 'Lash Extensions' },
    { id: 'nails', label: 'Nail Artistry' },
    { id: 'brows', label: 'Microblading' },
    { id: 'facial', label: 'Hydration' },
  ]

  return (
    <div className="interface-layer">
      {/* Brand Header (Centered Top) - Editorial Style */}
      <div style={{ 
        position: 'absolute', 
        top: 60, 
        width: '100%', 
        textAlign: 'center',
        pointerEvents: 'none' 
      }}>
        <h1 style={{ 
          margin: 0, 
          fontSize: '4rem', 
          fontFamily: '"Playfair Display", serif',
          fontWeight: 400,
          color: '#2C2C2C',
          letterSpacing: '-0.02em'
        }}>
          SEIJAKU
        </h1>
        <p style={{ 
          margin: '10px 0 0',
          fontSize: '0.7rem', 
          textTransform: 'uppercase', 
          letterSpacing: '0.3em',
          color: '#8C8883'
        }}>
          Tranquility in Beauty
        </p>
      </div>

      {/* Services Menu (Bottom Left) */}
      <div style={{ 
        position: 'absolute', 
        bottom: 60, 
        left: 60, 
        pointerEvents: 'auto' 
      }}>
        <ul style={{ listStyle: 'none', padding: 0, margin: 0 }}>
          {services.map((s) => (
            <li key={s.id} style={{ marginBottom: '1rem' }}>
              <button 
                className="service-link"
                style={{ 
                  background: 'none', 
                  border: 'none', 
                  fontSize: '1.1rem', 
                  cursor: 'pointer',
                  color: '#555',
                  fontFamily: '"Helvetica Neue", sans-serif',
                  fontWeight: 300,
                  textAlign: 'left',
                  padding: 0,
                  transition: 'all 0.4s ease',
                  letterSpacing: '0.05em'
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.paddingLeft = '10px';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.color = '#555';
                  e.currentTarget.style.paddingLeft = '0px';
                }}
              >
                {s.label}
              </button>
            </li>
          ))}
        </ul>
      </div>

      {/* Book Appointment (Bottom Right) */}
      <div style={{ 
        position: 'absolute', 
        bottom: 60, 
        right: 60, 
        textAlign: 'right',
        pointerEvents: 'auto'
      }}>
        <button style={{
          background: '#2C2C2C',
          color: '#F2F0EB',
          border: 'none',
          padding: '12px 32px',
          fontSize: '0.8rem',
          textTransform: 'uppercase',
          letterSpacing: '0.1em',
          cursor: 'pointer',
          transition: 'opacity 0.3s'
        }}
        onMouseEnter={(e) => e.currentTarget.style.opacity = '0.8'}
        onMouseLeave={(e) => e.currentTarget.style.opacity = '1'}
        >
          Book Appointment
        </button>
      </div>

      {/* Invisible Debug Trigger (Top Right) */}
      <div 
        style={{ position: 'absolute', top: 0, right: 0, width: 50, height: 50, zIndex: 9000, pointerEvents: 'auto' }}
        onClick={toggleDebug}
      />
    </div>
  )
}