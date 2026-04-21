import React, { useState } from 'react';
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
    radius: 130 + index * 55, // tightly packed for dense solar system
    duration: 20 + index * 8, // slower orbits for outer planets
  };
}

export default function SolarSystem({ folders, onCreateFolder }) {
  const navigate = useNavigate();
  const [hoveredFolder, setHoveredFolder] = useState(null);

  // Fallback map to avoid issues if folders are randomly missing logic
  const validFolders = folders || [];

  return (
    <div className="relative w-full flex items-center justify-center orbit-system-container h-[300px] sm:h-[400px] md:h-[480px] lg:h-[560px]">
      
      {/* 3D Inner Container providing the isometric tilt */}
      <div className={`orbit-system-inner ${hoveredFolder ? 'is-paused' : ''}`}>
        
        {/* Orbital rings */}
        {validFolders.map((_, i) => {
          const { radius } = getPlanetConfig(i);
          const isHovered = hoveredFolder === validFolders[i].id;
          const isDimmed = hoveredFolder && !isHovered;

          return (
            <div
              key={`ring-${i}`}
              className="absolute rounded-full pointer-events-none transition-all duration-500"
              style={{
                width: radius * 2,
                height: radius * 2,
                top: '50%',
                left: '50%',
                transform: 'translate(-50%, -50%)',
                border: isHovered ? '2px solid rgba(255,255,255,0.4)' : '1px solid rgba(255,255,255,0.07)',
                boxShadow: isHovered ? '0 0 20px rgba(233,185,73,0.3), inset 0 0 20px rgba(233,185,73,0.3)' : 'inset 0 0 0 1px rgba(255,255,255,0.03)',
                opacity: isDimmed ? 0.2 : 1,
              }}
            />
          );
        })}

        {/* The Sun (Center star) */}
        <div
          className={`absolute z-20 w-24 h-24 rounded-full transition-all duration-500 ${hoveredFolder ? 'opacity-40 animate-none scale-95' : 'animate-novaPulse shadow-glow-primary'}`}
          style={{
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%) rotateX(-60deg)', // Stand upright in the tilted plane
            background: 'radial-gradient(circle at 35% 35%, #F5D27A 0%, #E9B949 45%, #C99A32 100%)',
            boxShadow: 'inset -8px -8px 16px rgba(0,0,0,0.3), 0 0 40px rgba(233,185,73,0.5)', // Crescent shadow
          }}
        />

        {/* Orbiting Planets */}
        {validFolders.map((folder, i) => {
          const { main, light, glow, radius, duration } = getPlanetConfig(i);
          const startDelay = -((i * GOLDEN_ANGLE) / 360) * duration;
          const noteCount = folder.note_count || 0;
          
          const isHovered = hoveredFolder === folder.id;
          const isDimmed = hoveredFolder && !isHovered;

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
                className="orbit-planet group flex flex-col items-center gap-2"
                onClick={() => navigate(`/folders/${folder.id}`)}
                onMouseEnter={() => setHoveredFolder(folder.id)}
                onMouseLeave={() => setHoveredFolder(null)}
                style={{
                  opacity: isDimmed ? 0.3 : 1,
                  filter: isDimmed ? 'grayscale(80%) blur(1px)' : 'none',
                  animationDelay: `${startDelay}s`,
                  transition: 'opacity 0.4s, filter 0.4s, transform 0.3s',
                  zIndex: isHovered ? 50 : 20,
                }}
              >
                <div className="relative">
                  {/* Planetary Sphere with 3D inset shadow */}
                  <div
                    className={`w-14 h-14 rounded-full transition-all duration-300 ${isHovered ? 'scale-125' : 'group-hover:scale-110'}`}
                    style={{
                      background: `radial-gradient(circle at 35% 30%, ${light} 0%, ${main} 60%, ${main}88 100%)`,
                      boxShadow: `inset -6px -6px 12px rgba(0,0,0,0.4), 0 0 16px ${glow}`,
                    }}
                  />
                  
                  {/* Orbiting Moons (representing notes) */}
                  {Array.from({ length: Math.min(noteCount, 5) }).map((_, m) => {
                    const moonDelay = -(m * 360 / 5) * 4 / 360; 
                    return (
                      <div 
                        key={m} 
                        className="orbit-moon"
                        style={{
                          background: m === 4 && noteCount > 5 ? '#FFF' : light, // White indicator if maxed out display moons
                          boxShadow: `0 0 8px ${light}`,
                          animationDelay: `${moonDelay}s`,
                          '--moon-duration': `${4 + m * 0.5}s`,
                          zIndex: 10,
                        }}
                      />
                    );
                  })}
                  
                  {/* Glassmorphism Interactive Tooltip (pops up on hover) */}
                  <div className={`absolute bottom-full mb-4 left-1/2 -translate-x-1/2 w-max p-4 rounded-2xl border border-border/70 bg-surface/90 backdrop-blur-md shadow-card transition-all duration-300 transform pointer-events-none ${isHovered ? 'opacity-100 translate-y-0 scale-100' : 'opacity-0 translate-y-2 scale-95'}`}>
                    <p className="text-base font-black text-white">{folder.name}</p>
                    <p className="text-sm text-secondary font-bold mt-0.5">{noteCount} note{noteCount !== 1 ? 's' : ''}</p>
                    {isHovered && <p className="text-[10px] text-muted mt-2 uppercase tracking-widest font-black">Click to enter orbit</p>}
                  </div>
                </div>

                {/* Always-on fallback label (disappears on interaction) */}
                <span
                  className={`text-xs font-semibold text-white whitespace-nowrap px-3 py-1 rounded-full transition-opacity duration-300 ${isHovered ? 'opacity-0' : 'opacity-100'}`}
                  style={{ background: 'rgba(12,11,28,0.70)', backdropFilter: 'blur(4px)', border: '1px solid rgba(255,255,255,0.05)' }}
                >
                  {folder.name}
                </span>
              </button>
            </div>
          );
        })}
      </div>

      {/* Empty State */}
      {validFolders.length === 0 && (
        <div className="absolute text-center z-50 mt-48">
          <p className="text-muted text-sm font-semibold rounded-2xl bg-surface/50 border border-border/50 backdrop-blur-sm px-6 py-3 shadow-card">
            Create a folder to see it orbit here
          </p>
        </div>
      )}
    </div>
  );
}
