"use client";

import { useState } from "react";
import Image from "next/image";
import { motion, AnimatePresence } from "framer-motion";
import { Image as ImageIcon, Video, ShieldCheck, Zap, Code } from "lucide-react";
import GeminiRemover from "@/components/GeminiRemover";
import SoraRemover from "@/components/SoraRemover";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gemini" | "sora">("gemini");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
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
          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="https://removebanana.aashuu.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">Website</a>
            <a href="https://x.com/warrioraashuu/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">X</a>
            <a href="https://github.com/codeaashu/RemoveBanana" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <Code className="w-4 h-4" /> GitHub
            </a>
          </div>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-32 pb-20 px-6 relative">
        {/* Background Gradients */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-blue-500 to-fuchsia-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
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
            Supports Gemini, Imagen 2, Imagen 3, Nano Banana, and Sora
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-center text-[clamp(2.35rem,6.8vw,5.9rem)] leading-[0.95] tracking-tight"
          >
            <span className="bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400 bg-clip-text text-transparent">
              Remove
            </span>
            {/* <Image
              src="/Google.png"
              alt="Google"
              width={430}
              height={96}
              className="h-[0.9em] w-auto shrink-0 object-contain"
              priority
            /> */}
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
            <span className="inline-flex items-center justify-center">
              <Image
                src="/Banana.webp"
                alt="RemoveBanana logo"
                width={56}
                height={56}
                className="h-[0.95em] w-[0.95em] rounded-xl object-cover"
                priority
              />
            </span>

          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            Remove invisible AI watermarks from Google Gemini-generated images using reverse alpha blending mathematics. No AI guessing, no quality loss.
          </motion.p>
        </div>
      </section>

      {/* App Workspace */}
      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          {/* Tabs */}
          <div className="flex justify-center mb-12 relative z-20">
            <div className="inline-flex p-1.5 bg-white/5 backdrop-blur-xl rounded-2xl border border-white/10">
              <button
                onClick={() => setActiveTab("gemini")}
                className={`relative flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "gemini" ? "text-white shadow-lg" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                {activeTab === "gemini" && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-gradient-to-r from-blue-600 to-blue-500 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <ImageIcon className="w-5 h-5" /> Image (Gemini)
                </span>
              </button>

              <button
                onClick={() => setActiveTab("sora")}
                className={`relative flex items-center gap-2 px-8 py-3.5 rounded-xl font-medium text-sm transition-all duration-300 ${activeTab === "sora" ? "text-white shadow-lg" : "text-gray-400 hover:text-gray-200 hover:bg-white/5"
                  }`}
              >
                {activeTab === "sora" && (
                  <motion.div
                    layoutId="active-tab"
                    className="absolute inset-0 bg-gradient-to-r from-fuchsia-600 to-fuchsia-500 rounded-xl"
                    initial={false}
                    transition={{ type: "spring", stiffness: 500, damping: 30 }}
                  />
                )}
                <span className="relative z-10 flex items-center gap-2">
                  <Video className="w-5 h-5" /> Video (Sora)
                </span>
              </button>
            </div>
          </div>

          {/* Active Tool View */}
          <AnimatePresence mode="wait">
            <motion.div
              key={activeTab}
              initial={{ opacity: 0, y: 20, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: -20, scale: 0.98 }}
              transition={{ duration: 0.4, type: "spring", bounce: 0 }}
            >
              {activeTab === "gemini" ? <GeminiRemover /> : <SoraRemover />}
            </motion.div>
          </AnimatePresence>
        </div>
      </section>

      {/* Features Grid */}
      <section id="how-it-works" className="py-24 border-t border-white/5 bg-black/40 relative">
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
              <h3 className="text-xl font-bold mb-3">Mathematical Precision</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                RemoveBanana uses the exact inverse of Google's alpha blending formula to reconstruct the original pixels with precision.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-green-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Secure & Private</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                Process your Gemini images fast with a clean product interface, direct file flow, and a focused experience for this tool.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-fuchsia-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sora Raw Extraction</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                The second workspace is designed for Sora share-link extraction and download flows inside the same RemoveBanana product.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-500">
        <p>© 2026 RemoveBanana. Created by aashuu.</p>
        <p className="mt-2 text-xs">
          <a href="https://removebanana.aashuu.tech/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">removebanana.aashuu.tech</a>
          {" · "}
          <a href="https://x.com/warrioraashuu/" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">@warrioraashuu</a>
          {" · "}
          <a href="https://github.com/codeaashu/RemoveBanana" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors">GitHub Repository</a>
        </p>
      </footer>
    </main>
  );
}
