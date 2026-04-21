import React from 'react';
import { useNavigate } from 'react-router-dom';

const PLANET_COLORS = [
  '#6B5CF0', // purple
  '#F5C518', // yellow
  '#C86A14', // orange
  '#FF4B4B', // red
  '#4ECDC4', // teal
  '#A78BFA', // violet
];

const GOLDEN_ANGLE = 137.5;

function getPlanetConfig(index) {
  return {
    color: PLANET_COLORS[index % PLANET_COLORS.length],
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
            className="absolute rounded-full border border-dashed border-white/10 pointer-events-none"
            style={{
              width: radius * 2,
              height: radius * 2,
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
            }}
          />
        );
      })}

      {/* Sun */}
      <div
        className="absolute z-20 w-20 h-20 rounded-full bg-primary flex items-center justify-center font-black text-[#1C1733] text-sm tracking-widest select-none"
        style={{
          top: '50%',
          left: '50%',
          transform: 'translate(-50%, -50%)',
          boxShadow: '0 0 30px rgba(245,197,24,0.5), 0 0 60px rgba(245,197,24,0.15)',
        }}
      >
        NOVA
      </div>

      {/* Planets */}
      {folders.map((folder, i) => {
        const { color, radius, duration } = getPlanetConfig(i);
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
                className="w-12 h-12 rounded-full flex items-center justify-center font-extrabold text-white text-base transition-transform group-hover:scale-110"
                style={{
                  background: color,
                  boxShadow: `0 0 14px ${color}99`,
                }}
              >
                {folder.name.charAt(0).toUpperCase()}
              </div>
              <span className="text-xs font-bold text-white whitespace-nowrap bg-bg/80 backdrop-blur-sm px-2 py-0.5 rounded-full">
                {folder.name}
              </span>
              {folder.note_count > 0 && (
                <span className="text-[10px] text-muted font-semibold">
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
