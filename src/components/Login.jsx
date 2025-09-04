import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'

function Login() {
  const [navOpen, setNavOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigation = useNavigation()

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  const handleInputChange = (e) => {
    const { name, value } = e.target
    setFormData(prev => ({
      ...prev,
      [name]: value
    }))
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('Login form submitted:', formData)
    
    try {
      const { data, error } = await supabase.auth.signInWithPassword({
        email: formData.email,
        password: formData.password
      })
      
      if (error) {
        console.error('Login error:', error.message)
        alert(`Login failed: ${error.message}`)
      } else {
        console.log('Login successful:', data.user)
        setShowSuccess(true)
        // Wait a moment to show success message, then navigate
        setTimeout(() => {
          navigation.goToWatchlist()
        }, 1500)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred. Please try again.')
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
          src="/Login Header.png" 
          alt="Header" 
          style={{
            display: 'block',
            maxWidth: '480px',
            width: '100%',
            height: 'auto',
            margin: '35px auto 10px auto'
          }}
        />

        <form 
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '30px',
            marginTop: '30px',
            textAlign: 'left',
            width: '100%',
            maxWidth: '480px'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label 
              htmlFor="email"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              Email Address
            </label>
            <input 
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Enter your email address"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: isLoading ? '#f0f0f0' : '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label 
              htmlFor="password"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              Password
            </label>
            <input 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Enter your password"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: isLoading ? '#f0f0f0' : '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease',
                width: '100%',
                boxSizing: 'border-box'
              }}
            />
          </div>
        </form>

        <button 
          type="submit"
          onClick={handleSubmit}
          disabled={isLoading}
          style={{
            marginTop: '20px',
            width: '150px',
            height: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: isLoading ? 'not-allowed' : 'pointer',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: isLoading ? 0.6 : 1
          }}
        >
          <img 
            src="/Submit Button.png" 
            alt={isLoading ? "Signing In..." : "Sign In"}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
        </button>
        
        {isLoading && (
          <p style={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            Signing you in...
          </p>
        )}
        
        {showSuccess && (
          <div style={{
            position: 'fixed',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            backgroundColor: '#000',
            border: '3px solid #000',
            borderRadius: '12px',
            padding: '30px 40px',
            textAlign: 'center',
            zIndex: 2000,
            boxShadow: '0 8px 24px rgba(0,0,0,0.3)',
            animation: 'fadeIn 0.3s ease'
          }}>
            <p style={{
              margin: 0,
              fontSize: '18px',
              fontWeight: 'bold',
              color: '#f6f5f3'
            }}>
              Login successful! 
            </p>
            <p style={{
              margin: '8px 0 0 0',
              fontSize: '14px',
              color: '#f6f5f3'
            }}>
              Redirecting to your watchlist...
            </p>
          </div>
        )}
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

export default Login