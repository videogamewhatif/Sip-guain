"use client";

/**
 * Explorador del arte de la etiqueta: lupa al pasar el cursor (escritorio) y
 * modo "acercar" con arrastre, botones y teclado (+ / − / flechas).
 */
import Image from "next/image";
import { Minus, Move, Plus, RotateCcw } from "lucide-react";
import { useRef, useState } from "react";
import type { ImageAsset } from "@/types/content";
import { clamp } from "@/lib/utils";

export function LabelExplorer({ image, caption }: { image: ImageAsset; caption?: string }) {
  const [zoom, setZoom] = useState(1);
  const [pos, setPos] = useState({ x: 50, y: 50 });
  const [lens, setLens] = useState<{ x: number; y: number; w: number } | null>(null);
  const drag = useRef<{ x: number; y: number; px: number; py: number } | null>(null);
  const boxRef = useRef<HTMLDivElement>(null);

  const setZoomClamped = (z: number) => setZoom(clamp(z, 1, 3.5));
  const pan = (dx: number, dy: number) => setPos((p) => ({ x: clamp(p.x + dx, 0, 100), y: clamp(p.y + dy, 0, 100) }));

  return (
    <figure>
      <div
        ref={boxRef}
        role="group"
        aria-label={`Ilustración ampliable: ${image.alt}. Usa + y − para acercar y las flechas para desplazarte.`}
        tabIndex={0}
        className="relative overflow-hidden rounded-sm bg-ink/90 outline-offset-4 touch-none select-none"
        style={{ aspectRatio: `${image.width} / ${image.height}`, cursor: zoom > 1 ? "grab" : "zoom-in" }}
        onKeyDown={(e) => {
          if (e.key === "+" || e.key === "=") setZoomClamped(zoom + 0.5);
          else if (e.key === "-") setZoomClamped(zoom - 0.5);
          else if (e.key === "ArrowLeft") pan(-6, 0);
          else if (e.key === "ArrowRight") pan(6, 0);
          else if (e.key === "ArrowUp") pan(0, -6);
          else if (e.key === "ArrowDown") pan(0, 6);
          else return;
          e.preventDefault();
        }}
        onClick={() => zoom === 1 && setZoomClamped(2.2)}
        onPointerMove={(e) => {
          const r = boxRef.current!.getBoundingClientRect();
          const x = ((e.clientX - r.left) / r.width) * 100;
          const y = ((e.clientY - r.top) / r.height) * 100;
          if (drag.current) {
            pan(((drag.current.x - e.clientX) / r.width) * (100 / zoom) * 1.2, ((drag.current.y - e.clientY) / r.height) * (100 / zoom) * 1.2);
            drag.current = { ...drag.current, x: e.clientX, y: e.clientY };
          } else if (zoom === 1 && e.pointerType === "mouse") {
            setLens({ x, y, w: r.width });
          }
        }}
        onPointerLeave={() => setLens(null)}
        onPointerDown={(e) => {
          if (zoom > 1) {
            drag.current = { x: e.clientX, y: e.clientY, px: pos.x, py: pos.y };
            (e.target as HTMLElement).setPointerCapture?.(e.pointerId);
          }
        }}
        onPointerUp={() => (drag.current = null)}
      >
        <Image
          src={image.src}
          alt={image.alt}
          fill
          sizes="(min-width: 1024px) 50vw, 100vw"
          quality={90}
          className="object-cover transition-transform duration-300 ease-out"
          style={{ transform: `scale(${zoom})`, transformOrigin: `${pos.x}% ${pos.y}%` }}
          draggable={false}
        />
        {lens && zoom === 1 && (
          <div
            aria-hidden
            className="pointer-events-none absolute size-40 -translate-x-1/2 -translate-y-1/2 rounded-full border-2 border-cream/80 shadow-2xl"
            style={{
              left: `${lens.x}%`,
              top: `${lens.y}%`,
              backgroundImage: `url(${image.src})`,
              backgroundSize: `${lens.w * 2.6}px auto`,
              backgroundPosition: `${lens.x}% ${lens.y}%`,
              backgroundRepeat: "no-repeat",
            }}
          />
        )}
        <div className="absolute bottom-3 right-3 flex gap-1.5 rounded-full bg-cream/90 p-1 text-wine shadow-lg backdrop-blur">
          <button type="button" className="grid size-9 place-items-center rounded-full hover:bg-wine hover:text-cream" aria-label="Acercar" onClick={(e) => (e.stopPropagation(), setZoomClamped(zoom + 0.5))}>
            <Plus className="size-4" aria-hidden />
          </button>
          <button type="button" className="grid size-9 place-items-center rounded-full hover:bg-wine hover:text-cream" aria-label="Alejar" onClick={(e) => (e.stopPropagation(), setZoomClamped(zoom - 0.5))}>
            <Minus className="size-4" aria-hidden />
          </button>
          <button
            type="button"
            className="grid size-9 place-items-center rounded-full hover:bg-wine hover:text-cream"
            aria-label="Restablecer"
            onClick={(e) => {
              e.stopPropagation();
              setZoom(1);
              setPos({ x: 50, y: 50 });
            }}
          >
            <RotateCcw className="size-4" aria-hidden />
          </button>
        </div>
        {zoom > 1 && (
          <p className="pointer-events-none absolute left-3 top-3 inline-flex items-center gap-1.5 rounded-full bg-ink/70 px-3 py-1 text-xs text-cream">
            <Move className="size-3.5" aria-hidden /> Arrastra para explorar · {zoom.toFixed(1)}×
          </p>
        )}
      </div>
      {caption && <figcaption className="mt-4 text-sm italic text-ink-soft">{caption}</figcaption>}
    </figure>
  );
}
