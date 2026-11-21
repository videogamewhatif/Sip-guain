import type { Metadata } from "next";
import { absoluteUrl, siteConfig } from "./site";

interface PageMetaInput {
  title: string;
  description: string;
  path: string;
  image?: { src: string; alt: string; width?: number; height?: number };
  type?: "website" | "article";
}

/** Metadatos por página: título, descripción, canonical y Open Graph/Twitter. */
export function pageMetadata({ title, description, path, image, type = "website" }: PageMetaInput): Metadata {
  const og = image ?? { src: siteConfig.ogImage, alt: siteConfig.name, width: 1200, height: 630 };
  return {
    title,
    description,
    alternates: { canonical: path },
    openGraph: {
      type,
      locale: siteConfig.locale,
      siteName: siteConfig.name,
      url: absoluteUrl(path),
      title: `${title} · ${siteConfig.name}`,
      description,
      images: [{ url: og.src, alt: og.alt, width: og.width, height: og.height }],
    },
    twitter: {
      card: "summary_large_image",
      title: `${title} · ${siteConfig.name}`,
      description,
      images: [og.src],
    },
  };
}

/** Serializa JSON-LD de forma segura para <script type="application/ld+json">. */
export function jsonLd(data: unknown) {
  return { __html: JSON.stringify(data).replace(/</g, "\\u003c") };
}

export function organizationJsonLd() {
  return {
    "@context": "https://schema.org",
    "@type": "Organization",
    name: siteConfig.name,
    url: siteConfig.url,
    logo: absoluteUrl("/icon.png"),
    slogan: siteConfig.tagline,
    email: siteConfig.email,
    sameAs: siteConfig.socials.map((s) => s.href),
  };
}

export function breadcrumbJsonLd(items: { name: string; path: string }[]) {
  return {
    "@context": "https://schema.org",
    "@type": "BreadcrumbList",
    itemListElement: items.map((item, i) => ({
      "@type": "ListItem",
      position: i + 1,
      name: item.name,
      item: absoluteUrl(item.path),
    })),
  };
}
