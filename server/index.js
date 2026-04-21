const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '../.env') }); // Must be first

const express = require('express');
const cors = require('cors');

// Trigger DB initialization (creates notequest.db and runs schema if needed)
require('./db/database');

const app = express();

// In production (Railway), the frontend is served from the same origin,
// so CORS is only needed in local dev. Keep it permissive for local dev.
const allowedOrigins = process.env.CLIENT_URL
  ? [process.env.CLIENT_URL, 'http://localhost:5173']
  : '*';
app.use(cors({ origin: allowedOrigins }));
app.use(express.json({ limit: '2mb' }));
app.use(express.urlencoded({ extended: true }));

// API Routes
app.use('/api/folders', require('./routes/folders'));
app.use('/api/notes', require('./routes/notes'));
app.use('/api/upload', require('./routes/upload'));
app.use('/api/generate', require('./routes/generate'));

// Health check
app.get('/api/health', (_req, res) => res.json({ status: 'ok' }));

// Serve built React frontend in production
const clientDist = path.join(__dirname, '../client/dist');
app.use(express.static(clientDist));
// React Router: all non-API routes return index.html
app.get('*', (_req, res) => {
  res.sendFile(path.join(clientDist, 'index.html'));
});

// Central error handler
app.use((err, _req, res, _next) => {
  console.error('Unhandled error:', err);
  res.status(500).json({ error: err.message || 'Internal server error.' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Nova server running on http://localhost:${PORT}`);
});
