'use client';

import Link from "next/link";
import { SectionDivider } from "./section-divider";
import { SpinningRecord } from "./spinning-record";

export default function VerticalNav() {

  const navItems = [
    { href: "/#event", label: "Upcoming Events", id: "event" },
    { href: "/#community-notice", label: "Submit Notice", id: "community-notice" },
    { href: "/artifacts", label: "Go to the Archive", id: "archive" },
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
    md:top-4
    self-start
    py-6
    px-4
    bg-cream
    gap-2
  "
>
  <SpinningRecord />

  {navItems.map((item) => (
    <Link
      key={item.id}
      href={item.href}
      className="text-sm transition-all duration-300 hover:underline tracking-wide w-full"
    >
      <SectionDivider heading={item.label} variant="small" />
    </Link>
  ))}
</nav>
  );
}
