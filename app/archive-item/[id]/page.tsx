import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { extractVideoUrl } from '@/lib/extractVideoUrl';
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
  
  const archive = await prisma.archive.findUnique({
    where: {
      id: resolvedParams.id,
    },
  });

  if (!archive) {
    notFound();
  }

  if (!archive.isPublished) {
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
