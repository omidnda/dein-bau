import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";
import { isAdminRequest } from "@/lib/admin-api";
function publicUrl(url: string) { return `/api/media/${url.replace(/^\/media\//, "")}`; }
export async function GET() { if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 }); const response = await fetchBackend("/media/", { headers: { "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "" }, cache: "no-store" }); const payload = await response.json(); return NextResponse.json({ ...payload, results: (payload.results ?? []).map((item: { url: string }) => ({ ...item, url: publicUrl(item.url) })) }, { status: response.status }); }
export async function POST(request: NextRequest) { if (!(await isAdminRequest())) return NextResponse.json({ detail: "Unauthorized" }, { status: 401 }); const response = await fetchBackend("/media/", { method: "POST", headers: { "X-Admin-Token": process.env.ADMIN_API_TOKEN ?? "" }, body: await request.formData(), cache: "no-store" }); const payload = await response.json(); return NextResponse.json(payload, { status: response.status }); }
