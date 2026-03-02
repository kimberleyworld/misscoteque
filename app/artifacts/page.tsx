import { prisma } from '@/lib/prisma';
import ArchiveClient from '@/app/components/layout/archive-client';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const archives = await prisma.archive.findMany({
    where: { isPublished: true },
    orderBy: { eventDate: 'desc' },
  });

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
      <Link href="/" className="inline-block mb-6">
        <Button className="bg-orange/10 border border-orange/30 text-black hover:bg-orange/20 rounded-none">
          ← Back to Website
        </Button>
      </Link>
      <h1 className="text-pink text-3xl sm:text-4xl font-impact mb-8">The Archive</h1>
      <ArchiveClient initialArchives={archives} />
    </div>
  );
}