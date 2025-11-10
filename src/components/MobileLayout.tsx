import React from 'react';
import { useDeviceDetection } from '../context/DeviceContext';

interface MobileLayoutProps {
  children: React.ReactNode;
  className?: string;
  mobileClassName?: string;
  desktopClassName?: string;
}

export const MobileLayout: React.FC<MobileLayoutProps> = ({
  children,
  className = '',
  mobileClassName = '',
  desktopClassName = '',
}) => {
  const { isMobileView } = useDeviceDetection();

  const computedClassName = `
    ${className}
    ${isMobileView ? mobileClassName : desktopClassName}
  `.trim();

  return (
    <div className={computedClassName} data-mobile-view={isMobileView}>
      {children}
    </div>
  );
};

interface ResponsiveGridProps {
  children: React.ReactNode;
  className?: string;
}

export const ResponsiveGrid: React.FC<ResponsiveGridProps> = ({
  children,
  className = '',
}) => {
  const { isMobileView, deviceInfo } = useDeviceDetection();

  const gridClasses = isMobileView
    ? `grid grid-cols-1 gap-4 ${deviceInfo.isTablet ? 'sm:grid-cols-2' : ''}`
    : 'grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 3xl:grid-cols-6 4xl:grid-cols-7 gap-6';

  return (
    <div className={`${gridClasses} ${className}`}>
      {children}
    </div>
  );
};

interface MobileNavProps {
  children: React.ReactNode;
  className?: string;
}

export const MobileNav: React.FC<MobileNavProps> = ({
  children,
  className = '',
}) => {
  const { isMobileView } = useDeviceDetection();

  if (isMobileView) {
    return (
      <div className={`fixed bottom-0 left-0 right-0 bg-white/95 dark:bg-slate-900/95 
                      backdrop-blur-md border-t border-slate-200/60 dark:border-white/20 
                      shadow-2xl z-50 pb-safe ${className}`}>
        <div className="flex justify-around items-center px-4 py-3">
          {children}
        </div>
      </div>
    );
  }

  return (
    <nav className={`${className}`}>
      {children}
    </nav>
  );
};

interface MobileCardProps {
  children: React.ReactNode;
  className?: string;
  onClick?: () => void;
}

export const MobileCard: React.FC<MobileCardProps> = ({
  children,
  className = '',
  onClick,
}) => {
  const { isMobileView, deviceInfo } = useDeviceDetection();

  const cardClasses = isMobileView
    ? `bg-white/95 dark:bg-slate-800/95 backdrop-blur-lg border border-slate-200/60 
       dark:border-white/10 rounded-2xl shadow-lg transition-all duration-200
       ${deviceInfo.isIOS ? 'p-5' : 'p-4'} 
       ${onClick ? 'cursor-pointer active:scale-95 active:shadow-md' : ''}
       ${deviceInfo.isAndroid ? 'active:bg-white/100 dark:active:bg-slate-800/100' : ''}`
    : `bg-white/75 dark:bg-slate-800/75 backdrop-blur-xl border border-slate-200/60 
       dark:border-white/10 rounded-3xl p-6 shadow-xl transition-all duration-300
       ${onClick ? 'cursor-pointer hover:scale-[1.02] hover:shadow-2xl hover:bg-white/85 dark:hover:bg-slate-800/85' : ''}`;

  return (
    <div className={`${cardClasses} ${className}`} onClick={onClick}>
      {children}
    </div>
  );
};

interface MobileTextProps {
  children: React.ReactNode;
  className?: string;
  size?: 'xs' | 'sm' | 'base' | 'lg' | 'xl' | '2xl' | '3xl';
}

export const MobileText: React.FC<MobileTextProps> = ({
  children,
  className = '',
  size = 'base',
}) => {
  const { isMobileView } = useDeviceDetection();

  const sizeMap = {
    xs: isMobileView ? 'text-xs' : 'text-xs',
    sm: isMobileView ? 'text-sm' : 'text-sm',
    base: isMobileView ? 'text-base' : 'text-base',
    lg: isMobileView ? 'text-lg' : 'text-xl',
    xl: isMobileView ? 'text-xl' : 'text-2xl',
    '2xl': isMobileView ? 'text-xl' : 'text-3xl',
    '3xl': isMobileView ? 'text-2xl' : 'text-4xl',
  };

  return (
    <div className={`${sizeMap[size]} ${className}`}>
      {children}
    </div>
  );
};

interface MobileButtonProps {
  children: React.ReactNode;
  onClick?: () => void;
  className?: string;
  variant?: 'primary' | 'secondary' | 'ghost';
  size?: 'sm' | 'md' | 'lg';
  disabled?: boolean;
}

export const MobileButton: React.FC<MobileButtonProps> = ({
  children,
  onClick,
  className = '',
  variant = 'primary',
  size = 'md',
  disabled = false,
}) => {
  const { isMobileView } = useDeviceDetection();

  const baseClasses = `
    inline-flex items-center justify-center font-medium rounded-xl 
    transition-all duration-200 focus:outline-none focus:ring-2 
    focus:ring-offset-2 disabled:opacity-50 disabled:cursor-not-allowed
  `;

  const variantClasses = {
    primary: `
      bg-gradient-to-r from-emerald-500 to-cyan-500 text-white 
      hover:from-emerald-600 hover:to-cyan-600 focus:ring-emerald-500
      ${isMobileView ? 'active:scale-95' : 'hover:scale-105 shadow-lg hover:shadow-xl'}
    `,
    secondary: `
      bg-white/90 dark:bg-slate-800/90 text-slate-700 dark:text-slate-200 
      border border-slate-200 dark:border-slate-600 hover:bg-white dark:hover:bg-slate-700
      ${isMobileView ? 'active:scale-95' : 'hover:scale-105 shadow-md hover:shadow-lg'}
    `,
    ghost: `
      text-slate-600 dark:text-slate-300 hover:bg-slate-100 dark:hover:bg-slate-800
      ${isMobileView ? 'active:bg-slate-200 dark:active:bg-slate-700' : 'hover:scale-105'}
    `,
  };

  const sizeClasses = {
    sm: isMobileView ? 'px-3 py-2 text-sm' : 'px-4 py-2 text-sm',
    md: isMobileView ? 'px-4 py-3 text-base' : 'px-6 py-3 text-base',
    lg: isMobileView ? 'px-6 py-4 text-lg' : 'px-8 py-4 text-lg',
  };

  return (
    <button
      onClick={onClick}
      disabled={disabled}
      className={`${baseClasses} ${variantClasses[variant]} ${sizeClasses[size]} ${className}`}
    >
      {children}
    </button>
  );
};