import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Vibes() {
  const [navOpen, setNavOpen] = useState(false)
  const [vibeText, setVibeText] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const navigation = useNavigation()

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
          value: vibeText.trim(),
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
          placeholder="Ex: NY nightclubs, underground art parties, and warehouse loft gatherings in the '80s."
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
          style={{
            marginTop: '20px',
            width: '150px',
            height: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'block',
            margin: '20px auto 0',
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
            navigation.goToDonate()
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
        </button>
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

export default Vibes