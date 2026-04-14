import React, { useState } from 'react';
import confetti from 'canvas-confetti';

function getChoiceStyle(choice, selected, correct, revealed) {
  if (!revealed) {
    return selected === choice
      ? 'border-secondary bg-secondary-light text-secondary-dark font-bold scale-[1.01]'
      : 'border-border bg-surface hover:border-secondary hover:bg-secondary-light/40';
  }
  // After reveal
  if (choice === correct) return 'border-primary bg-primary-light text-primary-dark font-bold';
  if (choice === selected && choice !== correct) return 'border-danger bg-danger-light text-danger-dark font-bold animate-shake';
  return 'border-border bg-surface opacity-50';
}

export default function QuizQuestion({ question, choices, correctAnswer, onAnswer }) {
  const [selected, setSelected] = useState(null);
  const [revealed, setRevealed] = useState(false);

  function handleSelect(choice) {
    if (revealed) return;
    setSelected(choice);
  }

  function handleCheck() {
    if (!selected) return;
    setRevealed(true);
    const isCorrect = selected === correctAnswer;

    if (isCorrect) {
      confetti({
        particleCount: 120,
        spread: 80,
        angle: 90,
        origin: { y: 0.55 },
        colors: ['#58CC02', '#1CB0F6', '#FF9600', '#FF4B4B'],
      });
    }

    // Delay advancing so the user can see the feedback
    setTimeout(() => onAnswer(isCorrect), 1200);
  }

  return (
    <div className="flex flex-col gap-4">
      {/* Question text */}
      <p className="text-lg md:text-xl font-extrabold text-[#3C3C3C] leading-snug">
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
            rounded-2xl px-5 py-3 font-bold text-sm animate-bounceIn
            ${selected === correctAnswer
              ? 'bg-primary-light text-primary-dark'
              : 'bg-danger-light text-danger-dark'
            }
          `}
        >
          {selected === correctAnswer
            ? '🎉 Correct! Great job!'
            : `❌ Not quite! The answer was: "${correctAnswer}"`}
        </div>
      )}

      {/* Check button */}
      {!revealed && selected && (
        <button
          onClick={handleCheck}
          className="btn-chunky w-full bg-primary text-white py-3.5 rounded-2xl font-extrabold text-base transition-colors hover:bg-primary-dark animate-bounceIn"
          style={{ boxShadow: '0px 4px 0px #46A302' }}
        >
          Check Answer
        </button>
      )}
    </div>
  );
}
