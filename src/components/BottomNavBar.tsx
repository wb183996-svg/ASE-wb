/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */

import React from 'react';
import { Home, BookOpen, Search, BarChart3, Settings } from 'lucide-react';
import { ThemeColor } from '../types';
import { getThemeStyles } from './MobileFrame';

interface BottomNavBarProps {
  currentView: string;
  onViewChange: (view: string) => void;
  themeColor: ThemeColor;
}

export default function BottomNavBar({
  currentView,
  onViewChange,
  themeColor,
}: BottomNavBarProps) {
  
  // Define nav items with their translations and icons
  const navItems = [
    { id: 'beranda', label: 'Beranda', icon: Home },
    { id: 'bukusaya', label: 'Buku Saya', icon: BookOpen },
    { id: 'jelajahi', label: 'Jelajahi', icon: Search },
    { id: 'ringkasan', label: 'Ringkasan', icon: BarChart3 },
    { id: 'pengaturan', label: 'Pengaturan', icon: Settings },
  ];

  const themeStyles = getThemeStyles(themeColor);

  return (
    <nav className={`h-18 ${themeStyles.secondaryBg} border-t border-slate-200/50 flex items-center justify-around px-2 z-40 shrink-0`}>
      {navItems.map((item) => {
        const IconComponent = item.icon;
        const isActive = currentView === item.id;

        return (
          <button
            key={item.id}
            id={`btn-nav-${item.id}`}
            onClick={() => onViewChange(item.id)}
            className="flex flex-col items-center justify-center flex-1 h-full py-1 cursor-pointer select-none group focus:outline-none"
            aria-label={item.label}
          >
            {/* Active Pill Bubble Highlight - Signature M3 element */}
            <div className={`px-5 py-1 rounded-full transition-all duration-200 flex items-center justify-center ${
              isActive 
                ? themeStyles.pillActive 
                : 'text-slate-500 group-hover:text-slate-800 group-active:scale-95'
            }`}>
              <IconComponent className={`w-4.5 h-4.5 transition-transform duration-200 ${isActive ? 'scale-105' : 'group-hover:scale-105'}`} />
            </div>
            
            {/* M3 label below icon */}
            <span className={`text-[10px] mt-1 transition-all leading-none font-bold ${
              isActive 
                ? themeStyles.textAccent 
                : 'text-slate-400 group-hover:text-slate-600'
            }`}>
              {item.label}
            </span>
          </button>
        );
      })}
    </nav>
  );
}
