"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import { Github, Twitter } from "lucide-react";
import TopNavbar from "@/components/TopNavbar";
import SoraRemover from "@/components/SoraRemover";

export default function VideoRemoverPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 overflow-x-hidden">
      <TopNavbar />

      <section className="pt-44 md:pt-36 pb-20 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-fuchsia-500 to-blue-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-center text-[clamp(2.2rem,6.2vw,5.2rem)] leading-[0.95] tracking-tight"
          >
            <span className="bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Remove
            </span>
            <motion.div
              animate={{ rotate: [0, 360, 360] }}
              transition={{ duration: 2.8, times: [0, 0.58, 1], repeat: Infinity, ease: "easeInOut" }}
              className="inline-flex origin-center will-change-transform"
            >
              <Image
                src="/Sora.png"
                alt="Sora"
                width={420}
                height={96}
                className="h-[0.9em] w-auto shrink-0 object-contain"
                priority
              />
            </motion.div>
            <span className="bg-gradient-to-r from-fuchsia-400 via-blue-400 to-cyan-400 bg-clip-text text-transparent">
              Watermarks
            </span>
            <span className="inline-flex items-center justify-center">
              {/* <Image
                src="/Banana.webp"
                alt="RemoveBanana logo"
                width={56}
                height={56}
                className="h-[0.95em] w-[0.95em] rounded-xl object-cover"
                priority
              /> */}
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Remove invisible AI watermarks from Sora AI-generated videos. Paste your Sora share link to extract the original prompt and download the clean MP4 using reverse alpha blending mathematics. A 100% fast and secure, lossless solution completely in your browser.
          </motion.p>
        </div>

        <div className="flex justify-center">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300 mb-8"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-fuchsia-400 opacity-75"></span>
              <span className="relative inline-flex rounded-full h-2 w-2 bg-fuchsia-500"></span>
            </span>
            Supports: OpenAI Sora • Sora 2 • ChatGPT Sora
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <SoraRemover />
        </div>
      </section>

      {/* <section id="how-it-works" className="py-24 border-t border-white/5 bg-black/40 relative">
        <div className="max-w-7xl mx-auto px-6">
          <div className="text-center mb-16">
            <h2 className="text-3xl md:text-5xl font-bold mb-4 tracking-tight">Why Choose Us?</h2>
            <p className="text-gray-400">Built as RemoveBanana by aashuu for fast, direct watermark workflows.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl group hover:border-blue-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Fast Extraction</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Pull direct media URLs from share links quickly so you can preview and download in one flow.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-green-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Secure & Private</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                No account linking and no clutter. Paste the link, extract the source, and keep your workflow clean.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-fuchsia-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ImageIcon className="w-7 h-7 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Switch Any Time</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Use the same top navbar on both pages to jump between image remover and video remover instantly.
              </p>
            </div>
          </div>
        </div>
      </section> */}

      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-500">
        <p>aashuu ✦</p>
        <div className="mt-2 flex items-center justify-center gap-1 text-xs">
          <a href="https://x.com/warrioraashuu/" target="_blank" rel="noopener noreferrer" aria-label="X" className="hover:text-white transition-colors inline-flex items-center p-2"><Twitter className="w-4 h-4" /></a>
          <span className="w-px h-4 bg-white/20" />
          <a
            href="https://github.com/codeaashu/RemoveBanana"
            target="_blank"
            rel="noopener noreferrer"
            aria-label="GitHub Repository"
            className="hover:text-white transition-colors inline-flex items-center p-2"
          >
            <Github className="w-4 h-4" />
          </a>
        </div>
      </footer>
    </main>
  );
}
