import Link from "next/link";
import { Button } from "../ui/button";

export function ArchiveDescription({ description }: { description: string }) {
  return (
    <div className="w-full px-2 md:mb-12 md:px-0 md:mt-auto">
    <a href="/artifacts" className="text-sm md:text-sm text-red hover:underline hover:text-black">Go To Archive →</a>
      <div className="text-left border-t border-black/30">
        <p className="text-sm md:text-sm leading-relaxed">
          {description}
        </p>
      </div>
      
    </div>
  );
}
