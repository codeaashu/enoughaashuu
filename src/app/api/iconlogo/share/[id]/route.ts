import { NextResponse } from "next/server";
import { sanitizeLogoState } from "@/iconlogo/domain/logo/logo.validators";
import { getIconLogoShare } from "@/lib/iconlogo-share-store";

export async function GET(
  _request: Request,
  context: { params: Promise<{ id: string }> },
) {
  const { id } = await context.params;
  const logo = getIconLogoShare(id);

  if (!logo) {
    return NextResponse.json({ error: "Share not found" }, { status: 404 });
  }

  return NextResponse.json({ logo: sanitizeLogoState(logo) });
}
