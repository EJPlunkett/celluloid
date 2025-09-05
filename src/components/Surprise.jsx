import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

function Surprise() {
  const [navOpen, setNavOpen] = useState(false)
  const [currentVibe, setCurrentVibe] = useState("Rooftop gardens overlooking a sprawling city skyline.")
  const [isRolling, setIsRolling] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

  // Array of surprise vibes
  const vibes = [
  "Over-the-top holiday décor, department store displays, and snow-dusted streets lined with Christmas trees",
  "Lonely late-night diners, chrome counters and fluorescent hum lingering over empty booths",
  "Central Park in autumn, golden leaves, cashmere scarves and city streets glowing under late-day warmth",
  "Peep-show signage, shadowed doorways and sidewalks layered with crumpled posters and urban grit",
  "Peeling wallpaper and buzzing neon, seedy hotel rooms heavy with claustrophobic urban decay",
  "2000s editorial fashion energy, sleek offices and sparkling apartments set against the Manhattan skyline",
  "Gritty 1970s graffiti-covered facades, steam rising from cracked streets and an atmosphere of urban menace",
  "Urban adolescence in 1990s New York, thrifted clothes, graffiti and basketball echoing off brick walls",
  "1980s midtown skyscrapers, pastel power suits and mirrored offices glowing under fluorescent ambition",
  "1980s New York grit, trash-strewn streets, shadowed alleys and police sirens cutting through tense city blocks",
  "Colorful mid-century apartments with patterned décor and playful style, glowing with 1960s charm"
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

  const handleSubmit = async () => {
    console.log('Surprise vibe:', currentVibe)
    setIsLoading(true)

    try {
      const response = await fetch('/.netlify/functions/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: currentVibe.trim(),
          limit: 10 // Match your maxCards in Cards.jsx
        }),
      })

      if (!response.ok) {
        throw new Error(`Search failed: ${response.status}`)
      }

      const data = await response.json()

      if (data.success && data.results.length > 0) {
        // Navigate to cards with search results
        navigation.goToCards({ 
          type: 'surprise',
          surprise: currentVibe.trim(),  // Changed from 'vibe' to 'surprise'
          results: data.results,
          query_info: data.query_info
        })
      } else {
        alert('No movies found for that vibe. Try rolling for a different one!')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
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
          disabled={isLoading}
          style={{
            cursor: isLoading ? 'not-allowed' : 'pointer',
            background: 'transparent',
            border: 'none',
            padding: 0,
            margin: '20px auto 0 auto',
            display: 'block',
            width: '80px',
            height: 'auto',
            opacity: isLoading ? 0.6 : 1
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
            disabled={isLoading}
            style={{
              width: '150px',
              height: 'auto',
              background: 'transparent',
              border: 'none',
              cursor: isLoading ? 'not-allowed' : 'pointer',
              display: 'inline-block',
              opacity: isLoading ? 0.6 : 1,
              transform: isLoading ? 'scale(0.95)' : 'scale(1)',
              transition: 'all 0.2s ease'
            }}
          >
            {isLoading ? (
              <div style={{
                width: '150px',
                height: '40px',
                backgroundColor: '#000',
                borderRadius: '20px',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                color: '#f6f5f3',
                fontSize: '14px',
                fontWeight: 'bold'
              }}>
                Searching...
              </div>
            ) : (
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
            )}
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