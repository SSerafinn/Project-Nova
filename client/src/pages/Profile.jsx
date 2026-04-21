import { useNavigate } from 'react-router-dom';
import { TrophyIcon, StarIcon, FireIcon, BookOpenIcon, LayersIcon, QuestionMarkCircleIcon, AcademicCapIcon } from '../components/Icons';

const MOCK_USER = {
  name: 'Alex Rivera',
  email: 'alex.rivera@university.edu',
  school: 'State University',
  major: 'Computer Science',
  joined: 'September 2024',
  avatar: 'AR',
};

const MOCK_STATS = [
  { label: 'Notes Created', value: 24, Icon: BookOpenIcon, color: 'text-primary', bg: 'bg-primary/15' },
  { label: 'Flashcards', value: 312, Icon: LayersIcon, color: 'text-secondary', bg: 'bg-secondary/15' },
  { label: 'Quizzes Taken', value: 47, Icon: QuestionMarkCircleIcon, color: 'text-accent', bg: 'bg-accent/15' },
  { label: 'Study Streak', value: '14 days', Icon: FireIcon, color: 'text-danger', bg: 'bg-danger/15' },
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

const HEATMAP_COLOR = ['bg-white/5', 'bg-secondary/30', 'bg-secondary/50', 'bg-secondary/75', 'bg-secondary'];

const RECENT_ACTIVITY = [
  { action: 'Completed quiz', subject: 'Chapter 7 — Photosynthesis', score: '9/10', time: '2 hours ago' },
  { action: 'Reviewed flashcards', subject: 'Data Structures & Algorithms', score: '24 cards', time: 'Yesterday' },
  { action: 'Uploaded note', subject: 'Organic Chemistry — Reactions', score: null, time: '2 days ago' },
  { action: 'Completed quiz', subject: 'World History 1900–1950', score: '7/10', time: '3 days ago' },
  { action: 'Reviewed flashcards', subject: 'Spanish Vocabulary Set 3', score: '18 cards', time: '4 days ago' },
];

export default function Profile() {
  const navigate = useNavigate();

  return (
    <div className="max-w-4xl mx-auto px-4 py-10">

      {/* Profile Header */}
      <div className="bg-surface border border-border/50 rounded-3xl shadow-card p-8 mb-6 flex flex-col sm:flex-row items-center sm:items-start gap-6">
        {/* Avatar */}
        <div
          className="w-24 h-24 rounded-full flex items-center justify-center font-black text-2xl text-[#1C1733] shrink-0"
          style={{ background: 'linear-gradient(135deg, #F5C518 0%, #C86A14 100%)', boxShadow: '0 0 30px rgba(245,197,24,0.35)' }}
        >
          {MOCK_USER.avatar}
        </div>

        {/* Info */}
        <div className="flex-1 text-center sm:text-left">
          <h1 className="text-2xl font-black text-white">{MOCK_USER.name}</h1>
          <p className="text-muted font-semibold text-sm mt-0.5">{MOCK_USER.email}</p>
          <div className="flex flex-wrap gap-2 mt-3 justify-center sm:justify-start">
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-secondary/20 text-secondary">{MOCK_USER.school}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-primary/20 text-primary">{MOCK_USER.major}</span>
            <span className="text-xs font-bold px-3 py-1 rounded-full bg-white/10 text-muted">Joined {MOCK_USER.joined}</span>
          </div>
        </div>

        {/* Edit button (non-functional) */}
        <button
          className="btn-chunky px-5 py-2.5 rounded-xl bg-white/10 text-white font-bold text-sm hover:bg-white/15 transition-colors border border-border/40 shrink-0"
        >
          Edit Profile
        </button>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 mb-6">
        {MOCK_STATS.map(({ label, value, Icon, color, bg }) => (
          <div key={label} className="bg-surface border border-border/50 rounded-2xl shadow-card p-5 flex flex-col items-center gap-2 text-center">
            <div className={`w-10 h-10 rounded-xl ${bg} flex items-center justify-center`}>
              <Icon className={`w-5 h-5 ${color}`} />
            </div>
            <p className="text-2xl font-black text-white">{value}</p>
            <p className="text-xs text-muted font-semibold">{label}</p>
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">

        {/* Activity Heatmap */}
        <div className="bg-surface border border-border/50 rounded-3xl shadow-card p-6">
          <h2 className="text-base font-black text-white mb-1">Study Activity</h2>
          <p className="text-xs text-muted font-semibold mb-4">Last 15 weeks</p>
          <div className="flex gap-1">
            {HEATMAP_WEEKS.map((week, wi) => (
              <div key={wi} className="flex flex-col gap-1">
                {week.map((level, di) => (
                  <div
                    key={di}
                    className={`w-3 h-3 rounded-sm ${HEATMAP_COLOR[level]}`}
                    title={level > 0 ? `${level * 2} sessions` : 'No activity'}
                  />
                ))}
              </div>
            ))}
          </div>
          <div className="flex items-center gap-1.5 mt-3 justify-end">
            <span className="text-xs text-muted">Less</span>
            {HEATMAP_COLOR.map((c, i) => (
              <div key={i} className={`w-3 h-3 rounded-sm ${c}`} />
            ))}
            <span className="text-xs text-muted">More</span>
          </div>
        </div>

        {/* Recent Activity */}
        <div className="bg-surface border border-border/50 rounded-3xl shadow-card p-6">
          <h2 className="text-base font-black text-white mb-4">Recent Activity</h2>
          <ul className="flex flex-col gap-3">
            {RECENT_ACTIVITY.map((item, i) => (
              <li key={i} className="flex items-start gap-3">
                <div className="w-1.5 h-1.5 rounded-full bg-primary mt-2 shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-bold text-white leading-snug">
                    {item.action} — <span className="text-muted font-semibold">{item.subject}</span>
                  </p>
                  <div className="flex items-center gap-2 mt-0.5">
                    {item.score && (
                      <span className="text-xs font-bold text-primary">{item.score}</span>
                    )}
                    <span className="text-xs text-muted">{item.time}</span>
                  </div>
                </div>
              </li>
            ))}
          </ul>
        </div>
      </div>

      {/* Achievements */}
      <div className="bg-surface border border-border/50 rounded-3xl shadow-card p-6">
        <h2 className="text-base font-black text-white mb-1">Achievements</h2>
        <p className="text-xs text-muted font-semibold mb-5">{ACHIEVEMENTS.filter(a => a.unlocked).length} / {ACHIEVEMENTS.length} unlocked</p>
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
          {ACHIEVEMENTS.map(({ id, label, desc, Icon, unlocked }) => (
            <div
              key={id}
              className={`flex flex-col items-center gap-2 p-4 rounded-2xl border text-center transition-all ${
                unlocked
                  ? 'bg-primary/10 border-primary/30'
                  : 'bg-white/3 border-border/20 opacity-40 grayscale'
              }`}
            >
              <div className={`w-10 h-10 rounded-xl flex items-center justify-center ${unlocked ? 'bg-primary/20' : 'bg-white/10'}`}>
                <Icon className={`w-5 h-5 ${unlocked ? 'text-primary' : 'text-muted'}`} />
              </div>
              <p className="text-xs font-black text-white leading-tight">{label}</p>
              <p className="text-[10px] text-muted leading-tight">{desc}</p>
            </div>
          ))}
        </div>
      </div>

    </div>
  );
}
