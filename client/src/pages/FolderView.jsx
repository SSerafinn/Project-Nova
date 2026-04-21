import React, { useEffect, useState } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import Button from '../components/ui/Button';
import { getFolderById, deleteFolder, getFolders } from '../services/api';
import { QuestionMarkCircleIcon, SpinnerIcon, TrashIcon } from '../components/Icons';

export default function FolderView() {
  const { id } = useParams();
  const navigate = useNavigate();
  const [folder, setFolder] = useState(null);
  const [allFolders, setAllFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    Promise.all([getFolderById(id), getFolders()])
      .then(([folderRes, foldersRes]) => {
        setFolder(folderRes.data);
        setAllFolders(foldersRes.data);
      })
      .catch(() => setError('Failed to load folder.'))
      .finally(() => setLoading(false));
  }, [id]);

  function handleNoteDelete(noteId) {
    setFolder((prev) => ({
      ...prev,
      sessions: prev.sessions.filter((s) => s.id !== noteId),
    }));
  }

  function handleFolderChange(noteId, folderId) {
    // If moved out of this folder, remove it from the list
    if (folderId !== Number(id)) {
      setFolder((prev) => ({
        ...prev,
        sessions: prev.sessions.filter((s) => s.id !== noteId),
      }));
    }
  }

  async function handleDeleteFolder() {
    if (!window.confirm(`Delete folder "${folder.name}"? Notes inside will become uncategorized.`)) return;
    try {
      await deleteFolder(id);
      navigate('/');
    } catch {
      alert('Failed to delete folder.');
    }
  }

  if (loading) {
    return (
      <div className="flex flex-col items-center justify-center min-h-screen gap-4">
        <img src="/nova_logo_no_text.png" alt="Loading..." className="w-12 h-12 object-contain animate-bounce drop-shadow-[0_0_15px_rgba(233,185,73,0.4)]" />
        <p className="text-muted font-semibold">Loading folder...</p>
      </div>
    );
  }

  if (error || !folder) {
    return (
      <div className="max-w-2xl mx-auto px-4 py-10 text-center">
        <p className="text-danger font-bold">{error || 'Folder not found.'}</p>
        <button onClick={() => navigate('/')} className="mt-4 text-primary font-bold underline">
          Go back home
        </button>
      </div>
    );
  }

  const hasQuiz = folder.sessions.some((s) => s.quiz_count > 0);

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4">
        <div className="flex items-center gap-3">
          <button
            onClick={() => navigate('/')}
            className="btn-chunky w-10 h-10 rounded-xl bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors shrink-0"
            style={{ boxShadow: '0px 3px 0px #D4A800' }}
          >
            <svg className="w-4 h-4 text-[#1C1733]" fill="currentColor" viewBox="0 0 24 24">
              <path d="M15.41 7.41L14 6l-6 6 6 6 1.41-1.41L10.83 12z" />
            </svg>
          </button>
          <div>
            <h1 className="text-2xl font-black text-white">{folder.name}</h1>
            <p className="text-muted text-sm mt-0.5">
              {folder.sessions.length} note{folder.sessions.length !== 1 ? 's' : ''}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2">
          {hasQuiz && (
            <Button
              variant="primary"
              size="md"
              onClick={() => navigate(`/folders/${id}/quiz`)}
              className="flex items-center gap-2"
            >
              <QuestionMarkCircleIcon className="w-4 h-4" />
              Quiz Folder
            </Button>
          )}
          <button
            onClick={handleDeleteFolder}
            className="text-muted hover:text-danger transition-colors p-2 rounded-lg hover:bg-danger/10"
            title="Delete folder"
          >
            <TrashIcon className="w-5 h-5" />
          </button>
        </div>
      </div>

      {/* Notes grid */}
      {folder.sessions.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-24 gap-4 text-center">
          <div className="w-16 h-16 rounded-full bg-white/10 flex items-center justify-center">
            <span className="text-2xl font-black text-white">{folder.name.charAt(0).toUpperCase()}</span>
          </div>
          <p className="text-muted font-semibold">No notes in this folder yet.</p>
          <Button variant="primary" onClick={() => navigate('/upload')}>
            Upload a Note
          </Button>
        </div>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
          {folder.sessions.map((session, i) => (
            <NoteCard
              key={session.id}
              session={session}
              onDelete={handleNoteDelete}
              onFolderChange={handleFolderChange}
              folders={allFolders}
              style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
            />
          ))}
        </div>
      )}
    </div>
  );
}
