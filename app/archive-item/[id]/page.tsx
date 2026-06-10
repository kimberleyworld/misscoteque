import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { extractVideoUrl } from '@/lib/extractVideoUrl';
import { ArchiveItemDisplay } from '@/app/components/layout/archive-item-display';

// Seeded random generator for deterministic star positions
function seededRandom(seed: number, index: number): number {
  const x = Math.sin(seed + index) * 10000;
  return x - Math.floor(x);
}

// Generate deterministic star positions using a while loop
function generateStars(count: number) {
  const stars: Array<{ id: number; top: number; left: number; size: string; opacity: string }> = [];
  let i = 0;
  while (i < count) {
    stars.push({
      id: i,
      top: seededRandom(12345, i) * 100,
      left: seededRandom(67890, i) * 100,
      size: ['text-lg', 'text-xl', 'text-2xl', 'text-3xl'][Math.floor(seededRandom(11111, i) * 4)],
      opacity: ['opacity-30', 'opacity-40', 'opacity-50', 'opacity-60'][Math.floor(seededRandom(22222, i) * 4)],
    });
    i++;
  }
  return stars;
}

const BACKGROUND_STARS = generateStars(50);

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
    <div className="min-h-screen w-full bg-black relative overflow-hidden">
      {/* Decorative background stars */}
      {BACKGROUND_STARS.map((star) => (
        <div
          key={star.id}
          className={`absolute text-cream pointer-events-none ${star.size} ${star.opacity}`}
          style={{ top: `${star.top}%`, left: `${star.left}%` }}
        >
          ★
        </div>
      ))}

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
    </div>
  );
}
