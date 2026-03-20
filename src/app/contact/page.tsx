"use client";

import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";
import { Github, Twitter, Mail } from "lucide-react";

export default function Contact() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <TopNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
            className="mb-16"
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-6">
              Get in Touch
            </h1>
            <p className="text-xl text-gray-400">
              Have questions, feedback, or found a bug? Reach out to us directly.
            </p>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-16"
          >
            <a
              href="https://x.com/warrioraashuu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-blue-400/50 transition-all group"
            >
              <Twitter className="w-8 h-8 mb-4 text-blue-400 group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">X (Twitter)</h3>
              <p className="text-sm text-gray-400">@warrioraashuu</p>
              <p className="text-xs text-gray-500 mt-2">Fastest response</p>
            </a>

            <a
              href="https://github.com/codeaashu/enoughaashuu"
              target="_blank"
              rel="noopener noreferrer"
              className="p-8 rounded-2xl bg-white/5 border border-white/10 hover:border-white/50 transition-all group"
            >
              <Github className="w-8 h-8 mb-4 text-white group-hover:scale-110 transition-transform" />
              <h3 className="text-lg font-semibold text-white mb-2">GitHub</h3>
              <p className="text-sm text-gray-400">codeaashu</p>
              <p className="text-xs text-gray-500 mt-2">Report issues & contribute</p>
            </a>

            <div className="p-8 rounded-2xl bg-white/5 border border-white/10">
              <Mail className="w-8 h-8 mb-4 text-green-400" />
              <h3 className="text-lg font-semibold text-white mb-2">Email</h3>
              <p className="text-sm text-gray-400">hellow.ashutosh@gmail.com</p>
              <p className="text-xs text-gray-500 mt-2">General inquiries</p>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="bg-white/5 border border-white/10 rounded-2xl p-8"
          >
            <h2 className="text-2xl font-semibold text-white mb-4">What We're Looking For</h2>
            <ul className="space-y-3 text-gray-400">
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Bug reports & technical issues</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Feature requests & improvement ideas</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Contributions & code reviews</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Partnership & collaboration inquiries</span>
              </li>
              <li className="flex items-start gap-3">
                <span className="text-green-400 mt-1">✓</span>
                <span>Press & media requests</span>
              </li>
            </ul>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5, delay: 0.3 }}
            className="mt-16 bg-gradient-to-r from-blue-500/10 to-fuchsia-500/10 border border-blue-400/20 rounded-2xl p-8 text-center"
          >
            <h2 className="text-2xl font-semibold text-white mb-2">Help Us Improve</h2>
            <p className="text-gray-400">
              Enough Aashuu is a community-driven project. Your feedback directly shapes the future of the tool.
            </p>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
