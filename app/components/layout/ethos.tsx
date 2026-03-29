"use client"

import { useState } from "react"

const ETHOS_MESSAGES = [
  "Celebrating diversity and creativity in every form",
  "Building a vibrant community through art and music",
  "Empowering voices and fostering meaningful connections",
]

const STARS = [
  { id: 0, initialLeft: 20, initialTop: 20, size: 24 },
  { id: 1, initialLeft: 80, initialTop: 15, size: 32 },
  { id: 2, initialLeft: 50, initialTop: 50, size: 20 },
  { id: 3, initialLeft: 15, initialTop: 75, size: 28 },
  { id: 4, initialLeft: 85, initialTop: 80, size: 24 },
]

export function EthosSection() {
  const [hoveredStar, setHoveredStar] = useState<number | null>(null)

  return (
    <div className="w-full py-16 px-4 relative bg-gradient-to-b from-cream to-cream/50 min-h-96">
      <div className="max-w-4xl mx-auto text-center">
        <h2 className="text-4xl font-impact text-pink mb-4">Our Ethos</h2>
        <p className="text-lg text-black/70 mb-12">
          Explore what drives us. Hover or tap on a star to discover our values.
        </p>

        {/* Stars container */}
        <div className="relative w-full h-80 bg-black/5 border-4 border-red">
          <style>{`
            @keyframes float1 {
              0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
              25% { transform: translate(-50%, -50%) translate(20px, -15px); }
              50% { transform: translate(-50%, -50%) translate(10px, 20px); }
              75% { transform: translate(-50%, -50%) translate(-15px, 10px); }
            }
            @keyframes float2 {
              0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
              25% { transform: translate(-50%, -50%) translate(-15px, 20px); }
              50% { transform: translate(-50%, -50%) translate(15px, 10px); }
              75% { transform: translate(-50%, -50%) translate(-10px, -20px); }
            }
            @keyframes float3 {
              0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
              25% { transform: translate(-50%, -50%) translate(10px, 15px); }
              50% { transform: translate(-50%, -50%) translate(-20px, -10px); }
              75% { transform: translate(-50%, -50%) translate(15px, -15px); }
            }
            @keyframes float4 {
              0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
              25% { transform: translate(-50%, -50%) translate(-20px, -20px); }
              50% { transform: translate(-50%, -50%) translate(15px, 15px); }
              75% { transform: translate(-50%, -50%) translate(-10px, 20px); }
            }
            @keyframes float5 {
              0%, 100% { transform: translate(-50%, -50%) translate(0, 0); }
              25% { transform: translate(-50%, -50%) translate(20px, 10px); }
              50% { transform: translate(-50%, -50%) translate(-15px, -15px); }
              75% { transform: translate(-50%, -50%) translate(10px, 10px); }
            }
            .star-0 { animation: float1 8s ease-in-out infinite; }
            .star-1 { animation: float2 10s ease-in-out infinite; }
            .star-2 { animation: float3 12s ease-in-out infinite; }
            .star-3 { animation: float4 9s ease-in-out infinite; }
            .star-4 { animation: float5 11s ease-in-out infinite; }
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
                width={star.size}
                height={star.size}
                viewBox="0 0 24 24"
                fill="currentColor"
                className="text-pink"
              >
                <path d="M12 2l3.09 6.26L22 9.27l-5 4.87 1.18 6.88L12 17.77l-6.18 3.25L7 14.14 2 9.27l6.91-1.01L12 2z" />
              </svg>

              {/* Tooltip - Ethos message */}
              {hoveredStar === star.id && (
                <div className="absolute bottom-full left-1/2 transform -translate-x-1/2 mb-2 z-10 pointer-events-none">
                  <div className="bg-pink text-cream px-4 py-2 rounded-lg whitespace-nowrap text-sm font-semibold shadow-lg">
                    {ETHOS_MESSAGES[star.id % ETHOS_MESSAGES.length]}
                  </div>
                  <div className="absolute top-full left-1/2 transform -translate-x-1/2 border-4 border-transparent border-t-pink" />
                </div>
              )}
            </button>
          ))}
        </div>
      </div>
    </div>
  )
}
