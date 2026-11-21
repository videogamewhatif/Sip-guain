import type { MetadataRoute } from "next";
import { getArtists, getStories, getWines } from "@/lib/content";
import { absoluteUrl } from "@/lib/site";

export default async function sitemap(): Promise<MetadataRoute.Sitemap> {
  const [wines, stories, artists] = await Promise.all([getWines(), getStories(), getArtists()]);
  const staticRoutes: { path: string; priority: number }[] = [
    { path: "/", priority: 1 },
    { path: "/vinos", priority: 0.9 },
    { path: "/nosotros", priority: 0.8 },
    { path: "/arte-y-literatura", priority: 0.8 },
    { path: "/artistas", priority: 0.6 },
    { path: "/experiencias", priority: 0.7 },
    { path: "/merch", priority: 0.6 },
    { path: "/galeria", priority: 0.5 },
    { path: "/contacto", priority: 0.6 },
    { path: "/aviso-de-privacidad", priority: 0.2 },
    { path: "/legal", priority: 0.2 },
  ];
  return [
    ...staticRoutes.map((r) => ({ url: absoluteUrl(r.path), changeFrequency: "monthly" as const, priority: r.priority })),
    ...wines.map((w) => ({ url: absoluteUrl(`/vinos/${w.slug}`), changeFrequency: "monthly" as const, priority: 0.8 })),
    ...stories.map((s) => ({ url: absoluteUrl(`/arte-y-literatura/${s.slug}`), changeFrequency: "yearly" as const, priority: 0.7 })),
    ...artists.map((a) => ({ url: absoluteUrl(`/artistas/${a.slug}`), changeFrequency: "yearly" as const, priority: 0.5 })),
  ];
}
