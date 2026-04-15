import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { deleteNote } from '../services/api';
import { BookOpenIcon, LayersIcon, QuestionMarkCircleIcon, TrashIcon, SpinnerIcon } from './Icons';

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

export default function NoteCard({ session, onDelete, style }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);

  async function handleDelete(e) {
    e.stopPropagation();
    if (!window.confirm(`Delete "${session.title}"? This cannot be undone.`)) return;
    setDeleting(true);
    try {
      await deleteNote(session.id);
      onDelete(session.id);
    } catch {
      alert('Failed to delete note. Please try again.');
      setDeleting(false);
    }
  }

  const actions = [
    { label: 'Summary', Icon: BookOpenIcon, path: `/notes/${session.id}/summary` },
    { label: 'Cards', Icon: LayersIcon, path: `/notes/${session.id}/flashcards` },
    { label: 'Quiz', Icon: QuestionMarkCircleIcon, path: `/notes/${session.id}/quiz` },
  ];

  return (
    <Card className="flex flex-col animate-fadeInUp overflow-hidden" style={style}>
      {/* Mustard accent strip */}
      <div className="h-1.5 bg-primary w-full" />

      <div className="p-5 flex flex-col gap-3">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-base text-[#3C3C3C] leading-snug line-clamp-2 mb-1.5">
              {session.title}
            </h3>
            <div className="flex items-center gap-2 text-xs text-muted flex-wrap">
              <Badge label={session.source === 'pdf' ? 'PDF' : 'Text'} variant={session.source} />
              <span>{formatDate(session.created_at)}</span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted hover:text-danger transition-colors p-1 rounded-lg hover:bg-danger-light shrink-0"
            title="Delete note"
          >
            {deleting ? (
              <SpinnerIcon className="h-4 w-4 animate-spin" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 py-2 px-3 bg-bg rounded-xl">
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <LayersIcon className="w-3.5 h-3.5 text-primary" />
            <span>{session.flashcard_count ?? 0} flashcards</span>
          </div>
          <div className="w-px h-3 bg-border" />
          <div className="flex items-center gap-1.5 text-xs font-semibold text-muted">
            <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-primary" />
            <span>{session.quiz_count ?? 0} questions</span>
          </div>
        </div>

        {/* Action buttons */}
        <div className="grid grid-cols-3 gap-2">
          {actions.map(({ label, Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="btn-chunky flex flex-col items-center gap-1.5 py-2.5 px-2 bg-white border border-border text-[#3C3C3C] hover:bg-primary-light hover:text-primary-dark hover:border-primary/20 rounded-xl font-bold text-xs transition-colors"
              style={{ boxShadow: '0px 3px 0px #C8B870' }}
            >
              <Icon className="w-4 h-4" />
              <span>{label}</span>
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
