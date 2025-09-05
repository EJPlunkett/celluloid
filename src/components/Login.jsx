import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { useAuth } from '../contexts/AuthContext' // Added AuthContext import
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'

function Login() {
  const [navOpen, setNavOpen] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [showSuccess, setShowSuccess] = useState(false)
  const [showForgotPassword, setShowForgotPassword] = useState(false)
  const [forgotPasswordEmail, setForgotPasswordEmail] = useState('')
  const [isSendingReset, setIsSendingReset] = useState(false)
  const [resetEmailSent, setResetEmailSent] = useState(false)
  const [formData, setFormData] = useState({
    email: '',
    password: ''
  })
  const navigation = useNavigation()
  const { signIn } = useAuth() // Added AuthContext hook

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

  const handleForgotPasswordClick = () => {
    setForgotPasswordEmail(formData.email) // Pre-fill with current email if available
    setShowForgotPassword(true)
  }

  const handleForgotPasswordSubmit = async (e) => {
    e.preventDefault()
    setIsSendingReset(true)
    
    try {
      const { error } = await supabase.auth.resetPasswordForEmail(forgotPasswordEmail, {
        redirectTo: `${window.location.origin}/reset`
      })
      
      if (error) {
        console.error('Password reset error:', error.message)
        alert(`Failed to send reset email: ${error.message}`)
      } else {
        setResetEmailSent(true)
        // Auto-close the modal after showing success message
        setTimeout(() => {
          setShowForgotPassword(false)
          setResetEmailSent(false)
          setForgotPasswordEmail('')
        }, 3000)
      }
    } catch (error) {
      console.error('Unexpected error:', error)
      alert('An unexpected error occurred. Please try again.')
    } finally {
      setIsSendingReset(false)
    }
  }

  const handleSubmit = async (e) => {
    e.preventDefault()
    setIsLoading(true)
    console.log('Login form submitted:', formData)
    
    try {
      // Add timeout protection for signIn call
      const timeoutPromise = new Promise((_, reject) => 
        setTimeout(() => reject(new Error('Login timeout')), 15000)
      )
      
      const authPromise = signIn(formData.email, formData.password)
      
      const { data, error } = await Promise.race([authPromise, timeoutPromise])
      
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
      if (error.message === 'Login timeout') {
        alert('Login is taking too long. Please check your connection and try again.')
      } else {
        alert('An unexpected error occurred. Please try again.')
      }
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
            marginBottom: '20px',
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

        {/* Forgot Password Link */}
        <div style={{
          textAlign: 'right',
          marginBottom: '20px'
        }}>
          <button
            type="button"
            onClick={handleForgotPasswordClick}
            disabled={isLoading}
            style={{
              background: 'none',
              border: 'none',
              color: '#000',
              fontSize: '14px',
              textDecoration: 'underline',
              cursor: 'pointer',
              fontFamily: 'Arial, sans-serif',
              padding: 0,
              opacity: isLoading ? 0.6 : 1
            }}
          >
            Forgot Password?
          </button>
        </div>

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

        {/* Forgot Password Modal */}
        {showForgotPassword && (
          <div style={{
            position: 'fixed',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            backgroundColor: 'rgba(0,0,0,0.5)',
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'center',
            zIndex: 3000,
            padding: '20px',
            boxSizing: 'border-box'
          }}>
            <div style={{
              backgroundColor: '#f6f5f3',
              border: '3px solid #000',
              borderRadius: '12px',
              padding: '30px',
              width: '100%',
              maxWidth: '400px',
              textAlign: 'center'
            }}>
              {!resetEmailSent ? (
                <>
                  <h2 style={{
                    margin: '0 0 20px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    Reset Your Password
                  </h2>
                  <p style={{
                    margin: '0 0 20px 0',
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    Enter your email address and we'll send you a link to reset your password.
                  </p>
                  <form onSubmit={handleForgotPasswordSubmit}>
                    <input
                      type="email"
                      value={forgotPasswordEmail}
                      onChange={(e) => setForgotPasswordEmail(e.target.value)}
                      placeholder="Enter your email address"
                      required
                      disabled={isSendingReset}
                      style={{
                        width: '100%',
                        padding: '12px 16px',
                        border: '2px solid #000',
                        borderRadius: '8px',
                        backgroundColor: isSendingReset ? '#f0f0f0' : '#fff',
                        fontSize: '16px',
                        fontFamily: 'Arial, sans-serif',
                        color: '#000',
                        marginBottom: '20px',
                        boxSizing: 'border-box'
                      }}
                    />
                    <div style={{
                      display: 'flex',
                      gap: '10px',
                      justifyContent: 'center'
                    }}>
                      <button
                        type="button"
                        onClick={() => {
                          setShowForgotPassword(false)
                          setForgotPasswordEmail('')
                        }}
                        disabled={isSendingReset}
                        style={{
                          padding: '10px 20px',
                          border: '2px solid #000',
                          borderRadius: '8px',
                          backgroundColor: '#f6f5f3',
                          color: '#000',
                          fontSize: '14px',
                          fontFamily: 'Arial, sans-serif',
                          cursor: isSendingReset ? 'not-allowed' : 'pointer',
                          opacity: isSendingReset ? 0.6 : 1
                        }}
                      >
                        Cancel
                      </button>
                      <button
                        type="submit"
                        disabled={isSendingReset}
                        style={{
                          padding: '10px 20px',
                          border: '2px solid #000',
                          borderRadius: '8px',
                          backgroundColor: '#000',
                          color: '#f6f5f3',
                          fontSize: '14px',
                          fontFamily: 'Arial, sans-serif',
                          cursor: isSendingReset ? 'not-allowed' : 'pointer',
                          opacity: isSendingReset ? 0.6 : 1
                        }}
                      >
                        {isSendingReset ? 'Sending...' : 'Send Reset Link'}
                      </button>
                    </div>
                  </form>
                </>
              ) : (
                <div>
                  <h2 style={{
                    margin: '0 0 15px 0',
                    fontSize: '20px',
                    fontWeight: 'bold',
                    color: '#000'
                  }}>
                    Reset Link Sent! 
                  </h2>
                  <p style={{
                    margin: '0 0 10px 0',
                    fontSize: '14px',
                    color: '#666',
                    lineHeight: '1.4'
                  }}>
                    Check your email for a password reset link.
                  </p>
                  <p style={{
                    margin: '0',
                    fontSize: '12px',
                    color: '#999',
                    fontStyle: 'italic'
                  }}>
                    This window will close automatically...
                  </p>
                </div>
              )}
            </div>
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