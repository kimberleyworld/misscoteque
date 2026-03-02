import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import Link from 'next/link';
import { Archive } from '@prisma/client';

interface ArchiveTileProps {
  archive: Archive;
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
      <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full border-pink/20 bg-cream/5 rounded-none">
        <CardHeader>
          <CardTitle className='text-pink font-impact'>{archive.title}</CardTitle>
        </CardHeader>
        <CardContent>
          <p className="text-sm text-black/60 mb-2">{formattedDate}</p>
          <p className="overflow-hidden text-ellipsis text-black text-sm" style={{ 
            display: '-webkit-box', 
            WebkitLineClamp: 3, 
            WebkitBoxOrient: 'vertical' 
          }}>
            {archive.description || archive.content}
          </p>
          <p className="text-xs text-orange mt-2 font-impact">
            View entry →
          </p>
        </CardContent>
      </Card>
    </Link>
  );
}
