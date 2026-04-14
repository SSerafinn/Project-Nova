# NoteQuest 🧠

AI-powered study tool that turns your notes into summaries, flashcards, and quizzes — Duolingo-style.

## Prerequisites

- Node.js 18+
- An OpenAI API key (`gpt-4o-mini`)

## Setup

### 1. Install all dependencies

```bash
npm run install:all
```

This installs root, client, and server dependencies in one command.

### 2. Configure environment

```bash
cp .env.example .env
```

Open `.env` and replace `your_openai_api_key_here` with your real OpenAI API key:

```env
OPENAI_API_KEY=sk-...
PORT=3001
CLIENT_URL=http://localhost:5173
```

### 3. Start the app

Open **two terminals**:

**Terminal 1 — Backend:**
```bash
npm run dev:server
```
Server starts at `http://localhost:3001`. SQLite database is created automatically on first run.

**Terminal 2 — Frontend:**
```bash
npm run dev:client
```
App is available at `http://localhost:5173`.

Or run both together:
```bash
npm run dev
```

---

## API Reference

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/api/notes` | List all sessions |
| `GET` | `/api/notes/:id` | Get full session (summary, flashcards, quiz) |
| `DELETE` | `/api/notes/:id` | Delete a session |
| `POST` | `/api/notes` | Create session + trigger AI generation |
| `POST` | `/api/upload` | Upload PDF, returns extracted text |
| `POST` | `/api/generate/summary/:id` | Regenerate summary |
| `POST` | `/api/generate/flashcards/:id` | Regenerate flashcards |
| `POST` | `/api/generate/quiz/:id` | Regenerate quiz |
| `GET` | `/api/health` | Server health check |

---

## Project Structure

```
notequest/
├── client/          React + Vite + Tailwind CSS frontend
├── server/          Express + SQLite + OpenAI backend
├── .env             Environment variables (not committed)
├── .env.example     Template for .env
└── package.json     Root workspace scripts
```

## Tech Stack

- **Frontend:** React 18, Vite, Tailwind CSS, React Router v6, Axios, react-dropzone, canvas-confetti
- **Backend:** Node.js, Express, better-sqlite3, Multer, pdf-parse
- **AI:** OpenAI API (gpt-4o-mini)
