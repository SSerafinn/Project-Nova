import React from 'react';

function StarShape({ className }) {
  return (
    <svg className={className} viewBox="0 0 100 100" fill="currentColor" aria-hidden="true">
      <path d="M50 5 L61 35 L95 35 L68 57 L79 91 L50 70 L21 91 L32 57 L5 35 L39 35 Z" />
    </svg>
  );
}

export default function FlashCard({ term, definition, isFlipped, onClick }) {
  return (
    <div className="relative pt-6">
      {/* Ghost/stack cards peeking from behind — deck effect */}
      <div className="absolute top-0 left-8 right-8 bottom-0 rounded-2xl border border-white/10 bg-white/[0.04]" />
      <div className="absolute top-3 left-4 right-4 bottom-0 rounded-2xl border border-white/15 bg-white/[0.07]" />

      {/* Main 3D flip card */}
      <div
        className="flashcard-container relative z-10 w-full h-64 md:h-72 cursor-pointer"
        onClick={onClick}
        role="button"
        tabIndex={0}
        onKeyDown={(e) => (e.key === 'Enter' || e.key === ' ') ? onClick() : null}
        aria-label={isFlipped ? 'Show term' : 'Show definition'}
      >
        <div className={`flashcard-inner ${isFlipped ? 'flipped' : ''}`}>
          {/* Front — Term */}
          <div className="flashcard-face bg-surface border border-border">
            <StarShape className="absolute -left-4 top-3 w-24 h-24 text-primary/[0.12] pointer-events-none" />
            <StarShape className="absolute right-0 bottom-1 w-32 h-32 text-primary/[0.08] pointer-events-none" />
            <StarShape className="absolute left-[40%] -bottom-4 w-16 h-16 text-secondary/[0.12] pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-widest text-muted mb-4 relative z-10">
              Term
            </span>
            <p className="text-xl md:text-2xl font-extrabold text-white text-center leading-snug relative z-10">
              {term}
            </p>
            <span className="text-xs text-muted mt-6 relative z-10">Click to flip</span>
          </div>

          {/* Back — Definition */}
          <div className="flashcard-face flashcard-back bg-surface border border-primary/40">
            <StarShape className="absolute -right-4 top-3 w-24 h-24 text-primary/[0.15] pointer-events-none" />
            <StarShape className="absolute left-0 bottom-2 w-28 h-28 text-primary/[0.10] pointer-events-none" />
            <span className="text-xs font-bold uppercase tracking-widest text-primary mb-4 relative z-10">
              Definition
            </span>
            <p className="text-base md:text-lg font-semibold text-white text-center leading-relaxed relative z-10">
              {definition}
            </p>
            <span className="text-xs text-primary/60 mt-6 relative z-10">Click to flip back</span>
          </div>
        </div>
      </div>
    </div>
  );
}
