import React, { useState, useEffect } from 'react';
import { useDeviceDetection } from '../hooks/useDeviceDetection';

const SmartPWAInstall = () => {
  const [deferredPrompt, setDeferredPrompt] = useState(null);
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
    };

    const handleAppInstalled = () => {
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [deviceInfo]);

  const handleDismiss = () => {
    setIsDismissed(true);
    localStorage.setItem('pwa-banner-dismissed', 'true');
  };

  const handleInstall = async () => {
    if (!deferredPrompt) return;

    deferredPrompt.prompt();
    const { outcome } = await deferredPrompt.userChoice;
    setDeferredPrompt(null);
  };

  // Only show if we have a working install prompt AND user hasn't dismissed it
  if (isDismissed || !deferredPrompt) {
    return null;
  }

  return (
    <div style={{
      position: 'fixed',
      bottom: 0,
      left: 0,
      right: 0,
      backgroundColor: '#000',
      borderTop: '1px solid #F6F5F3',
      padding: '15px 20px',
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'center',
      fontSize: '14px',
      color: '#F6F5F3',
      zIndex: 1000,
      boxShadow: '0 -2px 10px rgba(0,0,0,0.3)'
    }}>
      <div style={{ display: 'flex', alignItems: 'center', gap: '15px' }}>
        <div style={{ 
          width: '24px', 
          height: '24px', 
          backgroundColor: '#F6F5F3',
          borderRadius: '4px',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
          color: '#000',
          fontSize: '12px',
          fontWeight: 'bold'
        }}>
          CD
        </div>
        <div>
          <div style={{ fontWeight: '600', marginBottom: '2px' }}>
            Install Celluloid by Design
          </div>
          <div style={{ fontSize: '12px', color: '#ccc' }}>
            Film, filtered by aesthetics. Build your own archive.
          </div>
        </div>
      </div>
      
      <div style={{ display: 'flex', gap: '12px', alignItems: 'center' }}>
        <button
          onClick={handleInstall}
          style={{
            backgroundColor: '#F6F5F3',
            color: '#000',
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
        
        <button
          onClick={handleDismiss}
          style={{
            background: 'none',
            border: 'none',
            fontSize: '18px',
            cursor: 'pointer',
            color: '#ccc',
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