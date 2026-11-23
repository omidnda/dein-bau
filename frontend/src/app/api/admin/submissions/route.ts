import { NextRequest, NextResponse } from "next/server";
import { hasValidRequestOrigin } from "@/lib/admin-auth";
import { isAdminRequest } from "@/lib/admin-api";
import { fetchBackend } from "@/lib/backend-api";
export async function GET() {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  try {
    const response = await fetchBackend("/submissions/", { headers: { "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "" }, cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}

export async function PATCH(request: NextRequest) {
  if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 });
  if (!hasValidRequestOrigin(request)) return NextResponse.json({ detail: "Invalid request origin." }, { status: 403 });
  const id = request.nextUrl.searchParams.get("id");
  if (!id || !/^\d+$/.test(id)) return NextResponse.json({ detail: "Invalid id" }, { status: 400 });
  try {
    const response = await fetchBackend(`/submissions/${id}/`, { method: "PATCH", headers: { "Content-Type": "application/json", "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "" }, body: JSON.stringify(await request.json()), cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch { return NextResponse.json({ detail: "Backend nicht erreichbar." }, { status: 502 }); }
}
