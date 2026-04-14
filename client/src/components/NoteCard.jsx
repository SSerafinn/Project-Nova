import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Button from './ui/Button';
import Badge from './ui/Badge';
import { deleteNote } from '../services/api';

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

  return (
    <Card
      className="p-5 flex flex-col gap-4 animate-fadeInUp"
      style={style}
    >
      {/* Header */}
      <div className="flex items-start justify-between gap-2">
        <div className="flex-1 min-w-0">
          <h3 className="font-extrabold text-base text-[#3C3C3C] leading-snug line-clamp-2 mb-1">
            {session.title}
          </h3>
          <div className="flex items-center gap-2 text-xs text-muted">
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
            <svg className="animate-spin h-4 w-4" viewBox="0 0 24 24" fill="none">
              <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
              <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8v8H4z" />
            </svg>
          ) : (
            <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
              <path strokeLinecap="round" strokeLinejoin="round" d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
            </svg>
          )}
        </button>
      </div>

      {/* Action buttons */}
      <div className="grid grid-cols-3 gap-2">
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/notes/${session.id}/summary`)}
          className="w-full"
        >
          📋 Summary
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/notes/${session.id}/flashcards`)}
          className="w-full"
        >
          🃏 Cards
        </Button>
        <Button
          variant="ghost"
          size="sm"
          onClick={() => navigate(`/notes/${session.id}/quiz`)}
          className="w-full"
        >
          🎯 Quiz
        </Button>
      </div>
    </Card>
  );
}
