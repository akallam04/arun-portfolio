import type { Metadata, Viewport } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

const SITE = "https://arunkallam.vercel.app";
const TITLE = "Arun Teja Reddy Kallam — CS @ ASU · Full-Stack & Data";
const DESCRIPTION =
  "Computer Science student at Arizona State University (4.0 GPA) building full-stack apps, reliable APIs, and data-driven products. Open to Summer 2026 internships.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Arun Teja Reddy Kallam",
    "ASU Computer Science",
    "full-stack developer",
    "data analyst",
    "software engineering intern",
    "React",
    "Next.js",
    "Python",
  ],
  authors: [{ name: "Arun Teja Reddy Kallam", url: SITE }],
  creator: "Arun Teja Reddy Kallam",
  alternates: { canonical: "/" },
  openGraph: {
    type: "website",
    url: SITE,
    title: TITLE,
    description: DESCRIPTION,
    siteName: "Arun Teja Reddy Kallam",
  },
  twitter: {
    card: "summary_large_image",
    title: TITLE,
    description: DESCRIPTION,
  },
  robots: { index: true, follow: true },
};

export const viewport: Viewport = {
  themeColor: "#05070c",
  width: "device-width",
  initialScale: 1,
  viewportFit: "cover",
};

const personJsonLd = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Arun Teja Reddy Kallam",
  url: SITE,
  email: "mailto:akallam04@gmail.com",
  jobTitle: "Computer Science Student & Full-Stack Developer",
  alumniOf: {
    "@type": "CollegeOrUniversity",
    name: "Arizona State University",
  },
  address: {
    "@type": "PostalAddress",
    addressLocality: "Tempe",
    addressRegion: "AZ",
    addressCountry: "US",
  },
  sameAs: [
    "https://github.com/akallam04",
    "https://linkedin.com/in/akallam3",
  ],
  knowsAbout: [
    "Full-Stack Web Development",
    "Data Analytics",
    "AI and LLM Engineering",
    "React",
    "Next.js",
    "Python",
    "SQL",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body className={`${geistSans.variable} ${geistMono.variable} antialiased`}>
        {children}
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personJsonLd) }}
        />
      </body>
    </html>
  );
}
