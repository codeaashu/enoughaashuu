"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import SoraRemover from "@/components/SoraRemover";
import Footer from "@/components/Footer";

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

        <div className="flex flex-col items-center">
          <a
            href="https://peerlist.io/aashuu/project/enough-aashuu"
            target="_blank"
            rel="noreferrer"
            className="mb-4"
            aria-label="Enough Aashuu on Peerlist"
          >
            <img
              src="https://peerlist.io/api/v1/projects/embed/PRJHNN7JQ6QA9KKLJ1OA9AK8O9AQP8?showUpvote=true&theme=dark"
              alt="enough aashuu"
              style={{ width: "auto", height: "72px" }}
            />
          </a>
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

      <Footer />
    </main>
  );
}
