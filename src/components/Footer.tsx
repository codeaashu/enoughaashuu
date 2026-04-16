"use client";

import Link from "next/link";
import { Github, Twitter } from "lucide-react";
import { BRAND_TAGLINE } from "@/lib/brand";

export default function Footer() {
  const currentYear = new Date().getFullYear();

  return (
    <footer className="border-t border-white/5 py-12 px-6">
      <div className="max-w-6xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-8 mb-12">
          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Tools</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/image-remover" className="hover:text-white transition-colors">
                  Image Remover
                </Link>
              </li>
              <li>
                <Link href="/video-remover" className="hover:text-white transition-colors">
                  Video Remover
                </Link>
              </li>
              <li>
                <Link href="/background-remover" className="hover:text-white transition-colors">
                  Background Remover
                </Link>
              </li>
              <li>
                <Link href="/ai-image-detector" className="hover:text-white transition-colors">
                  AI Image Detector
                </Link>
              </li>
              <li>
                <Link href="/qr-code-generator" className="hover:text-white transition-colors">
                  QR Generator
                </Link>
              </li>
              <li>
                <Link href="/iconlogo" className="hover:text-white transition-colors">
                  IconLogo
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Company</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/about" className="hover:text-white transition-colors">
                  About
                </Link>
              </li>
              <li>
                <Link href="/contact" className="hover:text-white transition-colors">
                  Contact
                </Link>
              </li>
              <li>
                <Link href="/blog" className="hover:text-white transition-colors">
                  Blog
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Legal</h4>
            <ul className="space-y-2 text-sm text-gray-400">
              <li>
                <Link href="/privacy-policy" className="hover:text-white transition-colors">
                  Privacy Policy
                </Link>
              </li>
              <li>
                <Link href="/terms-of-service" className="hover:text-white transition-colors">
                  Terms of Service
                </Link>
              </li>
            </ul>
          </div>

          <div>
            <h4 className="text-sm font-semibold text-white mb-4">Follow</h4>
            <div className="flex gap-3">
              <a
                href="https://x.com/warrioraashuu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Twitter className="w-5 h-5" />
              </a>
              <a
                href="https://github.com/codeaashu/enoughaashuu"
                target="_blank"
                rel="noopener noreferrer"
                className="text-gray-400 hover:text-white transition-colors"
              >
                <Github className="w-5 h-5" />
              </a>
            </div>
          </div>
        </div>

        <div className="border-t border-white/5 pt-8 text-center text-sm text-gray-500">
          <p className="mb-2 text-gray-400">{BRAND_TAGLINE}</p>
          <p>© {currentYear} Enough Aashuu by aashuu ✦</p>
        </div>
      </div>
    </footer>
  );
}
