import { NextResponse } from "next/server";
import { sanitizeLogoState } from "@/iconlogo/domain/logo/logo.validators";
import { createIconLogoShare } from "@/lib/iconlogo-share-store";

export async function POST(request: Request) {
  try {
    const body = (await request.json()) as { logoState?: unknown };
    const logo = sanitizeLogoState(body.logoState);
    const id = createIconLogoShare(logo);

    return NextResponse.json({ id });
  } catch (error: unknown) {
    const message = error instanceof Error ? error.message : "Failed to create share";
    return NextResponse.json({ error: message }, { status: 400 });
  }
}
