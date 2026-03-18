import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import { Analytics } from "@vercel/analytics/next";
import InstallAppPrompt from "../components/InstallAppPrompt";
import { BRAND_DESCRIPTION, BRAND_NAME, BRAND_TAGLINE, BRAND_URL } from "@/lib/brand";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  fallback: ["serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL(BRAND_URL),
  title: {
    default: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    template: `%s | ${BRAND_NAME}`,
  },
  description: BRAND_DESCRIPTION,
  keywords: [
    "remove banana",
    "removebanana",
    "a banana that removes the hard parts",
    "ai toolkit",
    "clean detect generate",
    "aashuu",
    "gemini watermark remover",
    "synthid remover",
    "imagen watermark remover",
    "sora watermark remover",
    "ai watermark remover",
  ],
  applicationName: BRAND_NAME,
  authors: [{ name: "aashuu", url: "https://x.com/warrioraashuu/" }],
  creator: "aashuu",
  publisher: "aashuu",
  robots: {
    index: true,
    follow: true,
    googleBot: {
      index: true,
      follow: true,
      "max-image-preview": "large",
      "max-snippet": -1,
      "max-video-preview": -1,
    },
  },
  alternates: {
    canonical: "/",
  },
  manifest: "/manifest.webmanifest",
  icons: {
    icon: "/Banana.webp",
    shortcut: "/Banana.webp",
    apple: "/Banana.webp",
  },
  openGraph: {
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: BRAND_DESCRIPTION,
    url: `${BRAND_URL}/`,
    siteName: BRAND_NAME,
    type: "website",
    images: [
      {
        url: "/Preview.png",
        width: 1200,
        height: 630,
        alt: `${BRAND_NAME} - ${BRAND_TAGLINE}`,
      },
    ],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@warrioraashuu",
    site: "@warrioraashuu",
    title: `${BRAND_NAME} | ${BRAND_TAGLINE}`,
    description: BRAND_DESCRIPTION,
    images: ["/Preview.png"],
  },
};

const jsonLd = {
  "@context": "https://schema.org",
  "@graph": [
    {
      "@type": "WebSite",
      name: BRAND_NAME,
      url: BRAND_URL,
      slogan: BRAND_TAGLINE,
      description: BRAND_DESCRIPTION,
      inLanguage: "en",
      publisher: {
        "@type": "Person",
        name: "aashuu",
        url: "https://x.com/warrioraashuu/",
      },
    },
    {
      "@type": "SoftwareApplication",
      name: BRAND_NAME,
      applicationCategory: "MultimediaApplication",
      operatingSystem: "Web",
      url: BRAND_URL,
      description: BRAND_DESCRIPTION,
      author: {
        "@type": "Person",
        name: "aashuu",
        url: "https://x.com/warrioraashuu/",
      },
    },
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body className="antialiased">
        <script
          type="application/ld+json"
          dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
        />
        {children}
        <InstallAppPrompt />
        <Analytics />
      </body>
    </html>
  );
}
