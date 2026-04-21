const OpenAI = require('openai');

const client = new OpenAI({ apiKey: process.env.OPENAI_API_KEY });

const MIN_TEXT_LENGTH = 50;

async function callAI(prompt) {
  const response = await client.chat.completions.create({
    model: 'gpt-4o-mini',
    messages: [{ role: 'user', content: prompt }],
    response_format: { type: 'json_object' },
  });
  return JSON.parse(response.choices[0].message.content);
}

async function generateSummary(text) {
  if (text.length < MIN_TEXT_LENGTH) {
    throw new Error('Notes are too short to generate a summary. Please provide more content.');
  }

  const prompt = `You are a study assistant. Given the following student notes, generate a comprehensive, cohesive study guide as JSON. It should read like actual summarized prose notes that a student would write, organized by logical sections, rather than isolated bullet points.

Return a JSON object with this exact shape:
{
  "overview": "string (a short, overarching summary of the entire notes)",
  "sections": [
    {
      "heading": "string (logical section title)",
      "content": "string (detailed, cohesive paragraphs summarizing this section of the notes. Use complete sentences.)"
    }
  ]
}

Rules:
- Write in a clear, concise, prose style. Do not use isolated bullet points.
- Create 3 to 6 logical sections based on the notes.
- Ensure the content reads cohesively like a study guide.

Notes:
${text}`;

  return callAI(prompt);
}

async function generateFlashcards(text) {
  if (text.length < MIN_TEXT_LENGTH) {
    throw new Error('Notes are too short to generate flashcards. Please provide more content.');
  }

  const prompt = `You are a study assistant. Based on these student notes, create flashcards for review as JSON.

Return a JSON object with this exact shape:
{
  "flashcards": [
    { "term": "string", "definition": "string" }
  ]
}

Generate between 8 and 15 flashcards. Focus on key terms, concepts, and facts.

Notes:
${text}`;

  return callAI(prompt);
}

async function generateQuiz(text) {
  if (text.length < MIN_TEXT_LENGTH) {
    throw new Error('Notes are too short to generate a quiz. Please provide more content.');
  }

  const prompt = `You are a study assistant. Based on these student notes, create a multiple-choice quiz as JSON.

Return a JSON object with this exact shape:
{
  "questions": [
    {
      "question": "string",
      "choices": ["string", "string", "string", "string"],
      "answer": "string"
    }
  ]
}

Rules:
- Generate exactly 10 questions
- Each question has exactly 4 choices
- Vary difficulty: mix recall, comprehension, and application questions
- The answer must exactly match one of the 4 choices verbatim
- Do NOT number the questions

Notes:
${text}`;

  return callAI(prompt);
}

module.exports = { generateSummary, generateFlashcards, generateQuiz };
