interface SongMarqueeProps {
  title: string;
  artist: string;
}

export default function SongMarquee({ title, artist }: SongMarqueeProps) {
  const songInfo = `Now Playing: ${artist} - ${title}`;
  
  return (
    <div className="absolute top-0 left-0 w-full bg-black text-cream py-2 overflow-hidden">
      <div className="animate-marquee whitespace-nowrap font-[family-name:var(--code)]">
        <span className="inline-block px-4">{songInfo}</span>
        <span className="inline-block px-4">{songInfo}</span>
        <span className="inline-block px-4">{songInfo}</span>
        <span className="inline-block px-4">{songInfo}</span>
      </div>
    </div>
  );
}
