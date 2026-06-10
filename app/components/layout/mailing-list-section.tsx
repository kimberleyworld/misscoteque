import Image from "next/image";
import MailerLiteForm from "@/app/components/MailerLiteForm";
import navStarOne from "@/public/images/nav-star-one.png";
import navStarTwo from "@/public/images/nav-star-two.png";
import navStarFour from "@/public/images/nav-star-four.png";

interface MailingListSectionProps {
  description: string;
}

export function MailingListSection({ description }: MailingListSectionProps) {
  return (
    <div className="bg-red py-20 relative overflow-visible">
      <h1 className="px-8 text-center relative z-10 text-black hidden sm:block">
        MAILING LIST
      </h1>
      <p className="px-8 mt-2 text-center relative z-10 text-cream">
        <span className="bg-black px-1">{description}</span>
      </p>
      <Image
        src={navStarOne}
        alt="star"
        width={100}
        height={100}
        className="w-40 h-40 object-cover absolute top-0 left-10"
      />
      <Image
        src={navStarTwo}
        alt="star"
        width={100}
        height={100}
        className="w-32 h-32 object-cover absolute top-16 right-20"
      />
      <Image
        src={navStarFour}
        alt="star"
        width={100}
        height={100}
        className="w-36 h-36 object-cover absolute bottom-5 left-1/4"
      />
      <div className="relative z-10 px-4">
        <MailerLiteForm />
      </div>
    </div>
  );
}
