'use client';

import Link from "next/link";
import { SectionDivider } from "./section-divider";
import { SpinningRecord } from "./spinning-record";
import { ArchiveDescription } from "./archive-description";

export default function VerticalNav({ description }: { description: string }) {

  const navItems = [
    { href: "/artifacts", label: "Archive", id: "archive" },
    { href: "/#community-notice-board", label: "Community Notice Board", id: "community-notice-board" },
    { href: "/#events-carousel", label: "Events", id: "events-carousel" },
    { href: "https://www.instagram.com/misscoteque/?hl=en-gb", label: "Instagram", id: "instagram" },
    { href: "/#contact", label: "Contact", id: "contact" },
  ];

  return (
    <div className="bg-black/20 md:mr-4 md:border-r-2 md:border-black md:flex md:flex-col md:h-screen md:sticky md:top-0">
    <nav
      className="
        hidden
        md:flex
        md:w-64
        md:flex-col
        md:items-center
        md:h-full
        py-6
        px-4
        gap-2
        capitalize
      "
    >
      <SpinningRecord />

      {navItems.map((item) => 
        item.href.startsWith('http') ? (
          <a
            key={item.id}
            href={item.href}
            target="_blank"
            rel="noopener noreferrer"
            className="text-sm tracking-wide w-full"
          >
            <SectionDivider heading={item.label} variant="small" />
          </a>
        ) : (
          <Link
            key={item.id}
            href={item.href}
            className="text-sm tracking-wide w-full"
          >
            <SectionDivider heading={item.label} variant="small" />
          </Link>
        )
      )}
      <ArchiveDescription description={description} />
    </nav>
    </div>
  );
}
