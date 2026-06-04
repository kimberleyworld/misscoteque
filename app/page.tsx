import NavBar from "./components/layout/nav-bar";
import VerticalNav from "./components/layout/vertical-nav";
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
import { SectionDivider } from "./components/layout/section-divider";
import { CommunityNoticeGrid } from "./components/layout/CommunityNoticeGrid";
import { EventsCarousel } from "./components/layout/events-carousel";
import { AboutSection } from "./components/layout/about-section";
import MailerLiteForm from "./components/MailerLiteForm";
import Image from "next/image";
import navStarOne from "@/public/images/nav-star-one.png"
import navStarTwo from "@/public/images/nav-star-two.png"
import navStarFour from "@/public/images/nav-star-four.png"

export default async function Home() {
  const content = await getHomePageContent()
  const upcomingEvents = await getUpcomingEvents()
  const recentNotices = await getRecentNotices()
  const song = await getSong()
  const nextEvent = upcomingEvents[0]

  return (
    <div className="bg-black">
      <Hero pageheading={content.pageheading} />
      <NavBar />
      <main className="mx-auto max-w-6xl flex flex-col items-center w-full bg-cream">
        <div className="w-full flex justify-between">
          <VerticalNav />
<div className="flex-1 bg-cream text-black flex flex-col gap-4 pt-4 sm:mr-4">     
                 {upcomingEvents.length > 0 ? (
                      <div className="w-full px-2 md:px-0">
                        <EventCard
                          eventTitle={nextEvent?.eventTitle}
                          eventDate={nextEvent?.eventDate}
                          eventTime={nextEvent?.eventTime}
                          ticketUrl={nextEvent?.ticketUrl}
                          eventDescription={nextEvent?.eventDescription}
                          imageUrl={nextEvent?.imageUrl}
                          imageAlt={nextEvent?.imageAlt}
                        />
                      </div>
                    ) : (
                      <div className="w-full flex flex-col md:flex-row justify-between items-stretch gap-4 border-2 border-red">
                        <div className="flex-1">
                          <h1 className="text-2xl font-bold px-4">next event</h1>
                          <p className="text-sm px-4">No future events</p>
                        </div>
                      </div>
                    )}
                <AboutSection title={content.abouttitle} copy={content.aboutcopy} />
              <CrosswordSection/>
               {recentNotices.length > 0 && (    
                <>
                  <SectionDivider heading="COMMUNITY NOTICE BOARD" />
                  <CommunityNoticeGrid notices={recentNotices} description={content.communitynoticeboarddescription} />
                </>
              )}
              <div className="bg-red py-20 relative overflow-visible">
                <h1 className="px-8 text-center relative z-10">MAILING LIST</h1>
                <Image
                  src={navStarOne}
                  alt="star"
                  width={100}
                  height={100}
                  className="w-40 h-40 object-cover absolute -top-10 left-24"
                />
                <Image
                  src={navStarTwo}
                  alt="star"
                  width={100}
                  height={100}
                  className="w-32 h-32 object-cover absolute top-16 right-24"
                />
                <Image
                  src={navStarFour}
                  alt="star"
                  width={100}
                  height={100}
                  className="w-36 h-36 object-cover absolute bottom-5 left-1/4"
                />
                <div className="relative z-10 px-4">
                  <MailerLiteForm />
                </div>
              </div>
              
              {upcomingEvents.length > 1 && (
                <>
                  <SectionDivider heading="All Upcoming events" />
                  <EventsCarousel events={upcomingEvents} />
                </>
              )}
             
                  
                <Link href="/artifacts" className="inline-block">
                  <Button className="bg-pink hover:bg-pink/90 text-black font-impact rounded-none">
                    View the Archive →
                  </Button>
                </Link>
          </div>
        </div>
        <MusicBar song={song} />
      </main>
  </div>
)
}
