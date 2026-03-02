import { prisma } from '@/lib/prisma';
import ArchiveClient from '@/app/components/layout/archive-client';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const archives = await prisma.archive.findMany({
    where: { isPublished: true },
    orderBy: { eventDate: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <h1 className="text-pink text-3xl sm:text-4xl font-impact mb-8">The Archive</h1>
      <ArchiveClient initialArchives={archives} />
    </div>
  );
}