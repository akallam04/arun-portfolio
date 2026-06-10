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
const TITLE = "Arun Teja Reddy Kallam | CS @ ASU · AI, Full-Stack & Data";
const DESCRIPTION =
  "Computer Science student at Arizona State University in Tempe, AZ building AI-powered products, full-stack web apps, and data-driven systems. Open to Fall 2026 co-ops.";

export const metadata: Metadata = {
  metadataBase: new URL(SITE),
  title: TITLE,
  description: DESCRIPTION,
  keywords: [
    "Arun Teja Reddy Kallam",
    "ASU Computer Science",
    "AI engineer",
    "LLM engineering",
    "full-stack developer",
    "software engineering co-op",
    "Tempe Arizona developer",
    "Phoenix software engineer",
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
    "AI and LLM Engineering",
    "Full-Stack Web Development",
    "Software Engineering",
    "Data Analytics",
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
