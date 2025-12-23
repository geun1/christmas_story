import { put, list, del } from '@vercel/blob';
import { NextRequest, NextResponse } from 'next/server';

export const runtime = 'edge';

interface MemoryData {
  id: string;
  date: string;
  title: string;
  description: string;
  imageUrl: string;
  position: { x: number; y: number };
  createdAt: string;
}

const MEMORIES_JSON_KEY = 'memories/data.json';

async function getMemoriesData(): Promise<MemoryData[]> {
  try {
    const { blobs } = await list({ prefix: 'memories/data' });
    const dataBlob = blobs.find(b => b.pathname === MEMORIES_JSON_KEY);

    if (!dataBlob) {
      return [];
    }

    const response = await fetch(dataBlob.url);
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
}

async function saveMemoriesData(memories: MemoryData[]): Promise<void> {
  await put(MEMORIES_JSON_KEY, JSON.stringify(memories), {
    access: 'public',
    addRandomSuffix: false,
  });
}

// GET - 모든 추억 가져오기
export async function GET() {
  try {
    const memories = await getMemoriesData();
    return NextResponse.json(memories);
  } catch (error) {
    console.error('GET error:', error);
    return NextResponse.json({ error: 'Failed to fetch memories' }, { status: 500 });
  }
}

// POST - 새 추억 추가
export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const image = formData.get('image') as File;
    const date = formData.get('date') as string;
    const title = formData.get('title') as string;
    const description = formData.get('description') as string;
    const positionX = parseFloat(formData.get('positionX') as string) || 0;
    const positionY = parseFloat(formData.get('positionY') as string) || 0;

    if (!image || !date || !title) {
      return NextResponse.json({ error: 'Missing required fields' }, { status: 400 });
    }

    // 이미지 업로드
    const id = Date.now().toString();
    const imageExtension = image.name.split('.').pop() || 'jpg';
    const imagePath = `memories/images/${id}.${imageExtension}`;

    const imageBlob = await put(imagePath, image, {
      access: 'public',
      addRandomSuffix: false,
    });

    // 메타데이터 저장
    const memories = await getMemoriesData();
    const newMemory: MemoryData = {
      id,
      date,
      title,
      description: description || '',
      imageUrl: imageBlob.url,
      position: { x: positionX, y: positionY },
      createdAt: new Date().toISOString(),
    };

    memories.push(newMemory);
    await saveMemoriesData(memories);

    return NextResponse.json(newMemory, { status: 201 });
  } catch (error) {
    console.error('POST error:', error);
    return NextResponse.json({ error: 'Failed to create memory' }, { status: 500 });
  }
}

// DELETE - 추억 삭제
export async function DELETE(request: NextRequest) {
  try {
    const { searchParams } = new URL(request.url);
    const id = searchParams.get('id');

    if (!id) {
      return NextResponse.json({ error: 'Missing id' }, { status: 400 });
    }

    const memories = await getMemoriesData();
    const memoryToDelete = memories.find(m => m.id === id);

    if (!memoryToDelete) {
      return NextResponse.json({ error: 'Memory not found' }, { status: 404 });
    }

    // 이미지 삭제
    try {
      await del(memoryToDelete.imageUrl);
    } catch (e) {
      console.error('Failed to delete image:', e);
    }

    // 메타데이터에서 제거
    const updatedMemories = memories.filter(m => m.id !== id);
    await saveMemoriesData(updatedMemories);

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error('DELETE error:', error);
    return NextResponse.json({ error: 'Failed to delete memory' }, { status: 500 });
  }
}
