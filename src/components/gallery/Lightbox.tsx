"use client";

/**
 * Visor de imágenes accesible: diálogo modal, foco atrapado, Esc para cerrar,
 * flechas ←/→ y gestos de deslizamiento para navegar, contador anunciado.
 */
import Image from "next/image";
import { ChevronLeft, ChevronRight, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useLayoutEffect, useRef } from "react";
import type { ImageAsset } from "@/types/content";

export interface LightboxImage extends ImageAsset {
  caption?: string;
}

export function Lightbox({
  images,
  index,
  onClose,
  onIndex,
}: {
  images: LightboxImage[];
  index: number | null;
  onClose: () => void;
  onIndex: (i: number) => void;
}) {
  const reduce = useReducedMotion();
  const dialogRef = useRef<HTMLDivElement>(null);
  const returnFocus = useRef<HTMLElement | null>(null);
  const touchX = useRef<number | null>(null);
  const open = index !== null;
  const count = images.length;

  const go = useCallback(
    (dir: 1 | -1) => {
      if (index === null) return;
      onIndex((index + dir + count) % count);
    },
    [index, count, onIndex],
  );

  // Si la ruta se oculta (Activity), cerrar el visor.
  useLayoutEffect(() => () => onClose(), [onClose]);

  // Apertura/cierre: bloqueo de scroll, foco inicial y retorno del foco.
  useEffect(() => {
    if (!open) return;
    returnFocus.current = document.activeElement as HTMLElement;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    dialogRef.current?.querySelector<HTMLElement>("[data-autofocus]")?.focus();
    return () => {
      document.body.style.overflow = prev;
      returnFocus.current?.focus?.();
    };
  }, [open]);

  // Teclado: Esc, flechas y foco atrapado.
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      else if (e.key === "ArrowRight") go(1);
      else if (e.key === "ArrowLeft") go(-1);
      else if (e.key === "Tab" && dialogRef.current) {
        const items = dialogRef.current.querySelectorAll<HTMLElement>("button");
        const first = items[0];
        const last = items[items.length - 1];
        if (e.shiftKey && document.activeElement === first) {
          e.preventDefault();
          last.focus();
        } else if (!e.shiftKey && document.activeElement === last) {
          e.preventDefault();
          first.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, [open, go, onClose]);

  const img = index !== null ? images[index] : null;

  return (
    <AnimatePresence>
      {open && img && (
        <motion.div
          ref={dialogRef}
          role="dialog"
          aria-modal="true"
          aria-label="Visor de imágenes"
          className="fixed inset-0 z-[70] flex flex-col bg-ink/95 text-cream on-dark"
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: reduce ? 0 : 0.3 }}
          onTouchStart={(e) => (touchX.current = e.touches[0].clientX)}
          onTouchEnd={(e) => {
            if (touchX.current === null) return;
            const dx = e.changedTouches[0].clientX - touchX.current;
            if (Math.abs(dx) > 50) go(dx < 0 ? 1 : -1);
            touchX.current = null;
          }}
        >
          <div className="flex items-center justify-between px-4 py-3 md:px-8">
            <p className="text-sm tabular-nums text-cream/70" aria-live="polite">
              {index! + 1} / {count}
            </p>
            <button
              type="button"
              data-autofocus
              onClick={onClose}
              className="inline-flex items-center gap-2 rounded-full border border-cream/30 px-4 py-2 text-xs font-semibold tracking-widest uppercase hover:bg-cream hover:text-ink"
            >
              <X className="size-4" aria-hidden /> Cerrar
            </button>
          </div>
          <div className="relative flex min-h-0 flex-1 items-center justify-center px-2 md:px-20" onClick={(e) => e.target === e.currentTarget && onClose()}>
            <AnimatePresence mode="wait" initial={false}>
              <motion.figure
                key={img.src}
                className="relative flex h-full w-full flex-col items-center justify-center"
                initial={reduce ? { opacity: 0 } : { opacity: 0, scale: 0.98, filter: "blur(6px)" }}
                animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                exit={{ opacity: 0 }}
                transition={{ duration: reduce ? 0 : 0.35 }}
              >
                <div className="relative h-[calc(100svh-11rem)] w-full">
                  <Image src={img.src} alt={img.alt} fill sizes="100vw" className="object-contain" quality={90} />
                </div>
                {(img.caption || img.credit) && (
                  <figcaption className="mt-3 px-4 text-center font-serif text-base italic text-cream/80">
                    {img.caption}
                    {img.credit && <span className="ml-2 font-sans text-xs not-italic text-cream/50">{img.credit}</span>}
                  </figcaption>
                )}
              </motion.figure>
            </AnimatePresence>
            {count > 1 && (
              <>
                <button
                  type="button"
                  onClick={() => go(-1)}
                  aria-label="Imagen anterior"
                  className="absolute left-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 hover:bg-cream hover:text-ink md:left-6"
                >
                  <ChevronLeft aria-hidden />
                </button>
                <button
                  type="button"
                  onClick={() => go(1)}
                  aria-label="Imagen siguiente"
                  className="absolute right-2 top-1/2 grid size-11 -translate-y-1/2 place-items-center rounded-full bg-ink/60 hover:bg-cream hover:text-ink md:right-6"
                >
                  <ChevronRight aria-hidden />
                </button>
              </>
            )}
          </div>
          <div className="h-8" />
        </motion.div>
      )}
    </AnimatePresence>
  );
}
