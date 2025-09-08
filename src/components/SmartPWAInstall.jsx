import React, { useState, useEffect } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const SmartPWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
  const [showBanner, setShowBanner] = useState(false);
  const [isDismissed, setIsDismissed] = useState(false);
  const deviceInfo = useDeviceDetection();

  useEffect(() => {
    // Check if user already dismissed the banner
    const dismissed = localStorage.getItem('pwa-banner-dismissed');
    if (dismissed) {
      setIsDismissed(true);
      return;
    }

    // Check if already installed
    if (window.matchMedia('(display-mode: standalone)').matches) {
      return;
    }

    const handleBeforeInstallPrompt = (e) => {
      e.preventDefault();
      setDeferredPrompt(e);
      setShowBanner(true);
    };

    // Only show on devices that can actually install
    if (deviceInfo.canInstallPWA || deviceInfo.isIOS) {
      // Show after a delay to not be jarring
      setTimeout(() => {
        setShowBanner(true);
      }, 3000);
    }

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    };
  }, [deviceInfo]);

  const handleDismiss = () => {
    setIsDismissed(true);
    setShowBanner(false);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = async () => {
    if (deferredPrompt) {
      deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      setDeferredPrompt(null);
    }
    setShowBanner(false);
  };

  if (isDismissed || !showBanner) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#F6F5F3',
      borderTop: '1px solid #000',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: '#333',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.1)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ 
          width: '24px', 
          height: '24px', 
          backgroundColor: '#000',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: 'white',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          CD
        </div>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
            Install Celluloid by Design
          </div>
          <div style={{ fontSize: '12px', color: '#666' }}>
            Get the full film discovery experience
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        {deferredPrompt && (
          <button
            onClick={handleInstall}
            style={{
              backgroundColor: '#000',
              color: '#F6F5F3',
              border: 'none',
              padding: '8px 16px',
              borderRadius: '4px',
              fontSize: '13px',
              fontWeight: '600',
              cursor: 'pointer'
            }}
          >
            Install
          </button>
        )}
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#666',
            padding: '4px'
          }}
        >
          ×
        </button>
      </div>
    </div>
  );
};

export default SmartPWAInstall;