import NavStars from "./components/layout/nav-stars";
import Image from "next/image";
import EventCard from "./components/ui/event-card";
import { getUpcomingEvents } from "@/lib/getUpcomingEvents";
import { getRecentNotices } from "@/lib/getRecentNotices";
import CrosswordSection from "./components/layout/crossword-section";
import {ArchiveForm} from "@/app/components//layout/archive-form";
import { Button } from "./components/ui/button";
import Link from "next/link";
import { CommunityNoticeForm } from "./components/layout/notice-form";
import { NoticesCarousel } from "./components/layout/notices-carousel";
import { EventsCarousel } from "./components/layout/events-carousel";

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents()
  const recentNotices = await getRecentNotices()
  const nextEvent = upcomingEvents[0]

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <div className="bg-red w-full">
        <NavStars />
      </div>
      <div className="w-full bg-cream flex items-center justify-center px-4">
        <Image 
        src="/images/cut-out-home.png"
        alt="Amaia and Georgia (founders) behind the Decs"
        width={300}
        height={200}
        className="w-full md:w-2/3 h-auto max-w-md md:max-w-3xl absolute -translate-y-6 md:-translate-y-12"
      />
      </div>
      <div className="w-full bg-cream text-black pt-40 md:pt-54 pb-10 md:pb-20 px-4 flex justify-center flex-col items-center gap-8">
        <Link href="/artifacts" className="inline-block">
          <Button className="bg-pink hover:bg-pink/90 text-black font-impact rounded-none">
            View the Archive →
          </Button>
        </Link>
        <EventCard 
        eventDate={nextEvent?.eventDate}
        eventTime={nextEvent?.eventTime}
        ticketUrl={nextEvent?.ticketUrl}
        eventDescription={nextEvent?.eventDescription}
        imageUrl={nextEvent?.imageUrl}
        imageAlt={nextEvent?.imageAlt}
      />
        {upcomingEvents.length > 1 && <EventsCarousel events={upcomingEvents} />}
        {recentNotices.length > 0 && <NoticesCarousel notices={recentNotices} />}
        <CrosswordSection/>
        <CommunityNoticeForm />
        <ArchiveForm />
      </div>
    </main>
  );
}
