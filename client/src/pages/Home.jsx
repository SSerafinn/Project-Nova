import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import SolarSystem from '../components/SolarSystem';
import Button from '../components/ui/Button';
import { getNotes, getFolders, createFolder } from '../services/api';
import { BookOpenIcon, SpinnerIcon, PlusIcon } from '../components/Icons';

function GridIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <rect x="3" y="3" width="7" height="7" rx="1" />
      <rect x="14" y="3" width="7" height="7" rx="1" />
      <rect x="3" y="14" width="7" height="7" rx="1" />
      <rect x="14" y="14" width="7" height="7" rx="1" />
    </svg>
  );
}

function OrbitIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <circle cx="12" cy="12" r="3" />
      <ellipse cx="12" cy="12" rx="10" ry="4" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(60 12 12)" />
      <ellipse cx="12" cy="12" rx="10" ry="4" transform="rotate(120 12 12)" />
    </svg>
  );
}

export default function Home() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('solar'); // 'solar' | 'grid'
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);

  useEffect(() => {
    Promise.all([getNotes(), getFolders()])
      .then(([notesRes, foldersRes]) => {
        setSessions(notesRes.data);
        setFolders(foldersRes.data);
      })
      .catch(() => setError('Failed to load data. Is the server running?'))
      .finally(() => setLoading(false));
  }, []);

  function handleDelete(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleFolderChange(noteId, folderId, folderName) {
    setSessions((prev) =>
      prev.map((s) => s.id === noteId ? { ...s, folder_id: folderId, folder_name: folderName } : s)
    );
    // Refresh folder note counts
    getFolders().then((res) => setFolders(res.data)).catch(() => {});
  }

  async function handleCreateFolder(e) {
    e.preventDefault();
    if (!newFolderName.trim()) return;
    setCreatingFolder(true);
    try {
      const res = await createFolder({ name: newFolderName.trim() });
      setFolders((prev) => [...prev, res.data]);
      setNewFolderName('');
      setShowFolderInput(false);
    } catch {
      // folder likely already exists — just dismiss
    } finally {
      setCreatingFolder(false);
    }
  }

  return (
    <div className="max-w-5xl mx-auto px-4 py-10">
      {/* Header */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-white">My Notes</h1>
          <p className="text-muted mt-1">
            {sessions.length > 0
              ? `${sessions.length} note${sessions.length !== 1 ? 's' : ''} ready to study`
              : 'Upload your first note to get started'}
          </p>
        </div>

        <div className="flex items-center gap-2">
          {/* View toggle */}
          <div className="flex items-center bg-white/5 border border-border/30 rounded-xl p-1 gap-1">
            <button
              onClick={() => setView('solar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === 'solar'
                  ? 'bg-surface border border-border/40 text-white'
                  : 'text-muted hover:text-white'
              }`}
              title="Solar view"
            >
              <OrbitIcon className="w-4 h-4" />
              Solar
            </button>
            <button
              onClick={() => setView('grid')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === 'grid'
                  ? 'bg-surface border border-border/40 text-white'
                  : 'text-muted hover:text-white'
              }`}
              title="Grid view"
            >
              <GridIcon className="w-4 h-4" />
              Grid
            </button>
          </div>

          {/* New Folder */}
          {view === 'solar' && (
            <button
              onClick={() => setShowFolderInput((v) => !v)}
              className="btn-chunky bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-secondary-dark transition-colors"
              style={{ boxShadow: '0px 3px 0px #5448D0' }}
            >
              + Folder
            </button>
          )}
        </div>
      </div>

      {/* New folder input */}
      {showFolderInput && (
        <form
          onSubmit={handleCreateFolder}
          className="mb-6 flex gap-2 items-center bg-surface border border-border/40 rounded-2xl px-4 py-3"
        >
          <input
            autoFocus
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Folder name..."
            className="flex-1 bg-transparent text-white font-semibold text-sm outline-none placeholder:text-muted"
          />
          <Button type="submit" variant="primary" size="sm" disabled={creatingFolder || !newFolderName.trim()}>
            Create
          </Button>
          <button
            type="button"
            onClick={() => { setShowFolderInput(false); setNewFolderName(''); }}
            className="text-muted hover:text-white font-bold text-sm transition-colors"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <SpinnerIcon className="w-10 h-10 text-primary animate-spin" />
          <p className="text-muted font-semibold">Loading...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-danger/10 border border-danger/30 rounded-2xl p-6 text-center text-danger font-semibold">
          {error}
        </div>
      )}

      {/* Solar view */}
      {!loading && !error && view === 'solar' && (
        <>
          <SolarSystem folders={folders} />
          {sessions.length > 0 && (
            <div className="mt-8">
              <h2 className="text-lg font-black text-white mb-4">All Notes</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
                {sessions.map((session, i) => (
                  <NoteCard
                    key={session.id}
                    session={session}
                    onDelete={handleDelete}
                    onFolderChange={handleFolderChange}
                    folders={folders}
                    style={{ animationDelay: `${i * 0.07}s`, opacity: 0 }}
                  />
                ))}
              </div>
            </div>
          )}
        </>
      )}

      {/* Grid view */}
      {!loading && !error && view === 'grid' && (
        <>
          {sessions.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center">
              <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center">
                <BookOpenIcon className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-2xl font-extrabold text-white">No notes yet</h2>
              <p className="text-muted max-w-sm">
                Upload your study notes and let AI do the heavy lifting — summaries, flashcards, and quizzes in seconds.
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="btn-chunky bg-primary text-[#1C1733] px-8 py-3.5 rounded-2xl font-extrabold text-base mt-2 hover:bg-primary-dark transition-colors"
                style={{ boxShadow: '0px 4px 0px #D4A800' }}
              >
                Upload Your First Note
              </button>
            </div>
          ) : (
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
        </>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/upload')}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-primary text-[#1C1733] font-black flex items-center justify-center hover:bg-primary-dark transition-all hover:scale-110 active:scale-95 z-40"
        style={{ boxShadow: '0px 6px 0px #D4A800' }}
        title="Upload new note"
      >
        <PlusIcon className="w-7 h-7" />
      </button>
    </div>
  );
}
