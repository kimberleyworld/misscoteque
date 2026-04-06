import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"

interface EventCardProps {
  eventDate?: string
  eventTime?: string
  eventDescription?: string
  ticketUrl?: string
  imageUrl?: string
  imageAlt?: string
  variant?: "banner" | "carousel"
  className?: string
}

function EventCard({
  eventDate = "Tuesday 7th October",
  eventTime = "19:00",
  eventDescription = "No description written yet, hold tight.",
  ticketUrl = "https://www.headfirstbristol.co.uk/",
  imageUrl,
  imageAlt = "Event image",
  variant = "banner",
  className = ""
}: EventCardProps) {
  const isBanner = variant === "banner"
  
  return (
    <div
      className={cn(
        "w-full max-w-3xl flex flex-col md:flex-row justify-between items-stretch gap-4",
        isBanner ? "border-4 border-orange" : "border-b-4 border-black",
        className
      )}
    >
      {imageUrl && (
        <div className="w-full md:w-1/4 flex-shrink-0 relative h-40 md:h-auto">
          <Image
            src={imageUrl}
            alt={imageAlt}
            fill
            className="object-cover"
            sizes="(max-width: 768px) 100vw, 25vw"
          />
        </div>
      )}
      <div className={imageUrl ? "md:w-1/3" : "flex-1"}>
        <h1 className="text-2xl font-bold px-4">next event</h1>
        <p className="font-semibold px-4">{eventDate}</p>
        <p className="text-sm px-4">{eventTime}</p>
      </div>
      <div className={imageUrl ? "md:w-1/4" : "flex-1"}>
        <p className="text-sm px-4">{eventDescription}</p>
      </div>
      <div className="flex items-center px-4">
        <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
          <Button type="button" asChild>
            {isBanner ? "Get tickets" : "More Info"}
          </Button>
        </a>
      </div>
    </div>
  )
}

export default EventCard