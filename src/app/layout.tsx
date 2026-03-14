import type { Metadata } from "next";
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
    <html lang="en">
      <body
        className={`${geistSans.variable} ${geistMono.variable} antialiased`}
      >
        {children}
      </body>
    </html>
  );
}
