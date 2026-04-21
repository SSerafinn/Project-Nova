import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getNoteById, regenerateSummary } from '../services/api';
import { BookOpenIcon, ArrowPathIcon, KeyIcon, ListBulletIcon, CheckIcon } from '../components/Icons';

function Section({ title, icon: Icon, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 font-extrabold text-white hover:bg-white/5 transition-colors"
      >
        <span className="flex items-center gap-2">
          {Icon && <Icon className="w-4 h-4 text-primary" />}
          {title}
        </span>
        <span className="text-muted text-lg">{open ? '▲' : '▼'}</span>
      </button>
      {open && <div className="px-6 pb-6">{children}</div>}
    </Card>
  );
}

export default function Summary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => {
    loadSession();
  }, [id]);

  async function loadSession() {
    setLoading(true);
    setError(null);
    try {
      const res = await getNoteById(id);
      setSession(res.data);
    } catch {
      setError('Failed to load this note.');
    } finally {
      setLoading(false);
    }
  }

  async function handleRegenerate() {
    setRegenerating(true);
    try {
      await regenerateSummary(id);
      await loadSession();
    } catch {
      alert('Failed to regenerate summary.');
    } finally {
      setRegenerating(false);
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <BookOpenIcon className="w-14 h-14 text-primary animate-bounce" />
        <p className="text-muted font-semibold">Loading summary...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-danger font-bold">{error || 'Session not found.'}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold underline">
          Go back home
        </button>
      </div>
    );
  }

  const summary = session.summary?.content;

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="mb-8">
        <button
          onClick={() => navigate('/')}
          className="text-muted hover:text-white font-semibold text-sm flex items-center gap-1 mb-4 transition-colors"
        >
          ← Back to Notes
        </button>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-black text-white leading-snug">{session.title}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            loading={regenerating}
            className="shrink-0 flex items-center gap-1.5"
          >
            <ArrowPathIcon className="w-4 h-4" />
            Regenerate
          </Button>
        </div>
      </div>

      {!summary ? (
        <Card className="p-8 text-center">
          <p className="text-muted font-semibold">No summary yet. Click Regenerate to create one.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          <Section title="Key Concepts" icon={KeyIcon}>
            <div className="flex flex-wrap gap-2 mt-2">
              {(summary.keyConcepts || []).map((concept, i) => (
                <Badge key={i} label={concept} variant="concept" />
              ))}
            </div>
          </Section>

          <Section title="Important Terms" icon={ListBulletIcon}>
            <div className="flex flex-col gap-3 mt-2">
              {(summary.importantTerms || []).map((item, i) => (
                <div key={i} className="bg-secondary/10 border border-secondary/20 rounded-2xl px-4 py-3">
                  <span className="font-extrabold text-secondary">{item.term}</span>
                  <span className="text-white/80 ml-2">— {item.definition}</span>
                </div>
              ))}
            </div>
          </Section>

          <Section title="Key Takeaways" icon={CheckIcon}>
            <ul className="flex flex-col gap-3 mt-2">
              {(summary.keyTakeaways || []).map((takeaway, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary font-black text-lg mt-0.5">✓</span>
                  <span className="text-white/90 font-semibold">{takeaway}</span>
                </li>
              ))}
            </ul>
          </Section>
        </div>
      )}

      {/* CTA Buttons */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button
          variant="secondary"
          size="lg"
          onClick={() => navigate(`/notes/${id}/flashcards`)}
          className="flex-1"
        >
          Study Flashcards
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/notes/${id}/quiz`)}
          className="flex-1"
        >
          Take Quiz
        </Button>
      </div>
    </div>
  );
}
