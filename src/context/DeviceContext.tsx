import React, { createContext, useContext, useState, useEffect, ReactNode } from 'react';
import { getDeviceOptimizations, performanceUtils } from '../config/performance';

export interface DeviceInfo {
  isMobile: boolean;
  isIOS: boolean;
  isAndroid: boolean;
  isTablet: boolean;
  userAgent: string;
  screenWidth: number;
  screenHeight: number;
}

interface DeviceContextType {
  deviceInfo: DeviceInfo;
  isMobileView: boolean;
  optimizations: any;
  prefersReducedMotion: boolean;
}

const DeviceContext = createContext<DeviceContextType | undefined>(undefined);

interface DeviceProviderProps {
  children: ReactNode;
}

export const DeviceProvider: React.FC<DeviceProviderProps> = ({ children }) => {
  const [deviceInfo, setDeviceInfo] = useState<DeviceInfo>({
    isMobile: false,
    isIOS: false,
    isAndroid: false,
    isTablet: false,
    userAgent: '',
    screenWidth: 0,
    screenHeight: 0,
  });

  useEffect(() => {
    const updateDeviceInfo = () => {
      const userAgent = navigator.userAgent || '';
      const screenWidth = window.innerWidth;
      const screenHeight = window.innerHeight;

      // Enhanced mobile platform detection
      const isIOS = /iPad|iPhone|iPod/.test(userAgent);
      const isAndroid = /Android/.test(userAgent);
      
      // Better tablet detection - tablets are between 768px and 1024px with touch
      const isTablet = (screenWidth >= 768 && screenWidth <= 1024) && 
        ('ontouchstart' in window || /iPad|Android/.test(userAgent));
      
      // More accurate mobile detection - true mobiles are smaller screens with touch
      const isMobileDevice = (screenWidth <= 640) || 
        (screenWidth <= 768 && 'ontouchstart' in window && !isTablet) ||
        /Android|webOS|iPhone|iPod|BlackBerry|IEMobile|Opera Mini/i.test(userAgent);

      setDeviceInfo({
        isMobile: isMobileDevice,
        isIOS,
        isAndroid,
        isTablet,
        userAgent,
        screenWidth,
        screenHeight,
      });
    };

    updateDeviceInfo();
    window.addEventListener('resize', updateDeviceInfo);
    window.addEventListener('orientationchange', updateDeviceInfo);

    return () => {
      window.removeEventListener('resize', updateDeviceInfo);
      window.removeEventListener('orientationchange', updateDeviceInfo);
    };
  }, []);

  // Use only automatic detection
  const isMobileView = deviceInfo.isMobile;
  
  // Get device-specific optimizations
  const optimizations = getDeviceOptimizations(deviceInfo);
  const prefersReducedMotion = performanceUtils.prefersReducedMotion();

  const value: DeviceContextType = {
    deviceInfo,
    isMobileView,
    optimizations,
    prefersReducedMotion,
  };

  return (
    <DeviceContext.Provider value={value}>
      {children}
    </DeviceContext.Provider>
  );
};

export const useDeviceDetection = (): DeviceContextType => {
  const context = useContext(DeviceContext);
  if (context === undefined) {
    throw new Error('useDeviceDetection must be used within a DeviceProvider');
  }
  return context;
};