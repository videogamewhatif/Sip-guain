import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/animations/Parallax";
import {
  Barrel,
  FlowerSprig,
  GrapeCluster,
  Monarch,
  OpenBook,
  Quill,
  VineBranch,
  VineLeaf,
  WineGlassLine,
} from "@/components/illustrations/Botanicals";
import { ButtonLink, Eyebrow, Ornament, SectionHeading } from "@/components/ui/primitives";
import { WineCard } from "@/components/wines/WineCard";
import { pillars, selectionCriteria } from "@/data/brand";
import type { MerchItem, Story, Wine } from "@/types/content";

/* ───────────────── Sección 2 · Introducción editorial ───────────────── */

export function EditorialIntro({ id }: { id: string }) {
  return (
    <section id={id} tabIndex={-1} aria-labelledby="intro-title" className="relative overflow-hidden py-24 outline-none md:py-36">
      <VineLeaf aria-hidden className="draw absolute -left-6 top-6 w-24 rotate-[-18deg] text-olive/60 md:left-[2%] md:w-32" />
      <GrapeCluster aria-hidden className="draw absolute -right-4 bottom-10 w-24 text-wine/40 md:right-[8%] md:w-32" />
      <div className="container-editorial relative grid gap-12 md:grid-cols-12">
        <div className="md:col-span-5 md:col-start-2">
          <Eyebrow>Prólogo</Eyebrow>
          <h2 id="intro-title" className="display mt-5 text-[clamp(2.6rem,6.5vw,5.4rem)] text-wine" data-reveal>
            El vino también <em className="text-terracotta">se lee</em>
          </h2>
        </div>
        <div className="md:col-span-5 md:pt-24" data-reveal>
          <p className="drop-cap font-serif text-[1.35rem] leading-[1.6] text-ink md:text-2xl">
            En Sip Güain creemos que cada vino tiene algo que contar. Historias nacidas de la tierra, transformadas por el arte y compartidas
            en cada copa.
          </p>
          <Ornament className="mt-10 max-w-xs" />
          <p className="mt-6 text-sm leading-relaxed text-ink-soft">
            Somos una marca mexicana que une vinos del Bajío con relatos originales e ilustración. Nuestro lema lo resume:{" "}
            <strong className="font-semibold text-wine">maridaje de vino con letras</strong>.
          </p>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Sección 3 · Nuestros vinos ───────────────── */

export function WinesShowcase({ wines }: { wines: Wine[] }) {
  return (
    <section aria-labelledby="vinos-title" className="relative bg-paper py-24 md:py-32">
      <div className="container-editorial">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="vinos-title"
            eyebrow="Capítulo II · Nuestros vinos"
            title="Dos etiquetas, un mismo universo"
            intro="Vinos mexicanos en ediciones limitadas. Cada botella guarda una historia ilustrada."
          />
          <ButtonLink href="/vinos" variant="outline" className="shrink-0">
            Explorar la colección
          </ButtonLink>
        </div>
        <div className="mt-16 grid gap-16 sm:grid-cols-2 md:gap-10 lg:gap-20">
          {wines.map((w, i) => (
            <WineCard key={w.slug} wine={w} index={i} />
          ))}
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Sección 4 · El arte detrás de cada etiqueta ───────────────── */

export function LabelArt({ story }: { story: Story }) {
  return (
    <section aria-labelledby="arte-title" className="relative overflow-hidden py-24 md:py-36">
      <div className="container-editorial grid items-center gap-14 md:grid-cols-12">
        <div className="relative md:col-span-6">
          <Parallax amount={70}>
            <figure className="relative mx-auto max-w-md overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(36,33,31,0.5)]" data-reveal="mask">
              <Image
                src="/images/art/el-regalo-de-la-monarca-ilustracion.webp"
                alt="Ilustración de El regalo de la monarca: figura alada entre mariposas sobre un paisaje de montañas al atardecer"
                width={1555}
                height={2200}
                sizes="(min-width: 768px) 30vw, 90vw"
                className="h-auto w-full"
              />
            </figure>
          </Parallax>
          <figure className="absolute -bottom-10 -right-2 w-40 rotate-3 bg-cream p-2 shadow-xl md:-right-6 md:w-52" data-reveal>
            <Image src="/images/art/el-regalo-de-la-monarca-detalle.webp" alt="Detalle de la etiqueta del Malbec" width={1200} height={1200} sizes="13rem" className="h-auto w-full" />
            <figcaption className="mt-2 text-center text-[0.65rem] tracking-wide text-ink-soft">Detalle de la etiqueta</figcaption>
          </figure>
          <Monarch flutter className="absolute -left-2 top-8 w-12 animate-float-slow" />
        </div>
        <div className="md:col-span-5 md:col-start-8">
          <SectionHeading eyebrow="Capítulo III · Arte y literatura" title="No diseñamos etiquetas. Contamos historias." />
          <blockquote className="mt-10 border-l-2 border-terracotta pl-6" data-reveal>
            <p className="font-serif text-xl italic leading-relaxed text-ink md:text-2xl">“{story.excerpt}”</p>
            <footer className="mt-4 text-sm text-ink-soft">
              — <cite className="not-italic">{story.title}</cite>
            </footer>
          </blockquote>
          <ul className="mt-8 flex flex-wrap gap-2" aria-label="Temas de la historia">
            {story.themes.map((t) => (
              <li key={t} className="rounded-full border border-olive/40 px-3 py-1 text-xs text-olive-ink">
                {t}
              </li>
            ))}
          </ul>
          <ButtonLink href="/arte-y-literatura" className="mt-10">
            Explorar arte y literatura
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Sección 5 · Nuestra esencia ───────────────── */

const pillarIcons = {
  book: OpenBook,
  grapes: GrapeCluster,
  butterfly: VineLeaf,
  leaf: VineBranch,
  quill: Quill,
} as const;

export function Essence() {
  return (
    <section aria-labelledby="esencia-title" className="relative bg-wine py-24 text-cream on-dark md:py-32">
      <div className="container-editorial">
        <SectionHeading id="esencia-title" eyebrow="Capítulo IV · Nuestra esencia" title="Cinco ingredientes de cada historia" light align="center" />
        <ol className="mt-16 grid gap-px overflow-hidden rounded-sm bg-cream/15 sm:grid-cols-2 lg:grid-cols-5">
          {pillars.map((p, i) => {
            const Icon = p.icon === "butterfly" ? null : pillarIcons[p.icon];
            return (
              <li key={p.id} className="group relative bg-wine p-8 transition-colors duration-500 hover:bg-wine-deep" data-reveal>
                <span className="font-serif text-sm text-cream/50">{String(i + 1).padStart(2, "0")}</span>
                <div className="mt-6 h-16">
                  {Icon ? (
                    <Icon aria-hidden className="draw h-16 w-auto text-cream/80" />
                  ) : (
                    <Monarch className="h-14 w-auto transition-transform duration-700 group-hover:-rotate-6" />
                  )}
                </div>
                <h3 className="mt-6 font-serif text-2xl leading-tight">{p.title}</h3>
                <p className="mt-3 text-sm leading-relaxed text-cream/75">{p.text}</p>
              </li>
            );
          })}
        </ol>
      </div>
    </section>
  );
}

/* ───────────────── Sección 6 · El origen ───────────────── */

export function Origin() {
  return (
    <section aria-labelledby="origen-title" className="relative overflow-hidden">
      <div className="relative h-[78svh] min-h-[520px] w-full overflow-hidden">
        <Parallax amount={120} className="absolute inset-[-8%_0]">
          <Image
            src="/images/vineyards/vinedo-crepusculo.webp"
            alt="Hileras de vid al atardecer frente a montañas"
            fill
            sizes="100vw"
            className="object-cover"
          />
        </Parallax>
        <div aria-hidden className="absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/35 to-ink/10" />
        <div className="container-editorial relative flex h-full flex-col justify-end pb-16 text-cream on-dark md:pb-24">
          <Eyebrow className="text-cream/80">Capítulo V · El origen</Eyebrow>
          <h2 id="origen-title" className="display mt-4 max-w-3xl text-[clamp(2.4rem,6vw,5rem)]" data-reveal>
            Vinos del Bajío que no siempre llegan a todas las mesas
          </h2>
        </div>
      </div>
      <div className="container-editorial grid gap-12 py-20 md:grid-cols-12 md:py-28">
        <div className="md:col-span-5" data-reveal>
          <p className="font-serif text-2xl leading-snug text-wine md:text-3xl">
            Nuestra enóloga, con más de 15 años de experiencia, selecciona cada vino con los estándares que nos definen.
          </p>
          <Barrel aria-hidden className="draw mt-10 w-32 text-olive/70" />
        </div>
        <div className="md:col-span-6 md:col-start-7">
          <ul className="space-y-0 divide-y divide-wine/12 border-y border-wine/12">
            {selectionCriteria.map((c, i) => (
              <li key={c} className="flex gap-5 py-5" data-reveal>
                <span className="font-serif text-lg text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                <span className="text-ink">{c}</span>
              </li>
            ))}
          </ul>
          <p className="mt-6 text-sm text-ink-soft">Cada edición es limitada, pero la exigencia de calidad nunca cambia.</p>
          <ButtonLink href="/nosotros" variant="ghost" className="mt-8">
            Leer nuestra historia
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}

/* ───────────────── Sección 7 · Merchandising ───────────────── */

export function MerchTeaser({ items }: { items: MerchItem[] }) {
  const shown = items.slice(0, 4);
  return (
    <section aria-labelledby="merch-title" className="bg-paper py-24 md:py-32">
      <div className="container-editorial">
        <div className="flex flex-col items-start justify-between gap-8 md:flex-row md:items-end">
          <SectionHeading
            id="merch-title"
            eyebrow="Capítulo VI · Merch"
            title="Piezas que también cuentan"
            intro="Cada pieza es un lienzo que narra una parte de nuestra historia."
          />
          <ButtonLink href="/merch" variant="outline" className="shrink-0">
            Explorar la colección
          </ButtonLink>
        </div>
        <ul className="mt-14 grid grid-cols-2 gap-4 md:grid-cols-12 md:gap-6">
          {shown.map((m, i) => (
            <li
              key={m.slug}
              className={i === 0 ? "col-span-2 row-span-2 md:col-span-6" : i === 3 ? "col-span-2 md:col-span-6" : "md:col-span-3"}
              data-reveal
             
            >
              <Link href={`/merch#${m.slug}`} className="group block">
                <div className={`relative overflow-hidden rounded-sm bg-cream-deep ${i === 0 ? "aspect-[4/5]" : i === 3 ? "aspect-[16/9]" : "aspect-square"}`}>
                  <Image
                    src={m.images[0].src}
                    alt={m.images[0].alt}
                    fill
                    sizes={i === 0 ? "(min-width: 768px) 45vw, 100vw" : "(min-width: 768px) 25vw, 50vw"}
                    className="object-cover transition-transform duration-[1.4s] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                  />
                </div>
                <p className="mt-3 font-serif text-lg text-wine">{m.name}</p>
              </Link>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}

/* ───────────────── Sección 8 · Cierre narrativo ───────────────── */

export function ClosingChapter() {
  return (
    <section aria-labelledby="cierre-title" className="relative overflow-hidden bg-wine py-28 text-cream on-dark md:py-40">
      <FlowerSprig aria-hidden className="draw absolute -left-4 top-10 h-64 w-auto text-cream/25 md:left-[6%] md:h-80" />
      <VineBranch aria-hidden className="draw absolute -right-8 bottom-0 h-72 w-auto text-cream/20 md:right-[5%] md:h-96" />
      <div className="container-editorial relative flex flex-col items-center text-center">
        <WineGlassLine aria-hidden className="draw h-28 w-auto text-terracotta" strokeWidth={1.4} />
        <h2 id="cierre-title" className="display mt-10 max-w-4xl text-[clamp(2.4rem,6.4vw,5.6rem)]" data-reveal>
          Hay historias que se leen. <em className="text-terracotta">Otras se descorchan.</em>
        </h2>
        <ButtonLink href="/nosotros" variant="light" className="mt-12">
          Conoce nuestra historia
        </ButtonLink>
        <Monarch flutter className="absolute right-[12%] top-0 w-10 animate-float-slow md:w-14" />
      </div>
    </section>
  );
}
