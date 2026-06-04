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

export interface DatoCMSSong {
  id: string
  title: string
  artist: string
  song: {
    url: string
  }
}

export interface DatoCMSMarqueSongResponse {
  marqueSong: DatoCMSSong
}

export interface HomePageContent {
  pageheading: string
  abouttitle: string
  aboutcopy: string
  communitynoticeboarddescription: string
}

export interface HomePageResponse {
  homepage: HomePageContent
}
