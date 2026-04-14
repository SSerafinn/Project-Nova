import React, { useEffect, useState, useCallback } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { getNoteById } from '../services/api';

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

export default function Flashcards() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [cards, setCards] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isFlipped, setIsFlipped] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionTitle, setSessionTitle] = useState('');

  useEffect(() => {
    getNoteById(id)
      .then((res) => {
        setSessionTitle(res.data.title);
        setCards(res.data.flashcards || []);
      })
      .catch(() => setError('Failed to load flashcards.'))
      .finally(() => setLoading(false));
  }, [id]);

  // Keyboard navigation
  useEffect(() => {
    function onKey(e) {
      if (e.key === 'ArrowRight') handleNext();
      if (e.key === 'ArrowLeft') handlePrev();
      if (e.key === ' ') { e.preventDefault(); setIsFlipped((f) => !f); }
    }
    window.addEventListener('keydown', onKey);
    return () => window.removeEventListener('keydown', onKey);
  });

  function goTo(index) {
    // Reset flip BEFORE changing index to avoid flicker
    setIsFlipped(false);
    setTimeout(() => setCurrentIndex(index), 0);
  }

  function handleNext() {
    if (currentIndex < cards.length - 1) goTo(currentIndex + 1);
  }

  function handlePrev() {
    if (currentIndex > 0) goTo(currentIndex - 1);
  }

  function handleShuffle() {
    setIsFlipped(false);
    setCurrentIndex(0);
    setCards((c) => fisherYates(c));
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <div className="text-5xl animate-bounce">🃏</div>
        <p className="text-muted font-semibold">Loading flashcards...</p>
      </div>
    );
  }

  if (error || cards.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted font-bold mb-4">{error || 'No flashcards found for this note.'}</p>
        <Button variant="ghost" onClick={() => navigate(`/notes/${id}/summary`)}>
          Back to Summary
        </Button>
      </div>
    );
  }

  const card = cards[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-6">
        <button
          onClick={() => navigate(`/notes/${id}/summary`)}
          className="text-muted hover:text-[#3C3C3C] font-semibold text-sm flex items-center gap-1 mb-3"
        >
          ← Back to Summary
        </button>
        <h1 className="text-xl font-black text-[#3C3C3C] mb-1">{sessionTitle}</h1>
        <p className="text-muted text-sm font-semibold">Flashcard Review — Press Space to flip, arrows to navigate</p>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={cards.length} />
      </div>

      {/* Flashcard */}
      <FlashCard
        term={card.term}
        definition={card.definition}
        isFlipped={isFlipped}
        onClick={() => setIsFlipped((f) => !f)}
      />

      {/* Controls */}
      <div className="flex items-center justify-between mt-6 gap-3">
        <Button
          variant="ghost"
          onClick={handlePrev}
          disabled={currentIndex === 0}
          className="min-w-[100px]"
        >
          ← Prev
        </Button>

        <Button variant="ghost" size="sm" onClick={handleShuffle}>
          🔀 Shuffle
        </Button>

        <Button
          variant="ghost"
          onClick={handleNext}
          disabled={currentIndex === cards.length - 1}
          className="min-w-[100px]"
        >
          Next →
        </Button>
      </div>

      {/* Done button */}
      {currentIndex === cards.length - 1 && (
        <div className="mt-6 text-center animate-bounceIn">
          <Button
            variant="primary"
            size="lg"
            onClick={() => navigate(`/notes/${id}/summary`)}
            className="mx-auto"
          >
            ✅ Done — Back to Summary
          </Button>
        </div>
      )}

      {/* Card counter */}
      <p className="text-center text-muted font-bold text-sm mt-4">
        Card {currentIndex + 1} of {cards.length}
      </p>
    </div>
  );
}
