'use client';

import { Memory } from '@/types';
import Ornament from './Ornament';

interface ChristmasTreeProps {
  memories: Memory[];
  onOrnamentClick: (memory: Memory) => void;
  onAddClick: () => void;
}

const ORNAMENT_POSITIONS = [
  // Row 1 - top
  { x: 50, y: 16, row: 1 },
  // Row 2
  { x: 38, y: 26, row: 2 },
  { x: 62, y: 26, row: 2 },
  // Row 3
  { x: 28, y: 36, row: 3 },
  { x: 50, y: 35, row: 3 },
  { x: 72, y: 36, row: 3 },
  // Row 4
  { x: 20, y: 47, row: 4 },
  { x: 38, y: 46, row: 4 },
  { x: 62, y: 46, row: 4 },
  { x: 80, y: 47, row: 4 },
  // Row 5
  { x: 13, y: 58, row: 5 },
  { x: 30, y: 57, row: 5 },
  { x: 50, y: 56, row: 5 },
  { x: 70, y: 57, row: 5 },
  { x: 87, y: 58, row: 5 },
  // Row 6
  { x: 8, y: 69, row: 6 },
  { x: 24, y: 68, row: 6 },
  { x: 40, y: 67, row: 6 },
  { x: 56, y: 67, row: 6 },
  { x: 72, y: 68, row: 6 },
  { x: 88, y: 69, row: 6 },
];

