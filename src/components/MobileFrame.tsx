import React, { useState, useEffect } from 'react';
import { Wifi, Battery, Signal, ArrowLeft } from 'lucide-react';
import { UserProfile } from '../types';

interface MobileFrameProps {
  children: React.ReactNode;
  title: string;
  onBack?: () => void;
  showBack?: boolean;
  themeColor: string; // e.g., emerald, indigo, teal, etc.
  user: UserProfile;
  bottomNav?: React.ReactNode;
  floatingButton?: React.ReactNode;
}

// Coordinate theme styling parameters to match High Density MD3 colors
export const getThemeStyles = (themeColor: string) => {
  switch (themeColor) {
    case 'indigo':
      return {
        primary: '#4F5B9A',
        lightContainer: '#E0E1FF',
        darkText: '#09164F',
        frameBg: 'bg-[#F6F7FB]',
        secondaryBg: 'bg-[#F0F1FC]',
        borderCol: 'border-indigo-100',
        statusBarBg: 'bg-[#F6F7FB]',
        statusBarText: 'text-[#09164F]',
        headerBg: 'bg-[#F6F7FB]',
        headerText: 'text-[#1D1B20]',
        pillActive: 'bg-[#E0E1FF] text-[#09164F]',
        pillInactive: 'text-slate-500 hover:text-[#09164F]',
        badgeBg: 'bg-[#E0E1FF] text-[#09164F]',
        badgeBorder: 'border-[#4F5B9A]',
        progressBg: 'bg-[#4F5B9A]',
        buttonBg: 'bg-[#4F5B9A] text-white hover:bg-[#3E4980]',
        textAccent: 'text-[#4F5B9A]',
      };
    case 'emerald':
      return {
        primary: '#006E3A',
        lightContainer: '#C1F0C8',
        darkText: '#00210B',
        frameBg: 'bg-[#F4FAF6]',
        secondaryBg: 'bg-[#ECF8EE]',
        borderCol: 'border-emerald-100',
        statusBarBg: 'bg-[#F4FAF6]',
        statusBarText: 'text-[#00210B]',
        headerBg: 'bg-[#F4FAF6]',
        headerText: 'text-[#1D1B20]',
        pillActive: 'bg-[#C1F0C8] text-[#00210B]',
        pillInactive: 'text-slate-500 hover:text-[#006E3A]',
        badgeBg: 'bg-[#C1F0C8] text-[#00210B]',
        badgeBorder: 'border-[#006E3A]',
        progressBg: 'bg-[#006E3A]',
        buttonBg: 'bg-[#006E3A] text-white hover:bg-[#00552D]',
        textAccent: 'text-[#006E3A]',
      };
    case 'amber':
      return {
        primary: '#7D5800',
        lightContainer: '#FFDF9D',
        darkText: '#271900',
        frameBg: 'bg-[#FCFAF2]',
        secondaryBg: 'bg-[#F5F2E6]',
        borderCol: 'border-amber-100',
        statusBarBg: 'bg-[#FCFAF2]',
        statusBarText: 'text-[#271900]',
        headerBg: 'bg-[#FCFAF2]',
        headerText: 'text-[#1D1B20]',
        pillActive: 'bg-[#FFDF9D] text-[#271900]',
        pillInactive: 'text-slate-500 hover:text-[#7D5800]',
        badgeBg: 'bg-[#FFDF9D] text-[#271900]',
        badgeBorder: 'border-[#7D5800]',
        progressBg: 'bg-[#7D5800]',
        buttonBg: 'bg-[#7D5800] text-white hover:bg-[#624400]',
        textAccent: 'text-[#7D5800]',
      };
    case 'rose':
      return {
        primary: '#9B4052',
        lightContainer: '#FFD9DD',
        darkText: '#3E0011',
        frameBg: 'bg-[#FFF5F6]',
        secondaryBg: 'bg-[#FCEEF0]',
        borderCol: 'border-rose-100',
        statusBarBg: 'bg-[#FFF5F6]',
        statusBarText: 'text-[#3E0011]',
        headerBg: 'bg-[#FFF5F6]',
        headerText: 'text-[#1D1B20]',
        pillActive: 'bg-[#FFD9DD] text-[#3E0011]',
        pillInactive: 'text-slate-500 hover:text-[#9B4052]',
        badgeBg: 'bg-[#FFD9DD] text-[#3E0011]',
        badgeBorder: 'border-[#9B4052]',
        progressBg: 'bg-[#9B4052]',
        buttonBg: 'bg-[#9B4052] text-white hover:bg-[#803140]',
        textAccent: 'text-[#9B4052]',
      };
    case 'teal':
    default:
      // Premium MD3 Lavender / Purple styles (Matches the High Density design template exactly by default!)
      return {
        primary: '#6750A4',
        lightContainer: '#EADDFF',
        darkText: '#21005D',
        frameBg: 'bg-[#FEF7FF]',
        secondaryBg: 'bg-[#F3EDF7]',
        borderCol: 'border-slate-100',
        statusBarBg: 'bg-[#FEF7FF]',
        statusBarText: 'text-[#1D1B20]',
        headerBg: 'bg-[#FEF7FF]',
        headerText: 'text-[#1D1B20]',
        pillActive: 'bg-[#EADDFF] text-[#21005D]',
        pillInactive: 'text-slate-500 hover:text-[#6750A4]',
        badgeBg: 'bg-[#EADDFF] text-[#21005D]',
        badgeBorder: 'border-[#6750A4]',
        progressBg: 'bg-[#6750A4]',
        buttonBg: 'bg-[#6750A4] text-white hover:bg-[#533F8A]',
        textAccent: 'text-[#6750A4]',
      };
  }
};

