"use client"

import { Button } from "@/app/components/ui/button"
import { cn } from "@/lib/utils"

interface EventCardProps {
  eventDate?: string
  eventTime?: string
  eventDescription?: string
  ticketUrl?: string
  className?: string
}

function EventCard({
  eventDate = "Tuesday 7th October",
  eventTime = "19:00",
  eventDescription = "No description written yet, hold tight.",
  ticketUrl = "https://www.headfirstbristol.co.uk/whats-on/bridge-farm/tue-7-oct-soft-spot-138665#e138665",
  className = ""
}: EventCardProps) {
  const handleGetTickets = () => {
    window.open(ticketUrl, "_blank", "noopener,noreferrer")
  }

  return (
    <div
      className={cn(
        "border-4 border-orange w-3xl px-8 py-4 flex flex-row justify-between items-center",
        className
      )}
    >
      <div>
        <h1 className="text-2xl font-bold">next event</h1>
        <p>{eventDate}</p>
        <p>{eventTime}</p>
      </div>
      <div className="w-1/3">
        <p>{eventDescription}</p>
      </div>
      <div>
        <Button type="button" onClick={handleGetTickets}>
          Get tickets
        </Button>
      </div>
    </div>
  )
}

export default EventCard