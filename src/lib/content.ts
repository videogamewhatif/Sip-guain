/**
 * Capa de acceso a contenido.
 *
 * Hoy lee archivos TypeScript locales. Las funciones son asíncronas a
 * propósito: para migrar a un CMS basta con reemplazar el cuerpo de cada
 * función por una consulta (manteniendo las firmas), sin tocar las páginas.
 */
import { artists } from "@/data/artists";
import { experiences } from "@/data/experiences";
import { gallery } from "@/data/gallery";
import { merch } from "@/data/merch";
import { stories } from "@/data/stories";
import { wines } from "@/data/wines";

export async function getWines() {
  return wines;
}
export async function getWine(slug: string) {
  return wines.find((w) => w.slug === slug) ?? null;
}
/** "Descubre otro capítulo": siguiente vino en el catálogo (circular). */
export async function getNextWine(slug: string) {
  const i = wines.findIndex((w) => w.slug === slug);
  if (wines.length < 2 || i === -1) return null;
  return wines[(i + 1) % wines.length];
}

export async function getStories() {
  return stories;
}
export async function getStory(slug: string) {
  return stories.find((s) => s.slug === slug) ?? null;
}

export async function getArtists() {
  return artists;
}
export async function getArtist(slug: string) {
  return artists.find((a) => a.slug === slug) ?? null;
}

export async function getMerch() {
  return merch;
}
export async function getExperiences() {
  return experiences;
}
export async function getGallery() {
  return gallery;
}
