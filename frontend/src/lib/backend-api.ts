function apiBases() {
  const internalBase = (
    process.env.CONTENT_API_URL ?? "http://127.0.0.1:8000/api"
  ).replace(/\/$/, "");
  const configuredPublicUrl =
    process.env.NEXT_PUBLIC_SITE_URL ??
    (process.env.NODE_ENV === "production"
      ? "https://dein-bau-hub.de"
      : null);
  const publicSiteUrl = configuredPublicUrl?.replace(/\/$/, "");
  const publicBase = publicSiteUrl ? `${publicSiteUrl}/api` : null;
  return [
    ...new Set(
      [internalBase, publicBase].filter((base): base is string =>
        Boolean(base),
      ),
    ),
  ];
}

export async function fetchBackend(path: string, init?: RequestInit) {
  let networkError: unknown;

  for (const base of apiBases()) {
    try {
      const timeoutSignal = AbortSignal.timeout(5000);
      const signal = init?.signal
        ? AbortSignal.any([init.signal, timeoutSignal])
        : timeoutSignal;
      return await fetch(`${base}${path}`, { ...init, signal });
    } catch (error) {
      networkError = error;
    }
  }

  throw networkError instanceof Error
    ? networkError
    : new Error("Backend is unavailable.");
}
