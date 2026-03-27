"use client";

import TopNavbar from "@/components/TopNavbar";
import { LandingPage } from "@/corkboard/features/landing/LandingPage";

export default function CorkboardLandingClient() {
  return (
    <main className="min-h-screen bg-black text-white overflow-x-hidden">
      <TopNavbar />
      <LandingPage />
    </main>
  );
}
