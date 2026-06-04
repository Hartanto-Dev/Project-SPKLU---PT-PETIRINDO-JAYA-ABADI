import React from 'react';

const PetirindoLogo = ({ size = 36 }) => (
  <svg
    xmlns="http://www.w3.org/2000/svg"
    viewBox="0 0 100 100"
    width={size}
    height={size}
    style={{ display: 'block', flexShrink: 0 }}
  >
    {/* Orange/Yellow arc (bottom) */}
    <path
      d="M15 60 Q10 90 50 95 Q90 90 85 60"
      fill="none"
      stroke="url(#arcGrad)"
      strokeWidth="10"
      strokeLinecap="round"
    />
    {/* Orange/Yellow arc (top-left) */}
    <path
      d="M18 45 Q5 15 38 8"
      fill="none"
      stroke="url(#arcGrad)"
      strokeWidth="10"
      strokeLinecap="round"
    />
    {/* Red D-shape background */}
    <path
      d="M45 5 Q85 5 85 50 Q85 95 45 95 L45 5 Z"
      fill="#E03030"
    />
    {/* White Lightning Bolt */}
    <polygon
      points="58,15 44,50 54,50 42,85 68,44 56,44 68,15"
      fill="white"
    />
    {/* Gradient definition */}
    <defs>
      <linearGradient id="arcGrad" x1="0%" y1="0%" x2="100%" y2="100%">
        <stop offset="0%" stopColor="#F97316" />
        <stop offset="100%" stopColor="#EAB308" />
      </linearGradient>
    </defs>
  </svg>
);

export default PetirindoLogo;
