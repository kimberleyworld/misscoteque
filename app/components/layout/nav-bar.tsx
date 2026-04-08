'use client';

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { useState, useRef, useEffect } from "react";

interface NavBarProps {
  song?: {
    title: string;
    artist: string;
    audioUrl?: string;
  } | null;
}

export default function NavBar({ song }: NavBarProps) {
  const pathname = usePathname();
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current && song?.audioUrl) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [song?.audioUrl]);

  const togglePlay = () => {
    if (audioRef.current) {
      if (isPlaying) {
        audioRef.current.pause();
      } else {
        audioRef.current.play();
      }
      setIsPlaying(!isPlaying);
    }
  };

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/artifacts", label: "Archive" },
    { href: "/#community-notice", label: "Community Notice Board" },
    { href: "/#crossword", label: "Crossword" },
  ];

  return (
    <div className="w-full bg-black text-cream border-b-2 border-cream sticky top-0 z-50">
      {song && (
        <div className="overflow-hidden py-2">
          <div className="animate-marquee whitespace-nowrap font-[family-name:var(--code)]">
            <span className="inline-block px-4">Now Playing: {song.artist} - {song.title}</span>
            <span className="inline-block px-4">Now Playing: {song.artist} - {song.title}</span>
            <span className="inline-block px-4">Now Playing: {song.artist} - {song.title}</span>
            <span className="inline-block px-4">Now Playing: {song.artist} - {song.title}</span>
          </div>
        </div>
      )}
      <nav className="font-[family-name:var(--code)] py-1 border-t-2 border-cream relative">
        <div className="flex justify-center items-center gap-4 md:gap-8 border-t-2 border-cream relative">
          {song && song.audioUrl && (
            <button 
              className="absolute left-0 -top-12 md:-top-16 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-black rounded-full"
              onClick={togglePlay}
              aria-label={isPlaying ? `Pause ${song.title} by ${song.artist}` : `Play ${song.title} by ${song.artist}`}
              aria-pressed={isPlaying}
              type="button"
            >
              <div className="relative inline-block">
                <Image
                  src="/star.png"
                  alt=""
                  width={100}
                  height={100}
                  className="transition-opacity hover:opacity-50"
                  style={{ filter: 'invert(0.35) sepia(0.9) hue-rotate(270deg) saturate(1.5) brightness(1.1)' }}
                  aria-hidden="true"
                />
                <div className="absolute top-15 left-11 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
                  {isPlaying ? (
                    <svg className="w-6 h-6" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#1e1e1e' }}>
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-8 h-8" fill="currentColor" viewBox="0 0 24 24" style={{ color: '#1e1e1e' }}>
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </div>
              </div>
            </button>
          )}
          {navItems.map((item) => (
            <Link
              key={item.href}
              href={item.href}
              className={`text-sm md:text-base transition-all mt-1 duration-300 hover:underline tracking-widest ${
                pathname === item.href ? "font-bold underline" : ""
              }`}
            >
              {item.label}
            </Link>
          ))}
        </div>
      </nav>
      {song?.audioUrl && <audio ref={audioRef} src={song.audioUrl} loop />}
    </div>
  );
}
