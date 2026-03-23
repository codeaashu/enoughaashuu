"use client";

import Image from "next/image";
import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import GeminiRemover from "@/components/GeminiRemover";
import Footer from "@/components/Footer";

export default function Home() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 overflow-x-hidden">
      <TopNavbar />

      {/* Hero Section */}
      <section className="pt-44 md:pt-36 pb-20 px-6 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-fuchsia-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-center text-[clamp(2.35rem,6.8vw,5.9rem)] leading-[0.95] tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Remove
            </span>
            <Image
              src="/Gemini.gif"
              alt="Gemini"
              width={420}
              height={96}
              className="h-[0.9em] w-auto shrink-0 object-contain"
              priority
            />
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Watermarks
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics.
            A fast, secure, and lossless workflow that runs directly in your browser.
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
            Supports: Gemini • Imagen 2 - 3 • Nano Banana
          </motion.div>
        </div>
      </section>

      {/* App Workspace */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <GeminiRemover />
        </div>
      </section>

      <section className="px-6 pb-28">
        <div className="max-w-6xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.3 }}
            transition={{ duration: 0.45 }}
            className="text-center mb-12"
          >
            <h2 className="text-[clamp(2rem,5vw,3.6rem)] font-semibold tracking-tight text-white">
              Pixel-Perfect Results
            </h2>
            <p className="mt-3 text-base md:text-2xl text-gray-400">
              See the difference. Zero quality loss, mathematically reversed pixels.
            </p>
          </motion.div>

          <div className="grid grid-cols-1 lg:grid-cols-[1fr_auto_1fr] gap-8 items-start">
            <motion.figure
              initial={{ opacity: 0, x: -16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="mx-auto w-full max-w-[460px]"
            >
              <div className="relative rounded-3xl overflow-hidden border border-white/15 bg-white/5">
                <span className="absolute top-4 left-4 z-10 rounded-full bg-black/60 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                  BEFORE
                </span>
                <Image
                  src="/NanoBanana.png"
                  alt="Original Gemini image with embedded alpha watermark"
                  width={768}
                  height={768}
                  className="h-auto w-full object-cover"
                />
              </div>
              <figcaption className="mt-4 text-center text-sm md:text-lg text-gray-400">
                Original Gemini image with embedded alpha-watermark.
              </figcaption>
            </motion.figure>

            <div className="hidden lg:flex items-center justify-center pt-48">
              <div className="h-16 w-16 rounded-full bg-blue-500/15 border border-blue-400/30 grid place-items-center text-3xl text-blue-300">
                →
              </div>
            </div>

            <motion.figure
              initial={{ opacity: 0, x: 16 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true, amount: 0.25 }}
              transition={{ duration: 0.45 }}
              className="mx-auto w-full max-w-[460px]"
            >
              <div className="relative rounded-3xl overflow-hidden border border-blue-400/40 bg-white/5">
                <span className="absolute top-4 right-4 z-10 rounded-full bg-blue-600/90 px-3 py-1 text-xs font-semibold tracking-wide text-white">
                  CLEANED
                </span>
                <Image
                  src="/enough.png"
                  alt="Watermark removed output from Enough Aashuu"
                  width={768}
                  height={768}
                  className="h-auto w-full object-cover"
                />
                <div className="pointer-events-none absolute inset-0 overflow-hidden">
                  <motion.div
                    className="absolute inset-x-0 h-14 mix-blend-screen"
                    initial={{ top: "-14%", opacity: 0.78 }}
                    animate={{ top: ["-14%", "100%"], opacity: [0.78, 1, 0.86] }}
                    transition={{
                      top: { duration: 1.75, repeat: Infinity, repeatDelay: 0.12, ease: "linear" },
                      opacity: { duration: 0.22, repeat: Infinity, repeatType: "mirror", ease: "easeInOut" },
                    }}
                  >
                    <div className="h-full w-full bg-gradient-to-b from-transparent via-blue-300/25 to-transparent" />
                    <div className="absolute inset-x-0 top-1/2 h-8 -translate-y-1/2 bg-gradient-to-b from-transparent via-blue-400/30 to-transparent blur-md" />
                    <div className="absolute inset-x-0 top-1/2 h-[2px] -translate-y-1/2 bg-blue-300 shadow-[0_0_30px_rgba(96,165,250,1)]" />
                    <div className="absolute inset-x-0 top-1/2 h-px -translate-y-[3px] bg-blue-100/80" />
                  </motion.div>
                </div>
              </div>
              <figcaption className="mt-4 text-center text-sm md:text-lg text-gray-400">
                100% losslessly cleaned output ready for use.
              </figcaption>
            </motion.figure>
          </div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
