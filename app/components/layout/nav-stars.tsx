import Image from "next/image";


export default function NavStars() {
  return (
    <nav className="py-8 md:py-20 px-4 md:px-10 max-w-3xl mx-auto mb-20 md:mb-40">
        <div className="flex flex-col md:flex-row justify-around items-center gap-4 md:gap-0">
        <div className="flex flex-col items-center">
          <Image 
              src="/images/nav-star-one.png"
              alt="An star shaped image of co-founders Amaia and Georgia laughing behind the decks. "
              width={300}
              height={300}
              className="w-auto h-[150px] md:h-[300px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
          />
          <span className="font-bold text-sm md:text-lg">DANCE</span>
        </div>
        <div className="text-3xl md:text-5xl font-bold rotate-30">
            <h1>misscoteque.world</h1>
        </div> 
            
        </div>
    <div className="flex flex-col md:flex-row justify-between items-center md:items-end gap-4 md:gap-0 md:h-[300px] mt-4 md:mt-0">
        <div className="flex flex-col items-center md:self-end">
          <Image 
              src="/images/nav-star-two.png"
              alt="Sad sugar behind the Decs"
              width={300}
              height={200}
              className="w-auto h-[150px] md:h-[300px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
          />
          <span className="font-bold text-sm md:text-lg mt-2">ABOUT</span>
        </div>
       <div className="flex flex-col items-center md:self-start md:pr-20">
          <Image 
              src="/images/nav-star-five.png"
              alt="People dancing in the crowd"
              width={300}
              height={300}
              className="w-auto h-[125px] md:h-[250px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
          />
          <span className="font-bold text-sm md:text-lg mt-2 ">EVENTS</span>
        </div>
      </div>
    <div className="flex flex-col md:flex-row justify-around items-center md:items-end gap-4 md:gap-0 md:h-[300px] mt-4 md:mt-0">
        <div className="flex flex-col items-center md:self-end">
          <Image 
              src="/images/nav-star-three.png"
              alt="Sad sugar behind the Decs"
              width={300}
              height={200}
              className="w-auto h-[100px] md:h-[200px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_var(--color-pink)] cursor-pointer"
          />
          <span className="font-bold text-sm md:text-lg mt-2">ARCHIVE</span>
        </div>
          <div className="w-full md:w-[250px] text-base md:text-xl flex flex-start px-4 md:px-0">
            <p>Some text could go here...We gather in kitchens, clubs, and community centers, making space new news news news news news.  heres some news.</p>
        </div>
    </div>

    </nav>
    )
}