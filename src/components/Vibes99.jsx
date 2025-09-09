import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

function Vibes() {
  const [navOpen, setNavOpen] = useState(false)
  const [vibeText, setVibeText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [placeholderText, setPlaceholderText] = useState('')
  const navigation = useNavigation()

  // Array of example vibes for placeholder
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
    "Colorful mid-century apartments with patterned décor and playful style, glowing with 1950s charm"
  ]

  // Set random placeholder on component mount
  useEffect(() => {
    const randomIndex = Math.floor(Math.random() * vibes.length)
    setPlaceholderText(`Example: ${vibes[randomIndex]}`)
  }, [])

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const handleVibeChange = (e) => {
    setVibeText(e.target.value)
  }

  const handleSubmit = async () => {
    if (!vibeText.trim()) {
      alert('Please describe a vibe first!')
      return
    }

    setIsLoading(true)

    try {
      const response = await fetch('/.netlify/functions/search', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userInput: vibeText.trim(),
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
          type: 'vibe', 
          vibes: vibeText.trim(),
          results: data.results,
          query_info: data.query_info
        })
      } else {
        alert('No movies found for that vibe. Try a different description!')
      }
    } catch (error) {
      console.error('Search error:', error)
      alert('Search failed. Please check your connection and try again.')
    } finally {
      setIsLoading(false)
    }
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
            font-family: 'Blanka';
            src: url('/BLANKA.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
            font-display: swap;
          }
          
          .blanka-font {
            font-family: 'Blanka', Arial, sans-serif !important;
            font-weight: normal !important;
            font-style: normal !important;
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
        textAlign: 'center'
      }}>
        <img 
          src="/Vibes Header.png" 
          alt="Header" 
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
          whiteSpace: 'pre-wrap',
          textAlign: 'center'
        }}>
          Describe your vibe in free text and see where it takes you. Whether it is gritty subway cars or airy lofts, the words you choose will surface films that carry that same aesthetic energy.
        </p>

        <textarea 
          value={vibeText}
          onChange={handleVibeChange}
          placeholder={placeholderText}
          disabled={isLoading}
          style={{
            width: '100%',
            maxWidth: '480px',
            height: '120px',
            padding: '12px 16px',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            fontStyle: vibeText ? 'normal' : 'italic',
            color: vibeText ? '#000' : '#666',
            border: '2px solid #000',
            borderRadius: '15px',
            resize: 'vertical',
            boxSizing: 'border-box',
            marginBottom: '20px',
            outline: 'none',
            opacity: isLoading ? 0.6 : 1
          }}
          onFocus={(e) => {
            e.target.style.color = '#000'
            e.target.style.fontStyle = 'normal'
          }}
          onBlur={(e) => {
            if (!e.target.value) {
              e.target.style.color = '#666'
              e.target.style.fontStyle = 'italic'
            }
          }}
        />

        <button
          onClick={handleSubmit}
          disabled={isLoading || !vibeText.trim()}
          className={isLoading ? 'blanka-font' : ''}
          style={{
            marginBottom: '5px',
            width: '150px',
            height: isLoading ? '40px' : 'auto',
            background: isLoading ? '#000' : 'transparent',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: isLoading ? 0.6 : 1,
            borderRadius: isLoading ? '25px' : '0',
            color: isLoading ? '#fff' : 'transparent',
            fontFamily: isLoading ? "'Blanka', Arial, sans-serif" : 'inherit',
            fontSize: isLoading ? '16px' : 'inherit',
            textTransform: isLoading ? 'uppercase' : 'none',
            letterSpacing: isLoading ? '1px' : 'normal',
            fontWeight: isLoading ? 'normal' : 'inherit',
            marginTop: '20px'
          }}
        >
          {isLoading ? 'SEARCHING' : (
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
       <span>© 2025 Celluloid by Design <span style={{ opacity: 0.5, fontStyle: 'normal' }}>(BETA)</span></span>
      </footer>
    </div>
  )
}

export default Vibes