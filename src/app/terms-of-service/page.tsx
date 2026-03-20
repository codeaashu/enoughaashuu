"use client";

import { motion } from "framer-motion";
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";

export default function TermsOfService() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <TopNavbar />

      <section className="pt-32 pb-20 px-6">
        <div className="max-w-3xl mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.5 }}
          >
            <h1 className="text-5xl md:text-6xl font-bold tracking-tight text-white mb-4">
              Terms of Service
            </h1>
            <p className="text-gray-400 mb-8">Last updated: March 2026</p>

            <div className="prose prose-invert max-w-none space-y-6 text-gray-300">
              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">1. Acceptance of Terms</h2>
                <p>
                  By accessing and using Enough Aashuu (&quot;the Service&quot;), you agree to be bound by these Terms of Service. If you do not agree to these terms, do not use the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">2. Service Description</h2>
                <p>
                  Enough Aashuu is a toolkit for media cleanup and utility workflows, including image watermark cleanup, Sora video cleanup, background removal, AI image detection, and QR code generation. The Service is provided &quot;as-is&quot; without warranties of any kind.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">3. User Responsibilities</h2>
                <p>You agree that you will:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-4">
                  <li>Use the Service only for lawful purposes</li>
                  <li>Not violate copyright or intellectual property rights of others</li>
                  <li>Not use the Service to create counterfeit, fraudulent, or harmful content</li>
                  <li>Respect the rights and dignity of others</li>
                  <li>Comply with all applicable laws and regulations</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">4. Permitted Use</h2>
                <p>
                  You may use Enough Aashuu for lawful personal or business workflows, including:
                </p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-4">
                  <li>Processing content you personally created</li>
                  <li>Processing content you have explicit permission to modify</li>
                  <li>Generating QR codes and utility assets for legitimate use</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">5. Prohibited Uses</h2>
                <p>You may NOT use Enough Aashuu to:</p>
                <ul className="list-disc list-inside space-y-2 ml-2 mt-4">
                  <li>Process copyrighted content you don&apos;t own without permission</li>
                  <li>Create misleading or fraudulent content</li>
                  <li>Violate third-party rights or platform Terms of Service</li>
                  <li>Engage in harassment, defamation, or illegal activities</li>
                </ul>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">6. Disclaimer of Warranties</h2>
                <p>
                  The Service is provided &quot;AS IS&quot; without warranties of any kind, express or implied. We do not guarantee that the Service will be error-free, uninterrupted, or meet your expectations.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">7. Limitation of Liability</h2>
                <p>
                  To the fullest extent permitted by law, Enough Aashuu and its creators shall not be liable for any indirect, incidental, special, or consequential damages arising from your use of the Service.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">8. Changes to Terms</h2>
                <p>
                  We may update these Terms at any time. Continued use of the Service after changes indicates your acceptance of the new Terms.
                </p>
              </section>

              <section>
                <h2 className="text-2xl font-semibold text-white mb-4">9. Contact</h2>
                <p>
                  For questions about these Terms, visit our contact page or reach out on X @enoughaashuu.
                </p>
              </section>
            </div>
          </motion.div>
        </div>
      </section>

      <Footer />
    </main>
  );
}
