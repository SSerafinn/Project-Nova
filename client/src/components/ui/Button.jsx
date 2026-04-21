import React from 'react';

const VARIANTS = {
  primary: {
    base: 'bg-primary text-[#1C1733] hover:bg-primary-dark',
    shadow: '0px 4px 0px #D4A800',
    border: '#D4A800',
  },
  secondary: {
    base: 'bg-secondary text-white hover:bg-secondary-dark',
    shadow: '0px 4px 0px #5448D0',
    border: '#5448D0',
  },
  accent: {
    base: 'bg-accent text-white hover:bg-accent-dark',
    shadow: '0px 4px 0px #A85510',
    border: '#A85510',
  },
  danger: {
    base: 'bg-danger text-white hover:bg-danger-dark',
    shadow: '0px 4px 0px #EA2B2B',
    border: '#EA2B2B',
  },
  ghost: {
    base: 'bg-white/10 text-white border border-border hover:bg-white/20',
    shadow: '0px 4px 0px #13102B',
    border: '#13102B',
  },
  outline: {
    base: 'bg-transparent text-primary border-2 border-primary hover:bg-primary/10',
    shadow: '0px 4px 0px #D4A800',
    border: '#D4A800',
  },
};

const SIZES = {
  sm: 'px-3 py-1.5 text-sm',
  md: 'px-5 py-2.5 text-base',
  lg: 'px-7 py-3.5 text-lg',
};

export default function Button({
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  onClick,
  children,
  className = '',
  type = 'button',
}) {
  const v = VARIANTS[variant] || VARIANTS.primary;
  const s = SIZES[size] || SIZES.md;

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled || loading}
      className={`btn-chunky ${v.base} ${s} rounded-2xl font-bold transition-colors select-none ${className}`}
      style={{ boxShadow: v.shadow }}
    >
      {loading ? (
        <span className="flex items-center gap-2">
          <img
            src="/nova_logo_no_text.png"
            alt="Loading"
            className="w-4 h-4 object-contain animate-bounce opacity-80"
          />
          {children}
        </span>
      ) : (
        children
      )}
    </button>
  );
}
