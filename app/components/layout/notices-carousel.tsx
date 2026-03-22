"use client"

import * as React from "react"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { Button } from "@/app/components/ui/button"
import { Card, CardContent } from "@/app/components/ui/card"
import { cn } from "@/lib/utils"

interface Notice {
  id: string
  title: string
  description: string
  link?: string | null
  contactDetails?: string | null
  createdAt: Date
}

interface NoticesCarouselProps {
  notices: Notice[]
}

const VISIBLE_CARDS = 3

export function NoticesCarousel({ notices }: NoticesCarouselProps) {
  const [currentIndex, setCurrentIndex] = React.useState(0)
  const [isPaused, setIsPaused] = React.useState(false)

  const totalSlides = Math.ceil(notices.length / VISIBLE_CARDS)

  // Auto-scroll every 5 seconds
  React.useEffect(() => {
    if (notices.length <= VISIBLE_CARDS || isPaused) return

    const interval = setInterval(() => {
      setCurrentIndex((prev) => (prev + 1) % totalSlides)
    }, 5000)

    return () => clearInterval(interval)
  }, [notices.length, isPaused, totalSlides])

  if (notices.length === 0) {
    return null
  }

  const goToPrevious = () => {
    setCurrentIndex((prev) => (prev === 0 ? totalSlides - 1 : prev - 1))
  }

  const goToNext = () => {
    setCurrentIndex((prev) => (prev + 1) % totalSlides)
  }

  const startIndex = currentIndex * VISIBLE_CARDS
  const visibleNotices = notices.slice(startIndex, startIndex + VISIBLE_CARDS)

  return (
    <div
      className="w-full md:w-2/3 h-auto max-w-md md:max-w-3xl"
      onMouseEnter={() => setIsPaused(true)}
      onMouseLeave={() => setIsPaused(false)}
    >
      <h2 className="text-pink font-impact text-2xl mb-6">Recent Notices</h2>

      {/* Carousel Grid */}
      <div className="flex items-stretch gap-4 mb-6">
        {visibleNotices.map((notice) => (
          <Card
            key={notice.id}
            className="flex-1 bg-cream/5 border-2 border-pink/30 rounded-none flex flex-col"
          >
            <CardContent className="pt-6 pb-6 flex flex-col h-full">
              <div className="flex-1">
                <h3 className="text-black font-bold text-lg mb-2">
                  {notice.title}
                </h3>
                <p className="text-black/80 text-sm mb-3 line-clamp-3">
                  {notice.description}
                </p>
              </div>

              <div className="text-black/70 text-xs space-y-2 border-t border-pink/20 pt-3 mt-auto">
                <p className="font-semibold truncate">Contact:</p>
                <p className="line-clamp-2">{notice.contactDetails}</p>
                {notice.link && (
                  <a
                    href={notice.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-pink underline hover:text-pink/80 text-xs block"
                  >
                    View link →
                  </a>
                )}
              </div>

              <div className="text-black/60 text-xs mt-3">
                {new Date(notice.createdAt).toLocaleDateString()}
              </div>
            </CardContent>
          </Card>
        ))}
      </div>

      {/* Controls */}
      <div className="flex items-center justify-between gap-4">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={goToPrevious}
          className="border-pink/30 text-black hover:bg-pink/10"
          aria-label="Previous notices"
        >
          <ChevronLeft className="w-4 h-4" />
        </Button>

        {/* Indicators */}
        <div className="flex gap-2 justify-center flex-1">
          {Array.from({ length: totalSlides }).map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentIndex(idx)}
              className={cn(
                "w-2 h-2 rounded-full transition-all",
                idx === currentIndex
                  ? "bg-pink w-6"
                  : "bg-pink/30 hover:bg-pink/60"
              )}
              aria-label={`Go to slide ${idx + 1}`}
            />
          ))}
        </div>

        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={goToNext}
          className="border-pink/30 text-black hover:bg-pink/10"
          aria-label="Next notices"
        >
          <ChevronRight className="w-4 h-4" />
        </Button>
      </div>
    </div>
  )
}
