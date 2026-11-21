import type { Metadata } from "next";
import { PageHero } from "@/components/ui/primitives";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Consumo responsable y legales",
  description: "Consumo responsable, mayoría de edad, propiedad intelectual y condiciones de uso del sitio de Sip Güain.",
  path: "/legal",
});

export default function LegalPage() {
  const blocks = [
    {
      title: "Consumo responsable",
      items: [
        "Evite el abuso en el consumo de este producto.",
        `Las bebidas alcohólicas son exclusivamente para personas mayores de ${siteConfig.legalDrinkingAge} años.`,
        "Si vas a manejar, no bebas. Si estás embarazada o en periodo de lactancia, evita el consumo de alcohol.",
        "Disfrutar del vino es compartir, conversar y leer; nunca competir ni excederse.",
      ],
    },
    {
      title: "Verificación de edad",
      items: [
        "Al ingresar se solicita confirmar la mayoría de edad. Es una autodeclaración del visitante y no constituye un mecanismo de verificación de identidad ni una garantía de cumplimiento legal.",
        "El contenido de este sitio está dirigido a personas adultas y no está diseñado para atraer a menores de edad.",
      ],
    },
    {
      title: "Naturaleza del sitio",
      items: [
        "Este sitio es informativo y cultural: presenta los vinos, historias, artistas y experiencias de la marca. No realiza ventas, cobros, reservaciones ni pedidos en línea.",
        "La información técnica de los vinos proviene de fichas y etiquetas de la marca y puede variar entre añadas.",
      ],
    },
    {
      title: "Propiedad intelectual",
      items: [
        `La marca ${siteConfig.name}, su logotipo, relatos, fotografías e ilustraciones pertenecen a sus respectivos titulares. Las ilustraciones de etiquetas son obra de los artistas acreditados.`,
        "No está permitido reproducir el contenido con fines comerciales sin autorización por escrito.",
      ],
    },
  ];
  return (
    <>
      <PageHero chapter="§" eyebrow="Legal" title="Consumo responsable y legales" />
      <section className="container-editorial pb-24">
        <div className="mx-auto grid max-w-4xl gap-12 md:grid-cols-2">
          {blocks.map((b) => (
            <div key={b.title} className="border-t-2 border-wine/20 pt-6">
              <h2 className="font-serif text-2xl text-wine">{b.title}</h2>
              <ul className="mt-4 space-y-3 text-[0.95rem] leading-relaxed text-ink-soft">
                {b.items.map((i) => (
                  <li key={i} className="flex gap-3">
                    <span aria-hidden className="text-terracotta">✦</span>
                    {i}
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>
        <p className="mx-auto mt-16 max-w-4xl text-xs text-ink-soft">
          Las leyendas y requisitos aplicables a la publicidad de bebidas alcohólicas en México deben validarse con asesoría legal antes de publicar.
        </p>
      </section>
    </>
  );
}
