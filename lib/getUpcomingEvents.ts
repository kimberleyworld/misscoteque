import { gql } from "graphql-request"
import { datocmsClient } from "./datocms"
import { DatoCMSEventsResponse, DatoCMSEvent } from "@/types/datocms"

const EVENTS_QUERY = gql`
  query GetUpcomingEvents {
    allEvents(orderBy: date_ASC) {
      id
      title
      date
      time
      description
      ticketUrl
      image {
        responsiveImage(sizes: "(max-width: 600px) 90vw, (max-width: 900px) 50vw, 33vw") {
          src
          srcSet
          webpSrcSet
          sizes
          alt
          title
        }
      }
    }
  }
`

export interface FormattedEvent {
  id: string
  eventDate: string
  eventTime: string
  eventDescription: string
  ticketUrl: string
  imageUrl?: string
  imageAlt?: string
}

function formatEventDate(isoDate: string): string {
  try {
    const date = new Date(isoDate)
    return date.toLocaleDateString("en-GB", {
      weekday: "long",
      day: "numeric",
      month: "long",
      year: "numeric",
    })
  } catch {
    // If parsing fails, return the original date string
    return isoDate
  }
}

function formatEventTime(timeString?: string): string {
  if (!timeString) return "TBA"
  // If timeString is in HH:mm format, just return it
  if (/^\d{2}:\d{2}/.test(timeString)) {
    return timeString
  }
  return timeString
}

function isEventInFuture(dateString: string): boolean {
  try {
    const eventDate = new Date(dateString)
    const now = new Date()
    // Set to start of day for fair comparison
    now.setHours(0, 0, 0, 0)
    return eventDate >= now
  } catch {
    return false
  }
}

export async function getUpcomingEvents(): Promise<FormattedEvent[]> {
  try {
    const response = await datocmsClient.request<DatoCMSEventsResponse>(EVENTS_QUERY)

    if (!response.allEvents || response.allEvents.length === 0) {
      return []
    }

    // Filter for future events only
    const futureEvents = response.allEvents.filter((event: DatoCMSEvent) =>
      isEventInFuture(event.date)
    )

    return futureEvents.map((event: DatoCMSEvent) => ({
      id: event.id,
      eventDate: formatEventDate(event.date),
      eventTime: formatEventTime(event.time),
      eventDescription: event.description,
      ticketUrl: event.ticketUrl || "#",
      imageUrl: event.image?.responsiveImage?.src,
      imageAlt: event.image?.responsiveImage?.alt || "Event image",
    }))
  } catch (error) {
    console.error("Failed to fetch events from DatoCMS:", error)
    return []
  }
}
