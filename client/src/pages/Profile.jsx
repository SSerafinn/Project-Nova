import { useNavigate } from 'react-router-dom';
import { TrophyIcon, StarIcon, FireIcon, BookOpenIcon, LayersIcon, QuestionMarkCircleIcon, AcademicCapIcon, SparklesIcon } from '../components/Icons';

const MOCK_USER = {
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  school: 'State University',
  major: 'Computer Science',
  joined: 'September 2024',
  avatar: 'AR',
};

const MOCK_STATS = [
  { label: 'Notes Created', value: 24, Icon: BookOpenIcon, color: 'text-primary', bg: 'bg-primary/20', border: 'border-primary/30', glow: 'hover:shadow-glow-primary' },
  { label: 'Flashcards', value: 312, Icon: LayersIcon, color: 'text-secondary', bg: 'bg-secondary/20', border: 'border-secondary/30', glow: 'hover:shadow-glow-secondary' },
  { label: 'Quizzes Taken', value: 47, Icon: QuestionMarkCircleIcon, color: 'text-accent', bg: 'bg-accent/20', border: 'border-accent/30', glow: 'hover:shadow-[0_0_20px_rgba(224,123,48,0.35)]' },
  { label: 'Study Streak', value: '14 days', Icon: FireIcon, color: 'text-danger', bg: 'bg-danger/20', border: 'border-danger/30', glow: 'hover:shadow-card-danger cursor-pointer' },
];

const ACHIEVEMENTS = [
  { id: 1, label: 'First Note', desc: 'Uploaded your first note', Icon: BookOpenIcon, unlocked: true },
  { id: 2, label: 'Card Shark', desc: 'Reviewed 100 flashcards', Icon: LayersIcon, unlocked: true },
  { id: 3, label: 'Quiz Ace', desc: 'Scored 100% on a quiz', Icon: TrophyIcon, unlocked: true },
  { id: 4, label: 'On Fire', desc: '7-day study streak', Icon: FireIcon, unlocked: true },
  { id: 5, label: 'Scholar', desc: 'Created 10 notes', Icon: AcademicCapIcon, unlocked: true },
  { id: 6, label: 'Star Student', desc: 'Earned 3 stars on 5 quizzes', Icon: StarIcon, unlocked: false },
  { id: 7, label: 'Perfectionist', desc: 'Score 100% three times in a row', Icon: TrophyIcon, unlocked: false },
  { id: 8, label: 'Marathon', desc: '30-day study streak', Icon: FireIcon, unlocked: false },
];

// Mock weekly heatmap — 0 (none) to 4 (heavy)
const HEATMAP_WEEKS = Array.from({ length: 15 }, (_, wi) =>
  Array.from({ length: 7 }, (_, di) => {
    const v = Math.random();
    if (wi < 4 || (wi === 4 && di < 3)) return 0;
    if (v > 0.75) return 4;
    if (v > 0.55) return 3;
    if (v > 0.35) return 2;
    if (v > 0.2) return 1;
    return 0;
  })
);

// New vibrant heatmap colors for a more premium look
const HEATMAP_COLOR = [
  'bg-white/5', 
  'bg-secondary/30', 
  'bg-secondary/60', 
  'bg-primary/80 shadow-[0_0_8px_rgba(233,185,73,0.6)]', 
  'bg-primary shadow-[0_0_12px_rgba(233,185,73,0.9)]'
];

