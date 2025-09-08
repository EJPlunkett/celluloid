import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isMobile: false,
    isDesktop: false,
    canInstallPWA: false
  });

  useEffect(() => {
    const userAgent = navigator.userAgent.toLowerCase();
    
    // Detect iOS
    const isIOS = /ipad|iphone|ipod/.test(userAgent) || 
                  (navigator.platform === 'MacIntel' && navigator.maxTouchPoints > 1);
    
    // Detect browsers
    const isSafari = /safari/.test(userAgent) && !/chrome/.test(userAgent);
    const isChrome = /chrome/.test(userAgent) && !/edg/.test(userAgent);
    const isFirefox = /firefox/.test(userAgent);
    
    // Detect mobile vs desktop
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    const isDesktop = !isMobile && !isIOS;
    
    // Determine if PWA installation is possible - EXCLUDE DESKTOP
    let canInstallPWA = false;
    
    if (isDesktop) {
      // Disable PWA for desktop devices
      canInstallPWA = false;
    } else if (isIOS) {
      // On iOS, only Safari can install PWAs
      canInstallPWA = isSafari;
    } else {
      // On mobile (Android, etc.), most modern browsers support PWA installation
      canInstallPWA = isChrome || isFirefox || 
                      /edg/.test(userAgent) || // Edge
                      /samsung/.test(userAgent); // Samsung Internet
    }

    setDeviceInfo({
      isIOS,
      isSafari,
      isChrome,
      isFirefox,
      isMobile,
      isDesktop,
      canInstallPWA
    });
  }, []);

  return deviceInfo;
};