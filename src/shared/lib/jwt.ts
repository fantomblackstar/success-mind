import { SignJWT, jwtVerify } from "jose";

const secret = () => new TextEncoder().encode(process.env.SESSION_SECRET || "dev-secret");

export const SESSION_TYPES = {
  user: "user",
  admin: "admin",
} as const;

export interface UserSessionPayload {
  type: typeof SESSION_TYPES.user;
  userId: string;
  email: string;
  name: string;
}

export interface AdminSessionPayload {
  type: typeof SESSION_TYPES.admin;
}

export async function signUserToken(
  payload: Omit<UserSessionPayload, "type">,
  expiresIn = "30d",
) {
  return new SignJWT({ ...payload, type: SESSION_TYPES.user })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function signAdminToken(expiresIn = "1d") {
  return new SignJWT({ type: SESSION_TYPES.admin })
    .setProtectedHeader({ alg: "HS256" })
    .setIssuedAt()
    .setExpirationTime(expiresIn)
    .sign(secret());
}

export async function verifyUserToken(token: string): Promise<UserSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.type !== SESSION_TYPES.user) return null;
    if (typeof payload.userId !== "string") return null;
    if (typeof payload.email !== "string") return null;
    if (typeof payload.name !== "string") return null;
    return {
      type: SESSION_TYPES.user,
      userId: payload.userId,
      email: payload.email,
      name: payload.name,
    };
  } catch {
    return null;
  }
}

export async function verifyAdminToken(token: string): Promise<AdminSessionPayload | null> {
  try {
    const { payload } = await jwtVerify(token, secret());
    if (payload.type !== SESSION_TYPES.admin) return null;
    return { type: SESSION_TYPES.admin };
  } catch {
    return null;
  }
}
