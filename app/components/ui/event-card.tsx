import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"
import Image from "next/image"
import { FormattedEvent } from "@/lib/getUpcomingEvents"

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
  
  return (
    <div
      className={cn(
        "w-full flex flex-col md:flex-row justify-between items-stretch gap-4 px-8 py-2",
        isBanner ? "border-2 border-red" : "border-b-4 border-black",
        className
      )}
    >
      <div className={!isBanner && imageUrl ? "md:w-1/3" : "flex-1"}>
        <h1 className="text-2xl font-bold">next event</h1>
        {isBanner && <p className="text-sm">{eventTitle}</p>}
        {isBanner && <p className="text-sm">{eventDate}</p>}
        {!isBanner && <p className="font-semibold">{eventDate}</p>}
        {!isBanner && <p className="text-sm">{eventTime}</p>}
        {!isBanner && <p className="text-sm">{eventDescription}</p>}
      </div>
      {!isBanner && (
        <div
          className={
            imageUrl
              ? "md:w-1/4 flex-shrink-0"
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
      <div className="md:w-2/3 flex items-center justify-center px-10">
        <Button asChild className="w-full ">
          <a href={ticketUrl} target="_blank" rel="noopener noreferrer">
            {isBanner ? "Get tickets" : "More Info"}
          </a>
        </Button>
      </div>
    </div>
  )
}

export default EventCard