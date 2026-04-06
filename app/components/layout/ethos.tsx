"use client"

import { useState, useEffect } from "react"

const ETHOS_MESSAGES = [
  "Celebrating diversity and creativity in every form",
  "Building a vibrant community through art and music",
  "Empowering voices and fostering meaningful connections",
]

const STARS = [
  { id: 0, initialLeft: 10, initialTop: 50, size: 24, mdSize: 50 },
  { id: 1, initialLeft: 30, initialTop: 50, size: 24, mdSize: 50 },
  { id: 2, initialLeft: 50, initialTop: 50, size: 24, mdSize: 50 },
]

export function EthosSection() {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)
  const [isMobile, setIsMobile] = useState(false)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }
    checkMobile()
    window.addEventListener("resize", checkMobile)
    return () => window.removeEventListener("resize", checkMobile)
  }, [])

  return (
    <div className="w-full py-8 md:py-16 px-4 relative bg-gradient-to-b from-cream to-cream/50 min-h-96">
      <div className="max-w-4xl mx-auto text-center flex flex-col items-center">
        {/* Stars container */}
        <div className="relative w-full md:w-80 h-10 mb-6 flex justify-center items-center">
          <style>{`
            @keyframes spin {
              0% { transform: translate(-50%, -50%) rotate(0deg); }
              100% { transform: translate(-50%, -50%) rotate(360deg); }
            }
            .star-0 { animation: spin 8s linear infinite; }
            .star-1 { animation: spin 10s linear infinite; }
            .star-2 { animation: spin 12s linear infinite; }
          `}</style>

          {STARS.map((star) => (
            <button
              key={star.id}
              className={`absolute group transition-transform hover:scale-110 focus:outline-none focus-visible:ring-2 focus-visible:ring-pink star-${star.id}`}
              style={{
                left: `${star.initialLeft}%`,
                top: `${star.initialTop}%`,
              }}
              onClick={() =>
                setHoveredStar(hoveredStar === star.id ? null : star.id)
              }
              onMouseEnter={() => setHoveredStar(star.id)}
              onMouseLeave={() => setHoveredStar(null)}
              aria-label={`Ethos ${star.id + 1}`}
            >
              {/* Star */}
              <svg
                width={isMobile ? star.size : star.mdSize}
                height={isMobile ? star.size : star.mdSize}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-pink"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>


            </button>
          ))}
        </div>
        <p className="text-base md:text-lg text-black/70 mb-12 min-h-7">
          {hoveredStar !== null
            ? ETHOS_MESSAGES[hoveredStar % ETHOS_MESSAGES.length]
            : "Hover or tap on a star to discover our values."}
        </p>
      </div>
    </div>
  )
}
