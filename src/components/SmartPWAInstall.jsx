import React, { useState, useEffect } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const SmartPWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showInstallButton, setShowInstallButton] = useState(false);
  const [showIOSInstructions, setShowIOSInstructions] = useState(false);
  const deviceInfo = useDeviceDetection();

  useEffect(() => {
    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowInstallButton(true);
    };

    const handleAppInstalled = () => {
      setShowInstallButton(false);
      setShowIOSInstructions(false);
      setDeferredPrompt(null);
    };

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      setShowInstallButton(false);
      setShowIOSInstructions(false);
      return;
    }

    // Handle iOS devices
    if (deviceInfo.isIOS) {
      if (deviceInfo.isSafari) {
        // Safari on iOS - show install instructions
        setShowIOSInstructions(true);
      } else {
        // Chrome/other browser on iOS - show redirect suggestion
        setShowIOSInstructions(true);
      }
    } else {
      // Non-iOS devices - use standard PWA prompt handling
      window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    }

    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deviceInfo]);

  const handleInstallClick = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    
    if (outcome === 'accepted') {
      console.log('User accepted the install prompt');
    }
    
    setDeferredPrompt(null);
    setShowInstallButton(false);
  };

  const handleIOSRedirect = () => {
    // Try to open in Safari (this works on some iOS versions)
    const currentUrl = window.location.href;
    const safariUrl = `x-web-search://?${encodeURIComponent(currentUrl)}`;
    
    // First try the Safari redirect
    window.location.href = safariUrl;
    
    // Fallback: Show instructions after a delay
    setTimeout(() => {
      alert('Please copy this URL and open it in Safari to install the app:\n\n' + currentUrl);
    }, 1000);
  };

  // If already installed, don't show anything
  if (window.matchMedia('(display-mode: standalone)').matches) {
    return null;
  }

  // iOS handling
  if (deviceInfo.isIOS) {
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '2px solid #007bff',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px 0',
        textAlign: 'center',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h3 style={{ color: '#007bff', marginBottom: '15px' }}>
          📱 Install Celluloid by Design
        </h3>
        
        {deviceInfo.isSafari ? (
          // User is already in Safari
          <div>
            <p style={{ marginBottom: '15px', lineHeight: '1.5' }}>
              You're using Safari! To install this app:
            </p>
            <div style={{ 
              backgroundColor: 'white', 
              padding: '15px', 
              borderRadius: '8px',
              marginBottom: '15px',
              textAlign: 'left'
            }}>
              <ol style={{ margin: 0, paddingLeft: '20px' }}>
                <li>Tap the <strong>Share</strong> button (⬆️) below</li>
                <li>Scroll down and tap <strong>"Add to Home Screen"</strong></li>
                <li>Tap <strong>"Add"</strong> to install</li>
              </ol>
            </div>
            <p style={{ fontSize: '0.9rem', color: '#666' }}>
              The app will appear on your home screen as "Celluloid"
            </p>
          </div>
        ) : (
          // User is in Chrome or other browser on iOS
          <div>
            <p style={{ marginBottom: '15px', lineHeight: '1.5' }}>
              To install this app on iPhone, you need to use Safari.
            </p>
            <button
              onClick={handleIOSRedirect}
              style={{
                backgroundColor: '#007bff',
                color: 'white',
                border: 'none',
                padding: '12px 24px',
                borderRadius: '25px',
                fontSize: '16px',
                fontWeight: '600',
                cursor: 'pointer',
                marginBottom: '10px'
              }}
            >
              🦋 Open in Safari
            </button>
            <p style={{ fontSize: '0.85rem', color: '#666', marginTop: '10px' }}>
              Or manually copy this URL and paste it into Safari
            </p>
          </div>
        )}
      </div>
    );
  }

  // Standard PWA install for non-iOS devices
  if (showInstallButton && deferredPrompt) {
    return (
      <div style={{
        backgroundColor: '#f8f9fa',
        border: '2px solid #28a745',
        borderRadius: '12px',
        padding: '20px',
        margin: '20px 0',
        textAlign: 'center',
        maxWidth: '500px',
        marginLeft: 'auto',
        marginRight: 'auto'
      }}>
        <h3 style={{ color: '#28a745', marginBottom: '15px' }}>
          📱 Install Celluloid by Design
        </h3>
        <p style={{ marginBottom: '15px' }}>
          Get the full app experience with offline access and faster loading!
        </p>
        <button
          onClick={handleInstallClick}
          style={{
            backgroundColor: '#28a745',
            color: 'white',
            border: 'none',
            padding: '12px 24px',
            borderRadius: '25px',
            fontSize: '16px',
            fontWeight: '600',
            cursor: 'pointer'
          }}
        >
          📲 Install App
        </button>
      </div>
    );
  }

  // Fallback for browsers that don't support install prompts
  if (!deviceInfo.canInstallPWA) {
    return (
      <div style={{
        backgroundColor: '#fff3cd',
        border: '1px solid #ffeaa7',
        borderRadius: '8px',
        padding: '15px',
        margin: '20px 0',
        textAlign: 'center'
      }}>
        <p>Your browser doesn't support app installation. For the best experience, try using Chrome, Edge, or Safari.</p>
      </div>
    );
  }

  return null;
};

export default SmartPWAInstall;