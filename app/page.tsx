import NavBar from "./components/layout/nav-bar";
import VerticalNav from "./components/layout/vertical-nav";
import MusicBar from "./components/layout/music-bar";
import EventCard from "./components/ui/event-card";
import Hero from "./components/layout/hero";
import { getUpcomingEvents } from "@/lib/getUpcomingEvents";
import { getRecentNotices } from "@/lib/getRecentNotices";
import { getSong, getPlaylist } from "@/lib/getSong";
import { getHomePageContent } from "@/lib/getHomePageContent";
import { getCollection } from "@/lib/getCollection";
import CrosswordSection from "./components/layout/crossword-section";

import { SectionDivider } from "./components/layout/section-divider";
import { CommunityNoticeGrid } from "./components/layout/CommunityNoticeGrid";
import { EventsCarousel } from "./components/layout/events-carousel";
import { AboutSection } from "./components/layout/about-section";
import { PosterGrid } from "./components/layout/poster-grid";
import { MailingListSection } from "./components/layout/mailing-list-section";

export default async function Home() {
  const content = await getHomePageContent()
  const upcomingEvents = await getUpcomingEvents()
  const recentNotices = await getRecentNotices()
  const song = await getSong()
  const playlist = await getPlaylist()
  const collection = await getCollection()
  const nextEvent = upcomingEvents[0]

  const posters = collection?.posters.map((asset, index) => ({
    id: `poster-${index}`,
    title: `Poster ${index + 1}`,
    imageUrl: asset.url,
    imageAlt: asset.alt || `Poster ${index + 1}`,
  })) || []

  return (
    <div className="bg-black">
      <Hero pageheading={content.pageheading} />
      <NavBar />
      <main className="mx-auto max-w-6xl flex flex-col items-center w-full bg-cream">
        <div className="w-full flex justify-between">
          <VerticalNav />
<div className="flex-1 bg-cream text-black flex flex-col gap-4 pt-4 sm:mr-4 mb-10">     
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
               <div id="community-notice-board">
                <SectionDivider heading="COMMUNITY NOTICE BOARD"/>
                <CommunityNoticeGrid 
                  notices={recentNotices} 
                  description={content.communitynoticeboarddescription}
                  submitNoticeTitle={content.submitcommunitynoticetitle}
                  submitNoticeDescription={content.submitcommunitynoticedescription}
                />
              </div>
              <MailingListSection description={content.mailinglistdescription} />
              
              {upcomingEvents.length > 1 && (
                <div id="events-carousel">
                  <SectionDivider heading="All Upcoming events" />
                  <EventsCarousel events={upcomingEvents} />
                </div>
              )}
              <SectionDivider heading="Past Poster Gallery"  />
              <PosterGrid posters={posters} />
          </div>
        </div>
        <MusicBar song={song} playlist={playlist} />
      </main>
  </div>
)
}
