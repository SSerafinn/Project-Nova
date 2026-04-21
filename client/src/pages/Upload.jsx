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
        // Keep suggestions up to date
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

        {/* Tabs */}
        <div className="flex gap-2 bg-white/5 rounded-2xl p-1 border border-border/30">
          {[
            { id: 'pdf', label: 'Upload PDF', Icon: UploadIcon },
            { id: 'text', label: 'Paste Text', Icon: DocumentTextIcon },
          ].map((t) => (
            <button
              key={t.id}
              type="button"
              onClick={() => setTab(t.id)}
              className={`flex-1 flex items-center justify-center gap-2 py-2.5 rounded-xl font-bold text-sm transition-all ${
                tab === t.id
                  ? 'bg-surface border border-border/40 text-white'
                  : 'text-muted hover:text-white'
              }`}
            >
              <t.Icon className="w-4 h-4" />
              {t.label}
            </button>
          ))}
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
  );
}
