import { SignJWT, jwtVerify } from "jose";
import { cookies } from "next/headers";
import type { UtmPayload } from "@server/common/types";

const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret");

export const COOKIE_NAMES = {
  funnelSession: "funnel_session",
  userSession: "user_session",
  utm: "utm_attribution",
  dashboardAuth: "dashboard_auth",
} as const;

export interface UserSessionPayload {
  userId: string;
  email: string;
  name: string;
}

export async function signToken(payload: UserSessionPayload | { role: string }, expiresIn = "7d") {
  return new SignJWT({ ...payload })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function verifyToken<T>(token: string): Promise<T | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    return payload as T;
  } catch {
    return null;
  }
}

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.userSession)?.value;
  if (!token) return null;
  return verifyToken<UserSessionPayload>(token);
}

export async function setUserSession(payload: UserSessionPayload) {
  const cookieStore = await cookies();
  const token = await signToken(payload);
  cookieStore.set(COOKIE_NAMES.userSession, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.userSession);
}

export async function getFunnelSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.funnelSession)?.value ?? null;
}

export async function setFunnelSessionId(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.funnelSession, sessionId, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function getUtmFromCookies(): Promise<UtmPayload> {
  const cookieStore = await cookies();
  const raw = cookieStore.get(COOKIE_NAMES.utm)?.value;
  if (raw) {
    try {
      return JSON.parse(raw) as UtmPayload;
    } catch {
      // fall through
    }
  }
  return { source: "direct" };
}

export async function setUtmCookie(utm: UtmPayload) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.utm, JSON.stringify(utm), {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function isDashboardAuthenticated() {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.dashboardAuth)?.value;
  if (!token) return false;
  const payload = await verifyToken<{ role: string }>(token);
  return payload?.role === "admin";
}

export async function setDashboardAuth() {
  const cookieStore = await cookies();
  const token = await signToken({ role: "admin" }, "1d");
  cookieStore.set(COOKIE_NAMES.dashboardAuth, token, {
    httpOnly: true,
    sameSite: "lax",
    secure: process.env.NODE_ENV === "production",
    path: "/",
    maxAge: 60 * 60 * 24,
  });
}

export function createSessionId() {
  return crypto.randomUUID();
}
