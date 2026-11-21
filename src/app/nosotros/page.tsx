import type { Metadata } from "next";
import Image from "next/image";
import { Parallax } from "@/components/animations/Parallax";
import { Barrel, FlowerSprig, GrapeCluster, Monarch, OpenBook, VineBranch } from "@/components/illustrations/Botanicals";
import { ButtonLink, Ornament, PageHero, SectionHeading } from "@/components/ui/primitives";
import { originNotes, selectionCriteria, team } from "@/data/brand";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Nosotros",
  description: "La historia de Sip Güain: tres amigas que unieron el vino mexicano, la literatura y el respeto por la naturaleza.",
  path: "/nosotros",
});

const chapters = [
  {
    id: "origen",
    title: "El origen",
    text: "Sip Güain nació de tres amigas apasionadas por el vino que crecieron juntas en Morelia. Decidieron unir lo que cada una sabía para crear algo propio: un proyecto que celebra la tradición vitivinícola mexicana y el cuidado de la tierra.",
    illustration: OpenBook,
  },
  {
    id: "letras",
    title: "Vino y literatura",
    text: "Para nosotras, una botella no es solo una bebida: es tinta. Cada etiqueta acompaña un relato original, y cada copa invita a una conversación. Por eso nuestro lema es maridaje de vino con letras.",
    illustration: FlowerSprig,
  },
  {
    id: "bajio",
    title: "Raíces en el Bajío",
    text: "Buscamos vinos del Bajío que no siempre llegan a todas las mesas. Hoy nuestras etiquetas provienen de Aguascalientes y San Luis Potosí, y cada una se elige con la mirada de nuestra enóloga.",
    illustration: GrapeCluster,
  },
  {
    id: "arte",
    title: "Visión artística",
    text: "Invitamos a artistas a interpretar nuestras historias. La ilustración de El regalo de la monarca, de Danny Sixx, convirtió nuestra primera etiqueta en una obra que también se cuelga en la pared.",
    illustration: VineBranch,
  },
  {
    id: "naturaleza",
    title: "Compromiso con la naturaleza",
    text: "Elegimos productores de mínima intervención, que trabajan la viña con respeto y aprovechan lo que el entorno ofrece. La sostenibilidad no es un adorno de la etiqueta: es la forma en que llegamos a ella.",
    illustration: Barrel,
  },
];