const RECENT_ACTIVITY = [
  { action: 'Completed quiz', subject: 'Chapter 7 — Photosynthesis', score: '9/10', time: '2 hours ago', icon: TrophyIcon, color: 'text-primary', bg: 'bg-primary/20' },
  { action: 'Reviewed flashcards', subject: 'Data Structures & Algorithms', score: '24 cards', time: 'Yesterday', icon: LayersIcon, color: 'text-secondary', bg: 'bg-secondary/20' },
  { action: 'Uploaded note', subject: 'Organic Chemistry — Reactions', score: null, time: '2 days ago', icon: BookOpenIcon, color: 'text-accent', bg: 'bg-accent/20' },
  { action: 'Completed quiz', subject: 'World History 1900–1950', score: '7/10', time: '3 days ago', icon: TrophyIcon, color: 'text-primary', bg: 'bg-primary/20' },
  { action: 'Reviewed flashcards', subject: 'Spanish Vocabulary Set 3', score: '18 cards', time: '4 days ago', icon: LayersIcon, color: 'text-secondary', bg: 'bg-secondary/20' },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-5xl mx-auto px-4 py-8 space-y-6">

      {/* Profile Header w/ Cover Photo */}
      <div className="relative rounded-3xl overflow-hidden bg-surface border border-border/50 shadow-card animate-fadeInUp" style={{ animationDelay: '0.1s' }}>
        {/* Cover Photo Area */}
        <div className="h-32 sm:h-48 w-full relative overflow-hidden shimmer-top">
          {/* Clean overlay background */}
          <div className="absolute inset-0 bg-surface/50"></div>
        </div>

        {/* Profile Info */}
        <div className="px-6 pb-8 sm:px-10 flex flex-col sm:flex-row items-center sm:items-end gap-6 relative -mt-16 sm:-mt-20 z-10">
          {/* Avatar with glow and pulse */}
          <div className="relative group shrink-0">
            <div className="absolute inset-0 rounded-full bg-primary animate-novaPulse opacity-50 group-hover:opacity-100 transition-opacity"></div>
            <div
              className="relative w-32 h-32 rounded-full flex items-center justify-center font-black text-4xl text-[#1C1733] border-4 border-surface shadow-xl transition-transform hover:scale-105 duration-300"
              style={{ background: 'linear-gradient(135deg, #F5C518 0%, #C86A14 100%)' }}
            >
              {MOCK_USER.avatar}
            </div>
            {/* Sparkle badge */}
            <div className="absolute bottom-2 right-1 bg-surface rounded-full p-2 border-2 border-primary shadow-glow-primary z-20" title="Premium Member">
              <SparklesIcon className="w-5 h-5 text-primary" />
            </div>
          </div>

          <div className="flex-1 text-center sm:text-left sm:pb-2">
            <h1 className="text-3xl font-black text-white tracking-tight">{MOCK_USER.name}</h1>
            <p className="text-muted font-semibold text-sm mt-1">{MOCK_USER.email}</p>
            <div className="flex flex-wrap gap-2 mt-4 justify-center sm:justify-start">
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-secondary/20 text-secondary border border-secondary/30 backdrop-blur-sm">{MOCK_USER.school}</span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-primary/20 text-primary border border-primary/30 backdrop-blur-sm">{MOCK_USER.major}</span>
              <span className="text-xs font-bold px-3 py-1.5 rounded-full bg-white/5 text-muted border border-border/50 backdrop-blur-sm">Joined {MOCK_USER.joined}</span>
            </div>
          </div>

          <div className="shrink-0 w-full sm:w-auto sm:pb-2 mt-4 sm:mt-0">
            <button className="w-full sm:w-auto btn-chunky px-6 py-3 rounded-2xl bg-white/10 text-white font-bold hover:bg-white/15 transition-colors border border-border/40 hover:border-white/30 backdrop-blur-sm shadow-card-primary hover:shadow-glow-primary">
              Edit Profile
            </button>
          </div>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4 animate-fadeInUp" style={{ animationDelay: '0.2s' }}>
        {MOCK_STATS.map(({ label, value, Icon, color, bg, border, glow }, i) => (
          <div key={label} className={`bg-surface/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-card p-6 flex flex-col items-center gap-3 text-center transition-all duration-300 hover:-translate-y-1 hover:border-border cursor-pointer group ${glow}`}>
            <div className={`w-14 h-14 rounded-2xl ${bg} ${border} border flex items-center justify-center transition-transform duration-300 group-hover:scale-110 group-hover:rotate-3`}>
              <Icon className={`w-7 h-7 ${color}`} />
            </div>
            <div>
              <p className="text-3xl font-black text-white">{value}</p>
              <p className="text-sm text-muted font-semibold mt-1">{label}</p>
            </div>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">

        {/* Activity Heatmap */}
        <div className="lg:col-span-3 bg-surface/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-card p-6 lg:p-8 animate-fadeInUp flex flex-col" style={{ animationDelay: '0.3s' }}>
          <div className="flex justify-between items-end mb-6">
            <div>
              <h2 className="text-xl font-black text-white mb-1">Study Activity</h2>
              <p className="text-sm text-muted font-semibold">Consistency is key</p>
            </div>
            <div className="text-right">
              <span className="text-2xl font-black text-primary">34</span>
              <span className="text-sm text-muted font-bold ml-1.5">days active</span>
            </div>
          </div>
          
          <div className="flex-1 flex flex-col justify-center items-center lg:items-start w-full">
            <div className="flex gap-1.5 sm:gap-2 justify-start overflow-x-auto pb-4 scrollbar-hide w-full">
              {HEATMAP_WEEKS.map((week, wi) => (
                <div key={wi} className="flex flex-col gap-1.5 sm:gap-2 shrink-0">
                  {week.map((level, di) => (
                    <div
                      key={di}
                      className={`w-3.5 h-3.5 sm:w-4 sm:h-4 rounded-sm transition-all duration-300 hover:scale-150 cursor-crosshair ${HEATMAP_COLOR[level]}`}
                      title={level > 0 ? `${level * 2} sessions` : 'No activity'}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>
          
          <div className="flex items-center gap-2 mt-4 justify-end border-t border-border/40 pt-4 w-full">
            <span className="text-xs font-bold text-muted uppercase tracking-wider">Less</span>
            {HEATMAP_COLOR.map((c, i) => (
              <div key={i} className={`w-3.5 h-3.5 rounded-sm ${c}`} />
            ))}
            <span className="text-xs font-bold text-muted uppercase tracking-wider">More</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="lg:col-span-2 bg-surface/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-card p-6 lg:p-8 animate-fadeInUp" style={{ animationDelay: '0.4s' }}>
          <div className="flex justify-between items-center mb-6">
            <h2 className="text-xl font-black text-white">Recent Activity</h2>
            <button className="text-xs font-bold text-secondary hover:text-secondary-light transition-colors">View All</button>
          </div>
          <ul className="flex flex-col gap-4">
            {RECENT_ACTIVITY.map((item, i) => (
              <li key={i} className="flex items-start gap-4 p-3 -mx-3 rounded-2xl hover:bg-white/5 transition-colors cursor-pointer group">
                <div className={`w-10 h-10 rounded-xl ${item.bg} flex items-center justify-center shrink-0 border border-border/20 group-hover:scale-110 group-hover:-rotate-3 transition-transform`}>
                  <item.icon className={`w-5 h-5 ${item.color}`} />
                </div>
                <div className="flex-1 min-w-0 py-0.5">
                  <p className="text-sm font-bold text-white leading-snug truncate">
                    {item.action}
                  </p>
                  <p className="text-xs text-muted font-semibold truncate mt-0.5">{item.subject}</p>
                </div>
                <div className="text-right py-0.5 shrink-0">
                   {item.score ? (
                      <p className={`text-xs font-black ${item.color}`}>{item.score}</p>
                    ) : (
                      <p className="text-xs font-black text-transparent">--</p>
                    )}
                    <p className="text-[10px] text-muted font-medium mt-1">{item.time}</p>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-surface/80 backdrop-blur-md border border-border/50 rounded-3xl shadow-card p-6 lg:p-8 animate-fadeInUp" style={{ animationDelay: '0.5s' }}>
        <div className="flex justify-between items-end mb-6">
          <div>
            <h2 className="text-xl font-black text-white mb-1">Badges & Achievements</h2>
            <p className="text-sm text-muted font-semibold">Keep going to unlock them all!</p>
          </div>
          <div className="bg-white/10 px-4 py-2 rounded-xl text-center shadow-inner">
             <span className="text-xl font-black text-white">{ACHIEVEMENTS.filter(a => a.unlocked).length}</span>
             <span className="text-sm text-muted font-bold ml-1">/ {ACHIEVEMENTS.length}</span>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 sm:gap-6">
          {ACHIEVEMENTS.map(({ id, label, desc, Icon, unlocked }) => (
            <div
              key={id}
              className={`relative flex flex-col items-center gap-3 p-5 rounded-3xl border text-center transition-all duration-300 group cursor-pointer ${
                unlocked
                  ? 'bg-gradient-to-b from-primary/10 to-transparent border-primary/30 hover:border-primary/60 hover:-translate-y-1 hover:shadow-glow-primary'
                  : 'bg-white/3 border-border/30 opacity-60 grayscale hover:opacity-100 hover:grayscale-0'
              }`}
            >
              {unlocked && (
                <div className="absolute top-3 right-3">
                  <div className="w-2 h-2 rounded-full bg-primary animate-pulse shadow-glow-primary"></div>
                </div>
              )}
              <div className={`w-14 h-14 rounded-2xl flex items-center justify-center transition-transform duration-300 ${
                unlocked ? 'bg-primary/20 shadow-inner group-hover:scale-110' : 'bg-white/10 group-hover:bg-white/20'
              }`}>
                <Icon className={`w-7 h-7 ${unlocked ? 'text-primary drop-shadow-[0_0_8px_rgba(233,185,73,0.8)]' : 'text-muted'}`} />
              </div>
              <div className="space-y-1">
                <p className="text-sm font-black text-white">{label}</p>
                <p className="text-xs text-muted font-medium line-clamp-2">{desc}</p>
              </div>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
