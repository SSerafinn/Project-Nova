const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Must be first

const express = require('express');
const cors = require('cors');

// Trigger DB initialization (creates notequest.db and runs schema if needed)
require('./db/database');

const app = express();

app.use(cors({ origin: process.env.CLIENT_URL || 'http://localhost:5173' }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/api/folders', require('./routes/folders'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/generate', require('./routes/generate'));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Central error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`NoteQuest server running on http://localhost:${PORT}`);
});
