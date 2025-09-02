import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Surprise() {
  const [navOpen, setNavOpen] = useState(false)
  const [currentVibe, setCurrentVibe] = useState("Rooftop gardens overlooking a sprawling city skyline.")
  const [isRolling, setIsRolling] = useState(false)
  const navigation = useNavigation()

  // Array of surprise vibes
  const vibes = [
    "NY nightclubs, underground art parties, and warehouse loft gatherings in the '80s.",
    "Moody jazz bars with smoky light and intimate conversations.",
    "Sun-dappled Brooklyn stoops in late summer evenings.",
    "Grimy subway rides amidst graffiti and punk energy.",
    "High-end SoHo galleries showcasing avant-garde street art.",
    "Corner deli mornings filled with the scent of fresh coffee and bagels.",
    "Rain-soaked streets reflecting neon lights and taxi cabs.",
    "Bohemian loft apartments cluttered with vintage vinyl and typewriters.",
    "Hip hop block parties with vibrant crowd energy.",
    "Quiet walks in Central Park under autumn leaves.",
    "Rooftop gardens overlooking a sprawling city skyline."
  ]

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const rollDice = () => {
    setIsRolling(true)
    
    // Get a random vibe that's different from the current one
    let randomIndex
    do {
      randomIndex = Math.floor(Math.random() * vibes.length)
    } while (vibes[randomIndex] === currentVibe)
    
    setCurrentVibe(vibes[randomIndex])
    
    // Reset dice animation after 400ms to match the CSS animation duration
    setTimeout(() => {
      setIsRolling(false)
    }, 400)
  }

  const handleSubmit = () => {
    console.log('Surprise vibe:', currentVibe)
    // Navigate to cards page with the surprise vibe
    navigation.goToCards({ vibe: currentVibe })
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
            position: 'fixed',
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
        textAlign: 'center'
      }}>
        <img 
          src="/Vibes Header.png" 
          alt="Vibes Header" 
          style={{
            display: 'block',
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '25px auto 10px auto'
          }}
        />
        
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 15px 0',
          color: '#000',
          whiteSpace: 'pre-wrap'
        }}>
          Not sure where to start? Roll the dice to uncover a vibe at random, then explore films that share its distinct aesthetic energy.
        </p>
        
        <div style={{
          width: '100%',
          maxWidth: '480px',
          margin: '30px auto 15px auto',
          minHeight: '120px',
          border: '2px solid #000',
          borderRadius: '15px',
          padding: '20px',
          fontStyle: 'italic',
          fontWeight: 400,
          fontSize: '16px',
          lineHeight: 1.5,
          background: '#fff',
          userSelect: 'none',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          boxSizing: 'border-box'
        }}>
          {currentVibe}
        </div>
        
        <button 
          onClick={rollDice}
          style={{
            cursor: 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: '20px auto 0 auto',
            display: 'block',
            width: '80px',
            height: 'auto'
          }}
          aria-label="Roll the dice to generate a new vibe"
        >
          <img 
            src="/Dice.png" 
            alt="Roll Dice" 
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              userSelect: 'none',
              animation: isRolling ? 'shake 0.4s infinite' : 'none'
            }}
          />
        </button>

        <div style={{
          textAlign: 'center',
          marginTop: '20px'
        }}>
          <button
            onClick={handleSubmit}
            style={{
              width: '150px',
              height: 'auto',
              background: 'transparent',
              border: 'none',
              cursor: 'pointer',
              display: 'inline-block'
            }}
          >
            <img 
              src="/Submit Button.png" 
              alt="Submit Button" 
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </button>
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
          transform: navOpen ? 'translateX(0)' : 'translateX(calc(-100% - 20px))',
          transition: 'transform 0.3s ease',
          zIndex: 1050,
          padding: '20px 20px 40px 40px',
          overflowY: 'auto'
        }}
        aria-hidden={!navOpen}
      >
        <button 
          onClick={() => {
            navigation.goToMatch()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginTop: '20px', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
        </button>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToVibes()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Describe a Vibe
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToColor()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Pick a Color
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToWords()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Choose Keywords
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToSurprise()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Surprise Me
            </button>
          </li>
        </ul>

        <button 
          onClick={() => {
            navigation.goToWatchlist()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
        </button>
        <ul style={{
          listStyle: 'disc inside',
          paddingLeft: 0,
          marginTop: 0,
          marginBottom: '30px',
          fontWeight: 400,
          fontSize: '18px'
        }}>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToCreate()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Create Account
            </button>
          </li>
          <li style={{ marginBottom: '12px' }}>
            <button 
              onClick={() => {
                navigation.goToLogin()
                setNavOpen(false)
              }}
              style={{ 
                color: '#000', 
                textDecoration: 'none', 
                cursor: 'pointer',
                background: 'transparent',
                border: 'none',
                fontSize: '18px',
                fontWeight: 400,
                padding: 0,
                textAlign: 'left'
              }}
            >
              Sign In
            </button>
          </li>
        </ul>

        <button 
          onClick={() => {
            navigation.goToAbout()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
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
        </button>
        
        <button 
          onClick={() => {
            navigation.goToSupport()
            setNavOpen(false)
          }}
          style={{ 
            display: 'block', 
            marginBottom: '16px',
            background: 'transparent',
            border: 'none',
            padding: 0,
            cursor: 'pointer'
          }}
        >
          <img 
            src="/Support Header.png" 
            alt="Support" 
            style={{
              height: '25px',
              width: 'auto',
              maxWidth: '280px',
              cursor: 'pointer',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
      </nav>

      <footer style={{
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        padding: '20px',
        userSelect: 'none',
        background: '#f6f5f3',
        fontStyle: 'italic'
      }}>
        <span>© 2025 Celluloid by Design</span>
      </footer>
    </div>
  )
}

export default Surprise