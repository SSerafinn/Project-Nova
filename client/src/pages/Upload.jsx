import React, { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import UploadZone from '../components/UploadZone';
import Button from '../components/ui/Button';
import { uploadFile, saveNote, getFolders, findOrCreateFolder } from '../services/api';
import { AcademicCapIcon, DocumentTextIcon, UploadIcon } from '../components/Icons';

const LOADING_MESSAGES = [
  'Reading your notes...',
  'Finding key concepts...',
  'Building your flashcards...',
  'Creating quiz questions...',
  'Almost ready!',
];

function MicIcon({ className = 'w-5 h-5' }) {
  return (
    <svg className={className} fill="none" viewBox="0 0 24 24" strokeWidth={1.75} stroke="currentColor">
      <path strokeLinecap="round" strokeLinejoin="round" d="M12 18.75a6 6 0 006-6v-1.5m-6 7.5a6 6 0 01-6-6v-1.5m6 7.5v3.75m-3.75 0h7.5M12 15.75a3 3 0 01-3-3V4.5a3 3 0 116 0v8.25a3 3 0 01-3 3z" />
    </svg>
  );
}

function WIPModal({ onClose }) {
  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center px-4"
      style={{ background: 'rgba(28,23,51,0.85)', backdropFilter: 'blur(6px)' }}
      onClick={onClose}
    >
      <div
        className="bg-surface border border-border/60 rounded-3xl shadow-2xl p-8 max-w-sm w-full flex flex-col items-center gap-5 text-center"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Animated mic icon */}
        <div className="relative">
          <div className="w-20 h-20 rounded-full bg-secondary/20 flex items-center justify-center">
            <MicIcon className="w-9 h-9 text-secondary" />
          </div>
          <span className="absolute -top-1 -right-1 w-5 h-5 rounded-full bg-primary flex items-center justify-center text-[#1C1733] font-black text-xs">!</span>
        </div>

        <div>
          <h2 className="text-xl font-black text-white mb-1">Coming Soon</h2>
          <p className="text-muted font-semibold text-sm leading-relaxed">
            Recording upload is currently in development. Soon you'll be able to record lectures or voice notes and let NOVA transcribe and study them for you.
          </p>
        </div>

        <div className="flex flex-col gap-2 w-full">
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 text-left">
            <span className="text-lg">🎙️</span>
            <div>
              <p className="text-white font-bold text-sm">Audio Transcription</p>
              <p className="text-muted text-xs">Convert recordings to notes automatically</p>
            </div>
          </div>
          <div className="flex items-center gap-3 bg-white/5 rounded-2xl px-4 py-3 text-left">
            <span className="text-lg">📝</span>
            <div>
              <p className="text-white font-bold text-sm">Auto Summarization</p>
              <p className="text-muted text-xs">AI summaries from your lecture recordings</p>
            </div>
          </div>
        </div>

        <button
          onClick={onClose}
          className="btn-chunky w-full py-3 rounded-2xl bg-primary text-[#1C1733] font-extrabold text-sm hover:bg-primary-dark transition-colors"
          style={{ boxShadow: '0px 4px 0px #D4A800' }}
        >
          Got it!
        </button>
      </div>
    </div>
  );
}

