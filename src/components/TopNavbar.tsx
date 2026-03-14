"use client";

import Link from "next/link";
import Image from "next/image";
import { usePathname } from "next/navigation";
import { Image as ImageIcon, Video, Github } from "lucide-react";

export default function TopNavbar() {
  const pathname = usePathname();
  const isImagePage = pathname === "/";
  const isVideoPage = pathname === "/video-remover";

  return (
    <nav className="fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 py-3 flex flex-wrap items-center gap-3">
        <div className="order-1 flex items-center gap-2">
          <Image
            src="/Banana.webp"
            alt="RemoveBanana logo"
            width={28}
            height={28}
            className="h-7 w-7 rounded-md"
            priority
          />
          <span className="font-bold text-xl tracking-tight">RemoveBanana</span>
        </div>

        <div className="order-3 basis-full flex justify-center md:order-2 md:basis-auto md:mx-auto">
          <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
            <Link
              href="/"
              aria-label="Image Remover"
              aria-current={isImagePage ? "page" : undefined}
              className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm transition-all duration-300 ${
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
              className={`relative flex items-center justify-center gap-2 px-4 sm:px-6 py-2.5 rounded-xl text-sm transition-all duration-300 ${
                isVideoPage
                  ? "text-white shadow-lg bg-gradient-to-r from-fuchsia-600 to-fuchsia-500"
                  : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
              }`}
            >
              <Video className="w-5 h-5" />
              <span className="hidden sm:inline">Video Remover</span>
            </Link>
          </div>
        </div>

        <div className="order-2 ml-auto flex items-center gap-3 sm:gap-5 text-sm font-medium text-gray-400 md:order-3 md:ml-0">
          <a
            href="https://x.com/warrioraashuu/"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="X"
            className="hover:text-white transition-colors text-base leading-none"
          >
            𝕏
          </a>
          <a
            href="https://github.com/codeaashu/RemoveBanana"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub"
            className="hover:text-white transition-colors flex items-center gap-2"
          >
            <Github className="w-4 h-4" />
            <span className="hidden sm:inline">GitHub</span>
          </a>
        </div>
      </div>
    </nav>
  );
}