export default function AboutPage() {
  return (
    <>
      <PageHero
        chapter="I"
        eyebrow="Nosotros"
        title={
          <>
            Tres amigas, <em className="text-terracotta">una copa</em> y muchas historias
          </>
        }
        intro="En el corazón de Sip Güain hay una pasión: conectar historias con el arte de la viticultura. Somos narradoras antes que vinícola."
      />

      {/* Imagen principal */}
      <section aria-label="Sip Güain en una de sus catas" className="container-editorial">
        <div className="relative aspect-[16/9] overflow-hidden rounded-sm md:aspect-[21/9]" data-reveal="mask">
          <Parallax amount={80} className="absolute inset-[-10%_0]">
            <Image src="/images/experiences/brindis.webp" alt="Brindis con copas de vino tinto sobre una mesa con comida" fill sizes="100vw" className="object-cover" preload />
          </Parallax>
        </div>
        <p className="mt-3 text-right text-xs text-ink-soft">Brindis durante una experiencia Sip Güain.</p>
      </section>

      {/* Capítulos alternados */}
      <div className="py-16 md:py-24">
        {chapters.map((c, i) => {
          const Ill = c.illustration;
          const flip = i % 2 === 1;
          return (
            <section key={c.id} aria-labelledby={`cap-${c.id}`} className="container-editorial grid items-center gap-10 py-12 md:grid-cols-12 md:py-16">
              <div className={`md:col-span-4 ${flip ? "md:order-2 md:col-start-9" : "md:col-start-2"}`}>
                <Ill aria-hidden className="draw mx-auto h-40 w-auto text-olive md:h-52" />
              </div>
              <div className={`md:col-span-6 ${flip ? "md:order-1 md:col-start-2" : "md:col-start-7"}`} data-reveal>
                <p className="font-serif text-5xl text-terracotta/60">{String(i + 1).padStart(2, "0")}</p>
                <h2 id={`cap-${c.id}`} className="display mt-2 text-[clamp(2rem,4.5vw,3.4rem)] text-wine">
                  {c.title}
                </h2>
                <p className="mt-5 text-lg leading-relaxed text-ink-soft">{c.text}</p>
              </div>
            </section>
          );
        })}
      </div>

      {/* Citas de la marca */}
      <section aria-label="Frases de la marca" className="bg-wine py-20 text-cream on-dark md:py-28">
        <div className="container-editorial grid gap-12 md:grid-cols-2">
          {["Cada sorbo revela un matiz distinto, una historia por contar.", "En el vino y la vida, la grandeza radica en el sentir."].map((q) => (
            <figure key={q} data-reveal>
              <span aria-hidden className="font-serif text-7xl leading-none text-terracotta">“</span>
              <blockquote className="-mt-6 font-serif text-[clamp(1.6rem,3.4vw,2.6rem)] italic leading-snug">{q}</blockquote>
              <figcaption className="eyebrow mt-5 text-cream/60">Sip Güain</figcaption>
            </figure>
          ))}
        </div>
      </section>

      {/* Equipo */}
      <section aria-labelledby="equipo-title" className="relative overflow-hidden py-20 md:py-28">
        <Monarch flutter className="absolute right-[8%] top-16 w-12 animate-float-slow" />
        <div className="container-editorial">
          <SectionHeading id="equipo-title" eyebrow="Equipo Sip Güain" title="Creamos experiencias desde el corazón" />
          <ul className="mt-14 grid gap-8 md:grid-cols-3">
            {team.map((m) => (
              <li key={m.name} className="rounded-sm border border-wine/12 bg-paper p-8" data-reveal>
                <div aria-hidden className="grid size-20 place-items-center rounded-full border border-terracotta/50 font-serif text-3xl text-terracotta">
                  {m.name[0]}
                </div>
                <h3 className="mt-6 font-serif text-3xl text-wine">{m.name}</h3>
                <p className="eyebrow mt-2 text-[0.65rem] text-olive-ink">{m.role}</p>
                <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">{m.bio}</p>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* Filosofía de selección y origen */}
      <section aria-labelledby="seleccion-title" className="bg-paper py-20 md:py-28">
        <div className="container-editorial grid gap-14 md:grid-cols-12">
          <div className="md:col-span-5">
            <SectionHeading id="seleccion-title" eyebrow="Cómo elegimos" title="La exigencia de calidad nunca cambia" />
            <ul className="mt-10 space-y-3">
              {selectionCriteria.map((c) => (
                <li key={c} className="flex gap-3 text-ink">
                  <span aria-hidden className="text-terracotta">✦</span>
                  {c}
                </li>
              ))}
            </ul>
          </div>
          <div className="grid gap-6 md:col-span-6 md:col-start-7">
            {originNotes.map((n) => (
              <div key={n.title} className="border-t border-wine/15 pt-6" data-reveal>
                <h3 className="font-serif text-2xl text-wine">{n.title}</h3>
                <p className="mt-2 leading-relaxed text-ink-soft">{n.text}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      <section className="py-20 text-center md:py-28">
        <Ornament className="mx-auto max-w-sm" />
        <p className="display mx-auto mt-8 max-w-3xl px-5 text-[clamp(2rem,5vw,3.6rem)] text-wine">El vino se convierte en la tinta que escribe nuestras memorias.</p>
        <div className="mt-10 flex flex-wrap justify-center gap-4 px-5">
          <ButtonLink href="/vinos">Descubre los vinos</ButtonLink>
          <ButtonLink href="/arte-y-literatura" variant="outline">
            Lee nuestras historias
          </ButtonLink>
        </div>
      </section>
    </>
  );
}
