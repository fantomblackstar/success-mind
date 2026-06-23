import { NextRequest, NextResponse } from "next/server";
import { routes } from "@/shared/lib/routes";

export function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  if (
    pathname.startsWith(routes.dashboard) &&
    !pathname.startsWith(routes.dashboardLogin)
  ) {
    const token = request.cookies.get("dashboard_auth")?.value;
    if (!token) {
      return NextResponse.redirect(new URL(routes.dashboardLogin, request.url));
    }
  }

  return NextResponse.next();
}

export const config = {
  matcher: ["/dashboard/:path*"],
};
