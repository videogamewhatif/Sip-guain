import type { Metadata } from "next";
import { GrapeCluster, VineBranch } from "@/components/illustrations/Botanicals";
import { ButtonLink, Ornament, PageHero } from "@/components/ui/primitives";
import { WineCard } from "@/components/wines/WineCard";
import { getWines } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nuestros vinos",
  description: "Catálogo de vinos mexicanos Sip Güain: El regalo de la monarca (Malbec) y Tempranillo. Ediciones limitadas con historias ilustradas.",
  path: "/vinos",
});

export default async function WinesPage() {
  const wines = await getWines();
  return (
    <>
      <PageHero
        chapter="II"
        eyebrow="Nuestros vinos"
        title={
          <>
            Una biblioteca <em className="text-terracotta">que se bebe</em>
          </>
        }
        intro="Vinos del Bajío seleccionados por nuestra enóloga, en ediciones limitadas. Cada etiqueta abre una historia distinta."
        aside={<GrapeCluster aria-hidden className="draw ml-auto hidden w-40 text-wine/40 md:block" />}
      />

      <section aria-label="Catálogo de vinos" className="relative pb-24 md:pb-32">
        <VineBranch aria-hidden className="draw pointer-events-none absolute -left-10 top-20 hidden h-[480px] w-auto text-olive/25 lg:block" />
        <div className="container-editorial">
          <div className="grid gap-20 sm:grid-cols-2 md:gap-12 lg:gap-24">
            {wines.map((w, i) => (
              <WineCard key={w.slug} wine={w} index={i} cta="Conocer el vino" />
            ))}
          </div>
          <Ornament className="mx-auto mt-24 max-w-md" />
          <div className="mx-auto mt-10 max-w-2xl text-center" data-reveal>
            <p className="font-serif text-2xl leading-snug text-wine md:text-3xl">¿Te gustaría llevar Sip Güain a tu mesa, restaurante o librería?</p>
            <p className="mt-4 text-ink-soft">Este sitio es un catálogo informativo. Para distribución, colaboraciones o eventos, escríbenos.</p>
            <ButtonLink href="/contacto" className="mt-8">
              Contáctanos
            </ButtonLink>
          </div>
        </div>
      </section>
    </>
  );
}
