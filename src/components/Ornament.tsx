'use client';

import { Memory, OrnamentPosition } from '@/types';
import Image from 'next/image';

interface OrnamentProps {
  position: OrnamentPosition;
  memory?: Memory;
  index: number;
  onClick: () => void;
  isEmpty: boolean;
}

export default function Ornament({
  position,
  memory,
  index,
  onClick,
  isEmpty,
}: OrnamentProps) {
  const size = 52 - position.row * 4;
  const animationDelay = index * 0.15;

  return (
    <div
      className="ornament absolute z-10"
      style={{
        left: `${position.x}%`,
        top: `${position.y}%`,
        transform: 'translate(-50%, -50%)',
        animationDelay: `${animationDelay}s`,
      }}
      onClick={onClick}
    >
      {/* Main ornament */}
      <div
        className="relative flex items-center justify-center transition-all duration-300"
        style={{
          width: `${size}px`,
          height: `${size}px`,
        }}
      >
        {memory ? (
          /* Photo ornament */
          <div
            className="relative w-full h-full rounded-full overflow-hidden"
            style={{
              boxShadow: `
                0 0 0 2px rgba(255,255,255,0.9),
                0 0 0 4px rgba(255,215,0,0.4),
                0 8px 24px -4px rgba(0,0,0,0.5),
                0 0 40px -10px rgba(255,215,0,0.3)
              `,
            }}
          >
            <Image
              src={memory.imageUrl}
              alt={memory.title}
              fill
              className="object-cover"
              sizes="60px"
            />
            {/* Subtle shine overlay */}
            <div
              className="absolute inset-0 pointer-events-none"
              style={{
                background: 'linear-gradient(145deg, rgba(255,255,255,0.25) 0%, transparent 40%)',
              }}
            />
          </div>
        ) : (
          /* Empty ornament - minimal glass style */
          <div
            className="relative w-full h-full rounded-full flex items-center justify-center transition-all duration-300 hover:scale-105"
            style={{
              background: 'linear-gradient(145deg, rgba(255,255,255,0.12) 0%, rgba(255,255,255,0.04) 100%)',
              boxShadow: `
                0 0 0 1px rgba(255,255,255,0.15),
                0 8px 20px -4px rgba(0,0,0,0.3),
                inset 0 1px 1px rgba(255,255,255,0.1)
              `,
              backdropFilter: 'blur(8px)',
            }}
          >
            {/* Plus icon */}
            <svg
              width={size * 0.35}
              height={size * 0.35}
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="1.5"
              className="text-white/40"
            >
              <line x1="12" y1="5" x2="12" y2="19" />
              <line x1="5" y1="12" x2="19" y2="12" />
            </svg>
          </div>
        )}
      </div>
    </div>
  );
}
