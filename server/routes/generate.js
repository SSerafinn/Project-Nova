const express = require('express');
const router = express.Router();
const { db, runTransaction } = require('../db/database');
const { generateSummary, generateFlashcards, generateQuiz } = require('../services/aiService');

function getRawText(sessionId) {
  const note = db.prepare('SELECT raw_text FROM notes WHERE session_id = ?').get(sessionId);
  if (!note) throw new Error('Session notes not found.');
  return note.raw_text;
}

// POST /api/generate/summary/:id
router.post('/summary/:id', async (req, res) => {
  try {
    const text = getRawText(req.params.id);
    const summaryData = await generateSummary(text);

    db.prepare('DELETE FROM summaries WHERE session_id = ?').run(req.params.id);
    db.prepare('INSERT INTO summaries (session_id, content) VALUES (?, ?)').run(
      [req.params.id, JSON.stringify(summaryData)]
    );

    res.json({ content: summaryData });
  } catch (err) {
    console.error('POST /generate/summary error:', err);
    res.status(500).json({ error: err.message || 'Failed to regenerate summary.' });
  }
});

// POST /api/generate/flashcards/:id
router.post('/flashcards/:id', async (req, res) => {
  try {
    const text = getRawText(req.params.id);
    const flashcardsData = await generateFlashcards(text);

    runTransaction(() => {
      db.prepare('DELETE FROM flashcards WHERE session_id = ?').run(req.params.id);
      const insert = db.prepare(
        'INSERT INTO flashcards (session_id, term, definition) VALUES (?, ?, ?)'
      );
      for (const card of flashcardsData.flashcards || []) {
        insert.run([req.params.id, card.term, card.definition]);
      }
    });

    const flashcards = db.prepare(
      'SELECT id, term, definition FROM flashcards WHERE session_id = ? ORDER BY id'
    ).all(req.params.id);

    res.json({ flashcards });
  } catch (err) {
    console.error('POST /generate/flashcards error:', err);
    res.status(500).json({ error: err.message || 'Failed to regenerate flashcards.' });
  }
});

// POST /api/generate/quiz/:id
router.post('/quiz/:id', async (req, res) => {
  try {
    const text = getRawText(req.params.id);
    const quizData = await generateQuiz(text);

    runTransaction(() => {
      db.prepare('DELETE FROM quiz_items WHERE session_id = ?').run(req.params.id);
      const insert = db.prepare(
        'INSERT INTO quiz_items (session_id, question, choices, answer) VALUES (?, ?, ?, ?)'
      );
      for (const q of quizData.questions || []) {
        insert.run([req.params.id, q.question, JSON.stringify(q.choices), q.answer]);
      }
    });

    const quiz = db.prepare(
      'SELECT id, question, choices, answer FROM quiz_items WHERE session_id = ? ORDER BY id'
    ).all(req.params.id).map(q => ({ ...q, choices: JSON.parse(q.choices) }));

    res.json({ quiz });
  } catch (err) {
    console.error('POST /generate/quiz error:', err);
    res.status(500).json({ error: err.message || 'Failed to regenerate quiz.' });
  }
});

module.exports = router;
