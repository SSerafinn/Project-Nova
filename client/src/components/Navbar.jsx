import { useState, useEffect } from 'react';
import { Link, useLocation } from 'react-router-dom';

export default function Navbar() {
  const location = useLocation();
  const [isOpen, setIsOpen] = useState(false);
  const isActive = (path) => location.pathname === path;

  const closeMenu = () => setIsOpen(false);

  // Lock scrolling when mobile menu is open
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => { document.body.style.overflow = 'unset'; };
  }, [isOpen]);

  return (
    <>
      <nav className="fixed top-0 left-0 right-0 z-50 transition-all duration-300" style={{ background: 'rgba(12,11,28,0.75)', backdropFilter: 'blur(16px)', borderBottom: '1px solid rgba(255,255,255,0.06)' }}>
        {/* Gradient border bottom */}
        <div className="absolute bottom-0 left-0 right-0 h-px" style={{ background: 'linear-gradient(90deg, transparent 0%, rgba(123,108,245,0.5) 30%, rgba(233,185,73,0.5) 70%, transparent 100%)' }} />

        <div className="max-w-5xl mx-auto px-4 h-16 flex items-center justify-between">
          {/* Logo */}
          <Link to="/" onClick={closeMenu} className="flex items-center no-underline hover:scale-105 transition-transform duration-300 z-50">
            <img src="/nova_logo.png" alt="NOVA Logo" className="h-7 w-auto drop-shadow-[0_0_10px_rgba(255,255,255,0.2)]" />
          </Link>

          {/* Desktop Nav */}
          <div className="hidden md:flex items-center gap-1">
            <Link
              to="/"
              className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all no-underline ${
                isActive('/') ? 'text-white' : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              My Notes
              {isActive('/') && <span className="absolute bottom-0.5 left-3 right-3 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #E9B949, transparent)' }} />}
            </Link>
            <Link
              to="/upload"
              className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all no-underline ${
                isActive('/upload') ? 'text-white' : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              Upload
              {isActive('/upload') && <span className="absolute bottom-0.5 left-3 right-3 h-px rounded-full" style={{ background: 'linear-gradient(90deg, transparent, #E9B949, transparent)' }} />}
            </Link>

            <Link
              to="/login"
              className={`relative px-4 py-2 rounded-xl font-semibold text-sm transition-all no-underline ${
                isActive('/login') ? 'text-primary' : 'text-muted hover:text-white hover:bg-white/5'
              }`}
            >
              Log In
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
              <span className="text-[#0C0B1C] font-bold text-xs">PP</span>
            </Link>
          </div>

          {/* Mobile hamburger toggle */}
          <button
            onClick={() => setIsOpen(!isOpen)}
            className="md:hidden flex flex-col justify-center items-center w-8 h-8 rounded-lg outline-none z-50 text-white hover:opacity-80 transition-opacity"
            aria-label="Toggle menu"
          >
            <span className={`bg-white block transition-all duration-300 ease-out h-[2px] w-5 rounded-full ${isOpen ? 'rotate-45 translate-y-[5px] bg-primary' : '-translate-y-1'}`} />
            <span className={`bg-white block transition-all duration-300 ease-out h-[2px] w-5 rounded-full mt-[3px] mb-[3px] ${isOpen ? 'opacity-0' : 'opacity-100'}`} />
            <span className={`bg-white block transition-all duration-300 ease-out h-[2px] w-5 rounded-full ${isOpen ? '-rotate-45 -translate-y-[5px] bg-primary' : 'translate-y-1'}`} />
          </button>
        </div>
      </nav>

      {/* Mobile Menu Overlay */}
      <div 
        className={`fixed inset-0 bg-bg/95 backdrop-blur-xl z-40 md:hidden flex flex-col items-center justify-center gap-8 transition-all duration-500 ease-in-out ${
          isOpen ? 'opacity-100 pointer-events-auto' : 'opacity-0 pointer-events-none'
        }`}
      >
        <Link
          to="/profile"
          onClick={closeMenu}
          className={`flex flex-col items-center gap-3 mb-4 transition-all duration-500 delay-100 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          <div className="w-16 h-16 rounded-full flex items-center justify-center font-black text-2xl shadow-glow-primary transition-transform active:scale-95" style={{ background: 'linear-gradient(135deg, #E9B949 0%, #E07B30 100%)' }}>
            <span className="text-[#0C0B1C]">PP</span>
          </div>
          <span className="text-white font-bold tracking-widest text-sm uppercase">Paula the Paulinian</span>
        </Link>

        <Link
          to="/"
          onClick={closeMenu}
          className={`text-3xl font-black tracking-widest transition-all duration-500 delay-150 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isActive('/') ? 'text-primary drop-shadow-[0_0_15px_rgba(233,185,73,0.5)]' : 'text-white active:text-primary'}`}
        >
          MY ORBITS
        </Link>
        <Link
          to="/upload"
          onClick={closeMenu}
          className={`text-3xl font-black tracking-widest transition-all duration-500 delay-200 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'} ${isActive('/upload') ? 'text-primary drop-shadow-[0_0_15px_rgba(233,185,73,0.5)]' : 'text-white active:text-primary'}`}
        >
          UPLOAD
        </Link>
        
        <Link
          to="/login"
          onClick={closeMenu}
          className={`btn-chunky bg-white/10 border border-white/20 text-white px-10 py-4 w-64 text-center rounded-2xl font-black tracking-widest text-lg hover:bg-white/20 active:bg-primary active:text-[#1C1733] transition-all mt-8 duration-500 delay-300 ${isOpen ? 'translate-y-0 opacity-100' : 'translate-y-8 opacity-0'}`}
        >
          LOG IN
        </Link>
      </div>
    </>
  );
}
