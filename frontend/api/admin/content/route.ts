import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { fetchBackend } from "@/lib/backend-api";

function backendHeaders() {
  const token = process.env.ADMIN_API_TOKEN;
  if (!token)
    throw new Error(
      "ADMIN_API_TOKEN is not configured in the frontend environment.",
    );
  return { "Content-Type": "application/json", "X-Admin-Token": token };
}

async function backendJson(path: string, init?: RequestInit) {
  const response = await fetchBackend(path, { ...init, cache: "no-store" });
  const payload =
    response.status === 204 ? null : await response.json().catch(() => null);
  if (!response.ok) {
    const detail =
      payload && typeof payload === "object" && "detail" in payload
        ? JSON.stringify(payload.detail)
        : `Backend returned ${response.status}.`;
    throw new Error(detail);
  }
  return payload;
}

export async function GET() {
  try {
    const payload = await backendJson("/content/site/");
    return NextResponse.json(payload);
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error ? error.message : "Backend is unavailable.",
      },
      { status: 502 },
    );
  }
}

export async function PUT(request: NextRequest) {
  try {
    const body = (await request.json()) as {
      content?: Record<string, unknown>;
    };
    if (
      !body.content ||
      typeof body.content !== "object" ||
      Array.isArray(body.content)
    ) {
      return NextResponse.json(
        { detail: "content must be an object." },
        { status: 400 },
      );
    }

    const headers = backendHeaders();
    await Promise.all(
      Object.entries(body.content).map(async ([key, value]) => {
        const detailResponse = await fetchBackend(
          `/content/sections/${encodeURIComponent(key)}/`,
          { cache: "no-store" },
        );
        const method = detailResponse.status === 404 ? "POST" : "PUT";
        const path =
          method === "POST"
            ? "/content/sections/"
            : `/content/sections/${encodeURIComponent(key)}/`;
        let storedValue = value;
        let isActive: boolean | undefined;
        if (
          key === "references" &&
          value &&
          typeof value === "object" &&
          !Array.isArray(value)
        ) {
          const { enabled, ...referenceValue } = value as Record<
            string,
            unknown
          >;
          storedValue = referenceValue;
          isActive = enabled !== false;
        }
        const sectionPayload = {
          value: storedValue,
          ...(isActive === undefined ? {} : { isActive }),
        };
        const payload =
          method === "POST" ? { key, ...sectionPayload } : sectionPayload;
        await backendJson(path, {
          method,
          headers,
          body: JSON.stringify(payload),
        });
      }),
    );

    revalidatePath("/", "layout");
    return NextResponse.json({ content: body.content });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "Content could not be saved.",
      },
      { status: 502 },
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const payload = await backendJson("/content/sections/", {
      method: "POST",
      headers: backendHeaders(),
      body: JSON.stringify(body),
    });
    revalidatePath("/", "layout");
    return NextResponse.json(payload, { status: 201 });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "Section could not be created.",
      },
      { status: 502 },
    );
  }
}

export async function DELETE(request: NextRequest) {
  try {
    const key = request.nextUrl.searchParams.get("key");
    if (!key)
      return NextResponse.json({ detail: "key is required." }, { status: 400 });
    await backendJson(`/content/sections/${encodeURIComponent(key)}/`, {
      method: "DELETE",
      headers: backendHeaders(),
    });
    revalidatePath("/", "layout");
    return new NextResponse(null, { status: 204 });
  } catch (error) {
    return NextResponse.json(
      {
        detail:
          error instanceof Error
            ? error.message
            : "Section could not be deleted.",
      },
      { status: 502 },
    );
  }
}
