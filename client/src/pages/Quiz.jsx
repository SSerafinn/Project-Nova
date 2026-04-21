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
          className={`w-10 h-10 ${n <= count ? 'text-primary' : 'text-white/20'}`}
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
  const [setupMode, setSetupMode] = useState(false);
  
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
        const fetchedQuiz = res.data.quiz || [];
        setAllQuestions(fetchedQuiz);
        if (fetchedQuiz.length > 10) {
          setSetupMode(true);
        } else {
          setQuestions(fisherYates(fetchedQuiz));
          setSetupMode(false);
        }
      })
      .catch(() => setError('Failed to load quiz.'))
      .finally(() => setLoading(false));
  }, [id]);

  function startQuiz(mode) {
    if (mode === 'quick') {
      setQuestions(fisherYates(allQuestions).slice(0, 10));
    } else {
      setQuestions(fisherYates(allQuestions));
    }
    setSetupMode(false);
    setCurrentIndex(0);
    setScore(0);
    setQuizComplete(false);
  }

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
    if (allQuestions.length > 10) {
      setSetupMode(true);
    } else {
      setQuestions(fisherYates(allQuestions));
      setCurrentIndex(0);
      setScore(0);
      setQuizComplete(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <QuestionMarkCircleIcon className="w-14 h-14 text-primary animate-bounce" />
        <p className="text-muted font-semibold">Loading quiz...</p>
      </div>
    );
  }

  if (error || allQuestions.length === 0) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-muted font-bold mb-4">{error || 'No quiz questions found for this note.'}</p>
        <Button variant="ghost" onClick={() => navigate(`/notes/${id}/summary`)}>
          Back to Summary
        </Button>
      </div>
    );
  }

  if (setupMode) {
    return (
      <div className="max-w-xl mx-auto px-4 py-16 flex flex-col items-center text-center animate-fadeInUp">
        <div className="mb-8 w-full flex justify-start">
          <button
            onClick={() => navigate(`/notes/${id}/summary`)}
            className="text-muted hover:text-white font-semibold text-sm flex items-center gap-1 transition-colors"
          >
            ← Back to Summary
          </button>
        </div>
        <QuestionMarkCircleIcon className="w-16 h-16 text-primary mb-6 drop-shadow-lg" />
        <h1 className="text-3xl font-black text-white mb-3">Quiz Setup</h1>
        <p className="text-muted font-medium mb-10 text-lg">
          This note has a generated bank of <strong className="text-white">{allQuestions.length} questions</strong>. How would you like to study?
        </p>

        <div className="flex flex-col gap-4 w-full">
          <Button variant="primary" size="lg" onClick={() => startQuiz('quick')} style={{ boxShadow: '0px 4px 0px #C99A32' }}>
            Quick Session (10 Questions)
          </Button>
          <Button variant="secondary" size="lg" onClick={() => startQuiz('full')} style={{ boxShadow: '0px 4px 0px #5448D0' }}>
            Full Bank ({allQuestions.length} Questions)
          </Button>
        </div>
      </div>
    );
  }

  if (quizComplete) {
    const stars = getStars(score, questions.length);
    const pct = Math.round((score / questions.length) * 100);

    return (
      <div className="max-w-lg mx-auto px-4 py-10 flex flex-col items-center gap-6 text-center">
        <div className="text-primary animate-bounceIn">
          <TrophyIcon className="w-20 h-20 mx-auto" />
        </div>
        <h1 className="text-3xl font-black text-white">Quiz Complete!</h1>
        <Stars count={stars} />

        <div className="bg-surface rounded-3xl border border-border/50 shadow-card p-8 w-full">
          <p className="text-6xl font-black text-primary mb-1">{pct}%</p>
          <p className="text-muted font-bold text-lg">
            {score} / {questions.length} correct
          </p>
          <p className="mt-3 font-semibold text-white/80">
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
          <Button variant="secondary" size="lg" onClick={handleRetry} className="flex-1">
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

  const question = questions[currentIndex];

  return (
    <div className="max-w-2xl mx-auto px-4 py-10">
      <div className="mb-6">
        <button
          onClick={() => navigate(`/notes/${id}/summary`)}
          className="text-muted hover:text-white font-semibold text-sm flex items-center gap-1 mb-3 transition-colors"
        >
          ← Back to Summary
        </button>
        <h1 className="text-xl font-black text-white mb-1">{sessionTitle}</h1>
      </div>

      <div className="mb-6">
        <ProgressBar current={currentIndex} total={questions.length} showLabel={false} />
        <p className="text-right text-sm font-bold text-muted mt-1">
          Question {currentIndex + 1} / {questions.length}
        </p>
      </div>

      <div className="bg-white/[0.04] backdrop-blur-sm rounded-3xl border border-white/[0.08] p-6 sm:p-8 shimmer-top relative">
        <QuizQuestion
          key={`${currentIndex}-${question.question}`}
          question={question.question}
          choices={question.choices}
          correctAnswer={question.answer}
          explanation={question.explanation}
          onAnswer={handleAnswer}
        />
      </div>

      <p className="text-center text-sm text-muted font-semibold mt-6">
        Score so far: {score} / {currentIndex}
      </p>
    </div>
  );
}
