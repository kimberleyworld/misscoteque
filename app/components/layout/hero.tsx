import Link from "next/link";
import Image from "next/image";
import { Button } from "../ui/button";
import DiscoBall from "../DiscoBall";

export default function Hero() {
  return (
    <div className="w-full max-w-6xl h-screen flex flex-col overflow-hidden items-center bg-red">
      {/* Stars background */}
      {/* <div className="bg-red w-full flex flex-col items-center justify-start pt-8"> */}
        {/* Four stars in a row */}
        {/* <div className="flex justify-center items-end gap-4 md:gap-8 px-4">
          <div className="flex flex-col items-center">
            <Image 
              src="/images/nav-star-one.png"
              alt="An star shaped image of co-founders Amaia and Georgia laughing behind the decks."
              width={300}
              height={300}
              className="w-auto h-[100px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
            />
            <span className="font-bold text-xs md:text-sm mt-2">DANCE</span>
          </div>
          <div className="flex flex-col items-center">
            <Image 
              src="/images/nav-star-two.png"
              alt="Sad sugar behind the Decs"
              width={300}
              height={200}
              className="w-auto h-[100px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
            />
            <span className="font-bold text-xs md:text-sm mt-2">ABOUT</span>
          </div>
          <div className="flex flex-col items-center">
            <Image 
              src="/images/nav-star-five.png"
              alt="People dancing in the crowd"
              width={300}
              height={300}
              className="w-auto h-[100px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
            />
            <span className="font-bold text-xs md:text-sm mt-2">EVENTS</span>
          </div>
          <div className="flex flex-col items-center">
            <Image 
              src="/images/nav-star-three.png"
              alt="Sad sugar behind the Decs"
              width={300}
              height={200}
              className="w-auto h-[100px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
            />
            <span className="font-bold text-xs md:text-sm mt-2">ARCHIVE</span>
          </div>
        </div>
      </div> */}

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
