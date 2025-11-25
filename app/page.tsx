import ThreeDObject from "@/app/components/ThreeDObject"
import ComingSoon from "@/app/components/ComingSoon";
import MailerLiteForm from "./components/MailerLiteForm";
import MusicPlayer from "./components/MusicPlayer";
import { getSong } from "@/lib/getSong"


export default async function Home() {
  const song = await getSong();
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-red">
      <ThreeDObject />
      <ComingSoon/>
      <h1 className="absolute top-15 left-1/2 -translate-x-1/2 text-6xl text-black font-bold font-[family-name:var(--impact)]">Misscoteque</h1>
      <MusicPlayer title={song.title} artist={song.artist} audioUrl={song.audioUrl} />
      <MailerLiteForm />
    </main>
  );
}
