import { useLogoStore } from "#/store/logo-store";

export async function createShareLink(): Promise<string> {
  const logo = useLogoStore.getState().present;
  const response = await fetch("/api/iconlogo/share", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
    },
    body: JSON.stringify({ logoState: logo }),
  });

  if (!response.ok) {
    throw new Error("Failed to create share link");
  }

  const data = (await response.json()) as { id?: string };
  if (!data.id) {
    throw new Error("Invalid share response");
  }

  return `${window.location.origin}/iconlogo/editor?s=${data.id}`;
}
