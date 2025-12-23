'use client';

import { Memory } from '@/types';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

interface StoryViewProps {
  memories: Memory[];
  onClose: () => void;
}

export default function StoryView({ memories, onClose }: StoryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const sortedMemories = [...memories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  const currentMemory = sortedMemories[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < sortedMemories.length - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, sortedMemories.length, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Auto progress timer
  useEffect(() => {
    if (isPaused) return;

    const interval = setInterval(() => {
      setProgress((prev) => {
        if (prev >= 100) {
          goToNext();
          return 0;
        }
        return prev + 1;
      });
    }, 100); // 10초 = 100 * 100ms

    return () => clearInterval(interval);
  }, [isPaused, goToNext]);

  // Reset progress when index changes
  useEffect(() => {
    setProgress(0);
  }, [currentIndex]);

  const handleClick = (e: React.MouseEvent) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const width = rect.width;

    if (x < width / 3) {
      goToPrev();
    } else {
      goToNext();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    return `${year}.${month}.${day}`;
  };

  if (sortedMemories.length === 0) {
    return (
      <div className="fixed inset-0 z-50 bg-black flex items-center justify-center">
        <div className="text-center">
          <p className="text-white/60 mb-4">아직 추억이 없어요</p>
          <button
            onClick={onClose}
            className="px-6 py-2 rounded-full bg-white/10 text-white text-sm"
          >
            돌아가기
          </button>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 pt-[max(12px,env(safe-area-inset-top))]">
        {sortedMemories.map((_, index) => (
          <div
            key={index}
            className="flex-1 h-[3px] rounded-full overflow-hidden"
            style={{ background: 'rgba(255,255,255,0.3)' }}
          >
            <div
              className="h-full rounded-full transition-all duration-100"
              style={{
                width:
                  index < currentIndex
                    ? '100%'
                    : index === currentIndex
                    ? `${progress}%`
                    : '0%',
                background: 'white',
              }}
            />
          </div>
        ))}
      </div>

      {/* Close button */}
      <button
        onClick={onClose}
        className="absolute top-[max(16px,env(safe-area-inset-top))] right-4 z-20 w-10 h-10 mt-4 flex items-center justify-center text-white/80 hover:text-white"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
          <path d="M18 6L6 18M6 6l12 12" />
        </svg>
      </button>

      {/* Story content */}
      <div
        className="absolute inset-0 flex flex-col"
        onClick={handleClick}
        onMouseDown={() => setIsPaused(true)}
        onMouseUp={() => setIsPaused(false)}
        onMouseLeave={() => setIsPaused(false)}
        onTouchStart={() => setIsPaused(true)}
        onTouchEnd={() => setIsPaused(false)}
      >
        {/* Background image */}
        <div className="absolute inset-0 flex items-center justify-center bg-black">
          <Image
            src={currentMemory.imageUrl}
            alt={currentMemory.title}
            fill
            className="object-contain"
            priority
          />
          {/* Gradient overlays */}
          <div
            className="absolute inset-0 pointer-events-none"
            style={{
              background: 'linear-gradient(180deg, rgba(0,0,0,0.5) 0%, transparent 15%, transparent 70%, rgba(0,0,0,0.85) 100%)',
            }}
          />
        </div>

        {/* Date badge */}
        <div className="relative z-10 mt-20 px-6">
          <div
            className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full"
            style={{
              background: 'rgba(255,255,255,0.15)',
              backdropFilter: 'blur(10px)',
            }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white/80">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-white/90 text-sm font-medium">
              {formatDate(currentMemory.date)}
            </span>
          </div>
        </div>

        {/* Content at bottom */}
        <div className="relative z-10 mt-auto p-6 pb-[max(24px,env(safe-area-inset-bottom))]">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-3 leading-tight">
            {currentMemory.title}
          </h2>

          {/* Description */}
          {currentMemory.description && (
            <p className="text-white/80 text-base leading-relaxed line-clamp-4">
              {currentMemory.description}
            </p>
          )}

          {/* Counter */}
          <div className="mt-6 flex items-center justify-between text-white/40 text-sm">
            <span>{currentIndex + 1} / {sortedMemories.length}</span>
            <span className="flex items-center gap-1">
              <span>우리의 행복했던 2025년</span>
            </span>
          </div>
        </div>

        {/* Touch hint areas (invisible) */}
        <div className="absolute left-0 top-0 bottom-0 w-1/3" />
        <div className="absolute right-0 top-0 bottom-0 w-2/3" />
      </div>

      {/* Navigation hints */}
      <div className="absolute bottom-[max(100px,calc(env(safe-area-inset-bottom)+80px))] left-0 right-0 flex justify-center gap-8 text-white/30 text-xs pointer-events-none">
        <span>&#8592; 이전</span>
        <span>다음 &#8594;</span>
      </div>
    </div>
  );
}
