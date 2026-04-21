import React, { useState } from 'react';
import confetti from 'canvas-confetti';
import { CheckIcon, XMarkIcon } from './Icons';

function getChoiceStyle(choice, selected, correct, revealed) {
  if (!revealed) {
    return selected === choice
      ? 'border-secondary bg-secondary/20 text-white font-bold scale-[1.01]'
      : 'border-border/60 bg-white/5 text-white hover:border-secondary hover:bg-secondary/10';
  }
  if (choice === correct) return 'border-primary bg-primary/20 text-white font-bold';
  if (choice === selected && choice !== correct) return 'border-danger bg-danger/20 text-white font-bold animate-shake';
  return 'border-border/30 bg-white/[0.03] text-muted opacity-50';
}

export default function QuizQuestion({ question, choices, correctAnswer, explanation, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);
  const [isCorrect, setIsCorrect] = useState(null);

  function handleSelect(choice) {
    if (revealed) return;
    setSelected(choice);
  }

  function handleCheck() {
    if (!selected) return;
    setRevealed(true);
    const correct = selected === correctAnswer;
    setIsCorrect(correct);

    if (correct) {
      confetti({
        particleCount: 120,
        spread: 80,
        angle: 90,
        origin: { y: 0.55 },
        colors: ['#F5C518', '#D4A800', '#FFF9E6', '#6B5CF0'],
      });
    }
  }

  function handleNext() {
    onAnswer(isCorrect);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Question text */}
      <p className="text-lg md:text-xl font-extrabold text-white leading-snug">
        {question}
      </p>

      {/* Choices */}
      <div className="flex flex-col gap-3">
        {choices.map((choice) => (
          <button
            key={choice}
            onClick={() => handleSelect(choice)}
            disabled={revealed}
            className={`
              w-full text-left px-5 py-3.5 rounded-2xl border-2 text-sm font-semibold
              transition-all duration-150 cursor-pointer
              ${getChoiceStyle(choice, selected, correctAnswer, revealed)}
            `}
          >
            {choice}
          </button>
        ))}
      </div>

      {/* Feedback banner */}
      {revealed && (
        <div
          className={`
            rounded-2xl px-5 py-4 animate-bounceIn flex flex-col gap-2
            ${selected === correctAnswer
              ? 'bg-primary/10 border border-primary/30'
              : 'bg-danger/10 border border-danger/30'
            }
          `}
        >
          <div className={`font-bold flex items-center gap-2 ${selected === correctAnswer ? 'text-primary' : 'text-danger'}`}>
            {selected === correctAnswer ? (
              <><CheckIcon className="w-5 h-5 shrink-0" /> Correct! Great job!</>
            ) : (
              <><XMarkIcon className="w-5 h-5 shrink-0" /> Not quite! The answer was: &ldquo;{correctAnswer}&rdquo;</>
            )}
          </div>
          
          {/* Explanation */}
          {explanation && (
            <p className="text-white/80 text-sm leading-relaxed mt-1 border-t border-white/10 pt-3">
              {explanation}
            </p>
          )}
        </div>
      )}

      {/* Check button */}
      {!revealed && selected && (
        <button
          onClick={handleCheck}
          className="btn-chunky w-full bg-primary text-[#1C1733] py-3.5 rounded-2xl font-extrabold text-base transition-colors hover:bg-primary-dark animate-bounceIn"
          style={{ boxShadow: '0px 4px 0px #D4A800' }}
        >
          Check Answer
        </button>
      )}

      {/* Next button */}
      {revealed && (
        <button
          onClick={handleNext}
          className="btn-chunky w-full bg-secondary text-white py-3.5 rounded-2xl font-extrabold text-base transition-colors hover:bg-secondary-dark animate-bounceIn"
          style={{ boxShadow: '0px 4px 0px #5448D0' }}
        >
          Next Question ➔
        </button>
      )}
    </div>
  );
}
