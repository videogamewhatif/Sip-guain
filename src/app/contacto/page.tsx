import type { Metadata } from "next";
import { Mail } from "lucide-react";
import { ContactForm } from "@/components/contact/ContactForm";
import { FlowerSprig, Monarch } from "@/components/illustrations/Botanicals";
import { PageHero } from "@/components/ui/primitives";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { pageMetadata } from "@/lib/seo";
import { siteConfig } from "@/lib/site";

export const metadata: Metadata = pageMetadata({
  title: "Contacto",
  description: "Escríbele a Sip Güain: distribución, colaboraciones artísticas, experiencias, prensa o simplemente para contarnos qué te pareció la historia.",
  path: "/contacto",
});

export default function ContactPage() {
  return (
    <>
      <PageHero
        chapter="VIII"
        eyebrow="Contacto"
        title={
          <>
            Escribamos <em className="text-terracotta">el siguiente capítulo</em>
          </>
        }
        intro="Para distribuidores, restaurantes, librerías, artistas o cualquier persona que quiera contarnos cómo se sintió al leer una de nuestras etiquetas."
      />
      <section aria-label="Formulario y datos de contacto" className="pb-24 md:pb-32">
        <div className="container-editorial grid gap-16 md:grid-cols-12">
          <div className="md:col-span-7">
            <ContactForm />
          </div>
          <aside className="relative md:col-span-4 md:col-start-9" aria-label="Datos de contacto">
            <div className="rounded-sm bg-wine p-8 text-cream on-dark">
              <Monarch flutter className="absolute -right-2 -top-5 w-12 animate-float-slow" />
              <p className="eyebrow text-cream/70">Correo</p>
              <a href={`mailto:${siteConfig.email}`} className="mt-3 inline-flex items-center gap-2 font-serif text-xl underline-offset-4 hover:underline">
                <Mail className="size-5" aria-hidden />
                {siteConfig.email}
              </a>
              <p className="eyebrow mt-10 text-cream/70">Redes sociales</p>
              <SocialLinks className="mt-4" showHandle />
              <FlowerSprig aria-hidden className="draw mt-10 h-32 w-auto text-cream/30" />
            </div>
            <p className="mt-6 text-xs leading-relaxed text-ink-soft">
              Este sitio no realiza ventas ni reservaciones en línea. Te responderemos por correo electrónico.
            </p>
          </aside>
        </div>
      </section>
    </>
  );
}
