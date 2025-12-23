'use client';

import { useEffect, useState } from 'react';

interface Snowflake {
  id: number;
  x: number;
  delay: number;
  duration: number;
  size: number;
  opacity: number;
  type: 'snowfall' | 'snowfall-drift';
}

export default function Snowfall() {
  const [snowflakes, setSnowflakes] = useState<Snowflake[]>([]);

  useEffect(() => {
    const flakes: Snowflake[] = [];
    const count = 60;

    for (let i = 0; i < count; i++) {
      flakes.push({
        id: i,
        x: Math.random() * 100,
        delay: Math.random() * 15,
        duration: 10 + Math.random() * 15,
        size: 2 + Math.random() * 6,
        opacity: 0.3 + Math.random() * 0.7,
        type: Math.random() > 0.5 ? 'snowfall' : 'snowfall-drift',
      });
    }

    setSnowflakes(flakes);
  }, []);

  return (
    <div className="fixed inset-0 pointer-events-none z-50 overflow-hidden">
      {snowflakes.map((flake) => (
        <div
          key={flake.id}
          className="snowflake absolute rounded-full"
          style={{
            left: `${flake.x}%`,
            width: `${flake.size}px`,
            height: `${flake.size}px`,
            opacity: flake.opacity,
            background: `radial-gradient(circle, rgba(255,255,255,${flake.opacity}) 0%, rgba(255,255,255,0) 70%)`,
            boxShadow: `0 0 ${flake.size * 2}px ${flake.size / 2}px rgba(255,255,255,${flake.opacity * 0.5})`,
            animation: `${flake.type} ${flake.duration}s linear ${flake.delay}s infinite`,
          }}
        />
      ))}
    </div>
  );
}
