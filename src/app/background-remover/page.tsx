"use client";

import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";
import BackgroundRemover from "@/components/BackgroundRemover";

export default function BackgroundRemoverPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-emerald-500/30 overflow-x-hidden">
      <TopNavbar />

      <section className="pt-44 md:pt-36 pb-20 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[420px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-emerald-500 to-cyan-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-[clamp(2.2rem,6.4vw,5.4rem)] leading-[0.95] tracking-tight"
          >
            <span className="bg-gradient-to-r from-emerald-300 via-cyan-300 to-teal-300 bg-clip-text text-transparent">
              Remove Image Backgrounds
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-10 max-w-3xl mx-auto leading-relaxed"
          >
            Local AI background removal for any image. Process multiple files, preview result vs original,
            apply transparent or custom backgrounds, and export single PNG files or ZIP batches.
          </motion.p>

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
          </div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300"
          >
            <span className="relative flex h-2 w-2">
              <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-emerald-400 opacity-75" />
              <span className="relative inline-flex rounded-full h-2 w-2 bg-emerald-500" />
            </span>
            Supports: PNG • JPG • WEBP • GIF • BMP • TIFF
          </motion.div>
        </div>
      </section>

      <section className="px-6 pb-28">
        <BackgroundRemover />
      </section>

      <Footer />
    </main>
  );
}
