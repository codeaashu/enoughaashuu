import type { Metadata } from "next";
import CorkboardEditorClient from "./CorkboardEditorClient";

export const metadata: Metadata = {
  title: "Corkboard Editor | Enough Aashuu",
  description: "Open the Corkboard editor — drag & drop photos, apply filters, and export a 4K wallpaper.",
};

export default function CorkboardEditorPage() {
  return <CorkboardEditorClient />;
}
