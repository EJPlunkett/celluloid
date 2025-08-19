import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Donate() {
  const [navOpen, setNavOpen] = useState(false)
  const [selectedAmount, setSelectedAmount] = useState(0)
  const [customAmount, setCustomAmount] = useState('')
  const [stripe, setStripe] = useState(null)
  const navigation = useNavigation()

  // Updated donation amounts without equivalents
  const donationAmounts = [
    { amount: 10, label: '$10' },
    { amount: 25, label: '$25' },
    { amount: 50, label: '$50' },
    { amount: 100, label: '$100' }
  ]

  useEffect(() => {
    // Initialize Stripe when component mounts
    const initializeStripe = () => {
      if (window.Stripe) {
        // You'll need to replace with your actual publishable key
        const stripeInstance = window.Stripe('pk_test_YOUR_PUBLISHABLE_KEY_HERE')
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
  }, [])

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const handleAmountSelect = (amount) => {
    setSelectedAmount(amount)
    setCustomAmount('')
  }

  const handleCustomAmountChange = (e) => {
    const value = e.target.value
    setCustomAmount(value)
    setSelectedAmount(parseInt(value) || 0)
  }

  const handleDonate = async () => {
    if (selectedAmount <= 0 || !stripe) {
      if (!stripe) {
        alert('Payment system is currently unavailable. Please try again later.')
      }
      return
    }

    try {
      // This would call your backend to create a Stripe checkout session
      console.log('Would create donation for:', selectedAmount)
      alert(`This would process a $${selectedAmount} donation. Backend integration needed for Stripe.`)
      
      // When you set up the backend, it would look like this:
      /*
      const response = await fetch('/create-checkout-session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          amount: selectedAmount * 100, // Stripe uses cents
          currency: 'usd',
          description: 'Donation to Celluloid by Design'
        })
      })

      const session = await response.json()
      const result = await stripe.redirectToCheckout({
        sessionId: session.id
      })

      if (result.error) {
        alert(result.error.message)
      }
      */
    } catch (error) {
      console.error('Error:', error)
      alert('There was a problem processing your donation. Please try again.')
    }
  }

  const getDonateButtonText = () => {
    if (!stripe) return 'Payment system unavailable'
    if (selectedAmount > 0) return `Donate $${selectedAmount}`
    return 'Donate with Stripe'
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
          src="/donate.png" 
          alt="Header" 
          style={{
            display: 'block',
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '25px auto 0px auto'
          }}
        />

        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: 0,
          color: '#000',
          whiteSpace: 'normal',
          textAlign: 'center'
        }}>
          Help keep Celluloid by Design running!<br />
          The AI-powered film matching uses OpenAI, which costs money with every search. Your donations helps cover these costs.
        </p>

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
                style={{
                  padding: '12px 24px',
                  border: '2px solid #000',
                  borderRadius: '9999px',
                  background: selectedAmount === donation.amount && !customAmount ? '#000' : '#fff',
                  color: selectedAmount === donation.amount && !customAmount ? '#fff' : '#000',
                  fontSize: '16px',
                  fontWeight: 500,
                  cursor: 'pointer',
                  transition: 'all 0.2s ease',
                  minWidth: '80px',
                  position: 'relative'
                }}
                onMouseEnter={(e) => {
                  if (selectedAmount !== donation.amount || customAmount) {
                    e.target.style.background = '#000'
                    e.target.style.color = '#fff'
                  }
                }}
                onMouseLeave={(e) => {
                  if (selectedAmount !== donation.amount || customAmount) {
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
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                width: '120px',
                textAlign: 'center',
                marginTop: '8px'
              }}
              onFocus={(e) => {
                e.target.style.outline = 'none'
                e.target.style.borderColor = '#666'
              }}
              onBlur={(e) => {
                e.target.style.borderColor = '#000'
              }}
            />
          </div>

          <button
            onClick={handleDonate}
            disabled={selectedAmount <= 0 || !stripe}
            style={{
              marginTop: '20px',
              padding: '16px 32px',
              background: selectedAmount > 0 && stripe ? '#000' : '#ccc',
              color: '#fff',
              border: 'none',
              borderRadius: '8px',
              fontSize: '18px',
              fontWeight: 500,
              cursor: selectedAmount > 0 && stripe ? 'pointer' : 'not-allowed',
              transition: 'background-color 0.2s ease',
              width: '200px'
            }}
            onMouseEnter={(e) => {
              if (selectedAmount > 0 && stripe) {
                e.target.style.background = '#333'
              }
            }}
            onMouseLeave={(e) => {
              if (selectedAmount > 0 && stripe) {
                e.target.style.background = '#000'
              }
            }}
          >
            {getDonateButtonText()}
          </button>
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

export default Donate