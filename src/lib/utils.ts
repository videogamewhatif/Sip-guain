export function cn(...classes: Array<string | false | null | undefined>) {
  return classes.filter(Boolean).join(" ");
}

export const clamp = (v: number, min = 0, max = 1) => Math.min(max, Math.max(min, v));

/** Normaliza `v` dentro del rango [a, b] → [0, 1]. */
export const range = (v: number, a: number, b: number) => clamp((v - a) / (b - a));

export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;

export const easeInOutCubic = (t: number) => (t < 0.5 ? 4 * t * t * t : 1 - Math.pow(-2 * t + 2, 3) / 2);
export const easeOutCubic = (t: number) => 1 - Math.pow(1 - t, 3);
export const easeInCubic = (t: number) => t * t * t;
export const easeInOutSine = (t: number) => -(Math.cos(Math.PI * t) - 1) / 2;

export function formatEventDate(iso: string) {
  return new Intl.DateTimeFormat("es-MX", { dateStyle: "long", timeZone: "America/Mexico_City" }).format(new Date(iso));
}
