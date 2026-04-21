const express = require('express');
const router = express.Router();
const { db } = require('../db/database');

// GET /api/folders — list all folders with note count
router.get('/', (req, res) => {
  try {
    const folders = db.prepare(`
      SELECT f.id, f.name, f.created_at,
        COUNT(DISTINCT s.id) AS note_count
      FROM folders f
      LEFT JOIN sessions s ON s.folder_id = f.id
      GROUP BY f.id
      ORDER BY f.created_at DESC
    `).all();
    res.json(folders);
  } catch (err) {
    console.error('GET /folders error:', err);
    res.status(500).json({ error: 'Failed to fetch folders.' });
  }
});

// POST /api/folders — create a new folder
router.post('/', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Folder name is required.' });
  try {
    const result = db.prepare('INSERT INTO folders (name) VALUES (?)').run(name.trim());
    const folder = db.prepare('SELECT * FROM folders WHERE id = ?').get(result.lastInsertRowid);
    res.status(201).json(folder);
  } catch (err) {
    console.error('POST /folders error:', err);
    res.status(500).json({ error: 'Failed to create folder.' });
  }
});

// POST /api/folders/find-or-create — find by name or create
router.post('/find-or-create', (req, res) => {
  const { name } = req.body;
  if (!name?.trim()) return res.status(400).json({ error: 'Folder name is required.' });
  try {
    let folder = db.prepare('SELECT * FROM folders WHERE LOWER(name) = LOWER(?)').get(name.trim());
    if (!folder) {
      const result = db.prepare('INSERT INTO folders (name) VALUES (?)').run(name.trim());
      folder = db.prepare('SELECT * FROM folders WHERE id = ?').get(result.lastInsertRowid);
    }
    res.json(folder);
  } catch (err) {
    console.error('POST /folders/find-or-create error:', err);
    res.status(500).json({ error: 'Failed to find or create folder.' });
  }
});

// GET /api/folders/:id — get folder with its notes
router.get('/:id', (req, res) => {
  try {
    const folder = db.prepare('SELECT * FROM folders WHERE id = ?').get(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found.' });

    const sessions = db.prepare(`
      SELECT s.id, s.title, s.source, s.created_at,
        COUNT(DISTINCT f.id) AS flashcard_count,
        COUNT(DISTINCT q.id)  AS quiz_count
      FROM sessions s
      LEFT JOIN flashcards f ON f.session_id = s.id
      LEFT JOIN quiz_items q ON q.session_id = s.id
      WHERE s.folder_id = ?
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `).all(req.params.id);

    res.json({ ...folder, sessions });
  } catch (err) {
    console.error('GET /folders/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch folder.' });
  }
});

// GET /api/folders/:id/quiz — combined quiz from all notes in folder
router.get('/:id/quiz', (req, res) => {
  try {
    const folder = db.prepare('SELECT * FROM folders WHERE id = ?').get(req.params.id);
    if (!folder) return res.status(404).json({ error: 'Folder not found.' });

    const questions = db.prepare(`
      SELECT q.id, q.question, q.choices, q.answer, s.title AS session_title
      FROM quiz_items q
      JOIN sessions s ON s.id = q.session_id
      WHERE s.folder_id = ?
      ORDER BY RANDOM()
    `).all(req.params.id).map(q => ({ ...q, choices: JSON.parse(q.choices) }));

    res.json({ folder, questions });
  } catch (err) {
    console.error('GET /folders/:id/quiz error:', err);
    res.status(500).json({ error: 'Failed to fetch folder quiz.' });
  }
});

// DELETE /api/folders/:id — delete folder (notes become uncategorized)
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM folders WHERE id = ?').run(req.params.id);
    if (result.changes === 0) return res.status(404).json({ error: 'Folder not found.' });
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /folders/:id error:', err);
    res.status(500).json({ error: 'Failed to delete folder.' });
  }
});

module.exports = router;
