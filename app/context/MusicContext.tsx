'use client';

import React, { createContext, useContext, useState, useRef, useEffect, ReactNode } from 'react';

type PlaylistTrack = {
  id: string | number;
  title: string;
  artist: string;
  audioUrl: string;
};

interface MusicContextType {
  playlist: PlaylistTrack[];
  currentTrack: PlaylistTrack | null;
  isPlaying: boolean;
  setPlaylist: (playlist: PlaylistTrack[]) => void;
  setCurrentTrack: (track: PlaylistTrack | null) => void;
  setIsPlaying: (playing: boolean) => void;
  playNext: () => void;
  playPrevious: () => void;
  audioRef: React.RefObject<HTMLAudioElement | null>;
  pageType: 'default' | 'archive';
  setPageType: (type: 'default' | 'archive') => void;
  pauseMusic: () => void;
}

const MusicContext = createContext<MusicContextType | undefined>(undefined);

export function MusicProvider({ children }: { children: ReactNode }) {
  const [playlist, setPlaylist] = useState<PlaylistTrack[]>([]);
  const [currentTrack, setCurrentTrack] = useState<PlaylistTrack | null>(null);
  const [isPlaying, setIsPlaying] = useState(false);
  const [pageType, setPageType] = useState<'default' | 'archive'>('default');
  const audioRef = useRef<HTMLAudioElement>(null);

  // Auto-play next song when current ends
  useEffect(() => {
    const audio = audioRef.current;
    if (!audio) return;

    const handleEnded = () => {
      if (playlist.length === 0) return;
      
      const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
      const nextIndex = (currentIndex + 1) % playlist.length;
      setCurrentTrack(playlist[nextIndex]);
    };

    audio.addEventListener('ended', handleEnded);
    return () => audio.removeEventListener('ended', handleEnded);
  }, [playlist, currentTrack?.id]);

  const playNext = () => {
    if (playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
    const nextIndex = (currentIndex + 1) % playlist.length;
    setCurrentTrack(playlist[nextIndex]);
  };

  const playPrevious = () => {
    if (playlist.length === 0) return;
    
    const currentIndex = playlist.findIndex(t => t.id === currentTrack?.id);
    const prevIndex = (currentIndex - 1 + playlist.length) % playlist.length;
    setCurrentTrack(playlist[prevIndex]);
  };

  const pauseMusic = () => {
    if (audioRef.current) {
      audioRef.current.pause();
      setIsPlaying(false);
    }
  };

  const value: MusicContextType = {
    playlist,
    currentTrack,
    isPlaying,
    setPlaylist,
    setCurrentTrack,
    setIsPlaying,
    playNext,
    playPrevious,
    audioRef,
    pageType,
    setPageType,
    pauseMusic,
  };

  return (
    <MusicContext.Provider value={value}>
      {children}
    </MusicContext.Provider>
  );
}

export function useMusicContext() {
  const context = useContext(MusicContext);
  if (!context) {
    throw new Error('useMusicContext must be used within MusicProvider');
  }
  return context;
}
