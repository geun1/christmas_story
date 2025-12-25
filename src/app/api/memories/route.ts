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

    // 캐시 비활성화하여 최신 데이터 가져오기
    const response = await fetch(dataBlob.url, {
      cache: 'no-store',
      headers: {
        'Cache-Control': 'no-cache',
      },
    });
    const data = await response.json();
    return data;
  } catch (error) {
    console.error('Error fetching memories:', error);
    return [];
  }
}

async function saveMemoriesData(memories: MemoryData[]): Promise<void> {
  // contentType을 명시하여 JSON으로 저장
  await put(MEMORIES_JSON_KEY, JSON.stringify(memories), {
    access: 'public',
    addRandomSuffix: false,
    contentType: 'application/json',
    allowOverwrite: true,
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

// PATCH - 이미지에서 데이터 복구
export async function PATCH() {
  try {
    // 기존 메모리 데이터 가져오기
    const existingMemories = await getMemoriesData();
    const existingImageUrls = new Set(existingMemories.map(m => m.imageUrl));
    const existingIds = new Set(existingMemories.map(m => m.id));

    // blob에서 모든 이미지 목록 가져오기
    const { blobs } = await list({ prefix: 'memories/images/' });

    const recoveredMemories: MemoryData[] = [...existingMemories];
    let recoveredCount = 0;

    for (const blob of blobs) {
      // 이미 존재하는 이미지는 건너뛰기
      if (existingImageUrls.has(blob.url)) {
        continue;
      }

      // 파일명에서 ID 추출 (예: memories/images/1234567890.jpg -> 1234567890)
      const filename = blob.pathname.split('/').pop() || '';
      const id = filename.split('.')[0];

      if (!id) continue;

      // 이미 같은 ID가 있으면 건너뛰기
      if (existingIds.has(id)) {
        continue;
      }

      // 타임스탬프로부터 날짜 추출 시도
      const timestamp = parseInt(id);
      const date = !isNaN(timestamp)
        ? new Date(timestamp).toISOString().split('T')[0]
        : new Date().toISOString().split('T')[0];

      const newMemory: MemoryData = {
        id,
        date,
        title: `복구된 추억 ${recoveredCount + 1}`,
        description: '이미지에서 복구됨 - 제목과 내용을 수정해주세요',
        imageUrl: blob.url,
        position: { x: 0, y: 0 },
        createdAt: new Date().toISOString(),
      };

      recoveredMemories.push(newMemory);
      existingIds.add(id);
      recoveredCount++;
    }

    // 복구된 데이터 저장
    if (recoveredCount > 0) {
      await saveMemoriesData(recoveredMemories);
    }

    return NextResponse.json({
      success: true,
      recovered: recoveredCount,
      total: recoveredMemories.length,
      memories: recoveredMemories,
    });
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : 'Unknown error';
    console.error('PATCH error:', errorMessage);
    return NextResponse.json({ error: 'Failed to recover memories', details: errorMessage }, { status: 500 });
  }
}
