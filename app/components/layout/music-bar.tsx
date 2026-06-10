'use client';

import { useState, useRef, useEffect } from "react";

type PlaylistTrack = {
  id: string | number;
  title: string;
  artist: string;
  audioUrl: string;
};

interface MusicBarProps {
  song?: {
    title: string;
    artist: string;
    audioUrl?: string;
  } | null;
  playlist?: PlaylistTrack[];
}

export default function MusicBar({ song, playlist }: MusicBarProps) {
  const activePlaylist = playlist || [];
  const [isPlaying, setIsPlaying] = useState(false);
  const [showPlaylist, setShowPlaylist] = useState(false);
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack | null>(null);
  const audioRef = useRef<HTMLAudioElement>(null);
  const playlistRef = useRef<HTMLDivElement>(null);
  const playlistButtonRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (audioRef.current && currentTrack?.audioUrl) {
      audioRef.current.src = currentTrack.audioUrl;
      audioRef.current.play().then(() => {
        setIsPlaying(true);
      }).catch(() => {
        setIsPlaying(false);
      });
    }
  }, [currentTrack?.audioUrl]);

  useEffect(() => {
    const handleClickOutside = (e: MouseEvent) => {
      if (playlistRef.current && !playlistRef.current.contains(e.target as Node) && 
          playlistButtonRef.current && !playlistButtonRef.current.contains(e.target as Node)) {
        setShowPlaylist(false);
      }
    };
    
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
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

  const handleTrackChange = (track: PlaylistTrack) => {
    setCurrentTrack(track);
    setShowPlaylist(false);
  };

  const displayTrack = currentTrack || song;

  return (
    <div className="fixed bottom-0 left-0 right-0 w-full md:max-w-6xl mx-auto bg-black text-cream z-50">
      {displayTrack && (
        <div className="relative">
          {/* Playlist Menu - appears above bar */}
          {showPlaylist && (
            <div ref={playlistRef} className="absolute bottom-full mb-2 left-8 sm:left-12 bg-black border border-cream max-h-56 overflow-y-auto z-50 w-max max-w-xs">
              {activePlaylist.map((track: PlaylistTrack) => (
                <button
                  key={track.id}
                  onClick={() => handleTrackChange(track)}
                  className={`block w-full text-left px-3 py-2 text-sm hover:bg-pink truncate ${
                    currentTrack?.id === track.id ? 'bg-pink text-black font-bold' : ''
                  }`}
                >
                  {track.artist} - {track.title}
                </button>
              ))}
            </div>
          )}

          <div className="py-2 flex items-center gap-4">
            <div className="flex-shrink-0 bg-black px-4 py-2 flex items-center gap-3">
              {displayTrack.audioUrl && (
                <button 
                  className="cursor-pointer focus:outline-none p-1"
                  onClick={togglePlay}
                  aria-label={isPlaying ? `Pause ${displayTrack.title} by ${displayTrack.artist}` : `Play ${displayTrack.title} by ${displayTrack.artist}`}
                  aria-pressed={isPlaying}
                  type="button"
                >
                  {isPlaying ? (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M6 4h4v16H6V4zm8 0h4v16h-4V4z"/>
                    </svg>
                  ) : (
                    <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                      <path d="M8 5v14l11-7z"/>
                    </svg>
                  )}
                </button>
              )}

              {/* Playlist Button - Hamburger Menu */}
              {activePlaylist.length > 0 && (
                <button
                  ref={playlistButtonRef}
                  onClick={() => setShowPlaylist(!showPlaylist)}
                  className="cursor-pointer focus:outline-none focus-visible:ring-2 focus-visible:ring-cream p-1"
                  aria-label="Toggle playlist"
                  title="Our fave songs"
                  type="button"
                >
                  <svg className="w-5 h-5" fill="currentColor" viewBox="0 0 24 24">
                    <path d="M3 18h18v-2H3v2zm0-5h18v-2H3v2zm0-7v2h18V6H3z"/>
                  </svg>
                </button>
              )}
            </div>
            <div className="flex-1 overflow-hidden">
              <div className="animate-marquee whitespace-nowrap font-[family-name:var(--code)]">
                <span className="inline-block px-4">Now Playing: {displayTrack.artist} - {displayTrack.title}</span>
                <span className="inline-block px-4">Now Playing: {displayTrack.artist} - {displayTrack.title}</span>
                <span className="inline-block px-4">Now Playing: {displayTrack.artist} - {displayTrack.title}</span>
                <span className="inline-block px-4">Now Playing: {displayTrack.artist} - {displayTrack.title}</span>
              </div>
            </div>
          </div>
        </div>
      )}
      {displayTrack?.audioUrl && <audio ref={audioRef} src={displayTrack.audioUrl} loop />}
    </div>
  );
}
