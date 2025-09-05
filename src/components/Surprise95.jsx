import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

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

      <Navigation navOpen={navOpen} setNavOpen={setNavOpen} />

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