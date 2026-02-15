import Image from "next/image";


export default async function NavStars() {
  return (
    <nav className="py-20 px-10 max-w-3xl mb-40">
        <div className="flex flex-row justify-around items-center">
        <div className="flex flex-col items-center">
          <Image 
              src="/images/nav-star-one.png"
              alt="An star shaped image of co-founders Amaia and Georgia laughing behind the decks. "
              width={300}
              height={300}
              className="w-auto h-[300px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_#F49CBB] cursor-pointer"
          />
          <span className="font-bold text-lg">DANCE</span>
        </div>
        <div className="text-5xl font-bold rotate-30">
            <h1>misscoteque.world</h1>
        </div> 
            
        </div>
    <div className="flex flex-row justify-between items-end h-[300px]">
        <div className="flex flex-col items-center self-end">
          <Image 
              src="/images/nav-star-two.png"
              alt="Sad sugar behind the Decs"
              width={300}
              height={200}
              className="w-auto h-[300px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_#F49CBB] cursor-pointer"
          />
          <span className="font-bold text-lg mt-2">ABOUT</span>
        </div>
       <div className="flex flex-col items-center self-start pr-20">
          <Image 
              src="/images/nav-star-five.png"
              alt="People dancing in the crowd"
              width={300}
              height={300}
              className="w-auto h-[250px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_#F49CBB] cursor-pointer"
          />
          <span className="font-bold text-lg mt-2 ">EVENTS</span>
        </div>
      </div>
    <div className="flex flex-row justify-around items-end h-[300px]">
        <div className="flex flex-col items-center self-end">
          <Image 
              src="/images/nav-star-three.png"
              alt="Sad sugar behind the Decs"
              width={300}
              height={200}
              className="w-auto h-[200px] blur-[1px] object-contain transition-all duration-300 hover:drop-shadow-[0_0_30px_#F49CBB] cursor-pointer"
          />
          <span className="font-bold text-lg mt-2">ARCHIVE</span>
        </div>
          <div className="w-[250px] text-xl flex flex-start">
            <p>Some text could go here...We gather in kitchens, clubs, and community centers, making space new news news news news news.  heres some news.</p>
        </div>
    </div>

    </nav>
    )
}