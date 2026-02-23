import { cn } from "@/lib/utils"
import { buttonVariants } from "./button"

interface NoticeCardProps {
  eventDate?: string
  eventTime?: string
  eventDescription?: string
  ticketUrl?: string
  className?: string
}

export default function NoticeCard({
  eventDate = "Tuesday 7th October",
  eventTime = "19:00",
  eventDescription = "No description written yet, hold tight.",
  ticketUrl = "https://www.headfirstbristol.co.uk/whats-on/bridge-farm/tue-7-oct-soft-spot-138665#e138665",
  className,
}: NoticeCardProps) {
  return (
    <div
      className={cn(
        "border-b-4 border-black w-3xl px-8 py-4 flex flex-row justify-between items-center",
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
        <a
          href={ticketUrl}
          target="_blank"
          rel="noreferrer"
          className={buttonVariants()}
        >
          More Info
        </a>
      </div>
    </div>
  )
}

