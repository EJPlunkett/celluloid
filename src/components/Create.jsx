import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import { supabase } from '../lib/supabase'
import Navigation from '../components/Navigation'

function Create() {
  const [navOpen, setNavOpen] = useState(false)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [formData, setFormData] = useState({
    firstName: '',
    lastName: '',
    email: '',
    password: '',
    confirmPassword: '',
    region: ''
  })
  const navigation = useNavigation()

  // Common streaming regions
  const regions = [
    { value: 'US', label: 'United States' },
    { value: 'CA', label: 'Canada' },
    { value: 'GB', label: 'United Kingdom' },
    { value: 'IE', label: 'Ireland' },
    { value: 'AU', label: 'Australia' },
    { value: 'NZ', label: 'New Zealand' },
    { value: 'FR', label: 'France' },
    { value: 'DE', label: 'Germany' },
    { value: 'ES', label: 'Spain' },
    { value: 'IT', label: 'Italy' },
    { value: 'NL', label: 'Netherlands' },
    { value: 'SE', label: 'Sweden' },
    { value: 'DK', label: 'Denmark' },
    { value: 'NO', label: 'Norway' },
    { value: 'FI', label: 'Finland' },
    { value: 'BR', label: 'Brazil' },
    { value: 'MX', label: 'Mexico' },
    { value: 'AR', label: 'Argentina' },
    { value: 'IN', label: 'India' },
    { value: 'JP', label: 'Japan' },
    { value: 'KR', label: 'South Korea' },
    { value: 'ZA', label: 'South Africa' },
    { value: 'TR', label: 'Turkey' },
    { value: 'PL', label: 'Poland' },
    { value: 'CH', label: 'Switzerland' },
    { value: 'AT', label: 'Austria' },
    { value: 'BE', label: 'Belgium' },
    { value: 'PT', label: 'Portugal' },
    { value: 'OTHER', label: 'Other' }
  ]

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
    
    // Check if passwords match
    if (formData.password !== formData.confirmPassword) {
      alert('Passwords do not match. Please try again.')
      return
    }

    setIsSubmitting(true)

    try {
      // 1. Sign up the user with Supabase Auth
      const { data: authData, error: authError } = await supabase.auth.signUp({
        email: formData.email,
        password: formData.password,
        options: {
          data: {
            first_name: formData.firstName,
            last_name: formData.lastName,
            region: formData.region
          }
        }
      })

      if (authError) {
        throw authError
      }

      // 2. If auth successful, create profile record
      if (authData.user) {
        const { error: profileError } = await supabase
          .from('profiles')
          .insert([
            {
              user_id: authData.user.id,
              first_name: formData.firstName,
              last_name: formData.lastName,
              email: formData.email,
              watching_region: formData.region
            }
          ])

        if (profileError) {
          console.error('Profile creation error:', profileError)
          // Note: User auth was created, so we don't throw here
        }
      }

      // Navigate to welcome page with user's first name
      navigation.goToWelcome({ firstName: formData.firstName })

    } catch (error) {
      console.error('Error creating account:', error)
      alert(error.message || 'Error creating account. Please try again.')
    } finally {
      setIsSubmitting(false)
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

        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.5,
          margin: '0 0 30px 0',
          color: '#000',
          whiteSpace: 'normal',
          textAlign: 'center'
        }}>
          Build your personal archive.<br />
          Create an account to save matches and curate films by aesthetic.
        </p>

        <form 
          onSubmit={handleSubmit}
          style={{
            display: 'flex',
            flexDirection: 'column',
            gap: '20px',
            marginBottom: '30px',
            textAlign: 'left'
          }}
        >
          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label 
              htmlFor="firstName"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              First Name
            </label>
            <input 
              type="text"
              id="firstName"
              name="firstName"
              value={formData.firstName}
              onChange={handleInputChange}
              required
              placeholder="Enter your first name"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label 
              htmlFor="lastName"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              Last Name
            </label>
            <input 
              type="text"
              id="lastName"
              name="lastName"
              value={formData.lastName}
              onChange={handleInputChange}
              required
              placeholder="Enter your last name"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

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
              placeholder="Enter your email address"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease'
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
              placeholder="Create a password"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease'
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
              Confirm Password
            </label>
            <input 
              type="password"
              id="confirmPassword"
              name="confirmPassword"
              value={formData.confirmPassword}
              onChange={handleInputChange}
              required
              placeholder="Confirm your password"
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: '#000',
                transition: 'border-color 0.2s ease'
              }}
            />
          </div>

          <div style={{
            display: 'flex',
            flexDirection: 'column'
          }}>
            <label 
              htmlFor="region"
              style={{
                fontWeight: 500,
                fontSize: '16px',
                marginBottom: '8px',
                color: '#000'
              }}
            >
              Watching Region
            </label>
            <p style={{
              fontSize: '14px',
              color: '#666',
              margin: '0 0 8px 0',
              lineHeight: 1.4,
              fontStyle: 'italic'
            }}>
              Pick your region to fine-tune results. Market-based streaming filters coming soon.
            </p>
            <select 
              id="region"
              name="region"
              value={formData.region}
              onChange={handleInputChange}
              required
              style={{
                padding: '12px 16px',
                border: '2px solid #000',
                borderRadius: '8px',
                backgroundColor: '#fff',
                fontSize: '16px',
                fontFamily: 'Arial, sans-serif',
                color: formData.region ? '#000' : '#666',
                transition: 'border-color 0.2s ease',
                cursor: 'pointer'
              }}
            >
              <option value="" disabled style={{ color: '#666' }}>
                Select your region
              </option>
              {regions.map((region) => (
                <option key={region.value} value={region.value} style={{ color: '#000' }}>
                  {region.label}
                </option>
              ))}
            </select>
          </div>
        </form>

        <button 
          type="submit"
          onClick={handleSubmit}
          disabled={isSubmitting}
          style={{
            marginTop: '20px',
            width: '150px',
            height: 'auto',
            background: 'transparent',
            border: 'none',
            cursor: isSubmitting ? 'not-allowed' : 'pointer',
            display: 'block',
            marginLeft: 'auto',
            marginRight: 'auto',
            opacity: isSubmitting ? 0.6 : 1
          }}
        >
          <img 
            src="/Submit Button.png" 
            alt={isSubmitting ? "Creating Account..." : "Create Account"}
            style={{
              width: '100%',
              height: 'auto',
              display: 'block',
              objectFit: 'contain'
            }}
          />
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
       <span>© 2025 Celluloid by Design <span style={{ opacity: 0.8 }}>(BETA)</span></span>
      </footer>
    </div>
  )
}

export default Create