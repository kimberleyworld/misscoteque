import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { sourceCodePro, racing_sans_one, tinos } from "./ui/fonts";
import { Toaster } from "sonner";

export const metadata: Metadata = {
  title: "Misscoteque",
  description: "Archive, community Notice board and more... GAY STUFF",
  metadataBase: new URL('https://misscoteque.world'),
  openGraph: {
    title: "Misscoteque",
    description: "Archive, community Notice board and more... GAY STUFF.",
    url: "https://misscoteque.world",
    siteName: "Misscoteque Archive",
    images: [
      {
        url: "/social-preview.png",
        width: 1200,
        height: 630,
      },
    ],
    locale: "en_GB",
    type: "website",
  },

  twitter: {
    card: "summary_large_image",
    title: "Misscoteque",
    description: "Archive, community Notice board and more... GAY STUFF.",
    images: ["/social-preview.png"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${sourceCodePro.variable} ${racing_sans_one.variable} ${tinos.variable}`}>
      <head>
        
      </head>
      <body suppressHydrationWarning={true}>
        {children}
        <Toaster 
          theme="dark" 
          position="bottom-right"
          toastOptions={{
            style: {
              background: 'hsl(var(--color-cream) / 0.1)',
              border: '1px solid hsl(var(--color-pink) / 0.3)',
              color: 'hsl(var(--color-cream))',
            },
          }}
        />
      </body>
    </html>
  );
}
