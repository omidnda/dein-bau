import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

function tokenHeader() {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token) throw new Error("ADMIN_API_TOKEN is not configured.");
  return { "X-Admin-Token": token };
}

function withPublicUrl<T extends { url: string }>(asset: T) {
  return {
    ...asset,
    url: `/site-media/${asset.url.replace(/^\/media\//, "")}`,
  };
}

export async function GET() {
  try {
    const response = await fetchBackend("/media/", {
      headers: tokenHeader(),
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok)
      throw new Error(payload.detail ?? "Medien konnten nicht geladen werden.");
    return NextResponse.json({ results: payload.results.map(withPublicUrl) });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "Medien konnten nicht geladen werden.",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const formData = await request.formData();
    const response = await fetchBackend("/media/", {
      method: "POST",
      headers: tokenHeader(),
      body: formData,
      cache: "no-store",
    });
    const payload = await response.json();
    if (!response.ok)
      return NextResponse.json(payload, { status: response.status });
    return NextResponse.json(withPublicUrl(payload), { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error ? error.message : "Upload fehlgeschlagen.",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const id = request.nextUrl.searchParams.get("id");
    if (!id || !/^\d+$/.test(id))
      return NextResponse.json(
        { detail: "Valid id is required." },
        { status: 400 },
      );
    const response = await fetchBackend(`/media/${id}/`, {
      method: "DELETE",
      headers: tokenHeader(),
      cache: "no-store",
    });
    if (!response.ok)
      return NextResponse.json(await response.json(), {
        status: response.status,
      });
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "Datei konnte nicht gelöscht werden.",
      },
      { status: 502 },
    );
  }
}
