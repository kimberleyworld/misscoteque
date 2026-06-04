import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import DiscoBall from "../DiscoBall";

export default function Hero() {
  return (
    <div className="w-full relative max-w-6xl h-screen flex flex-col items-center bg-red">


      {/* Scroll to see - positioned at top right */}
      <div className="absolute top-1 right-2 md:top-6 md:right-6 z-50 text-black flex flex-col items-end text-right">
        <div>Scroll to see:</div>
        <ul className="list-disc list-inside flex flex-col text-sm md:text-base font-bold">
          <li>Upcoming Events</li>
          <li>Community Notice Board</li>   
          <li>Gay Crossword</li>
          <li>Poster Gallery</li>
          ...and more
        </ul>
        <Link href="/artifacts">
          <Button className="mt-4">
            View the Archive →
          </Button>
        </Link>
      </div>

      {/* Flexbox with heading */}
      <div className="flex w-full h-full items-center justify-start md:justify-end md:items-end">
        <h1 className="text-black -rotate-90 md:rotate-0 md:translate-x-0 z-50 text-5xl -translate-x-[40%] text-red-outline md:pb-16 md:text-8xl">MISSCOTEQUE.WORLD</h1>
      </div>

      {/* Disco Ball */}
      <DiscoBall />
      {/* Cut-out image - at bottom of hero section */}
      <div className="absolute bottom-0 left-0 right-0 z-20 w-full h-3/5 sm:h-4/5 overflow-hidden">
        <Image
          src="/images/cut-out-home.png"
          alt="Amaia and Georgia (founders) behind the Decs"
          width={1920}
          height={1280}
          className="w-full h-full object-cover object-top"
          priority
        />
      </div>
    </div>
  );
}
