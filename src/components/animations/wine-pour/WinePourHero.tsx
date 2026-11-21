"use client";

/**
 * Hero cinematográfico de la Home: una botella real de Sip Güain sirve vino
 * en una copa, sincronizado con el scroll.
 *
 * Arquitectura:
 *  - Sección alta + contenedor `sticky` de 100svh (no bloquea el scroll).
 *  - GSAP ScrollTrigger (scrub) produce un progreso suavizado 0 → 1 que
 *    alimenta a la vez los textos (timeline) y la escena (ref compartida).
 *  - Renderizado progresivo: póster SVG inmediato → escena WebGL (carga
 *    diferida) con fundido cruzado. Sin WebGL: el SVG sigue animado.
 *  - `prefers-reduced-motion`: composición estática y contenido directo.
 */
import dynamic from "next/dynamic";
import { ChevronDown } from "lucide-react";
import { Component, type ReactNode, useEffect, useRef, useState } from "react";
import { FlowerSprig, Monarch, VineBranch } from "@/components/illustrations/Botanicals";
import { usePrefersReducedMotion } from "@/hooks/useMediaQuery";
import { useRenderCapability } from "@/hooks/useRenderCapability";
import { gsap, useGSAP } from "@/lib/gsap";
import { STAGES } from "@/lib/pour-timeline";
import { cn } from "@/lib/utils";
import WinePourSvg from "./WinePourSvg";

const WinePourScene = dynamic(() => import("./WinePourScene"), { ssr: false });

const BOTTLE_SRC = "/animations/wine-pouring/bottle-malbec.webp";
const ROMAN = ["I", "II", "III", "IV", "V"];

class SceneBoundary extends Component<{ onError: () => void; children: ReactNode }, { failed: boolean }> {
  state = { failed: false };
  static getDerivedStateFromError() {
    return { failed: true };
  }
  componentDidCatch() {
    this.props.onError();
  }
  render() {
    return this.state.failed ? null : this.props.children;
  }
}

