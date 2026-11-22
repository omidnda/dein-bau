import { NextRequest, NextResponse } from "next/server";
import { fetchBackend } from "@/lib/backend-api";

export async function GET(_request: NextRequest, context: { params: Promise<{ path: string[] }> }) {
  const { path } = await context.params;
  const safePath = path.map(encodeURIComponent).join("/");
  const response = await fetchBackend(`/media/files/${safePath}`, { next: { revalidate: 86400 } });
  if (!response.ok) return new NextResponse(null, { status: response.status });
  return new NextResponse(response.body, {
    headers: {
      "Content-Type": response.headers.get("Content-Type") ?? "application/octet-stream",
      "Cache-Control": "public, max-age=86400, stale-while-revalidate=604800",
    },
  });
}
