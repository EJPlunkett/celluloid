import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Match() {
  const [navOpen, setNavOpen] = useState(false)
  const [isRolling, setIsRolling] = useState(false)
  const navigation = useNavigation()

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const jiggleAndGo = () => {
    // Start shake animation
    setIsRolling(true)
    
    // Stop animation and navigate after 400ms
    setTimeout(() => {
      setIsRolling(false)
      navigation.goToSurprise()
    }, 400)
  }

  // Shake animation keyframes
  const shakeKeyframes = `
    @keyframes shake {
      0%, 100% { transform: translateX(0) translateY(0) rotate(0deg); }
      10% { transform: translateX(-4px) translateY(-2px) rotate(-5deg); }
      20% { transform: translateX(4px) translateY(2px) rotate(4deg); }
      30% { transform: translateX(-3px) translateY(3px) rotate(-3deg); }
      40% { transform: translateX(3px) translateY(-1px) rotate(6deg); }
      50% { transform: translateX(-2px) translateY(2px) rotate(-4deg); }
      60% { transform: translateX(2px) translateY(-3px) rotate(3deg); }
      70% { transform: translateX(-2px) translateY(1px) rotate(-2deg); }
      80% { transform: translateX(2px) translateY(-1px) rotate(5deg); }
      90% { transform: translateX(-1px) translateY(2px) rotate(-3deg); }
    }
  `

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
      {/* Inject CSS animation */}
      <style>{shakeKeyframes}</style>
      
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
        margin: '0 auto',
        padding: '0 20px 60px',
        flexGrow: 1,
        textAlign: 'center'
      }}>
        <img 
          src="/Vibes Header.png" 
          alt="Vibes Header" 
          onClick={() => navigation.goToVibes()}
          style={{
            display: 'block',
            margin: '25px auto 10px auto',
            width: '100%',
            maxWidth: '480px',
            height: 'auto',
            cursor: 'pointer'
          }}
        />
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 30px 0',
          color: '#000',
          textAlign: 'center'
        }}>
          Describe your vibe and uncover films that share its aesthetic.
        </p>

        <img 
          src="/Color Header.png" 
          alt="Color Header" 
          onClick={() => navigation.goToColor()}
          style={{
            display: 'block',
            margin: '25px auto 10px auto',
            width: '100%',
            maxWidth: '480px',
            height: 'auto',
            cursor: 'pointer'
          }}
        />
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 30px 0',
          color: '#000',
          textAlign: 'center'
        }}>
          Choose a color or palette to reveal films with matching tones.
        </p>

        <img 
          src="/Words Header.png" 
          alt="Words Header" 
          onClick={() => navigation.goToWords()}
          style={{
            display: 'block',
            margin: '25px auto 10px auto',
            width: '100%',
            maxWidth: '480px',
            height: 'auto',
            cursor: 'pointer'
          }}
        />
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 30px 0',
          color: '#000',
          textAlign: 'center'
        }}>
          Combine a few words to surface films defined by those details.
        </p>

        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 30px 0',
          color: '#000',
          textAlign: 'center'
        }}>
          Feeling indecisive?{'\n'}Roll the dice to let chance reveal your next aesthetic match.
        </p>
        
        <div 
          onClick={jiggleAndGo}
          style={{
            display: 'block',
            width: '80px',
            margin: '20px auto 0',
            cursor: 'pointer'
          }}
        >
          <img 
            src="/Dice.png" 
            alt="Dice Icon" 
            style={{
              width: '100%',
              height: 'auto',
              userSelect: 'none',
              display: 'block',
              animation: isRolling ? 'shake 0.4s infinite' : 'none'
            }}
          />
        </div>
      </main>

      {/* Navigation Overlay */}
      <nav 
        style={{
          position: 'fixed',
          top: 0,
          left: 0,
          width: '320px',
          height: '100vh',
          backgroundColor: '#f6f5f3',
          border: '10px solid #000',
          borderRadius: '0 20px 20px 0',
          boxSizing: 'border-box',
          boxShadow: 'none',
          transform: navOpen ? 'translateX(0)' : 'translateX(calc(-100% - 20px))',
          transition: 'transform 0.3s ease',
          zIndex: 1050,
          padding: '20px 20px 40px 40px',
          overflowY: 'auto'
        }}
        aria-hidden={!navOpen}
      >
        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToMatch() }} style={{ display: 'block', marginTop: '20px', marginBottom: '16px' }}>
          <img 
            src="/Match By.png" 
            alt="Match By" 
            style={{
              height: '30px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </a>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToVibes() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Describe a Vibe
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToColor() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Pick a Color
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToWords() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Choose Keywords
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToSurprise() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Surprise Me
            </a>
          </li>
        </ul>

        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToWatchlist() }} style={{ display: 'block', marginBottom: '16px' }}>
          <img 
            src="/Watchlist.png" 
            alt="Watchlist" 
            style={{
              height: '30px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </a>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToCreate() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Create Account
            </a>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToLogin() }} style={{ color: '#000', textDecoration: 'none', cursor: 'pointer' }}>
              Sign In
            </a>
          </li>
        </ul>

        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToAbout() }} style={{ display: 'block', marginBottom: '16px' }}>
          <img 
            src="/About.png" 
            alt="About" 
            style={{
              height: '30px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </a>
        
        <a href="#" onClick={(e) => { e.preventDefault(); navigation.goToDonate() }} style={{ display: 'block', marginBottom: '16px' }}>
          <img 
            src="/donate menu.png" 
            alt="Donate" 
            style={{
              height: '24px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </a>
      </nav>

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

export default Match