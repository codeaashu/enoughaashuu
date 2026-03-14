import type { Metadata } from "next";
import { Instrument_Serif } from "next/font/google";
import "./globals.css";

const instrumentSerif = Instrument_Serif({
  variable: "--font-instrument-serif",
  subsets: ["latin"],
  weight: "400",
  fallback: ["serif"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://removebanana.aashuu.tech"),
  title: "RemoveBanana",
  description:
    "Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics.",
  applicationName: "RemoveBanana",
  authors: [{ name: "aashuu", url: "https://x.com/warrioraashuu/" }],
  creator: "aashuu",
  publisher: "aashuu",
  alternates: {
    canonical: "/",
  },
  icons: {
    icon: "/Banana.webp",
    shortcut: "/Banana.webp",
    apple: "/Banana.webp",
  },
  openGraph: {
    title: "RemoveBanana",
    description:
      "Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics.",
    url: "https://removebanana.aashuu.tech/",
    siteName: "RemoveBanana",
    type: "website",
    images: ["/Banana.webp"],
  },
  twitter: {
    card: "summary_large_image",
    creator: "@warrioraashuu",
    title: "RemoveBanana",
    description:
      "Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics.",
    images: ["/Banana.webp"],
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={instrumentSerif.variable}>
      <body className="antialiased">
        {children}
      </body>
    </html>
  );
}
