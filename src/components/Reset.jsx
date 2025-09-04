import { useState, useEffect } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'

function Reset() {
  const [navOpen, setNavOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [formData, setFormData] = useState({
    password: '',
    confirmPassword: ''
  })
  const [isValidSession, setIsValidSession] = useState(false)
  const [isCheckingSession, setIsCheckingSession] = useState(true)
  const navigation = useNavigation()

  useEffect(() => {
    // Check for tokens in URL hash immediately
    const hash = window.location.hash.slice(1)
    const hashParams = new URLSearchParams(hash)
    const accessToken = hashParams.get('access_token')
    const refreshToken = hashParams.get('refresh_token')
    const type = hashParams.get('type')
    
    console.log('URL hash params:', { accessToken: !!accessToken, refreshToken: !!refreshToken, type })

    if (accessToken && refreshToken && type === 'recovery') {
      // Set the session using the tokens from the URL
      supabase.auth.setSession({
        access_token: accessToken,
        refresh_token: refreshToken
      }).then(({ data, error }) => {
        if (error) {
          console.error('Error setting session:', error)
          setIsValidSession(false)
          setIsCheckingSession(false)
        } else {
          console.log('Session set successfully:', data)
          setIsValidSession(true)
          setIsCheckingSession(false)
        }
      })
    } else {
      // Check for existing session
      supabase.auth.getSession().then(({ data: { session }, error }) => {
        if (error) {
          console.error('Session check error:', error)
          setIsValidSession(false)
        } else if (session) {
          setIsValidSession(true)
        } else {
          setIsValidSession(false)
        }
        setIsCheckingSession(false)
      })
    }

    // Also listen for auth state changes
    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      console.log('Auth event:', event, session)
      
      if (event === 'PASSWORD_RECOVERY' || (event === 'SIGNED_IN' && session)) {
        setIsValidSession(true)
        setIsCheckingSession(false)
      }
    })

    return () => subscription.unsubscribe()
  }, [])

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
    
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please try again.')
      return
    }

    if (formData.password.length < 6) {
      alert('Password must be at least 6 characters long.')
      return
    }

    setIsLoading(true)
    
    try {
      const { error } = await supabase.auth.updateUser({
        password: formData.password
      })
      
      if (error) {
        console.error('Password update error:', error.message)
        alert(`Failed to update password: ${error.message}`)
      } else {
        setShowSuccess(true)
        setTimeout(() => {
          navigation.goToWatchlist()
        }, 2000)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsLoading(false)
    }
  }

  if (isCheckingSession) {
    return (
      <div style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        backgroundColor: '#f6f5f3',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif'
      }}>
        <p style={{ fontSize: '16px', color: '#666' }}>Verifying reset link...</p>
        <div style={{ marginTop: '20px', fontSize: '12px', color: '#999', textAlign: 'center', maxWidth: '80%', wordBreak: 'break-all' }}>
          <p>Debug info:</p>
          <p>Hash: {window.location.hash}</p>
          <p>Has access_token: {window.location.hash.includes('access_token') ? 'Yes' : 'No'}</p>
          <p>Has type=recovery: {window.location.hash.includes('type=recovery') ? 'Yes' : 'No'}</p>
        </div>
      </div>
    )
  }

  if (!isValidSession) {
    return (
      <div style={{
        margin: 0,
        padding: 0,
        height: '100vh',
        backgroundColor: '#f6f5f3',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'center',
        alignItems: 'center',
        fontFamily: 'Arial, sans-serif',
        padding: '20px',
        textAlign: 'center'
      }}>
        <h1 style={{ fontSize: '24px', color: '#000', marginBottom: '20px' }}>
          Invalid or Expired Link
        </h1>
        <p style={{ fontSize: '16px', color: '#666', marginBottom: '30px', lineHeight: '1.5' }}>
          This password reset link is either invalid or has expired. 
          Please request a new password reset from the login page.
        </p>
        <button
          onClick={() => navigation.goToLogin()}
          style={{
            padding: '12px 24px',
            border: '2px solid #000',
            borderRadius: '8px',
            backgroundColor: '#000',
            color: '#f6f5f3',
            fontSize: '16px',
            fontFamily: 'Arial, sans-serif',
            cursor: 'pointer',
            textDecoration: 'none',
            display: 'inline-block'
          }}
        >
          Back to Login
        </button>
      </div>
    )
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

        <h1 style={{
          fontSize: '24px',
          fontWeight: 'bold',
          color: '#000',
          margin: '30px 0 10px 0',
          textAlign: 'center'
        }}>
          Create New Password
        </h1>

        <p style={{
          fontSize: '16px',
          color: '#666',
          margin: '0 0 30px 0',
          textAlign: 'center',
          lineHeight: '1.4'
        }}>
          Enter your new password below
        </p>

        <form 
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '30px',
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
              htmlFor="password"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              New Password
            </label>
            <input 
              type="password"
              id="password"
              name="password"
              value={formData.password}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Enter your new password"
              minLength="6"
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
              htmlFor="confirmPassword"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              Confirm New Password
            </label>
            <input 
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              disabled={isLoading}
              placeholder="Confirm your new password"
              minLength="6"
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

          <button 
            type="submit"
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
              alt={isLoading ? "Updating..." : "Update Password"}
              style={{
                width: '100%',
                height: 'auto',
                display: 'block',
                objectFit: 'contain'
              }}
            />
          </button>
        </form>
        
        {isLoading && (
          <p style={{
            textAlign: 'center',
            marginTop: '10px',
            fontSize: '14px',
            color: '#666'
          }}>
            Updating your password...
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
              Password updated successfully! 
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

export default Reset