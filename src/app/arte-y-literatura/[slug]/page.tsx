import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { FlowerSprig, Monarch, VineLeaf } from "@/components/illustrations/Botanicals";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink, DetailFallback, Eyebrow, Ornament } from "@/components/ui/primitives";
import { WineCard } from "@/components/wines/WineCard";
import { getArtist, getStories, getStory, getWines } from "@/lib/content";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const stories = await getStories();
  return stories.map((s) => ({ slug: s.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) return { title: "Historia no encontrada" };
  return pageMetadata({
    title: story.title,
    description: story.excerpt,
    path: `/arte-y-literatura/${story.slug}`,
    image: story.cover ? { src: story.cover.src, alt: story.cover.alt, width: story.cover.width, height: story.cover.height } : undefined,
    type: "article",
  });
}

/** El shell de la ruta no depende de la URL; el contenido que lee `params` se transmite dentro de Suspense. */
export default function StoryPage(props: Props) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <StoryContent {...props} />
    </Suspense>
  );
}

async function StoryContent({ params }: Props) {
  const { slug } = await params;
  const story = await getStory(slug);
  if (!story) notFound();
  const [wines, artist, stories] = await Promise.all([getWines(), story.artistSlug ? getArtist(story.artistSlug) : null, getStories()]);
  const related = wines.filter((w) => story.relatedWineSlugs.includes(w.slug));
  const others = stories.filter((s) => s.slug !== story.slug);
  const hasOriginal = !!story.originalText?.length;
  const body = hasOriginal ? story.originalText! : story.summary;

  const articleLd = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    name: story.title,
    abstract: story.excerpt,
    inLanguage: "es-MX",
    publisher: { "@type": "Organization", name: siteConfig.name },
    url: absoluteUrl(`/arte-y-literatura/${story.slug}`),
    ...(story.cover && { image: absoluteUrl(story.cover.src) }),
    keywords: story.themes.join(", "),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(articleLd)} />
      <Breadcrumbs items={[{ name: "Arte y literatura", path: "/arte-y-literatura" }, { name: story.title, path: `/arte-y-literatura/${story.slug}` }]} />

      {/* Portadilla */}
      <header className="relative overflow-hidden py-16 text-center md:py-24">
        <VineLeaf aria-hidden className="draw absolute left-[6%] top-10 hidden w-24 -rotate-12 text-olive/50 md:block" />
        <FlowerSprig aria-hidden className="draw absolute right-[6%] top-6 hidden h-40 w-auto text-terracotta/60 md:block" />
        <div className="container-editorial">
          <Eyebrow>Arte y literatura</Eyebrow>
          <h1 className="display mx-auto mt-6 max-w-4xl text-[clamp(3rem,9vw,7.5rem)] text-wine" data-reveal>
            {story.title}
          </h1>
          <p className="mx-auto mt-6 max-w-2xl font-serif text-xl italic text-ink-soft md:text-2xl" data-reveal>
            {story.subtitle}
          </p>
          <Ornament className="mx-auto mt-12 max-w-xs" />
        </div>
      </header>

      {/* Lectura en formato libro */}
      <section aria-label="Relato" className="pb-20 md:pb-28">
        <div className="container-editorial grid gap-12 lg:grid-cols-12">
          {story.cover && (
            <figure className="lg:sticky lg:top-[calc(var(--header-h)+2rem)] lg:col-span-5 lg:self-start" data-reveal="mask">
              <Image src={story.cover.src} alt={story.cover.alt} width={story.cover.width} height={story.cover.height} sizes="(min-width: 1024px) 38vw, 92vw" className="h-auto w-full rounded-sm shadow-[0_30px_60px_-30px_rgba(36,33,31,0.5)]" />
              {artist && (
                <figcaption className="mt-3 text-sm text-ink-soft">
                  Ilustración de{" "}
                  <Link href={`/artistas/${artist.slug}`} className="text-wine underline underline-offset-4">
                    {artist.name}
                  </Link>
                </figcaption>
              )}
            </figure>
          )}
          <div className={story.cover ? "lg:col-span-6 lg:col-start-7" : "mx-auto max-w-2xl lg:col-span-8 lg:col-start-3"}>
            <div className="relative rounded-sm bg-paper px-6 py-10 shadow-[0_1px_0_rgba(83,44,59,0.08),0_20px_40px_-30px_rgba(36,33,31,0.35)] md:px-12 md:py-14">
              <p className="eyebrow text-olive-ink">{hasOriginal ? "Texto original" : "La historia, en breve"}</p>
              <div className="prose-editorial mt-6 font-serif text-[1.15rem] leading-[1.9] text-ink md:text-[1.25rem]">
                {body.map((p, i) => (
                  <p key={i} className={i === 0 ? "drop-cap" : ""} data-reveal>
                    {p}
                  </p>
                ))}
              </div>
              {!hasOriginal && story.originalUrl && (
                <div className="mt-10 border-t border-wine/15 pt-6 text-sm text-ink-soft">
                  <p>Este es un resumen editorial. El relato completo, tal como lo escribió Sip Güain, está disponible en su sitio actual.</p>
                  <ButtonLink href={story.originalUrl} external variant="ghost" className="mt-3">
                    Leer el texto completo
                  </ButtonLink>
                </div>
              )}
              <Monarch className="absolute -right-4 -top-5 w-12 rotate-12" />
            </div>

            {story.symbols && (
              <div className="mt-16">
                <h2 className="display text-3xl text-wine md:text-4xl">Lee los símbolos</h2>
                <dl className="mt-8 grid gap-6 sm:grid-cols-2">
                  {story.symbols.map((sym, i) => (
                    <div key={sym.name} className="border-t-2 pt-4" style={{ borderColor: i % 2 ? "var(--color-olive)" : "var(--color-terracotta)" }} data-reveal>
                      <dt className="font-serif text-xl text-wine">{sym.name}</dt>
                      <dd className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{sym.meaning}</dd>
                    </div>
                  ))}
                </dl>
              </div>
            )}

            <ul className="mt-12 flex flex-wrap gap-2" aria-label="Temas">
              {story.themes.map((t) => (
                <li key={t} className="rounded-full border border-olive/40 px-3 py-1 text-xs text-olive-ink">
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </div>
      </section>

      {related.length > 0 && (
        <section aria-labelledby="vinos-rel" className="bg-paper py-20 md:py-28">
          <div className="container-editorial">
            <h2 id="vinos-rel" className="display text-center text-[clamp(2rem,4.5vw,3.4rem)] text-wine">
              Esta historia se sirve en
            </h2>
            <div className="mx-auto mt-14 grid max-w-4xl gap-16 sm:grid-cols-2">
              {related.map((w, i) => (
                <WineCard key={w.slug} wine={w} index={i} cta="Conocer el vino" />
              ))}
            </div>
          </div>
        </section>
      )}
      {related.length === 0 && (
        <section className="bg-paper py-16">
          <p className="container-editorial text-center font-serif text-xl italic text-ink-soft">La etiqueta que acompañará esta historia se anunciará próximamente.</p>
        </section>
      )}

      {others.length > 0 && (
        <nav aria-label="Otras historias" className="container-editorial py-16">
          <p className="eyebrow text-olive-ink">Siguiente capítulo</p>
          {others.map((o) => (
            <Link key={o.slug} href={`/arte-y-literatura/${o.slug}`} className="group mt-3 block font-serif text-3xl text-wine md:text-5xl">
              {o.title} <span aria-hidden className="inline-block transition-transform group-hover:translate-x-2">→</span>
            </Link>
          ))}
        </nav>
      )}
    </article>
  );
}