export default function ChristmasTree({
  memories,
  onOrnamentClick,
  onAddClick,
}: ChristmasTreeProps) {
  return (
    <div className="relative w-full max-w-md mx-auto" style={{ height: '72vh', minHeight: '520px' }}>
      {/* Star on top - minimal design */}
      <div
        className="absolute z-30"
        style={{
          left: '50%',
          top: '1%',
          transform: 'translateX(-50%)',
        }}
      >
        <div className="relative">
          <svg
            width="44"
            height="44"
            viewBox="0 0 24 24"
            fill="none"
            style={{
              filter: 'drop-shadow(0 0 20px rgba(255,215,0,0.8)) drop-shadow(0 0 40px rgba(255,215,0,0.4))',
            }}
          >
            <path
              d="M12 2L14.09 8.26L20.5 9.27L15.75 13.97L16.82 20.39L12 17.77L7.18 20.39L8.25 13.97L3.5 9.27L9.91 8.26L12 2Z"
              fill="url(#starGrad)"
              stroke="rgba(255,255,255,0.5)"
              strokeWidth="0.5"
            />
            <defs>
              <linearGradient id="starGrad" x1="0%" y1="0%" x2="100%" y2="100%">
                <stop offset="0%" stopColor="#fffde7" />
                <stop offset="50%" stopColor="#ffd700" />
                <stop offset="100%" stopColor="#ffb300" />
              </linearGradient>
            </defs>
          </svg>
        </div>
      </div>

      {/* Tree - Modern minimal style */}
      <svg
        viewBox="0 0 100 100"
        className="absolute inset-0 w-full h-full"
        preserveAspectRatio="xMidYMid meet"
      >
        <defs>
          {/* Tree gradient - subtle and modern */}
          <linearGradient id="treeGrad" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#1a472a" />
            <stop offset="100%" stopColor="#0d2818" />
          </linearGradient>

          {/* Lighter gradient for depth */}
          <linearGradient id="treeGradLight" x1="100%" y1="0%" x2="0%" y2="100%">
            <stop offset="0%" stopColor="#2d5a3d" />
            <stop offset="100%" stopColor="#1a472a" />
          </linearGradient>

          {/* Trunk */}
          <linearGradient id="trunkGrad" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#3d2817" />
            <stop offset="50%" stopColor="#5c4033" />
            <stop offset="100%" stopColor="#3d2817" />
          </linearGradient>

          {/* Soft shadow */}
          <filter id="softShadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="4" stdDeviation="6" floodColor="#000" floodOpacity="0.25" />
          </filter>

          {/* Glow for lights */}
          <filter id="glow">
            <feGaussianBlur stdDeviation="1.5" result="blur" />
            <feMerge>
              <feMergeNode in="blur" />
              <feMergeNode in="SourceGraphic" />
            </feMerge>
          </filter>
        </defs>

        {/* Tree shape - clean geometric layers */}
        {/* Layer 1 */}
        <path
          d="M50 10 L40 24 L60 24 Z"
          fill="url(#treeGradLight)"
          filter="url(#softShadow)"
        />

        {/* Layer 2 */}
        <path
          d="M50 18 L32 38 L68 38 Z"
          fill="url(#treeGrad)"
          filter="url(#softShadow)"
        />

        {/* Layer 3 */}
        <path
          d="M50 30 L22 54 L78 54 Z"
          fill="url(#treeGradLight)"
          filter="url(#softShadow)"
        />

        {/* Layer 4 */}
        <path
          d="M50 44 L10 74 L90 74 Z"
          fill="url(#treeGrad)"
          filter="url(#softShadow)"
        />

        {/* Layer 5 - bottom */}
        <path
          d="M50 62 L2 90 L98 90 Z"
          fill="url(#treeGradLight)"
          filter="url(#softShadow)"
        />

        {/* Trunk */}
        <rect
          x="42"
          y="88"
          width="16"
          height="8"
          rx="1"
          fill="url(#trunkGrad)"
        />

        {/* Minimal string lights - just subtle dots */}
        {[
          { cx: 45, cy: 21 }, { cx: 55, cy: 21 },
          { cx: 38, cy: 32 }, { cx: 50, cy: 30 }, { cx: 62, cy: 32 },
          { cx: 30, cy: 46 }, { cx: 43, cy: 44 }, { cx: 57, cy: 44 }, { cx: 70, cy: 46 },
          { cx: 22, cy: 62 }, { cx: 36, cy: 60 }, { cx: 50, cy: 58 }, { cx: 64, cy: 60 }, { cx: 78, cy: 62 },
          { cx: 14, cy: 78 }, { cx: 28, cy: 76 }, { cx: 42, cy: 74 }, { cx: 58, cy: 74 }, { cx: 72, cy: 76 }, { cx: 86, cy: 78 },
        ].map((pos, i) => (
          <circle
            key={i}
            cx={pos.cx}
            cy={pos.cy}
            r="1"
            fill={['#ffd700', '#fff', '#ffd700', '#fff'][i % 4]}
            opacity={0.6 + (i % 3) * 0.2}
            filter="url(#glow)"
          >
            <animate
              attributeName="opacity"
              values={`${0.4 + (i % 3) * 0.2};${0.8 + (i % 2) * 0.2};${0.4 + (i % 3) * 0.2}`}
              dur={`${2 + (i % 3)}s`}
              repeatCount="indefinite"
            />
          </circle>
        ))}
      </svg>

      {/* Ornaments */}
      {ORNAMENT_POSITIONS.map((pos, index) => {
        const memory = memories[index];
        return (
          <Ornament
            key={index}
            position={pos}
            memory={memory}
            index={index}
            onClick={() => {
              if (memory) {
                onOrnamentClick(memory);
              } else {
                onAddClick();
              }
            }}
            isEmpty={!memory}
          />
        );
      })}

      {/* Ground - minimal */}
      <div
        className="absolute bottom-0 left-0 right-0"
        style={{ height: '40px' }}
      >
        <div
          className="absolute bottom-0 left-1/2 -translate-x-1/2 w-[120%] h-full"
          style={{
            background: 'linear-gradient(180deg, rgba(255,255,255,0.85) 0%, rgba(220,235,255,0.7) 100%)',
            borderRadius: '50% 50% 0 0',
            boxShadow: 'inset 0 2px 20px rgba(255,255,255,0.5)',
          }}
        />
      </div>
    </div>
  );
}
