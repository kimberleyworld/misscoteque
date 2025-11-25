import ThreeDObject from "@/app/components/ThreeDObject"
import ComingSoon from "@/app/components/ComingSoon";
import MailerLiteForm from "./components/MailerLiteForm";
import MusicPlayer from "./components/MusicPlayer";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-red">
      <ThreeDObject />
      <ComingSoon/>
      <h1 className="absolute top-15 left-1/2 -translate-x-1/2 text-6xl text-black font-bold font-[family-name:var(--impact)]">Misscoteque</h1>
      <MusicPlayer />
      <MailerLiteForm />
    </main>
  );
}
