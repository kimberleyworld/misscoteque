import { Entry } from "contentful"
import { contentfulClient } from "./contentful"
import { EventSkeleton, GlobalSettingsSkeleton } from "@/types/contentful"

const DEFAULT_EVENT_DATE = "Tuesday 7th October"
const DEFAULT_EVENT_TIME = "19:00"
const DEFAULT_EVENT_DESCRIPTION = "No description written yet, hold tight."
const DEFAULT_TICKET_URL = "https://www.headfirstbristol.co.uk/"

type EventData = {
  eventDate: string
  eventTime: string
  eventDescription: string
  ticketUrl: string
}

function formatEventDate(rawDate?: string): string {
  if (!rawDate) return DEFAULT_EVENT_DATE

  const parsed = new Date(rawDate)
  if (Number.isNaN(parsed.getTime())) return rawDate

  return parsed.toLocaleDateString("en-GB", {
    weekday: "long",
    day: "numeric",
    month: "long",
    year: "numeric",
  })
}

export async function getNextEvent(): Promise<EventData> {
  try {
    const response = await contentfulClient.getEntries<GlobalSettingsSkeleton>({
      content_type: "globalSettings",
      limit: 1,
      include: 2,
    })

    const settingsEntry: Entry<GlobalSettingsSkeleton> | undefined = response.items[0]
    const eventEntry = settingsEntry?.fields?.nextEvent as Entry<EventSkeleton> | undefined

    if (!eventEntry) {
      return {
        eventDate: DEFAULT_EVENT_DATE,
        eventTime: DEFAULT_EVENT_TIME,
        eventDescription: DEFAULT_EVENT_DESCRIPTION,
        ticketUrl: DEFAULT_TICKET_URL,
      }
    }

    const fields = (eventEntry as unknown as {
      fields?: {
        date?: string
        time?: string
        description?: string
        ticketUrl?: string
      }
    }).fields

    return {
      eventDate: formatEventDate(fields?.date),
      eventTime: String(fields?.time || DEFAULT_EVENT_TIME),
      eventDescription: String(fields?.description || DEFAULT_EVENT_DESCRIPTION),
      ticketUrl: String(fields?.ticketUrl || DEFAULT_TICKET_URL),
    }
  } catch {
    return {
      eventDate: DEFAULT_EVENT_DATE,
      eventTime: DEFAULT_EVENT_TIME,
      eventDescription: DEFAULT_EVENT_DESCRIPTION,
      ticketUrl: DEFAULT_TICKET_URL,
    }
  }
}
