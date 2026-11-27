import { cache } from "react";
import { fetchBackend } from "@/lib/backend-api";
import type { MediaAsset } from "@/content/site";

export type ProjectMedia = MediaAsset & { poster: MediaAsset | null };
export type Project = { title: string; slug: string; description: string; location: string; category: string; cover: MediaAsset | null; media: ProjectMedia[] };
const mediaUrl = (url: string) => url.startsWith("/media/") ? `/api/media/${url.slice(7)}` : url;
const normalize = <T extends MediaAsset>(item: T): T => ({ ...item, url: mediaUrl(item.url) });
export const getProjects = cache(async (): Promise<Project[]> => {
  const response = await fetchBackend("/gallery/projects/", { cache: "no-store" });
  if (!response.ok) throw new Error(`Gallery API returned ${response.status}`);
  const payload = await response.json() as { results: Project[] };
  if (!Array.isArray(payload.results)) throw new Error("Invalid gallery response");
  return payload.results.map((project) => ({ ...project, cover: project.cover ? normalize(project.cover) : null, media: project.media.map((item) => ({ ...normalize(item), poster: item.poster ? normalize(item.poster) : null })) }));
});
