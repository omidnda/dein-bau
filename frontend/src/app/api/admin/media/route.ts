import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";
import { isAdminRequest } from "@/lib/admin-api";
import { hasValidRequestOrigin } from "@/lib/admin-auth";

const headers = () => ({ "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "" });
function publicUrl(url: string) { return url.startsWith("/media/") ? `/api/media/${url.slice(7)}` : url; }
export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    const response = await fetchBackend("/media/", { headers: headers(), cache: "no-store" });
    const payload = await response.json();
    return NextResponse.json({ ...payload, results: (payload.results ?? []).map((item: { url: string }) => ({ ...item, url: publicUrl(item.url) })) }, { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
export async function POST(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Invalid request origin." }, { status: 403 });
  try {
    const length = Number(request.headers.get("content-length"));
    if (length > 201 * 1024 * 1024) return NextResponse.json({ detail: "Die Datei ist zu groß." }, { status: 413 });
    const form = await request.formData();
    const file = form.get("file");
    if (file instanceof File && file.size > 200 * 1024 * 1024) return NextResponse.json({ detail: "Die Datei ist zu groß." }, { status: 413 });
    const response = await fetchBackend("/media/", { method: "POST", headers: headers(), body: form, cache: "no-store", signal: AbortSignal.timeout(300000) });
    const payload = await response.json();
    return NextResponse.json(response.ok ? { ...payload, url: publicUrl(payload.url) } : payload, { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
async function mutate(request: NextRequest, method: "PATCH" | "DELETE") {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Invalid request origin." }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ detail: "Invalid id" }, { status: 400 });
  try {
    const response = await fetchBackend(`/media/${id}/`, { method, headers: { ...headers(), ...(method === "PATCH" ? { "Content-Type": "application/json" } : {}) }, ...(method === "PATCH" ? { body: JSON.stringify(await request.json()) } : {}), cache: "no-store" });
    return response.status === 204 ? new NextResponse(null, { status: 204 }) : NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
export function PATCH(request: NextRequest) { return mutate(request, "PATCH"); }
export function DELETE(request: NextRequest) { return mutate(request, "DELETE"); }
