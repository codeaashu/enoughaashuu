import type { Metadata } from "next";
import QrCodeGenerator from "@/components/QrCodeGenerator";

export const metadata: Metadata = {
  title: "QR Code Generator | RemoveBanana",
  description:
    "Generate custom QR codes for text, URL, Wi-Fi, vCard, event, phone, SMS, and geo with full style and export controls.",
};

export default function QrCodeGeneratorPage() {
  return (
    <main className="mx-auto w-full max-w-7xl px-4 pb-16 pt-24 sm:px-6 lg:px-8">
      <QrCodeGenerator />
    </main>
  );
}
