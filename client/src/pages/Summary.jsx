import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Card from '../components/ui/Card';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getNoteById, regenerateSummary } from '../services/api';

function Section({ title, children, defaultOpen = true }) {
  const [open, setOpen] = useState(defaultOpen);
  return (
    <Card className="overflow-hidden">
      <button
        onClick={() => setOpen((o) => !o)}
        className="w-full flex items-center justify-between px-6 py-4 font-extrabold text-[#3C3C3C] hover:bg-gray-50 transition-colors"
      >
        <span>{title}</span>
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
        <div className="text-5xl animate-bounce">📋</div>
        <p className="text-muted font-semibold">Loading summary...</p>
      </div>
    );
  }

  if (error || !session) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-danger-dark font-bold">{error || 'Session not found.'}</p>
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
          className="text-muted hover:text-[#3C3C3C] font-semibold text-sm flex items-center gap-1 mb-4"
        >
          ← Back to Notes
        </button>
        <div className="flex items-start justify-between gap-4">
          <h1 className="text-2xl font-black text-[#3C3C3C] leading-snug">{session.title}</h1>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleRegenerate}
            loading={regenerating}
            className="shrink-0"
          >
            🔄 Regenerate
          </Button>
        </div>
      </div>

      {!summary ? (
        <Card className="p-8 text-center">
          <p className="text-muted font-semibold">No summary yet. Click Regenerate to create one.</p>
        </Card>
      ) : (
        <div className="flex flex-col gap-5">
          {/* Key Concepts */}
          <Section title="🔑 Key Concepts">
            <div className="flex flex-wrap gap-2 mt-2">
              {(summary.keyConcepts || []).map((concept, i) => (
                <Badge key={i} label={concept} variant="concept" />
              ))}
            </div>
          </Section>

          {/* Important Terms */}
          <Section title="📖 Important Terms">
            <div className="flex flex-col gap-3 mt-2">
              {(summary.importantTerms || []).map((item, i) => (
                <div key={i} className="bg-secondary-light rounded-2xl px-4 py-3">
                  <span className="font-extrabold text-secondary-dark">{item.term}</span>
                  <span className="text-[#3C3C3C] ml-2">— {item.definition}</span>
                </div>
              ))}
            </div>
          </Section>

          {/* Key Takeaways */}
          <Section title="✅ Key Takeaways">
            <ul className="flex flex-col gap-3 mt-2">
              {(summary.keyTakeaways || []).map((takeaway, i) => (
                <li key={i} className="flex items-start gap-3">
                  <span className="text-primary font-black text-lg mt-0.5">✓</span>
                  <span className="text-[#3C3C3C] font-semibold">{takeaway}</span>
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
          Study Flashcards 🃏
        </Button>
        <Button
          variant="primary"
          size="lg"
          onClick={() => navigate(`/notes/${id}/quiz`)}
          className="flex-1"
        >
          Take Quiz 🎯
        </Button>
      </div>
    </div>
  );
}
