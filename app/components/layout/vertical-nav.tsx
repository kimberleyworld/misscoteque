'use client';

import Link from "next/link";
import { SectionDivider } from "./section-divider";
import { SpinningRecord } from "./spinning-record";

export default function VerticalNav() {

  const navItems = [
    { href: "/#community-notice-board", label: "Community Notice Board", id: "community-notice-board" },
    { href: "/#events-carousel", label: "Events", id: "events-carousel" },
    { href: "/artifacts", label: "Archive", id: "archive" },
  ];

  return (
<nav
  className="
    hidden
    md:flex
    md:w-64
    md:flex-col
    md:items-center
    md:sticky
    md:top-0
    self-start
    py-6
    px-4
    bg-cream
    gap-2
    capitalize
  "
>
  {/* <SpinningRecord /> */}

  {navItems.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      className="text-sm tracking-wide w-full"
    >
      <SectionDivider heading={item.label} variant="small" />
    </Link>
  ))}
</nav>
  );
}
