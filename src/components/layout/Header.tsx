"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";
import { Menu, X } from "lucide-react";
import { AnimatePresence, motion, useReducedMotion } from "motion/react";
import { useCallback, useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { SocialLinks } from "@/components/ui/SocialIcons";
import { primaryNav, secondaryNav } from "@/lib/site";
import { cn } from "@/lib/utils";

function isActive(pathname: string, href: string) {
  return href === "/" ? pathname === "/" : pathname === href || pathname.startsWith(`${href}/`);
}

export function Header() {
  const pathname = usePathname();
  const [scrolled, setScrolled] = useState(false);
  // El menú queda "abierto" solo para la ruta en la que se abrió: al navegar se cierra solo.
  const [openOn, setOpenOn] = useState<string | null>(null);
  const open = openOn === pathname;
  const setOpen = (v: boolean | ((o: boolean) => boolean)) => {
    const next = typeof v === "function" ? v(open) : v;
    setOpenOn(next ? pathname : null);
  };
  const closeMenu = useCallback(() => setOpenOn(null), []);
  const isHome = pathname === "/";
  const solid = scrolled || !isHome || open;

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-40 h-[var(--header-h)] transition-[background-color,box-shadow,backdrop-filter] duration-500",
        solid ? "bg-cream/92 shadow-[0_1px_0_rgba(83,44,59,0.12)] backdrop-blur-md" : "bg-transparent",
      )}
    >
      <a
        href="#contenido"
        className="sr-only focus:not-sr-only focus:absolute focus:left-4 focus:top-3 focus:z-50 focus:rounded focus:bg-wine focus:px-4 focus:py-2 focus:text-cream"
      >
        Saltar al contenido
      </a>
      <div className="container-editorial flex h-full items-center justify-between gap-6">
        <Link href="/" className="relative z-50 shrink-0" aria-label="Sip Güain, ir al inicio">
          <Logo priority className="w-[118px] md:w-[136px]" />
        </Link>

        <nav aria-label="Principal" className="hidden lg:block">
          <ul className="flex items-center gap-1 xl:gap-2">
            {primaryNav.slice(1).map((item) => {
              const active = isActive(pathname, item.href);
              return (
                <li key={item.href}>
                  <Link
                    href={item.href}
                    aria-current={active ? "page" : undefined}
                    className={cn(
                      "group relative px-2.5 py-2 text-[0.8rem] font-medium tracking-wide transition-colors xl:px-3",
                      active ? "text-wine" : "text-ink hover:text-wine",
                    )}
                  >
                    {item.label}
                    <span
                      aria-hidden
                      className={cn(
                        "absolute inset-x-2.5 -bottom-0.5 h-px origin-left bg-wine transition-transform duration-500 ease-[var(--ease-editorial)] xl:inset-x-3",
                        active ? "scale-x-100" : "scale-x-0 group-hover:scale-x-100",
                      )}
                    />
                  </Link>
                </li>
              );
            })}
          </ul>
        </nav>

        <button
          type="button"
          className="relative z-50 inline-flex items-center gap-2 rounded-full border border-wine/30 px-4 py-2 text-xs font-semibold tracking-[0.18em] text-wine uppercase lg:hidden"
          aria-expanded={open}
          aria-controls="menu-movil"
          onClick={() => setOpen((o) => !o)}
        >
          {open ? <X className="size-4" aria-hidden /> : <Menu className="size-4" aria-hidden />}
          {open ? "Cerrar" : "Menú"}
        </button>
      </div>
    </header>
    {/* Fuera del <header>: su backdrop-filter crearía un bloque contenedor para `fixed`. */}
    <MobileMenu open={open} onClose={closeMenu} pathname={pathname} />
    </>
  );
}

function MobileMenu({ open, onClose, pathname }: { open: boolean; onClose: () => void; pathname: string }) {
  const panelRef = useRef<HTMLDivElement>(null);
  const reduce = useReducedMotion();

  useEffect(() => {
    if (!open) return;
    const prev = document.body.style.overflow;
    document.body.style.overflow = "hidden";
    const first = panelRef.current?.querySelector<HTMLElement>("a,button");
    first?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
      if (e.key === "Tab" && panelRef.current) {
        const items = panelRef.current.querySelectorAll<HTMLElement>("a,button");
        const firstEl = items[0];
        const lastEl = items[items.length - 1];
        if (e.shiftKey && document.activeElement === firstEl) {
          e.preventDefault();
          lastEl.focus();
        } else if (!e.shiftKey && document.activeElement === lastEl) {
          e.preventDefault();
          firstEl.focus();
        }
      }
    };
    document.addEventListener("keydown", onKey);
    return () => {
      document.body.style.overflow = prev;
      document.removeEventListener("keydown", onKey);
    };
  }, [open, onClose]);

  return (
    <AnimatePresence>
      {open && (
        <motion.div
          id="menu-movil"
          ref={panelRef}
          role="dialog"
          aria-modal="true"
          aria-label="Menú de navegación"
          className="fixed inset-0 z-30 flex flex-col overflow-y-auto bg-cream pt-[var(--header-h)] lg:hidden"
          initial={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          animate={reduce ? { opacity: 1 } : { clipPath: "inset(0 0 0% 0)" }}
          exit={reduce ? { opacity: 0 } : { clipPath: "inset(0 0 100% 0)" }}
          transition={{ duration: 0.55, ease: [0.65, 0, 0.35, 1] }}
        >
          <nav aria-label="Principal (móvil)" className="container-editorial flex-1 py-8">
            <ol className="space-y-1">
              {primaryNav.map((item, i) => {
                const active = isActive(pathname, item.href);
                return (
                  <motion.li
                    key={item.href}
                    initial={reduce ? false : { opacity: 0, y: 16 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.15 + i * 0.04, duration: 0.5 }}
                  >
                    <Link
                      href={item.href}
                      onClick={onClose}
                      aria-current={active ? "page" : undefined}
                      className={cn(
                        "flex items-baseline gap-4 border-b border-wine/10 py-3 font-serif text-[clamp(1.7rem,7vw,2.4rem)] leading-tight",
                        active ? "text-wine italic" : "text-ink",
                      )}
                    >
                      <span className="eyebrow w-6 text-[0.65rem] text-terracotta-ink not-italic">{String(i + 1).padStart(2, "0")}</span>
                      {item.label}
                    </Link>
                  </motion.li>
                );
              })}
            </ol>
            <ul className="mt-8 flex flex-wrap gap-x-6 gap-y-2 text-sm text-ink-soft">
              {secondaryNav.map((item) => (
                <li key={item.href}>
                  <Link href={item.href} onClick={onClose} className="underline-offset-4 hover:underline">
                    {item.label}
                  </Link>
                </li>
              ))}
            </ul>
            <SocialLinks className="mt-8 text-wine" showHandle />
          </nav>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
