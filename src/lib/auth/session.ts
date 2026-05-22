// NOTE: This file is server-only (not marked with 'server-only' pkg because
// middleware uses it via edge runtime — use explicit env var guard instead)
import { cookies } from "next/headers";
import { SignJWT, jwtVerify } from "jose";

const SESSION_COOKIE = "wine-cellar-session";
const secret = new TextEncoder().encode(
  process.env.SESSION_SECRET ?? "dev-secret-change-in-production-32chars"
);

export async function createSession(): Promise<void> {
  const token = await new SignJWT({ authenticated: true })
    .setProtectedHeader({ alg: "HS256" })
    .setExpirationTime("30d")
    .sign(secret);

  (await cookies()).set(SESSION_COOKIE, token, {
    httpOnly: true,
    secure: process.env.NODE_ENV === "production",
    sameSite: "lax",
    maxAge: 60 * 60 * 24 * 30, // 30 days
    path: "/",
  });
}

export async function destroySession(): Promise<void> {
  (await cookies()).delete(SESSION_COOKIE);
}

export async function getSession(): Promise<boolean> {
  try {
    const token = (await cookies()).get(SESSION_COOKIE)?.value;
    if (!token) return false;
    await jwtVerify(token, secret);
    return true;
  } catch {
    return false;
  }
}
