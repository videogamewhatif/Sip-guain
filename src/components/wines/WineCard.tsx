import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Monarch } from "@/components/illustrations/Botanicals";
import type { Wine } from "@/types/content";
import { cn } from "@/lib/utils";

/**
 * Tarjeta editorial de vino (sin precio ni compra).
 * La botella recortada descansa en un arco teñido con el color de su etiqueta.
 */
export function WineCard({ wine, index, cta = "Descubrir su historia", className }: { wine: Wine; index: number; cta?: string; className?: string }) {
  return (
    <article className={cn("group relative", className)} data-reveal>
      <Link href={`/vinos/${wine.slug}`} prefetch className="block focus-visible:outline-offset-8" aria-label={`${wine.name}, ${wine.grapeVariety}. ${cta}`}>
        <div className="relative mx-auto aspect-[4/5] w-full overflow-hidden rounded-t-[999px] bg-cream-deep">
          <div
            aria-hidden
            className="absolute inset-0 opacity-25 transition-opacity duration-700 group-hover:opacity-45"
            style={{ background: `radial-gradient(ellipse at 50% 85%, ${wine.accent}, transparent 70%)` }}
          />
          <div aria-hidden className="absolute inset-x-[12%] bottom-[7%] h-6 rounded-[50%] bg-ink/25 blur-md transition-transform duration-700 group-hover:scale-x-90" />
          <Image
            src={wine.cutout.src}
            alt=""
            width={wine.cutout.width}
            height={wine.cutout.height}
            sizes="(min-width: 768px) 14vw, 30vw"
            quality={90}
            className="absolute bottom-[8%] left-1/2 h-[82%] w-auto -translate-x-1/2 transition-transform duration-700 ease-[var(--ease-editorial)] group-hover:-translate-y-3 group-hover:-rotate-2"
          />
          <Monarch className="absolute right-[18%] top-[22%] w-9 -rotate-12 opacity-0 transition-all duration-700 group-hover:translate-y-[-8px] group-hover:opacity-100" />
          <span className="absolute left-6 top-[18%] font-serif text-6xl leading-none text-wine/15 md:text-7xl" aria-hidden>
            {String(index + 1).padStart(2, "0")}
          </span>
        </div>
        <div className="mt-7 text-center">
          <p className="eyebrow text-terracotta-ink">{wine.grapeVariety}</p>
          <h3 className="display mt-3 text-[clamp(1.8rem,3vw,2.4rem)] text-wine">{wine.name}</h3>
          <p className="mx-auto mt-3 max-w-sm text-[0.95rem] leading-relaxed text-ink-soft">{wine.description}</p>
          <span className="mt-5 inline-flex items-center gap-2 border-b border-wine/30 pb-1 text-sm font-semibold text-wine transition-colors group-hover:border-wine">
            {cta}
            <ArrowRight aria-hidden className="size-4 transition-transform duration-500 group-hover:translate-x-1" />
          </span>
        </div>
      </Link>
    </article>
  );
}
