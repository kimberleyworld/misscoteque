'use client'

import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { FormattedEvent } from "@/lib/getUpcomingEvents"
import { useState } from "react"
import { ChevronDown } from "lucide-react"

interface EventCardProps extends Omit<FormattedEvent, 'id'> {
  variant?: "banner" | "carousel"
  className?: string
}

function EventCard({
  eventTitle,
  eventDate,
  eventTime,
  eventDescription,
  ticketUrl,
  imageUrl,
  imageAlt,
  variant = "banner",
  className = ""
}: EventCardProps) {
  const isBanner = variant === "banner"
  const [isExpandedDescription, setIsExpandedDescription] = useState(false)
  const descriptionExceedsCharLimit = eventDescription?.length > 60
  
  return (
    <div
      className={cn(
        "w-full flex justify-between items-stretch gap-4 py-2",
        isBanner ? "flex-col md:flex-row px-6 md:px-8 border-2 border-red" : "flex-col border border-2 border-red p-4",
        className
      )}
    >
      <div className={!isBanner && imageUrl ? "" : "flex-1"}>
        {isBanner && <h1 className="text-2xl font-bold">next event</h1>}
        <p className="text-sm">{eventTitle}</p>
        {isBanner && <p className="text-sm">{eventDate}</p>}
        {!isBanner && <p className="font-semibold">{eventDate}</p>}
        {!isBanner && <p className="text-sm">{eventTime}</p>}
        {!isBanner && (
          <div className="flex items-start gap-2">
            <p
              className={cn("text-sm", !isExpandedDescription && descriptionExceedsCharLimit && "line-clamp-1")}
            >
              {eventDescription}
            </p>
            {descriptionExceedsCharLimit && (
              <button
                onClick={() => setIsExpandedDescription(!isExpandedDescription)}
                className="flex-shrink-0 p-1 hover:bg-gray-200 transition-colors mt-0.5"
              >
                <ChevronDown
                  size={16}
                  className={cn("transition-transform", isExpandedDescription && "rotate-180")}
                />
              </button>
            )}
          </div>
        )}
      </div>
      {!isBanner && (
        <div
          className={
            imageUrl
              ? ""
              : "flex-1"
          }
        >
          {imageUrl && (
          <Image
            src={imageUrl}
            alt={imageAlt || "Event image"}
            width={400}
            height={300}
            className="w-full h-40 object-cover"
          />
          )}
        </div>
      )}
      <div className={cn("flex items-center justify-center", isBanner ? "md:w-2/3 md:px-10" : "w-full")}>
        <Button asChild className="w-full">
          <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
            GET TICKETS
          </a>
        </Button>
      </div>
    </div>
  )
}

export default EventCard