export default function Upload() {
  const navigate = useNavigate();
  const [tab, setTab] = useState('pdf');
  const [title, setTitle] = useState('');
  const [folderName, setFolderName] = useState('');
  const [folderSuggestions, setFolderSuggestions] = useState([]);
  const [pastedText, setPastedText] = useState('');
  const [pdfFile, setPdfFile] = useState(null);
  const [loadingMsg, setLoadingMsg] = useState(LOADING_MESSAGES[0]);
  const [status, setStatus] = useState('idle');
  const [error, setError] = useState(null);
  const [showWIP, setShowWIP] = useState(false);
  const msgIntervalRef = useRef(null);
  const msgIndexRef = useRef(0);

  useEffect(() => {
    getFolders()
      .then((res) => setFolderSuggestions(res.data.map((f) => f.name)))
      .catch(() => {});
    return () => clearInterval(msgIntervalRef.current);
  }, []);

  function startMessageCycle() {
    msgIndexRef.current = 0;
    setLoadingMsg(LOADING_MESSAGES[0]);
    msgIntervalRef.current = setInterval(() => {
      msgIndexRef.current = (msgIndexRef.current + 1) % LOADING_MESSAGES.length;
      setLoadingMsg(LOADING_MESSAGES[msgIndexRef.current]);
    }, 1800);
  }

  async function handleSubmit(e) {
    e.preventDefault();
    setError(null);

    if (!title.trim()) {
      setError('Please enter a title for your notes.');
      return;
    }

    let text = '';
    let source = 'text';

    if (tab === 'pdf') {
      if (!pdfFile) {
        setError('Please select a PDF file to upload.');
        return;
      }
      try {
        setStatus('generating');
        startMessageCycle();
        const formData = new FormData();
        formData.append('file', pdfFile);
        const uploadRes = await uploadFile(formData);
        text = uploadRes.data.text;
        source = 'pdf';
      } catch (err) {
        clearInterval(msgIntervalRef.current);
        setStatus('error');
        setError(err.response?.data?.error || 'Failed to extract text from PDF.');
        return;
      }
    } else {
      if (!pastedText.trim()) {
        setError('Please paste your notes in the text area.');
        return;
      }
      text = pastedText.trim();
      source = 'text';
      setStatus('generating');
      startMessageCycle();
    }

    try {
      let folder_id = null;
      if (folderName.trim()) {
        const folderRes = await findOrCreateFolder({ name: folderName.trim() });
        folder_id = folderRes.data.id;
        setFolderSuggestions((prev) =>
          prev.includes(folderName.trim()) ? prev : [...prev, folderName.trim()]
        );
      }
      const res = await saveNote({ title: title.trim(), text, source, folder_id });
      clearInterval(msgIntervalRef.current);
      navigate(`/notes/${res.data.id}/summary`);
    } catch (err) {
      clearInterval(msgIntervalRef.current);
      setStatus('error');
      setError(err.response?.data?.error || 'Failed to generate reviewer. Please try again.');
    }
  }

  if (status === 'generating') {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center gap-6 px-4">
        <div className="w-20 h-20 rounded-full bg-primary/20 flex items-center justify-center animate-bounce">
          <AcademicCapIcon className="w-10 h-10 text-primary" />
        </div>
        <h2 className="text-2xl font-extrabold text-white text-center">
          Generating your reviewer...
        </h2>
        <p className="text-muted font-semibold text-center animate-pulse text-lg">
          {loadingMsg}
        </p>
        <div className="w-64 h-3 bg-white/10 rounded-full overflow-hidden mt-2">
          <div
            className="h-full bg-primary rounded-full animate-pulse"
            style={{ width: '70%' }}
          />
        </div>
        <p className="text-xs text-muted mt-2">This may take 15–30 seconds</p>
      </div>
    );
  }

  return (
    <>
      {showWIP && <WIPModal onClose={() => setShowWIP(false)} />}

      <div className="max-w-2xl mx-auto px-4 py-10">
        <div className="mb-8">
          <button
            onClick={() => navigate('/')}
            className="text-muted hover:text-white font-semibold text-sm flex items-center gap-1 mb-4 transition-colors"
          >
            ← Back to Notes
          </button>
          <h1 className="text-3xl font-black text-white">Upload Notes</h1>
          <p className="text-muted mt-1">Add your study material and we'll create a full reviewer for you.</p>
        </div>

        {/* Source type cards */}
        <div className="grid grid-cols-3 gap-3 mb-6">
          {/* PDF */}
          <button
            type="button"
            onClick={() => setTab('pdf')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
              tab === 'pdf'
                ? 'border-primary bg-primary/10 text-white'
                : 'border-border/30 bg-white/5 text-muted hover:text-white hover:border-border/60'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tab === 'pdf' ? 'bg-primary/20' : 'bg-white/5'}`}>
              <UploadIcon className={`w-5 h-5 ${tab === 'pdf' ? 'text-primary' : 'text-muted'}`} />
            </div>
            <span>PDF</span>
          </button>

          {/* Text */}
          <button
            type="button"
            onClick={() => setTab('text')}
            className={`flex flex-col items-center gap-2 p-4 rounded-2xl border-2 font-bold text-sm transition-all ${
              tab === 'text'
                ? 'border-primary bg-primary/10 text-white'
                : 'border-border/30 bg-white/5 text-muted hover:text-white hover:border-border/60'
            }`}
          >
            <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${tab === 'text' ? 'bg-primary/20' : 'bg-white/5'}`}>
              <DocumentTextIcon className={`w-5 h-5 ${tab === 'text' ? 'text-primary' : 'text-muted'}`} />
            </div>
            <span>Text</span>
          </button>

          {/* Recording — WIP */}
          <button
            type="button"
            onClick={() => setShowWIP(true)}
            className="relative flex flex-col items-center gap-2 p-4 rounded-2xl border-2 border-dashed border-secondary/40 bg-secondary/5 text-muted hover:text-white hover:border-secondary/70 hover:bg-secondary/10 font-bold text-sm transition-all"
          >
            <div className="w-10 h-10 rounded-xl bg-secondary/10 flex items-center justify-center">
              <MicIcon className="w-5 h-5 text-secondary" />
            </div>
            <span>Recording</span>
            <span className="absolute top-2 right-2 text-[9px] font-black text-secondary bg-secondary/20 px-1.5 py-0.5 rounded-full leading-none">
              SOON
            </span>
          </button>
        </div>

        <form onSubmit={handleSubmit} className="flex flex-col gap-6">
          {/* Title */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-white/80">
              Note Title <span className="text-danger">*</span>
            </label>
            <input
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Chapter 3 — Cellular Respiration"
              className="w-full px-4 py-3 rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none font-semibold text-white transition-colors bg-surface placeholder:text-muted"
            />
          </div>

          {/* Folder */}
          <div className="flex flex-col gap-2">
            <label className="font-bold text-sm text-white/80">
              Folder <span className="text-muted font-normal">(optional)</span>
            </label>
            <input
              type="text"
              list="folder-suggestions"
              value={folderName}
              onChange={(e) => setFolderName(e.target.value)}
              placeholder="e.g. Biology, Math 101..."
              className="w-full px-4 py-3 rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none font-semibold text-white transition-colors bg-surface placeholder:text-muted"
            />
            <datalist id="folder-suggestions">
              {folderSuggestions.map((name) => (
                <option key={name} value={name} />
              ))}
            </datalist>
            <p className="text-xs text-muted">Type an existing folder name or create a new one.</p>
          </div>

          {/* Tab content */}
          {tab === 'pdf' ? (
            <UploadZone onFileAccepted={(file) => setPdfFile(file)} />
          ) : (
            <div className="flex flex-col gap-2">
              <label className="font-bold text-sm text-white/80">Your Notes</label>
              <textarea
                value={pastedText}
                onChange={(e) => setPastedText(e.target.value)}
                placeholder="Paste your notes here... the more detailed, the better the reviewer!"
                rows={12}
                className="w-full px-4 py-3 rounded-2xl border-2 border-border/50 focus:border-primary focus:outline-none font-body text-white resize-y transition-colors bg-surface leading-relaxed placeholder:text-muted"
              />
              <p className="text-xs text-muted">{pastedText.length} characters</p>
            </div>
          )}

          {/* Error */}
          {error && (
            <div className="bg-danger/10 border border-danger/30 rounded-2xl px-5 py-3 text-danger font-semibold text-sm">
              {error}
            </div>
          )}

          {/* Submit */}
          <Button type="submit" variant="primary" size="lg" className="w-full">
            Generate My Reviewer
          </Button>
        </form>
      </div>
    </>
  );
}
