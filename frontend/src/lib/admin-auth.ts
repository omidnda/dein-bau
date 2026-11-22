import type { NextRequest } from "next/server";

export const adminCookieName = "am_admin_session";
export const adminSessionMaxAge = 60 * 60 * 8;

export function hasValidRequestOrigin(request: NextRequest) {
  const origin = request.headers.get("origin");
  const host = request.headers.get("x-forwarded-host") ?? request.headers.get("host");
  const protocol = request.headers.get("x-forwarded-proto") ?? request.nextUrl.protocol.replace(":", "");
  return Boolean(origin && host && origin === `${protocol}://${host}`);
}

function encode(value: string) {
  return btoa(value).replace(/\+/g, "-").replace(/\//g, "_").replace(/=+$/, "");
}

function decode(value: string) {
  return atob(value.replace(/-/g, "+").replace(/_/g, "/").padEnd(Math.ceil(value.length / 4) * 4, "="));
}

function sessionSecret() {
  const secret = process.env.ADMIN_SESSION_SECRET;
  if (!secret || secret.length < 32) throw new Error("ADMIN_SESSION_SECRET is not configured.");
  return secret;
}

async function signature(payload: string) {
  const key = await crypto.subtle.importKey("raw", new TextEncoder().encode(sessionSecret()), { name: "HMAC", hash: "SHA-256" }, false, ["sign"]);
  const bytes = new Uint8Array(await crypto.subtle.sign("HMAC", key, new TextEncoder().encode(payload)));
  return encode(String.fromCharCode(...bytes));
}

function equal(left: string, right: string) {
  if (left.length !== right.length) return false;
  let mismatch = 0;
  for (let index = 0; index < left.length; index += 1) mismatch |= left.charCodeAt(index) ^ right.charCodeAt(index);
  return mismatch === 0;
}

export async function createAdminSession(username: string) {
  const payload = encode(JSON.stringify({ username, expiresAt: Date.now() + adminSessionMaxAge * 1000 }));
  return `${payload}.${await signature(payload)}`;
}

export async function verifyAdminSession(token?: string) {
  if (!token) return false;
  const [payload, providedSignature, extra] = token.split(".");
  if (!payload || !providedSignature || extra || !equal(await signature(payload), providedSignature)) return false;
  try {
    const value = JSON.parse(decode(payload)) as { username?: string; expiresAt?: number };
    return typeof value.username === "string" && value.username.length > 0 && typeof value.expiresAt === "number" && value.expiresAt > Date.now();
  } catch {
    return false;
  }
}
