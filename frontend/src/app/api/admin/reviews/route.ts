import { NextRequest, NextResponse } from "next/server";
import { isAdminRequest } from "@/lib/admin-api";
import { hasValidRequestOrigin } from "@/lib/admin-auth";
import { fetchBackend } from "@/lib/backend-api";

const token = () => ({ "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "" });
export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try { const response = await fetchBackend("/reviews/admin/", { headers: token(), cache: "no-store" }); return NextResponse.json(await response.json(), { status: response.status }); }
  catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
async function mutate(request: NextRequest, method: "PATCH" | "DELETE") {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Invalid request origin." }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ detail: "Invalid id" }, { status: 400 });
  try {
    const response = await fetchBackend(`/reviews/admin/${id}/`, { method, headers: { ...token(), ...(method === "PATCH" ? { "Content-Type": "application/json" } : {}) }, ...(method === "PATCH" ? { body: JSON.stringify(await request.json()) } : {}), cache: "no-store" });
    return response.status === 204 ? new NextResponse(null, { status: 204 }) : NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
export function PATCH(request: NextRequest) { return mutate(request, "PATCH"); }
export function DELETE(request: NextRequest) { return mutate(request, "DELETE"); }
