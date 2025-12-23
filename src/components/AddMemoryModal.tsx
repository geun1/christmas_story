'use client';

import { Memory } from '@/types';
import Image from 'next/image';
import { useEffect, useState, useRef } from 'react';

interface AddMemoryModalProps {
  isOpen: boolean;
  onClose: () => void;
  onAdd: (memory: Omit<Memory, 'id'>) => void;
}

export default function AddMemoryModal({
  isOpen,
  onClose,
  onAdd,
}: AddMemoryModalProps) {
  const [isClosing, setIsClosing] = useState(false);
  const [date, setDate] = useState('');
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [imageUrl, setImageUrl] = useState('');
  const [imagePreview, setImagePreview] = useState<string | null>(null);
  const [isDragging, setIsDragging] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = 'hidden';
      const today = new Date().toISOString().split('T')[0];
      setDate(today);
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
      resetForm();
      onClose();
    }, 300);
  };

  const resetForm = () => {
    setDate('');
    setTitle('');
    setDescription('');
    setImageUrl('');
    setImagePreview(null);
  };

  const handleImageChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      processFile(file);
    }
  };

  const processFile = (file: File) => {
    const reader = new FileReader();
    reader.onloadend = () => {
      const result = reader.result as string;
      setImagePreview(result);
      setImageUrl(result);
    };
    reader.readAsDataURL(file);
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    const file = e.dataTransfer.files[0];
    if (file && file.type.startsWith('image/')) {
      processFile(file);
    }
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!date || !title || !imageUrl) return;

    onAdd({
      date,
      title,
      description,
      imageUrl,
      position: { x: 0, y: 0 },
    });

    handleClose();
  };

  if (!isOpen) return null;

  const isValid = date && title && imageUrl;

  return (
    <div
      className={`fixed inset-0 z-50 flex items-end sm:items-center justify-center`}
      onClick={handleClose}
    >
      {/* Backdrop with blur */}
      <div
        className="absolute inset-0 backdrop-blur-xl"
        style={{
          background: 'radial-gradient(circle at 50% 30%, rgba(99,102,241,0.15) 0%, rgba(0,0,0,0.85) 100%)'
        }}
      />

      {/* Floating decorations */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        {[...Array(6)].map((_, i) => (
          <div
            key={i}
            className="absolute rounded-full"
            style={{
              width: `${60 + i * 20}px`,
              height: `${60 + i * 20}px`,
              left: `${10 + i * 15}%`,
              top: `${10 + (i % 3) * 25}%`,
              background: `radial-gradient(circle, ${
                ['rgba(255,215,0,0.1)', 'rgba(255,107,107,0.1)', 'rgba(102,126,234,0.1)'][i % 3]
              } 0%, transparent 70%)`,
              animation: `float ${3 + i}s ease-in-out infinite`,
              animationDelay: `${i * 0.5}s`,
            }}
          />
        ))}
      </div>

      {/* Modal Content */}
      <div
        className={`relative w-full max-w-md mx-4 rounded-t-[32px] sm:rounded-[32px] overflow-hidden ${
          isClosing ? 'modal-exit' : 'modal-enter'
        }`}
        style={{
          background: 'linear-gradient(165deg, rgba(45,45,80,0.95) 0%, rgba(25,25,50,0.98) 100%)',
          boxShadow: '0 -10px 60px -10px rgba(99,102,241,0.3), 0 0 0 1px rgba(255,255,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)',
          border: '1px solid rgba(255,255,255,0.12)',
          maxHeight: '92vh',
        }}
        onClick={(e) => e.stopPropagation()}
      >
        {/* Decorative top gradient line */}
        <div
          className="absolute top-0 left-0 right-0 h-[2px]"
          style={{
            background: 'linear-gradient(90deg, transparent, #ffd700, #ff6b6b, #667eea, transparent)',
          }}
        />

        {/* Handle bar for mobile */}
        <div className="flex justify-center pt-3 pb-1 sm:hidden">
          <div className="w-10 h-1 rounded-full bg-white/20" />
        </div>

        {/* Header */}
        <div className="relative px-6 pt-4 pb-3">
          <div className="flex items-start justify-between">
            <div>
              <div className="flex items-center gap-2 mb-1">
                <div
                  className="w-8 h-8 rounded-xl flex items-center justify-center"
                  style={{
                    background: 'linear-gradient(135deg, rgba(255,215,0,0.2) 0%, rgba(255,140,0,0.2) 100%)',
                    border: '1px solid rgba(255,215,0,0.3)',
                  }}
                >
                  <svg width="16" height="16" viewBox="0 0 24 24" fill="none" className="text-yellow-400">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z" fill="currentColor"/>
                  </svg>
                </div>
                <h2 className="text-xl font-bold text-white">새로운 추억</h2>
              </div>
              <p className="text-white/40 text-xs pl-10">트리에 걸 소중한 순간</p>
            </div>
            <button
              onClick={handleClose}
              className="w-8 h-8 rounded-full flex items-center justify-center text-white/40 hover:text-white hover:bg-white/10 transition-all"
            >
              <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2">
                <path d="M18 6L6 18M6 6l12 12" />
              </svg>
            </button>
          </div>
        </div>

        {/* Form */}
        <form onSubmit={handleSubmit} className="px-6 pb-8 pt-2 space-y-5 overflow-y-auto" style={{ maxHeight: 'calc(92vh - 100px)' }}>
          {/* Image Upload */}
          <div
            onClick={() => fileInputRef.current?.click()}
            onDragOver={handleDragOver}
            onDragLeave={handleDragLeave}
            onDrop={handleDrop}
            className={`relative w-full aspect-[16/10] rounded-2xl overflow-hidden cursor-pointer transition-all duration-300 group ${
              isDragging ? 'scale-[1.02]' : ''
            }`}
            style={{
              background: imagePreview
                ? 'transparent'
                : 'linear-gradient(135deg, rgba(99,102,241,0.1) 0%, rgba(255,107,107,0.1) 50%, rgba(255,215,0,0.1) 100%)',
              border: isDragging
                ? '2px solid rgba(255,215,0,0.6)'
                : '2px dashed rgba(255,255,255,0.15)',
              boxShadow: isDragging ? '0 0 30px rgba(255,215,0,0.2)' : 'none',
            }}
          >
            {imagePreview ? (
              <>
                <Image
                  src={imagePreview}
                  alt="Preview"
                  fill
                  className="object-cover"
                />
                {/* Overlay on hover */}
                <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                  <div
                    className="w-12 h-12 rounded-full flex items-center justify-center"
                    style={{ background: 'rgba(255,255,255,0.15)', backdropFilter: 'blur(10px)' }}
                  >
                    <svg width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="1.5">
                      <path d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                    </svg>
                  </div>
                  <span className="text-white/90 text-sm font-medium">다른 사진 선택</span>
                </div>
                {/* Corner decorations */}
                <div className="absolute top-2 left-2 w-4 h-4 border-t-2 border-l-2 border-yellow-400/60 rounded-tl-lg" />
                <div className="absolute top-2 right-2 w-4 h-4 border-t-2 border-r-2 border-yellow-400/60 rounded-tr-lg" />
                <div className="absolute bottom-2 left-2 w-4 h-4 border-b-2 border-l-2 border-yellow-400/60 rounded-bl-lg" />
                <div className="absolute bottom-2 right-2 w-4 h-4 border-b-2 border-r-2 border-yellow-400/60 rounded-br-lg" />
              </>
            ) : (
              <div className="absolute inset-0 flex flex-col items-center justify-center">
                {/* Animated rings */}
                <div className="relative mb-4">
                  <div
                    className="absolute inset-0 rounded-full animate-ping"
                    style={{
                      width: '80px',
                      height: '80px',
                      background: 'radial-gradient(circle, rgba(255,215,0,0.3) 0%, transparent 70%)',
                      animationDuration: '2s',
                    }}
                  />
                  <div
                    className="relative w-16 h-16 rounded-2xl flex items-center justify-center"
                    style={{
                      background: 'linear-gradient(135deg, rgba(255,215,0,0.15) 0%, rgba(255,107,107,0.15) 100%)',
                      border: '1px solid rgba(255,255,255,0.1)',
                    }}
                  >
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5" className="text-white/60">
                      <rect x="3" y="3" width="18" height="18" rx="2" ry="2" />
                      <circle cx="8.5" cy="8.5" r="1.5" />
                      <polyline points="21 15 16 10 5 21" />
                    </svg>
                  </div>
                </div>
                <p className="text-white/70 text-sm font-medium mb-1">사진을 추가해주세요</p>
                <p className="text-white/30 text-xs">탭하거나 드래그하여 업로드</p>
              </div>
            )}
          </div>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*"
            onChange={handleImageChange}
            className="hidden"
          />

          {/* Date & Title Row */}
          <div className="grid grid-cols-5 gap-3">
            {/* Date */}
            <div className="col-span-2">
              <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
                날짜
              </label>
              <div className="relative">
                <input
                  type="date"
                  value={date}
                  onChange={(e) => setDate(e.target.value)}
                  required
                  className="w-full px-3 py-2.5 rounded-xl text-white text-sm focus:outline-none transition-all"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.08)',
                    colorScheme: 'dark',
                  }}
                />
              </div>
            </div>

            {/* Title */}
            <div className="col-span-3">
              <label className="block text-xs text-white/50 mb-1.5 font-medium uppercase tracking-wider">
                제목
              </label>
              <input
                type="text"
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="예: 첫 데이트"
                required
                maxLength={30}
                className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none transition-all"
                style={{
                  background: 'rgba(255,255,255,0.05)',
                  border: '1px solid rgba(255,255,255,0.08)',
                }}
              />
            </div>
          </div>

          {/* Description */}
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <label className="block text-xs text-white/50 font-medium uppercase tracking-wider">
                추억 이야기
              </label>
              <span className="text-xs text-white/25">{description.length}/500</span>
            </div>
            <textarea
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="이 순간이 특별했던 이유를 적어보세요..."
              rows={3}
              maxLength={500}
              className="w-full px-3 py-2.5 rounded-xl text-white text-sm placeholder-white/25 focus:outline-none transition-all resize-none"
              style={{
                background: 'rgba(255,255,255,0.05)',
                border: '1px solid rgba(255,255,255,0.08)',
              }}
            />
          </div>

          {/* Submit Button */}
          <button
            type="submit"
            disabled={!isValid}
            className="relative w-full py-4 rounded-2xl font-bold text-base transition-all overflow-hidden group disabled:cursor-not-allowed"
            style={{
              background: isValid
                ? 'linear-gradient(135deg, #ffd700 0%, #ff8c00 50%, #ff6b6b 100%)'
                : 'rgba(255,255,255,0.05)',
              color: isValid ? '#1a1a2e' : 'rgba(255,255,255,0.25)',
              boxShadow: isValid ? '0 10px 40px -10px rgba(255,215,0,0.5)' : 'none',
            }}
          >
            {/* Shine effect */}
            {isValid && (
              <div
                className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity"
                style={{
                  background: 'linear-gradient(90deg, transparent, rgba(255,255,255,0.3), transparent)',
                  animation: 'shine 2s ease-in-out infinite',
                }}
              />
            )}
            <span className="relative flex items-center justify-center gap-2">
              {isValid ? (
                <>
                  <svg width="20" height="20" viewBox="0 0 24 24" fill="currentColor">
                    <path d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"/>
                  </svg>
                  트리에 추억 걸기
                </>
              ) : (
                '사진과 제목을 입력해주세요'
              )}
            </span>
          </button>
        </form>
      </div>
    </div>
  );
}
