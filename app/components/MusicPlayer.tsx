"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SongMarquee from "../components/SongMarquee";

interface MusicPlayerProps {
  title: string;
  artist: string;
  audioUrl: string;
}

export default function MusicPlayer({ title, artist, audioUrl }: MusicPlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);

  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch((error) => {
        console.log("Autoplay prevented:", error);
        setIsPlaying(false);
      });
    }
  }, []);

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

  return (
    <div className="">
      <SongMarquee title={title} artist={artist} />
      <button 
        className="absolute top-32 right-5 md:right-40 md:top-45 cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-cream focus-visible:ring-offset-2 focus-visible:ring-offset-red rounded-full"
        onClick={togglePlay}
        aria-label={isPlaying ? `Pause ${title} by ${artist}` : `Play ${title} by ${artist}`}
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
            aria-hidden="true"
          />
          <div className="absolute top-15 left-11 -translate-x-1/2 -translate-y-1/2" aria-hidden="true">
            {isPlaying ? (
              <svg className="w-6 h-6 text-cream" fill="currentColor" viewBox="0 0 24 24">
                <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
              </svg>
            ) : (
              <svg className="w-8 h-8 text-cream" fill="currentColor" viewBox="0 0 24 24">
                <path d="M8 5v14l11-7z"/>
              </svg>
            )}
          </div>
        </div>
        <span className="sr-only">{isPlaying ? 'Pause' : 'Play'} music</span>
      </button>
      <audio ref={audioRef} src={audioUrl} loop aria-label={`Now playing: ${title} by ${artist}`} />
    </div>
  );
}
