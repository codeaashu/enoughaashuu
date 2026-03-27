import type { Metadata } from "next";
import CorkboardLandingClient from "./CorkboardLandingClient";
import "@/corkboard/styles.css";

export const metadata: Metadata = {
  title: "Corkboard | Enough Aashuu",
  description:
    "A digital photo corkboard for organizing memories. Drag and drop photos, apply retro filters, add captions, pin your memories, and export high-resolution collages.",
};

export default function CorkboardPage() {
  return <CorkboardLandingClient />;
}
