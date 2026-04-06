import NavStars from "./components/layout/nav-stars";
import Image from "next/image";
import EventCard from "./components/ui/event-card";
import { getUpcomingEvents } from "@/lib/getUpcomingEvents";
import { getRecentNotices } from "@/lib/getRecentNotices";
import { getSong } from "@/lib/getSong";
import CrosswordSection from "./components/layout/crossword-section";
import { Button } from "./components/ui/button";
import Link from "next/link";
import { FormsModal } from "./components/layout/forms-modal";
import { SectionDivider } from "./components/layout/section-divider";
import { NoticesCarousel } from "./components/layout/notices-carousel";
import { EventsCarousel } from "./components/layout/events-carousel";
import SongMarquee from "./components/SongMarquee";
import MusicPlayer from "./components/MusicPlayer";
import { AboutSection } from "./components/layout/about-section";
import { Timeline } from "./components/layout/timeline";
import MailerLiteForm from "./components/MailerLiteForm";
import { EthosSection } from "./components/layout/ethos";

const timelineSteps = [
  { id: 1, label: "Step 1", imageUrl: "/path/to/image1.jpg", imageAlt: "Step 1", description: "This is the first step of the process, where you will do X, Y, and Z." },
  { id: 2, label: "Step 2", imageUrl: "/path/to/image2.jpg", imageAlt: "Step 2", description: "This is the second step of the process, where you will do A, B, and C." },
  { id: 3, label: "Step 3", imageUrl: "/path/to/image3.jpg", imageAlt: "Step 3", description: "This is the third step of the process, where you will do D, E, and F." },
  { id: 4, label: "Step 4", imageUrl: "/path/to/image4.jpg", imageAlt: "Step 4", description: "This is the fourth step of the process, where you will do G, H, and I." },
]

export default async function Home() {
  const upcomingEvents = await getUpcomingEvents()
  const recentNotices = await getRecentNotices()
  const song = await getSong()
  const nextEvent = upcomingEvents[0]

  return (
    <main className="relative flex min-h-screen flex-col items-center">
      {song && <SongMarquee title={song.title} artist={song.artist} />}
      {song && <MusicPlayer title={song.title} artist={song.artist} audioUrl={song.audioUrl} />}
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
        <AboutSection />
        <MailerLiteForm />
        <EventCard 
        eventDate={nextEvent?.eventDate}
        eventTime={nextEvent?.eventTime}
        ticketUrl={nextEvent?.ticketUrl}
        eventDescription={nextEvent?.eventDescription}
        imageUrl={nextEvent?.imageUrl}
        imageAlt={nextEvent?.imageAlt}
      />
        {recentNotices.length > 0 && (
          <>
            <SectionDivider heading="Notices" />
            <NoticesCarousel notices={recentNotices} />
          </>
        )}
        <SectionDivider heading="Crossword" />
        <CrosswordSection/>
        <SectionDivider heading="Our Ethos" />
        <EthosSection />
        <FormsModal />
        {upcomingEvents.length > 1 && (
          <>
            <SectionDivider heading="All Events" />
            <EventsCarousel events={upcomingEvents} />
          </>
        )}
        <SectionDivider heading="Our Journey" />
        <Timeline steps={timelineSteps} />
      </div>
    </main>
  );
}
