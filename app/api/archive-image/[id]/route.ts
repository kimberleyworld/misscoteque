import { prisma } from '@/lib/prisma';
import { getMockArchiveById } from '@/lib/mockArchiveData';
import { NextRequest, NextResponse } from 'next/server';

export async function GET(
  request: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const resolvedParams = await params;
    const { id } = resolvedParams;

    let archive;
    try {
      archive = await prisma.archive.findUnique({
        where: { id },
        select: {
          fileData: true,
          fileMimeType: true,
        },
      });
    } catch {
      archive = getMockArchiveById(id);
    }

    if (!archive?.fileData || !archive?.fileMimeType?.startsWith('image/')) {
      return NextResponse.json({ error: 'Image not found' }, { status: 404 });
    }

    const buffer = Buffer.isBuffer(archive.fileData)
      ? archive.fileData
      : Buffer.from(archive.fileData);

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': archive.fileMimeType,
        'Cache-Control': 'public, max-age=31536000, immutable',
        'Content-Length': buffer.length.toString(),
      },
    });
  } catch (error) {
    console.error('Error serving archive image:', error);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
