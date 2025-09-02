import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'

function Terms() {
  const [navOpen, setNavOpen] = useState(false)
  const navigation = useNavigation()

  const toggleNav = () => {
    setNavOpen(!navOpen)
  }

  return (
    <div style={{
      margin: 0,
      padding: 0,
      height: '100%',
      backgroundColor: '#f6f5f3',
      overflowX: 'hidden',
      fontFamily: 'Arial, sans-serif',
      color: '#000',
      display: 'flex',
      flexDirection: 'column',
      minHeight: '100vh'
    }}>
      <style>
        {`
          @font-face {
            font-family: 'BLANKA';
            src: url('/BLANKA.otf') format('opentype');
            font-weight: normal;
            font-style: normal;
          }
        `}
      </style>

      <header style={{
        display: 'flex',
        alignItems: 'center',
        padding: '10px 20px',
        height: 'auto',
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
        margin: '0 auto 60px',
        padding: '0 20px',
        flexGrow: 1,
        textAlign: 'left'
      }}>
        <h1 style={{
          fontFamily: "'BLANKA', Arial, sans-serif",
          fontSize: '36px',
          fontWeight: 'normal',
          margin: '40px 0 30px 0',
          textAlign: 'left',
          color: '#000'
        }} id="terms-of-service">
          Terms of Service
        </h1>
        <p style={{
          fontWeight: 300,
          fontSize: '14px',
          fontStyle: 'italic',
          margin: '0 0 20px 0',
          color: '#666',
          textAlign: 'left'
        }}>
          Effective Date: August 10, 2025
        </p>
        
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          Welcome to <em>Celluloid by Design</em>. These Terms of Service ("Terms") govern your access to and use of the <em>Celluloid by Design</em> website, mobile application, and related services ("Service"). By using the Service, you agree to these Terms. If you do not agree, do not use the Service.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Description of Service
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          <em>Celluloid by Design</em> is a film discovery platform that recommends movies based on visual aesthetics, color palettes, and style preferences. Users can create accounts, save watchlists, and explore curated recommendations.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Eligibility
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          You must be at least 13 years old to use the Service. If you are under 18, you must have permission from a parent or legal guardian.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          User Accounts
        </h2>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>You are responsible for keeping your account credentials secure.</li>
          <li style={{ marginBottom: '8px' }}>You are responsible for all activity under your account.</li>
          <li style={{ marginBottom: '8px' }}>You agree to provide accurate and current information when creating your account.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Acceptable Use
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          You agree not to:
        </p>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>Copy, distribute, or disclose any part of the Service without prior written consent.</li>
          <li style={{ marginBottom: '8px' }}>Reverse engineer, decompile, or attempt to extract the source code or algorithms of the Service.</li>
          <li style={{ marginBottom: '8px' }}>Use automated systems (including bots or scrapers) without authorization.</li>
          <li style={{ marginBottom: '8px' }}>Use the Service for unlawful purposes.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Intellectual Property
        </h2>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>All content, code, design, branding, and functionality are owned by <em>Celluloid by Design</em> and are protected by copyright, trademark, and other laws.</li>
          <li style={{ marginBottom: '8px' }}>You may not use the name, trademarks, or branding without permission.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          User Content
        </h2>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>You retain ownership of your watchlists and saved preferences.</li>
          <li style={{ marginBottom: '8px' }}>Access to certain features, including the size or number of watchlists you can store, may depend on your account type or subscription plan.</li>
          <li style={{ marginBottom: '8px' }}>By saving content in the Service, you grant a limited license to store, display, and process that content solely to operate the Service.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          AI-Generated Content Disclaimer
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          Some movie recommendations, descriptions, or aesthetic matches provided through the Service are generated in whole or in part by artificial intelligence ("AI") systems. AI outputs may contain inaccuracies, omissions, or subjective interpretations. You should not rely solely on these outputs for factual accuracy, and you acknowledge that use of AI-generated content is at your own risk.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Fees and Subscription Changes
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          The Service is currently free to use. However, <em>Celluloid by Design</em> may introduce paid subscription plans or fees for certain features in the future. If this happens, advance notice will be provided along with an opportunity to review updated terms before any charges are applied. A free plan will remain available where offered, and users may opt into a paid plan for additional features.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Termination
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          Your account may be suspended or terminated at any time if you violate these Terms.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Disclaimers and Limitation of Liability
        </h2>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>The Service is provided "as is" without warranties of any kind.</li>
          <li style={{ marginBottom: '8px' }}><em>Celluloid by Design</em> is not liable for any loss, damage, or inconvenience arising from use of the Service.</li>
          <li style={{ marginBottom: '8px' }}>No guarantee is made regarding the accuracy or availability of recommendations or third-party data.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Changes to Terms
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          These Terms may be updated from time to time. If material changes are made, notice will be provided by email or through the Service.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Contact
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          For questions about these Terms, email: <a href="mailto:hello@celluloidbydesign.com" style={{
            color: '#000',
            textDecoration: 'underline'
          }}>hello@celluloidbydesign.com</a>
        </p>

        {/* Privacy Policy Section */}
        <h1 style={{
          fontFamily: "'BLANKA', Arial, sans-serif",
          fontSize: '36px',
          fontWeight: 'normal',
          margin: '60px 0 30px 0',
          textAlign: 'left',
          color: '#000'
        }} id="privacy-policy">
          Privacy Policy
        </h1>
        <p style={{
          fontWeight: 300,
          fontSize: '14px',
          fontStyle: 'italic',
          margin: '0 0 20px 0',
          color: '#666',
          textAlign: 'left'
        }}>
          Effective Date: August 10, 2025
        </p>
        
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          Your privacy matters to <em>Celluloid by Design</em> ("we," "our," "us"). This Privacy Policy explains how we collect, use, and share information when you use our website, mobile application, and related services ("Service").
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Information We Collect
        </h2>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>We may collect information you provide directly, such as your email address, account credentials, watchlists, search preferences, and any feedback you choose to share.</li>
          <li style={{ marginBottom: '8px' }}>We also collect certain technical information automatically, such as your device type, browser type, IP address, and analytics data through cookies or similar technologies.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          How We Use Your Information
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          We use your information to:
        </p>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>Provide, operate, and improve the Service.</li>
          <li style={{ marginBottom: '8px' }}>Personalize recommendations and watchlists.</li>
          <li style={{ marginBottom: '8px' }}>Maintain security and prevent misuse.</li>
          <li style={{ marginBottom: '8px' }}>Communicate with you about updates, features, or account matters.</li>
          <li style={{ marginBottom: '8px' }}>Develop and test new features, tools, and services.</li>
        </ul>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          Some features use AI models to generate recommendations based on your inputs. These models process your input to create results but do not store your personal information beyond what is necessary to operate the feature.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Data Sharing
        </h2>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>We do not sell your personal information.</li>
          <li style={{ marginBottom: '8px' }}>We may share information with trusted service providers and partners who help us operate, improve, and market the Service. This may include hosting, authentication, analytics, payment processing, or integrations with third-party platforms (for example, to check streaming availability).</li>
          <li style={{ marginBottom: '8px' }}>We may also share aggregated or anonymized data that does not identify you.</li>
          <li style={{ marginBottom: '8px' }}>We may disclose information if required by law, court order, or to protect our rights and safety or that of others.</li>
        </ul>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Data Security
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          We take reasonable measures to protect your information, including encryption in transit and access controls. However, no method of storage or transmission is 100% secure, and you use the Service at your own risk.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Your Rights
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          Depending on your location and applicable laws, you may have the right to:
        </p>
        <ul style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          paddingLeft: '20px',
          color: '#000'
        }}>
          <li style={{ marginBottom: '8px' }}>Request access to the personal information we hold about you.</li>
          <li style={{ marginBottom: '8px' }}>Request correction of inaccurate information.</li>
          <li style={{ marginBottom: '8px' }}>Request deletion of your personal information.</li>
        </ul>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          To exercise these rights, contact us at the email below. We may need to verify your identity before fulfilling your request.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Cookies and Tracking
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          We use cookies and similar technologies for analytics, performance monitoring, and improving your experience. You can disable cookies in your browser settings, but some features of the Service may not function properly.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Data Retention
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          We retain your information for as long as your account is active or as needed to provide the Service. If you delete your account or request deletion, we will remove or anonymize your personal data within a reasonable period, subject to technical and legal limitations.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Changes to This Policy
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          We may update this Privacy Policy from time to time. If we make significant changes, we will notify you through the Service or by email before the changes take effect.
        </p>

        <h2 style={{
          fontSize: '20px',
          fontWeight: 600,
          margin: '30px 0 15px 0',
          color: '#000'
        }}>
          Contact
        </h2>
        <p style={{
          fontWeight: 300,
          fontSize: '16px',
          lineHeight: 1.6,
          margin: '0 0 15px 0',
          color: '#000'
        }}>
          For questions about this Privacy Policy, <a href="mailto:hello@celluloidbydesign.com" style={{
            color: '#000',
            textDecoration: 'underline'
          }}>hello@celluloidbydesign.com</a>
        </p>
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
        background: '#f6f5f3'
      }}>
        <span style={{ fontStyle: 'italic' }}>© 2025 <em>Celluloid by Design</em></span>
      </footer>
    </div>
  )
}

export default Terms