export const siteConfig = {
  name: "Sip Güain",
  legalName: "Sip Güain",
  tagline: "Maridaje de vino con letras",
  concept: "Historias que se descorchan",
  philosophy: "Cada etiqueta es una historia, cada copa un capítulo",
  description:
    "Sip Güain es una marca mexicana de vinos del Bajío que une vino, literatura, arte y naturaleza. Cada etiqueta es una historia, cada copa un capítulo.",
  /** Definir NEXT_PUBLIC_SITE_URL en producción (p. ej. https://sipguain.com). */
  url: (process.env.NEXT_PUBLIC_SITE_URL ?? "http://localhost:3000").replace(/\/$/, ""),
  locale: "es_MX",
  email: "contacto@sipguain.com",
  ogImage: "/images/branding/og-sip-guain.jpg",
  socials: [
    { id: "instagram", label: "Instagram", handle: "@sip.guain", href: "https://www.instagram.com/sip.guain/" },
    { id: "facebook", label: "Facebook", handle: "Sip Güain", href: "https://www.facebook.com/profile.php?id=61562728695160" },
  ],
  /** Edad mínima legal para consumo de alcohol en México. */
  legalDrinkingAge: 18,
} as const;

export type NavItem = { label: string; href: string };

export const primaryNav: NavItem[] = [
  { label: "Inicio", href: "/" },
  { label: "Nosotros", href: "/nosotros" },
  { label: "Nuestros vinos", href: "/vinos" },
  { label: "Arte y literatura", href: "/arte-y-literatura" },
  { label: "Artistas", href: "/artistas" },
  { label: "Merch", href: "/merch" },
  { label: "Experiencias", href: "/experiencias" },
  { label: "Contacto", href: "/contacto" },
];

export const secondaryNav: NavItem[] = [
  { label: "Galería", href: "/galeria" },
  { label: "Aviso de privacidad", href: "/aviso-de-privacidad" },
  { label: "Consumo responsable y legales", href: "/legal" },
];

export function absoluteUrl(path = "/") {
  return `${siteConfig.url}${path.startsWith("/") ? path : `/${path}`}`;
}
