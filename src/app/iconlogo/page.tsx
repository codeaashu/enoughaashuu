import type { Metadata } from "next";
import TopNavbar from "@/components/TopNavbar";

export const metadata: Metadata = {
  title: "IconLogo Studio | RemoveBanana",
  description:
    "Create icon-based logos with the integrated IconLogo studio. Launch the cloned iconlogo app directly inside RemoveBanana.",
};

export default function IconLogoPage() {
  const iframeSrc =
    process.env.NODE_ENV === "development"
      ? "http://localhost:5173"
      : process.env.NEXT_PUBLIC_ICONLOGO_URL;

  return (
    <main className="min-h-screen bg-black text-white overflow-hidden">
      <TopNavbar />

      {iframeSrc ? (
        <iframe
          src={iframeSrc}
          title="IconLogo Studio"
          className="block w-full h-screen pt-14 md:pt-16 border-0"
          allow="clipboard-read; clipboard-write"
        />
      ) : (
        <section className="pt-32 px-6">
          <div className="max-w-3xl mx-auto rounded-2xl border border-amber-400/20 bg-amber-500/5 p-6 text-amber-100/90">
            <p className="text-base font-semibold">IconLogo deployment URL is not configured.</p>
            <p className="mt-2 text-sm text-amber-100/70">
              Set NEXT_PUBLIC_ICONLOGO_URL to your deployed IconLogo app URL.
            </p>
          </div>
        </section>
      )}

    </main>
  );
}
