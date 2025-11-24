import ThreeDObject from "@/app/ui/ThreeDObject"
import ComingSoon from "@/app/ui/ComingSoon";
import MailerLiteForm from "./ui/MailerLiteForm";
import MusicPlayer from "./ui/MusicPlayer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-zinc-50">
      <ThreeDObject />
      <ComingSoon/>
      <h1 className="absolute top-107 left-1/2 -translate-x-1/2 text-5xl text-black font-bold" >Misscoteque</h1>
      <MusicPlayer />
      <MailerLiteForm />
    </main>
  );
}
