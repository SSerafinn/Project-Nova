import axios from 'axios';

const api = axios.create({ baseURL: '/api' });

// Sessions / Notes
export const getNotes = () => api.get('/notes');
export const getNoteById = (id) => api.get(`/notes/${id}`);
export const deleteNote = (id) => api.delete(`/notes/${id}`);
export const updateNoteFolder = (id, folder_id) => api.patch(`/notes/${id}/folder`, { folder_id });
export const saveNote = (data) => api.post('/notes', data);

// File upload → returns extracted text
export const uploadFile = (formData) =>
  api.post('/upload', formData, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });

// Re-generation
export const regenerateSummary = (id) => api.post(`/generate/summary/${id}`);
export const regenerateFlashcards = (id) => api.post(`/generate/flashcards/${id}`);
export const regenerateQuiz = (id) => api.post(`/generate/quiz/${id}`);

// Folders
export const getFolders = () => api.get('/folders');
export const createFolder = (data) => api.post('/folders', data);
export const findOrCreateFolder = (data) => api.post('/folders/find-or-create', data);
export const getFolderById = (id) => api.get(`/folders/${id}`);
export const getFolderQuiz = (id) => api.get(`/folders/${id}/quiz`);
export const deleteFolder = (id) => api.delete(`/folders/${id}`);

export default api;
