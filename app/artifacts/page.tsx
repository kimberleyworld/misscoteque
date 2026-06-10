import { prisma } from '@/lib/prisma';
import ArchiveClient from '@/app/components/layout/archive-client';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import ArchiveBackground from '@/app/components/layout/ArchiveBackground';
import { FormsModal } from '@/app/components/layout/forms-modal';

export const dynamic = 'force-dynamic';

export default async function ArchivePage() {
  const archives = await prisma.archive.findMany({
    where: { isPublished: true },
    orderBy: { eventDate: 'desc' },
  });

  return (
    <div className="relative min-h-screen overflow-hidden flex flex-col items-center md:justify-center justify-start">
      <ArchiveBackground />

      <div className="relative z-10 max-w-6xl mx-auto px-4 sm:px-6 lg:px-12 py-8 border-black md:h-[85vh] overflow-y-auto scrollbar-hide [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none]">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center items-start gap-4 w-full mb-6">
          <Link href="/">
            <Button className="w-max" variant="outline">
              ← HOME
            </Button>
          </Link>
          <FormsModal showNotice={false} showArchive={true} className="md:items-end items-start" />
        </div>

        <h1 className="text-cream text-3xl sm:text-6xl font-impact mb-8">
          The Archive
        </h1>

        <ArchiveClient initialArchives={archives} />
      </div>
    </div>
  );
}