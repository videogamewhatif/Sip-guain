import Link from "next/link";
import { breadcrumbJsonLd, jsonLd } from "@/lib/seo";

/** Migas de pan visibles + datos estructurados BreadcrumbList. */
export function Breadcrumbs({ items }: { items: { name: string; path: string }[] }) {
  const all = [{ name: "Inicio", path: "/" }, ...items];
  return (
    <>
      <nav aria-label="Ruta de navegación" className="container-editorial pt-[calc(var(--header-h)+1.25rem)]">
        <ol className="flex flex-wrap items-center gap-2 text-xs text-ink-soft">
          {all.map((item, i) => {
            const last = i === all.length - 1;
            return (
              <li key={item.path} className="flex items-center gap-2">
                {last ? (
                  <span aria-current="page" className="text-wine">
                    {item.name}
                  </span>
                ) : (
                  <Link href={item.path} className="underline-offset-4 hover:text-wine hover:underline">
                    {item.name}
                  </Link>
                )}
                {!last && <span aria-hidden>/</span>}
              </li>
            );
          })}
        </ol>
      </nav>
      <script type="application/ld+json" dangerouslySetInnerHTML={jsonLd(breadcrumbJsonLd(all))} />
    </>
  );
}
