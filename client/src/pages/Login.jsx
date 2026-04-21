import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { SparklesIcon } from '../components/Icons';

export default function Login() {
  const navigate = useNavigate();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [isLoading, setIsLoading] = useState(false);

  const handleLogin = (e) => {
    e.preventDefault();
    setIsLoading(true);
    // Simulate login delay to look realistic in a demo
    setTimeout(() => {
      setIsLoading(false);
      navigate('/'); // redirect to the main notes dashboard
    }, 1200);
  };

  return (
    <div className="min-h-[calc(100vh-4rem)] flex items-center justify-center p-4">
      <div className="w-full max-w-5xl flex flex-col md:flex-row bg-surface/80 backdrop-blur-md rounded-3xl border border-border/50 shadow-card overflow-hidden animate-fadeInUp">
        
        {/* Left Side: Branding and Hero Graphic */}
        <div className="md:w-1/2 p-10 md:p-14 relative overflow-hidden flex flex-col justify-between shimmer-top">
          {/* Clean dark overlay to mute the background while letting stars show through */}
          <div className="absolute inset-0 bg-surface/40 z-0"></div>

          <div className="relative z-10 flex-1 flex flex-col">
            <div className="flex items-center gap-2 mb-12">
              <span className="text-primary font-bold text-lg">✦</span>
              <span className="text-3xl font-black tracking-[0.2em] text-white" style={{ textShadow: '0 0 20px rgba(233,185,73,0.4)' }}>
                NOVA
              </span>
            </div>

            <div className="mt-auto md:mb-12">
              <h1 className="text-4xl md:text-5xl font-black text-white leading-tight mb-4">
                Your ultimate <br/><span className="text-transparent bg-clip-text bg-gradient-to-r from-primary to-accent">study companion</span>
              </h1>
              <p className="text-muted text-base font-medium max-w-sm">
                Unlock AI-powered summaries, smart flashcards, and quizzes that adapt to your exact pace.
              </p>
            </div>
            
            <div className="mt-12 flex items-center gap-4 text-sm font-semibold text-muted">
              {/* Mock users overlapping avatars */}
              <div className="flex -space-x-3">
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-primary/80 flex items-center justify-center text-[10px] text-white font-black z-20">10k+</div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-secondary/80 flex items-center justify-center text-[10px] text-white font-bold z-10">SJ</div>
                <div className="w-8 h-8 rounded-full border-2 border-surface bg-accent/80 flex items-center justify-center text-[10px] text-white font-bold">MK</div>
              </div>
              <span>Join thousands of students</span>
            </div>
          </div>
        </div>

        {/* Right Side: Login Form */}
        <div className="md:w-1/2 p-10 md:p-14 bg-bg/50 flex flex-col justify-center border-t md:border-t-0 md:border-l border-border/50 relative z-10">
          <div className="max-w-sm w-full mx-auto">
            <h2 className="text-2xl font-black text-white mb-2">Welcome back</h2>
            <p className="text-sm text-muted font-medium mb-8">Enter your details to access your notes.</p>

            <form onSubmit={handleLogin} className="space-y-5">
              <div>
                <label className="block text-xs font-bold text-muted uppercase tracking-wider mb-2">Email Address</label>
                <input 
                  type="email" 
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium text-sm"
                  placeholder="paula@spup.edu.ph"
                  required
                />
              </div>

              <div>
                <div className="flex items-center justify-between mb-2">
                  <label className="block text-xs font-bold text-muted uppercase tracking-wider">Password</label>
                  <a href="#" className="flex items-center gap-1 text-xs font-bold text-primary hover:text-primary-light transition-colors">
                    Forgot?
                  </a>
                </div>
                <input 
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  className="w-full bg-white/5 border border-border/50 rounded-xl px-4 py-3.5 text-white placeholder:text-muted/50 focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary transition-colors font-medium text-sm"
                  placeholder="••••••••••••"
                  required
                />
              </div>

              <button 
                type="submit" 
                disabled={isLoading}
                className="w-full btn-chunky py-3.5 mt-2 bg-primary text-[#1C1733] font-black text-sm rounded-xl shadow-card-primary hover:shadow-glow-primary transition-all disabled:opacity-70 flex justify-center items-center gap-2 group border border-transparent"
              >
                {isLoading ? (
                  <div className="w-5 h-5 border-2 border-[#1C1733]/30 border-t-[#1C1733] rounded-full animate-spin"></div>
                ) : (
                  <>
                    Sign In <SparklesIcon className="w-4 h-4 opacity-70 group-hover:opacity-100 group-hover:scale-110 transition-all" />
                  </>
                )}
              </button>
            </form>

            <div className="mt-8 pt-6 border-t border-border/50 text-center flex flex-col gap-4">
              <p className="text-xs text-muted font-medium uppercase tracking-wider">Or continue with</p>
              <div className="flex gap-3">
                <button type="button" className="flex-1 flex justify-center items-center py-2.5 rounded-xl border border-border/50 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                   <svg className="w-4 h-4" viewBox="0 0 24 24"><path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/><path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/><path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/><path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/></svg>
                </button>
                <button type="button" className="flex-1 flex justify-center items-center py-2.5 rounded-xl border border-border/50 bg-white/5 hover:bg-white/10 hover:border-white/20 transition-all active:scale-95">
                  <svg className="w-4 h-4 fill-white" viewBox="0 0 24 24"><path d="M16.36 10.87c.02 2.37 2.05 3.16 2.08 3.17-.02.05-.33 1.11-1.07 2.18-.65.95-1.34 1.9-2.4 1.92-1.04.01-1.39-.62-2.58-.62-1.2 0-1.58.6-2.55.65-1.01.03-1.81-1.05-2.45-1.98-1.32-1.9-2.34-5.36-1.66-7.72.33-1.13 1.25-1.87 2.45-1.89 1.01-.01 1.97.68 2.6.68.62 0 1.76-.84 2.94-.72.49.02 1.9.19 2.79 1.49-.07.05-1.66.97-1.63 2.84zm-2-7.58c.55-.66.92-1.58.82-2.5-.79.03-1.74.52-2.3 1.18-.5.58-.93 1.52-.8 2.43.83.06 1.73-.45 2.28-1.11z" /></svg>
                </button>
              </div>
            </div>

            <p className="mt-8 text-center text-xs text-muted font-medium">
              Don't have an account? <a href="#" className="font-bold text-white hover:text-primary transition-colors">Sign up today</a>
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
