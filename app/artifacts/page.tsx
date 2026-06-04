import { prisma } from '@/lib/prisma';
import ArchiveClient from '@/app/components/layout/archive-client';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { getMockArchives } from '@/lib/mockArchiveData';
import ArchiveBackground from '@/app/components/layout/ArchiveBackground';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  let archives;

  try {
    archives = await prisma.archive.findMany({
      where: { isPublished: true },
      orderBy: { eventDate: 'desc' },
    });
  } catch (error) {
    console.log('Database unavailable, using mock data');
    archives = getMockArchives();
  }

  return (
    <div className="relative min-h-screen overflow-hidden">
      <ArchiveBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8">
        <Link href="/" className="inline-block mb-6">
          <Button className="bg-orange/10 border border-orange/30 text-cream hover:bg-orange/20 rounded-none">
            ← Back to Website
          </Button>
        </Link>

        <h1 className="text-cream text-3xl sm:text-6xl font-impact mb-8">
          The Archive
        </h1>

        <ArchiveClient initialArchives={archives} />
      </div>
    </div>
  );
}