'use client';

import { Memory } from '@/types';
import Image from 'next/image';
import { useEffect, useState, useCallback } from 'react';

interface StoryViewProps {
  memories: Memory[];
  onClose: () => void;
}

const LETTER_CONTENT = {
  title: "To.명서",
  body: `벌써 우리가 함께한 시간이 3년을 훌쩍 넘었다는 게 아직도 신기해.
처음 만났던 날부터 지금까지, 사소한 일상도 특별하게 만들어준 사람이 바로 너였다는 걸 요즘 더 많이 느껴.

이번 크리스마스는 특히 더 의미가 있는 것 같아.
명서는 이제 곧 대학을 졸업하고, 새로운 세상으로 한 걸음 더 나아가잖아.
설렘도 크겠지만, 그만큼 걱정도 많을 거라는 걸 알아.
그래도 꼭 기억했으면 해.
지금까지 명서가 해온 선택들과 노력들은 절대 헛되지 않았고,
명서는 스스로 생각하는 것보다 훨씬 단단하고 멋진 사람이야.

취업 준비라는 시간이 때로는 지치고 자신감이 흔들릴 수도 있겠지만,
그럴 때마다 내가 항상 옆에서 응원하고 있다는 걸 잊지 말아줘.
잘 될 거라는 말보다, 명서라서 잘 해낼 수 있다는 말을 해주고 싶어.
결과보다 과정까지도 존중받아야 하는 사람이니까.

우리가 함께 웃고, 울고, 서로의 하루를 나누며 쌓아온 시간들이
앞으로의 날들 속에서도 분명 큰 힘이 되어줄 거라고 믿어.

명서와 함께하는 지금 이 순간이 참 좋고,
앞으로 함께 그려갈 미래도 기대돼.

메리 크리스마스 🎄
올해도, 그리고 앞으로도
명서의 모든 계절을 진심으로 응원할게.
늘 고맙고, 많이 사랑해.`,
  signature: "- 근일 -"
};

