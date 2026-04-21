import { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import NoteCard from '../components/NoteCard';
import SolarSystem from '../components/SolarSystem';
import Button from '../components/ui/Button';
import { getNotes, getFolders, createFolder } from '../services/api';
import { BookOpenIcon, SpinnerIcon, PlusIcon, SparklesIcon } from '../components/Icons';

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

// --- GAMIFIED MOCK DATA FOR PRESENTATION ---
const MOCK_FOLDERS = [
  { id: 'm1', name: 'Computer Science 101', note_count: 12 },
  { id: 'm2', name: 'Organic Chemistry', note_count: 8 },
  { id: 'm3', name: 'World History', note_count: 5 },
  { id: 'm4', name: 'Linear Algebra', note_count: 24 },
  { id: 'm5', name: 'Spanish Linguistics', note_count: 3 },
  { id: 'm6', name: 'Quantum Physics', note_count: 14 },
];

const MOCK_NOTES = [
  { id: 'n1', title: 'Chapter 4: Data Structures (Trees & Graphs)', created_at: new Date().toISOString(), flashcard_count: 45, quiz_count: 20, folder_id: 'm1', folder_name: 'Computer Science 101', source: 'pdf' },
  { id: 'n2', title: 'O-Chem Mechanisms & Synthesis', created_at: new Date().toISOString(), flashcard_count: 120, quiz_count: 50, folder_id: 'm2', folder_name: 'Organic Chemistry', source: 'pdf' },
  { id: 'n3', title: 'The Cold War Era 1947-1991', created_at: new Date().toISOString(), flashcard_count: 28, quiz_count: 10, folder_id: 'm3', folder_name: 'World History', source: 'text' },
  { id: 'n4', title: 'Eigenvalues and Eigenvectors', created_at: new Date().toISOString(), flashcard_count: 15, quiz_count: 5, folder_id: 'm4', folder_name: 'Linear Algebra', source: 'pdf' },
  { id: 'n5', title: 'Schrödinger Equation Derivations', created_at: new Date().toISOString(), flashcard_count: 60, quiz_count: 15, folder_id: 'm6', folder_name: 'Quantum Physics', source: 'text' },
  { id: 'n6', title: 'Introductory Spanish Vocab Set', created_at: new Date().toISOString(), flashcard_count: 150, quiz_count: 40, folder_id: 'm5', folder_name: 'Spanish Linguistics', source: 'text' },
];

export default function Home() {
  const navigate = useNavigate();
  const [sessions, setSessions] = useState([]);
  const [folders, setFolders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [view, setView] = useState('solar'); 
  const [showFolderInput, setShowFolderInput] = useState(false);
  const [newFolderName, setNewFolderName] = useState('');
  const [creatingFolder, setCreatingFolder] = useState(false);
  const [demoMode, setDemoMode] = useState(false); // Demo Mode Toggle

  useEffect(() => {
    fetchRealData();
  }, []);

  function fetchRealData() {
    setLoading(true);
    setError(null);
    Promise.all([getNotes(), getFolders()])
      .then(([notesRes, foldersRes]) => {
        setSessions(notesRes.data);
        setFolders(foldersRes.data);
      })
      .catch(() => setError('Failed to load data. Is the server running?'))
      .finally(() => setLoading(false));
  }

  function handleDemoToggle() {
    if (demoMode) {
      setDemoMode(false);
      fetchRealData();
    } else {
      setDemoMode(true);
      // Append massive dataset so the app looks totally gamified and packed
      setFolders((prev) => [...prev, ...MOCK_FOLDERS]);
      setSessions((prev) => [...prev, ...MOCK_NOTES]);
    }
  }

  function handleDelete(id) {
    setSessions((prev) => prev.filter((s) => s.id !== id));
  }

  function handleFolderChange(noteId, folderId, folderName) {
    setSessions((prev) =>
      prev.map((s) => s.id === noteId ? { ...s, folder_id: folderId, folder_name: folderName } : s)
    );
    getFolders().then((res) => {
      // If we are in demo mode, preserve the mock folders while updating
      setFolders(demoMode ? [...res.data, ...MOCK_FOLDERS] : res.data);
    }).catch(() => {});
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
    <div className="max-w-6xl mx-auto px-4 py-8">
      
      {/* Gamification Dashboard Header - Mock for Demo */}
      <div className="bg-surface/80 backdrop-blur-md rounded-3xl border border-border/50 shadow-card p-6 mb-8 flex flex-col md:flex-row items-center justify-between gap-6 animate-fadeInUp">
        <div className="flex items-center gap-4 w-full md:w-auto">
          <div className="w-16 h-16 rounded-full border-4 border-surface shadow-glow-primary bg-gradient-to-br from-primary to-accent flex items-center justify-center text-xl font-black text-[#1C1733] shrink-0">
            PP
          </div>
          <div className="flex-1">
            <h2 className="text-xl font-black text-white flex gap-2 items-center flex-wrap">
              Paula the Paulinian 
              <span className="bg-primary/20 text-primary text-[10px] uppercase font-black tracking-wider px-2.5 py-1 rounded-full border border-primary/30 flex items-center gap-1 shadow-[0_0_8px_rgba(233,185,73,0.3)]">
                <SparklesIcon className="w-3 h-3" /> Lvl 12 Space Scholar
              </span>
            </h2>
            <div className="flex items-center justify-between mt-1 mb-1">
               <p className="text-xs text-muted font-bold">1,450 XP</p>
               <p className="text-xs text-muted font-bold">2,000 XP</p>
            </div>
            <div className="w-full max-w-sm bg-bg h-2 rounded-full border border-border/40 overflow-hidden">
              <div className="h-full bg-gradient-to-r from-primary to-accent rounded-full w-[72%] shadow-[0_0_10px_rgba(233,185,73,0.8)] relative">
                <div className="absolute top-0 bottom-0 left-0 right-0 bg-white/20" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(255,255,255,0.4) 50%, transparent 100%)', animation: 'shimmer 2s infinite' }}></div>
              </div>
            </div>
          </div>
        </div>
        
        <div className="flex gap-3 self-end md:self-center shrink-0">
           <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-2.5 px-4 min-w-[80px] border border-border/30 hover:bg-white/10 transition-colors shadow-inner cursor-default">
              <span className="text-2xl font-black text-danger drop-shadow-[0_0_8px_rgba(255,75,75,0.6)]">14🔥</span>
              <span className="text-[9px] uppercase font-bold text-muted tracking-wide mt-0.5">Day Streak</span>
           </div>
           <div className="flex flex-col items-center justify-center bg-white/5 rounded-2xl p-2.5 px-4 min-w-[80px] border border-border/30 hover:bg-white/10 transition-colors shadow-inner cursor-default">
              <span className="text-2xl font-black text-secondary drop-shadow-[0_0_8px_rgba(123,108,245,0.6)]">{sessions.length > 0 ? (sessions.reduce((acc,s)=>acc+(s.flashcard_count||0),0) + 120) : '0'}</span>
              <span className="text-[9px] uppercase font-bold text-muted tracking-wide mt-0.5">Cards Mastered</span>
           </div>
        </div>
      </div>

      {/* Main Content Tools */}
      <div className="flex items-center justify-between mb-8 gap-4 flex-wrap">
        <div>
          <h1 className="text-3xl font-black text-white">My Notes & Systems</h1>
          <p className="text-muted mt-1 font-medium">
            {sessions.length > 0
              ? `${sessions.length} note${sessions.length !== 1 ? 's' : ''} in orbit`
              : 'Upload your first note to begin your journey'}
          </p>
        </div>

        <div className="flex items-center gap-3">
          
          {/* Demo Toggle Button for Hackathon */}
           <button
            onClick={handleDemoToggle}
            className={`flex items-center gap-1.5 px-3 py-2 rounded-xl text-xs font-black transition-all border shadow-card active:translate-y-1 active:shadow-none ${
              demoMode
                ? 'bg-primary/20 border-primary/50 text-primary shadow-glow-primary'
                : 'bg-surface border-border/50 text-muted hover:text-white'
            }`}
            title="Toggle Demo Mock Data"
          >
            🎮 {demoMode ? 'Demo Active' : 'Load Demo'}
          </button>

          {/* View toggle */}
          <div className="flex items-center bg-white/5 border border-border/30 rounded-xl p-1 gap-1 shadow-inner">
            <button
              onClick={() => setView('solar')}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-lg text-xs font-bold transition-all ${
                view === 'solar'
                  ? 'bg-surface border border-border/40 text-white shadow-sm'
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
                  ? 'bg-surface border border-border/40 text-white shadow-sm'
                  : 'text-muted hover:text-white'
              }`}
              title="Grid view"
            >
              <GridIcon className="w-4 h-4" />
              Grid
            </button>
          </div>

          {/* New Folder */}
          <button
            onClick={() => setShowFolderInput((v) => !v)}
            className="btn-chunky bg-secondary text-white px-4 py-2 rounded-xl font-bold text-sm hover:bg-secondary-dark transition-colors border border-transparent shadow-card-secondary"
          >
            + Folder
          </button>
        </div>
      </div>

      {/* New folder input */}
      {showFolderInput && (
        <form
          onSubmit={handleCreateFolder}
          className="mb-6 flex gap-3 items-center bg-surface/80 backdrop-blur-md border border-border/40 rounded-2xl px-5 py-4 animate-fadeInUp shadow-card"
        >
          <input
            autoFocus
            type="text"
            value={newFolderName}
            onChange={(e) => setNewFolderName(e.target.value)}
            placeholder="Name your new galactic folder..."
            className="flex-1 bg-transparent text-white font-bold text-sm outline-none placeholder:text-muted/60"
          />
          <Button type="submit" variant="primary" size="sm" disabled={creatingFolder || !newFolderName.trim()}>
            Create Orbit
          </Button>
          <button
            type="button"
            onClick={() => { setShowFolderInput(false); setNewFolderName(''); }}
            className="text-muted hover:text-white font-bold text-sm transition-colors px-2"
          >
            Cancel
          </button>
        </form>
      )}

      {/* Loading */}
      {loading && (
        <div className="flex flex-col items-center justify-center py-24 gap-4">
          <div className="w-16 h-16 border-4 border-primary/20 border-t-primary rounded-full animate-spin"></div>
          <p className="text-primary font-black uppercase tracking-widest text-xs animate-pulse">Initializing Orbit...</p>
        </div>
      )}

      {/* Error */}
      {!loading && error && (
        <div className="bg-danger/10 border border-danger/30 rounded-2xl p-6 text-center text-danger font-semibold flex items-center justify-center gap-2">
          <span>⚠️</span> {error}
        </div>
      )}

      {/* Solar view */}
      {!loading && !error && view === 'solar' && (
        <div className="animate-fadeInUp">
          <SolarSystem folders={folders} />
          {sessions.length > 0 && (
            <div className="mt-12">
              <h2 className="text-xl font-black text-white mb-6 flex items-center gap-2">
                 <BookOpenIcon className="w-5 h-5 text-primary" /> Active Notes
              </h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, i) => (
                  <NoteCard
                    key={session.id}
                    session={session}
                    onDelete={handleDelete}
                    onFolderChange={handleFolderChange}
                    folders={folders}
                    style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                  />
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* Grid view */}
      {!loading && !error && view === 'grid' && (
        <div className="animate-fadeInUp pt-4">
          {/* Folders row */}
          {folders.length > 0 && (
            <div className="mb-10">
              <h2 className="text-xl font-black text-white mb-6">Orbital Folders</h2>
              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                {folders.map((folder, i) => (
                  <button
                    key={folder.id}
                    onClick={() => navigate(`/folders/${folder.id}`)}
                    className="flex flex-col items-center gap-3 p-5 rounded-3xl bg-surface border border-border/50 hover:-translate-y-1 hover:border-secondary/60 hover:shadow-glow-secondary hover:bg-secondary/10 transition-all duration-300 group"
                    style={{ boxShadow: '0px 4px 0px #13102B' }}
                  >
                    <div
                      className="w-14 h-14 rounded-full flex items-center justify-center font-black text-white text-xl group-hover:scale-110 group-hover:rotate-6 transition-transform shadow-inner"
                      style={{ background: `radial-gradient(circle at 30% 30%, hsl(${(i * 55) % 360}, 75%, 65%), hsl(${(i * 55) % 360}, 65%, 45%))` }}
                    >
                    </div>
                    <div className="w-full text-center space-y-0.5">
                       <p className="font-bold text-white text-sm line-clamp-1 truncate">{folder.name}</p>
                       <p className="text-[10px] uppercase tracking-wider text-muted font-bold">{folder.note_count ?? 0} note{folder.note_count !== 1 ? 's' : ''}</p>
                    </div>
                  </button>
                ))}
              </div>
            </div>
          )}

          {/* Notes */}
          {sessions.length === 0 && folders.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-24 gap-5 text-center bg-surface/30 rounded-3xl border border-dashed border-border/50">
              <div className="w-24 h-24 rounded-full bg-primary/10 flex items-center justify-center border border-primary/20 pulse">
                <BookOpenIcon className="w-10 h-10 text-primary" />
              </div>
              <h2 className="text-3xl font-black text-white">No notes in your orbit yet</h2>
              <p className="text-muted font-medium max-w-sm">
                Upload your study documents and let NOVA extract summaries, flashcards, and quizzes in seconds.
              </p>
              <button
                onClick={() => navigate('/upload')}
                className="btn-chunky bg-primary text-[#1C1733] px-8 py-4 rounded-2xl font-black text-base mt-4 transition-colors border border-transparent hover:shadow-glow-primary shadow-card-primary"
              >
                Launch First Note
              </button>
            </div>
          ) : sessions.length > 0 && (
            <>
              <h2 className="text-xl font-black text-white mb-6">Recent Documents</h2>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sessions.map((session, i) => (
                  <NoteCard
                    key={session.id}
                    session={session}
                    onDelete={handleDelete}
                    onFolderChange={handleFolderChange}
                    folders={folders}
                    style={{ animationDelay: `${i * 0.05}s`, animationFillMode: 'both' }}
                  />
                ))}
              </div>
            </>
          )}
        </div>
      )}

      {/* Floating Action Button */}
      <button
        onClick={() => navigate('/upload')}
        className="fixed bottom-8 right-8 w-16 h-16 rounded-2xl bg-primary text-[#1C1733] font-black flex items-center justify-center transition-all hover:scale-110 active:scale-95 shadow-card-primary hover:shadow-glow-primary z-50 border border-primary-dark"
        title="Upload new note"
      >
        <PlusIcon className="w-7 h-7" />
      </button>

      {/* Shimmer CSS for XP bar */}
      <style dangerouslySetInnerHTML={{__html: `
        @keyframes shimmer {
          0% { transform: translateX(-100%); }
          100% { transform: translateX(200%); }
        }
      `}} />
    </div>
  );
}
