export default function SongMarquee() {
  const songInfo = "Now Playing: Artist Name - Song Title";
  
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
