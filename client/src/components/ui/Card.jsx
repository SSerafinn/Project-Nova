import React from 'react';

export default function Card({ children, className = '', onClick, style }) {
  return (
    <div
      onClick={onClick}
      style={style}
      className={`relative shimmer-top bg-white/[0.04] backdrop-blur-sm rounded-2xl border border-white/[0.08] overflow-hidden ${onClick ? 'cursor-pointer' : ''} ${className}`}
    >
      {children}
    </div>
  );
}

