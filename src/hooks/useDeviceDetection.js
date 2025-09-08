import { useState, useEffect } from 'react';

export const useDeviceDetection = () => {
  const [deviceInfo, setDeviceInfo] = useState({
    isIOS: false,
    isSafari: false,
    isChrome: false,
    isFirefox: false,
    isMobile: false,
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
    
    // Detect mobile
    const isMobile = /android|webos|iphone|ipad|ipod|blackberry|iemobile|opera mini/.test(userAgent);
    
    // Determine if PWA installation is possible
    let canInstallPWA = false;
    
    if (isIOS) {
      // On iOS, only Safari can install PWAs
      canInstallPWA = isSafari;
    } else {
      // On other platforms, most modern browsers support PWA installation
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
      canInstallPWA
    });
  }, []);

  return deviceInfo;
};