import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { PhotoGrid } from "@/components/gallery/GalleryGrid";
import { FlowerSprig, Monarch, VineBranch } from "@/components/illustrations/Botanicals";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink, DetailFallback, Eyebrow, Ornament, SectionHeading, SpecList } from "@/components/ui/primitives";
import { LabelExplorer } from "@/components/wines/LabelExplorer";
import { WineCard } from "@/components/wines/WineCard";
import { getArtist, getNextWine, getStory, getWine, getWines } from "@/lib/content";
import { jsonLd, pageMetadata } from "@/lib/seo";
import { absoluteUrl, siteConfig } from "@/lib/site";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  const wines = await getWines();
  return wines.map((w) => ({ slug: w.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const wine = await getWine(slug);
  if (!wine) return { title: "Vino no encontrado" };
  return pageMetadata({
    title: wine.name === wine.grapeVariety ? `${wine.name} · Vino tinto` : `${wine.name} · ${wine.grapeVariety}`,
    description: wine.description,
    path: `/vinos/${wine.slug}`,
    image: { src: wine.image.src, alt: wine.image.alt, width: wine.image.width, height: wine.image.height },
    type: "article",
  });
}

/** El shell de la ruta no depende de la URL; el contenido que lee `params` se transmite dentro de Suspense. */
export default function WinePage(props: Props) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <WineContent {...props} />
    </Suspense>
  );
}

