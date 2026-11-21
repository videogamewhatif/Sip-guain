"use client";

/**
 * Galería editorial tipo masonry (columnas CSS) con filtros por categoría,
 * visor y carga diferida de imágenes (Next/Image + lazy loading nativo).
 */
import Image from "next/image";
import { Expand } from "lucide-react";
import { AnimatePresence, LayoutGroup, motion, useReducedMotion } from "motion/react";
import { useCallback, useMemo, useState } from "react";
import type { GalleryCategory, GalleryImage } from "@/types/content";
import { cn } from "@/lib/utils";
import { Lightbox } from "./Lightbox";

export function GalleryGrid({
  images,
  categories,
}: {
  images: GalleryImage[];
  categories: { id: GalleryCategory | "todas"; label: string }[];
}) {
  const [filter, setFilter] = useState<GalleryCategory | "todas">("todas");
  const [index, setIndex] = useState<number | null>(null);
  const reduce = useReducedMotion();
  const visible = useMemo(() => (filter === "todas" ? images : images.filter((i) => i.category === filter)), [filter, images]);
  const close = useCallback(() => setIndex(null), []);
  const counts = useMemo(() => {
    const c: Record<string, number> = { todas: images.length };
    images.forEach((i) => (c[i.category] = (c[i.category] ?? 0) + 1));
    return c;
  }, [images]);

  return (
    <div>
      <div role="toolbar" aria-label="Filtrar galería por categoría" className="flex flex-wrap gap-2">
        <LayoutGroup>
          {categories
            .filter((c) => counts[c.id])
            .map((c) => {
              const active = c.id === filter;
              return (
                <button
                  key={c.id}
                  type="button"
                  aria-pressed={active}
                  onClick={() => setFilter(c.id)}
                  className={cn(
                    "relative rounded-full border px-4 py-2 text-sm transition-colors",
                    active ? "border-wine text-cream" : "border-wine/25 text-wine hover:border-wine",
                  )}
                >
                  {active && (
                    <motion.span
                      layoutId="gallery-pill"
                      className="absolute inset-0 -z-0 rounded-full bg-wine"
                      transition={{ type: "spring", bounce: 0.15, duration: reduce ? 0 : 0.5 }}
                    />
                  )}
                  <span className="relative">
                    {c.label} <span className={cn("text-xs", active ? "text-cream/70" : "text-ink-soft")}>{counts[c.id]}</span>
                  </span>
                </button>
              );
            })}
        </LayoutGroup>
      </div>
      <p className="sr-only" aria-live="polite">
        {visible.length} imágenes mostradas
      </p>

      <motion.ul layout={!reduce} className="mt-10 columns-1 gap-5 sm:columns-2 lg:columns-3 [&>li]:mb-5">
        <AnimatePresence initial={false}>
          {visible.map((img, i) => (
            <motion.li
              key={img.id}
              layout={!reduce}
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0 }}
              transition={{ duration: reduce ? 0 : 0.45, delay: reduce ? 0 : Math.min(i, 8) * 0.03 }}
              className="break-inside-avoid"
            >
              <button
                type="button"
                onClick={() => setIndex(i)}
                className="group relative block w-full overflow-hidden rounded-sm bg-cream-deep text-left"
                aria-label={`Ampliar: ${img.alt}`}
              >
                <Image
                  src={img.src}
                  alt={img.alt}
                  width={img.width}
                  height={img.height}
                  sizes="(min-width: 1024px) 31vw, (min-width: 640px) 46vw, 92vw"
                  className="h-auto w-full transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.035]"
                />
                <span className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/60 via-transparent to-transparent opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100" />
                <span className="pointer-events-none absolute bottom-3 left-4 right-4 flex items-center justify-between text-cream opacity-0 transition-opacity duration-500 group-hover:opacity-100 group-focus-visible:opacity-100">
                  <span className="font-serif text-base italic">{img.caption ?? categories.find((c) => c.id === img.category)?.label}</span>
                  <Expand className="size-4" aria-hidden />
                </span>
              </button>
            </motion.li>
          ))}
        </AnimatePresence>
      </motion.ul>

      <Lightbox images={visible} index={index} onClose={close} onIndex={setIndex} />
    </div>
  );
}

/** Rejilla simple de fotografías que abre el visor (fichas de vino, experiencias…). */
export function PhotoGrid({ images, className, columns = "sm:grid-cols-3" }: { images: GalleryImage[]; className?: string; columns?: string }) {
  const [index, setIndex] = useState<number | null>(null);
  const close = useCallback(() => setIndex(null), []);
  return (
    <>
      <ul className={cn("grid grid-cols-2 gap-3 md:gap-5", columns, className)}>
        {images.map((img, i) => (
          <li key={img.id} className={i === 0 && images.length % 2 === 1 ? "col-span-2 sm:col-span-1" : undefined}>
            <button type="button" onClick={() => setIndex(i)} className="group relative block aspect-square w-full overflow-hidden rounded-sm bg-cream-deep" aria-label={`Ampliar: ${img.alt}`}>
              <Image
                src={img.src}
                alt={img.alt}
                fill
                sizes="(min-width: 768px) 30vw, 50vw"
                className="object-cover transition-transform duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.05]"
              />
            </button>
          </li>
        ))}
      </ul>
      <Lightbox images={images} index={index} onClose={close} onIndex={setIndex} />
    </>
  );
}
