import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { useLocation } from 'react-router-dom'
import Navigation from '../components/Navigation'

function Welcome() {
  const [navOpen, setNavOpen] = useState(false)
  const navigation = useNavigation()
  const location = useLocation()
  
  // Get user's first name from navigation state (passed from Create component)
  const firstName = location.state?.firstName || 'there'

  useEffect(() => {
    // Start the popcorn animation when component mounts
    const timer = setTimeout(() => {
      // Animation runs automatically via CSS
    }, 500)

    return () => clearTimeout(timer)
  }, [])

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  return (
    <div style={{
      margin: 0,
      padding: 0,
      height: '100%',
      backgroundColor: '#f6f5f3',
      overflowX: 'hidden',
      scrollBehavior: 'smooth',
      fontFamily: 'Arial, sans-serif',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh',
      position: 'relative'
    }}>
      <style>
        {`
          @font-face {
            font-family: 'BLANKA';
            src: url('/BLANKA.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
          }
          
          @keyframes jiggle {
            0%, 100% { transform: rotate(0deg) scale(1); }
            25% { transform: rotate(-2deg) scale(1.05); }
            50% { transform: rotate(2deg) scale(1.1); }
            75% { transform: rotate(-1deg) scale(1.05); }
          }
          
          .popcorn-jiggle {
            animation: jiggle 0.6s ease-in-out 0s 8;
            transform-origin: center;
          }
        `}
      </style>

      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        background: 'transparent',
        position: 'relative',
        zIndex: 1100
      }}>
        <button 
          onClick={toggleNav}
          style={{
            position: 'absolute',
            top: '13px',
            left: '13px',
            width: '36px',
            height: '30px',
            cursor: 'pointer',
            zIndex: 1200,
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'space-between',
            background: 'transparent',
            borderRadius: '6px',
            boxShadow: 'none',
            border: 'none',
            padding: 0
          }}
          aria-label="Toggle navigation"
          aria-expanded={navOpen}
        >
          <span style={{
            display: 'block',
            height: '4px',
            background: '#000',
            borderRadius: '2px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}></span>
          <span style={{
            display: 'block',
            height: '4px',
            background: '#000',
            borderRadius: '2px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}></span>
          <span style={{
            display: 'block',
            height: '4px',
            background: '#000',
            borderRadius: '2px',
            width: '100%',
            transition: 'all 0.3s ease'
          }}></span>
        </button>
      </header>

      <main style={{
        maxWidth: '480px',
        margin: '0 auto 40px',
        padding: '0 20px',
        flexGrow: 1,
        textAlign: 'center',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center'
      }}>
        {/* Jiggling Popcorn */}
        <div style={{
          marginBottom: '30px',
          display: 'flex',
          justifyContent: 'center'
        }}>
          <img 
            src="/popcorn.png" 
            alt="Popcorn" 
            className="popcorn-jiggle"
            style={{
              width: '120px',
              height: 'auto',
              display: 'block'
            }}
          />
        </div>

        {/* Welcome Message */}
        <div style={{
          marginBottom: '40px',
          textAlign: 'center'
        }}>
          <h1 style={{
            fontSize: '32px',
            fontWeight: 600,
            margin: '0 0 20px 0',
            color: '#000',
            lineHeight: 1.2,
            textAlign: 'center'
          }}>
            Welcome to Celluloid by Design, {firstName}!
          </h1>
          
          <p style={{
            fontWeight: 300,
            fontSize: '18px',
            lineHeight: 1.6,
            margin: '0 auto',
            color: '#000',
            textAlign: 'center'
          }}>
            Your account is all set!
          </p>
        </div>

        {/* Action Buttons */}
        <div style={{
          display: 'flex',
          flexDirection: 'column',
          gap: '20px',
          alignItems: 'center'
        }}>
          <button
            onClick={() => navigation.goToMatch()}
            style={{
              padding: '8px 12px',
              backgroundColor: '#000',
              color: '#f6f5f3',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'normal',
              cursor: 'pointer',
              transition: 'background-color 0.2s ease',
              fontFamily: "'BLANKA', Arial, sans-serif",
              letterSpacing: '0.5px',
              width: 'auto',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
          >
            EXPLORE FILM VIBES
          </button>

          <button
            onClick={() => navigation.goToWatchlist()}
            style={{
              padding: '8px 12px',
              backgroundColor: '#000',
              color: '#f6f5f3',
              border: 'none',
              borderRadius: '50px',
              fontSize: '18px',
              fontWeight: 'normal',
              cursor: 'pointer',
              transition: 'all 0.2s ease',
              fontFamily: "'BLANKA', Arial, sans-serif",
              letterSpacing: '0.5px',
              width: 'auto',
              whiteSpace: 'nowrap'
            }}
            onMouseEnter={(e) => e.target.style.backgroundColor = '#333'}
            onMouseLeave={(e) => e.target.style.backgroundColor = '#000'}
          >
            GO TO WATCHLIST
          </button>
        </div>
      </main>

      <Navigation navOpen={navOpen} setNavOpen={setNavOpen} />

      <footer style={{
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        padding: '20px',
        userSelect: 'none',
        background: '#f6f5f3',
        fontStyle: 'italic',
        position: 'static',
        width: 'auto',
        bottom: 'auto',
        left: 'auto',
        opacity: 1,
        pointerEvents: 'auto',
        transition: 'none',
        zIndex: 'auto'
      }}>
        <span>© 2025 Celluloid by Design</span>
      </footer>
    </div>
  )
}

export default Welcome