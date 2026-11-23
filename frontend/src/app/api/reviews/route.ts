import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

export async function POST(request: NextRequest) {
  try {
    const response = await fetchBackend("/reviews/", { method: "POST", headers: { "Content-Type": "application/json", ...(request.headers.get("x-real-ip") ? { "X-Real-IP": request.headers.get("x-real-ip")! } : {}) }, body: JSON.stringify(await request.json()), cache: "no-store" });
    const result = await response.json();
    const headers = response.headers.get("Retry-After") ? { "Retry-After": response.headers.get("Retry-After")! } : undefined;
    return NextResponse.json(result, { status: response.status, headers });
  } catch { return NextResponse.json({ detail: "Bewertung konnte nicht gesendet werden." }, { status: 502 }); }
}
