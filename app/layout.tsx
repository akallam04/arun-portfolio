import type { Metadata, Viewport } from "next";
import { Archivo, IBM_Plex_Mono } from "next/font/google";
import "./globals.css";
import { PROFILE } from "@/lib/data";
import { INTRO_HTML, INTRO_SCRIPT } from "@/lib/intro";

const archivo = Archivo({
  subsets: ["latin"],
  axes: ["wdth"],
  variable: "--font-archivo",
  display: "swap",
});

const plexMono = IBM_Plex_Mono({
  subsets: ["latin"],
  weight: ["400", "500"],
  variable: "--font-plex-mono",
  display: "swap",
});

const SITE = PROFILE.site;
const TITLE = "Arun Kallam | Software and AI Engineer";
const DESCRIPTION =
  "Arun Teja Reddy Kallam builds AI agents and tests whether they really work. Computer Science at Arizona State University, graduating May 2027. Open to full-time Software and AI Engineer roles.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Arun Kallam",
    "Arun Teja Reddy Kallam",
    "Software and AI Engineer",
    "AI agents",
    "LLM evaluation",
    "ASU Computer Science",
    "new grad software engineer",
    "Tempe Arizona",
  ],
  authors: [{ name: "Arun Teja Reddy Kallam", url: SITE }],
  creator: "Arun Teja Reddy Kallam",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Arun Kallam",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#e9f2fb",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arun Teja Reddy Kallam",
  alternateName: "Arun Kallam",
  jobTitle: "Software and AI Engineer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Arizona State University",
  },
  url: SITE,
  sameAs: ["https://github.com/akallam04", "https://linkedin.com/in/akallam3"],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${archivo.variable} ${plexMono.variable}`} suppressHydrationWarning>
      <head>
        <script dangerouslySetInnerHTML={{ __html: INTRO_SCRIPT }} />
      </head>
      <body className="antialiased">
        <div id="intro" aria-hidden="true" suppressHydrationWarning dangerouslySetInnerHTML={{ __html: INTRO_HTML }} />
        <a
          href="#main"
          className="sr-only focus:not-sr-only focus:fixed focus:left-4 focus:top-3 focus:z-[300] focus:rounded-xl focus:border focus:border-slate-900/[0.12] focus:bg-white focus:px-4 focus:py-2 focus:text-sm focus:font-semibold focus:text-ink"
        >
          Skip to content
        </a>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
