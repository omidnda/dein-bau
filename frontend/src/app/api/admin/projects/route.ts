import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";
import { isAdminRequest } from "@/lib/admin-api";
import { hasValidRequestOrigin } from "@/lib/admin-auth";

async function handle(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Nicht angemeldet." }, { status: 401 });
  if (request.method !== "GET" && !hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Ungültige Anfrage." }, { status: 403 });
  try {
    const response = await fetchBackend("/gallery/admin/", { method: request.method, headers: { "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "", ...(request.method !== "GET" ? { "Content-Type": "application/json" } : {}) }, ...(request.method !== "GET" ? { body: JSON.stringify(await request.json()) } : {}), cache: "no-store" });
    return response.status === 204 ? new NextResponse(null, { status: 204 }) : NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
export const GET = handle;
export const POST = handle;
export const PUT = handle;
export const DELETE = handle;
