import React from 'react';

const VARIANTS = {
  concept: 'bg-primary-light text-primary-dark',
  term: 'bg-secondary-light text-secondary-dark',
  accent: 'bg-accent-light text-accent-dark',
  default: 'bg-border text-[#3C3C3C]',
  pdf: 'bg-secondary-light text-secondary-dark',
  text: 'bg-accent-light text-accent-dark',
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
