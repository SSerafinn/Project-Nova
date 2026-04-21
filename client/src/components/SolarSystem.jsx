import React from 'react';
import { useNavigate } from 'react-router-dom';

// Each planet: [main color, lighter for gradient top, glow]
const PLANET_PALETTE = [
  ['#7B6CF5', '#A89BF8', 'rgba(123,108,245,0.55)'],
  ['#E9B949', '#F5D27A', 'rgba(233,185,73,0.55)'],
  ['#E07B30', '#F0A060', 'rgba(224,123,48,0.55)'],
  ['#FF5B5B', '#FF8888', 'rgba(255,91,91,0.50)'],
  ['#2DD4BF', '#67E8D1', 'rgba(45,212,191,0.50)'],
  ['#C084FC', '#DDB6FE', 'rgba(192,132,252,0.50)'],
];

const GOLDEN_ANGLE = 137.5;

function getPlanetConfig(index) {
  const [main, light, glow] = PLANET_PALETTE[index % PLANET_PALETTE.length];
  return {
    main,
    light,
    glow,
    radius: 130 + index * 60,
    duration: 20 + index * 8,
  };
}

export default function SolarSystem({ folders, onCreateFolder }) {
  const navigate = useNavigate();

  return (
    <div className="relative w-full flex items-center justify-center" style={{ height: '560px' }}>

      {/* Orbital rings */}
      {folders.map((_, i) => {
        const { radius } = getPlanetConfig(i);
        return (
          <div
            key={`ring-${i}`}
            className="absolute rounded-full pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              border: '1px solid rgba(255,255,255,0.07)',
              boxShadow: 'inset 0 0 0 1px rgba(255,255,255,0.03)',
            }}
          />
        );
      })}

      {/* Sun */}
      <div
        className="absolute z-20 w-20 h-20 rounded-full flex items-center justify-center font-bold text-sm tracking-[0.18em] select-none animate-novaPulse"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          background: 'radial-gradient(circle at 35% 35%, #F5D27A 0%, #E9B949 45%, #C99A32 100%)',
          color: '#0C0B1C',
        }}
      >
        NOVA
      </div>

      {/* Planets */}
      {folders.map((folder, i) => {
        const { main, light, glow, radius, duration } = getPlanetConfig(i);
        const startDelay = -((i * GOLDEN_ANGLE) / 360) * duration;

        return (
          <div
            key={folder.id}
            className="orbit-container"
            style={{
              '--orbit-radius': `${radius}px`,
              '--orbit-duration': `${duration}s`,
              animationDelay: `${startDelay}s`,
            }}
          >
            <button
              className="orbit-planet group flex flex-col items-center gap-1.5"
              onClick={() => navigate(`/folders/${folder.id}`)}
            >
              <div
                className="w-12 h-12 rounded-full flex items-center justify-center font-bold text-white text-base transition-all group-hover:scale-110"
                style={{
                  background: `radial-gradient(circle at 35% 30%, ${light} 0%, ${main} 60%, ${main}88 100%)`,
                  boxShadow: `0 0 16px ${glow}, 0 0 32px ${glow.replace('0.55', '0.20')}`,
                }}
              >
                {folder.name.charAt(0).toUpperCase()}
              </div>
              <span
                className="text-xs font-semibold text-white whitespace-nowrap px-2 py-0.5 rounded-full"
                style={{ background: 'rgba(12,11,28,0.80)', backdropFilter: 'blur(6px)' }}
              >
                {folder.name}
              </span>
              {folder.note_count > 0 && (
                <span className="text-[10px] text-muted">
                  {folder.note_count} note{folder.note_count !== 1 ? 's' : ''}
                </span>
              )}
            </button>
          </div>
        );
      })}

      {/* Empty state */}
      {folders.length === 0 && (
        <p className="absolute text-muted text-sm font-semibold" style={{ top: '65%' }}>
          Create a folder to see it orbit here
        </p>
      )}
    </div>
  );
}
