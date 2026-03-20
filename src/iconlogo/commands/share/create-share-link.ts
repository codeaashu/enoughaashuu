import { useLogoStore } from "#/store/logo-store";

export async function createShareLink(): Promise<string> {
  const logo = useLogoStore.getState().present;
  const payload = encodeURIComponent(JSON.stringify(logo));
  return `${window.location.origin}/iconlogo/editor?s=${payload}`;
}
