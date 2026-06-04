import { prisma } from '@/lib/prisma';
import { notFound } from 'next/navigation';
import { Card, CardHeader, CardTitle, CardContent } from '@/app/components/ui/card';
import { Button } from '@/app/components/ui/button';
import Link from 'next/link';
import { ArrowLeft } from 'lucide-react';
import { extractVideoUrl } from '@/lib/extractVideoUrl';
import { getMockArchiveById } from '@/lib/mockArchiveData';

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
  } catch (error) {
    console.log('Database unavailable, using mock data');
    archive = getMockArchiveById(resolvedParams.id);
  }

  if (!archive || !archive.isPublished) {
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
    <div className="max-w-4xl mx-auto p-6 bg-black">
      <div className="mb-6">
        <Link href="/artifacts">
          <Button variant="outline" className="flex items-center gap-2 border-pink/20 bg-cream/5 text-cream hover:bg-pink/10 rounded-none">
            <ArrowLeft className="h-4 w-4" />
            Back to Archive
          </Button>
        </Link>
      </div>

      <Card className="border-pink/20 bg-cream/5 rounded-none">
        <CardHeader>
          <CardTitle className="text-3xl text-cream font-impact">{archive.title}</CardTitle>
          <p className="text-cream/60 text-sm mt-2">{formattedDate}</p>
        </CardHeader>
        <CardContent className="space-y-6">
          {/* Display URL/video if available */}
          {videoData && videoData.provider === 'youtube' && (
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={videoData.embedUrl}
                title="YouTube video"
                frameBorder="0"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
                className="rounded"
              />
            </div>
          )}

          {videoData && videoData.provider === 'vimeo' && (
            <div className="w-full aspect-video">
              <iframe
                width="100%"
                height="100%"
                src={videoData.embedUrl}
                title="Vimeo video"
                frameBorder="0"
                allow="autoplay; fullscreen; picture-in-picture"
                allowFullScreen
                className="rounded"
              />
            </div>
          )}

          {!videoData && archive.URL && (
            <div className="p-4 bg-orange/10 border border-orange/20 rounded">
              <p className="text-cream text-sm mb-2">External Link:</p>
              <a
                href={archive.URL}
                target="_blank"
                rel="noopener noreferrer"
                className="text-orange font-impact hover:underline break-all"
              >
                {archive.URL} →
              </a>
            </div>
          )}

          {/* Display uploaded file if available */}
          {archive.fileData && archive.fileMimeType && (
            <div className="p-4 bg-orange/10 border border-orange/20 rounded">
              {archive.fileMimeType.startsWith('image/') && (
                <div className="flex justify-center">
                  <img
                    src={`data:${archive.fileMimeType};base64,${Buffer.from(archive.fileData).toString('base64')}`}
                    alt={archive.title}
                    className="max-w-full h-auto rounded"
                  />
                </div>
              )}
              {archive.fileMimeType.startsWith('audio/') && (
                <audio controls className="w-full">
                  <source
                    src={`data:${archive.fileMimeType};base64,${Buffer.from(archive.fileData).toString('base64')}`}
                    type={archive.fileMimeType}
                  />
                  Your browser does not support the audio element.
                </audio>
              )}
              {archive.fileMimeType === 'application/pdf' && (
                <div>
                  <p className="text-cream text-sm mb-2">PDF Document: {archive.fileName}</p>
                  <a
                    href={`data:application/pdf;base64,${Buffer.from(archive.fileData).toString('base64')}`}
                    download={archive.fileName}
                    className="inline-block px-4 py-2 bg-pink text-cream font-impact rounded hover:bg-pink/90"
                  >
                    Download PDF
                  </a>
                </div>
              )}
            </div>
          )}

          {/* Display main content */}
          <div className="prose prose-invert max-w-none">
            <p className="text-cream whitespace-pre-line leading-relaxed">{archive.content}</p>
          </div>

          {/* Show description if it exists and differs from content */}
          {archive.description && archive.description !== archive.content && (
            <div className="pt-6 border-t border-orange/20">
              <h3 className="text-lg font-impact text-cream mb-2">About</h3>
              <p className="text-cream leading-relaxed">{archive.description}</p>
            </div>
          )}
        </CardContent>
      </Card>
    </div>
  );
}
