const express = require('express');
const router = express.Router();
const { db, runTransaction } = require('../db/database');
const { generateSummary, generateFlashcards, generateQuiz } = require('../services/aiService');

// GET /api/notes — list all sessions
router.get('/', (req, res) => {
  try {
    const sessions = db.prepare(`
      SELECT
        s.id, s.title, s.source, s.created_at,
        COUNT(DISTINCT f.id) AS flashcard_count,
        COUNT(DISTINCT q.id) AS quiz_count
      FROM sessions s
      LEFT JOIN flashcards f ON f.session_id = s.id
      LEFT JOIN quiz_items q ON q.session_id = s.id
      GROUP BY s.id
      ORDER BY s.created_at DESC
    `).all();
    res.json(sessions);
  } catch (err) {
    console.error('GET /notes error:', err);
    res.status(500).json({ error: 'Failed to fetch notes.' });
  }
});

// GET /api/notes/:id — get full session with summary, flashcards, quiz
router.get('/:id', (req, res) => {
  try {
    const session = db.prepare(
      'SELECT id, title, source, created_at FROM sessions WHERE id = ?'
    ).get(req.params.id);

    if (!session) {
      return res.status(404).json({ error: 'Session not found.' });
    }

    const note = db.prepare('SELECT raw_text FROM notes WHERE session_id = ?').get(req.params.id);
    const summaryRow = db.prepare('SELECT id, content FROM summaries WHERE session_id = ?').get(req.params.id);
    const flashcards = db.prepare(
      'SELECT id, term, definition FROM flashcards WHERE session_id = ? ORDER BY id'
    ).all(req.params.id);
    const quizItems = db.prepare(
      'SELECT id, question, choices, answer FROM quiz_items WHERE session_id = ? ORDER BY id'
    ).all(req.params.id);

    const summary = summaryRow
      ? { ...summaryRow, content: JSON.parse(summaryRow.content) }
      : null;

    const quiz = quizItems.map(q => ({ ...q, choices: JSON.parse(q.choices) }));

    res.json({
      ...session,
      raw_text: note ? note.raw_text : null,
      summary,
      flashcards,
      quiz,
    });
  } catch (err) {
    console.error('GET /notes/:id error:', err);
    res.status(500).json({ error: 'Failed to fetch session.' });
  }
});

// DELETE /api/notes/:id
router.delete('/:id', (req, res) => {
  try {
    const result = db.prepare('DELETE FROM sessions WHERE id = ?').run(req.params.id);
    if (result.changes === 0) {
      return res.status(404).json({ error: 'Session not found.' });
    }
    res.json({ success: true });
  } catch (err) {
    console.error('DELETE /notes/:id error:', err);
    res.status(500).json({ error: 'Failed to delete session.' });
  }
});

// POST /api/notes — save note and trigger full AI generation
router.post('/', async (req, res) => {
  const { title, text, source } = req.body;

  if (!title || !title.trim()) {
    return res.status(400).json({ error: 'Title is required.' });
  }
  if (!text || !text.trim()) {
    return res.status(400).json({ error: 'Note text is required.' });
  }
  if (!['text', 'pdf'].includes(source)) {
    return res.status(400).json({ error: 'Source must be "text" or "pdf".' });
  }

  try {
    // Run all three AI calls in parallel before touching the DB
    const [summaryData, flashcardsData, quizData] = await Promise.all([
      generateSummary(text),
      generateFlashcards(text),
      generateQuiz(text),
    ]);

    // Wrap all DB writes in a transaction for atomicity
    const sessionId = runTransaction(() => {
      const sessionResult = db.prepare(
        'INSERT INTO sessions (title, source) VALUES (?, ?)'
      ).run([title.trim(), source]);
      const sid = Number(sessionResult.lastInsertRowid);

      db.prepare('INSERT INTO notes (session_id, raw_text) VALUES (?, ?)').run([sid, text]);

      db.prepare('INSERT INTO summaries (session_id, content) VALUES (?, ?)').run(
        [sid, JSON.stringify(summaryData)]
      );

      const insertFlashcard = db.prepare(
        'INSERT INTO flashcards (session_id, term, definition) VALUES (?, ?, ?)'
      );
      for (const card of flashcardsData.flashcards || []) {
        insertFlashcard.run([sid, card.term, card.definition]);
      }

      const insertQuizItem = db.prepare(
        'INSERT INTO quiz_items (session_id, question, choices, answer) VALUES (?, ?, ?, ?)'
      );
      for (const q of quizData.questions || []) {
        insertQuizItem.run([sid, q.question, JSON.stringify(q.choices), q.answer]);
      }

      return sid;
    });

    // Fetch and return the complete session
    const session = db.prepare(
      'SELECT id, title, source, created_at FROM sessions WHERE id = ?'
    ).get(sessionId);

    const flashcards = db.prepare(
      'SELECT id, term, definition FROM flashcards WHERE session_id = ? ORDER BY id'
    ).all(sessionId);

    const quizItems = db.prepare(
      'SELECT id, question, choices, answer FROM quiz_items WHERE session_id = ? ORDER BY id'
    ).all(sessionId).map(q => ({ ...q, choices: JSON.parse(q.choices) }));

    const summaryRow = db.prepare('SELECT id, content FROM summaries WHERE session_id = ?').get(sessionId);
    const summary = summaryRow
      ? { ...summaryRow, content: JSON.parse(summaryRow.content) }
      : null;

    res.status(201).json({ ...session, summary, flashcards, quiz: quizItems });
  } catch (err) {
    console.error('POST /notes error:', err);
    res.status(500).json({ error: err.message || 'Failed to create session.' });
  }
});

module.exports = router;
