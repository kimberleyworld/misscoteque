'use client';

import Image from "next/image";
import { useState, useRef, useEffect, useCallback } from "react";

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

interface PosterPosition {
  x: number;
  y: number;
}

export function PosterGrid({ posters: initialPosters }: PosterGridProps) {
  const [order, setOrder] = useState(initialPosters.map((_, i) => i));
  const [positions, setPositions] = useState<PosterPosition[]>(
    initialPosters.map((_, i) => ({ x: i * 8, y: i * 8 }))
  );
  const [dragging, setDragging] = useState<number | null>(null);
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 });
  const [posterDims, setPosterDims] = useState({ width: 192, height: 256 });
  const containerRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const updateDimensions = () => {
      if (window.innerWidth < 768) {
        setPosterDims({ width: 120, height: 150 });
      }
    };
    updateDimensions();
    window.addEventListener("resize", updateDimensions);
    return () => window.removeEventListener("resize", updateDimensions);
  }, []);

  useEffect(() => {
    if (!containerRef.current) return;

    const containerRect = containerRef.current.getBoundingClientRect();
    const { width: posterWidth, height: posterHeight } = posterDims;

    const newPositions = initialPosters.map(() => {
      const randomX = Math.random() * Math.max(0, containerRect.width - posterWidth);
      const randomY = Math.random() * Math.max(0, containerRect.height - posterHeight);
      return { x: randomX, y: randomY };
    });

    setPositions(newPositions);
  }, [initialPosters, posterDims]);

  const getPosterDimensions = useCallback(() => posterDims, [posterDims]);

  const handlePointerDown = (index: number, e: React.PointerEvent) => {
    e.preventDefault();
    
    // Bring to front
    const newOrder = order.filter((i) => i !== index);
    setOrder([...newOrder, index]);

    // Start dragging
    setDragging(index);
    const rect = (e.currentTarget as HTMLElement).getBoundingClientRect();
    const containerRect = containerRef.current?.getBoundingClientRect();
    
    if (containerRect) {
      setDragOffset({
        x: e.clientX - rect.left,
        y: e.clientY - rect.top,
      });
    }
  };

  useEffect(() => {
    if (dragging === null) return;

    const handlePointerMove = (e: PointerEvent) => {
      const containerRect = containerRef.current?.getBoundingClientRect();
      if (!containerRect) return;

      let newX = e.clientX - containerRect.left - dragOffset.x;
      let newY = e.clientY - containerRect.top - dragOffset.y;

      // Constrain to container bounds using responsive dimensions
      const { width: posterWidth, height: posterHeight } = getPosterDimensions();
      
      newX = Math.max(0, Math.min(newX, containerRect.width - posterWidth));
      newY = Math.max(0, Math.min(newY, containerRect.height - posterHeight));

      setPositions((prev) => {
        const updated = [...prev];
        updated[dragging] = { x: newX, y: newY };
        return updated;
      });
    };

    const handlePointerUp = () => {
      setDragging(null);
    };

    document.addEventListener("pointermove", handlePointerMove);
    document.addEventListener("pointerup", handlePointerUp);

    return () => {
      document.removeEventListener("pointermove", handlePointerMove);
      document.removeEventListener("pointerup", handlePointerUp);
    };
  }, [dragging, dragOffset, posterDims, getPosterDimensions]);

  if (initialPosters.length === 0) {
    return (
      <div className="w-full px-4 sm:px-0 mb-8">
        <p className="text-center text-gray-500">No posters available yet.</p>
      </div>
    );
  }

  return (
    <div id="poster-gallery" className="w-full px-4 sm:px-0 flex justify-center">
      {/* Grid Layout for Mobile & Tablet */}
      <div className="w-full md:hidden">
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 pb-8">
          {initialPosters.map((poster) => (
            <div
              key={poster.id}
              className="relative aspect-[3/4] overflow-hidden"
            >
              <Image
                src={poster.imageUrl}
                alt={poster.imageAlt}
                fill
                sizes="(max-width: 640px) 160px, 240px"
                className="object-cover"
                draggable={false}
              />
            </div>
          ))}
        </div>
      </div>

      {/* Draggable Layout for Desktop */}
      <div className="hidden md:flex md:justify-center w-full flex-col">
        <p className="text-center text-sm text-black/60 mb-4">Click and drag to arrange posters</p>
        <div
          ref={containerRef}
          className="relative w-full select-none h-[70vh]"
          style={{ touchAction: "none" }}
        >
          {initialPosters.map((poster, index) => {
            const zIndex = order.indexOf(index);
            const { x, y } = positions[index];
            const { width: posterWidth, height: posterHeight } = getPosterDimensions();

            return (
              <div
                key={poster.id}
                onPointerDown={(e) => handlePointerDown(index, e)}
                className={`absolute transition-opacity select-none ${
                  dragging === index ? "cursor-grabbing" : "cursor-grab"
                }`}
                suppressHydrationWarning
                style={{
                  left: `${x}px`,
                  top: `${y}px`,
                  zIndex,
                  opacity: dragging === index ? 0.9 : 1,
                  width: `${posterWidth}px`,
                  height: `${posterHeight}px`,
                }}
              >
                <div className="relative w-full h-full overflow-hidden">
                  <Image
                    src={poster.imageUrl}
                    alt={poster.imageAlt}
                    fill
                    sizes="192px"
                    className="object-cover pointer-events-none"
                    draggable={false}
                  />
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
