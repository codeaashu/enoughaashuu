"use client";

import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import { Github, Twitter } from "lucide-react";
import { BRAND_DESCRIPTION, BRAND_TAGLINE } from "@/lib/brand";

export default function About() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <TopNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-12"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              About RemoveBanana
            </h1>
            <p className="text-xl text-gray-400 leading-relaxed">
              {BRAND_TAGLINE}
            </p>
            <p className="text-lg text-gray-400 leading-relaxed mt-4">
              {BRAND_DESCRIPTION}
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="space-y-8"
          >
            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Our Mission</h2>
              <p className="text-gray-400 leading-relaxed">
                RemoveBanana exists to give creators full control over AI-generated content. Google embeds invisible watermarks (SynthID) into every Gemini image, and OpenAI adds overlays to Sora videos. These watermarks serve corporate interests, not creators.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                We built RemoveBanana to restore agency — enabling artists, designers, and creators to use AI tools without invisible tracking or restrictions.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">How It Works</h2>
              <p className="text-gray-400 leading-relaxed">
                <strong>For Images:</strong> RemoveBanana uses reverse alpha blending mathematics to detect and remove SynthID watermarks embedded in pixel data. All processing happens in your browser — your images never leave your device.
              </p>
              <p className="text-gray-400 leading-relaxed mt-4">
                <strong>For Videos:</strong> Sora watermarks are frontend overlays, not embedded in the file. We extract the direct URL to the clean MP4 from OpenAI's CDN and serve it to you — no watermark, no re-encoding.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Privacy First</h2>
              <p className="text-gray-400 leading-relaxed">
                100% of your data stays on your device. No uploads, no tracking, no accounts. We don't store images, videos, or usage data. RemoveBanana is the most private AI watermark removal tool available.
              </p>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">Built by aashuu</h2>
              <p className="text-gray-400 leading-relaxed">
                RemoveBanana is developed and maintained by aashuu, a builder focused on open-source tools that respect user privacy and autonomy. The full source code is available on GitHub.
              </p>
              <div className="flex gap-4 mt-4">
                <a
                  href="https://x.com/warrioraashuu"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Twitter className="w-4 h-4" />
                  Follow on X
                </a>
                <a
                  href="https://github.com/codeaashu/RemoveBanana"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <Github className="w-4 h-4" />
                  View on GitHub
                </a>
              </div>
            </div>

            <div>
              <h2 className="text-2xl font-semibold text-white mb-4">License</h2>
              <p className="text-gray-400 leading-relaxed">
                RemoveBanana is released under the MIT License. You're free to use, modify, and distribute it for any purpose.
              </p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="border-t border-white/5 py-12 text-center text-sm text-gray-500 px-6">
        <p>© 2026 RemoveBanana by aashuu ✦</p>
      </footer>
    </main>
  );
}
