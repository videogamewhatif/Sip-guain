/**
 * Modelos de contenido de Sip Güain.
 *
 * Todos los campos opcionales se ocultan en la interfaz cuando no existen:
 * nunca se muestran datos inventados. Estos tipos están pensados para
 * mapearse 1:1 a colecciones de un CMS (Sanity, Contentful, Payload, etc.).
 */

export interface ImageAsset {
  src: string;
  alt: string;
  width: number;
  height: number;
  /** Crédito o nota de origen (p. ej. "Fotografía: sipguain.com"). */
  credit?: string;
}

/** Marca un recurso o dato pendiente de proporcionar por la marca. */
export interface PendingNote {
  pending: true;
  note: string;
}

export interface Wine {
  id: string;
  slug: string;
  name: string;
  /** Nombre corto para tarjetas y navegación. */
  shortName: string;
  /** Variedad tal como debe mostrarse (p. ej. "Malbec"). */
  grapeVariety: string;
  /** Composición declarada (p. ej. "Malbec 100 %"). */
  composition?: string;
  region?: string;
  vintage?: string;
  alcohol?: string;
  volume?: string;
  winemaker?: string;
  /** Descripción breve para tarjetas (1–2 frases). */
  description: string;
  /** Narrativa larga de la etiqueta (texto propio del sitio). */
  story?: string[];
  /** Historia literaria vinculada (slug de /arte-y-literatura). */
  storySlug?: string;
  tasting?: {
    color?: string;
    aroma?: string[];
    palate?: string[];
  };
  pairing?: string[];
  /** Botella sobre fondo (fotografía de producto). */
  image: ImageAsset;
  /** Botella recortada con transparencia (para composiciones). */
  cutout: ImageAsset;
  /** Arte de la etiqueta en gran formato, si existe. */
  labelArt?: ImageAsset & { artistSlug?: string; caption?: string };
  gallery: ImageAsset[];
  /** Color de acento para la ficha (tono de la etiqueta). */
  accent: string;
  /** Recursos que faltan para completar la ficha. */
  pendingAssets?: string[];
}

export interface Story {
  slug: string;
  title: string;
  subtitle: string;
  /** Extracto corto para listados. */
  excerpt: string;
  /** Resumen editorial con palabras propias (no sustituye al texto original). */
  summary: string[];
  /**
   * Texto literario original de la marca. Debe pegarlo la marca desde su
   * archivo fuente; mientras esté vacío se muestra el resumen y el enlace.
   */
  originalText?: string[];
  originalUrl?: string;
  themes: string[];
  /** Personajes o símbolos para la sección "Lee los símbolos". */
  symbols?: { name: string; meaning: string }[];
  relatedWineSlugs: string[];
  artistSlug?: string;
  cover?: ImageAsset;
  accent: string;
}

export interface Artist {
  slug: string;
  name: string;
  /** Variantes de escritura encontradas en fuentes públicas. */
  aliases?: string[];
  role: string;
  bio: string[];
  portrait?: ImageAsset;
  works: { title: string; description: string; image?: ImageAsset; relatedWineSlug?: string }[];
  participation: string;
  links: { label: string; href: string }[];
  pendingAssets?: string[];
}

export type MerchCategory = "playeras" | "tote-bags" | "accesorios" | "ilustraciones";

export interface MerchItem {
  slug: string;
  name: string;
  category: MerchCategory;
  description: string;
  details?: string[];
  inspiration?: string;
  images: ImageAsset[];
}

export interface Experience {
  slug: string;
  name: string;
  kind: "cata" | "presentacion" | "evento-cultural" | "colaboracion" | "experiencia-literaria";
  summary: string;
  description: string[];
  includes?: string[];
  /** ISO 8601. Si no hay fecha confirmada, se omite y se muestra "Fechas por anunciar". */
  date?: string;
  location?: string;
  storySlug?: string;
  images: ImageAsset[];
  contactNote: string;
}

export type GalleryCategory =
  | "vinos"
  | "etiquetas"
  | "vinedos"
  | "arte"
  | "experiencias"
  | "merch"
  | "marca";

export interface GalleryImage extends ImageAsset {
  id: string;
  category: GalleryCategory;
  caption?: string;
}

export interface TeamMember {
  name: string;
  role: string;
  bio: string;
}
