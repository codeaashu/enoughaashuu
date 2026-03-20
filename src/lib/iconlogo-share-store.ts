import { nanoid } from "nanoid";
import type { LogoState } from "@/iconlogo/domain/logo/logo.types";

type ShareRecord = {
  logo: LogoState;
  expiresAt: number;
};

const SHARE_TTL_MS = 1000 * 60 * 60 * 24 * 30; // 30 days

declare global {
  // eslint-disable-next-line no-var
  var __iconlogoShareStore: Map<string, ShareRecord> | undefined;
}

function getStore() {
  if (!globalThis.__iconlogoShareStore) {
    globalThis.__iconlogoShareStore = new Map<string, ShareRecord>();
  }
  return globalThis.__iconlogoShareStore;
}

function pruneExpired(store: Map<string, ShareRecord>) {
  const now = Date.now();
  for (const [id, record] of store.entries()) {
    if (record.expiresAt <= now) {
      store.delete(id);
    }
  }
}

export function createIconLogoShare(logo: LogoState): string {
  const store = getStore();
  pruneExpired(store);

  let id = nanoid(6);
  while (store.has(id)) {
    id = nanoid(6);
  }

  store.set(id, {
    logo,
    expiresAt: Date.now() + SHARE_TTL_MS,
  });

  return id;
}

export function getIconLogoShare(id: string): LogoState | null {
  const store = getStore();
  const record = store.get(id);
  if (!record) return null;

  if (record.expiresAt <= Date.now()) {
    store.delete(id);
    return null;
  }

  return record.logo;
}
