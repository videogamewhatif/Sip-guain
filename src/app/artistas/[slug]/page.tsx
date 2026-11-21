import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { Suspense } from "react";
import { Monarch } from "@/components/illustrations/Botanicals";
import { Breadcrumbs } from "@/components/ui/Breadcrumbs";
import { ButtonLink, DetailFallback, Eyebrow, PendingAsset, SectionHeading } from "@/components/ui/primitives";
import { getArtist, getArtists, getWines } from "@/lib/content";
import { jsonLd, pageMetadata } from "@/lib/seo";

type Props = { params: Promise<{ slug: string }> };

export async function generateStaticParams() {
  return (await getArtists()).map((a) => ({ slug: a.slug }));
}

export async function generateMetadata({ params }: Props): Promise<Metadata> {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) return { title: "Artista no encontrado" };
  return pageMetadata({ title: artist.name, description: artist.bio[0], path: `/artistas/${artist.slug}`, type: "article" });
}

/** El shell de la ruta no depende de la URL; el contenido que lee `params` se transmite dentro de Suspense. */
export default function ArtistPage(props: Props) {
  return (
    <Suspense fallback={<DetailFallback />}>
      <ArtistContent {...props} />
    </Suspense>
  );
}

async function ArtistContent({ params }: Props) {
  const { slug } = await params;
  const artist = await getArtist(slug);
  if (!artist) notFound();
  const wines = await getWines();

  const personLd = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: artist.name,
    ...(artist.aliases && { alternateName: artist.aliases }),
    description: artist.bio.join(" "),
    ...(artist.links.length && { sameAs: artist.links.map((l) => l.href) }),
  };

  return (
    <article>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(personLd)} />
      <Breadcrumbs items={[{ name: "Artistas", path: "/artistas" }, { name: artist.name, path: `/artistas/${artist.slug}` }]} />
      <header className="container-editorial grid gap-12 py-14 md:grid-cols-12 md:py-20">
        <div className="relative md:col-span-4">
          {artist.portrait ? (
            <Image src={artist.portrait.src} alt={artist.portrait.alt} width={artist.portrait.width} height={artist.portrait.height} className="w-full" preload />
          ) : (
            <PendingAsset label={`Retrato autorizado de ${artist.name}`} note="Se publicará cuando contemos con una fotografía aprobada por el artista." />
          )}
          <Monarch flutter className="absolute -right-3 -top-4 w-12 animate-float-slow" />
        </div>
        <div className="md:col-span-7 md:col-start-6">
          <Eyebrow>{artist.role}</Eyebrow>
          <h1 className="display mt-5 text-[clamp(3rem,8vw,6.4rem)] text-wine" data-reveal>
            {artist.name}
          </h1>
          <div className="prose-editorial mt-8 max-w-2xl" data-reveal>
            {artist.bio.map((p, i) => (
              <p key={i} className={i === 0 ? "font-serif text-xl leading-relaxed text-ink md:text-2xl" : ""}>
                {p}
              </p>
            ))}
          </div>
          <div className="mt-10 rounded-sm border-l-2 border-terracotta bg-paper p-6">
            <p className="eyebrow text-olive-ink">Participación en Sip Güain</p>
            <p className="mt-3 text-ink">{artist.participation}</p>
          </div>
          {artist.links.length > 0 ? (
            <ul className="mt-8 flex flex-wrap gap-3">
              {artist.links.map((l) => (
                <li key={l.href}>
                  <ButtonLink href={l.href} external variant="outline">
                    {l.label}
                  </ButtonLink>
                </li>
              ))}
            </ul>
          ) : (
            <p className="mt-8 text-sm text-ink-soft">Enlaces oficiales del artista: por confirmar.</p>
          )}
        </div>
      </header>

      <section aria-labelledby="obras-title" className="bg-ink py-20 text-cream on-dark md:py-28">
        <div className="container-editorial">
          <SectionHeading id="obras-title" eyebrow="Obra para Sip Güain" title="Obras" light />
          <ul className="mt-14 grid gap-12 md:grid-cols-2">
            {artist.works.map((w) => {
              const wine = wines.find((x) => x.slug === w.relatedWineSlug);
              return (
                <li key={w.title} data-reveal>
                  {w.image && (
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-ink-soft">
                      <Image src={w.image.src} alt={w.image.alt} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover object-top" />
                    </div>
                  )}
                  <h3 className="mt-6 font-serif text-2xl">{w.title}</h3>
                  <p className="mt-2 text-cream/75">{w.description}</p>
                  {wine && (
                    <Link href={`/vinos/${wine.slug}`} className="mt-4 inline-block border-b border-cream/40 pb-0.5 text-sm font-semibold hover:border-cream">
                      Ver en {wine.name}
                    </Link>
                  )}
                </li>
              );
            })}
          </ul>
        </div>
      </section>
    </article>
  );
}
