import CrossWord from "./components/ui/CrossWord";
import NavStars from "./components/layout/nav-stars";
import Image from "next/image";
import NextEvent from "./components/layout/next-event";

export default async function Home() {
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
      <div className="w-full bg-cream text-black pt-40 md:pt-54 pb-10 md:pb-20 px-4 flex justify-center flex-col">
        <NextEvent />
        <CrossWord />
      </div>
      <div className="w-full bg-red h-64 md:h-96"></div>
    </main>
  );
}
