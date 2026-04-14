const express = require('express');
const router = express.Router();
const upload = require('../middleware/upload');
const { extractFromPDF, extractFromText } = require('../services/extractService');

router.post('/', upload.single('file'), async (req, res) => {
  try {
    if (!req.file) {
      return res.status(400).json({ error: 'No file uploaded.' });
    }

    let text;
    let source;

    if (req.file.mimetype === 'application/pdf') {
      text = await extractFromPDF(req.file.buffer);
      source = 'pdf';
    } else {
      text = extractFromText(req.file.buffer.toString('utf-8'));
      source = 'text';
    }

    if (!text || text.length === 0) {
      return res.status(422).json({ error: 'Could not extract any text from the file.' });
    }

    res.json({ text, source });
  } catch (err) {
    console.error('Upload error:', err);
    res.status(500).json({ error: err.message || 'Failed to process file.' });
  }
});

module.exports = router;
