import { NextRequest, NextResponse } from "next/server";
import { clearUserSession } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export async function POST() {
  await clearUserSession();
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  await clearUserSession();
  return NextResponse.redirect(new URL(routes.home, request.url));
}
