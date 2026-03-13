"use client";

import { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, Image as ImageIcon, Video, ShieldCheck, Zap, Code } from "lucide-react";
import GeminiRemover from "@/components/GeminiRemover";
import SoraRemover from "@/components/SoraRemover";

export default function Home() {
  const [activeTab, setActiveTab] = useState<"gemini" | "sora">("gemini");

  return (
    <main className="min-h-screen bg-black text-white selection:bg-fuchsia-500/30 font-sans overflow-x-hidden">
      {/* Navigation Bar */}
      <nav className="fixed top-0 w-full border-b border-white/5 bg-black/50 backdrop-blur-xl z-50">
        <div className="max-w-7xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Sparkles className="w-6 h-6 text-fuchsia-500" />
            <span className="font-bold text-xl tracking-tight">RemoveAI</span>
          </div>
          <div className="flex items-center gap-6 text-sm font-medium text-gray-400">
            <a href="#how-it-works" className="hover:text-white transition-colors">How it Works</a>
            <a href="https://github.com/removebanana/removebanana" target="_blank" rel="noopener noreferrer" className="hover:text-white transition-colors flex items-center gap-2">
              <Code className="w-4 h-4" /> API
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
            Supports Gemini, Imagen 3, & Sora
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="text-5xl md:text-7xl font-extrabold tracking-tight mb-6 leading-tight"
          >
            Erase AI Watermarks <br />
            <span className="text-transparent bg-clip-text bg-gradient-to-r from-blue-400 via-purple-400 to-fuchsia-400">
              Mathematically.
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-400 mb-12 max-w-2xl mx-auto leading-relaxed"
          >
            The most advanced client-side AI watermark removal tool. Perfect extraction, zero quality loss, 100% privacy-first.
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
            <p className="text-gray-400">Industrial grade watermark processing for everyone.</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="glass p-8 rounded-3xl group hover:border-blue-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-blue-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Zap className="w-7 h-7 text-blue-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Mathematical Precision</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We don't use AI to guess pixels. We mathematically reverse Google's alpha blending formula to perfectly reconstruct the original image.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-green-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-green-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <ShieldCheck className="w-7 h-7 text-green-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">100% Secure & Private</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                All image processing happens directly on our servers without saving your files. No logs kept, complete privacy guaranteed.
              </p>
            </div>

            <div className="glass p-8 rounded-3xl group hover:border-fuchsia-500/30 transition-colors">
              <div className="w-14 h-14 rounded-2xl bg-fuchsia-500/10 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Video className="w-7 h-7 text-fuchsia-400" />
              </div>
              <h3 className="text-xl font-bold mb-3">Sora Raw Extraction</h3>
              <p className="text-gray-400 text-sm leading-relaxed">
                We scrape OpenAI's backend to deliver the raw, un-watermarked MP4 file directly from their CDN, completely bypassing the GUI overlays.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-500">
        <p>© 2026 RemoveAI Watermark Remover. All rights reserved.</p>
        <p className="mt-2 text-xs">A fast, secure, and privacy-first tool.</p>
      </footer>
    </main>
  );
}
