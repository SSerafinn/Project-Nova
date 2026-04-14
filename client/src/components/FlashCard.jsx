import React from 'react';

export default function FlashCard({ term, definition, isFlipped, onClick }) {
  return (
    <div
      className="flashcard-container w-full h-64 md:h-72 cursor-pointer"
      onClick={onClick}
      role="button"
      tabIndex={0}
      onKeyDown={(e) => e.key === 'Enter' || e.key === ' ' ? onClick() : null}
      aria-label={isFlipped ? 'Show term' : 'Show definition'}
    >
      <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
        {/* Front — Term */}
        <div className="flashcard-face bg-surface border border-border shadow-card">
          <span className="text-xs font-bold uppercase tracking-widest text-muted mb-4">
            Term
          </span>
          <p className="text-xl md:text-2xl font-extrabold text-[#3C3C3C] text-center leading-snug">
            {term}
          </p>
          <span className="text-xs text-muted mt-6">Click to flip</span>
        </div>

        {/* Back — Definition */}
        <div className="flashcard-face flashcard-back bg-primary-light border border-primary/20 shadow-card-primary">
          <span className="text-xs font-bold uppercase tracking-widest text-primary-dark mb-4">
            Definition
          </span>
          <p className="text-base md:text-lg font-semibold text-[#3C3C3C] text-center leading-relaxed">
            {definition}
          </p>
          <span className="text-xs text-primary-dark mt-6">Click to flip back</span>
        </div>
      </div>
    </div>
  );
}
