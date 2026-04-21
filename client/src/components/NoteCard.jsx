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

  const actions = [
    { label: 'Summary', Icon: BookOpenIcon, path: `/notes/${session.id}/summary` },
    { label: 'Cards', Icon: LayersIcon, path: `/notes/${session.id}/flashcards` },
    { label: 'Quiz', Icon: QuestionMarkCircleIcon, path: `/notes/${session.id}/quiz` },
  ];

  return (
    <Card className="flex flex-col animate-fadeInUp" style={style}>
      <div className="p-5 flex flex-col gap-4">
        {/* Header */}
        <div className="flex items-start justify-between gap-2">
          <div className="flex-1 min-w-0">
            <h3 className="font-extrabold text-lg text-white leading-snug line-clamp-2 mb-1.5">
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
            className="text-muted hover:text-danger transition-colors p-1 rounded-lg hover:bg-danger/10 shrink-0"
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
        <div className="flex items-center gap-3 text-xs text-muted font-semibold">
          <div className="flex items-center gap-1.5">
            <LayersIcon className="w-3.5 h-3.5 text-primary" />
            <span>{session.flashcard_count ?? 0} flashcards</span>
          </div>
          <span className="opacity-40">•</span>
          <div className="flex items-center gap-1.5">
            <QuestionMarkCircleIcon className="w-3.5 h-3.5 text-primary" />
            <span>{session.quiz_count ?? 0} questions</span>
          </div>
        </div>

        {/* Folder row */}
        <div className="relative" ref={pickerRef}>
          <button
            onClick={(e) => { e.stopPropagation(); setShowFolderPicker((v) => !v); }}
            disabled={movingFolder}
            className={`flex items-center gap-1.5 text-xs font-bold px-2.5 py-1.5 rounded-lg transition-colors ${
              currentFolderName
                ? 'bg-secondary/20 text-secondary hover:bg-secondary/30'
                : 'bg-white/5 text-muted hover:bg-white/10 hover:text-white'
            }`}
            title="Assign to folder"
          >
            {movingFolder ? (
              <SpinnerIcon className="w-3.5 h-3.5 animate-spin" />
            ) : (
              <FolderIcon className="w-3.5 h-3.5" />
            )}
            <span>{currentFolderName || 'Add to folder'}</span>
          </button>

          {showFolderPicker && (
            <div className="absolute left-0 top-full mt-1 z-50 bg-surface border border-border/60 rounded-xl shadow-xl overflow-hidden min-w-[180px]">
              {folders.length === 0 ? (
                <p className="text-muted text-xs font-semibold px-4 py-3">No folders yet</p>
              ) : (
                <ul>
                  {folders.map((f) => (
                    <li key={f.id}>
                      <button
                        onClick={() => handleFolderSelect(f)}
                        className="w-full text-left px-4 py-2.5 text-sm font-semibold text-white hover:bg-white/10 transition-colors flex items-center gap-2"
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
                  <div className="border-t border-border/40" />
                  <button
                    onClick={() => handleFolderSelect(null)}
                    className="w-full text-left px-4 py-2.5 text-sm font-semibold text-muted hover:text-danger hover:bg-danger/10 transition-colors"
                  >
                    Remove from folder
                  </button>
                </>
              )}
            </div>
          )}
        </div>

        {/* Action buttons */}
        <div className="flex gap-3">
          {actions.map(({ label, Icon, path }) => (
            <button
              key={label}
              onClick={() => navigate(path)}
              className="btn-chunky w-14 h-14 rounded-2xl bg-primary hover:bg-primary-dark flex items-center justify-center transition-colors"
              style={{ boxShadow: '0px 4px 0px #D4A800' }}
              title={label}
            >
              <Icon className="w-6 h-6 text-[#1C1733]" />
            </button>
          ))}
        </div>
      </div>
    </Card>
  );
}
