import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { extractVideoUrl } from '@/lib/extractVideoUrl';
import { getMockArchiveById } from '@/lib/mockArchiveData';
import { ArchiveItemDisplay } from '@/app/components/layout/archive-item-display';

interface ArchiveItemPageProps {
  params: Promise<{
    id: string;
  }>;
}

export default async function ArchiveItemPage({ params }: ArchiveItemPageProps) {
  const resolvedParams = await params;
  
  if (!resolvedParams.id) {
    notFound();
  }
  
  let archive;
  try {
    archive = await prisma.archive.findUnique({
      where: {
        id: resolvedParams.id,
      },
    });
    console.log('Archive found from DB:', archive?.title, 'Published:', archive?.isPublished);
  } catch (error) {
    console.log('Database error:', error);
    console.log('Database unavailable, using mock data');
    archive = getMockArchiveById(resolvedParams.id);
    console.log('Archive from mock:', archive?.title);
  }

  if (!archive) {
    console.log('Archive not found at all');
    notFound();
  }

  console.log('Archive isPublished:', archive.isPublished);

  if (!archive.isPublished) {
    console.log('Archive is not published, showing 404');
    notFound();
  }

  const formattedDate = archive.eventDate
    ? new Date(archive.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      })
    : new Date(archive.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });

  const videoData = archive.URL ? extractVideoUrl(archive.URL) : null;

  return (
    <ArchiveItemDisplay
      archive={{
        id: archive.id,
        title: archive.title,
        description: archive.description,
        content: archive.content || '',
        URL: archive.URL,
        fileData: archive.fileData,
        fileMimeType: archive.fileMimeType,
        fileName: archive.fileName,
        eventDate: archive.eventDate,
        createdAt: archive.createdAt,
      }}
      formattedDate={formattedDate}
      videoData={videoData}
    />
  );
}
