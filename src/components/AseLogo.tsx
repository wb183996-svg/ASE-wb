import React from 'react';

interface AseLogoProps {
  className?: string;
  size?: number | string;
  withBackground?: boolean;
}

export default function AseLogo({ className = '', size = '100%', withBackground = true }: AseLogoProps) {
  return (
    <svg
      width={size}
      height={size}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={`${className} select-none`}
      aria-label="ASE Logo"
    >
      <defs>
        {/* Background dark metallic gradient */}
        <radialGradient
          id="bgGrad"
          cx="50%"
          cy="50%"
          r="70%"
          fx="50%"
          fy="50%"
        >
          <stop offset="0%" stopColor="#151E3D" />
          <stop offset="60%" stopColor="#0B1021" />
          <stop offset="100%" stopColor="#04060C" />
        </radialGradient>

        {/* Glow effect for lightning bolt */}
        <filter id="glow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        {/* Soft shadow for letter contrast */}
        <filter id="shadow" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="2" dy="4" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Lightning bolt gradient: vibrant yellow-orange */}
        <linearGradient id="lightningGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#FFF275" />
          <stop offset="40%" stopColor="#FFB300" />
          <stop offset="100%" stopColor="#FF6D00" />
        </linearGradient>

        {/* Letter A & E metallic gradient */}
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="50%" y2="100%">
          <stop offset="0%" stopColor="#FFFFFF" />
          <stop offset="50%" stopColor="#E2E8F0" />
          <stop offset="100%" stopColor="#CBD5E1" />
        </linearGradient>

        {/* Outer Ring gradient: Cyan-Teal-Emerald */}
        <linearGradient id="ringGrad" x1="0%" y1="100%" x2="100%" y2="0%">
          <stop offset="0%" stopColor="#00F2FE" />
          <stop offset="50%" stopColor="#09F1B8" />
          <stop offset="100%" stopColor="#10B981" />
        </linearGradient>

        {/* Outer Ring glow */}
        <filter id="ringGlow" x="-10%" y="-10%" width="120%" height="120%">
          <feGaussianBlur stdDeviation="3" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>
      </defs>

      {/* Background Squircle */}
      {withBackground && (
        <rect
          width="512"
          height="512"
          rx="110"
          fill="url(#bgGrad)"
          stroke="#1E293B"
          strokeWidth="4"
          className="shadow-inner"
        />
      )}

      {/* Outer Ring - Cyan/Emerald with custom gaps (using two arc paths for perfect styling) */}
      <g filter="url(#ringGlow)">
        {/* Left-Bottom Arc */}
        <path
          d="M 125,385 A 190,190 0 0,1 115,190"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
          opacity="0.85"
        />
        <path
          d="M 145,410 A 190,190 0 0,1 135,420"
          stroke="url(#ringGrad)"
          strokeWidth="6"
          strokeLinecap="round"
          opacity="0.4"
        />
        {/* Main continuous outer ring with precise gap placements matching the original */}
        <path
          d="M 112,230 A 185,185 0 1,1 390,160"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
        <path
          d="M 140,400 A 185,185 0 0,1 360,400"
          stroke="url(#ringGrad)"
          strokeWidth="10"
          strokeLinecap="round"
        />
      </g>

      {/* Styled Letter 'A' (Left, under shadow filter) */}
      <path
        d="M 100,340 L 195,175 H 240 L 222,275 H 178 L 170,340 H 122 Z M 184,240 L 191,202 L 210,240 Z"
        fill="url(#metalGrad)"
        filter="url(#shadow)"
        fillRule="evenodd"
      />

      {/* Styled Letter 'E' (Right, under shadow filter) */}
      <path
        d="M 335,175 H 440 L 433,215 H 383 L 378,245 H 425 L 417,285 H 370 L 362,330 H 422 L 413,340 H 305 L 335,175 Z"
        fill="url(#metalGrad)"
        filter="url(#shadow)"
      />

      {/* Glow highlight for the Lightning Bolt */}
      <path
        d="M 338,80 L 215,252 H 312 L 210,398 L 320,215 H 242 L 338,80 Z"
        fill="#FFE082"
        opacity="0.3"
        filter="url(#glow)"
      />

      {/* Core Lightning Bolt 'S' in Center (layered with vibrant gradient & glow) */}
      <path
        d="M 338,80 L 215,252 H 312 L 210,398 L 320,215 H 242 L 338,80 Z"
        fill="url(#lightningGrad)"
        filter="url(#shadow)"
        className="transition-all duration-300 hover:brightness-110"
      />
    </svg>
  );
}
