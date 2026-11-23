import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, adminSessionMaxAge, createAdminSession, hasValidRequestOrigin } from "@/lib/admin-auth";
import { fetchBackend } from "@/lib/backend-api";

export async function POST(request: NextRequest) {
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Invalid request origin." }, { status: 403 });
  const token = process.env.ADMIN_API_TOKEN;
  if (!token || !process.env.ADMIN_SESSION_SECRET || process.env.ADMIN_SESSION_SECRET.length < 32) {
    return NextResponse.json({ detail: "Der Anmeldedienst ist nicht vollständig konfiguriert." }, { status: 503 });
  }
  try {
    const body = await request.json() as { username?: string; password?: string };
    if (typeof body.username !== "string" || typeof body.password !== "string") return NextResponse.json({ detail: "Benutzername oder Passwort ist falsch." }, { status: 401 });
    const verification = await fetchBackend("/auth/superuser/", { method: "POST", headers: { "Content-Type": "application/json", "X-Admin-Token": token }, body: JSON.stringify(body), cache: "no-store" });
    const payload = await verification.json().catch(() => ({})) as { username?: string; detail?: string };
    if (payload.detail === "Invalid admin token." || verification.status === 503) return NextResponse.json({ detail: "Der Anmeldedienst ist nicht vollständig konfiguriert." }, { status: 503 });
    if (verification.status === 401) return NextResponse.json({ detail: "Benutzername oder Passwort ist falsch." }, { status: 401 });
    if (!verification.ok || !payload.username) return NextResponse.json({ detail: "Der Anmeldedienst ist derzeit nicht erreichbar." }, { status: 502 });
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieName, await createAdminSession(payload.username), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: adminSessionMaxAge });
    return response;
  } catch { return NextResponse.json({ detail: "Der Anmeldedienst ist derzeit nicht erreichbar." }, { status: 502 }); }
}
