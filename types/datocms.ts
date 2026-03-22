export interface DatoCMSImage {
  responsiveImage: {
    src: string
    alt: string
    title?: string
  }
}

export interface DatoCMSEvent {
  id: string
  title: string
  date: string // ISO format
  time?: string
  description: string
  ticketUrl?: string
  image?: DatoCMSImage
}

export interface DatoCMSEventsResponse {
  allEvents: DatoCMSEvent[]
}
