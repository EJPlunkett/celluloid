import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Support() {
  const [navOpen, setNavOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [customAmount, setCustomAmount] = useState('')
  const [stripe, setStripe] = useState(null)
  const [loading, setLoading] = useState(false)
  const [message, setMessage] = useState('')
  const navigation = useNavigation()

  // Updated donation amounts without equivalents
  const donationAmounts = [
    { amount: 10, label: '$10' },
    { amount: 25, label: '$25' },
    { amount: 50, label: '$50' },
    { amount: 100, label: '$100' }
  ]

  useEffect(() => {
    // Load BLANKA font
    const fontLink = document.createElement('link')
    fontLink.rel = 'preload'
    fontLink.href = '/BLANKA.otf'
    fontLink.as = 'font'
    fontLink.type = 'font/otf'
    fontLink.crossOrigin = 'anonymous'
    document.head.appendChild(fontLink)

    // Add font-face CSS
    const style = document.createElement('style')
    style.innerHTML = `
      @font-face {
        font-family: 'BLANKA';
        src: url('/BLANKA.otf') format('opentype');
        font-display: swap;
      }
    `
    document.head.appendChild(style)

    // Initialize Stripe when component mounts
    const initializeStripe = () => {
      if (window.Stripe) {
        // You'll need to replace with your actual publishable key
        const stripeInstance = window.Stripe('pk_live_51S1x6pGbIJG1BY3zDUKQchiGRUV9u7W5jFd1xLq69dE44Cn4Y2dnSItRzNPkEQfFKeWYmIdTfM0pglisbB1nAEI600nF5EeaSP')
        setStripe(stripeInstance)
      } else {
        console.error('Stripe failed to load')
      }
    }

    // Load Stripe script if not already loaded
    if (!window.Stripe) {
      const script = document.createElement('script')
      script.src = 'https://js.stripe.com/v3/'
      script.onload = initializeStripe
      document.head.appendChild(script)
    } else {
      initializeStripe()
    }

    // Check for success/cancel parameters in URL
    const urlParams = new URLSearchParams(window.location.search)
    if (urlParams.get('success')) {
      setMessage('Thank you for your support! Your payment was successful.')
    } else if (urlParams.get('canceled')) {
      setMessage('Your payment was canceled. You can try again anytime.')
    }
  }, [])

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
    setMessage('')
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    setCustomAmount(value)
    setSelectedAmount(parseInt(value) || 0)
    setMessage('')
  }

  const handleSupport = async () => {
    if (selectedAmount < 1 || !stripe) {
      if (!stripe) {
        setMessage('Payment system is currently unavailable. Please try again later.')
      } else {
        setMessage('Please enter an amount of at least $1.')
      }
      return
    }

    setLoading(true)
    setMessage('')

    try {
      // Call Netlify function to create a Stripe checkout session
      const response = await fetch('/.netlify/functions/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount * 100, // Convert to cents
          currency: 'usd',
          description: `Support for Celluloid by Design - $${selectedAmount}`
        })
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error || 'Failed to create checkout session')
      }

      const session = await response.json()

      // Redirect to Stripe Checkout
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        setMessage(result.error.message)
      }
    } catch (error) {
      console.error('Error:', error)
      setMessage(`Error: ${error.message}`)
    } finally {
      setLoading(false)
    }
  }

  const getTipButtonText = () => {
    if (loading) return 'Processing...'
    if (!stripe) return 'Payment system unavailable'
    if (selectedAmount > 0) return `TIP $${selectedAmount}`
    return 'TIP'
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
        <h1 style={{
          fontFamily: 'BLANKA, Arial, sans-serif',
          fontSize: 'clamp(80px, 20vw, 120px)',
          fontWeight: 'normal',
          letterSpacing: '4px',
          textAlign: 'center',
          margin: '25px 0 20px 0',
          width: '100%',
          color: '#000',
          lineHeight: 1,
          padding: 0,
          boxSizing: 'border-box',
          display: 'block'
        }}>
          SUPPORT
        </h1>

        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: 0,
          color: '#000',
          whiteSpace: 'normal',
          textAlign: 'center'
        }}>
          <em>Celluloid by Design</em> is built on curiosity, structure, and a touch of AI behind the scenes. Each search draws on OpenAI's technology, which carries a small cost every time. This is an independent creative project, not a crowdfunding platform or nonprofit, and your support works like a tip that goes directly toward keeping the project alive and growing.
        </p>

        {/* Message display */}
        {message && (
          <div style={{
            margin: '20px auto',
            padding: '12px',
            backgroundColor: message.includes('successful') ? '#d4edda' : message.includes('Error') ? '#f8d7da' : '#fff3cd',
            color: message.includes('successful') ? '#155724' : message.includes('Error') ? '#721c24' : '#856404',
            border: `1px solid ${message.includes('successful') ? '#c3e6cb' : message.includes('Error') ? '#f5c6cb' : '#ffeaa7'}`,
            borderRadius: '8px',
            maxWidth: '400px',
            fontSize: '14px'
          }}>
            {message}
          </div>
        )}

        <section style={{ marginBottom: '40px' }}>
          <div style={{
            fontSize: '14px',
            color: '#666',
            margin: '10px 0',
            fontStyle: 'italic'
          }}>
            USD amounts shown - local currency detected at checkout
          </div>
          
          <div style={{
            display: 'flex',
            flexWrap: 'wrap',
            gap: '12px',
            justifyContent: 'center',
            marginBottom: '20px'
          }}>
            {donationAmounts.map((donation) => (
              <button
                key={donation.amount}
                onClick={() => handleAmountSelect(donation.amount)}
                disabled={loading}
                style={{
                  padding: '12px 24px',
                  border: '2px solid #000',
                  borderRadius: '9999px',
                  background: selectedAmount === donation.amount && !customAmount ? '#000' : '#fff',
                  color: selectedAmount === donation.amount && !customAmount ? '#fff' : '#000',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: loading ? 'not-allowed' : 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                  position: 'relative',
                  opacity: loading ? 0.6 : 1
                }}
                onMouseEnter={(e) => {
                  if (!loading && (selectedAmount !== donation.amount || customAmount)) {
                    e.target.style.background = '#000'
                    e.target.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (!loading && (selectedAmount !== donation.amount || customAmount)) {
                    e.target.style.background = '#fff'
                    e.target.style.color = '#000'
                  }
                }}
              >
                {donation.label}
              </button>
            ))}
          </div>
          
          <div style={{ margin: '20px 0' }}>
            <label htmlFor="customAmount">Or enter custom amount:</label><br />
            <input 
              type="number"
              id="customAmount"
              value={customAmount}
              onChange={handleCustomAmountChange}
              placeholder="$"
              min="1"
              max="999"
              disabled={loading}
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: loading ? '#f5f5f5' : '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                width: '120px',
                textAlign: 'center',
                marginTop: '8px',
                opacity: loading ? 0.6 : 1
              }}
              onFocus={(e) => {
                if (!loading) {
                  e.target.style.outline = 'none'
                  e.target.style.borderColor = '#666'
                }
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#000'
              }}
            />
          </div>

          <button
            onClick={handleSupport}
            disabled={selectedAmount < 1 || !stripe || loading}
            style={{
              marginTop: '30px',
              padding: '16px 48px',
              background: (selectedAmount >= 1 && stripe && !loading) ? '#000' : '#ccc',
              color: '#fff',
              border: '2px solid #000',
              borderRadius: '50px',
              fontSize: '18px',
              fontFamily: 'BLANKA, Arial, sans-serif',
              cursor: (selectedAmount >= 1 && stripe && !loading) ? 'pointer' : 'not-allowed',
              transition: 'all 0.2s ease',
              minWidth: '180px',
              position: 'relative',
              letterSpacing: '1px'
            }}
            onMouseEnter={(e) => {
              if (selectedAmount >= 1 && stripe && !loading) {
                e.target.style.background = '#333'
                e.target.style.transform = 'translateY(-2px)'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAmount >= 1 && stripe && !loading) {
                e.target.style.background = '#000'
                e.target.style.transform = 'translateY(0)'
              }
            }}
          >
            {getTipButtonText()}
          </button>

          <div style={{
            fontSize: '12px',
            color: '#666',
            marginTop: '12px',
            fontStyle: 'italic',
            textAlign: 'center'
          }}>
            Secure payments powered by Stripe
          </div>
        </section>
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
          <span style={{
            fontFamily: 'BLANKA, Arial, sans-serif',
            fontSize: '28px',
            color: '#000',
            letterSpacing: '1px',
            height: '32px',
            lineHeight: '32px',
            display: 'block'
          }}>
            SUPPORT
          </span>
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

export default Support