import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import QuizQuestion from '../components/QuizQuestion';
import ProgressBar from '../components/ui/ProgressBar';
import Button from '../components/ui/Button';
import { getNoteById } from '../services/api';
import { QuestionMarkCircleIcon, TrophyIcon, StarIcon } from '../components/Icons';

function fisherYates(arr) {
  const a = [...arr];
  for (let i = a.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [a[i], a[j]] = [a[j], a[i]];
  }
  return a;
}

function getStars(score, total) {
  const pct = score / total;
  if (pct >= 0.8) return 3;
  if (pct >= 0.6) return 2;
  if (pct >= 0.4) return 1;
  return 0;
}

function Stars({ count }) {
  return (
    <div className="flex gap-2 justify-center">
      {[1, 2, 3].map((n) => (
        <StarIcon
          key={n}
          className={`w-10 h-10 ${n <= count ? 'text-primary' : 'text-border'}`}
          filled={n <= count}
        />
      ))}
    </div>
  );
}

export default function Quiz() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [allQuestions, setAllQuestions] = useState([]);
  const [questions, setQuestions] = useState([]);
  const [currentIndex, setCurrentIndex] = useState(0);
  const [score, setScore] = useState(0);
  const [quizComplete, setQuizComplete] = useState(false);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [sessionTitle, setSessionTitle] = useState('');

  useEffect(() => {
    getNoteById(id)
      .then((res) => {
        setSessionTitle(res.data.title);
        const shuffled = fisherYates(res.data.quiz || []);
        setAllQuestions(res.data.quiz || []);
        setQuestions(shuffled);
      })
      .catch(() => setError('Failed to load quiz.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleAnswer(isCorrect) {
    const newScore = isCorrect ? score + 1 : score;
    if (isCorrect) setScore(newScore);

    if (currentIndex + 1 >= questions.length) {
      setScore(newScore);
      setQuizComplete(true);
    } else {
      setCurrentIndex((i) => i + 1);
    }
  }

  function handleRetry() {
    setQuestions(fisherYates(allQuestions));
    setCurrentIndex(0);
    setScore(0);
    setQuizComplete(false);
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <QuestionMarkCircleIcon className="w-14 h-14 text-primary animate-bounce" />
        <p className="text-muted font-semibold">Loading quiz...</p>
      </div>
    );
  }

  if (error || questions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted font-bold mb-4">{error || 'No quiz questions found for this note.'}</p>
        <Button variant="ghost" onClick={() => navigate(`/notes/${id}/summary`)}>
          Back to Summary
        </Button>
      </div>
    );
  }

  // Results screen
  if (quizComplete) {
    const stars = getStars(score, questions.length);
    const pct = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-lg mx-auto px-4 py-10 flex flex-col items-center gap-6 text-center">
        <div className="text-primary animate-bounceIn">
          <TrophyIcon className="w-20 h-20 mx-auto" />
        </div>
        <h1 className="text-3xl font-black text-[#3C3C3C]">Quiz Complete!</h1>
        <Stars count={stars} />

        <div className="bg-surface rounded-3xl border border-border shadow-card p-8 w-full">
          <p className="text-6xl font-black text-primary mb-1">{pct}%</p>
          <p className="text-muted font-bold text-lg">
            {score} / {questions.length} correct
          </p>
          <p className="mt-3 font-semibold text-[#3C3C3C]">
            {stars === 3
              ? 'Excellent work! You really know this material!'
              : stars === 2
              ? "Good job! A bit more practice and you'll nail it!"
              : stars === 1
              ? "Keep studying — you're getting there!"
              : "Don't give up! Review your notes and try again."}
          </p>
        </div>

        <div className="flex flex-col sm:flex-row gap-3 w-full">
          <Button
            variant="secondary"
            size="lg"
            onClick={handleRetry}
            className="flex-1"
          >
            Try Again
          </Button>
          <Button
            variant="ghost"
            size="lg"
            onClick={() => navigate(`/notes/${id}/summary`)}
            className="flex-1"
          >
            Back to Notes
          </Button>
        </div>
      </div>
    );
  }

  // Active quiz
  const question = questions[currentIndex];

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
      </div>

      {/* Progress */}
      <div className="mb-6">
        <ProgressBar current={currentIndex} total={questions.length} showLabel={false} />
        <p className="text-right text-sm font-bold text-muted mt-1">
          Question {currentIndex + 1} / {questions.length}
        </p>
      </div>

      {/* Question card */}
      <div className="bg-surface rounded-2xl border border-border shadow-card p-6">
        <QuizQuestion
          key={question.id}
          question={question.question}
          choices={question.choices}
          correctAnswer={question.answer}
          onAnswer={handleAnswer}
        />
      </div>

      {/* Score tracker */}
      <p className="text-center text-sm text-muted font-semibold mt-4">
        Score so far: {score} / {currentIndex}
      </p>
    </div>
  );
}
