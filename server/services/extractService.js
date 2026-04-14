/**
 * Extract plain text from various input sources.
 * pdf-parse is imported lazily inside the function to avoid its test-file
 * lookup behavior that fires on module initialisation in some environments.
 */

async function extractFromPDF(buffer) {
  // Lazy import to avoid pdf-parse's eager test-file resolution
  const pdfParse = require('pdf-parse');
  const data = await pdfParse(buffer);
  return data.text.trim();
}

function extractFromText(text) {
  return text.trim();
}

module.exports = { extractFromPDF, extractFromText };
