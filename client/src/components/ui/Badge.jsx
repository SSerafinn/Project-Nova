import React from 'react';

const VARIANTS = {
  concept: 'bg-primary/20 text-primary',
  term: 'bg-secondary/30 text-secondary',
  accent: 'bg-accent/20 text-accent',
  default: 'bg-white/10 text-white/70',
  pdf: 'bg-secondary/30 text-secondary',
  text: 'bg-accent/20 text-accent',
};

export default function Badge({ label, variant = 'default', className = '' }) {
  const styles = VARIANTS[variant] || VARIANTS.default;
  return (
    <span
      className={`inline-block px-3 py-1 rounded-full text-sm font-bold ${styles} ${className}`}
    >
      {label}
    </span>
  );
}