export default function StoryView({ memories, onClose }: StoryViewProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [progress, setProgress] = useState(0);
  const [isPaused, setIsPaused] = useState(false);
  const [isLetterOpened, setIsLetterOpened] = useState(false);

  const sortedMemories = [...memories].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  // 마지막 슬라이드는 편지
  const totalSlides = sortedMemories.length + 1;
  const isLetterSlide = currentIndex === sortedMemories.length;
  const currentMemory = sortedMemories[currentIndex];

  const goToNext = useCallback(() => {
    if (currentIndex < totalSlides - 1) {
      setCurrentIndex((prev) => prev + 1);
      setProgress(0);
    } else {
      onClose();
    }
  }, [currentIndex, totalSlides, onClose]);

  const goToPrev = useCallback(() => {
    if (currentIndex > 0) {
      setCurrentIndex((prev) => prev - 1);
      setProgress(0);
    }
  }, [currentIndex]);

  // Auto progress timer (편지 슬라이드에서는 비활성화)
  useEffect(() => {
    if (isPaused || isLetterSlide) return;

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
  }, [isPaused, isLetterSlide, goToNext]);

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

  // 편지 슬라이드 렌더링
  if (isLetterSlide) {
    // 편지 도착 화면 (아직 열지 않았을 때)
    if (!isLetterOpened) {
      return (
        <div className="fixed inset-0 z-50 bg-black">
          {/* Progress bars */}
          <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 pt-[max(12px,env(safe-area-inset-top))]">
            {[...Array(totalSlides)].map((_, index) => (
              <div
                key={index}
                className="flex-1 h-[3px] rounded-full overflow-hidden"
                style={{ background: 'rgba(255,255,255,0.3)' }}
              >
                <div
                  className="h-full rounded-full"
                  style={{
                    width: index < currentIndex ? '100%' : '0%',
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

          {/* Letter arrival screen */}
          <div
            className="absolute inset-0 flex flex-col items-center justify-center p-8"
            style={{
              background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
            }}
          >
            {/* Decorative elements */}
            <div className="absolute inset-0 overflow-hidden pointer-events-none">
              {[...Array(20)].map((_, i) => (
                <div
                  key={i}
                  className="absolute rounded-full"
                  style={{
                    width: `${2 + Math.random() * 4}px`,
                    height: `${2 + Math.random() * 4}px`,
                    left: `${Math.random() * 100}%`,
                    top: `${Math.random() * 100}%`,
                    background: 'rgba(255,215,0,0.3)',
                    boxShadow: '0 0 10px rgba(255,215,0,0.5)',
                    animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                    animationDelay: `${Math.random() * 2}s`,
                  }}
                />
              ))}
            </div>

            {/* Letter arrival message */}
            <h2
              className="text-2xl font-bold mb-8 text-center"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #ffd700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              편지가 도착했어요!
            </h2>

            {/* Letter envelope button */}
            <button
              onClick={() => setIsLetterOpened(true)}
              className="relative group transition-transform hover:scale-105 active:scale-95"
            >
              <div
                className="w-48 h-36 rounded-2xl flex items-center justify-center"
                style={{
                  background: 'linear-gradient(145deg, #f5e6d3 0%, #e8d4be 100%)',
                  boxShadow: '0 10px 40px rgba(0,0,0,0.3), 0 0 60px rgba(255,215,0,0.2)',
                  border: '2px solid rgba(255,215,0,0.3)',
                }}
              >
                {/* Envelope flap */}
                <div
                  className="absolute top-0 left-0 right-0 h-1/2"
                  style={{
                    background: 'linear-gradient(180deg, #e8d4be 0%, #dcc7af 100%)',
                    clipPath: 'polygon(0 0, 50% 60%, 100% 0)',
                    borderRadius: '16px 16px 0 0',
                  }}
                />
                {/* Heart seal */}
                <div className="relative z-10 text-5xl animate-pulse">
                  💌
                </div>
              </div>
              {/* Click hint */}
              <p className="text-white/50 text-sm mt-4 text-center">
                터치하여 열기
              </p>
            </button>

            {/* Counter */}
            <div className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-sm">
              {currentIndex + 1} / {totalSlides}
            </div>
          </div>
        </div>
      );
    }

    // 편지 내용 화면 (열었을 때)
    return (
      <div className="fixed inset-0 z-50 bg-black">
        {/* Progress bars */}
        <div className="absolute top-0 left-0 right-0 z-20 flex gap-1 p-3 pt-[max(12px,env(safe-area-inset-top))]">
          {[...Array(totalSlides)].map((_, index) => (
            <div
              key={index}
              className="flex-1 h-[3px] rounded-full overflow-hidden"
              style={{ background: 'rgba(255,255,255,0.3)' }}
            >
              <div
                className="h-full rounded-full"
                style={{
                  width: index <= currentIndex ? '100%' : '0%',
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

        {/* Letter content */}
        <div
          className="absolute inset-0 flex flex-col items-center pt-24 pb-20 px-8 overflow-y-auto"
          style={{
            background: 'linear-gradient(180deg, #1a1a2e 0%, #16213e 50%, #0f0f23 100%)',
          }}
        >
          {/* Decorative elements */}
          <div className="absolute inset-0 overflow-hidden pointer-events-none">
            {[...Array(20)].map((_, i) => (
              <div
                key={i}
                className="absolute rounded-full"
                style={{
                  width: `${2 + Math.random() * 4}px`,
                  height: `${2 + Math.random() * 4}px`,
                  left: `${Math.random() * 100}%`,
                  top: `${Math.random() * 100}%`,
                  background: 'rgba(255,215,0,0.3)',
                  boxShadow: '0 0 10px rgba(255,215,0,0.5)',
                  animation: `twinkle ${2 + Math.random() * 2}s ease-in-out infinite`,
                  animationDelay: `${Math.random() * 2}s`,
                }}
              />
            ))}
          </div>

          {/* Letter content */}
          <div className="relative max-w-md w-full text-center my-auto px-2">
            {/* Title */}
            <h2
              className="text-2xl font-bold mb-8"
              style={{
                background: 'linear-gradient(135deg, #ffd700 0%, #ffec8b 50%, #ffd700 100%)',
                WebkitBackgroundClip: 'text',
                WebkitTextFillColor: 'transparent',
              }}
            >
              {LETTER_CONTENT.title}
            </h2>

            {/* Body */}
            <p className="text-white/85 text-sm leading-[1.9] whitespace-pre-line mb-8 text-left">
              {LETTER_CONTENT.body}
            </p>

            {/* Signature */}
            <p className="text-white/60 text-base italic mt-6">
              {LETTER_CONTENT.signature}
            </p>
          </div>

          {/* Counter */}
          <div className="absolute bottom-8 left-0 right-0 text-center text-white/40 text-sm">
            {currentIndex + 1} / {totalSlides}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="fixed inset-0 z-50 bg-black">
      {/* Progress bars */}
      <div className="absolute top-0 left-0 right-0 z-20 flex gap-1.5 px-4 py-3 pt-[max(14px,env(safe-area-inset-top))]">
        {[...Array(totalSlides)].map((_, index) => (
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
        className="absolute top-[max(16px,env(safe-area-inset-top))] right-5 z-20 w-11 h-11 mt-4 flex items-center justify-center text-white/80 hover:text-white"
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
        <div className="relative z-10 mt-24 px-7">
          <div
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full"
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
        <div className="relative z-10 mt-auto p-7 pb-[max(28px,env(safe-area-inset-bottom))]">
          {/* Title */}
          <h2 className="text-3xl font-bold text-white mb-4 leading-tight">
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
            <span>{currentIndex + 1} / {totalSlides}</span>
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
      <div className="absolute bottom-[max(110px,calc(env(safe-area-inset-bottom)+90px))] left-0 right-0 flex justify-center gap-10 text-white/30 text-sm pointer-events-none">
        <span>&#8592; 이전</span>
        <span>다음 &#8594;</span>
      </div>
    </div>
  );
}
