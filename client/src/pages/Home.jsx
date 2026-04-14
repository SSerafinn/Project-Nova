import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import { getNotes } from '../services/api';

export default function Home() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    getNotes()
      .then((res) => setSessions(res.data))
      .catch(() => setError('Failed to load notes. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8">
        <div>
          <h1 className="text-3xl font-black text-[#3C3C3C]">My Notes 📚</h1>
          <p className="text-muted mt-1">
            {sessions.length > 0
              ? `${sessions.length} note${sessions.length !== 1 ? 's' : ''} ready to study`
              : 'Upload your first note to get started'}
          </p>
        </div>
      </div>

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="text-5xl animate-pulse">🧠</div>
          <p className="text-muted font-semibold">Loading your notes...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-danger-light border border-danger/20 rounded-2xl p-6 text-center text-danger-dark font-semibold">
          {error}
        </div>
      )}

      {/* Empty state */}
      {!loading && !error && sessions.length === 0 && (
        <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
          <span className="text-7xl">😭</span>
          <h2 className="text-2xl font-extrabold text-[#3C3C3C]">No notes yet!</h2>
          <p className="text-muted max-w-sm">
            Upload your study notes and let AI do the heavy lifting — summaries, flashcards, and quizzes in seconds.
          </p>
          <button
            onClick={() => navigate('/upload')}
            className="btn-chunky bg-primary text-white px-8 py-3.5 rounded-2xl font-extrabold text-base mt-2 hover:bg-primary-dark transition-colors"
            style={{ boxShadow: '0px 4px 0px #46A302' }}
          >
            Upload Your First Note 🚀
          </button>
        </div>
      )}

      {/* Notes grid */}
      {!loading && !error && sessions.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {sessions.map((session, i) => (
            <NoteCard
              key={session.id}
              session={session}
              onDelete={handleDelete}
              style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
            />
          ))}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/upload')}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-full bg-primary text-white text-3xl font-black flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-110 active:scale-95 z-40"
        style={{ boxShadow: '0px 6px 0px #46A302' }}
        title="Upload new note"
      >
        +
      </button>
    </div>
  );
}
