import React from 'react';

interface LogoProps {
  size?: number;
  className?: string;
  variant?: 'light' | 'dark';
}

export function Logo({ size = 48, className = '', variant = 'dark' }: LogoProps) {
  // Colors inspired by the provided image
  const trunkColor = '#784421'; // Brown
  const leafLight = '#a3d65c'; // Bright Green
  const leafDark = '#2d8635';  // Deep Green
  const sunColor = '#ffeb00';   // Yellow
  const rootColor = '#1a4d1e';  // Dark Green for aerial roots

  return (
    <svg 
      width={size} 
      height={size} 
      viewBox="0 0 100 100" 
      fill="none" 
      xmlns="http://www.w3.org/2000/svg"
      className={className}
    >
      {/* Background Leaves (Darker Green) */}
      <circle cx="70" cy="35" r="22" fill={leafDark} />
      <circle cx="30" cy="40" r="20" fill={leafDark} />
      <circle cx="50" cy="30" r="25" fill={leafDark} />

      {/* Aerial Roots */}
      <path d="M25 50 Q25 70 20 85" stroke={rootColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M35 50 Q35 75 38 88" stroke={rootColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M65 50 Q65 75 62 88" stroke={rootColor} strokeWidth="1.5" strokeLinecap="round" />
      <path d="M75 50 Q75 70 80 85" stroke={rootColor} strokeWidth="1.5" strokeLinecap="round" />

      {/* Sun/Star behind the trunk center */}
      <path 
        d="M50 25 L53 35 L63 33 L58 41 L67 48 L57 50 L60 60 L50 53 L40 60 L43 50 L33 48 L42 41 L37 33 L47 35 Z" 
        fill={sunColor} 
      />

      {/* Foreground Leaves (Lighter Green) */}
      <circle cx="50" cy="45" r="28" fill={leafLight} />
      <circle cx="35" cy="48" r="18" fill={leafLight} />
      <circle cx="65" cy="48" r="18" fill={leafLight} />

      {/* Trunk with Human Form (Arms Raised) */}
      <path 
        d="M42 90 
           L44 75 
           Q45 65 40 55 
           L30 45 
           L35 42 
           L45 52 
           Q50 55 55 52 
           L65 42 
           L70 45 
           L60 55 
           Q55 65 56 75 
           L58 90 
           Z" 
        fill={trunkColor} 
      />

      {/* Subtle digital nodes within leaves to maintain 'Digital' theme */}
      <circle cx="30" cy="35" r="2" fill="white" opacity="0.4" />
      <circle cx="70" cy="40" r="2" fill="white" opacity="0.4" />
      <circle cx="50" cy="25" r="2" fill="white" opacity="0.4" />
    </svg>
  );
}
