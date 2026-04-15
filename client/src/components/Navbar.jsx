import React from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();

  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-surface border-b border-border shadow-sm">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-black text-primary tracking-tight">Project Nova</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors no-underline ${
              isActive('/')
                ? 'bg-primary-light text-primary-dark'
                : 'text-muted hover:text-[#3C3C3C] hover:bg-border'
            }`}
          >
            My Notes
          </Link>
          <Link
            to="/upload"
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors no-underline ${
              isActive('/upload')
                ? 'bg-primary-light text-primary-dark'
                : 'text-muted hover:text-[#3C3C3C] hover:bg-border'
            }`}
          >
            + Upload
          </Link>
        </div>
      </div>
    </nav>
  );
}
