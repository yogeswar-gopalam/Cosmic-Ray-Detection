import React from 'react';

const SpaceBackground: React.FC = () => {
  return (
    <div className="stars-container">
      {/* Small Stars */}
      <div className="absolute inset-0 opacity-30">
        {[...Array(100)].map((_, i) => (
          <div
            key={`star-s-${i}`}
            className="absolute rounded-full bg-white animate-pulse"
            style={{
              width: Math.random() * 2 + 'px',
              height: Math.random() * 2 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              animationDelay: Math.random() * 5 + 's',
              animationDuration: Math.random() * 3 + 2 + 's',
            }}
          />
        ))}
      </div>

      {/* Medium Stars */}
      <div className="absolute inset-0 opacity-50">
        {[...Array(50)].map((_, i) => (
          <div
            key={`star-m-${i}`}
            className="absolute rounded-full bg-blue-200"
            style={{
              width: Math.random() * 3 + 1 + 'px',
              height: Math.random() * 3 + 1 + 'px',
              top: Math.random() * 100 + '%',
              left: Math.random() * 100 + '%',
              boxShadow: '0 0 10px rgba(147, 197, 253, 0.5)',
              animationDelay: Math.random() * 5 + 's',
            }}
          />
        ))}
      </div>

      {/* Distant Nebulae (Glows) */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute top-1/4 -left-1/4 w-[80%] h-[80%] bg-purple-900/10 blur-[120px] rounded-full" />
        <div className="absolute bottom-1/4 -right-1/4 w-[70%] h-[70%] bg-blue-900/10 blur-[120px] rounded-full" />
      </div>

      {/* Cosmic Dust / Scanlines for texture */}
      <div className="absolute inset-0 bg-[url('https://www.transparenttextures.com/patterns/stardust.png')] opacity-[0.03] pointer-events-none" />
    </div>
  );
};

export default SpaceBackground;
