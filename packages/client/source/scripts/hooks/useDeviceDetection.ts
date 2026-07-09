import { useState, useEffect } from 'react';

const useDeviceDetection = (): string => {
  const [device, setDevice] = useState('');

  useEffect(() => {
    const handleDeviceDetection = (): void => {
      const userAgent = navigator.userAgent.toLowerCase();
      const isMobile = /iphone|ipad|ipod|android|blackberry|windows phone/g.test(userAgent);
      const isTablet = /(ipad|tablet|playbook|silk)|(android(?!.*mobile))/g.test(userAgent);

      if (isMobile) {
        setDevice('Mobile');
      } else if (isTablet) {
        setDevice('Tablet');
      } else {
        setDevice('Desktop');
      }
    };

    handleDeviceDetection();
    window.addEventListener('resize', handleDeviceDetection);

    return (): void => {
      window.removeEventListener('resize', handleDeviceDetection);
    };
  }, []);

  return device;
};

export default useDeviceDetection;