import NavBar from "./components/layout/nav-bar";
import MusicBar from "./components/layout/music-bar";
import EventCard from "./components/ui/event-card";
import Hero from "./components/layout/hero";
import { getUpcomingEvents } from "@/lib/getUpcomingEvents";
import { getRecentNotices } from "@/lib/getRecentNotices";
import { getSong } from "@/lib/getSong";
import { getHomePageContent } from "@/lib/getHomePageContent";
import CrosswordSection from "./components/layout/crossword-section";
import { Button } from "./components/ui/button";
import Link from "next/link";
import { FormsModal } from "./components/layout/forms-modal";
import { SectionDivider } from "./components/layout/section-divider";
import { NoticesCarousel } from "./components/layout/notices-carousel";
import { EventsCarousel } from "./components/layout/events-carousel";
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
  const content = await getHomePageContent()
  const upcomingEvents = await getUpcomingEvents()
  const recentNotices = await getRecentNotices()
  const song = await getSong()
  const nextEvent = upcomingEvents[0]

  return (
    <>
      <Hero pageheading={content.pageheading} />
      <NavBar />
      <main className="mx-auto max-w-6xl flex flex-col items-center w-full">
        <div className="w-full bg-cream text-black flex justify-center flex-col items-center gap-4 pt-4">
                  <EventCard 
                eventDate={nextEvent?.eventDate}
                eventTime={nextEvent?.eventTime}
                ticketUrl={nextEvent?.ticketUrl}
                eventDescription={nextEvent?.eventDescription}
                imageUrl={nextEvent?.imageUrl}
                imageAlt={nextEvent?.imageAlt}
              />
              <AboutSection title={content.abouttitle} copy={content.aboutcopy} />
              <Link href="/artifacts" className="inline-block">
                <Button className="bg-pink hover:bg-pink/90 text-black font-impact rounded-none">
                  View the Archive →
                </Button>
              </Link>
            
              <MailerLiteForm />
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
        <MusicBar song={song} />
      </main>
  </>
)
}
