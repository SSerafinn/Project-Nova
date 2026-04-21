import { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import Badge from '../components/ui/Badge';
import Button from '../components/ui/Button';
import { getNoteById, regenerateSummary } from '../services/api';
import { BookOpenIcon, ArrowPathIcon, LayersIcon, QuestionMarkCircleIcon, SpinnerIcon } from '../components/Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  return new Date(dateStr).toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' });
}

function estimateReadTime(summaryData) {
  if (!summaryData) return 1;
  let text = '';
  if (summaryData.sections) {
    text += (summaryData.overview || '') + ' ';
    summaryData.sections.forEach((s) => {
      text += (s.heading || '') + ' ' + (s.content || '') + ' ';
    });
    const words = text.split(/\s+/).filter(Boolean).length;
    return Math.max(1, Math.ceil(words / 200));
  }
  
  // Backward compatibility with legacy summary format
  const terms = summaryData.importantTerms || [];
  const takeaways = summaryData.keyTakeaways || [];
  const words = (terms.length * 20) + (takeaways.length * 15);
  return Math.max(1, Math.ceil(words / 200));
}

export default function Summary() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [session, setSession] = useState(null);
  const [loading, setLoading] = useState(true);
  const [regenerating, setRegenerating] = useState(false);
  const [error, setError] = useState(null);

  useEffect(() => { loadSession(); }, [id]);

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
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold underline">Go back home</button>
      </div>
    );
  }

  const summary = session.summary?.content;
  const isUpgradedFormat = !!summary?.sections;

  // New format props
  const overview = summary?.overview;
  const sections = summary?.sections || [];

  // Old format props (for backward compatibility if existing notes are loaded)
  const keyConcepts = summary?.keyConcepts || [];
  const importantTerms = summary?.importantTerms || [];
  const keyTakeaways = summary?.keyTakeaways || [];

  const readTime = estimateReadTime(summary);

  return (
    <div className="max-w-3xl mx-auto px-4 py-10">

      {/* Back nav */}
      <button
        onClick={() => navigate('/')}
        className="text-muted hover:text-white font-semibold text-sm flex items-center gap-1 mb-6 transition-colors"
      >
        ← Back to Notes
      </button>

      {/* ── Book Cover ─────────────────────────────────────────────── */}
      <div
        className="relative rounded-3xl overflow-hidden mb-8 p-8 border border-white/10"
        style={{
          background: 'linear-gradient(135deg, rgba(37,30,66,0.5) 0%, rgba(28,23,51,0.5) 100%)',
          backdropFilter: 'blur(16px)',
          boxShadow: '0px 6px 0px rgba(12,11,28,0.8)',
        }}
      >
        {/* Decorative spine line */}
        <div className="absolute left-0 top-0 bottom-0 w-1.5 rounded-l-3xl bg-gradient-to-b from-[#E9B949] via-[#7B6CF5] to-[#E07B30]" />

        {/* Top row */}
        <div className="flex items-start justify-between gap-4 pl-4">
          <div className="flex-1">
            <p className="text-xs font-black text-secondary/70 tracking-widest uppercase mb-2">Study Notes</p>
            <h1 className="text-2xl sm:text-3xl font-black text-white leading-tight mb-3">{session.title}</h1>
            <div className="flex items-center gap-3 flex-wrap">
              <Badge label={session.source === 'pdf' ? 'PDF' : 'Text'} variant={session.source} />
              <span className="text-xs text-muted font-semibold">{formatDate(session.created_at)}</span>
              <span className="text-xs text-muted font-semibold">· {readTime} min read</span>
            </div>
          </div>

          {/* Regenerate */}
          <button
            onClick={handleRegenerate}
            disabled={regenerating}
            className="shrink-0 flex items-center gap-1.5 px-3 py-2 rounded-xl bg-white/10 hover:bg-white/15 text-muted hover:text-white font-bold text-xs transition-colors border border-white/10"
          >
            {regenerating
              ? <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
              : <ArrowPathIcon className="w-3.5 h-3.5" />
            }
            Regenerate
          </button>
        </div>

        {/* Table of contents */}
        {summary && (
          <div className="mt-6 pl-4">
            <p className="text-xs font-black text-muted/60 tracking-widest uppercase mb-2">Contents</p>
            <div className="flex flex-col gap-1">
              {isUpgradedFormat ? (
                sections.map((sec, i) => (
                  <div key={i} className="flex items-center gap-3 text-sm">
                    <span className="font-black text-primary/60 text-xs w-6">{String(i + 1).padStart(2, '0')}</span>
                    <span className="flex-1 border-b border-dashed border-white/10" />
                    <span className="font-bold text-white/70 truncate">{sec.heading}</span>
                  </div>
                ))
              ) : (
                [
                  { num: '01', label: 'Key Concepts', count: keyConcepts.length },
                  { num: '02', label: 'Important Terms', count: importantTerms.length },
                  { num: '03', label: 'Key Takeaways', count: keyTakeaways.length },
                ].map(({ num, label, count }) => (
                  <div key={num} className="flex items-center gap-3 text-sm">
                    <span className="font-black text-primary/60 text-xs w-6">{num}</span>
                    <span className="flex-1 border-b border-dashed border-white/10" />
                    <span className="font-bold text-white/70">{label}</span>
                    <span className="text-xs text-muted font-semibold w-8 text-right">{count}</span>
                  </div>
                ))
              )}
            </div>
          </div>
        )}
      </div>

      {!summary ? (
        <div className="bg-surface border border-border/50 rounded-3xl p-10 text-center">
          <BookOpenIcon className="w-10 h-10 text-muted mx-auto mb-3" />
          <p className="text-muted font-semibold">No summary yet.</p>
          <button onClick={handleRegenerate} className="mt-4 text-primary font-bold text-sm underline">Generate one now</button>
        </div>
      ) : isUpgradedFormat ? (
        <div className="flex flex-col gap-6">
          {/* Overview */}
          {overview && (
            <div className="relative overflow-hidden border border-white/10 rounded-3xl p-6" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', boxShadow: '0px 4px 0px rgba(12,11,28,0.5)' }}>
              <div className="flex items-center gap-2 mb-3">
                <BookOpenIcon className="w-4 h-4 text-[#E9B949]" />
                <h2 className="font-black text-[#E9B949] text-sm uppercase tracking-widest">Overview</h2>
              </div>
              <p className="text-white/85 leading-relaxed text-sm md:text-base">{overview}</p>
            </div>
          )}

          {/* Sections */}
          {sections.length > 0 && (
            <div className="border border-white/10 rounded-3xl overflow-hidden" style={{ background: 'rgba(255,255,255,0.02)', backdropFilter: 'blur(10px)', boxShadow: '0px 4px 0px rgba(12,11,28,0.5)' }}>
              {sections.map((sec, i) => (
                <div key={i} className="border-b border-white/5 last:border-0 relative">
                  <div className="flex items-center gap-3 px-6 py-4 border-b border-white/5 bg-white/[0.01]">
                    <span className="text-xs font-black text-secondary tracking-widest">{String(i + 1).padStart(2, '0')}</span>
                    <div className="w-px h-4 bg-white/10" />
                    <h2 className="font-bold text-white text-base md:text-lg">{sec.heading}</h2>
                  </div>
                  <div className="px-6 py-5">
                    <p className="text-white/80 leading-relaxed text-sm md:text-base whitespace-pre-wrap">{sec.content}</p>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      ) : (
        <div className="flex flex-col gap-6">
          {/* Legacy Summary Format */}
          {/* ── Section 01: Key Concepts ───────────────────────────── */}
          <div className="bg-surface border border-border/50 rounded-3xl overflow-hidden" style={{ boxShadow: '0px 4px 0px #13102B' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30">
              <span className="text-xs font-black text-primary/50 tracking-widest">01</span>
              <div className="w-px h-4 bg-border/50" />
              <h2 className="font-black text-white text-base">Key Concepts</h2>
            </div>
            <div className="px-6 py-5">
              {keyConcepts.length === 0 ? (
                <p className="text-muted text-sm">No concepts found.</p>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {keyConcepts.map((concept, i) => (
                    <span key={i} className="px-3.5 py-1.5 rounded-xl text-sm font-bold bg-primary/15 text-primary border border-primary/20">
                      {concept}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Section 02: Important Terms ────────────────────────── */}
          <div className="bg-surface border border-border/50 rounded-3xl overflow-hidden" style={{ boxShadow: '0px 4px 0px #13102B' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30">
              <span className="text-xs font-black text-primary/50 tracking-widest">02</span>
              <div className="w-px h-4 bg-border/50" />
              <h2 className="font-black text-white text-base">Important Terms</h2>
            </div>
            <div className="divide-y divide-border/20">
              {importantTerms.length === 0 ? (
                <p className="text-muted text-sm px-6 py-5">No terms found.</p>
              ) : (
                importantTerms.map((item, i) => (
                  <div key={i} className="px-6 py-4 flex gap-4 items-start group hover:bg-white/[0.02] transition-colors">
                    {/* Index number */}
                    <span className="text-xs font-black text-muted/40 mt-0.5 w-5 shrink-0 text-right">{String(i + 1).padStart(2, '0')}</span>
                    {/* Left accent */}
                    <div className="w-0.5 self-stretch bg-secondary/40 rounded-full shrink-0" />
                    <div className="flex-1 min-w-0">
                      <p className="font-black text-secondary text-sm leading-snug">{item.term}</p>
                      <p className="text-white/75 text-sm font-medium mt-1 leading-relaxed">{item.definition}</p>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>

          {/* ── Section 03: Key Takeaways ──────────────────────────── */}
          <div className="bg-surface border border-border/50 rounded-3xl overflow-hidden" style={{ boxShadow: '0px 4px 0px #13102B' }}>
            <div className="flex items-center gap-3 px-6 py-4 border-b border-border/30">
              <span className="text-xs font-black text-primary/50 tracking-widest">03</span>
              <div className="w-px h-4 bg-border/50" />
              <h2 className="font-black text-white text-base">Key Takeaways</h2>
            </div>
            <div className="px-6 py-5 flex flex-col gap-3">
              {keyTakeaways.length === 0 ? (
                <p className="text-muted text-sm">No takeaways found.</p>
              ) : (
                keyTakeaways.map((takeaway, i) => (
                  <div key={i} className="flex items-start gap-4">
                    {/* Number badge */}
                    <span
                      className="shrink-0 w-6 h-6 rounded-lg flex items-center justify-center text-xs font-black text-[#1C1733] mt-0.5"
                      style={{ background: 'linear-gradient(135deg, #F5C518, #C86A14)' }}
                    >
                      {i + 1}
                    </span>
                    <p className="text-white/85 font-semibold text-sm leading-relaxed flex-1">{takeaway}</p>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>
      )}

      {/* ── CTA ────────────────────────────────────────────────────── */}
      <div className="flex flex-col sm:flex-row gap-3 mt-8">
        <Button variant="secondary" size="lg" onClick={() => navigate(`/notes/${id}/flashcards`)} className="flex-1 flex items-center justify-center gap-2" style={{ border: '1px solid rgba(123,108,245,0.3)' }}>
          <LayersIcon className="w-4 h-4" />
          Study Flashcards
        </Button>
        <Button variant="primary" size="lg" onClick={() => navigate(`/notes/${id}/quiz`)} className="flex-1 flex items-center justify-center gap-2" style={{ border: '1px solid rgba(233,185,73,0.3)' }}>
          <QuestionMarkCircleIcon className="w-4 h-4" />
          Take Quiz
        </Button>
      </div>
    </div>
  );
}
