"use client";

import { useState, useRef, useEffect } from "react";
import Image from "next/image";

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
      <div className="absolute top-17 right-1 cursor-pointer" onClick={togglePlay}>
        <div className="relative inline-block">
          <Image
            src="/star.svg"
            alt="Star"
            width={150}
            height={150}
            className="transition-transform"
          />
          <h2 className="absolute top-18 left-9 text-2xl text-black">{isPlaying ? "Pause" : "Play"}</h2>
        </div>
      </div>
      <audio ref={audioRef} src="/song.mp3" loop />
    </div>
  );
}
