import type { Metadata } from "next";
import QrCodeGenerator from "@/components/QrCodeGenerator";
import TopNavbar from "@/components/TopNavbar";
import Footer from "@/components/Footer";

export const metadata: Metadata = {
  title: "QR Code Generator | Enough Aashuu",
  description:
    "Generate custom QR codes for text, URL, Wi-Fi, vCard, event, phone, SMS, geo, and train ticket data with full style and export controls.",
};

export default function QrCodeGeneratorPage() {
  return (
    <main className="min-h-screen bg-black text-white selection:bg-cyan-500/30 overflow-x-hidden">
      <TopNavbar />

      <section className="pt-44 md:pt-36 pb-20 px-6 relative">
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full max-w-3xl h-[400px] opacity-20 pointer-events-none">
          <div className="absolute inset-0 bg-gradient-to-r from-cyan-500 via-blue-500 to-indigo-500 blur-[100px] rounded-full mix-blend-screen" />
        </div>

        <div className="max-w-4xl mx-auto text-center relative z-10">
          <h1 className="mb-6 flex flex-wrap items-center justify-center gap-x-3 gap-y-4 text-center text-[clamp(2.2rem,6.4vw,5.4rem)] leading-[0.95] tracking-tight">
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Generate
            </span>
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              QR
            </span>
            <span className="bg-gradient-to-r from-cyan-300 via-blue-300 to-indigo-300 bg-clip-text text-transparent">
              Codes
            </span>
          </h1>

          <p className="text-lg md:text-xl text-gray-400 mb-12 max-w-3xl mx-auto leading-relaxed">
            Create beautiful QR codes for text, URLs, Wi-Fi access, contacts, events, SMS, geo pins, and train ticket data.
            Customize styles, add logos, then export as PNG, JPEG, or SVG.
          </p>

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

            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-white/5 border border-white/10 text-sm md:text-base text-gray-300 mb-8">
              <span className="relative flex h-2 w-2">
                <span className="animate-ping absolute inline-flex h-full w-full rounded-full bg-cyan-400 opacity-75" />
                <span className="relative inline-flex rounded-full h-2 w-2 bg-cyan-500" />
              </span>
              Supports: Text • URL • Wi-Fi • vCard • Event • Phone • SMS • Geo • Train Ticket
            </div>
          </div>
        </div>
      </section>

      <section className="px-6 pb-32">
        <div className="max-w-5xl mx-auto">
          <QrCodeGenerator />
        </div>
      </section>

      <Footer />
    </main>
  );
}
