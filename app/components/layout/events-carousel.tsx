"use client"

import { useState } from "react"
import EventCard from "@/app/components/ui/event-card"
import { FormattedEvent } from "@/lib/getUpcomingEvents"

interface EventsCarouselProps {
  events: FormattedEvent[]
}

const EVENTS_PER_PAGE = 3

export function EventsCarousel({ events }: EventsCarouselProps) {
  const [currentPage, setCurrentPage] = useState(0)

  const totalPages = Math.ceil(events.length / EVENTS_PER_PAGE)
  const visibleEvents = events.slice(
    currentPage * EVENTS_PER_PAGE,
    (currentPage + 1) * EVENTS_PER_PAGE
  )

  if (events.length === 0) return null

  const goToPrevious = () => {
    setCurrentPage((prev) => (prev - 1 + totalPages) % totalPages)
  }

  const goToNext = () => {
    setCurrentPage((prev) => (prev + 1) % totalPages)
  }

  const goToPage = (page: number) => {
    setCurrentPage(page)
  }

  return (
    <div id="upcoming-events" className="w-full flex flex-col items-center gap-4">
      {/* 3 Events Grid */}
      <div className="w-full grid grid-cols-1 md:grid-cols-3 gap-4 px-4 sm:px-0">
        {visibleEvents.map((event) => (
          <EventCard
            key={event.id}
            variant="carousel"
            eventTitle={event.eventTitle}
            eventDate={event.eventDate}
            eventTime={event.eventTime}
            eventDescription={event.eventDescription}
            ticketUrl={event.ticketUrl}
            imageUrl={event.imageUrl}
            imageAlt={event.imageAlt}
          />
        ))}
      </div>

      {/* Navigation Buttons */}
      {totalPages > 1 && (
        <div className="flex gap-4 items-center">
          <button
            onClick={goToPrevious}
            className="bg-red hover:bg-red/90 text-white px-4 py-2"
            aria-label="Previous page"
          >
            Previous
          </button>

          {/* Dot Indicators */}
          <div className="flex gap-2">
            {Array.from({ length: totalPages }).map((_, index) => (
              <button
                key={index}
                onClick={() => goToPage(index)}
                className={`w-3 h-3 transition-all ${
                  index === currentPage
                    ? "bg-red scale-125"
                    : "bg-gray-300 hover:bg-gray-400"
                }`}
                aria-label={`Go to page ${index + 1}`}
              />
            ))}
          </div>

          <button
            onClick={goToNext}
            className="bg-red hover:bg-red/90 text-white px-4 py-2"
            aria-label="Next page"
          >
            Next
          </button>
        </div>
      )}
    </div>
  )
}
