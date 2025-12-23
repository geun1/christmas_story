'use client';

import { useState } from 'react';
import { Memory } from '@/types';
import { useMemories } from '@/hooks/useMemories';
import Snowfall from '@/components/Snowfall';
import Header from '@/components/Header';
import ChristmasTree from '@/components/ChristmasTree';
import MemoryModal from '@/components/MemoryModal';
import AddMemoryModal from '@/components/AddMemoryModal';
import StoryView from '@/components/StoryView';

export default function Home() {
  const { memories, isLoaded, isLoading, addMemory, deleteMemory } = useMemories();
  const [selectedMemory, setSelectedMemory] = useState<Memory | null>(null);
  const [isMemoryModalOpen, setIsMemoryModalOpen] = useState(false);
  const [isAddModalOpen, setIsAddModalOpen] = useState(false);
  const [isStoryMode, setIsStoryMode] = useState(false);

  const handleOrnamentClick = (memory: Memory) => {
    setSelectedMemory(memory);
    setIsMemoryModalOpen(true);
  };

  const handleAddClick = () => {
    setIsAddModalOpen(true);
  };

  const handleAddMemory = async (memory: Omit<Memory, 'id'>) => {
    return await addMemory(memory);
  };

  const handleDeleteMemory = (id: string) => {
    deleteMemory(id);
    setIsMemoryModalOpen(false);
  };

  if (!isLoaded) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="flex flex-col items-center gap-4">
          <div
            className="w-12 h-12 rounded-full border-2 border-yellow-400/30 border-t-yellow-400 animate-spin"
          />
          <span className="text-white/50 text-sm">추억을 불러오는 중...</span>
        </div>
      </div>
    );
  }

  // Story mode
  if (isStoryMode) {
    return <StoryView memories={memories} onClose={() => setIsStoryMode(false)} />;
  }

  return (
    <main className="min-h-screen min-h-[100dvh] relative overflow-hidden">
      {/* Aurora Background */}
      <div className="aurora" />

      {/* Snowfall Effect */}
      <Snowfall />

      {/* Background Stars */}
      <div className="fixed inset-0 pointer-events-none">
        {[...Array(30)].map((_, i) => (
          <div
            key={i}
            className="star"
            style={{
              left: `${(i * 3.3) % 100}%`,
              top: `${(i * 7) % 40}%`,
              animationDelay: `${i * 0.3}s`,
              animationDuration: `${2 + (i % 3)}s`,
            }}
          />
        ))}
      </div>

      {/* Content */}
      <div className="relative z-10 px-6 pb-32">
        {/* Header */}
        <Header />

        {/* Christmas Tree with Ornaments */}
        <ChristmasTree
          memories={memories}
          onOrnamentClick={handleOrnamentClick}
          onAddClick={handleAddClick}
        />
      </div>

      {/* Story Button - Top right */}
      {memories.length > 0 && (
        <button
          onClick={() => setIsStoryMode(true)}
          className="fixed top-8 right-8 z-40 flex items-center gap-3 px-5 py-3 rounded-full transition-all active:scale-95"
          style={{
            background: 'linear-gradient(135deg, rgba(255,255,255,0.15) 0%, rgba(255,255,255,0.05) 100%)',
            backdropFilter: 'blur(10px)',
            border: '1px solid rgba(255,255,255,0.2)',
            boxShadow: '0 4px 20px rgba(0,0,0,0.2)',
          }}
        >
          <svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" className="text-white">
            <polygon points="5 3 19 12 5 21 5 3" fill="currentColor" />
          </svg>
          <span className="text-white text-sm font-medium">Story</span>
        </button>
      )}

      {/* Floating Add Button */}
      <button
        onClick={handleAddClick}
        className="add-button fixed bottom-8 right-8 w-16 h-16 rounded-full text-3xl font-light z-40 flex items-center justify-center transition-transform active:scale-95"
        style={{
          background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)',
          color: '#1a1a2e',
          boxShadow: '0 8px 30px -5px rgba(255, 215, 0, 0.5), 0 0 0 1px rgba(255,255,255,0.1)',
        }}
      >
        <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5">
          <line x1="12" y1="5" x2="12" y2="19" />
          <line x1="5" y1="12" x2="19" y2="12" />
        </svg>
      </button>

      {/* Memory Count Badge */}
      <div
        className="fixed bottom-8 left-8 px-5 py-2.5 rounded-full z-40"
        style={{
          background: 'rgba(255,255,255,0.08)',
          backdropFilter: 'blur(10px)',
          border: '1px solid rgba(255,255,255,0.1)',
        }}
      >
        {/* <div className="flex items-center gap-2">
          <div
            className="w-2 h-2 rounded-full"
            style={{ background: 'linear-gradient(135deg, #ffd700 0%, #ff8c00 100%)' }}
          />
          <span className="text-white/70 text-sm font-medium">
            {memories.length}개의 추억
          </span>
        </div> */}
      </div>

      {/* Memory View Modal */}
      <MemoryModal
        memory={selectedMemory}
        isOpen={isMemoryModalOpen}
        onClose={() => setIsMemoryModalOpen(false)}
        onDelete={handleDeleteMemory}
      />

      {/* Add Memory Modal */}
      <AddMemoryModal
        isOpen={isAddModalOpen}
        onClose={() => setIsAddModalOpen(false)}
        onAdd={handleAddMemory}
        isLoading={isLoading}
      />
    </main>
  );
}
