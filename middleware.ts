import { NextRequest, NextResponse } from "next/server";
import { COOKIE_NAMES } from "@/shared/lib/cookie-names";
import { verifyAdminToken } from "@/shared/lib/jwt";
import { routes } from "@/shared/lib/routes";

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (pathname === routes.dashboard || pathname.startsWith(`${routes.dashboard}/`)) {
    if (pathname.startsWith(routes.dashboardLogin)) {
      return NextResponse.next();
    }

    const token = request.cookies.get(COOKIE_NAMES.adminSession)?.value;
    const adminSession = token ? await verifyAdminToken(token) : null;

    if (!adminSession) {
      return NextResponse.redirect(new URL(routes.dashboardLogin, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard", "/dashboard/:path*"],
};
