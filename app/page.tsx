import ThreeDObject from "@/app/ui/ThreeDObject"
import ComingSoon from "@/app/ui/ComingSoon";
import MailerLiteForm from "./ui/MailerLiteForm";

export default function Home() {
  return (
    <main className="relative flex min-h-screen flex-col items-center bg-zinc-50">
      <ThreeDObject />
      <h1 className="absolute top-3/5 left-1/2 -translate-x-1/2 -translate-y-1/2 text-5xl font-bold" >Misscoteque</h1>
      <ComingSoon/>
      <MailerLiteForm />
    </main>
  );
}
