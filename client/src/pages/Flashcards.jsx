import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import FlashCard from '../components/FlashCard';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { getNoteById } from '../services/api';
import { LayersIcon, ArrowsRightLeftIcon, CheckIcon } from '../components/Icons';

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
        <LayersIcon className="w-14 h-14 text-primary animate-bounce" />
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
          className="text-muted hover:text-white font-semibold text-sm flex items-center gap-1 mb-3 transition-colors"
        >
          ← Back to Summary
        </button>
        <h1 className="text-xl font-black text-white mb-1">{sessionTitle}</h1>
        <p className="text-muted text-sm font-semibold">Press Space to flip, arrows to navigate</p>
      </div>

      {/* Counter */}
      <div className="flex items-center justify-between mb-2">
        <span className="text-sm font-bold text-muted">
          {currentIndex + 1} / {cards.length}
        </span>
        <span className="text-sm font-bold text-primary">
          {Math.round(((currentIndex + 1) / cards.length) * 100)}%
        </span>
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentIndex + 1} total={cards.length} showLabel={false} />
      </div>

      {/* Flashcard with stacked deck */}
      <FlashCard
        term={card.term}
        definition={card.definition}
        isFlipped={isFlipped}
        onClick={() => setIsFlipped((f) => !f)}
      />

      {/* Session title below card */}
      <p className="text-center text-muted font-bold text-sm mt-4">{sessionTitle}</p>

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

        <Button variant="ghost" size="sm" onClick={handleShuffle} className="flex items-center gap-1.5">
          <ArrowsRightLeftIcon className="w-4 h-4" />
          Shuffle
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
            className="mx-auto flex items-center gap-2"
          >
            <CheckIcon className="w-5 h-5" />
            Done — Back to Summary
          </Button>
        </div>
      )}
    </div>
  );
}
