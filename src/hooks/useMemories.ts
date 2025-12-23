'use client';

import { useState, useEffect } from 'react';
import { Memory } from '@/types';

const STORAGE_KEY = 'christmas-memories-2024';

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);

  useEffect(() => {
    const stored = localStorage.getItem(STORAGE_KEY);
    if (stored) {
      try {
        setMemories(JSON.parse(stored));
      } catch (e) {
        console.error('Failed to parse memories:', e);
      }
    }
    setIsLoaded(true);
  }, []);

  useEffect(() => {
    if (isLoaded) {
      localStorage.setItem(STORAGE_KEY, JSON.stringify(memories));
    }
  }, [memories, isLoaded]);

  const addMemory = (memory: Omit<Memory, 'id'>) => {
    const newMemory: Memory = {
      ...memory,
      id: Date.now().toString(),
    };
    setMemories((prev) => [...prev, newMemory]);
    return newMemory;
  };

  const updateMemory = (id: string, updates: Partial<Memory>) => {
    setMemories((prev) =>
      prev.map((m) => (m.id === id ? { ...m, ...updates } : m))
    );
  };

  const deleteMemory = (id: string) => {
    setMemories((prev) => prev.filter((m) => m.id !== id));
  };

  return {
    memories,
    isLoaded,
    addMemory,
    updateMemory,
    deleteMemory,
  };
}
