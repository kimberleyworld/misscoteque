import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import Link from 'next/link';
import { Archive } from '@prisma/client';

type ArchiveWithoutFileData = Omit<Archive, 'fileData'>

interface ArchiveTileProps {
  archive: ArchiveWithoutFileData;
}

export default function ArchiveTile({ archive }: ArchiveTileProps) {
  const formattedDate = archive.eventDate 
    ? new Date(archive.eventDate).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      })
    : new Date(archive.createdAt).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });

  return (
    <Link href={`/archive-item/${archive.id}`}>
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full bg-black border border-black hover:border hover:border-cream text-cream font-impact rounded-none">
        <CardHeader>
          <p className="text-sm text-cream/60 pr-4 border-r border-black/20">{formattedDate}</p>
          <CardTitle className='text-cream font-impact pl-4 pr-4 break-words overflow-hidden' style={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 2, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {archive.title}
          </CardTitle>
        </CardHeader>
        <CardContent>
          <p className="overflow-hidden text-ellipsis text-cream text-sm" style={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {archive.description || archive.content}
          </p>
          <p className="text-xs text-cream mt-2 font-impact">
            View entry →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
