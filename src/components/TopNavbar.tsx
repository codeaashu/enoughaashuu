"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Image as ImageIcon, Video, Eraser, Github, Twitter, Brain, House, QrCode, Shapes, Pin } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const isLandingPage = pathname === "/";
  const isHomePage = pathname === "/";
  const isImagePage = pathname === "/image-remover";
  const isVideoPage = pathname === "/video-remover";
  const isBackgroundPage = pathname === "/background-remover";
  const isAIDetectorPage = pathname === "/ai-image-detector";
  const isQrCodePage = pathname === "/qr-code-generator";
  const isIconLogoPage = pathname === "/iconlogo";
  const isCorkboardPage = pathname?.startsWith("/corkboard");

  return (
    <nav
      className={isLandingPage
        ? "fixed inset-x-0 top-4 z-50 px-3 sm:px-5"
        : "fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl z-50"
      }
    >
      <div
        className={isLandingPage
          ? "max-w-6xl mx-auto px-3 sm:px-5 py-2.5 rounded-2xl border border-white/10 bg-black/55 backdrop-blur-2xl shadow-[0_10px_45px_rgba(0,0,0,0.45)] flex items-center justify-between gap-3 sm:gap-4"
          : "w-full max-w-none md:max-w-7xl mx-auto px-2 sm:px-4 md:px-6 py-2 flex items-center justify-center gap-2 sm:gap-3"
        }
      >
        {isLandingPage && (
          <Link href="/" className="flex items-center gap-2 min-w-0 shrink-0 group" aria-label="Go to home">
            <Image
              src="/enough.webp"
              alt="Enough Aashuu logo"
              width={28}
              height={28}
              className="h-7 w-7 rounded-md group-hover:scale-105 transition-transform duration-300"
              priority
            />
            <span
              className={isLandingPage
                ? "inline font-bold text-base sm:text-xl tracking-tight whitespace-nowrap bg-gradient-to-r from-amber-200 via-orange-200 to-pink-200 bg-clip-text text-transparent"
                : "inline font-bold text-base sm:text-xl tracking-tight whitespace-nowrap"
              }
            >
              Enough Aashuu
            </span>
          </Link>
        )}

        <div
          className={`flex items-center gap-2 sm:gap-3 min-w-0 text-sm font-medium text-gray-400 ${
            isLandingPage ? "justify-end" : "justify-center w-full"
          }`}
        >
          {!isLandingPage && (
            <div className="flex w-full flex-wrap items-center justify-between gap-1 p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10 overflow-hidden">
              <Link
                href="/"
                aria-label="Home"
                aria-current={isHomePage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-4 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isHomePage
                    ? "text-white shadow-lg bg-gradient-to-r from-slate-600 to-slate-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <House className="w-5 h-5" />
                <span className="hidden lg:inline">Home</span>
              </Link>

              <Link
                href="/image-remover"
                aria-label="Image Remover"
                aria-current={isImagePage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isImagePage
                    ? "text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <ImageIcon className="w-5 h-5" />
                <span className="hidden lg:inline">Image Remover</span>
              </Link>

              <Link
                href="/iconlogo"
                aria-label="IconLogo"
                aria-current={isIconLogoPage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isIconLogoPage
                    ? "text-white shadow-lg bg-gradient-to-r from-orange-600 to-amber-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <Shapes className="w-5 h-5" />
                <span className="hidden lg:inline">IconLogo</span>
              </Link>

              <Link
                href="/corkboard"
                aria-label="Corkboard"
                aria-current={isCorkboardPage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isCorkboardPage
                    ? "text-white shadow-lg bg-gradient-to-r from-red-600 to-pink-600"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <Pin className="w-5 h-5" />
                <span className="hidden lg:inline">Corkboard</span>
              </Link>

              <Link
                href="/qr-code-generator"
                aria-label="QR Code Generator"
                aria-current={isQrCodePage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isQrCodePage
                    ? "text-white shadow-lg bg-gradient-to-r from-cyan-600 to-blue-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <QrCode className="w-5 h-5" />
                <span className="hidden lg:inline">QR Generator</span>
              </Link>

              <Link
                href="/ai-image-detector"
                aria-label="AI Image Detector"
                aria-current={isAIDetectorPage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isAIDetectorPage
                    ? "text-white shadow-lg bg-gradient-to-r from-purple-600 to-pink-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <Brain className="w-5 h-5" />
                <span className="hidden lg:inline">AI Detector</span>
              </Link>

              <Link
                href="/video-remover"
                aria-label="Video Remover"
                aria-current={isVideoPage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isVideoPage
                    ? "text-white shadow-lg bg-gradient-to-r from-fuchsia-600 to-fuchsia-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <Video className="w-5 h-5" />
                <span className="hidden lg:inline">Video Remover</span>
              </Link>

              <Link
                href="/background-remover"
                aria-label="Background Remover"
                aria-current={isBackgroundPage ? "page" : undefined}
                className={`relative flex flex-1 min-w-0 items-center justify-center gap-0 md:gap-2 px-2 md:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 whitespace-nowrap ${isBackgroundPage
                    ? "text-white shadow-lg bg-gradient-to-r from-emerald-600 to-teal-500"
                    : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                <Eraser className="w-5 h-5" />
                <span className="hidden lg:inline">BG Remover</span>
              </Link>
            </div>
          )}

          {isLandingPage && (
            <>
              <a
                href="https://x.com/enoughaashuu/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="X"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2.5 text-gray-200 hover:text-white hover:bg-white/[0.1] hover:border-white/35 transition-all duration-300"
              >
                <Twitter className="w-4 h-4" />
                <span className="hidden sm:inline">X</span>
              </a>
              <a
                href="https://github.com/codeaashu/enoughaashuu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="GitHub"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-white/[0.04] px-4 py-2.5 text-gray-200 hover:text-white hover:bg-white/[0.1] hover:border-white/35 transition-all duration-300"
              >
                <Github className="w-4 h-4" />
                <span className="hidden sm:inline">GitHub</span>
              </a>
              <a
                href="https://buymeacoffee.com/aashuu"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Sponsor Enough Aashuu"
                className="inline-flex items-center gap-2 rounded-full border border-white/20 bg-gradient-to-r from-orange-500/5 via-pink-500/5 to-violet-500/5 px-4 py-2.5 text-white  hover:brightness-110 transition-all duration-300"
              >
                <Image
                  src="/Soft Ice Cream.webp"
                  alt="Sponsor"
                  width={16}
                  height={16}
                  className="h-4 w-4"
                />
                <span className="hidden sm:inline">icecream</span>
              </a>
            </>
          )}
        </div>
      </div>
    </nav>
  );
}
