"use client";

import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";

export default function QrCodeGeneratorBlogPage() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <TopNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <Link
            href="/blog"
            className="inline-flex items-center gap-2 text-gray-400 hover:text-white transition-colors mb-8"
          >
            <ArrowLeft className="w-4 h-4" />
            Back to Blog
          </Link>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
              QR Code Generator: Create Styled QR Codes for Any Use Case
            </h1>
            <p className="text-gray-400 mb-8">Published March 2026 · 6 min read</p>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <p className="text-lg">
                RemoveBanana now includes a complete QR code generator with support for links, Wi-Fi sharing,
                contact cards, event check-ins, SMS shortcuts, and geo pins. It is built for creators,
                businesses, and developers who need clean QR workflows without extra tools.
              </p>

              <h2 className="text-3xl font-bold text-white mt-12">What You Can Generate</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Text and URLs</li>
                <li>Wi-Fi login QR (SSID, password, encryption type)</li>
                <li>vCard contact QR (name, phone, email)</li>
                <li>Event QR with start/end date and location</li>
                <li>Phone and SMS quick-action QR</li>
                <li>Geo coordinates for map pin sharing</li>
              </ul>

              <h2 className="text-3xl font-bold text-white mt-12">Style Controls Included</h2>
              <p>
                Unlike simple generators, this tool gives you design-level control over the visual output.
              </p>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Single color, linear gradient, or radial gradient</li>
                <li>Dot style presets (dots, rounded, classy, square, and more)</li>
                <li>Corner container and corner piece style customization</li>
                <li>Logo upload for branded QR output</li>
                <li>One-click randomizer for quick style exploration</li>
              </ul>

              <h2 className="text-3xl font-bold text-white mt-12">Export & Delivery Options</h2>
              <ul className="list-disc list-inside space-y-2 ml-2">
                <li>Download PNG, JPEG, and SVG</li>
                <li>Copy QR image to clipboard</li>
                <li>Copy embed HTML code for websites</li>
                <li>Print-ready output in one click</li>
              </ul>

              <h2 className="text-3xl font-bold text-white mt-12">Use Cases</h2>
              <p>
                Add QR codes to social bios, posters, product packaging, menus, digital business cards,
                event tickets, and onboarding docs. The generator is optimized for both desktop and mobile
                workflows, so you can create and export quickly from anywhere.
              </p>

              <div className="bg-gradient-to-r from-cyan-500/10 to-blue-500/10 border border-cyan-400/20 rounded-xl p-6 mt-12">
                <p className="text-center">
                  Ready to create your first QR?{" "}
                  <Link href="/qr-code-generator" className="text-cyan-300 hover:text-cyan-200 font-semibold">
                    Open QR Generator
                  </Link>
                </p>
              </div>
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
