import Link from "next/link";
import { VineBranch } from "@/components/illustrations/Botanicals";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { primaryNav, secondaryNav, siteConfig } from "@/lib/site";

const BUILD_YEAR = process.env.NEXT_PUBLIC_BUILD_YEAR ?? "2026";

export function Footer() {
  return (
    <footer className="on-dark relative overflow-hidden bg-wine-deep text-cream">
      <VineBranch aria-hidden className="pointer-events-none absolute -right-10 -top-6 h-[420px] w-auto text-cream/10" strokeWidth={1} />
      <div className="container-editorial relative grid gap-12 py-16 md:grid-cols-12 md:py-20">
        <div className="md:col-span-5">
          <Logo variant="cream" lockup className="w-[220px]" />
          <p className="mt-6 max-w-sm font-serif text-xl italic leading-snug text-cream/85">
            Hay historias que se leen. Otras se descorchan.
          </p>
          <SocialLinks className="mt-8" showHandle />
          <p className="mt-6 text-sm text-cream/70">
            <a className="underline-offset-4 hover:underline" href={`mailto:${siteConfig.email}`}>
              {siteConfig.email}
            </a>
          </p>
        </div>

        <nav aria-label="Pie de página" className="grid grid-cols-2 gap-8 text-sm md:col-span-7 md:grid-cols-3">
          <div>
            <p className="eyebrow mb-4 text-cream/60">Capítulos</p>
            <ul className="space-y-2.5">
              {primaryNav.slice(0, 5).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/90 underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div>
            <p className="eyebrow mb-4 text-cream/60">Universo</p>
            <ul className="space-y-2.5">
              {[...primaryNav.slice(5), secondaryNav[0]].map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/90 underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
          <div className="col-span-2 md:col-span-1">
            <p className="eyebrow mb-4 text-cream/60">Legal</p>
            <ul className="space-y-2.5">
              {secondaryNav.slice(1).map((item) => (
                <li key={item.href}>
                  <Link href={item.href} className="text-cream/90 underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        </nav>
      </div>

      <div className="border-t border-cream/15">
        <div className="container-editorial flex flex-col gap-3 py-6 text-xs leading-relaxed text-cream/70 md:flex-row md:items-center md:justify-between">
          <p>
            <strong className="font-semibold text-cream">Evite el abuso en el consumo de este producto.</strong> Contenido dirigido
            exclusivamente a personas mayores de {siteConfig.legalDrinkingAge} años.
          </p>
          <p>
            © {BUILD_YEAR} {siteConfig.legalName}. {siteConfig.tagline}.
          </p>
        </div>
      </div>
    </footer>
  );
}
