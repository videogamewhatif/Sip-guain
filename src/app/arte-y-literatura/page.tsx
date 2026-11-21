import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { Parallax } from "@/components/animations/Parallax";
import { FlowerSprig, Monarch, OpenBook, Quill } from "@/components/illustrations/Botanicals";
import { ButtonLink, Ornament, PageHero, SectionHeading } from "@/components/ui/primitives";
import { getArtists, getStories, getWines } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Arte y literatura",
  description: "Las historias e ilustraciones detrás de cada etiqueta de Sip Güain: El regalo de la monarca, Xunan Kab y el arte de Danny Sixx.",
  path: "/arte-y-literatura",
});

export default async function ArtLiteraturePage() {
  const [stories, wines, artists] = await Promise.all([getStories(), getWines(), getArtists()]);
  return (
    <>
      <PageHero
        chapter="III"
        eyebrow="Arte y literatura"
        title={
          <>
            Cada etiqueta <em className="text-terracotta">es una página</em>
          </>
        }
        intro="Nuestras botellas se visten con ilustraciones y guardan relatos originales. Aquí puedes leerlos, descubrir sus símbolos y conocer a quienes les dan forma."
        aside={<Quill aria-hidden className="draw ml-auto hidden w-36 text-terracotta md:block" />}
      />

      {/* Índice como en un libro */}
      <nav aria-label="Índice de historias" className="container-editorial pb-6">
        <div className="border-y border-wine/15 py-6">
          <p className="eyebrow text-olive-ink">Índice</p>
          <ol className="mt-4 divide-y divide-dashed divide-wine/15">
            {stories.map((s, i) => (
              <li key={s.slug}>
                <Link href={`/arte-y-literatura/${s.slug}`} className="group flex items-baseline gap-4 py-3">
                  <span className="font-serif text-terracotta">{String(i + 1).padStart(2, "0")}</span>
                  <span className="font-serif text-xl text-wine group-hover:italic md:text-2xl">{s.title}</span>
                  <span aria-hidden className="mx-2 flex-1 translate-y-[-4px] border-b border-dotted border-wine/30" />
                  <span className="text-sm text-ink-soft">Leer</span>
                </Link>
              </li>
            ))}
          </ol>
        </div>
      </nav>

      {/* Historias en composición asimétrica */}
      {stories.map((s, i) => {
        const relatedWines = wines.filter((w) => s.relatedWineSlugs.includes(w.slug));
        const flip = i % 2 === 1;
        return (
          <section key={s.slug} aria-labelledby={`story-${s.slug}`} className="relative overflow-hidden py-20 md:py-28">
            <div className={`container-editorial grid items-center gap-12 md:grid-cols-12`}>
              <div className={`relative md:col-span-5 ${flip ? "md:order-2 md:col-start-8" : ""}`}>
                {s.cover ? (
                  <Parallax amount={60}>
                    <figure className="relative overflow-hidden rounded-sm shadow-[0_30px_60px_-30px_rgba(36,33,31,0.5)]" data-reveal="mask">
                      <Image src={s.cover.src} alt={s.cover.alt} width={s.cover.width} height={s.cover.height} sizes="(min-width: 768px) 38vw, 92vw" className="h-auto w-full" />
                    </figure>
                  </Parallax>
                ) : (
                  <div className="relative flex aspect-[4/5] items-center justify-center rounded-sm" style={{ backgroundColor: `${s.accent}22` }}>
                    <FlowerSprig aria-hidden className="draw h-3/4 w-auto" style={{ color: s.accent }} />
                    <p className="absolute bottom-5 left-5 right-5 text-center text-xs text-ink-soft">Ilustración de la etiqueta: por anunciar</p>
                  </div>
                )}
                <Monarch flutter className={`absolute -top-4 w-12 animate-float-slow ${flip ? "-left-2" : "-right-2"}`} />
              </div>
              <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-1" : "md:col-start-7"}`}>
                <p className="eyebrow text-terracotta-ink">Capítulo {String(i + 1).padStart(2, "0")}</p>
                <h2 id={`story-${s.slug}`} className="display mt-4 text-[clamp(2.4rem,5.5vw,4.6rem)] text-wine" data-reveal>
                  {s.title}
                </h2>
                <p className="mt-5 font-serif text-xl italic leading-relaxed text-ink-soft md:text-2xl" data-reveal>
                  {s.subtitle}
                </p>
                <p className="mt-6 leading-relaxed text-ink-soft" data-reveal>
                  {s.excerpt}
                </p>
                <ul className="mt-6 flex flex-wrap gap-2" aria-label="Temas">
                  {s.themes.map((t) => (
                    <li key={t} className="rounded-full border border-olive/40 px-3 py-1 text-xs text-olive-ink">
                      {t}
                    </li>
                  ))}
                </ul>
                <div className="mt-8 flex flex-wrap items-center gap-4">
                  <ButtonLink href={`/arte-y-literatura/${s.slug}`}>Leer la historia</ButtonLink>
                  {relatedWines.map((w) => (
                    <ButtonLink key={w.slug} href={`/vinos/${w.slug}`} variant="ghost">
                      {w.name}
                    </ButtonLink>
                  ))}
                </div>
              </div>
            </div>
            {i < stories.length - 1 && <Ornament className="container-editorial mt-20 max-w-lg" />}
          </section>
        );
      })}

      {/* Artistas */}
      <section aria-labelledby="artistas-title" className="bg-wine py-20 text-cream on-dark md:py-28">
        <div className="container-editorial grid items-center gap-10 md:grid-cols-12">
          <div className="md:col-span-7">
            <SectionHeading id="artistas-title" eyebrow="Quienes ilustran" title="El talento detrás de cada botella" light />
            <p className="mt-6 max-w-xl text-cream/80">
              {artists.map((a) => a.name).join(", ")} da vida visual a nuestras historias. Conoce su obra y su participación en Sip Güain.
            </p>
            <ButtonLink href="/artistas" variant="light" className="mt-8">
              Conocer a los artistas
            </ButtonLink>
          </div>
          <OpenBook aria-hidden className="draw w-full max-w-xs justify-self-center text-cream/50 md:col-span-4 md:col-start-9" />
        </div>
      </section>
    </>
  );
}
