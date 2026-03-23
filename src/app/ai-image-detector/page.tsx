"use client";

import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";
import AiImageDetector from "@/components/AiImageDetector";

export default function AIImageDetectorPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-purple-500/30 overflow-x-hidden">
      <TopNavbar />

      <section className="pt-44 md:pt-36 pb-20 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[420px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-purple-500 via-pink-500 to-red-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="mb-6 text-[clamp(2.2rem,6.4vw,5.4rem)] leading-[0.95] tracking-tight"
          >
            <span className="bg-gradient-to-r from-purple-300 via-pink-300 to-red-300 bg-clip-text text-transparent">
              AI Image Detector
            </span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="text-lg md:text-xl text-gray-300 mb-4 leading-relaxed max-w-2xl mx-auto"
          >
            Advanced Hybrid Intelligence for detecting AI-generated images. Uses 3 independent detection engines for maximum accuracy and reliability.
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
            className="flex flex-wrap justify-center gap-3 text-sm md:text-base mb-12"
          >
            <span className="px-4 py-2 rounded-full bg-purple-500/20 border border-purple-500/30 text-purple-200">
              ⚡ Sightengine GenAI
            </span>
            <span className="px-4 py-2 rounded-full bg-orange-500/20 border border-orange-500/30 text-orange-200">
              🧠 Hugging Face ViT
            </span>
            <span className="px-4 py-2 rounded-full bg-cyan-500/20 border border-cyan-500/30 text-cyan-200">
              📊 Local Metadata
            </span>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, y: 40 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5, delay: 0.4 }}
        >
          <AiImageDetector />
        </motion.div>
      </section>

      {/* Features Section */}
      <section className="py-20 px-6 bg-gradient-to-b from-transparent via-purple-900/5 to-transparent">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            Why Choose Our Detector?
          </h2>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-3">⚡</div>
              <h3 className="text-lg font-semibold mb-2">Multi-Engine Ensemble</h3>
              <p className="text-gray-400">
                Uses 3 independent detection engines for maximum reliability: Sightengine GenAI, Hugging Face ViT, and local metadata analysis.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-3">🎯</div>
              <h3 className="text-lg font-semibold mb-2">Weighted Voting System</h3>
              <p className="text-gray-400">
                Smart aggregation logic that reduces false positives by cross-validating results from all detection engines.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-3">🔒</div>
              <h3 className="text-lg font-semibold mb-2">Privacy-First</h3>
              <p className="text-gray-400">
                Images are processed in real-time and never stored on our servers. Complete privacy guaranteed.
              </p>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="bg-white/5 border border-white/10 rounded-2xl p-6 hover:bg-white/10 transition-colors"
            >
              <div className="text-3xl mb-3">📊</div>
              <h3 className="text-lg font-semibold mb-2">Detailed Analysis</h3>
              <p className="text-gray-400">
                Get comprehensive insights including confidence scores, metadata findings, and detailed engine reports.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* How It Works Section */}
      {/* <section className="py-20 px-6">
        <div className="max-w-5xl mx-auto">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16">
            How It Works
          </h2>

          <div className="space-y-6">
            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5 }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-purple-500 flex items-center justify-center font-bold text-white">
                1
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Upload Your Image</h3>
                <p className="text-gray-400">
                  Drag and drop or select any image you want to analyze for AI generation signatures.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-orange-500 flex items-center justify-center font-bold text-white">
                2
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Multi-Engine Analysis</h3>
                <p className="text-gray-400">
                  Our system processes the image through 3 independent detection engines simultaneously for comprehensive analysis.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-cyan-500 flex items-center justify-center font-bold text-white">
                3
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Vote & Aggregate</h3>
                <p className="text-gray-400">
                  Results are aggregated using a weighted voting system to provide the most accurate final verdict.
                </p>
              </div>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: -20 }}
              whileInView={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              className="flex gap-6 items-start"
            >
              <div className="flex-shrink-0 w-12 h-12 rounded-full bg-emerald-500 flex items-center justify-center font-bold text-white">
                4
              </div>
              <div>
                <h3 className="text-lg font-semibold mb-2">Get Detailed Results</h3>
                <p className="text-gray-400">
                  View comprehensive analysis with confidence scores, metadata findings, and downloadable reports.
                </p>
              </div>
            </motion.div>
          </div>
        </div>
      </section> */}

      <Footer />
    </main>
  );
}