async function WineContent({ params }: Props) {
  const { slug } = await params;
  const wine = await getWine(slug);
  if (!wine) notFound();
  const [next, story, artist] = await Promise.all([
    getNextWine(slug),
    wine.storySlug ? getStory(wine.storySlug) : null,
    wine.labelArt?.artistSlug ? getArtist(wine.labelArt.artistSlug) : null,
  ]);

  const productLd = {
    "@context": "https://schema.org",
    "@type": "Product",
    name: `${siteConfig.name} ${wine.name}`,
    description: wine.description,
    image: absoluteUrl(wine.image.src),
    brand: { "@type": "Brand", name: siteConfig.name },
    category: "Vino tinto",
    url: absoluteUrl(`/vinos/${wine.slug}`),
    additionalProperty: [
      { name: "Variedad", value: wine.composition ?? wine.grapeVariety },
      wine.region && { name: "Región", value: wine.region },
      wine.volume && { name: "Contenido", value: wine.volume },
    ]
      .filter(Boolean)
      .map((p) => ({ "@type": "PropertyValue", ...(p as object) })),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(productLd)} />
      <Breadcrumbs items={[{ name: "Nuestros vinos", path: "/vinos" }, { name: wine.name, path: `/vinos/${wine.slug}` }]} />

      {/* 1 · Hero */}
      <header className="relative overflow-hidden pb-20 pt-10 md:pb-28">
        <div aria-hidden className="absolute inset-x-0 bottom-0 h-2/3 opacity-20" style={{ background: `radial-gradient(ellipse at 70% 80%, ${wine.accent}, transparent 65%)` }} />
        <div className="container-editorial relative grid items-center gap-10 md:grid-cols-12">
          <div className="order-2 md:order-1 md:col-span-6">
            <Eyebrow>{wine.grapeVariety}</Eyebrow>
            <h1 className="display mt-5 text-[clamp(3rem,8vw,6.8rem)] text-wine" data-reveal>
              {wine.name}
            </h1>
            {wine.region && <p className="mt-6 font-serif text-xl italic text-ink-soft">{wine.region}</p>}
            <p className="mt-6 max-w-lg text-lg leading-relaxed text-ink-soft" data-reveal>
              {wine.description}
            </p>
            <div className="mt-10 flex flex-wrap gap-4">
              <ButtonLink href="#historia">Conoce su historia</ButtonLink>
              <ButtonLink href="#caracteristicas" variant="outline">
                Ficha técnica
              </ButtonLink>
            </div>
          </div>
          <div className="relative order-1 md:order-2 md:col-span-5 md:col-start-8">
            <div className="relative mx-auto aspect-[3/4] max-w-sm overflow-hidden rounded-t-[999px] bg-cream-deep md:max-w-md">
              <div aria-hidden className="absolute inset-0 opacity-35" style={{ background: `radial-gradient(ellipse at 50% 80%, ${wine.accent}, transparent 70%)` }} />
              <div aria-hidden className="absolute inset-x-[18%] bottom-[6%] h-6 rounded-[50%] bg-ink/30 blur-md" />
              <Image
                src={wine.cutout.src}
                alt={wine.image.alt}
                width={wine.cutout.width}
                height={wine.cutout.height}
                preload
                quality={90}
                sizes="(min-width: 768px) 20vw, 40vw"
                className="absolute bottom-[7%] left-1/2 h-[86%] w-auto -translate-x-1/2"
              />
            </div>
            <VineBranch aria-hidden className="draw absolute -left-6 bottom-0 h-56 w-auto text-olive/60 md:-left-14 md:h-72" />
            <Monarch flutter className="absolute right-4 top-10 w-12 animate-float-slow" />
          </div>
        </div>
      </header>

      {/* 2 · Historia */}
      <section id="historia" aria-labelledby="historia-title" className="bg-paper py-20 md:py-28">
        <div className="container-editorial grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <SectionHeading id="historia-title" eyebrow="La historia de la etiqueta" title="Un capítulo en la copa" />
          </div>
          <div className="prose-editorial md:col-span-7 md:col-start-6" data-reveal>
            {wine.story?.map((p, i) => (
              <p key={i} className={i === 0 ? "drop-cap font-serif text-xl leading-relaxed text-ink md:text-2xl" : ""}>
                {p}
              </p>
            ))}
            {story && (
              <div className="mt-10 rounded-sm border border-wine/15 bg-cream p-6 md:p-8">
                <p className="eyebrow text-terracotta-ink">Relato asociado</p>
                <p className="mt-3 font-serif text-2xl text-wine">{story.title}</p>
                <p className="mt-2 text-[0.95rem]">{story.subtitle}</p>
                <ButtonLink href={`/arte-y-literatura/${story.slug}`} variant="ghost" className="mt-5">
                  Leer la historia
                </ButtonLink>
              </div>
            )}
            {!wine.story?.length && <p>La historia de esta etiqueta se publicará próximamente.</p>}
          </div>
        </div>
      </section>

      {/* 3 · Características */}
      <section id="caracteristicas" aria-labelledby="ficha-title" className="py-20 md:py-28">
        <div className="container-editorial grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading id="ficha-title" eyebrow="Ficha técnica" title="Características" />
            <SpecList
              className="mt-10"
              items={[
                { label: "Variedad", value: wine.composition ?? wine.grapeVariety },
                { label: "Región", value: wine.region },
                { label: "Añada", value: wine.vintage },
                { label: "Graduación", value: wine.alcohol },
                { label: "Contenido", value: wine.volume },
                { label: "Enología", value: wine.winemaker },
              ]}
            />
          </div>
          <div className="space-y-10 md:col-span-6 md:col-start-7">
            {wine.tasting && (
              <div data-reveal>
                <h3 className="font-serif text-2xl text-wine">Notas de cata</h3>
                <dl className="mt-6 space-y-6">
                  {wine.tasting.color && (
                    <div>
                      <dt className="eyebrow text-[0.66rem] text-olive-ink">Vista</dt>
                      <dd className="mt-2 text-ink">{wine.tasting.color}</dd>
                    </div>
                  )}
                  {wine.tasting.aroma && (
                    <div>
                      <dt className="eyebrow text-[0.66rem] text-olive-ink">Nariz</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {wine.tasting.aroma.map((a) => (
                          <span key={a} className="rounded-full border border-wine/20 bg-paper px-3 py-1 text-sm text-ink">
                            {a}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                  {wine.tasting.palate && (
                    <div>
                      <dt className="eyebrow text-[0.66rem] text-olive-ink">Boca</dt>
                      <dd className="mt-3 flex flex-wrap gap-2">
                        {wine.tasting.palate.map((a) => (
                          <span key={a} className="rounded-full border border-wine/20 bg-paper px-3 py-1 text-sm text-ink">
                            {a}
                          </span>
                        ))}
                      </dd>
                    </div>
                  )}
                </dl>
              </div>
            )}
            {wine.pairing && (
              <div className="rounded-sm bg-wine p-8 text-cream on-dark" data-reveal>
                <FlowerSprig aria-hidden className="float-right ml-4 h-24 w-auto text-cream/30" />
                <h3 className="font-serif text-2xl">Maridaje sugerido</h3>
                <ul className="mt-5 space-y-2">
                  {wine.pairing.map((p) => (
                    <li key={p} className="flex gap-3">
                      <span aria-hidden className="text-terracotta">✦</span>
                      {p}
                    </li>
                  ))}
                </ul>
              </div>
            )}
            <p className="text-xs text-ink-soft">
              Información técnica tomada de las fichas públicas de la marca y de la etiqueta. Evite el abuso en el consumo de este producto.
            </p>
          </div>
        </div>
      </section>

      {/* 4 · Arte de la etiqueta */}
      {wine.labelArt && (
        <section aria-labelledby="arte-title" className="bg-ink py-20 text-cream on-dark md:py-28">
          <div className="container-editorial grid items-center gap-12 md:grid-cols-12">
            <div className="md:col-span-4">
              <SectionHeading id="arte-title" eyebrow="Arte de la etiqueta" title="Explora cada detalle" light />
              <p className="mt-6 text-cream/75">Acerca la ilustración, arrástrala y descubre los detalles que se esconden en la etiqueta.</p>
              {artist && (
                <p className="mt-8 text-sm text-cream/70">
                  Ilustración:{" "}
                  <Link href={`/artistas/${artist.slug}`} className="font-semibold text-cream underline underline-offset-4">
                    {artist.name}
                  </Link>
                </p>
              )}
            </div>
            <div className="md:col-span-7 md:col-start-6">
              <LabelExplorer image={wine.labelArt} caption={wine.labelArt.caption} />
            </div>
          </div>
        </section>
      )}

      {/* 5 · Galería */}
      {wine.gallery.length > 0 && (
        <section aria-labelledby="galeria-title" className="py-20 md:py-28">
          <div className="container-editorial">
            <SectionHeading id="galeria-title" eyebrow="Galería" title="En la mesa" />
            <PhotoGrid
              className="mt-12"
              images={[wine.image, ...wine.gallery].map((g, i) => ({ ...g, id: `${wine.slug}-${i}`, category: "vinos" as const }))}
              columns="sm:grid-cols-2 lg:grid-cols-4"
            />
          </div>
        </section>
      )}

      {/* 6 · Descubre otro capítulo */}
      {next && (
        <section aria-labelledby="otro-title" className="bg-paper py-20 md:py-28">
          <div className="container-editorial">
            <Ornament className="mx-auto max-w-sm" />
            <h2 id="otro-title" className="display mt-8 text-center text-[clamp(2rem,4.5vw,3.4rem)] text-wine">
              Descubre otro capítulo
            </h2>
            <div className="mx-auto mt-14 max-w-sm">
              <WineCard wine={next} index={0} cta="Conocer el vino" />
            </div>
          </div>
        </section>
      )}
    </article>
  );
}