export function WinePourHero({ nextId }: { nextId: string }) {
  const sectionRef = useRef<HTMLElement>(null);
  const progressRef = useRef(0);
  const stageLabelRef = useRef<HTMLSpanElement>(null);
  const stageNumRef = useRef<HTMLSpanElement>(null);
  const reduced = usePrefersReducedMotion();
  const cap = useRenderCapability();
  const [load3D, setLoad3D] = useState(false);
  const [glReady, setGlReady] = useState(false);
  const [glFailed, setGlFailed] = useState(false);
  const [inView, setInView] = useState(true);

  const useWebGL = !reduced && !glFailed && cap.status === "webgl";
  const lowPower = cap.status === "webgl" && cap.lowPower;

  // Carga diferida del motor 3D: tras el primer pintado y en tiempo ocioso.
  useEffect(() => {
    if (!useWebGL) return;
    const hasIdle = typeof window.requestIdleCallback === "function";
    const id = hasIdle ? window.requestIdleCallback(() => setLoad3D(true), { timeout: 1200 }) : window.setTimeout(() => setLoad3D(true), 300);
    return () => (hasIdle ? window.cancelIdleCallback(id) : window.clearTimeout(id));
  }, [useWebGL]);

  // Pausar el render cuando la sección sale de pantalla.
  useEffect(() => {
    const el = sectionRef.current;
    if (!el) return;
    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), { rootMargin: "100px" });
    io.observe(el);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      if (reduced) return;
      const proxy = { p: progressRef.current };
      let lastStage = 0;
      const tl = gsap.timeline({
        defaults: { ease: "none" },
        scrollTrigger: {
          trigger: sectionRef.current,
          start: "top top",
          end: "bottom bottom",
          scrub: 0.6,
          invalidateOnRefresh: true,
        },
      });

      tl.to(
        proxy,
        {
          p: 1,
          duration: 1,
          onUpdate: () => {
            progressRef.current = proxy.p;
            const stage = STAGES.findIndex((s) => proxy.p < s.to || s.id === 5);
            if (stage !== lastStage) {
              lastStage = stage;
              if (stageLabelRef.current) stageLabelRef.current.textContent = STAGES[stage].label;
              if (stageNumRef.current) stageNumRef.current.textContent = ROMAN[stage];
              sectionRef.current?.setAttribute("data-stage", String(stage + 1));
            }
          },
        },
        0,
      );

      // Etapa 1 → 2: el título se retira; las botánicas se abren y se atenúan.
      tl.to(".hero-cue", { autoAlpha: 0, duration: 0.05 }, 0.03)
        .to(".hero-subtitle", { autoAlpha: 0, y: -16, duration: 0.07 }, 0.08)
        .to(".hero-intro", { autoAlpha: 0, y: -48, duration: 0.09 }, 0.11)
        .fromTo(".hero-botanical-l", { x: 0, rotate: 0 }, { x: -40, rotate: -6, duration: 0.3 }, 0)
        .fromTo(".hero-botanical-r", { x: 0, rotate: 0 }, { x: 40, rotate: 6, duration: 0.3 }, 0)
        .to(".hero-botanical-l, .hero-botanical-r", { opacity: 0.3, duration: 0.15 }, 0.2)
        // Etapa 3: una línea editorial acompaña el vertido.
        .fromTo(".hero-pour-caption", { autoAlpha: 0, y: 20 }, { autoAlpha: 1, y: 0, duration: 0.06 }, 0.4)
        .to(".hero-pour-caption", { autoAlpha: 0, y: -12, duration: 0.05 }, 0.6)
        // Etapa 5: la escena se vuelve la primera página editorial.
        .to(".hero-botanical-r", { opacity: 1, duration: 0.1 }, 0.86)
        .fromTo(".hero-outro-line", { autoAlpha: 0, y: 36 }, { autoAlpha: 1, y: 0, duration: 0.06, stagger: 0.025 }, 0.865)
        .to(".hero-skip", { autoAlpha: 0, duration: 0.04 }, 0.9)
        .fromTo(".hero-progress-fill", { scaleY: 0 }, { scaleY: 1, duration: 1 }, 0);
    },
    { scope: sectionRef, dependencies: [reduced] },
  );

  /* ───────────── Composición estática (movimiento reducido) ───────────── */
  if (reduced) {
    return (
      <section ref={sectionRef} aria-labelledby="hero-title" className="relative overflow-hidden pt-[var(--header-h)]">
        <div className="container-editorial grid min-h-[calc(100svh-var(--header-h))] items-center gap-8 py-12 md:grid-cols-2">
          <div>
            <p className="eyebrow text-terracotta-ink">Maridaje de vino con letras</p>
            <h1 id="hero-title" className="display mt-5 text-[clamp(2.6rem,6vw,5rem)] text-wine">
              Toda gran historia comienza con una copa
            </h1>
            <p className="mt-6 font-serif text-2xl italic text-ink-soft">Cada etiqueta es una historia, cada copa un capítulo.</p>
            <p className="eyebrow mt-4 text-olive-ink">Bienvenido al universo Sip Güain</p>
            <a href={`#${nextId}`} className="mt-10 inline-flex items-center gap-2 border-b border-wine pb-1 text-sm font-semibold text-wine">
              Continuar <ChevronDown className="size-4" aria-hidden />
            </a>
          </div>
          <div className="relative aspect-[4/5] w-full">
            <WinePourSvg bottleSrc={BOTTLE_SRC} staticProgress={0.85} frameProgress={0} className="absolute inset-0 size-full" />
          </div>
        </div>
      </section>
    );
  }

  /* ───────────────────────── Experiencia con scroll ───────────────────────── */
  return (
    <section
      ref={sectionRef}
      aria-labelledby="hero-title"
      aria-describedby="hero-desc"
      data-stage="1"
      className="relative h-[480svh] md:h-[520svh]"
    >
      <p id="hero-desc" className="sr-only">
        Animación: una botella de Sip Güain se inclina y sirve vino tinto en una copa conforme se desplaza la página.
        Puedes saltarla con el enlace «Saltar introducción».
      </p>

      <div className="sticky top-0 h-svh w-full overflow-hidden">
        {/* Escena: póster SVG (inmediato) + WebGL (progresivo) */}
        <div className="absolute inset-0">
          <WinePourSvg
            bottleSrc={BOTTLE_SRC}
            progressRef={progressRef}
            animate={!glReady && inView}
            className={cn("absolute inset-0 size-full transition-opacity duration-700", glReady ? "opacity-0" : "opacity-100")}
          />
          {useWebGL && load3D && (
            <div className={cn("absolute inset-0 transition-opacity duration-700", glReady ? "opacity-100" : "opacity-0")}>
              <SceneBoundary onError={() => setGlFailed(true)}>
                <WinePourScene
                  progressRef={progressRef}
                  lowPower={lowPower}
                  bottleSrc={BOTTLE_SRC}
                  active={inView}
                  onReady={() => setGlReady(true)}
                />
              </SceneBoundary>
            </div>
          )}
          {/* Grano de papel por encima del lienzo para integrar la escena con la página */}
          <div aria-hidden className="pointer-events-none absolute inset-0 opacity-70 mix-blend-multiply [background-image:var(--paper-grain)]" />
          <div aria-hidden className="pointer-events-none absolute inset-0 bg-[radial-gradient(ellipse_at_center,transparent_55%,rgba(83,44,59,0.10))]" />
        </div>

        {/* Botánicas */}
        <div aria-hidden className="hero-botanical pointer-events-none absolute inset-0 text-olive">
          <VineBranch className="hero-botanical-l hero-draw absolute -left-6 bottom-[-4%] h-[34vh] w-auto opacity-80 md:bottom-[-4%] md:left-[1%] md:h-[30vh]" />
          <FlowerSprig className="hero-botanical-r hero-draw absolute -right-4 top-[14%] h-[26vh] w-auto text-terracotta opacity-80 md:right-[3%] md:h-[34vh]" />
          <Monarch flutter className="absolute right-[7%] top-[44%] w-8 animate-float-slow md:right-[18%] md:top-[22%] md:w-12" />
          <Monarch flutter className="absolute bottom-[18%] left-[30%] hidden w-7 animate-float-slow [animation-delay:-4s] md:block" />
        </div>

        {/* Etapa 1: título */}
        <div className="hero-intro absolute inset-x-0 top-[calc(var(--header-h)+1.5rem)] px-5 text-center md:inset-y-0 md:left-[7vw] md:right-auto md:flex md:max-w-[34rem] md:flex-col md:justify-center md:px-0 md:text-left">
          <p className="eyebrow hero-word text-terracotta-ink" style={{ ["--i" as string]: 0 }}>
            Maridaje de vino con letras
          </p>
          <h1 id="hero-title" className="display mt-4 text-[clamp(2.3rem,7.4vw,5.6rem)] text-wine">
            {"Toda gran historia comienza con una copa".split(" ").map((w, i) => (
              <span key={i} className="hero-word inline-block" style={{ ["--i" as string]: i + 1 }}>
                {w}&nbsp;
              </span>
            ))}
          </h1>
          <p className="hero-subtitle mt-5 text-base text-ink-soft md:text-lg">
            <span className="hero-word inline-block" style={{ ["--i" as string]: 9 }}>
              Desliza para descubrir nuestra esencia
            </span>
          </p>
        </div>

        {/* Indicador de scroll */}
        <div className="hero-cue absolute bottom-7 left-1/2 flex -translate-x-1/2 flex-col items-center gap-2 text-wine" aria-hidden>
          <span className="eyebrow text-[0.62rem]">Desliza</span>
          <span className="relative block h-12 w-px overflow-hidden bg-wine/20">
            <span className="absolute inset-x-0 top-0 h-1/2 animate-scroll-cue bg-wine" />
          </span>
        </div>

        {/* Etapa 3: línea editorial */}
        <p
          aria-hidden
          className="hero-pour-caption invisible absolute bottom-[12%] left-1/2 w-[90%] -translate-x-1/2 text-center font-serif text-xl italic text-wine md:bottom-auto md:left-[7vw] md:top-1/2 md:w-auto md:max-w-xs md:translate-x-0 md:text-left md:text-2xl"
        >
          …y la historia empieza a servirse.
        </p>

        {/* Etapa 5: bienvenida */}
        <div className="absolute inset-x-0 top-[calc(var(--header-h)+1.25rem)] px-5 text-center md:inset-y-0 md:left-[7vw] md:right-auto md:flex md:max-w-[36rem] md:flex-col md:justify-center md:px-0 md:text-left">
          <p className="hero-outro-line invisible eyebrow text-terracotta-ink">Capítulo uno</p>
          <p className="hero-outro-line invisible display mt-4 text-[clamp(1.9rem,5.6vw,4.2rem)] text-wine">
            Cada etiqueta es una historia, cada copa un capítulo.
          </p>
          <p className="hero-outro-line invisible mt-5 font-serif text-lg italic text-ink-soft md:text-xl">
            Bienvenido al universo Sip Güain
          </p>
        </div>

        {/* Capítulos (progreso de la animación) */}
        <div aria-hidden className="absolute right-5 top-1/2 hidden -translate-y-1/2 items-center gap-4 md:flex">
          <div className="text-right">
            <span ref={stageNumRef} className="block font-serif text-3xl text-wine">
              I
            </span>
            <span ref={stageLabelRef} className="eyebrow text-[0.6rem] text-ink-soft">
              Presentación
            </span>
          </div>
          <span className="relative block h-40 w-px bg-wine/15">
            <span className="hero-progress-fill absolute inset-0 origin-top scale-y-0 bg-wine" />
          </span>
        </div>

        <a
          href={`#${nextId}`}
          className="hero-skip absolute bottom-6 right-5 z-10 rounded-full border border-wine/30 bg-cream/80 px-4 py-2 text-xs font-semibold tracking-wide text-wine backdrop-blur transition-colors hover:bg-wine hover:text-cream"
        >
          Saltar introducción
        </a>
      </div>
    </section>
  );
}
