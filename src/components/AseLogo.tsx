import React from 'react';

interface AseLogoProps {
  className?: string;
  size?: number | string;
  withBackground?: boolean;
}

export default function AseLogo({ className = '', size = '100%', withBackground = true }: AseLogoProps) {
  const pixelSize = typeof size === 'number' ? `${size}px` : size;

  return (
    <svg
      width={pixelSize}
      height={pixelSize}
      viewBox="0 0 512 512"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      className={className}
      aria-label="A⚡E Logo"
    >
      <defs>
        {/* Background dark navy / midnight blue gradient */}
        <linearGradient id="bgGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#050b18" />
          <stop offset="50%" stopColor="#081026" />
          <stop offset="100%" stopColor="#03050a" />
        </linearGradient>

        {/* Silver / Metallic White Gradient for Letters A and E */}
        <linearGradient id="metalGrad" x1="0%" y1="0%" x2="0%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" />
          <stop offset="30%" stopColor="#f1f5f9" />
          <stop offset="70%" stopColor="#cbd5e1" />
          <stop offset="100%" stopColor="#64748b" />
        </linearGradient>

        {/* Golden-orange Gradient for the Lightning Bolt */}
        <linearGradient id="boltGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffea00" />
          <stop offset="40%" stopColor="#f59e0b" />
          <stop offset="100%" stopColor="#ea580c" />
        </linearGradient>

        {/* Turquoise / Cyan / Mint Green Gradient for Circular Rings */}
        <linearGradient id="ringGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#00f2fe" />
          <stop offset="50%" stopColor="#06b6d4" />
          <stop offset="100%" stopColor="#10b981" />
        </linearGradient>

        {/* Glow and Shadow Filters for Premium 3D Feel */}
        <filter id="boltGlow" x="-20%" y="-20%" width="140%" height="140%">
          <feGaussianBlur stdDeviation="8" result="blur" />
          <feComposite in="SourceGraphic" in2="blur" operator="over" />
        </filter>

        <filter id="shadow3D" x="-10%" y="-10%" width="120%" height="120%">
          <feDropShadow dx="0" dy="6" stdDeviation="6" floodColor="#000000" floodOpacity="0.6" />
        </filter>

        {/* Subtle Inner Bevel/Stroke effect for the container */}
        <linearGradient id="borderGrad" x1="0%" y1="0%" x2="100%" y2="100%">
          <stop offset="0%" stopColor="#ffffff" stopOpacity="0.15" />
          <stop offset="100%" stopColor="#ffffff" stopOpacity="0.0" />
        </linearGradient>
      </defs>

      {/* 1. Rounded Square Background (Apple-style) */}
      {withBackground && (
        <>
          {/* Base rounded rect */}
          <rect
            x="4"
            y="4"
            width="504"
            height="504"
            rx="116"
            fill="url(#bgGrad)"
            stroke="url(#borderGrad)"
            strokeWidth="3"
            filter="drop-shadow(0 12px 24px rgba(0,0,0,0.4))"
          />
          {/* Subtle Glossy Bevel Sweep */}
          <path
            d="M 4,120 C 4,56 56,4 120,4 L 392,4 C 456,4 508,56 508,120 C 508,120 380,240 256,240 C 132,240 4,120 4,120 Z"
            fill="#ffffff"
            opacity="0.03"
          />
        </>
      )}

      {/* Group holding content centered and scaled gracefully */}
      <g filter="url(#shadow3D)">
        {/* 2. Broken Circle (4 distinct curved arcs/segments) */}
        {/* We use a radius of 170, centered at (256, 256) */}
        <circle
          cx="256"
          cy="256"
          r="170"
          stroke="url(#ringGrad)"
          strokeWidth="12"
          fill="none"
          strokeLinecap="round"
          strokeDasharray="190 77"
          strokeDashoffset="48"
          transform="rotate(45 256 256)"
          opacity="0.85"
        />

        {/* 3. Letter 'A' (Left element) */}
        {/* Customized geometric, bold path for perfect alignment */}
        <path
          d="M 94,326 L 132,186 C 133.5,181 136.5,180 140,180 L 158,180 C 161.5,180 164.5,181 166,186 L 204,326 C 205.5,331 202,336 196,336 L 174,336 C 170,336 167,333 166,329 L 157,294 L 141,294 L 132,329 C 131,333 128,336 124,336 L 102,336 C 96,336 92.5,331 94,326 Z M 149,230 L 144,260 L 154,260 Z"
          fill="url(#metalGrad)"
        />

        {/* 4. Letter 'E' (Right element) */}
        {/* Symmetrical bold geometric E matching the grid */}
        <path
          d="M 308,186 C 308,181 312,180 317,180 L 410,180 C 414.5,180 417,183 417,187 L 417,207 C 417,211.5 414.5,214 410,214 L 344,214 L 344,234 L 388,234 C 392.5,234 395,237 395,241 L 395,261 C 395,265.5 392.5,268 388,268 L 344,268 L 344,292 L 410,292 C 414.5,292 417,295 417,299 L 417,319 C 417,323.5 414.5,326 410,326 L 317,326 C 312,326 308,322 308,317 Z"
          fill="url(#metalGrad)"
        />

        {/* 5. Lightning Bolt (⚡ Center Element - Dominant focus) */}
        {/* Glow filter, golden gradient, symmetrical, taller than the letters */}
        <path
          d="M 276,136 L 210,250 L 256,250 L 236,376 L 302,262 L 256,262 Z"
          fill="url(#boltGrad)"
          filter="url(#boltGlow)"
        />
      </g>
    </svg>
  );
}
