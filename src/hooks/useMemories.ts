'use client';

import { useState, useEffect, useCallback } from 'react';
import { Memory } from '@/types';

export function useMemories() {
  const [memories, setMemories] = useState<Memory[]>([]);
  const [isLoaded, setIsLoaded] = useState(false);
  const [isLoading, setIsLoading] = useState(false);

  // 모든 추억 가져오기
  const fetchMemories = useCallback(async () => {
    try {
      const response = await fetch('/api/memories');
      if (response.ok) {
        const data = await response.json();
        setMemories(data);
      }
    } catch (error) {
      console.error('Failed to fetch memories:', error);
    } finally {
      setIsLoaded(true);
    }
  }, []);

  useEffect(() => {
    fetchMemories();
  }, [fetchMemories]);

  // 새 추억 추가
  const addMemory = async (
    memory: Omit<Memory, 'id'>,
    imageFile?: File
  ): Promise<Memory | null> => {
    setIsLoading(true);
    try {
      const formData = new FormData();

      if (imageFile) {
        formData.append('image', imageFile);
      } else if (memory.imageUrl.startsWith('data:')) {
        // base64를 Blob으로 변환
        const response = await fetch(memory.imageUrl);
        const blob = await response.blob();
        formData.append('image', blob, 'image.jpg');
      }

      formData.append('date', memory.date);
      formData.append('title', memory.title);
      formData.append('description', memory.description || '');
      formData.append('positionX', String(memory.position.x));
      formData.append('positionY', String(memory.position.y));

      const res = await fetch('/api/memories', {
        method: 'POST',
        body: formData,
      });

      if (res.ok) {
        const newMemory = await res.json();
        setMemories((prev) => [...prev, newMemory]);
        return newMemory;
      }
      return null;
    } catch (error) {
      console.error('Failed to add memory:', error);
      return null;
    } finally {
      setIsLoading(false);
    }
  };

  // 추억 삭제
  const deleteMemory = async (id: string): Promise<boolean> => {
    setIsLoading(true);
    try {
      const res = await fetch(`/api/memories?id=${id}`, {
        method: 'DELETE',
      });

      if (res.ok) {
        setMemories((prev) => prev.filter((m) => m.id !== id));
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to delete memory:', error);
      return false;
    } finally {
      setIsLoading(false);
    }
  };

  return {
    memories,
    isLoaded,
    isLoading,
    addMemory,
    deleteMemory,
    refetch: fetchMemories,
  };
}
