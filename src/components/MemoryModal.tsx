'use client';

import { Memory } from '@/types';
import Image from 'next/image';
import { useEffect, useState } from 'react';

interface MemoryModalProps {
  memory: Memory | null;
  isOpen: boolean;
  onClose: () => void;
  onDelete: (id: string) => void;
}

export default function MemoryModal({
  memory,
  isOpen,
  onClose,
  onDelete,
}: MemoryModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
    } else {
      document.body.style.overflow = 'unset';
    }
    return () => {
      document.body.style.overflow = 'unset';
    };
  }, [isOpen]);

  const handleClose = () => {
    setIsClosing(true);
    setTimeout(() => {
      setIsClosing(false);
      setShowDeleteConfirm(false);
      onClose();
    }, 300);
  };

  const handleDelete = () => {
    if (memory) {
      onDelete(memory.id);
      handleClose();
    }
  };

  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    const year = date.getFullYear();
    const month = date.getMonth() + 1;
    const day = date.getDate();
    const weekdays = ['일', '월', '화', '수', '목', '금', '토'];
    const weekday = weekdays[date.getDay()];
    return `${year}년 ${month}월 ${day}일 (${weekday})`;
  };

  if (!isOpen || !memory) return null;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-center justify-center p-6 backdrop-enter`}
      onClick={handleClose}
      style={{ background: 'rgba(0,0,0,0.7)' }}
    >
      {/* Modal Content */}
      <div
        className={`relative w-full max-w-sm rounded-3xl overflow-hidden ${
          isClosing ? 'modal-exit' : 'modal-enter'
        }`}
        style={{
          background: 'linear-gradient(180deg, rgba(30,30,60,0.95) 0%, rgba(20,20,40,0.98) 100%)',
          border: '1px solid rgba(255,255,255,0.1)',
          boxShadow: '0 25px 50px -12px rgba(0,0,0,0.5), 0 0 0 1px rgba(255,255,255,0.05)',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close button */}
        <button
          onClick={handleClose}
          className="absolute top-4 right-4 z-20 w-10 h-10 rounded-full flex items-center justify-center text-white/60 hover:text-white hover:bg-white/10 transition-all"
        >
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
            <path d="M18 6L6 18M6 6l12 12" />
          </svg>
        </button>

        {/* Image */}
        <div className="relative w-full aspect-[4/3] overflow-hidden">
          <Image
            src={memory.imageUrl}
            alt={memory.title}
            fill
            className="object-cover"
            sizes="400px"
          />
          {/* Image overlay gradient */}
          <div
            className="absolute inset-0"
            style={{
              background: 'linear-gradient(180deg, transparent 40%, rgba(20,20,40,1) 100%)',
            }}
          />
          {/* Decorative frame corners */}
          <div className="absolute top-3 left-3 w-6 h-6 border-t-2 border-l-2 border-yellow-400/50 rounded-tl-lg" />
          <div className="absolute top-3 right-3 w-6 h-6 border-t-2 border-r-2 border-yellow-400/50 rounded-tr-lg" />
        </div>

        {/* Content */}
        <div className="px-7 pb-7 -mt-8 relative z-10">
          {/* Date badge */}
          <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-yellow-400/20 border border-yellow-400/30 mb-5">
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-yellow-400">
              <rect x="3" y="4" width="18" height="18" rx="2" ry="2" />
              <line x1="16" y1="2" x2="16" y2="6" />
              <line x1="8" y1="2" x2="8" y2="6" />
              <line x1="3" y1="10" x2="21" y2="10" />
            </svg>
            <span className="text-yellow-400/90 text-xs font-medium">
              {formatDate(memory.date)}
            </span>
          </div>

          {/* Title */}
          <h2 className="text-2xl font-bold text-white mb-4 leading-tight">
            {memory.title}
          </h2>

          {/* Description */}
          {memory.description && (
            <p className="text-white/70 text-sm leading-relaxed whitespace-pre-wrap mb-6">
              {memory.description}
            </p>
          )}

          {/* Heart decoration */}
          <div className="flex justify-center py-5 border-t border-white/10">
            <div className="flex items-center gap-2 text-white/40 text-xs">
              <span>소중한 우리의 추억</span>
              <span className="text-red-400 heart-beat">&#10084;</span>
            </div>
          </div>

          {/* Delete section */}
          {!showDeleteConfirm ? (
            <button
              onClick={() => setShowDeleteConfirm(true)}
              className="w-full py-2.5 text-white/30 text-xs hover:text-red-400/70 transition-colors"
            >
              이 추억 삭제하기
            </button>
          ) : (
            <div className="flex gap-2">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="flex-1 py-2.5 rounded-xl bg-white/5 text-white/60 text-sm hover:bg-white/10 transition-colors"
              >
                취소
              </button>
              <button
                onClick={handleDelete}
                className="flex-1 py-2.5 rounded-xl bg-red-500/20 text-red-400 text-sm hover:bg-red-500/30 transition-colors border border-red-500/30"
              >
                삭제
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
