import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50" style={{ background: 'rgba(12,11,28,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
      {/* Gradient border bottom */}
      <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(123,108,245,0.5) 30%, rgba(233,185,73,0.5) 70%, transparent 100%)' }} />

      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline group">
          <span className="text-primary font-bold text-xs opacity-60 group-hover:opacity-100 transition-opacity">✦</span>
          <span
            className="text-xl font-bold tracking-[0.2em] text-white"
            style={{ textShadow: '0 0 20px rgba(233,185,73,0.4)' }}
          >
            NOVA
          </span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-1">
          <Link
            to="/"
            className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all no-underline ${
              isActive('/')
                ? 'text-white'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            My Notes
            {isActive('/') && (
              <span className="absolute bottom-0.5 left-3 right-3 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #E9B949, transparent)' }} />
            )}
          </Link>
          <Link
            to="/upload"
            className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all no-underline ${
              isActive('/upload')
                ? 'text-white'
                : 'text-muted hover:text-white hover:bg-white/5'
            }`}
          >
            Upload
            {isActive('/upload') && (
              <span className="absolute bottom-0.5 left-3 right-3 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #E9B949, transparent)' }} />
            )}
          </Link>

          {/* Profile avatar */}
          <Link
            to="/profile"
            className={`w-9 h-9 rounded-full flex items-center justify-center font-bold text-sm transition-all no-underline ml-2 ${
              isActive('/profile')
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg'
                : 'hover:ring-2 hover:ring-white/20 hover:ring-offset-1 hover:ring-offset-bg'
            }`}
            style={{ background: 'linear-gradient(135deg, #E9B949 0%, #E07B30 100%)' }}
            title="Profile"
          >
            <span className="text-[#0C0B1C] font-bold text-xs">AR</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}

