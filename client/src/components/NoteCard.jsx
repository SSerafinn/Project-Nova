import React, { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import Card from './ui/Card';
import Badge from './ui/Badge';
import { deleteNote, updateNoteFolder } from '../services/api';
import { BookOpenIcon, LayersIcon, QuestionMarkCircleIcon, TrashIcon, SpinnerIcon } from './Icons';

function FolderIcon({ className }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth={2}>
      <path strokeLinecap="round" strokeLinejoin="round" d="M3 7a2 2 0 012-2h4l2 2h8a2 2 0 012 2v9a2 2 0 01-2 2H5a2 2 0 01-2-2V7z" />
    </svg>
  );
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const d = new Date(dateStr);
  return d.toLocaleDateString('en-US', { month: 'short', day: 'numeric', year: 'numeric' });
}

const ACTIONS = [
  {
    label: 'Summary',
    Icon: BookOpenIcon,
    pathSuffix: '/summary',
    bg: 'rgba(233,185,73,0.10)',
    border: 'rgba(233,185,73,0.22)',
    color: '#E9B949',
  },
  {
    label: 'Flashcards',
    Icon: LayersIcon,
    pathSuffix: '/flashcards',
    bg: 'rgba(123,108,245,0.10)',
    border: 'rgba(123,108,245,0.22)',
    color: '#9d8fff',
  },
  {
    label: 'Quiz',
    Icon: QuestionMarkCircleIcon,
    pathSuffix: '/quiz',
    bg: 'rgba(224,123,48,0.10)',
    border: 'rgba(224,123,48,0.22)',
    color: '#E07B30',
  },
];

export default function NoteCard({ session, onDelete, onFolderChange, folders = [], style }) {
  const navigate = useNavigate();
  const [deleting, setDeleting] = useState(false);
  const [showFolderPicker, setShowFolderPicker] = useState(false);
  const [movingFolder, setMovingFolder] = useState(false);
  const [currentFolderName, setCurrentFolderName] = useState(session.folder_name || null);
  const pickerRef = useRef(null);

  // Close picker on outside click
  useEffect(() => {
    if (!showFolderPicker) return;
    function handleClick(e) {
      if (pickerRef.current && !pickerRef.current.contains(e.target)) {
        setShowFolderPicker(false);
      }
    }
    document.addEventListener('mousedown', handleClick);
    return () => document.removeEventListener('mousedown', handleClick);
  }, [showFolderPicker]);

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

  async function handleFolderSelect(folder) {
    setMovingFolder(true);
    try {
      await updateNoteFolder(session.id, folder ? folder.id : null);
      const newName = folder ? folder.name : null;
      setCurrentFolderName(newName);
      setShowFolderPicker(false);
      if (onFolderChange) onFolderChange(session.id, folder ? folder.id : null, newName);
    } catch {
      alert('Failed to update folder.');
    } finally {
      setMovingFolder(false);
    }
  }

  return (
    <Card className="flex flex-col animate-fadeInUp" style={style}>
      {/* Gradient accent stripe at top */}
      <div
        className="h-0.5 w-full flex-shrink-0"
        style={{ background: 'linear-gradient(90deg, #E9B949 0%, #7B6CF5 50%, #E07B30 100%)' }}
      />

      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-base text-white leading-snug line-clamp-2 mb-1.5">
              {session.title}
            </h3>
            <div className="flex items-center gap-2 flex-wrap">
              <Badge label={session.source === 'pdf' ? 'PDF' : 'Text'} variant={session.source} />
              <span className="text-xs text-muted">{formatDate(session.created_at)}</span>
            </div>
          </div>
          <button
            onClick={handleDelete}
            disabled={deleting}
            className="text-muted hover:text-danger transition-colors p-1.5 rounded-lg hover:bg-danger/10 shrink-0"
            title="Delete note"
          >
            {deleting ? (
              <img src="/nova_logo_no_text.png" alt="Deleting" className="w-4 h-4 object-contain animate-bounce opacity-70 drop-shadow-[0_0_5px_rgba(255,75,75,0.4)]" />
            ) : (
              <TrashIcon className="h-4 w-4" />
            )}
          </button>
        </div>

        {/* Stats */}
        <div className="flex items-center gap-3 text-xs text-muted font-medium">
          <div className="flex items-center gap-1.5">
            <LayersIcon className="w-3.5 h-3.5" style={{ color: '#9d8fff' }} />
            <span>{session.flashcard_count ?? 0} cards</span>
          </div>
          <span className="opacity-30">•</span>
          <div className="flex items-center gap-1.5">
            <QuestionMarkCircleIcon className="w-3.5 h-3.5" style={{ color: '#E07B30' }} />
            <span>{session.quiz_count ?? 0} questions</span>
          </div>
        </div>

        {/* Folder assignment */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowFolderPicker((v) => !v); }}
            disabled={movingFolder}
            className={`flex items-center gap-1.5 text-xs font-medium px-2.5 py-1.5 rounded-lg transition-colors ${
              currentFolderName
                ? 'bg-secondary/15 text-secondary hover:bg-secondary/25'
                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
            }`}
            title="Assign to folder"
          >
            {movingFolder ? (
              <img src="/nova_logo_no_text.png" alt="Moving" className="w-4 h-4 object-contain animate-bounce opacity-70" />
            ) : (
              <FolderIcon className="w-3.5 h-3.5" />
            )}
            <span>{currentFolderName || 'Add to folder'}</span>
          </button>

          {showFolderPicker && (
            <div
              className="absolute left-0 top-full mt-1 z-50 rounded-xl shadow-xl overflow-hidden min-w-[180px]"
              style={{ background: '#1a1535', border: '1px solid rgba(123,108,245,0.2)' }}
            >
              {folders.length === 0 ? (
                <p className="text-muted text-xs font-medium px-4 py-3">No folders yet</p>
              ) : (
                <ul>
                  {folders.map((f) => (
                    <li key={f.id}>
                      <button
                        onClick={() => handleFolderSelect(f)}
                        className="w-full text-left px-4 py-2.5 text-sm font-medium text-white hover:bg-white/8 transition-colors flex items-center gap-2"
                      >
                        <FolderIcon className="w-3.5 h-3.5 text-secondary shrink-0" />
                        {f.name}
                        {currentFolderName === f.name && (
                          <span className="ml-auto text-primary text-xs">✓</span>
                        )}
                      </button>
                    </li>
                  ))}
                </ul>
              )}
              {currentFolderName && (
                <>
                  <div className="border-t" style={{ borderColor: 'rgba(255,255,255,0.06)' }} />
                  <button
                    onClick={() => handleFolderSelect(null)}
                    className="w-full text-left px-4 py-2.5 text-sm font-medium text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    Remove from folder
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action buttons — each with a distinct color */}
        <div className="grid grid-cols-3 gap-2">
          {ACTIONS.map(({ label, Icon, pathSuffix, bg, border, color }) => (
            <button
              key={label}
              onClick={() => navigate(`/notes/${session.id}${pathSuffix}`)}
              className="flex flex-col items-center gap-1.5 py-2.5 px-1 rounded-xl font-semibold text-xs transition-all hover:scale-[1.04] active:scale-95"
              style={{ background: bg, border: `1px solid ${border}`, color }}
              title={label}
            >
              <Icon className="w-4 h-4" />
              {label}
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
