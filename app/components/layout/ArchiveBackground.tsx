'use client';

import { useEffect, useState } from 'react';

export default function ArchiveBackground() {
  const [mouse, setMouse] = useState({
    x: -500,
    y: -500,
  });

  useEffect(() => {
    const handleMove = (e: MouseEvent) => {
      setMouse({
        x: e.clientX,
        y: e.clientY,
      });
    };

    window.addEventListener('mousemove', handleMove);

    return () => {
      window.removeEventListener('mousemove', handleMove);
    };
  }, []);

  return (
    <div className="fixed inset-0 z-0 overflow-hidden pointer-events-none">
      {/* Sharp image */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/testBG.jpg')",
        }}
      />

      {/* Blurred layer */}
      <div
        className="absolute inset-0 bg-cover bg-center"
        style={{
          backgroundImage: "url('/images/testBG.jpg')",
          filter: 'blur(24px)',
          transform: 'scale(1.05)',

          WebkitMaskImage: `radial-gradient(
            circle 180px at ${mouse.x}px ${mouse.y}px,
            transparent 0px,
            transparent 140px,
            black 220px
          )`,

          maskImage: `radial-gradient(
            circle 180px at ${mouse.x}px ${mouse.y}px,
            transparent 0px,
            transparent 140px,
            black 220px
          )`,
        }}
      />

      {/* Dark overlay for readability */}
      <div className="absolute inset-0 bg-black/60" />
    </div>
  );
}