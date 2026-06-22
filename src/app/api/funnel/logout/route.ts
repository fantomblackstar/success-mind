import { NextRequest, NextResponse } from "next/server";
import { clearUserSession } from "@/shared/lib/session";

export async function POST() {
  await clearUserSession();
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  await clearUserSession();
  return NextResponse.redirect(new URL("/", request.url));
}
