'use client';

import Link from "next/link";
import { usePathname } from "next/navigation";
import { useState } from "react";

export default function NavBar() {
  const pathname = usePathname();
  const [isOpen, setIsOpen] = useState(false);

  const navItems = [
    { href: "/#community-notice-board", label: "Community Notice Board", id: "community-notice-board" },
    { href: "/#events-carousel", label: "Events", id: "events-carousel" },
    { href: "/artifacts", label: "Archive", id: "archive" },
  ];

  return (
    <nav className="md:hidden w-full bg-black text-cream sticky top-0 z-[999] shrink-0 font-[family-name:var(--code)]">
      <div className="flex justify-between items-center py-2 px-4">
        <div className="flex-1"></div>
        
        {/* Burger Menu Button */}
        <button
          onClick={() => setIsOpen(!isOpen)}
          className="flex flex-col gap-1.5 justify-center items-center w-8 h-8"
          aria-label="Toggle menu"
        >
          <span className={`w-6 h-0.5 bg-cream transition-all ${isOpen ? 'rotate-45 translate-y-2' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-cream transition-all ${isOpen ? 'opacity-0' : ''}`}></span>
          <span className={`w-6 h-0.5 bg-cream transition-all ${isOpen ? '-rotate-45 -translate-y-2' : ''}`}></span>
        </button>
      </div>

      {/* Mobile Menu */}
      {isOpen && (
        <div className="bg-black border-t border-cream">
          <div className="flex flex-col gap-0 py-2 px-4">
            {navItems.map((item) => (
              <Link
                key={item.id}
                href={item.href}
                className={`text-sm transition-all duration-300 py-2 px-2 hover:bg-black/80 hover:underline tracking-widest ${
                  pathname === item.href ? "font-bold underline" : ""
                }`}
                onClick={() => setIsOpen(false)}
              >
                {item.label}
              </Link>
            ))}
          </div>
        </div>
      )}
    </nav>
  );
}
