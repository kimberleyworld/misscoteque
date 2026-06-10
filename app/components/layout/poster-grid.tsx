import Image from "next/image";

export interface Poster {
  id: string;
  title: string;
  imageUrl: string;
  imageAlt: string;
  date?: string;
}

interface PosterGridProps {
  posters: Poster[];
}

export function PosterGrid({ posters }: PosterGridProps) {
  if (posters.length === 0) {
    return (
      <div className="w-full px-4 sm:px-0 mb-8">
        <p className="text-center text-gray-500">No posters available yet.</p>
      </div>
    );
  }

  return (
    <div className="w-full px-4 sm:px-0 mb-8">
      <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
        {posters.map((poster) => (
          <div key={poster.id} className="flex flex-col gap-2">
            <div className="relative w-full aspect-[3/4] overflow-hidden">
              <Image
                src={poster.imageUrl}
                alt={poster.imageAlt}
                fill
                sizes="(max-width: 768px) 50vw, 25vw"
                className="object-cover"
              />
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