export default function MobileFrame({
  children,
  title,
  onBack,
  showBack = false,
  themeColor,
  user,
  bottomNav,
  floatingButton,
}: MobileFrameProps) {
  const [time, setTime] = useState('');

  useEffect(() => {
    const updateTime = () => {
      const now = new Date();
      let hours = now.getHours();
      const minutes = String(now.getMinutes()).padStart(2, '0');
      setTime(`${hours}:${minutes}`);
    };

    updateTime();
    const interval = setInterval(updateTime, 60000);
    return () => clearInterval(interval);
  }, []);

  const themeStyles = getThemeStyles(themeColor);

  // Get user initials for top app bar avatar
  const getInitials = (fullName: string) => {
    return fullName
      .split(' ')
      .map((n) => n[0])
      .slice(0, 2)
      .join('')
      .toUpperCase();
  };

  return (
    <div className="min-h-screen bg-slate-100 flex items-center justify-center p-0 md:p-6 transition-colors duration-300 font-sans">
      {/* Outer Phone Mockup Frame for Desktop, pure responsive container */}
      <div className={`w-full md:w-[375px] h-screen md:h-[720px] ${themeStyles.frameBg} md:rounded-[40px] md:shadow-2xl md:border-[12px] md:border-slate-900 flex flex-col overflow-hidden relative transition-all`}>
        
        {/* Simulation Status Bar */}
        <div className={`h-8 ${themeStyles.statusBarBg} ${themeStyles.statusBarText} flex items-center justify-between px-6 pt-4 pb-2 text-xs select-none z-40 shrink-0`}>
          <span className="font-bold">{time}</span>
          <div className="flex gap-1 items-center">
            <Signal className="w-3 h-3 opacity-95" />
            <Wifi className="w-3 h-3 opacity-95" />
            <div className="w-4 h-3 border border-current rounded-sm relative ml-0.5 opacity-90">
              <div className="absolute right-[-2px] top-1/2 -translate-y-1/2 w-[2px] h-1 bg-current"></div>
              <div className="h-full w-[80%] bg-current"></div>
            </div>
          </div>
        </div>

        {/* Header App Bar (High Density Material Design 3 style) */}
        <header className={`px-6 py-3 flex items-center justify-between z-30 shrink-0 ${themeStyles.headerBg}`}>
          <div className="flex items-center gap-3">
            {showBack && (
              <button
                id="btn-back-header"
                onClick={onBack}
                className="p-1.5 rounded-full hover:bg-black/5 active:bg-black/10 transition-colors cursor-pointer"
                aria-label="Kembali"
              >
                <ArrowLeft className="w-5 h-5 text-slate-800" />
              </button>
            )}
            <div>
              <h1 className="text-xl font-extrabold text-[#1D1B20] tracking-tight leading-none">
                {title}
              </h1>
              <p className="text-[10px] text-slate-500 font-medium mt-1 uppercase tracking-wider">
                Meningkatkan Efisiensi Belajar
              </p>
            </div>
          </div>
          
          {/* User Initials Avatar badge inside Top App Bar */}
          <div className={`w-9 h-9 rounded-full ${themeStyles.badgeBg} border ${themeStyles.badgeBorder} flex items-center justify-center ${themeStyles.darkText} text-xs font-bold shadow-sm shrink-0`}>
            {getInitials(user.name)}
          </div>
        </header>

        {/* Dynamic Content Container */}
        <main className="flex-1 overflow-y-auto relative flex flex-col no-scrollbar">
          {children}
        </main>

        {/* Stationary Floating Button Slot */}
        {floatingButton}

        {/* Render embedded Bottom Navigation Bar */}
        {bottomNav}

        {/* Virtual Android Home Indicator Bar for Desktop */}
        <div className={`h-4 flex justify-center items-center shrink-0 z-40 ${themeStyles.secondaryBg}`}>
          <div className="w-24 h-1 bg-slate-400/80 rounded-full"></div>
        </div>
      </div>
    </div>
  );
}
