"use client";

/**
 * Verificación de mayoría de edad.
 *
 * - Se renderiza en el servidor y se oculta antes del primer pintado si ya se
 *   confirmó (script inline en <head> → html[data-age-ok]). Sin parpadeos.
 * - Es una autodeclaración: NO constituye una garantía de cumplimiento legal.
 *   La marca debe validar con asesoría legal los requisitos aplicables.
 */
import Link from "next/link";
import { useEffect, useRef, useState } from "react";
import { Logo } from "@/components/ui/Logo";
import { Monarch } from "@/components/illustrations/Botanicals";
import { siteConfig } from "@/lib/site";

export const AGE_KEY = "sg-age-ok";

/** Script que se ejecuta antes de pintar (ver layout.tsx). */
export const ageGateBootScript = `document.documentElement.classList.add('js');try{if(localStorage.getItem('${AGE_KEY}')==='1'){document.documentElement.setAttribute('data-age-ok','')}}catch(e){}`;

export function AgeGate() {
  const [declined, setDeclined] = useState(false);
  const dialogRef = useRef<HTMLDivElement>(null);
  const confirmRef = useRef<HTMLButtonElement>(null);

  useEffect(() => {
    if (document.documentElement.hasAttribute("data-age-ok")) return;
    confirmRef.current?.focus();
    const onKey = (e: KeyboardEvent) => {
      if (e.key !== "Tab" || !dialogRef.current) return;
      if (document.documentElement.hasAttribute("data-age-ok")) return;
      const items = dialogRef.current.querySelectorAll<HTMLElement>("a,button");
      const first = items[0];
      const last = items[items.length - 1];
      if (!dialogRef.current.contains(document.activeElement)) {
        e.preventDefault();
        first.focus();
      } else if (e.shiftKey && document.activeElement === first) {
        e.preventDefault();
        last.focus();
      } else if (!e.shiftKey && document.activeElement === last) {
        e.preventDefault();
        first.focus();
      }
    };
    document.addEventListener("keydown", onKey);
    return () => document.removeEventListener("keydown", onKey);
  }, []);

  const confirm = () => {
    try {
      localStorage.setItem(AGE_KEY, "1");
    } catch {
      /* almacenamiento no disponible: se confirma solo para esta visita */
    }
    document.documentElement.setAttribute("data-age-ok", "");
  };

  return (
    <div className="age-gate fixed inset-0 z-[60] flex items-center justify-center bg-ink/55 p-4 backdrop-blur-sm">
      <div
        ref={dialogRef}
        role="dialog"
        aria-modal="true"
        aria-labelledby="age-title"
        aria-describedby="age-desc"
        className="relative w-full max-w-md overflow-hidden rounded-sm bg-cream px-7 py-10 text-center shadow-2xl [background-image:var(--paper-grain)] sm:px-10"
      >
        <Monarch className="absolute -right-3 -top-2 w-16 rotate-12 opacity-90" />
        <Logo className="mx-auto w-[150px]" />
        {!declined ? (
          <>
            <h2 id="age-title" className="display mt-8 text-3xl text-wine">
              Antes de abrir el libro…
            </h2>
            <p id="age-desc" className="mt-4 text-sm leading-relaxed text-ink-soft">
              Este sitio contiene información sobre bebidas alcohólicas. ¿Tienes {siteConfig.legalDrinkingAge} años o más?
            </p>
            <div className="mt-8 flex flex-col gap-3 sm:flex-row sm:justify-center">
              <button
                ref={confirmRef}
                type="button"
                onClick={confirm}
                className="rounded-full bg-wine px-6 py-3 text-sm font-semibold text-cream transition-colors hover:bg-wine-deep"
              >
                Sí, soy mayor de edad
              </button>
              <button
                type="button"
                onClick={() => setDeclined(true)}
                className="rounded-full border border-wine/40 px-6 py-3 text-sm font-semibold text-wine transition-colors hover:border-wine"
              >
                No
              </button>
            </div>
            <p className="mt-6 text-[0.7rem] leading-relaxed text-ink-soft/80">
              Al continuar aceptas nuestro{" "}
              <Link href="/aviso-de-privacidad" className="underline underline-offset-2">
                aviso de privacidad
              </Link>
              . Evite el abuso en el consumo de este producto.
            </p>
          </>
        ) : (
          <>
            <h2 id="age-title" className="display mt-8 text-3xl text-wine">
              Esta historia te espera
            </h2>
            <p id="age-desc" className="mt-4 text-sm leading-relaxed text-ink-soft">
              El contenido de Sip Güain está dirigido a personas mayores de {siteConfig.legalDrinkingAge} años. Gracias por tu honestidad.
            </p>
            <button
              type="button"
              onClick={() => setDeclined(false)}
              className="mt-8 rounded-full border border-wine/40 px-6 py-3 text-sm font-semibold text-wine"
            >
              Volver
            </button>
          </>
        )}
      </div>
    </div>
  );
}
