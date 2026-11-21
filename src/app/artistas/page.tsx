import type { Metadata } from "next";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight } from "lucide-react";
import { Quill } from "@/components/illustrations/Botanicals";
import { PageHero, PendingAsset } from "@/components/ui/primitives";
import { getArtists } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Artistas",
  description: "Artistas colaboradores de Sip Güain. Conoce la obra de Danny Sixx, autor de la ilustración de El regalo de la monarca.",
  path: "/artistas",
});

export default async function ArtistsPage() {
  const artists = await getArtists();
  return (
    <>
      <PageHero
        chapter="IV"
        eyebrow="Artistas colaboradores"
        title={
          <>
            Descubre el talento <em className="text-terracotta">detrás de cada botella</em>
          </>
        }
        intro="Cada etiqueta de Sip Güain es una obra encargada a artistas que comparten nuestra forma de contar historias."
        aside={<Quill aria-hidden className="draw ml-auto hidden w-32 text-wine/50 md:block" />}
      />
      <section aria-label="Listado de artistas" className="pb-24 md:pb-32">
        <ul className="container-editorial grid gap-10 md:grid-cols-2">
          {artists.map((a) => (
            <li key={a.slug} data-reveal>
              <Link href={`/artistas/${a.slug}`} className="group grid gap-6 sm:grid-cols-2">
                <div className="relative">
                  {a.portrait ? (
                    <Image src={a.portrait.src} alt={a.portrait.alt} width={a.portrait.width} height={a.portrait.height} className="aspect-[4/5] w-full object-cover" />
                  ) : (
                    <PendingAsset label={`Retrato autorizado de ${a.name}`} />
                  )}
                </div>
                <div className="flex flex-col justify-end">
                  <p className="eyebrow text-terracotta-ink">{a.role}</p>
                  <h2 className="display mt-3 text-4xl text-wine group-hover:italic">{a.name}</h2>
                  <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{a.bio[0]}</p>
                  {a.works[0]?.image && (
                    <div className="relative mt-6 aspect-[3/2] overflow-hidden rounded-sm">
                      <Image src={a.works[0].image.src} alt={a.works[0].image.alt} fill sizes="(min-width: 768px) 22vw, 90vw" className="object-cover object-top transition-transform duration-[1.2s] group-hover:scale-105" />
                    </div>
                  )}
                  <span className="mt-6 inline-flex items-center gap-2 text-sm font-semibold text-wine">
                    Ver perfil <ArrowRight className="size-4 transition-transform group-hover:translate-x-1" aria-hidden />
                  </span>
                </div>
              </Link>
            </li>
          ))}
          <li className="flex items-center justify-center rounded-sm border border-dashed border-wine/25 p-10 text-center" data-reveal>
            <div>
              <p className="font-serif text-2xl text-wine">¿Ilustras historias?</p>
              <p className="mt-3 text-sm text-ink-soft">Buscamos artistas para nuevas etiquetas y colaboraciones.</p>
              <Link href="/contacto" className="mt-5 inline-block border-b border-wine pb-0.5 text-sm font-semibold text-wine">
                Escríbenos
              </Link>
            </div>
          </li>
        </ul>
      </section>
    </>
  );
}
