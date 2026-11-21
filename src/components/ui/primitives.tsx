import Link from "next/link";
import { ArrowUpRight } from "lucide-react";
import type { ComponentProps, ReactNode } from "react";
import { cn } from "@/lib/utils";

/* ───────────── Botón / enlace con estilo ───────────── */

type ButtonVariant = "primary" | "outline" | "ghost" | "light";

const buttonStyles: Record<ButtonVariant, string> = {
  primary: "bg-wine text-cream hover:bg-wine-deep",
  outline: "border border-wine/40 text-wine hover:border-wine hover:bg-wine hover:text-cream",
  ghost: "text-wine underline decoration-wine/30 underline-offset-[6px] hover:decoration-wine px-0!",
  light: "border border-cream/40 text-cream hover:bg-cream hover:text-wine",
};

export function ButtonLink({
  href,
  children,
  variant = "primary",
  className,
  external,
  ...rest
}: { href: string; children: ReactNode; variant?: ButtonVariant; external?: boolean } & Omit<ComponentProps<typeof Link>, "href">) {
  const cls = cn(
    "group inline-flex items-center gap-2 rounded-full px-6 py-3 text-sm font-semibold tracking-wide transition-colors duration-300",
    buttonStyles[variant],
    className,
  );
  const icon = (
    <ArrowUpRight
      aria-hidden
      className="size-4 transition-transform duration-500 ease-[var(--ease-editorial)] group-hover:-translate-y-0.5 group-hover:translate-x-0.5"
    />
  );
  if (external) {
    return (
      <a href={href} className={cls} target="_blank" rel="noopener noreferrer">
        {children}
        {icon}
        <span className="sr-only"> (se abre en una pestaña nueva)</span>
      </a>
    );
  }
  return (
    <Link href={href} className={cls} {...rest}>
      {children}
      {icon}
    </Link>
  );
}

/* ───────────── Encabezados editoriales ───────────── */

export function Eyebrow({ children, className }: { children: ReactNode; className?: string }) {
  // Si se pasa un color propio (p. ej. en fondos oscuros) sustituye al terracota.
  const hasColor = /(^|\s)text-(?!\[|xs|sm|base|lg|xl|\d)/.test(className ?? "");
  return <p className={cn("eyebrow", !hasColor && "text-terracotta-ink", className)}>{children}</p>;
}

export function SectionHeading({
  eyebrow,
  title,
  intro,
  align = "left",
  as: Tag = "h2",
  className,
  id,
  light,
}: {
  eyebrow?: string;
  title: ReactNode;
  intro?: ReactNode;
  align?: "left" | "center";
  as?: "h1" | "h2" | "h3";
  className?: string;
  id?: string;
  light?: boolean;
}) {
  return (
    <div className={cn(align === "center" && "mx-auto text-center", "max-w-3xl", className)} data-reveal>
      {eyebrow && <Eyebrow className={light ? "text-cream/70" : undefined}>{eyebrow}</Eyebrow>}
      <Tag id={id} className={cn("display mt-4 text-[clamp(2.1rem,5vw,3.9rem)]", light ? "text-cream" : "text-wine")}>
        {title}
      </Tag>
      {intro && <div className={cn("mt-6 text-lg leading-relaxed", light ? "text-cream/80" : "text-ink-soft")}>{intro}</div>}
    </div>
  );
}

/** Separador editorial con ornamento central. */
export function Ornament({ className, label = "❦" }: { className?: string; label?: string }) {
  return (
    <div className={cn("rule-ornament", className)} aria-hidden>
      <span className="font-serif text-lg">{label}</span>
    </div>
  );
}

/* ───────────── Encabezado de página interior ───────────── */

export function PageHero({
  chapter,
  eyebrow,
  title,
  intro,
  children,
  aside,
}: {
  chapter: string;
  eyebrow: string;
  title: ReactNode;
  intro?: ReactNode;
  children?: ReactNode;
  aside?: ReactNode;
}) {
  return (
    <header className="relative overflow-hidden pt-[calc(var(--header-h)+3.5rem)] pb-14 md:pt-[calc(var(--header-h)+5.5rem)] md:pb-20">
      <div className="container-editorial grid items-end gap-10 md:grid-cols-12">
        <div className="md:col-span-8">
          <div className="flex items-center gap-4" data-reveal>
            <span className="font-serif text-5xl leading-none text-terracotta md:text-6xl">{chapter}</span>
            <span className="h-px w-12 bg-terracotta/50" aria-hidden />
            <p className="eyebrow text-terracotta-ink">{eyebrow}</p>
          </div>
          <h1 className="display mt-6 text-[clamp(2.6rem,7vw,6rem)] text-wine" data-reveal>
            {title}
          </h1>
          {intro && (
            <div className="mt-7 max-w-2xl text-lg leading-relaxed text-ink-soft md:text-xl" data-reveal>
              {intro}
            </div>
          )}
          {children}
        </div>
        {aside && <div className="md:col-span-4">{aside}</div>}
      </div>
    </header>
  );
}

/* ───────────── Marcador de recurso pendiente ───────────── */

/**
 * Espacio reservado elegante para fotografías o datos que la marca aún debe
 * proporcionar. Lleva la etiqueta visible "Recurso pendiente" para que
 * nunca se confunda con contenido final.
 */
export function PendingAsset({ label, note, className, ratio = "aspect-[4/5]" }: { label: string; note?: string; className?: string; ratio?: string }) {
  return (
    <div
      className={cn(
        "relative flex flex-col items-center justify-center gap-3 overflow-hidden rounded-sm border border-dashed border-wine/30 bg-cream-deep/60 p-6 text-center",
        ratio,
        className,
      )}
      role="img"
      aria-label={`Recurso pendiente: ${label}`}
    >
      <svg viewBox="0 0 60 60" className="w-12 text-wine/40" fill="none" stroke="currentColor" strokeWidth={1.2} aria-hidden>
        <rect x="6" y="10" width="48" height="40" rx="2" />
        <circle cx="22" cy="24" r="5" />
        <path d="M6 42 L22 30 L34 40 L42 34 L54 44" />
      </svg>
      <p className="eyebrow text-[0.62rem] text-wine/70">Recurso pendiente</p>
      <p className="max-w-[16rem] font-serif text-lg italic leading-snug text-ink-soft">{label}</p>
      {note && <p className="max-w-[18rem] text-xs leading-relaxed text-ink-soft/80">{note}</p>}
    </div>
  );
}

/** Lista de especificaciones (dt/dd) que omite los campos vacíos. */
export function SpecList({ items, className }: { items: { label: string; value?: ReactNode }[]; className?: string }) {
  const visible = items.filter((i) => i.value !== undefined && i.value !== null && i.value !== "");
  return (
    <dl className={cn("divide-y divide-wine/12 border-y border-wine/12", className)}>
      {visible.map((i) => (
        <div key={i.label} className="grid grid-cols-[minmax(7rem,38%)_1fr] gap-4 py-3.5">
          <dt className="eyebrow pt-0.5 text-[0.66rem] text-olive-ink">{i.label}</dt>
          <dd className="text-[0.95rem] text-ink">{i.value}</dd>
        </div>
      ))}
    </dl>
  );
}

/** Marcador de carga para páginas de detalle (mientras se transmite su contenido). */
export function DetailFallback() {
  return (
    <div className="flex min-h-[80svh] flex-col items-center justify-center gap-4 pt-[var(--header-h)]" role="status">
      <span aria-hidden className="animate-pulse font-serif text-4xl text-terracotta">
        ❦
      </span>
      <span className="eyebrow text-ink-soft">Abriendo el capítulo…</span>
    </div>
  );
}
