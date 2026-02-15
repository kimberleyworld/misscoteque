import CrossWord from "./components/ui/CrossWord";
import NavStars from "./components/layout/nav-stars";
import Image from "next/image";

export default async function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center">
      <div className="bg-red">
        <NavStars />
      </div>
      <div className="w-full bg-cream flex items-center justify-center">
        <Image 
        src="/images/cut-out-home.png"
        alt="Amaia and Georgia (founders) behind the Decs"
        width={300}
        height={200}
        className="w-2/3 h-auto max-w-3xl absolute -translate-y-6"
      />
      </div>
      <div className="bg-cream text-black pt-54 pb-20">
        <CrossWord />
      </div>
      <div className="bg-red h-96"></div>
    </main>
  );
}
