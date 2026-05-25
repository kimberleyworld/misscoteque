'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";

export default function NavBar() {
  const pathname = usePathname();

  const navItems = [
    { href: "/", label: "Home" },
    { href: "/artifacts", label: "Archive" },
    { href: "/#community-notice", label: "Community Notice Board" },
    { href: "/#crossword", label: "Crossword" },
  ];

  return (
    <nav className="md:hidden w-full bg-black text-cream border-t-2 border-cream sticky bottom-0 z-40 font-[family-name:var(--code)]">
      <div className="flex justify-center items-center gap-4 py-3 px-4">
        {navItems.map((item) => (
          <Link
            key={item.href}
            href={item.href}
            className={`text-sm md:text-base transition-all duration-300 hover:underline tracking-widest ${
              pathname === item.href ? "font-bold underline" : ""
            }`}
          >
            {item.label}
          </Link>
        ))}
      </div>
    </nav>
  );
}
