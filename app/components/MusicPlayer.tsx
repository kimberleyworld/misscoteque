"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";
import SongMarquee from "../components/SongMarquee";


export default function MusicPlayer() {
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
      <SongMarquee />
      <div className="absolute top-32 right-5 md:right-40 md:top-45  cursor-pointer" onClick={togglePlay}>
        <div className="relative inline-block">
          <Image
            src="/star.png"
            alt="Star"
            width={100}
            height={100}
            className="transition-opacity hover:opacity-50"
          />
          <div className="absolute top-15 left-11 -translate-x-1/2 -translate-y-1/2">
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
      </div>
      <audio ref={audioRef} src="/song.mp3" loop />
    </div>
  );
}
