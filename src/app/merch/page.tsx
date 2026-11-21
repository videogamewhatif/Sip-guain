import type { Metadata } from "next";
import Image from "next/image";
import { Monarch } from "@/components/illustrations/Botanicals";
import { ButtonLink, PageHero } from "@/components/ui/primitives";
import { merchCategories } from "@/data/merch";
import { getMerch } from "@/lib/content";
import { pageMetadata } from "@/lib/seo";

export const metadata: Metadata = pageMetadata({
  title: "Merch",
  description: "Colección visual de artículos Sip Güain: playeras, tote bags, accesorios e ilustraciones de edición limitada.",
  path: "/merch",
});

export default async function MerchPage() {
  const items = await getMerch();
  return (
    <>
      <PageHero
        chapter="VI"
        eyebrow="Colección de merchandising"
        title={
          <>
            Cada pieza es <em className="text-terracotta">un lienzo</em>
          </>
        }
        intro="Artículos diseñados con el mismo cuidado que ponemos en nuestros vinos. Una colección para mirar de cerca: cada objeto narra una parte de nuestra historia."
      >
        <nav aria-label="Categorías de la colección" className="mt-10">
          <ul className="flex flex-wrap gap-2">
            {merchCategories
              .filter((c) => items.some((i) => i.category === c.id))
              .map((c) => (
                <li key={c.id}>
                  <a href={`#${c.id}`} className="inline-block rounded-full border border-wine/25 px-4 py-2 text-sm text-wine transition-colors hover:border-wine hover:bg-wine hover:text-cream">
                    {c.label}
                  </a>
                </li>
              ))}
          </ul>
        </nav>
      </PageHero>

      {merchCategories.map((cat, ci) => {
        const list = items.filter((i) => i.category === cat.id);
        if (!list.length) return null;
        return (
          <section key={cat.id} id={cat.id} aria-labelledby={`${cat.id}-title`} className={ci % 2 ? "bg-paper py-20 md:py-24" : "py-20 md:py-24"}>
            <div className="container-editorial">
              <div className="flex flex-col justify-between gap-4 border-b border-wine/15 pb-6 md:flex-row md:items-end">
                <h2 id={`${cat.id}-title`} className="display text-[clamp(2.2rem,5vw,3.8rem)] text-wine">
                  {cat.label}
                </h2>
                <p className="max-w-md text-ink-soft">{cat.description}</p>
              </div>
              <ul className="mt-12 grid gap-x-8 gap-y-16 sm:grid-cols-2 lg:grid-cols-3">
                {list.map((item) => (
                  <li key={item.slug} id={item.slug} className="group scroll-mt-28" data-reveal>
                    <div className="relative aspect-[4/5] overflow-hidden rounded-sm bg-cream-deep">
                      <Image
                        src={item.images[0].src}
                        alt={item.images[0].alt}
                        fill
                        sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                        className="object-cover transition-all duration-[1.2s] ease-[var(--ease-editorial)] group-hover:scale-[1.04]"
                      />
                      {item.images[1] && (
                        <Image
                          src={item.images[1].src}
                          alt={item.images[1].alt}
                          fill
                          sizes="(min-width: 1024px) 30vw, (min-width: 640px) 45vw, 92vw"
                          className="object-cover opacity-0 transition-opacity duration-700 group-hover:opacity-100"
                        />
                      )}
                      <Monarch className="absolute right-4 top-4 w-8 -rotate-12 opacity-0 transition-all duration-700 group-hover:-translate-y-1 group-hover:opacity-100" />
                    </div>
                    <h3 className="mt-5 font-serif text-2xl text-wine">{item.name}</h3>
                    <p className="mt-2 text-[0.95rem] leading-relaxed text-ink-soft">{item.description}</p>
                    {item.details && (
                      <ul className="mt-3 flex flex-wrap gap-2">
                        {item.details.map((d) => (
                          <li key={d} className="rounded-full bg-cream-deep px-3 py-1 text-xs text-ink-soft">
                            {d}
                          </li>
                        ))}
                      </ul>
                    )}
                    {item.inspiration && (
                      <p className="mt-4 border-l-2 border-terracotta/60 pl-4 font-serif text-[0.98rem] italic leading-relaxed text-ink-soft">{item.inspiration}</p>
                    )}
                  </li>
                ))}
              </ul>
            </div>
          </section>
        );
      })}

      <section className="py-20 text-center">
        <p className="mx-auto max-w-xl px-5 text-ink-soft">
          Esta es una colección visual. Si te interesa alguna pieza para un evento, una colaboración o un regalo corporativo, escríbenos.
        </p>
        <ButtonLink href="/contacto" className="mt-8">
          Contáctanos
        </ButtonLink>
      </section>
    </>
  );
}
