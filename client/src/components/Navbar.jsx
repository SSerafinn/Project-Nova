import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const isActive = (path) => location.pathname === path;

  return (
    <nav className="fixed top-0 left-0 right-0 z-50 bg-bg/90 backdrop-blur-md border-b border-border/30">
      <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2 no-underline">
          <span className="text-xl font-black text-primary tracking-widest">NOVA</span>
        </Link>

        {/* Nav links */}
        <div className="flex items-center gap-2">
          <Link
            to="/"
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors no-underline ${
              isActive('/')
                ? 'bg-primary/20 text-primary'
                : 'text-muted hover:text-white hover:bg-white/10'
            }`}
          >
            My Notes
          </Link>
          <Link
            to="/upload"
            className={`px-4 py-2 rounded-xl font-bold text-sm transition-colors no-underline ${
              isActive('/upload')
                ? 'bg-primary/20 text-primary'
                : 'text-muted hover:text-white hover:bg-white/10'
            }`}
          >
            + Upload
          </Link>

          {/* Profile avatar */}
          <Link
            to="/profile"
            className={`w-9 h-9 rounded-full flex items-center justify-center font-black text-sm transition-all no-underline ml-1 ${
              isActive('/profile')
                ? 'ring-2 ring-primary ring-offset-2 ring-offset-bg'
                : 'hover:ring-2 hover:ring-white/30 hover:ring-offset-1 hover:ring-offset-bg'
            }`}
            style={{ background: 'linear-gradient(135deg, #F5C518 0%, #C86A14 100%)' }}
            title="Profile"
          >
            <span className="text-[#1C1733]">AR</span>
          </Link>
        </div>
      </div>
    </nav>
  );
}
