"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Image as ImageIcon, Video, Github, Twitter } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const isImagePage = pathname === "/";
  const isVideoPage = pathname === "/video-remover";

  return (
    <nav className="fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-3 sm:px-6 py-2 flex items-center justify-between gap-3 sm:gap-4">
        <div className="flex items-center gap-2 min-w-0 shrink-0">
          <Image
            src="/Banana.webp"
            alt="RemoveBanana logo"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md"
            priority
          />
          <span className="inline font-bold text-base sm:text-xl tracking-tight whitespace-nowrap">RemoveBanana</span>
        </div>

        <div className="flex items-center justify-end gap-2 sm:gap-3 min-w-0 text-sm font-medium text-gray-400">
          <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Link
              href="/"
              aria-label="Image Remover"
              aria-current={isImagePage ? "page" : undefined}
              className={`relative flex items-center justify-center gap-2 px-2.5 sm:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                isImagePage
                  ? "text-white shadow-lg bg-gradient-to-r from-blue-600 to-blue-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <ImageIcon className="w-5 h-5" />
              <span className="hidden sm:inline">Image Remover</span>
            </Link>

            <Link
              href="/video-remover"
              aria-label="Video Remover"
              aria-current={isVideoPage ? "page" : undefined}
              className={`relative flex items-center justify-center gap-2 px-2.5 sm:px-5 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                isVideoPage
                  ? "text-white shadow-lg bg-gradient-to-r from-fuchsia-600 to-fuchsia-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="hidden sm:inline">Video Remover</span>
            </Link>
          </div>

          <span className="w-px h-4 bg-white/20 shrink-0" />
          <a
            href="https://x.com/warrioraashuu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="hover:text-white transition-colors flex items-center p-2"
          >
            <Twitter className="w-4 h-4" />
          </a>
          <span className="w-px h-4 bg-white/20 shrink-0" />
          <a
            href="https://github.com/codeaashu/RemoveBanana"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white transition-colors flex items-center gap-2 p-2"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
