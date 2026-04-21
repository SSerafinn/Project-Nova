import React from 'react';
import { Routes, Route } from 'react-router-dom';
import Navbar from './components/Navbar';
import Home from './pages/Home';
import Upload from './pages/Upload';
import Summary from './pages/Summary';
import Flashcards from './pages/Flashcards';
import Quiz from './pages/Quiz';
import FolderView from './pages/FolderView';
import FolderQuiz from './pages/FolderQuiz';
import Profile from './pages/Profile';

export default function App() {
  return (
    <>
      <Navbar />
      <main className="min-h-screen bg-bg pt-16">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/upload" element={<Upload />} />
          <Route path="/notes/:id/summary" element={<Summary />} />
          <Route path="/notes/:id/flashcards" element={<Flashcards />} />
          <Route path="/notes/:id/quiz" element={<Quiz />} />
          <Route path="/folders/:id" element={<FolderView />} />
          <Route path="/folders/:id/quiz" element={<FolderQuiz />} />
          <Route path="/profile" element={<Profile />} />
        </Routes>
      </main>
    </>
  );
}
