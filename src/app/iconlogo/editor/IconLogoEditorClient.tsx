"use client";

import { useEffect, useState } from "react";
import type { LogoState } from "@/iconlogo/domain/logo/logo.types";
import { sanitizeLogoState } from "@/iconlogo/domain/logo/logo.validators";
import TanStackQueryProvider from "@/iconlogo/integrations/tanstack-query/root-provider";
import { AppShell } from "@/iconlogo/features/editor/AppShell";

export default function IconLogoEditorClient() {
  const [sharedLogo, setSharedLogo] = useState<LogoState | null>(null);

  useEffect(() => {
    const resolveSharedLogo = async () => {
      const raw = new URLSearchParams(window.location.search).get("s");
      if (!raw) return;

      // New format: short id, e.g. ?s=fsfOMX
      if (/^[A-Za-z0-9_-]{4,16}$/.test(raw)) {
        try {
          const response = await fetch(`/api/iconlogo/share/${raw}`, {
            method: "GET",
            cache: "no-store",
          });

          if (!response.ok) {
            setSharedLogo(null);
            return;
          }

          const data = (await response.json()) as { logo?: unknown };
          if (!data.logo) {
            setSharedLogo(null);
            return;
          }

          setSharedLogo(sanitizeLogoState(data.logo));
          return;
        } catch {
          setSharedLogo(null);
          return;
        }
      }

      // Legacy format: encoded JSON in query param
      try {
        setSharedLogo(sanitizeLogoState(JSON.parse(decodeURIComponent(raw))));
      } catch {
        setSharedLogo(null);
      }
    };

    void resolveSharedLogo();
  }, []);

  return (
    <TanStackQueryProvider>
      <main className="min-h-screen bg-black text-white overflow-hidden">
        <AppShell sharedLogo={sharedLogo} />
      </main>
    </TanStackQueryProvider>
  );
}
