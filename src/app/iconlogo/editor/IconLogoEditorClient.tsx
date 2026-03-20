"use client";

import { useEffect, useState } from "react";
import type { LogoState } from "@/iconlogo/domain/logo/logo.types";
import { sanitizeLogoState } from "@/iconlogo/domain/logo/logo.validators";
import TanStackQueryProvider from "@/iconlogo/integrations/tanstack-query/root-provider";
import { AppShell } from "@/iconlogo/features/editor/AppShell";

export default function IconLogoEditorClient() {
  const [sharedLogo, setSharedLogo] = useState<LogoState | null>(null);

  useEffect(() => {
    const raw = new URLSearchParams(window.location.search).get("s");
    if (!raw) return;
    try {
      setSharedLogo(sanitizeLogoState(JSON.parse(decodeURIComponent(raw))));
    } catch {
      setSharedLogo(null);
    }
  }, []);

  return (
    <TanStackQueryProvider>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        <AppShell sharedLogo={sharedLogo} />
      </main>
    </TanStackQueryProvider>
  );
}
