import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const clientIp = request.headers.get("x-real-ip");
    const response = await fetchBackend("/contact/", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        ...(clientIp ? { "X-Real-IP": clientIp } : {}),
      },
      body: JSON.stringify(body),
      cache: "no-store",
    });
    const responseBody = await response.text();
    if (!responseBody) {
      return NextResponse.json(
        { detail: "Ihre Nachricht konnte nicht gesendet werden." },
        { status: 502 },
      );
    }

    try {
      return NextResponse.json(JSON.parse(responseBody), { status: response.status });
    } catch {
      return NextResponse.json(
        { detail: "Ihre Nachricht konnte nicht gesendet werden." },
        { status: 502 },
      );
    }
  } catch {
    return NextResponse.json({ detail: "Ihre Nachricht konnte nicht gesendet werden." }, { status: 502 });
  }
}
