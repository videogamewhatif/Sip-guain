import type { Metadata } from "next";
import Image from "next/image";
import { CalendarDays, Mail, MapPin } from "lucide-react";
import { PhotoGrid } from "@/components/gallery/GalleryGrid";
import { Monarch, WineGlassLine } from "@/components/illustrations/Botanicals";
import { ButtonLink, Eyebrow, PageHero, SectionHeading } from "@/components/ui/primitives";
import { experienceKinds } from "@/data/experiences";
import { getExperiences } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";
import { formatEventDate } from "@/lib/utils";

export const metadata: Metadata = pageMetadata({
  title: "Experiencias",
  description: "Catas narrativas y experiencias literarias de Sip Güain, como El regalo de la monarca: vino, historia y conversación.",
  path: "/experiencias",
});

export default async function ExperiencesPage() {
  const experiences = await getExperiences();
  const dated = experiences.filter((e) => e.date);

  return (
    <>
      <PageHero
        chapter="VII"
        eyebrow="Experiencias y eventos"
        title={
          <>
            Catas que <em className="text-terracotta">se cuentan</em>
          </>
        }
        intro="Reunimos a personas alrededor de una mesa para catar, leer y conversar. Cada experiencia sigue el hilo de una de nuestras historias."
        aside={<WineGlassLine aria-hidden className="draw ml-auto hidden h-40 w-auto text-terracotta md:block" />}
      />

      {experiences.map((exp) => (
        <section key={exp.slug} id={exp.slug} aria-labelledby={`${exp.slug}-title`} className="relative pb-20 md:pb-28">
          <div className="container-editorial grid gap-12 md:grid-cols-12">
            <div className="relative md:col-span-6">
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm" data-reveal="mask">
                <Image src={exp.images[0].src} alt={exp.images[0].alt} fill sizes="(min-width: 768px) 45vw, 92vw" className="object-cover" preload />
              </div>
              <Monarch flutter className="absolute -right-3 -top-4 w-12 animate-float-slow" />
            </div>
            <div className="md:col-span-5 md:col-start-8">
              <Eyebrow>{experienceKinds[exp.kind]}</Eyebrow>
              <h2 id={`${exp.slug}-title`} className="display mt-4 text-[clamp(2.2rem,4.5vw,3.6rem)] text-wine" data-reveal>
                {exp.name}
              </h2>
              <p className="mt-5 font-serif text-xl italic leading-relaxed text-ink-soft">{exp.summary}</p>
              <div className="prose-editorial mt-6">
                {exp.description.map((p, i) => (
                  <p key={i}>{p}</p>
                ))}
              </div>
              {exp.includes && (
                <div className="mt-8 rounded-sm bg-wine p-6 text-cream on-dark">
                  <p className="eyebrow text-cream/70">Incluye</p>
                  <ul className="mt-4 grid gap-2 sm:grid-cols-2">
                    {exp.includes.map((inc) => (
                      <li key={inc} className="flex gap-2.5">
                        <span aria-hidden className="font-serif text-terracotta">Ü</span>
                        {inc}
                      </li>
                    ))}
                  </ul>
                </div>
              )}
              <dl className="mt-8 space-y-3 text-sm">
                <div className="flex items-center gap-3">
                  <dt>
                    <CalendarDays className="size-4 text-terracotta-ink" aria-hidden />
                    <span className="sr-only">Fecha</span>
                  </dt>
                  <dd className="text-ink">{exp.date ? formatEventDate(exp.date) : "Fechas por anunciar"}</dd>
                </div>
                {exp.location && (
                  <div className="flex items-center gap-3">
                    <dt>
                      <MapPin className="size-4 text-terracotta-ink" aria-hidden />
                      <span className="sr-only">Ubicación</span>
                    </dt>
                    <dd className="text-ink">{exp.location}</dd>
                  </div>
                )}
                <div className="flex items-start gap-3">
                  <dt>
                    <Mail className="mt-0.5 size-4 text-terracotta-ink" aria-hidden />
                    <span className="sr-only">Información</span>
                  </dt>
                  <dd className="text-ink-soft">{exp.contactNote}</dd>
                </div>
              </dl>
              <div className="mt-8 flex flex-wrap gap-4">
                <ButtonLink href="/contacto">Pide información</ButtonLink>
                {exp.storySlug && (
                  <ButtonLink href={`/arte-y-literatura/${exp.storySlug}`} variant="ghost">
                    Lee la historia
                  </ButtonLink>
                )}
              </div>
            </div>
          </div>
          {exp.images.length > 1 && (
            <div className="container-editorial mt-16">
              <PhotoGrid images={exp.images.slice(1).map((im, i) => ({ ...im, id: `${exp.slug}-${i}`, category: "experiencias" as const }))} columns="sm:grid-cols-4" />
            </div>
          )}
        </section>
      ))}

      <section aria-labelledby="agenda-title" className="bg-paper py-20 md:py-28">
        <div className="container-editorial grid gap-10 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading id="agenda-title" eyebrow="Agenda" title="Próximos encuentros" />
          </div>
          <div className="md:col-span-6 md:col-start-7">
            {dated.length ? (
              <ul className="divide-y divide-wine/12 border-y border-wine/12">
                {dated.map((e) => (
                  <li key={e.slug} className="py-5">
                    <p className="eyebrow text-terracotta-ink">{formatEventDate(e.date!)}</p>
                    <p className="mt-1 font-serif text-2xl text-wine">{e.name}</p>
                    {e.location && <p className="text-sm text-ink-soft">{e.location}</p>}
                  </li>
                ))}
              </ul>
            ) : (
              <div className="rounded-sm border border-dashed border-wine/25 p-8">
                <p className="font-serif text-2xl text-wine">Pronto, nuevas fechas.</p>
                <p className="mt-3 text-ink-soft">
                  Por ahora no hay fechas confirmadas publicadas. Síguenos en redes o escríbenos para enterarte de la próxima cata o para organizar una
                  experiencia privada.
                </p>
                <ButtonLink href="/contacto" variant="outline" className="mt-6">
                  Quiero enterarme
                </ButtonLink>
              </div>
            )}
          </div>
        </div>
      </section>
    </>
  );
}
