import { NextRequest, NextResponse } from "next/server";
import { clearAdminSession } from "@/shared/lib/session";
import { routes } from "@/shared/lib/routes";

export async function POST() {
  await clearAdminSession();
  return NextResponse.json({ ok: true });
}

export async function GET(request: NextRequest) {
  await clearAdminSession();
  return NextResponse.redirect(new URL(routes.dashboardLogin, request.url));
}
