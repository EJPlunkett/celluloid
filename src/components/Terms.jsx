import { useState } from 'react'
import { useNavigation } from '../hooks/useNavigation'
import Navigation from '../components/Navigation'

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
          <li style={{ marginBottom: '8px' }}>You retain ownership of your content. By saving content in the Service, you grant us a limited license to store, display, and process it solely to operate and improve the Service.</li>
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
          Some recommendations and matches provided through the Service are generated with the assistance of artificial intelligence (“AI”). The AI is used to analyze aesthetics, colors, and patterns across films to suggest possible connections. Because AI processes can be imperfect, results may not always reflect intended matches. You acknowledge that recommendations are provided for discovery purposes and should not be relied on as definitive or factual information.
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
          <li style={{ marginBottom: '8px' }}>Generate anonymized, aggregate insights about trends, such as popular vibes, colors, or aesthetic tags. These insights may be presented on the website but are never linked to your personal information.</li>
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

      <Navigation navOpen={navOpen} setNavOpen={setNavOpen} />

      <footer style={{
        fontSize: '14px',
        color: '#000',
        textAlign: 'center',
        padding: '20px',
        userSelect: 'none',
        background: '#f6f5f3'
      }}>
       <span>© 2025 Celluloid by Design <span style={{ opacity: 0.5, fontStyle: 'normal' }}>(BETA)</span></span>
      </footer>
    </div>
  )
}

export default Terms