import { NextRequest, NextResponse } from "next/server";
import { adminCookieName, adminSessionMaxAge, createAdminSession, hasValidRequestOrigin } from "@/lib/admin-auth";
import { fetchBackend } from "@/lib/backend-api";

export async function POST(request: NextRequest) {
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Invalid request origin." }, { status: 403 });
  try {
    const body = await request.json() as { username?: string; password?: string };
    if (typeof body.username !== "string" || typeof body.password !== "string") {
      return NextResponse.json({ detail: "Benutzername oder Passwort ist falsch." }, { status: 401 });
    }
    const adminApiToken = process.env.ADMIN_API_TOKEN;
    if (!adminApiToken) throw new Error("Admin authentication is not configured.");
    const verification = await fetchBackend("/auth/superuser/", {
      method: "POST",
      headers: { "Content-Type": "application/json", "X-Admin-Token": adminApiToken },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const verificationPayload = await verification.json().catch(() => ({})) as { username?: string; detail?: string };
    if (!verification.ok || typeof verificationPayload.username !== "string") {
      return NextResponse.json(
        { detail: verification.status === 401 ? "Benutzername oder Passwort ist falsch." : "Anmeldung fehlgeschlagen." },
        { status: verification.status === 401 ? 401 : 502 },
      );
    }
    const response = NextResponse.json({ ok: true });
    response.cookies.set(adminCookieName, await createAdminSession(verificationPayload.username), { httpOnly: true, secure: process.env.NODE_ENV === "production", sameSite: "strict", path: "/", maxAge: adminSessionMaxAge });
    return response;
  } catch (error) {
    const configurationError = error instanceof Error && error.message.includes("not configured");
    if (error instanceof SyntaxError) {
      return NextResponse.json({ detail: "Ungültige Anmeldedaten." }, { status: 400 });
    }
    console.error("Admin authentication backend request failed", error);
    return NextResponse.json(
      { detail: configurationError ? "Admin-Anmeldung ist nicht konfiguriert." : "Der Anmeldedienst ist derzeit nicht erreichbar." },
      { status: configurationError ? 503 : 502 },
    );
  }
}
