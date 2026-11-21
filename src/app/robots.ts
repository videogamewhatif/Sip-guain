import type { MetadataRoute } from "next";
import { absoluteUrl, siteConfig } from "@/lib/site";

/**
 * En entornos de prueba (preview de Vercel) se bloquea la indexación para que
 * la versión 3.0 pueda probarse sin competir con el sitio actual.
 */
export default function robots(): MetadataRoute.Robots {
  const isProduction = process.env.VERCEL_ENV ? process.env.VERCEL_ENV === "production" : siteConfig.url.startsWith("https://");
  if (!isProduction || process.env.NEXT_PUBLIC_ALLOW_INDEXING === "false") {
    return { rules: [{ userAgent: "*", disallow: "/" }] };
  }
  return {
    rules: [{ userAgent: "*", allow: "/", disallow: ["/api/"] }],
    sitemap: absoluteUrl("/sitemap.xml"),
    host: siteConfig.url,
  };
}
