import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

function headers(json = false) {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) throw new Error("ADMIN_API_TOKEN is not configured.");
  return { "X-Admin-Token": token, ...(json ? { "Content-Type": "application/json" } : {}) };
}

export async function GET() {
  try {
    const response = await fetchBackend("/submissions/", { headers: headers(), cache: "no-store" });
    const payload = await response.json();
    return NextResponse.json(payload, { status: response.status });
  } catch (error) {
    return NextResponse.json({ detail: error instanceof Error ? error.message : "Anfragen konnten nicht geladen werden." }, { status: 502 });
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json() as { id?: number; status?: string };
    if (!body.id) return NextResponse.json({ detail: "id is required." }, { status: 400 });
    const response = await fetchBackend(`/submissions/${body.id}/`, { method: "PATCH", headers: headers(true), body: JSON.stringify({ status: body.status }), cache: "no-store" });
    return NextResponse.json(await response.json(), { status: response.status });
  } catch (error) {
    return NextResponse.json({ detail: error instanceof Error ? error.message : "Anfrage konnte nicht aktualisiert werden." }, { status: 502 });
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id || !/^\d+$/.test(id)) return NextResponse.json({ detail: "Valid id is required." }, { status: 400 });
    const response = await fetchBackend(`/submissions/${id}/`, { method: "DELETE", headers: headers(), cache: "no-store" });
    if (!response.ok) return NextResponse.json(await response.json(), { status: response.status });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json({ detail: error instanceof Error ? error.message : "Anfrage konnte nicht gelöscht werden." }, { status: 502 });
  }
}
