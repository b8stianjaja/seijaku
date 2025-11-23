import { useEffect, useRef } from 'react'
import { useStore } from '@state/index'
import gsapfb from 'gsap'

export default function InterfaceRoot() {
  const { toggleDebug, setHoveredService, isAppReady } = useStore()
  
  // Refs for GSAP animation
  const titleRef = useRef<HTMLDivElement>(null)
  const menuRef = useRef<HTMLDivElement>(null)
  const bookRef = useRef<HTMLDivElement>(null)

  const services = [
    { id: 'lashes', label: 'Lash Extensions' },
    { id: 'nails', label: 'Nail Artistry' },
    { id: 'brows', label: 'Microblading' },
    { id: 'facial', label: 'Hydration' },
  ]

  // Intro Animation Sequence
  useEffect(() => {
    if (isAppReady) {
      const tl = gsapfb.timeline()

      // 1. Title fades in and moves down
      tl.fromTo(titleRef.current, 
        { opacity: 0, y: -50 },
        { opacity: 1, y: 0, duration: 1.5, ease: 'power3.out' }
      )

      // 2. Menu items stagger in from left
      .fromTo('.service-link', 
        { opacity: 0, x: -20 },
        { opacity: 1, x: 0, duration: 0.8, stagger: 0.1, ease: 'power2.out' },
        '-=1' // Overlap with previous animation
      )

      // 3. Book button fades in
      .fromTo(bookRef.current,
        { opacity: 0, scale: 0.9 },
        { opacity: 1, scale: 1, duration: 0.8, ease: 'back.out(1.7)' },
        '-=0.5'
      )
    }
  }, [isAppReady])

  return (
    <div className="interface-layer">
      {/* Brand Header */}
      <div ref={titleRef} style={{ 
        position: 'absolute', 
        top: 60, 
        width: '100%', 
        textAlign: 'center',
        opacity: 0 // Start hidden for GSAP
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

      {/* Services Menu */}
      <div ref={menuRef} style={{ 
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
                // Connect to Store
                onMouseEnter={() => setHoveredService(s.id)}
                onMouseLeave={() => setHoveredService(null)}
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
                  letterSpacing: '0.05em',
                  opacity: 0 // Start hidden for GSAP
                }}
                // Inline hover styles (can also be done in CSS)
                onMouseOver={(e) => {
                  e.currentTarget.style.color = '#000';
                  e.currentTarget.style.paddingLeft = '10px';
                }}
                onMouseOut={(e) => {
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

      {/* Book Appointment */}
      <div ref={bookRef} style={{ 
        position: 'absolute', 
        bottom: 60, 
        right: 60, 
        textAlign: 'right',
        pointerEvents: 'auto',
        opacity: 0
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
          transition: 'all 0.3s ease'
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.transform = 'scale(1.05)';
          e.currentTarget.style.backgroundColor = '#000';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.transform = 'scale(1)';
          e.currentTarget.style.backgroundColor = '#2C2C2C';
        }}
        >
          Book Appointment
        </button>
      </div>

      {/* Invisible Debug Trigger */}
      <div 
        style={{ position: 'absolute', top: 0, right: 0, width: 50, height: 50, zIndex: 9000, pointerEvents: 'auto' }}
        onClick={toggleDebug}
      />
    </div>
  )
}