import type { Metadata } from "next";
import "./globals.css";
import Script from "next/script";
import { sourceCodePro, racing_sans_one, tinos } from "./ui/fonts";

export const metadata: Metadata = {
  title: "Misscoteque",
  description: "Archive, community Notice board and more... GAY STUFF",
  openGraph: {
    title: "Misscoteque",
    description: "Archive, community Notice board and more... GAY STUFF.",
    url: "https:misscoteque.world",
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
        <link rel="preconnect" href="https://images.ctfassets.net" />
        <link rel="preconnect" href="https://cdn.contentful.com" />
        <link rel="preconnect" href="https://assets.mailerlite.com" />
         <Script id="mailerlite-universal" strategy="afterInteractive">
          {`(function(w,d,e,u,f,l,n){w[f]=w[f]||function(){(w[f].q=w[f].q||[])
    .push(arguments);},l=d.createElement(e),l.async=1,l.src=u,
    n=d.getElementsByTagName(e)[0],n.parentNode.insertBefore(l,n);})
    (window,document,'script','https://assets.mailerlite.com/js/universal.js','ml');
    ml('account', '1936013');`}
        </Script>
      </head>
      <body>
        {children}
      </body>
    </html>
  );
}
