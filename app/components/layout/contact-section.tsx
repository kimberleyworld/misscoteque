'use client';

import { Instagram } from 'lucide-react';

interface ContactSectionProps {
  email?: string;
  instagram?: string;
}

export function ContactSection({ email, instagram }: ContactSectionProps) {
  if (!email && !instagram) {
    return null;
  }

  return (
    <div className="w-full mb-12 px-4">
      <div className="bg-cream flex flex-col gap-4" id="contact">
        <p>We are open to collaborate on events and are always open to new ideas. For inquiries, please reach out to us via email or Instagram. Press: email us!</p>
        <div className="space-y-3 flex flex-col sm:flex-row justify-between ">
          {email && (
            <div className="flex items-center gap-3">
              <span className="font-semibold text-black">Email:</span>
                {email}
            </div>
          )}
          {instagram && (
            <div className="flex items-center justify-center sm:justify-end gap-3">
              @misscoteque
              <a
                href={`https://instagram.com/${instagram.replace("@", "")}`}
                target="_blank"
                rel="noopener noreferrer"
                className="text-red hover:text-black transition-colors"
              >
                <Instagram className="w-6 h-6" />
              </a>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
