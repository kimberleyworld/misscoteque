import { FormattedEvent } from "./getUpcomingEvents";

export const mockUpcomingEvents: FormattedEvent[] = [
  {
    id: "mock-event-1",
    eventDate: "Friday, May 10, 2024",
    eventTime: "19:00",
    eventDescription: "Join us for an evening of live acoustic performances featuring local musicians. This intimate showcase celebrates emerging talent in our community.",
    ticketUrl: "https://example.com/tickets/acoustic-night",
    imageUrl: "/images/event-acoustic.jpg",
    imageAlt: "Acoustic performance evening",
  },
  {
    id: "mock-event-2",
    eventDate: "Saturday, May 18, 2024",
    eventTime: "14:00",
    eventDescription: "Spring Market Festival featuring local vendors, handmade crafts, food trucks, and live music. Family-friendly event with activities for all ages.",
    ticketUrl: "https://example.com/tickets/spring-market",
    imageUrl: "/images/event-market.jpg",
    imageAlt: "Spring market festival",
  },
  {
    id: "mock-event-3",
    eventDate: "Wednesday, May 29, 2024",
    eventTime: "18:30",
    eventDescription: "Monthly film screening and discussion. This month we're showing an award-winning documentary followed by community conversation.",
    ticketUrl: "https://example.com/tickets/film-night",
    imageUrl: "/images/event-film.jpg",
    imageAlt: "Documentary screening",
  },
  {
    id: "mock-event-4",
    eventDate: "Saturday, June 1, 2024",
    eventTime: "10:00",
    eventDescription: "Community clean-up day at Riverside Park. Volunteers needed! All supplies provided. Followed by picnic lunch for participants.",
    ticketUrl: "https://example.com/tickets/cleanup-day",
    imageUrl: "/images/event-cleanup.jpg",
    imageAlt: "Community cleanup event",
  },
  {
    id: "mock-event-5",
    eventDate: "Friday, June 7, 2024",
    eventTime: "20:00",
    eventDescription: "Summer dance party under the stars. DJ spinning classic hits and contemporary favorites. Food, drinks, and dancing until midnight.",
    ticketUrl: "https://example.com/tickets/dance-party",
    imageUrl: "/images/event-dance.jpg",
    imageAlt: "Summer dance party",
  },
];

export function getMockUpcomingEvents(): FormattedEvent[] {
  return mockUpcomingEvents;
}

export function getMockNextEvent(): FormattedEvent | undefined {
  return mockUpcomingEvents[0];
}
