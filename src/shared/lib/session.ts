import { cookies } from "next/headers";
import type { UtmPayload } from "@server/common/types";
import { COOKIE_NAMES } from "./cookie-names";
import {
  signAdminToken,
  signUserToken,
  verifyAdminToken,
  verifyUserToken,
  type AdminSessionPayload,
  type UserSessionPayload,
} from "./jwt";

export { COOKIE_NAMES };
export type { AdminSessionPayload, UserSessionPayload };

const cookieOptions = {
  httpOnly: true,
  sameSite: "lax" as const,
  secure: process.env.NODE_ENV === "production",
  path: "/",
};

export async function getUserSession(): Promise<UserSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.userSession)?.value;
  if (!token) return null;
  return verifyUserToken(token);
}

export async function setUserSession(payload: Omit<UserSessionPayload, "type">) {
  const cookieStore = await cookies();
  const token = await signUserToken(payload);
  cookieStore.set(COOKIE_NAMES.userSession, token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export async function clearUserSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.userSession);
}

export async function getAdminSession(): Promise<AdminSessionPayload | null> {
  const cookieStore = await cookies();
  const token = cookieStore.get(COOKIE_NAMES.adminSession)?.value;
  if (!token) return null;
  return verifyAdminToken(token);
}

export async function setAdminSession() {
  const cookieStore = await cookies();
  const token = await signAdminToken();
  cookieStore.set(COOKIE_NAMES.adminSession, token, {
    ...cookieOptions,
    maxAge: 60 * 60 * 24,
  });
}

export async function clearAdminSession() {
  const cookieStore = await cookies();
  cookieStore.delete(COOKIE_NAMES.adminSession);
}

export async function isDashboardAuthenticated() {
  const session = await getAdminSession();
  return session !== null;
}

export async function getFunnelSessionId(): Promise<string | null> {
  const cookieStore = await cookies();
  return cookieStore.get(COOKIE_NAMES.funnelSession)?.value ?? null;
}

export async function setFunnelSessionId(sessionId: string) {
  const cookieStore = await cookies();
  cookieStore.set(COOKIE_NAMES.funnelSession, sessionId, {
    ...cookieOptions,
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
    ...cookieOptions,
    maxAge: 60 * 60 * 24 * 30,
  });
}

export function createSessionId() {
  return crypto.randomUUID();
}
